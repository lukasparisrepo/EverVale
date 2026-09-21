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
