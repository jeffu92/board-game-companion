import { CombatDiceRollModifer } from "../../../entities/units/Unit.class";
import { PlayerCombatInfo } from "../PlayerCombatInfo";
import { getPlayerCombatHooks } from "./getPlayerCombatHooks";

/**
 * Generates all combat hooks for an attacking and a defending player.
 * Intended for use in combat simulation.
 */
export function getAllCombatHooks(options: {
  attacker: PlayerCombatInfo;
  defender: PlayerCombatInfo;
}): {
  attackerSpaceCombatRollModifiers: CombatDiceRollModifer[];
  defenderSpaceCombatRollModifiers: CombatDiceRollModifer[];
  attackerGroundCombatRollModifiers: CombatDiceRollModifer[];
  defenderGroundCombatRollModifiers: CombatDiceRollModifer[];
  attackerSpaceCombatRound1RollModifiers: CombatDiceRollModifer[];
  defenderSpaceCombatRound1RollModifiers: CombatDiceRollModifer[];
} {
  const { attacker, defender } = options;

  const {
    spaceCombatRollModifiers: attackerSpaceCombatRollModifiers,
    groundCombatRollModifiers: attackerGroundCombatRollModifiers,
    spaceCombatRound1RollModifiers: attackerSpaceCombatRound1RollModifiers,
  } = getPlayerCombatHooks({
    player: attacker,
  });
  const {
    spaceCombatRollModifiers: defenderSpaceCombatRollModifiers,
    groundCombatRollModifiers: defenderGroundCombatRollModifiers,
    spaceCombatRound1RollModifiers: defenderSpaceCombatRound1RollModifiers,
  } = getPlayerCombatHooks({
    player: defender,
  });

  return {
    attackerSpaceCombatRollModifiers,
    defenderSpaceCombatRollModifiers,
    attackerGroundCombatRollModifiers,
    defenderGroundCombatRollModifiers,
    attackerSpaceCombatRound1RollModifiers,
    defenderSpaceCombatRound1RollModifiers,
  };
}
