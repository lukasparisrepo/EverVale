import { clamp } from "@evervale/shared-kernel/clamp";
import type { WorldState } from "./world.types.js";

export function queueRepair(world: WorldState, buildingId: string): WorldState {
  const building = world.buildings.find((b) => b.id === buildingId);
  if (!building) throw new Error("BUILDING_NOT_FOUND");
  if (building.damageState === "HEALTHY" || building.condition >= 100) throw new Error("REPAIR_NOT_NEEDED");
  if (building.damageState === "REPAIRING") throw new Error("REPAIR_ALREADY_QUEUED");

  const missing = Math.max(0, 100 - building.condition);
  const moneyCost = Math.max(20, Math.ceil(missing * 3));
  if (world.resources.money < moneyCost) throw new Error("NOT_ENOUGH_MONEY");

  const repairSeconds = 60 + missing * 4;

  return {
    ...world,
    revision: world.revision + 1,
    resources: {
      ...world.resources,
      money: world.resources.money - moneyCost,
    },
    buildings: world.buildings.map((b) =>
      b.id === buildingId
        ? { ...b, damageState: "REPAIRING" as const, repairRemainingSeconds: repairSeconds }
        : b,
    ),
  };
}

export function advanceRepairs(world: WorldState, deltaSeconds: number): WorldState {
  let changed = false;
  const buildings = world.buildings.map((building) => {
    if (building.damageState !== "REPAIRING") return building;
    const remaining = Math.max(0, (building.repairRemainingSeconds ?? 0) - deltaSeconds);
    changed = true;
    if (remaining <= 0) {
      return {
        ...building,
        condition: 100,
        damageState: "HEALTHY" as const,
        repairRemainingSeconds: 0,
      };
    }
    const total = Math.max(1, 60 + (100 - building.condition) * 4);
    const progress = 1 - remaining / total;
    const condition = clamp(building.condition + (100 - building.condition) * progress * 0.1, 0, 100);
    return { ...building, condition, repairRemainingSeconds: remaining };
  });
  return changed ? { ...world, buildings } : world;
}
