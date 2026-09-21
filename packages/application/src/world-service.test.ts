import assert from "node:assert/strict";
import test from "node:test";
import type { SimulationDefinitions, WorldState } from "@evervale/domain/world.types";
import { WorldService } from "./world-service.js";
import type { Clock, IdGenerator, WorldRepository } from "./ports.js";

class Repo implements WorldRepository {
  saveCalls = 0;
  constructor(public world: WorldState) {}
  async findByOwner(): Promise<WorldState | null> { return this.world; }
  async findById(): Promise<WorldState | null> { return this.world; }
  async create(world: WorldState): Promise<void> { this.world = world; }
  async save(world: WorldState, previousRevision: number): Promise<void> {
    assert.equal(this.world.revision, previousRevision);
    this.saveCalls += 1;
    this.world = world;
  }
}

class FakeClock implements Clock {
  constructor(public value: Date) {}
  now(): Date { return this.value; }
}

class Ids implements IdGenerator {
  private n = 0;
  next(prefix: string): string { this.n += 1; return `${prefix}-${this.n}`; }
}

const zero = {
  moneyCost: 0,
  varumCost: 0,
  buildCycles: 0,
  workers: 0,
  priority: 0,
  moneyPerWorker: 0,
  moneyCapAdd: 0,
  powerProduction: 0,
  powerCapAdd: 0,
  powerUse: 0,
  waterProduction: 0,
  waterCapAdd: 0,
  waterUse: 0,
  varumProduction: 0,
  varumCapAdd: 0,
  techProduction: 0,
  upkeep: 0,
  housingAdd: 0,
  educationCoverageAdd: 0,
  recreationCoverageAdd: 0,
  safetyAdd: 0,
  combatSpawn: {},
  constructionSlotsAdd: 0,
  footprintCellsX: 3,
  footprintCellsZ: 2,
};

const defs: SimulationDefinitions = {
  referenceCycleSeconds: 600,
  gridCellMeters: 2,
  buildings: {
    town_center: { id:"town_center", techTier:0, ...zero, moneyCapAdd:5000, constructionSlotsAdd:1 },
    house_small: { id:"house_small", techTier:0, ...zero, housingAdd:4 },
    power_plant: { id:"power_plant", techTier:0, ...zero, workers:2, priority:100, powerProduction:40, powerCapAdd:120 },
    water_plant: { id:"water_plant", techTier:0, ...zero, workers:2, priority:95, waterProduction:35, waterCapAdd:120, powerUse:4 },
    workshop: { id:"workshop", techTier:0, ...zero, workers:4, priority:80, moneyPerWorker:8, powerUse:4, waterUse:1, upkeep:3 },
  },
  defenders: {},
  enemies: {},
  blockers: {},
  props: {},
};

const building = (id: string, definitionId: string): WorldState["buildings"][number] => ({
  id,
  definitionId,
  position:{x:0,y:0,z:0},
  rotationY:0,
  constructionState:"COMPLETE",
  constructionRemainingSeconds:0,
  workersAssigned:0,
  priority:defs.buildings[definitionId]?.priority ?? 0,
  condition:100,
  damageState:"HEALTHY",
  repairRemainingSeconds:0,
});

test("command applies after elapsed time without self-inflicted revision conflict", async () => {
  const base = new Date("2026-09-21T12:00:00.000Z");
  const world: WorldState = {
    worldId:"world",
    ownerId:"owner",
    seed:1,
    revision:7,
    lifecycle:"ACTIVE",
    speed:1,
    simulationSeconds:0,
    lastSimulatedAt:base.toISOString(),
    resources:{money:1200,moneyCap:5000,power:60,powerCap:120,water:60,waterCap:120,varum:0,varumCap:0,techPoints:0,techTier:0},
    society:{population:12,housingCapacity:12,happiness:80,growthProgress:0,workforce:9,assignedWorkers:0,educationCoverage:0,recreationCoverage:0,safety:0.5,beauty:0},
    buildings:[
      building("tc","town_center"),
      building("h1","house_small"),
      building("h2","house_small"),
      building("h3","house_small"),
      building("p","power_plant"),
      building("w","water_plant"),
      building("shop","workshop"),
    ],
    roads:[{id:"r",type:"DIRT",from:{x:-20,y:0,z:0},to:{x:20,y:0,z:0}}],
    blockers:[],
  props:[],
  combat:null, events:[],
  };
  const repo = new Repo(world);
  const clock = new FakeClock(new Date(base.getTime() + 1500));
  const service = new WorldService({ repository:repo, definitions:defs, ids:new Ids(), clock });

  const next = await service.command("owner", {
    type:"SET_SPEED",
    commandId:"cmd",
    expectedRevision:7,
    payload:{speed:2},
  });

  assert.equal(next.speed, 2);
  assert.equal(next.revision, 8);
  assert.ok(next.simulationSeconds > 0);
});


test("read projection advances visible simulation without mutating persisted revision", async () => {
  const base = new Date("2026-09-21T12:00:00.000Z");
  const world: WorldState = {
    worldId:"world-read",
    ownerId:"owner-read",
    seed:2,
    revision:3,
    lifecycle:"ACTIVE",
    speed:1,
    simulationSeconds:0,
    lastSimulatedAt:base.toISOString(),
    resources:{money:1200,moneyCap:5000,power:60,powerCap:120,water:60,waterCap:120,varum:0,varumCap:0,techPoints:0,techTier:0},
    society:{population:12,housingCapacity:12,happiness:80,growthProgress:0,workforce:9,assignedWorkers:0,educationCoverage:0,recreationCoverage:0,safety:0.5,beauty:0},
    buildings:[
      building("tc","town_center"),
      building("h1","house_small"),
      building("h2","house_small"),
      building("h3","house_small"),
      building("p","power_plant"),
      building("w","water_plant"),
      building("shop","workshop"),
    ],
    roads:[{id:"r",type:"DIRT",from:{x:-20,y:0,z:0},to:{x:20,y:0,z:0}}],
    blockers:[], props:[], combat:null, events:[],
  };
  const repo = new Repo(world);
  const clock = new FakeClock(new Date(base.getTime() + 2000));
  const service = new WorldService({ repository:repo, definitions:defs, ids:new Ids(), clock });

  const projected = await service.getOrCreate("owner-read");

  assert.equal(projected.revision, 3);
  assert.ok(projected.simulationSeconds >= 2);
  assert.equal(repo.world.revision, 3);
  assert.equal(repo.world.simulationSeconds, 0);
  assert.equal(repo.saveCalls, 0);
});
