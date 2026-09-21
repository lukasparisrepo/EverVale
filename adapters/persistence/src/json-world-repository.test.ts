import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import type { WorldState } from "@evervale/domain/world.types";
import { JsonWorldRepository } from "./json-world-repository.js";

function world(): WorldState {
  return {
    worldId:"00000000-0000-4000-8000-000000000001",
    ownerId:"owner-json",
    seed:1,
    revision:0,
    lifecycle:"ACTIVE",
    speed:1,
    simulationSeconds:0,
    lastSimulatedAt:"2026-09-21T12:00:00.000Z",
    resources:{
      money:1200,moneyCap:5000,power:60,powerCap:120,
      water:60,waterCap:120,varum:0,varumCap:0,
      techPoints:0,techTier:0,
    },
    society:{
      population:12,housingCapacity:12,happiness:80,growthProgress:0,
      workforce:9,assignedWorkers:0,educationCoverage:0,
      recreationCoverage:0,safety:0.5,beauty:0,
    },
    buildings:[],
    roads:[],
    blockers:[],
    props:[],
    combat:null,
    events:[],
  };
}

test("JSON repository persists accepted command receipt across repository restart", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "evervale-json-repo-"));
  try {
    const first = new JsonWorldRepository(directory);
    const base = world();
    await first.create(base);

    const accepted = {
      ...base,
      revision:1,
      speed:2 as const,
    };

    await first.save(accepted, 0, {
      commandId:"11111111-1111-4111-8111-111111111111",
      ownerId:"owner-json",
      expectedRevision:0,
      commandType:"SET_SPEED",
      fingerprint:"fingerprint-v1",
    });

    const second = new JsonWorldRepository(directory);
    const receipt = await second.findAcceptedCommand(
      "11111111-1111-4111-8111-111111111111",
    );

    assert.ok(receipt);
    assert.equal(receipt.ownerId, "owner-json");
    assert.equal(receipt.expectedRevision, 0);
    assert.equal(receipt.commandType, "SET_SPEED");
    assert.equal(receipt.fingerprint, "fingerprint-v1");
    assert.equal(receipt.world.revision, 1);
    assert.equal(receipt.world.speed, 2);

    const loaded = await second.findById(base.worldId);
    assert.equal(loaded?.revision, 1);
    assert.equal(loaded?.speed, 2);
  } finally {
    await rm(directory, { recursive:true, force:true });
  }
});
