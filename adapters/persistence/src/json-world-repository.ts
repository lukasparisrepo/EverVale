import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WorldRepository } from "@evervale/application/ports";
import type { WorldState } from "@evervale/domain/world.types";

export class JsonWorldRepository implements WorldRepository {
  constructor(private readonly directory: string) {}

  private file(worldId: string): string {
    return path.join(this.directory, `${worldId}.json`);
  }

  private async ensure(): Promise<void> {
    await mkdir(this.directory, { recursive: true });
  }

  async findByOwner(ownerId: string): Promise<WorldState | null> {
    await this.ensure();
    for (const file of await readdir(this.directory)) {
      if (!file.endsWith(".json")) continue;
      const raw = await readFile(path.join(this.directory, file), "utf8");
      const world = JSON.parse(raw) as WorldState;
      if (world.ownerId === ownerId) return world;
    }
    return null;
  }

  async findById(worldId: string): Promise<WorldState | null> {
    try {
      return JSON.parse(await readFile(this.file(worldId), "utf8")) as WorldState;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return null;
      throw error;
    }
  }

  async create(world: WorldState): Promise<void> {
    await this.ensure();
    if (await this.findById(world.worldId)) throw new Error("WORLD_ALREADY_EXISTS");
    await writeFile(this.file(world.worldId), JSON.stringify(world, null, 2), "utf8");
  }

  async save(world: WorldState, previousRevision: number): Promise<void> {
    await this.ensure();
    const current = await this.findById(world.worldId);
    if (!current) throw new Error("WORLD_NOT_FOUND");
    if (current.revision !== previousRevision) throw new Error("REVISION_CONFLICT");
    await writeFile(this.file(world.worldId), JSON.stringify(world, null, 2), "utf8");
  }
}
