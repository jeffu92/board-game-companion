import { CombatRollHook } from "./CombatRollHook";

export interface CombatSimulationHooks {
  combatRoll?: CombatRollHook | undefined;
}
