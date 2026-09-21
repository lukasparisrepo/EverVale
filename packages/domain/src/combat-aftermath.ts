import { clamp } from "@evervale/shared-kernel/clamp";
import type { CombatOutcome, WorldState } from "./world.types.js";

const priorityByOutcome: Record<Exclude<CombatOutcome, "CLEAN">, string[]> = {
  COSTLY: ["workshop", "guard_post", "power_plant", "water_plant", "house_small"],
  BREACH: ["power_plant", "water_plant", "workshop", "guard_post", "house_small"],
};

export function applyCombatAftermath(world: WorldState, outcome: CombatOutcome): WorldState {
  if (outcome === "CLEAN") return world;

  const priorities = priorityByOutcome[outcome];
  const target = priorities
    .flatMap((definitionId) =>
      world.buildings.filter(
        (b) => b.definitionId === definitionId && b.constructionState === "COMPLETE",
      ),
    )
    .find((b) => b.damageState !== "DISABLED");

  if (!target) return world;

  const damage = outcome === "BREACH" ? 35 : 18;
  const nextCondition = clamp(target.condition - damage, 10, 100);
  const nextDamageState = nextCondition <= 15 ? "DISABLED" : "DAMAGED";

  return {
    ...world,
    buildings: world.buildings.map((b) =>
      b.id === target.id
        ? {
            ...b,
            condition: nextCondition,
            damageState: nextDamageState,
            repairRemainingSeconds: 0,
          }
        : b,
    ),
  };
}
