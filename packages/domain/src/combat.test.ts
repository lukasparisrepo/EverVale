import assert from "node:assert/strict";
import test from "node:test";
import { advanceCombat, triggerM1Wave } from "./combat.js";
import type { SimulationDefinitions, WorldState } from "./world.types.js";

const defs: SimulationDefinitions = {
  referenceCycleSeconds: 600,
  buildings: {},
  defenders: {
    town_warden: {
      id:"town_warden", side:"DEFENDER", hp:110, dps:7, armor:2, target:"ground", class:"infantry",
    },
    guard: {
      id:"guard", side:"DEFENDER", hp:150, dps:10, armor:5, target:"ground", class:"infantry",
    },
  },
  enemies: {
    nibbler: {
      id:"nibbler", side:"ENEMY", hp:45, dps:3, armor:0, target:"ground", class:"ground",
    },
    wobble_slime: {
      id:"wobble_slime", side:"ENEMY", hp:70, dps:4, armor:0, target:"ground", class:"ground",
    },
  },
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
  resources:{money:1200,moneyCap:5000,power:60,powerCap:120,water:60,waterCap:120,varum:0,varumCap:0,techPoints:0,techTier:0},
  society:{population:12,housingCapacity:12,happiness:80,growthProgress:0,workforce:9,assignedWorkers:0,educationCoverage:0,recreationCoverage:0,safety:0.5},
  buildings:[],
  roads:[],
  combat:null,
  events:[],
};

test("one large advance crosses warning into combat and resolves the M1 wave", () => {
  let n = 0;
  const started = triggerM1Wave(world, defs, (prefix) => `${prefix}-${++n}`);
  const resolved = advanceCombat(started, defs, 40);

  assert.equal(resolved.combat?.status, "RESOLVED");
  assert.ok(resolved.combat?.outcome === "COSTLY" || resolved.combat?.outcome === "BREACH" || resolved.combat?.outcome === "CLEAN");
});

test("warning-only advance preserves remaining warning time", () => {
  let n = 0;
  const started = triggerM1Wave(world, defs, (prefix) => `${prefix}-${++n}`);
  const next = advanceCombat(started, defs, 3);

  assert.equal(next.combat?.status, "WARNING");
  assert.equal(next.combat?.warningRemainingSeconds, 5);
});
