import assert from "node:assert/strict";
import test from "node:test";
import { placeBuilding } from "./construction.js";
import type { BuildingDefinition, SimulationDefinitions, WorldState } from "./world.types.js";

const base = {
  techTier:0,
  moneyCost:0,
  varumCost:0,
  buildCycles:1,
  workers:0,
  priority:0,
  moneyPerWorker:0,
  moneyCapAdd:0,
  powerProduction:0,
  powerCapAdd:0,
  powerUse:0,
  waterProduction:0,
  waterCapAdd:0,
  waterUse:0,
  varumProduction:0,
  varumCapAdd:0,
  techProduction:0,
  upkeep:0,
  housingAdd:0,
  educationCoverageAdd:0,
  recreationCoverageAdd:0,
  safetyAdd:0,
  combatSpawn:{},
  constructionSlotsAdd:0,
};

const building = (
  id: string,
  footprintCellsX: number,
  footprintCellsZ: number,
  extra: Partial<BuildingDefinition> = {},
): BuildingDefinition => ({
  id,
  ...base,
  footprintCellsX,
  footprintCellsZ,
  ...extra,
});

const defs: SimulationDefinitions = {
  referenceCycleSeconds:600,
  gridCellMeters:2,
  buildings:{
    town_center: building("town_center",4,4,{constructionSlotsAdd:1}),
    house_small: building("house_small",3,2,{moneyCost:120,housingAdd:4}),
  },
  defenders:{},
  enemies:{},
  blockers:{},
  props: {},
};

const world: WorldState = {
  worldId:"grid",
  ownerId:"owner",
  seed:1,
  revision:0,
  lifecycle:"ACTIVE",
  speed:1,
  simulationSeconds:0,
  lastSimulatedAt:new Date(0).toISOString(),
  resources:{money:1000,moneyCap:5000,power:60,powerCap:120,water:60,waterCap:120,varum:0,varumCap:0,techPoints:0,techTier:0},
  society:{population:12,housingCapacity:12,happiness:80,growthProgress:0,workforce:9,assignedWorkers:0,educationCoverage:0,recreationCoverage:0,safety:0.5,beauty:0},
  buildings:[{
    id:"tc",
    definitionId:"town_center",
    position:{x:0,y:0,z:0},
    rotationY:0,
    constructionState:"COMPLETE",
    constructionRemainingSeconds:0,
    workersAssigned:0,
    priority:0,
    condition:100,
    damageState:"HEALTHY",
    repairRemainingSeconds:0,
  }],
  roads:[{id:"road",type:"DIRT",from:{x:-20,y:0,z:4},to:{x:20,y:0,z:4}}],
  blockers:[],
  props:[],
  combat:null,
  events:[],
};

test("placement snaps to 2m grid and uses footprint rectangle collision", () => {
  assert.throws(
    () => placeBuilding(world, defs, {
      instanceId:"too-close",
      definitionId:"house_small",
      x:5.1,
      z:0.2,
    }),
    /PLACEMENT_COLLISION/,
  );

  const placed = placeBuilding(world, defs, {
    instanceId:"house",
    definitionId:"house_small",
    x:8.9,
    z:4.7,
  });

  const house = placed.buildings.at(-1);
  assert.deepEqual(house?.position, {x:8,y:0,z:4});
  assert.equal(house?.rotationY, 0);
});
