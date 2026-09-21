import { Pool, type PoolClient } from "pg";
import type {
  AcceptedCommandContext,
  AcceptedCommandReceipt,
  WorldRepository,
} from "@evervale/application/ports";
import type { WorldState } from "@evervale/domain/world.types";

const SNAPSHOT_RETENTION = 50;

export class PostgresWorldRepository implements WorldRepository {
  private readonly pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async findByOwner(ownerId: string): Promise<WorldState | null> {
    const result = await this.pool.query<{ snapshot: WorldState }>(
      `
      SELECT s.snapshot
      FROM world_memberships m
      JOIN worlds w ON w.id = m.world_id
      JOIN LATERAL (
        SELECT snapshot
        FROM world_snapshots
        WHERE world_id = w.id
        ORDER BY revision DESC
        LIMIT 1
      ) s ON true
      WHERE m.user_id = $1 AND m.role = 'OWNER'
      LIMIT 1
      `,
      [ownerId],
    );
    return result.rows[0]?.snapshot ?? null;
  }

  async findById(worldId: string): Promise<WorldState | null> {
    const result = await this.pool.query<{ snapshot: WorldState }>(
      `
      SELECT snapshot
      FROM world_snapshots
      WHERE world_id = $1
      ORDER BY revision DESC
      LIMIT 1
      `,
      [worldId],
    );
    return result.rows[0]?.snapshot ?? null;
  }

  async findAcceptedCommand(commandId: string): Promise<AcceptedCommandReceipt | null> {
    const result = await this.pool.query<{
      command_id: string;
      world_id: string;
      user_id: string;
      expected_revision: string | number | null;
      command_type: string;
      result: { world?: WorldState; fingerprint?: string };
    }>(
      `SELECT command_id, world_id, user_id, expected_revision, command_type, result
       FROM world_commands
       WHERE command_id = $1 AND status = 'ACCEPTED'
       LIMIT 1`,
      [commandId],
    );
    const row = result.rows[0];
    const world = row?.result?.world;
    if (!row || !world) return null;
    return {
      commandId: row.command_id,
      worldId: row.world_id,
      ownerId: row.user_id,
      expectedRevision: Number(row.expected_revision ?? 0),
      commandType: row.command_type,
      fingerprint: row.result.fingerprint ?? "",
      world,
    };
  }

  async create(world: WorldState): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO worlds
          (id, seed, revision, state, speed, simulation_version, balance_version, schema_version, last_simulated_at)
         VALUES ($1, $2, $3, $4, $5, 'm1', '0.2', 1, $6)`,
        [world.worldId, world.seed, world.revision, world.lifecycle, world.speed, world.lastSimulatedAt],
      );
      await client.query(
        `INSERT INTO world_memberships (world_id, user_id, role) VALUES ($1, $2, 'OWNER')`,
        [world.worldId, world.ownerId],
      );
      await this.insertSnapshot(client, world);
      await this.insertEvents(client, world);
      await this.pruneSnapshots(client, world.worldId);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      const pgError = error as { code?: string; constraint?: string };
      if (
        pgError.code === "23505" &&
        pgError.constraint === "world_owner_user_unique_idx"
      ) {
        throw new Error("WORLD_OWNER_EXISTS");
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async save(
    world: WorldState,
    previousRevision: number,
    acceptedCommand?: AcceptedCommandContext,
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const updated = await client.query(
        `UPDATE worlds
         SET revision = $2, state = $3, speed = $4, last_simulated_at = $5, updated_at = now()
         WHERE id = $1 AND revision = $6`,
        [
          world.worldId,
          world.revision,
          world.lifecycle,
          world.speed,
          world.lastSimulatedAt,
          previousRevision,
        ],
      );
      if (updated.rowCount !== 1) throw new Error("REVISION_CONFLICT");
      await this.insertSnapshot(client, world);
      await this.insertEvents(client, world);
      await this.pruneSnapshots(client, world.worldId);
      if (acceptedCommand) {
        await client.query(
          `INSERT INTO world_commands
            (command_id, world_id, user_id, expected_revision, command_type, status, result)
           VALUES ($1::uuid, $2, $3, $4, $5, 'ACCEPTED', $6::jsonb)`,
          [
            acceptedCommand.commandId,
            world.worldId,
            acceptedCommand.ownerId,
            acceptedCommand.expectedRevision,
            acceptedCommand.commandType,
            JSON.stringify({ world, fingerprint: acceptedCommand.fingerprint }),
          ],
        );
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private async insertEvents(client: PoolClient, world: WorldState): Promise<void> {
    for (const event of world.events) {
      await client.query(
        `INSERT INTO world_events
          (id, world_id, revision, event_type, happened_at, severity, entity_ids, data, player_summary)
         VALUES ($1::uuid, $2, $3, $4, $5, $6, '[]'::jsonb, '{}'::jsonb, $7)
         ON CONFLICT (id) DO NOTHING`,
        [
          event.id,
          world.worldId,
          world.revision,
          event.type,
          event.happenedAt,
          event.severity,
          event.summary,
        ],
      );
    }
  }

  private async pruneSnapshots(client: PoolClient, worldId: string): Promise<void> {
    await client.query(
      `DELETE FROM world_snapshots
       WHERE id IN (
         SELECT id
         FROM world_snapshots
         WHERE world_id = $1
         ORDER BY revision DESC
         OFFSET $2
       )`,
      [worldId, SNAPSHOT_RETENTION],
    );
  }

  private async insertSnapshot(client: PoolClient, world: WorldState): Promise<void> {
    await client.query(
      `INSERT INTO world_snapshots (world_id, revision, snapshot)
       VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (world_id, revision)
       DO UPDATE SET snapshot = EXCLUDED.snapshot`,
      [world.worldId, world.revision, JSON.stringify(world)],
    );
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
