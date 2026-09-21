import type { BuildingInstance, SimulationDefinitions, WorldState } from "./world.types.js";

export interface PlaceBuildingInput {
  instanceId: string;
  definitionId: string;
  x: number;
  z: number;
  rotationY?: number;
}

function normalizedQuarterTurns(rotationY: number): number {
  return ((Math.round(rotationY / (Math.PI / 2)) % 4) + 4) % 4;
}

function footprintMeters(
  definitions: SimulationDefinitions,
  definitionId: string,
  rotationY: number,
): { width: number; depth: number } {
  const def = definitions.buildings[definitionId];
  if (!def) return { width: definitions.gridCellMeters, depth: definitions.gridCellMeters };
  const rotated = normalizedQuarterTurns(rotationY) % 2 === 1;
  const cellsX = rotated ? def.footprintCellsZ : def.footprintCellsX;
  const cellsZ = rotated ? def.footprintCellsX : def.footprintCellsZ;
  return {
    width: cellsX * definitions.gridCellMeters,
    depth: cellsZ * definitions.gridCellMeters,
  };
}

function rectanglesOverlap(
  ax: number, az: number, aw: number, ad: number,
  bx: number, bz: number, bw: number, bd: number,
): boolean {
  return Math.abs(ax - bx) < (aw + bw) / 2 && Math.abs(az - bz) < (ad + bd) / 2;
}

function collides(
  world: WorldState,
  definitions: SimulationDefinitions,
  definitionId: string,
  x: number,
  z: number,
  rotationY: number,
): boolean {
  const next = footprintMeters(definitions, definitionId, rotationY);
  return world.buildings.some((b) => {
    const existing = footprintMeters(definitions, b.definitionId, b.rotationY);
    return rectanglesOverlap(
      x, z, next.width, next.depth,
      b.position.x, b.position.z, existing.width, existing.depth,
    );
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

  const grid = definitions.gridCellMeters;
  const x = Math.round(input.x / grid) * grid;
  const z = Math.round(input.z / grid) * grid;
  const rotationY = normalizedQuarterTurns(input.rotationY ?? 0) * (Math.PI / 2);
  const footprint = footprintMeters(definitions, input.definitionId, rotationY);

  if (collides(world, definitions, input.definitionId, x, z, rotationY)) throw new Error("PLACEMENT_COLLISION");
  const blocked = world.blockers.some((blocker) => {
    const blockerDef = definitions.blockers[blocker.definitionId];
    const radius = blockerDef?.radius ?? 3;
    const dx = Math.max(0, Math.abs(blocker.position.x - x) - footprint.width / 2);
    const dz = Math.max(0, Math.abs(blocker.position.z - z) - footprint.depth / 2);
    return Math.hypot(dx, dz) < radius;
  });
  if (blocked) throw new Error("PLACEMENT_BLOCKED");
  if (!hasRoadAccess(world, x, z)) throw new Error("NO_ROAD_ACCESS");

  const constructionSlots = world.buildings.reduce((sum, b) => {
    if (b.constructionState !== "COMPLETE" || b.damageState === "DISABLED") return sum;
    return sum + (definitions.buildings[b.definitionId]?.constructionSlotsAdd ?? 0);
  }, 0);
  const activeConstruction = world.buildings.filter((b) => b.constructionState === "BUILDING").length;
  if (activeConstruction >= Math.max(1, constructionSlots)) throw new Error("NO_CONSTRUCTION_SLOT");

  const instance: BuildingInstance = {
    id: input.instanceId,
    definitionId: input.definitionId,
    position: { x, y: 0, z },
    rotationY,
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
