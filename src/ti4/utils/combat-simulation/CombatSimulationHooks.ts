import { CombatDiceRollModifer } from "../../entities/units/Unit.class";

export interface CombatSimulationHooks {
  globalCombatRollModifier: CombatDiceRollModifer | undefined;
  spaceCombatRound1RollModifier: CombatDiceRollModifer | undefined;
}
