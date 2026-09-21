import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import YAML from "yaml";
import type {
  BuildingDefinition,
  CombatActorDefinition,
  SimulationDefinitions,
} from "@evervale/domain/world.types";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function readYaml<T>(relativePath: string): T {
  const text = readFileSync(path.join(ROOT, relativePath), "utf8");
  return YAML.parse(text) as T;
}

type RawBalance = {
  reference_cycle_seconds: number;
  buildings: Record<string, Record<string, unknown>>;
};

type RawContent = {
  buildings: Record<string, { name: string; tech_tier: number }>;
};

type RawCombat = {
  units?: Record<string, Record<string, unknown>>;
  enemies?: Record<string, Record<string, unknown>>;
};

const numberValue = (value: unknown, fallback = 0): number =>
  typeof value === "number" ? value : fallback;

function mapBuilding(id: string, raw: Record<string, unknown>): BuildingDefinition {
  const combatSpawnRaw = raw.combat_spawn;
  const combatSpawn =
    combatSpawnRaw && typeof combatSpawnRaw === "object"
      ? Object.fromEntries(
          Object.entries(combatSpawnRaw as Record<string, unknown>).map(([key, value]) => [
            key,
            numberValue(value),
          ]),
        )
      : {};

  return {
    id,
    techTier: numberValue(raw.tech_tier),
    moneyCost: numberValue(raw.money_cost),
    varumCost: numberValue(raw.varum_cost),
    buildCycles: numberValue(raw.build_cycles),
    workers: numberValue(raw.workers),
    priority: numberValue(raw.priority),
    ...(typeof raw.job_category === "string" ? { jobCategory: raw.job_category } : {}),
    moneyPerWorker: numberValue(raw.money_per_worker),
    moneyCapAdd: numberValue(raw.money_cap_add),
    powerProduction: numberValue(raw.power_production),
    powerCapAdd: numberValue(raw.power_cap_add),
    powerUse: numberValue(raw.power_use),
    waterProduction: numberValue(raw.water_production),
    waterCapAdd: numberValue(raw.water_cap_add),
    waterUse: numberValue(raw.water_use),
    varumProduction: numberValue(raw.varum_production),
    varumCapAdd: numberValue(raw.varum_cap_add),
    techProduction: numberValue(raw.tech_production),
    upkeep: numberValue(raw.upkeep),
    housingAdd: numberValue(raw.housing_add),
    educationCoverageAdd: numberValue(raw.education_coverage_add),
    recreationCoverageAdd: numberValue(raw.recreation_coverage_add),
    safetyAdd: numberValue(raw.safety_add),
    combatSpawn,
    constructionSlotsAdd: numberValue(raw.construction_slots_add),
  };
}

function mapActor(
  id: string,
  raw: Record<string, unknown>,
  side: "DEFENDER" | "ENEMY",
): CombatActorDefinition {
  const target =
    typeof raw.target === "string"
      ? raw.target
      : side === "ENEMY"
        ? "ground"
        : "ground";

  return {
    id,
    side,
    hp: numberValue(raw.hp),
    dps: numberValue(raw.dps),
    armor: numberValue(raw.armor),
    target: target as CombatActorDefinition["target"],
    class: typeof raw.class === "string" ? raw.class : "ground",
  };
}

export interface BuildCatalogEntry {
  id: string;
  name: string;
  techTier: number;
  moneyCost: number;
  varumCost: number;
  buildCycles: number;
}

export interface LoadedGameData {
  definitions: SimulationDefinitions;
  buildCatalog: BuildCatalogEntry[];
}

export function loadGameData(): LoadedGameData {
  const balance = readYaml<RawBalance>("data/balance/v0.2/buildings.yaml");
  const content = readYaml<RawContent>("data/content/v0.2/buildings.yaml");
  const defenders = readYaml<RawCombat>("data/combat/v0.2/defense_units.yaml").units ?? {};
  const enemies = readYaml<RawCombat>("data/combat/v0.2/enemies.yaml").enemies ?? {};

  const buildings = Object.fromEntries(
    Object.entries(balance.buildings).map(([id, raw]) => [id, mapBuilding(id, raw)]),
  );

  const definitions: SimulationDefinitions = {
    referenceCycleSeconds: numberValue(balance.reference_cycle_seconds, 600),
    buildings,
    defenders: Object.fromEntries(
      Object.entries(defenders).map(([id, raw]) => [id, mapActor(id, raw, "DEFENDER")]),
    ),
    enemies: Object.fromEntries(
      Object.entries(enemies).map(([id, raw]) => [id, mapActor(id, raw, "ENEMY")]),
    ),
  };

  const m1Ids = new Set([
    "town_center",
    "house_small",
    "workshop",
    "power_plant",
    "water_plant",
    "school",
    "park",
    "guard_post",
    "farm",
    "restaurant",
    "builders_yard",
  ]);

  const buildCatalog = Object.entries(content.buildings)
    .filter(([id]) => m1Ids.has(id) && id !== "town_center")
    .map(([id, item]) => {
      const def = buildings[id];
      if (!def) throw new Error(`Missing balance for ${id}`);
      return {
        id,
        name: item.name,
        techTier: item.tech_tier,
        moneyCost: def.moneyCost,
        varumCost: def.varumCost,
        buildCycles: def.buildCycles,
      };
    })
    .sort((a, b) => a.techTier - b.techTier || a.name.localeCompare(b.name));

  return { definitions, buildCatalog };
}
