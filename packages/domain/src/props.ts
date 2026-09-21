import type {
  PropDefinition,
  PropInstance,
  SimulationDefinitions,
  WorldState,
} from "./world.types.js";

const snap = (value: number, size: number): number =>
  Math.round(value / size) * size;

const normalizeRotation = (rotationY: number): number => {
  const step = Math.PI / 4;
  const turns = Math.round(rotationY / step);
  const normalized = ((turns % 8) + 8) % 8;
  return normalized * step;
};

interface Rect {
  x: number;
  z: number;
  halfX: number;
  halfZ: number;
  angle: number;
}

function rectAxes(rect: Rect): Array<{x:number;z:number}> {
  const c = Math.cos(rect.angle);
  const s = Math.sin(rect.angle);
  return [
    { x: c, z: s },
    { x: -s, z: c },
  ];
}

function corners(rect: Rect): Array<{x:number;z:number}> {
  const c = Math.cos(rect.angle);
  const s = Math.sin(rect.angle);
  const local = [
    {x:-rect.halfX,z:-rect.halfZ},
    {x: rect.halfX,z:-rect.halfZ},
    {x: rect.halfX,z: rect.halfZ},
    {x:-rect.halfX,z: rect.halfZ},
  ];
  return local.map((p) => ({
    x: rect.x + p.x * c - p.z * s,
    z: rect.z + p.x * s + p.z * c,
  }));
}

function overlapOnAxis(a: Rect, b: Rect, axis: {x:number;z:number}): boolean {
  const pa = corners(a).map((p) => p.x * axis.x + p.z * axis.z);
  const pb = corners(b).map((p) => p.x * axis.x + p.z * axis.z);
  return Math.max(...pa) > Math.min(...pb) + 0.03 &&
    Math.max(...pb) > Math.min(...pa) + 0.03;
}

function rectanglesOverlap(a: Rect, b: Rect): boolean {
  return [...rectAxes(a), ...rectAxes(b)].every((axis) => overlapOnAxis(a, b, axis));
}

function propRect(def: PropDefinition, x: number, z: number, rotationY: number): Rect {
  return {
    x,
    z,
    halfX: def.sizeXMeters / 2,
    halfZ: def.sizeZMeters / 2,
    angle: rotationY,
  };
}

function buildingRect(
  definitions: SimulationDefinitions,
  building: WorldState["buildings"][number],
): Rect {
  const def = definitions.buildings[building.definitionId];
  const grid = definitions.gridCellMeters;
  const width = (def?.footprintCellsX ?? 3) * grid;
  const depth = (def?.footprintCellsZ ?? 2) * grid;
  return {
    x: building.position.x,
    z: building.position.z,
    halfX: width / 2,
    halfZ: depth / 2,
    angle: building.rotationY,
  };
}

function validatePlacement(
  world: WorldState,
  definitions: SimulationDefinitions,
  def: PropDefinition,
  x: number,
  z: number,
  rotationY: number,
  ignorePropId?: string,
): void {
  const rect = propRect(def, x, z, rotationY);

  if (world.buildings.some((building) => rectanglesOverlap(rect, buildingRect(definitions, building)))) {
    throw new Error("PROP_COLLIDES_BUILDING");
  }

  if (world.props.some((prop) => {
    if (prop.id === ignorePropId) return false;
    const otherDef = definitions.props[prop.definitionId];
    if (!otherDef) return false;
    return rectanglesOverlap(rect, propRect(otherDef, prop.position.x, prop.position.z, prop.rotationY));
  })) {
    throw new Error("PROP_COLLIDES_PROP");
  }

  const blocked = world.blockers.some((blocker) => {
    const blockerDef = definitions.blockers[blocker.definitionId];
    const radius = blockerDef?.radius ?? 3;
    const dx = Math.max(0, Math.abs(blocker.position.x - x) - def.sizeXMeters / 2);
    const dz = Math.max(0, Math.abs(blocker.position.z - z) - def.sizeZMeters / 2);
    return Math.hypot(dx, dz) < radius;
  });
  if (blocked) throw new Error("PROP_BLOCKED");
}

export interface PlacePropInput {
  propId: string;
  definitionId: string;
  x: number;
  z: number;
  rotationY?: number;
}

export function placeProp(
  world: WorldState,
  definitions: SimulationDefinitions,
  input: PlacePropInput,
): WorldState {
  const def = definitions.props[input.definitionId];
  if (!def) throw new Error("UNKNOWN_PROP");
  if (world.resources.money < def.moneyCost) throw new Error("NOT_ENOUGH_MONEY");

  const x = snap(input.x, def.snapMeters);
  const z = snap(input.z, def.snapMeters);
  const rotationY = normalizeRotation(input.rotationY ?? 0);
  validatePlacement(world, definitions, def, x, z, rotationY);

  const prop: PropInstance = {
    id: input.propId,
    definitionId: input.definitionId,
    position: { x, y: 0, z },
    rotationY,
  };

  return {
    ...world,
    revision: world.revision + 1,
    resources: {
      ...world.resources,
      money: world.resources.money - def.moneyCost,
    },
    props: [...world.props, prop],
  };
}

export function moveProp(
  world: WorldState,
  definitions: SimulationDefinitions,
  propId: string,
  xInput: number,
  zInput: number,
): WorldState {
  const prop = world.props.find((item) => item.id === propId);
  if (!prop) throw new Error("PROP_NOT_FOUND");
  const def = definitions.props[prop.definitionId];
  if (!def) throw new Error("UNKNOWN_PROP");

  const x = snap(xInput, def.snapMeters);
  const z = snap(zInput, def.snapMeters);
  validatePlacement(world, definitions, def, x, z, prop.rotationY, propId);

  return {
    ...world,
    revision: world.revision + 1,
    props: world.props.map((item) =>
      item.id === propId ? { ...item, position: { x, y: 0, z } } : item,
    ),
  };
}

export function rotateProp(
  world: WorldState,
  definitions: SimulationDefinitions,
  propId: string,
  rotationYInput: number,
): WorldState {
  const prop = world.props.find((item) => item.id === propId);
  if (!prop) throw new Error("PROP_NOT_FOUND");
  const def = definitions.props[prop.definitionId];
  if (!def) throw new Error("UNKNOWN_PROP");

  const rotationY = normalizeRotation(rotationYInput);
  validatePlacement(
    world,
    definitions,
    def,
    prop.position.x,
    prop.position.z,
    rotationY,
    propId,
  );

  return {
    ...world,
    revision: world.revision + 1,
    props: world.props.map((item) =>
      item.id === propId ? { ...item, rotationY } : item,
    ),
  };
}

export function deleteProp(world: WorldState, propId: string): WorldState {
  if (!world.props.some((item) => item.id === propId)) throw new Error("PROP_NOT_FOUND");
  return {
    ...world,
    revision: world.revision + 1,
    props: world.props.filter((item) => item.id !== propId),
  };
}

export function beautyFromProps(
  world: WorldState,
  definitions: SimulationDefinitions,
): number {
  let raw = 0;
  const counts = new Map<string, number>();

  for (const prop of world.props) {
    const def = definitions.props[prop.definitionId];
    if (!def || def.beauty <= 0) continue;
    const count = counts.get(def.id) ?? 0;
    const diminishing = 1 / (1 + count * 0.6);
    raw += def.beauty * diminishing;
    counts.set(def.id, count + 1);
  }

  return Math.min(5, raw);
}
