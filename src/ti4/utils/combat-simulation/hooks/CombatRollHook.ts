import { CombatDiceRollModifer } from "../../../entities/units/Unit.class";

export interface CombatRollHook {
  modifier: CombatDiceRollModifer;
  /** The area in which this modifier will be used. */
  applyIn: "any" | "space" | "ground";
  /** The round of combat that this modifier will be used. */
  applyOnRound: "any" | "first";
  /** The maximum number of times this modifier will be used. */
  applyNumTimes: "any" | "once";
}
