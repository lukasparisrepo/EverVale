import { clamp01 } from "@evervale/shared-kernel/clamp";
import type { SocietyState } from "./world.types.js";

export function advancePopulation(society: SocietyState, occupiedHouses: number, cycleFraction: number): SocietyState {
  if (society.happiness < 65 || society.population >= society.housingCapacity) {
    return society;
  }

  const perCycle =
    0.08 * occupiedHouses * clamp01((society.happiness - 60) / 40);
  const progress = society.growthProgress + Math.min(0.25, perCycle) * cycleFraction;

  const availableHousing = Math.max(0, society.housingCapacity - society.population);
  const births = Math.min(availableHousing, Math.floor(progress));

  return {
    ...society,
    population: society.population + births,
    growthProgress: progress - births,
  };
}
