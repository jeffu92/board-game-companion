import { CombatDiceRollModifer } from "../../entities/units/Unit.class";

export interface CombatSimulationHooks {
  spaceCombatRollModifier: CombatDiceRollModifer | undefined;
  groundCombatRollModifier: CombatDiceRollModifer | undefined;
  spaceCombatRound1RollModifier: CombatDiceRollModifer | undefined;
}
