import { clamp, clamp01 } from "@evervale/shared-kernel/clamp";
import type { SocietyState } from "./world.types.js";

export interface HappinessInputs {
  powerSatisfaction: number;
  waterSatisfaction: number;
  employmentSatisfaction: number;
  housingSatisfaction: number;
  educationCoverage: number;
  recreationCoverage: number;
  safety: number;
  beautyBonus?: number;
}

export function happinessTarget(input: HappinessInputs): number {
  return clamp(
    20 +
      20 * clamp01(input.powerSatisfaction) +
      20 * clamp01(input.waterSatisfaction) +
      15 * clamp01(input.employmentSatisfaction) +
      10 * clamp01(input.housingSatisfaction) +
      5 * clamp01(input.educationCoverage) +
      5 * clamp01(input.recreationCoverage) +
      10 * clamp01(input.safety) +
      Math.max(0, Math.min(5, input.beautyBonus ?? 0)),
    0,
    100,
  );
}

export function smoothHappiness(
  society: SocietyState,
  target: number,
  cycleFraction: number,
): SocietyState {
  const alpha = 1 - Math.pow(0.75, cycleFraction);
  return {
    ...society,
    happiness: society.happiness + (target - society.happiness) * alpha,
  };
}
