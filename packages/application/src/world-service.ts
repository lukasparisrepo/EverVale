import { advanceWorld } from "@evervale/domain/advance-world";
import { queueBlockerClear } from "@evervale/domain/blockers";
import { applyCombatAftermath } from "@evervale/domain/combat-aftermath";
import { triggerM1Wave } from "@evervale/domain/combat";
import { placeBuilding } from "@evervale/domain/construction";
import { queueRepair } from "@evervale/domain/repair";
import { deleteProp, moveProp, placeProp, rotateProp } from "@evervale/domain/props";
import { drawRoad } from "@evervale/domain/roads";
import type { SimulationDefinitions, WorldState } from "@evervale/domain/world.types";
import type { WorldCommand } from "@evervale/protocol/world";
import { createStarterWorld } from "./create-starter-world.js";
import type { Clock, IdGenerator, WorldRepository } from "./ports.js";

export interface WorldServiceOptions {
  repository: WorldRepository;
  definitions: SimulationDefinitions;
  ids: IdGenerator;
  clock: Clock;
}

export class WorldService {
  constructor(private readonly options: WorldServiceOptions) {}

  async getOrCreate(ownerId: string): Promise<WorldState> {
    const loaded = await this.options.repository.findByOwner(ownerId);
    const existing = loaded ? this.normalizeWorld(loaded) : null;
    if (!existing) {
      const now = this.options.clock.now();
      const seed = Math.abs([...ownerId].reduce((a, c) => ((a * 31 + c.charCodeAt(0)) | 0), 17));
      const created = createStarterWorld(
        ownerId,
        seed,
        this.options.definitions,
        this.options.ids,
        now,
      );
      await this.options.repository.create(created);
      return created;
    }
    return this.advanceState(existing, this.options.clock.now());
  }

  async command(ownerId: string, command: WorldCommand): Promise<WorldState> {
    const loaded = await this.options.repository.findByOwner(ownerId);
    let stored = loaded ? this.normalizeWorld(loaded) : null;
    if (!stored) {
      stored = await this.getOrCreate(ownerId);
    }

    if (command.expectedRevision !== stored.revision) throw new Error("REVISION_CONFLICT");

    const previousRevision = stored.revision;
    const now = this.options.clock.now();
    let world = this.advanceState(stored, now);

    switch (command.type) {
      case "PLACE_BUILDING":
        world = placeBuilding(world, this.options.definitions, {
          instanceId: this.options.ids.next("building"),
          definitionId: command.payload.definitionId,
          x: command.payload.x,
          z: command.payload.z,
          ...(command.payload.rotationY !== undefined ? { rotationY: command.payload.rotationY } : {}),
        });
        break;
      case "PLACE_PROP":
        world = placeProp(world, this.options.definitions, {
          propId: this.options.ids.next("prop"),
          definitionId: command.payload.definitionId,
          x: command.payload.x,
          z: command.payload.z,
          ...(command.payload.rotationY !== undefined ? { rotationY: command.payload.rotationY } : {}),
        });
        break;
      case "MOVE_PROP":
        world = moveProp(
          world,
          this.options.definitions,
          command.payload.propId,
          command.payload.x,
          command.payload.z,
        );
        break;
      case "ROTATE_PROP":
        world = rotateProp(
          world,
          this.options.definitions,
          command.payload.propId,
          command.payload.rotationY,
        );
        break;
      case "DELETE_PROP":
        world = deleteProp(world, command.payload.propId);
        break;
      case "DRAW_ROAD":
        world = drawRoad(world, {
          roadId: this.options.ids.next("road"),
          ...command.payload,
        });
        break;
      case "SET_SPEED":
        world = { ...world, revision: world.revision + 1, speed: command.payload.speed };
        break;
      case "CLEAR_BLOCKER":
        world = queueBlockerClear(world, this.options.definitions, command.payload.blockerId);
        break;
      case "REPAIR_BUILDING":
        world = queueRepair(world, command.payload.buildingId);
        break;
      case "TRIGGER_TEST_WAVE":
        world = triggerM1Wave(
          world,
          this.options.definitions,
          (prefix) => this.options.ids.next(prefix),
        );
        break;
    }

    world = {
      ...world,
      lastSimulatedAt: now.toISOString(),
    };

    await this.options.repository.save(world, previousRevision);
    return world;
  }

  private normalizeWorld(world: WorldState): WorldState {
    return {
      ...world,
      roads: world.roads ?? [],
      blockers: world.blockers ?? [],
      props: world.props ?? [],
      society: {
        ...world.society,
        beauty: world.society.beauty ?? 0,
      },
      events: world.events ?? [],
    };
  }

  private advanceState(world: WorldState, now: Date): WorldState {
    const then = new Date(world.lastSimulatedAt);
    const elapsed = Math.max(0, (now.getTime() - then.getTime()) / 1000);
    if (elapsed < 0.25) return world;

    const capped = Math.min(elapsed, 7 * 24 * 60 * 60);
    const previousCombatStatus = world.combat?.status;
    let advanced = advanceWorld(world, this.options.definitions, capped);

    const newlyResolved =
      previousCombatStatus !== "RESOLVED" &&
      advanced.combat?.status === "RESOLVED" &&
      advanced.combat.outcome;

    if (newlyResolved && advanced.combat?.outcome) {
      const outcome = advanced.combat.outcome;
      advanced = applyCombatAftermath(advanced, outcome);
      advanced = {
        ...advanced,
        events: [
          ...advanced.events.slice(-49),
          {
            id: this.options.ids.next("event"),
            type: "COMBAT_RESOLVED",
            happenedAt: now.toISOString(),
            severity: outcome === "BREACH" ? 2 : outcome === "COSTLY" ? 1 : 0,
            summary:
              outcome === "CLEAN"
                ? "Threat repelled cleanly."
                : outcome === "COSTLY"
                  ? "Threat repelled, but the town suffered damage."
                  : "The defense line was breached; repairs are required.",
          },
        ],
      };
    }

    return {
      ...advanced,
      lastSimulatedAt: now.toISOString(),
    };
  }

}

