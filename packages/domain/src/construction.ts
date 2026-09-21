import type { BuildingInstance, SimulationDefinitions, WorldState } from "./world.types.js";

export interface PlaceBuildingInput {
  instanceId: string;
  definitionId: string;
  x: number;
  z: number;
  rotationY?: number;
}

function collides(buildings: BuildingInstance[], x: number, z: number): boolean {
  return buildings.some((b) => {
    const dx = b.position.x - x;
    const dz = b.position.z - z;
    return Math.hypot(dx, dz) < 5;
  });
}

function pointSegmentDistance(px: number, pz: number, ax: number, az: number, bx: number, bz: number): number {
  const vx = bx - ax;
  const vz = bz - az;
  const wx = px - ax;
  const wz = pz - az;
  const len2 = vx * vx + vz * vz;
  const t = len2 <= 0 ? 0 : Math.max(0, Math.min(1, (wx * vx + wz * vz) / len2));
  return Math.hypot(px - (ax + t * vx), pz - (az + t * vz));
}

function hasRoadAccess(world: WorldState, x: number, z: number): boolean {
  return world.roads.some((road) =>
    pointSegmentDistance(x, z, road.from.x, road.from.z, road.to.x, road.to.z) <= 10,
  );
}

export function placeBuilding(
  world: WorldState,
  definitions: SimulationDefinitions,
  input: PlaceBuildingInput,
): WorldState {
  const definition = definitions.buildings[input.definitionId];
  if (!definition) throw new Error("UNKNOWN_BUILDING");
  if (definition.techTier > world.resources.techTier) throw new Error("TECH_LOCKED");
  if (world.resources.money < definition.moneyCost) throw new Error("NOT_ENOUGH_MONEY");
  if (world.resources.varum < definition.varumCost) throw new Error("NOT_ENOUGH_VARUM");
  if (collides(world.buildings, input.x, input.z)) throw new Error("PLACEMENT_COLLISION");
  if (!hasRoadAccess(world, input.x, input.z)) throw new Error("NO_ROAD_ACCESS");

  const constructionSlots = world.buildings.reduce((sum, b) => {
    if (b.constructionState !== "COMPLETE" || b.damageState === "DISABLED") return sum;
    return sum + (definitions.buildings[b.definitionId]?.constructionSlotsAdd ?? 0);
  }, 0);
  const activeConstruction = world.buildings.filter((b) => b.constructionState === "BUILDING").length;
  if (activeConstruction >= Math.max(1, constructionSlots)) throw new Error("NO_CONSTRUCTION_SLOT");

  const instance: BuildingInstance = {
    id: input.instanceId,
    definitionId: input.definitionId,
    position: { x: input.x, y: 0, z: input.z },
    rotationY: input.rotationY ?? 0,
    constructionState: definition.buildCycles > 0 ? "BUILDING" : "COMPLETE",
    constructionRemainingSeconds: definition.buildCycles * definitions.referenceCycleSeconds,
    workersAssigned: 0,
    priority: definition.priority,
    condition: 100,
    damageState: "HEALTHY",
    repairRemainingSeconds: 0,
  };

  return {
    ...world,
    revision: world.revision + 1,
    resources: {
      ...world.resources,
      money: world.resources.money - definition.moneyCost,
      varum: world.resources.varum - definition.varumCost,
    },
    buildings: [...world.buildings, instance],
  };
}

export function advanceConstruction(world: WorldState, deltaSeconds: number): WorldState {
  let changed = false;
  const buildings = world.buildings.map((building) => {
    if (building.constructionState !== "BUILDING") return building;
    const remaining = Math.max(0, building.constructionRemainingSeconds - deltaSeconds);
    changed = changed || remaining !== building.constructionRemainingSeconds;
    return {
      ...building,
      constructionRemainingSeconds: remaining,
      constructionState: remaining <= 0 ? "COMPLETE" as const : "BUILDING" as const,
    };
  });

  return changed ? { ...world, buildings } : world;
}
