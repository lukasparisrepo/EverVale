import assert from "node:assert/strict";
import test from "node:test";
import { advanceBlockers, queueBlockerClear } from "./blockers.js";
import { placeBuilding } from "./construction.js";
import type { SimulationDefinitions, WorldState } from "./world.types.js";

const zeroBuilding = {
  id:"house_small",
  techTier:0,
  moneyCost:100,
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
  housingAdd:4,
  educationCoverageAdd:0,
  recreationCoverageAdd:0,
  safetyAdd:0,
  combatSpawn:{},
  constructionSlotsAdd: 0,
  footprintCellsX: 3,
  footprintCellsZ: 2,
};

const defs: SimulationDefinitions = {
  referenceCycleSeconds: 600,
  gridCellMeters: 2,
  buildings:{
    house_small: zeroBuilding,
    town_center:{...zeroBuilding,id:"town_center",moneyCost:0,constructionSlotsAdd:1},
  },
  defenders:{},
  enemies:{},
  blockers:{
    fallen_tree:{id:"fallen_tree",moneyCost:40,varumCost:0,clearCycles:1,techTier:0,radius:2.5},
  },
  props:{},
};

const world: WorldState = {
  worldId:"w",
  ownerId:"o",
  seed:1,
  revision:0,
  lifecycle:"ACTIVE",
  speed:1,
  simulationSeconds:0,
  lastSimulatedAt:new Date(0).toISOString(),
  resources:{money:500,moneyCap:5000,power:60,powerCap:120,water:60,waterCap:120,varum:0,varumCap:0,techPoints:0,techTier:0},
  society:{population:12,housingCapacity:12,happiness:80,growthProgress:0,workforce:9,assignedWorkers:0,educationCoverage:0,recreationCoverage:0,safety:0.5,beauty:0},
  buildings:[{
    id:"tc",definitionId:"town_center",position:{x:0,y:0,z:0},rotationY:0,
    constructionState:"COMPLETE",constructionRemainingSeconds:0,constructionTotalSeconds:0,workersAssigned:0,priority:0,
    condition:100,damageState:"HEALTHY",repairRemainingSeconds:0,
  }],
  roads:[{id:"r",type:"DIRT",from:{x:-20,y:0,z:0},to:{x:20,y:0,z:0}}],
  blockers:[{id:"b1",definitionId:"fallen_tree",position:{x:10,y:0,z:3},state:"BLOCKING",clearRemainingSeconds:0}],
  props:[],
  combat:null,
  events:[],
};

test("blocker prevents placement until clearing completes", () => {
  assert.throws(
    () => placeBuilding(world, defs, {instanceId:"h1",definitionId:"house_small",x:10,z:3}),
    /PLACEMENT_BLOCKED/,
  );

  const queued = queueBlockerClear(world, defs, "b1");
  assert.equal(queued.resources.money, 460);
  assert.equal(queued.blockers[0]?.state, "CLEARING");
  assert.equal(queued.blockers[0]?.clearRemainingSeconds, 600);

  const cleared = advanceBlockers(queued, 600);
  assert.equal(cleared.blockers.length, 0);

  const placed = placeBuilding(cleared, defs, {instanceId:"h1",definitionId:"house_small",x:10,z:3});
  assert.equal(placed.buildings.length, 2);
});
