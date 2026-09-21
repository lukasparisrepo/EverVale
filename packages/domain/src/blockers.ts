import type { SimulationDefinitions, WorldState } from "./world.types.js";

export function queueBlockerClear(
  world: WorldState,
  definitions: SimulationDefinitions,
  blockerId: string,
): WorldState {
  const blocker = world.blockers.find((b) => b.id === blockerId);
  if (!blocker) throw new Error("BLOCKER_NOT_FOUND");
  if (blocker.state === "CLEARING") throw new Error("BLOCKER_ALREADY_CLEARING");

  const definition = definitions.blockers[blocker.definitionId];
  if (!definition) throw new Error("BLOCKER_DEFINITION_MISSING");
  if (definition.techTier > world.resources.techTier) throw new Error("TECH_LOCKED");
  if (world.resources.money < definition.moneyCost) throw new Error("NOT_ENOUGH_MONEY");
  if (world.resources.varum < definition.varumCost) throw new Error("NOT_ENOUGH_VARUM");

  return {
    ...world,
    revision: world.revision + 1,
    resources: {
      ...world.resources,
      money: world.resources.money - definition.moneyCost,
      varum: world.resources.varum - definition.varumCost,
    },
    blockers: world.blockers.map((b) =>
      b.id === blockerId
        ? {
            ...b,
            state: "CLEARING" as const,
            clearRemainingSeconds: definition.clearCycles * definitions.referenceCycleSeconds,
          }
        : b,
    ),
  };
}

export function advanceBlockers(world: WorldState, deltaSeconds: number): WorldState {
  let changed = false;
  const blockers = world.blockers
    .map((blocker) => {
      if (blocker.state !== "CLEARING") return blocker;
      const remaining = Math.max(0, blocker.clearRemainingSeconds - deltaSeconds);
      changed = true;
      return { ...blocker, clearRemainingSeconds: remaining };
    })
    .filter((blocker) => blocker.state !== "CLEARING" || blocker.clearRemainingSeconds > 0);

  return changed ? { ...world, blockers } : world;
}
