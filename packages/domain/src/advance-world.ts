import { clamp, clamp01 } from "@evervale/shared-kernel/clamp";
import { advanceCombat } from "./combat.js";
import { advanceConstruction } from "./construction.js";
import { happinessTarget, smoothHappiness } from "./happiness.js";
import { advancePopulation } from "./population.js";
import { allocateWorkforce, applyWorkforceToSociety } from "./workforce.js";
import type { SimulationDefinitions, WorldState } from "./world.types.js";

export function advanceWorld(
  input: WorldState,
  definitions: SimulationDefinitions,
  realDeltaSeconds: number,
): WorldState {
  if (input.speed === 0 || realDeltaSeconds <= 0) return input;

  const deltaSeconds = realDeltaSeconds * input.speed;
  const cycleFraction = deltaSeconds / definitions.referenceCycleSeconds;

  let world = advanceConstruction(input, deltaSeconds);
  const combatActive = world.combat?.status === "ACTIVE" || world.combat?.status === "WARNING";
  const workforce = allocateWorkforce(world.society.population, world.buildings, definitions.buildings, combatActive);

  let moneyIncome = 0;
  let powerProduction = 0;
  let waterProduction = 0;
  let varumProduction = 0;
  let techProduction = 0;
  let buildingPowerUse = 0;
  let buildingWaterUse = 0;
  let upkeep = 0;
  let housing = 0;
  let education = 0;
  let recreation = 0;
  let safety = 0;
  let occupiedHouses = 0;

  const buildings = world.buildings.map((instance) => {
    const def = definitions.buildings[instance.definitionId];
    if (!def || instance.constructionState !== "COMPLETE" || instance.damageState === "DISABLED") {
      return { ...instance, workersAssigned: 0 };
    }
    const assigned = workforce.assignments.get(instance.id) ?? 0;
    const staffing = def.workers <= 0 ? 1 : clamp01(assigned / def.workers);
    moneyIncome += def.moneyPerWorker * assigned;
    powerProduction += def.powerProduction * staffing;
    waterProduction += def.waterProduction * staffing;
    varumProduction += def.varumProduction * staffing;
    techProduction += def.techProduction * staffing;
    buildingPowerUse += def.powerUse * staffing;
    buildingWaterUse += def.waterUse * staffing;
    upkeep += def.upkeep;
    housing += def.housingAdd;
    education += def.educationCoverageAdd * staffing;
    recreation += def.recreationCoverageAdd * staffing;
    safety += def.safetyAdd * staffing;
    if (def.housingAdd > 0) occupiedHouses += 1;
    return { ...instance, workersAssigned: assigned };
  });

  const residentPowerUse = world.society.population * 0.5;
  const residentWaterUse = world.society.population * 0.75;
  const totalPowerUse = buildingPowerUse + residentPowerUse;
  const totalWaterUse = buildingWaterUse + residentWaterUse;

  const powerAvailable = world.resources.power + powerProduction * cycleFraction;
  const waterAvailable = world.resources.water + waterProduction * cycleFraction;
  const powerNeed = totalPowerUse * cycleFraction;
  const waterNeed = totalWaterUse * cycleFraction;

  const powerSatisfaction = powerNeed <= 0 ? 1 : clamp01(powerAvailable / powerNeed);
  const waterSatisfaction = waterNeed <= 0 ? 1 : clamp01(waterAvailable / waterNeed);

  const resources = {
    ...world.resources,
    money: clamp(
      world.resources.money + (moneyIncome - upkeep) * cycleFraction,
      0,
      world.resources.moneyCap,
    ),
    power: clamp(powerAvailable - powerNeed, 0, world.resources.powerCap),
    water: clamp(waterAvailable - waterNeed, 0, world.resources.waterCap),
    varum: clamp(
      world.resources.varum + varumProduction * cycleFraction,
      0,
      world.resources.varumCap,
    ),
    techPoints: world.resources.techPoints + techProduction * cycleFraction,
  };

  const employment = workforce.totalWorkforce <= 0 ? 1 : workforce.assigned / workforce.totalWorkforce;
  let society = applyWorkforceToSociety({
    ...world.society,
    housingCapacity: Math.max(12, housing),
    educationCoverage: clamp01(education),
    recreationCoverage: clamp01(recreation),
    safety: clamp01(0.5 + safety),
  }, workforce);

  society = smoothHappiness(
    society,
    happinessTarget({
      powerSatisfaction,
      waterSatisfaction,
      employmentSatisfaction: employment,
      housingSatisfaction: clamp01(society.housingCapacity / Math.max(1, society.population)),
      educationCoverage: society.educationCoverage,
      recreationCoverage: society.recreationCoverage,
      safety: society.safety,
    }),
    cycleFraction,
  );

  society = advancePopulation(society, occupiedHouses, cycleFraction);

  world = {
    ...world,
    simulationSeconds: world.simulationSeconds + deltaSeconds,
    buildings,
    resources,
    society,
  };

  return advanceCombat(world, definitions, deltaSeconds);
}
