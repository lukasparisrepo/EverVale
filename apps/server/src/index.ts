import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { WorldService } from "@evervale/application/world-service";
import type { Clock, IdGenerator, WorldRepository } from "@evervale/application/ports";
import { loadGameData } from "@evervale/balance-data";
import { JsonWorldRepository, PostgresWorldRepository } from "@evervale/persistence";
import type { WorldCommand } from "@evervale/protocol/world";

const PORT = Number(process.env.PORT ?? 2567);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const gameData = loadGameData();

class NodeIds implements IdGenerator {
  next(): string {
    return randomUUID();
  }
}

class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

function repository(): WorldRepository {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    console.info("[EverVale] persistence=postgres");
    return new PostgresWorldRepository(databaseUrl);
  }
  const directory = path.resolve(process.cwd(), "../../.evervale/worlds");
  console.warn("[EverVale] DATABASE_URL missing; using local JSON development persistence:", directory);
  return new JsonWorldRepository(directory);
}

const service = new WorldService({
  repository: repository(),
  definitions: gameData.definitions,
  ids: new NodeIds(),
  clock: new SystemClock(),
});

function cors(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "content-type,x-evervale-owner");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
}

function json(res: ServerResponse, status: number, body: unknown): void {
  cors(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function body<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") as T;
}

function owner(req: IncomingMessage): string {
  const value = req.headers["x-evervale-owner"];
  if (typeof value !== "string" || !value) throw new Error("UNAUTHORIZED");
  return value;
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      cors(res);
      res.statusCode = 204;
      res.end();
      return;
    }

    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

    if (req.method === "GET" && url.pathname === "/health") {
      json(res, 200, { ok: true, service: "evervale-server", balance: "0.2" });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/dev/login") {
      if (process.env.EVERVALE_DEV_AUTH === "false") throw new Error("DEV_AUTH_DISABLED");
      const input = await body<{ handle?: string }>(req);
      const handle = (input.handle ?? "builder").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 32);
      if (!handle) throw new Error("INVALID_HANDLE");
      json(res, 200, { ownerId: `dev:${handle}`, displayName: handle });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/world") {
      const world = await service.getOrCreate(owner(req));
      json(res, 200, {
        world,
        buildCatalog: gameData.buildCatalog,
        serverNow: new Date().toISOString(),
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/world/command") {
      const command = await body<WorldCommand>(req);
      const world = await service.command(owner(req), command);
      json(res, 200, { accepted: true, world });
      return;
    }

    json(res, 404, { error: "NOT_FOUND" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "INTERNAL_ERROR";
    const status =
      message === "UNAUTHORIZED" ? 401 :
      message === "REVISION_CONFLICT" ? 409 :
      message.startsWith("NOT_ENOUGH") || message.startsWith("NO_") || message.startsWith("REPAIR_") || message.includes("LOCKED") || message.includes("COLLISION") ? 400 :
      500;
    console.error("[EverVale]", message);
    json(res, status, { accepted: false, error: message });
  }
});

server.listen(PORT, () => {
  console.info(`[EverVale] server listening on http://localhost:${PORT}`);
});
