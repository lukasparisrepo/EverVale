import type { WorldSpeed, WorldState } from "@evervale/domain/world.types";

export interface BuildCatalogEntryDto {
  id: string;
  name: string;
  techTier: number;
  moneyCost: number;
  varumCost: number;
  buildCycles: number;
}

export interface WorldViewDto {
  world: WorldState;
  buildCatalog: BuildCatalogEntryDto[];
  serverNow: string;
}

export type WorldCommand =
  | {
      type: "PLACE_BUILDING";
      commandId: string;
      expectedRevision: number;
      payload: { definitionId: string; x: number; z: number; rotationY?: number };
    }
  | {
      type: "DRAW_ROAD";
      commandId: string;
      expectedRevision: number;
      payload: { fromX: number; fromZ: number; toX: number; toZ: number };
    }
  | {
      type: "SET_SPEED";
      commandId: string;
      expectedRevision: number;
      payload: { speed: WorldSpeed };
    }
  | {
      type: "REPAIR_BUILDING";
      commandId: string;
      expectedRevision: number;
      payload: { buildingId: string };
    }
  | {
      type: "TRIGGER_TEST_WAVE";
      commandId: string;
      expectedRevision: number;
      payload: Record<string, never>;
    };

export interface CommandResultDto {
  accepted: boolean;
  world?: WorldState;
  error?: string;
}
