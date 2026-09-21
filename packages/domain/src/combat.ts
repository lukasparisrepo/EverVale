import { clamp } from "@evervale/shared-kernel/clamp";
import type {
  CombatActor,
  CombatActorDefinition,
  CombatOutcome,
  CombatState,
  SimulationDefinitions,
  WorldState,
} from "./world.types.js";

function actor(id: string, definition: CombatActorDefinition, x: number, z: number): CombatActor {
  return {
    id,
    definitionId: definition.id,
    side: definition.side,
    hp: definition.hp,
    maxHp: definition.hp,
    position: { x, y: 0, z },
  };
}

function mitigation(raw: number, armor: number): number {
  return raw * 100 / (100 + armor);
}

export function triggerM1Wave(
  world: WorldState,
  definitions: SimulationDefinitions,
  idFactory: (prefix: string) => string,
): WorldState {
  if (world.combat && world.combat.status !== "RESOLVED") throw new Error("COMBAT_ALREADY_ACTIVE");

  const actors: CombatActor[] = [];
  const warden = definitions.defenders.town_warden;
  const guard = definitions.defenders.guard;
  const nibbler = definitions.enemies.nibbler;
  const slime = definitions.enemies.wobble_slime;
  if (!warden || !guard || !nibbler || !slime) throw new Error("M1_COMBAT_DATA_MISSING");

  actors.push(actor(idFactory("warden"), warden, -2, -2));
  actors.push(actor(idFactory("warden"), warden, 2, -2));

  const guardPosts = world.buildings.filter(
    (b) => b.definitionId === "guard_post" && b.constructionState === "COMPLETE" && b.damageState !== "DISABLED",
  ).length;
  for (let i = 0; i < guardPosts * 2; i += 1) {
    actors.push(actor(idFactory("guard"), guard, -3 + i * 2, 1));
  }

  actors.push(actor(idFactory("nibbler"), nibbler, -9, 12));
  actors.push(actor(idFactory("nibbler"), nibbler, 0, 14));
  actors.push(actor(idFactory("nibbler"), nibbler, 9, 12));
  actors.push(actor(idFactory("slime"), slime, 5, 16));

  return {
    ...world,
    revision: world.revision + 1,
    combat: {
      id: idFactory("combat"),
      status: "WARNING",
      warningRemainingSeconds: 8,
      elapsedSeconds: 0,
      actors,
    },
  };
}

function activeStep(
  combat: CombatState,
  definitions: SimulationDefinitions,
  deltaSeconds: number,
): CombatState {
  const nextActors = combat.actors.map((a) => ({ ...a }));
  const defenders = nextActors.filter((a) => a.side === "DEFENDER" && a.hp > 0);
  const enemies = nextActors.filter((a) => a.side === "ENEMY" && a.hp > 0);

  const applySide = (attackers: CombatActor[], targets: CombatActor[]) => {
    if (targets.length === 0) return;
    attackers.forEach((source, index) => {
      const sourceDef = source.side === "DEFENDER"
        ? definitions.defenders[source.definitionId]
        : definitions.enemies[source.definitionId];
      if (!sourceDef || source.hp <= 0) return;
      const target = targets[index % targets.length];
      if (!target) return;
      const targetDef = target.side === "DEFENDER"
        ? definitions.defenders[target.definitionId]
        : definitions.enemies[target.definitionId];
      if (!targetDef) return;
      target.hp = clamp(
        target.hp - mitigation(sourceDef.dps * deltaSeconds, targetDef.armor),
        0,
        target.maxHp,
      );
    });
  };

  applySide(defenders, enemies);
  applySide(enemies, defenders);

  const livingDefenders = nextActors.filter((a) => a.side === "DEFENDER" && a.hp > 0);
  const livingEnemies = nextActors.filter((a) => a.side === "ENEMY" && a.hp > 0);
  const elapsedSeconds = combat.elapsedSeconds + deltaSeconds;

  let outcome: CombatOutcome | undefined;
  if (livingEnemies.length === 0) {
    const initialHp = nextActors
      .filter((a) => a.side === "DEFENDER")
      .reduce((sum, a) => sum + a.maxHp, 0);
    const remainingHp = livingDefenders.reduce((sum, a) => sum + a.hp, 0);
    const damageFraction = 1 - remainingHp / Math.max(1, initialHp);
    outcome = damageFraction < 0.25 ? "CLEAN" : "COSTLY";
  } else if (livingDefenders.length === 0 || elapsedSeconds >= 90) {
    outcome = "BREACH";
  }

  return {
    ...combat,
    actors: nextActors,
    elapsedSeconds,
    status: outcome ? "RESOLVED" : "ACTIVE",
    ...(outcome
      ? {
          outcome,
          summary:
            outcome === "BREACH"
              ? "Outer defense breached; recovery required."
              : "Threat repelled.",
        }
      : {}),
  };
}

export function advanceCombat(
  world: WorldState,
  definitions: SimulationDefinitions,
  deltaSeconds: number,
): WorldState {
  const original = world.combat;
  if (!original || original.status === "RESOLVED" || deltaSeconds <= 0) return world;

  let combat: CombatState = {
    ...original,
    actors: original.actors.map((a) => ({ ...a })),
  };
  let remaining = deltaSeconds;

  if (combat.status === "WARNING") {
    const warningSlice = Math.min(remaining, combat.warningRemainingSeconds);
    combat = {
      ...combat,
      warningRemainingSeconds: Math.max(0, combat.warningRemainingSeconds - warningSlice),
    };
    remaining -= warningSlice;

    if (combat.warningRemainingSeconds <= 0) {
      combat = { ...combat, status: "ACTIVE" };
    }
  }

  // Fixed combat stepping makes online polling and offline catch-up resolve the same battle path.
  const stepSeconds = 0.5;
  while (remaining > 0 && combat.status === "ACTIVE") {
    const slice = Math.min(stepSeconds, remaining, Math.max(0, 90 - combat.elapsedSeconds));
    if (slice <= 0) {
      combat = {
        ...combat,
        status: "RESOLVED",
        outcome: "BREACH",
        summary: "Outer defense breached; recovery required.",
      };
      break;
    }
    combat = activeStep(combat, definitions, slice);
    remaining -= slice;
  }

  return { ...world, combat };
}
