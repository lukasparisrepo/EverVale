import type { RoadSegment, WorldState } from "./world.types.js";

export interface DrawRoadInput {
  roadId: string;
  fromX: number;
  fromZ: number;
  toX: number;
  toZ: number;
}

const COST_PER_METER = 2;
const MAX_SEGMENT_METERS = 45;
const SNAP_METERS = 7;

function distanceToEndpoint(roads: RoadSegment[], x: number, z: number): number {
  let best = Number.POSITIVE_INFINITY;
  for (const road of roads) {
    best = Math.min(
      best,
      Math.hypot(road.from.x - x, road.from.z - z),
      Math.hypot(road.to.x - x, road.to.z - z),
    );
  }
  return best;
}

export function drawRoad(world: WorldState, input: DrawRoadInput): WorldState {
  const length = Math.hypot(input.toX - input.fromX, input.toZ - input.fromZ);
  if (length < 2) throw new Error("ROAD_TOO_SHORT");
  if (length > MAX_SEGMENT_METERS) throw new Error("ROAD_TOO_LONG");

  if (world.roads.length > 0 && distanceToEndpoint(world.roads, input.fromX, input.fromZ) > SNAP_METERS) {
    throw new Error("ROAD_NOT_CONNECTED");
  }

  const cost = Math.ceil(length * COST_PER_METER);
  if (world.resources.money < cost) throw new Error("NOT_ENOUGH_MONEY");

  const segment: RoadSegment = {
    id: input.roadId,
    type: "DIRT",
    from: { x: input.fromX, y: 0, z: input.fromZ },
    to: { x: input.toX, y: 0, z: input.toZ },
  };

  return {
    ...world,
    revision: world.revision + 1,
    resources: { ...world.resources, money: world.resources.money - cost },
    roads: [...world.roads, segment],
  };
}
