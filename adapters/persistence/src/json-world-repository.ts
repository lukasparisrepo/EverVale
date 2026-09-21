import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  AcceptedCommandContext,
  AcceptedCommandReceipt,
  WorldRepository,
} from "@evervale/application/ports";
import type { WorldState } from "@evervale/domain/world.types";

export class JsonWorldRepository implements WorldRepository {
  constructor(private readonly directory: string) {}

  private file(worldId: string): string {
    return path.join(this.directory, `${worldId}.json`);
  }

  private commandsDirectory(): string {
    return path.join(this.directory, "commands");
  }

  private commandFile(commandId: string): string {
    return path.join(this.commandsDirectory(), `${encodeURIComponent(commandId)}.json`);
  }

  private async ensure(): Promise<void> {
    await mkdir(this.directory, { recursive: true });
    await mkdir(this.commandsDirectory(), { recursive: true });
  }

  private async atomicWrite(file: string, content: string): Promise<void> {
    const temp = `${file}.tmp-${process.pid}-${Date.now()}`;
    await writeFile(temp, content, "utf8");
    await rename(temp, file);
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

  async findAcceptedCommand(commandId: string): Promise<AcceptedCommandReceipt | null> {
    try {
      return JSON.parse(
        await readFile(this.commandFile(commandId), "utf8"),
      ) as AcceptedCommandReceipt;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return null;
      throw error;
    }
  }

  async create(world: WorldState): Promise<void> {
    await this.ensure();
    if (await this.findById(world.worldId)) throw new Error("WORLD_ALREADY_EXISTS");
    if (await this.findByOwner(world.ownerId)) throw new Error("WORLD_OWNER_EXISTS");
    await this.atomicWrite(this.file(world.worldId), JSON.stringify(world, null, 2));
  }

  async save(
    world: WorldState,
    previousRevision: number,
    acceptedCommand?: AcceptedCommandContext,
  ): Promise<void> {
    await this.ensure();
    const current = await this.findById(world.worldId);
    if (!current) throw new Error("WORLD_NOT_FOUND");
    if (current.revision !== previousRevision) throw new Error("REVISION_CONFLICT");

    await this.atomicWrite(this.file(world.worldId), JSON.stringify(world, null, 2));

    if (acceptedCommand) {
      const receipt: AcceptedCommandReceipt = {
        ...acceptedCommand,
        worldId: world.worldId,
        world,
      };
      await this.atomicWrite(
        this.commandFile(acceptedCommand.commandId),
        JSON.stringify(receipt, null, 2),
      );
    }
  }
}
