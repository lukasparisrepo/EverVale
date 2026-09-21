import type { WorldState } from "@evervale/domain/world.types";

export interface WorldRepository {
  findByOwner(ownerId: string): Promise<WorldState | null>;
  findById(worldId: string): Promise<WorldState | null>;
  create(world: WorldState): Promise<void>;
  save(world: WorldState, previousRevision: number): Promise<void>;
}

export interface IdGenerator {
  next(prefix: string): string;
}

export interface Clock {
  now(): Date;
}
