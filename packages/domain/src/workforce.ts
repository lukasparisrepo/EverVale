import type { BuildingDefinition, BuildingInstance, SocietyState } from "./world.types.js";

export interface WorkforceResult {
  assignments: Map<string, number>;
  totalWorkforce: number;
  assigned: number;
}

export function allocateWorkforce(
  population: number,
  buildings: BuildingInstance[],
  definitions: Record<string, BuildingDefinition>,
  combatActive: boolean,
): WorkforceResult {
  const totalWorkforce = Math.floor(population * 0.75);
  let available = totalWorkforce;

  const candidates = buildings
    .filter((instance) => instance.constructionState === "COMPLETE" && instance.damageState !== "DISABLED")
    .map((instance) => {
      const definition = definitions[instance.definitionId];
      if (!definition) return null;
      const threatBoost = combatActive && definition.jobCategory === "defense_ready" ? 70 : 0;
      return {
        instance,
        definition,
        priority: instance.priority + threatBoost,
      };
    })
    .filter((value): value is NonNullable<typeof value> => value !== null)
    .filter(({ definition }) => definition.workers > 0)
    .sort((a, b) => b.priority - a.priority || a.instance.id.localeCompare(b.instance.id));

  const assignments = new Map<string, number>();
  for (const { instance, definition } of candidates) {
    if (available <= 0) break;
    const assigned = Math.min(available, definition.workers);
    assignments.set(instance.id, assigned);
    available -= assigned;
  }

  return {
    assignments,
    totalWorkforce,
    assigned: totalWorkforce - available,
  };
}

export function applyWorkforceToSociety(
  society: SocietyState,
  result: WorkforceResult,
): SocietyState {
  return {
    ...society,
    workforce: result.totalWorkforce,
    assignedWorkers: result.assigned,
  };
}
