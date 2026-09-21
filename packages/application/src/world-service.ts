import { advanceWorld } from "@evervale/domain/advance-world";
import { placeBuilding } from "@evervale/domain/construction";
import { drawRoad } from "@evervale/domain/roads";
import { triggerM1Wave } from "@evervale/domain/combat";
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
    const existing = await this.options.repository.findByOwner(ownerId);
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
    return this.catchUp(existing);
  }

  async command(ownerId: string, command: WorldCommand): Promise<WorldState> {
    let world = await this.getOrCreate(ownerId);
    if (command.expectedRevision !== world.revision) throw new Error("REVISION_CONFLICT");
    const previousRevision = world.revision;

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
      case "DRAW_ROAD":
        world = drawRoad(world, {
          roadId: this.options.ids.next("road"),
          ...command.payload,
        });
        break;
      case "SET_SPEED":
        world = { ...world, revision: world.revision + 1, speed: command.payload.speed };
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
      lastSimulatedAt: this.options.clock.now().toISOString(),
    };
    await this.options.repository.save(world, previousRevision);
    return world;
  }

  private async catchUp(world: WorldState): Promise<WorldState> {
    const now = this.options.clock.now();
    const then = new Date(world.lastSimulatedAt);
    const elapsed = Math.max(0, (now.getTime() - then.getTime()) / 1000);
    if (elapsed < 0.25) return world;

    const previousRevision = world.revision;
    const capped = Math.min(elapsed, 7 * 24 * 60 * 60);
    const advanced = advanceWorld(world, this.options.definitions, capped);
    const next = {
      ...advanced,
      revision: previousRevision + 1,
      lastSimulatedAt: now.toISOString(),
    };
    await this.options.repository.save(next, previousRevision);
    return next;
  }
}
