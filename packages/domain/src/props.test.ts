import assert from "node:assert/strict";
import test from "node:test";
import {
  beautyFromProps,
  deleteProp,
  moveProp,
  placeProp,
  rotateProp,
} from "./props.js";
import type { SimulationDefinitions, WorldState } from "./world.types.js";

const defs: SimulationDefinitions = {
  referenceCycleSeconds: 600,
  gridCellMeters: 2,
  buildings: {},
  defenders: {},
  enemies: {},
  blockers: {},
  props: {
    bench_wood: {
      id: "bench_wood",
      group: "street",
      sizeXMeters: 2,
      sizeZMeters: 0.8,
      snapMeters: 1,
      moneyCost: 25,
      decorClass: "activity_anchor",
      beauty: 0,
      activityAnchor: "sit",
    },
    flower_bed: {
      id: "flower_bed",
      group: "vegetation",
      sizeXMeters: 2,
      sizeZMeters: 1,
      snapMeters: 1,
      moneyCost: 22,
      decorClass: "beauty",
      beauty: 0.3,
    },
    fountain: {
      id: "fountain",
      group: "civic",
      sizeXMeters: 4,
      sizeZMeters: 4,
      snapMeters: 1,
      moneyCost: 180,
      decorClass: "beauty",
      beauty: 1.2,
      activityAnchor: "gather",
    },
  },
};

const world = (): WorldState => ({
  worldId: "props",
  ownerId: "owner",
  seed: 1,
  revision: 0,
  lifecycle: "ACTIVE",
  speed: 1,
  simulationSeconds: 0,
  lastSimulatedAt: new Date(0).toISOString(),
  resources: {
    money: 1000,
    moneyCap: 5000,
    power: 60,
    powerCap: 120,
    water: 60,
    waterCap: 120,
    varum: 0,
    varumCap: 0,
    techPoints: 0,
    techTier: 0,
  },
  society: {
    population: 12,
    housingCapacity: 12,
    happiness: 80,
    growthProgress: 0,
    workforce: 9,
    assignedWorkers: 0,
    educationCoverage: 0,
    recreationCoverage: 0,
    safety: 0.5,
    beauty: 0,
  },
  buildings: [],
  roads: [],
  blockers: [],
  props: [],
  combat: null,
  events: [],
});

test("Prop placement snaps to 1m and spends money", () => {
  const next = placeProp(world(), defs, {
    propId: "p1",
    definitionId: "bench_wood",
    x: 3.4,
    z: 7.7,
    rotationY: 0.1,
  });

  assert.deepEqual(next.props[0]?.position, { x: 3, y: 0, z: 8 });
  assert.equal(next.props[0]?.rotationY, 0);
  assert.equal(next.resources.money, 975);
  assert.equal(next.revision, 1);
});

test("Prop rotation normalizes to 45 degree steps and move/delete persist", () => {
  const placed = placeProp(world(), defs, {
    propId: "p1",
    definitionId: "bench_wood",
    x: 8,
    z: 8,
  });

  const rotated = rotateProp(placed, defs, "p1", Math.PI * 0.26);
  assert.equal(rotated.props[0]?.rotationY, Math.PI / 4);

  const moved = moveProp(rotated, defs, "p1", 11.6, -3.2);
  assert.deepEqual(moved.props[0]?.position, { x: 12, y: 0, z: -3 });

  const removed = deleteProp(moved, "p1");
  assert.equal(removed.props.length, 0);
});

test("Props collide with each other", () => {
  const placed = placeProp(world(), defs, {
    propId: "p1",
    definitionId: "bench_wood",
    x: 4,
    z: 4,
  });

  assert.throws(
    () =>
      placeProp(placed, defs, {
        propId: "p2",
        definitionId: "flower_bed",
        x: 4.5,
        z: 4,
      }),
    /PROP_COLLIDES_PROP/,
  );
});

test("Beauty uses diminishing returns and hard cap", () => {
  let current = world();

  for (let i = 0; i < 12; i += 1) {
    current = {
      ...current,
      props: [
        ...current.props,
        {
          id: `f-${i}`,
          definitionId: "fountain",
          position: { x: i * 6, y: 0, z: 20 },
          rotationY: 0,
        },
      ],
    };
  }

  const beauty = beautyFromProps(current, defs);
  assert.ok(beauty > 1.2);
  assert.ok(beauty <= 5);
});
