import { expect, test } from "@playwright/test";

const SERVER = "http://127.0.0.1:2567";
const HANDLE = "e2e-builder";

async function apiWorld(request: Parameters<typeof test>[0] extends never ? never : any, ownerId: string) {
  const response = await request.get(`${SERVER}/api/world`, {
    headers: { "x-evervale-owner": ownerId },
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function apiCommand(
  request: any,
  ownerId: string,
  type: string,
  payload: Record<string, unknown>,
) {
  const current = await apiWorld(request, ownerId);
  const response = await request.post(`${SERVER}/api/world/command`, {
    headers: {
      "content-type": "application/json",
      "x-evervale-owner": ownerId,
    },
    data: {
      type,
      commandId: crypto.randomUUID(),
      expectedRevision: current.world.revision,
      payload,
    },
  });
  return response;
}

test("M1 loop: login, authoritative build, persistence, offline catch-up, combat, repair", async ({ page, request }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
    console.log("M1_PAGE_ERROR", error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") console.log("M1_CONSOLE_ERROR", message.text());
  });

  await page.goto("/");
  await page.getByLabel("Builder name").fill(HANDLE);
  await page.getByRole("button", { name: "Enter the Vale" }).click();

  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.getByTestId("building-count")).toContainText("7");
  await expect(page.getByTestId("blocker-list")).toBeVisible();

  const worldView = page.locator(".world-view");
  await expect.poll(async () => Number(await worldView.getAttribute("data-frame-count"))).toBeGreaterThan(5);
  const drawCalls = Number(await worldView.getAttribute("data-draw-calls"));
  const triangles = Number(await worldView.getAttribute("data-triangles"));
  const citizens = Number(await worldView.getAttribute("data-citizens"));
  expect(drawCalls).toBeGreaterThan(0);
  expect(drawCalls).toBeLessThanOrEqual(450);
  expect(triangles).toBeGreaterThan(0);
  expect(triangles).toBeLessThanOrEqual(1_500_000);
  expect(citizens).toBeGreaterThan(0);
  expect(citizens).toBeLessThanOrEqual(30);
  console.log("M1_RENDER_METRICS", { drawCalls, triangles, citizens });

  // Build ghost must immediately show invalid placement over the occupied civic core.
  await page.getByRole("button", { name: /Hearth Cottage/i }).click();
  const canvasBox = await page.locator("canvas").boundingBox();
  expect(canvasBox).not.toBeNull();
  if (canvasBox) {
    await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
    await expect(page.locator(".world-view")).toHaveAttribute("data-placement-valid", "false");
  }
  await page.getByRole("button", { name: "Select" }).click();

  const ownerId = await page.evaluate(() => localStorage.getItem("evervale.owner"));
  expect(ownerId).toBe("dev:e2e-builder");

  const initial = await apiWorld(request, ownerId!);
  expect(initial.world.buildings).toHaveLength(7);
  expect(initial.world.blockers).toHaveLength(2);

  // Terrain blocker must participate in authoritative placement.
  const blockerPlacement = await apiCommand(request, ownerId!, "PLACE_BUILDING", {
    definitionId: "house_small",
    x: 29,
    z: 11,
  });
  expect(blockerPlacement.status()).toBe(400);
  expect((await blockerPlacement.json()).error).toBe("PLACEMENT_BLOCKED");

  // Clear action is visible in UI and persists as simulation work.
  const clearButton = page.getByTestId("blocker-list").getByRole("button", { name: "Clear" }).first();
  await clearButton.click();
  await expect(page.getByTestId("blocker-list")).toContainText(/s/);

  // Server must reject an isolated building.
  const rejected = await apiCommand(request, ownerId!, "PLACE_BUILDING", {
    definitionId: "house_small",
    x: 42,
    z: 42,
  });
  expect(rejected.status()).toBe(400);
  expect((await rejected.json()).error).toBe("NO_ROAD_ACCESS");

  // Extend the authoritative road graph, then place a house beside it.
  const road = await apiCommand(request, ownerId!, "DRAW_ROAD", {
    fromX: 24,
    fromZ: 2,
    toX: 36,
    toZ: 2,
  });
  expect(road.ok()).toBeTruthy();

  const placed = await apiCommand(request, ownerId!, "PLACE_BUILDING", {
    definitionId: "house_small",
    x: 31,
    z: 4,
  });
  expect(placed.ok()).toBeTruthy();

  await expect(page.getByTestId("building-count")).toContainText("8");

  // Browser reload must reconstruct the persisted world.
  await page.reload();
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.getByTestId("building-count")).toContainText("8");

  const beforeLogout = await apiWorld(request, ownerId!);
  const simBefore = beforeLogout.world.simulationSeconds as number;

  // No browser polling while logged out. Re-login must catch up elapsed time.
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.getByRole("button", { name: "Enter the Vale" })).toBeVisible();
  await page.waitForTimeout(1600);
  await page.getByLabel("Builder name").fill(HANDLE);
  await page.getByRole("button", { name: "Enter the Vale" }).click();
  await expect(page.locator("canvas")).toBeVisible();

  const afterLogin = await apiWorld(request, ownerId!);
  expect(afterLogin.world.simulationSeconds).toBeGreaterThan(simBefore + 1);

  // Accelerate only for the runtime proof, then trigger the M1 surprise wave through UI.
  await page.getByRole("button", { name: "4×" }).click();
  await page.getByRole("button", { name: "Test surprise wave" }).click();
  await expect(page.getByTestId("combat-status")).toBeVisible();
  await expect(page.getByTestId("event-summary")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("event-summary")).toContainText(/repelled|breached/i);

  // The reference M1 wave is intentionally costly enough to exercise aftermath + repair.
  const repairButton = page.getByRole("button", { name: "Repair" }).first();
  await expect(repairButton).toBeVisible();
  await repairButton.click();
  await expect(page.locator(".repair-list")).toContainText(/s$/);

  const persisted = await apiWorld(request, ownerId!);
  expect(persisted.world.events.some((event: { type: string }) => event.type === "COMBAT_RESOLVED")).toBeTruthy();
  expect(
    persisted.world.buildings.some((building: { damageState: string }) => building.damageState === "REPAIRING"),
  ).toBeTruthy();
  expect(pageErrors).toEqual([]);
});
