import type { WorldCommand, WorldViewDto } from "@evervale/protocol/world";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:2567";

export async function devLogin(handle: string): Promise<{ ownerId: string; displayName: string }> {
  const response = await fetch(`${API}/api/dev/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ handle }),
  });
  if (!response.ok) throw new Error((await response.json()).error ?? "LOGIN_FAILED");
  return response.json();
}

export async function getWorld(ownerId: string): Promise<WorldViewDto> {
  const response = await fetch(`${API}/api/world`, {
    headers: { "x-evervale-owner": ownerId },
  });
  if (!response.ok) throw new Error((await response.json()).error ?? "WORLD_LOAD_FAILED");
  return response.json();
}

export async function sendCommand(ownerId: string, command: WorldCommand): Promise<void> {
  const response = await fetch(`${API}/api/world/command`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-evervale-owner": ownerId,
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error ?? "COMMAND_FAILED");
  }
}
