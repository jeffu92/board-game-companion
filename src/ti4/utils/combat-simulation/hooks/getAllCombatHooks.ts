import { actionCardMap } from "../../../entities/action-cards/actionCardMap";
import { CombatDiceRollModifer } from "../../../entities/units/Unit.class";
import { PlayerCombatInfo } from "../PlayerCombatInfo";

export function getAllCombatHooks(options: {
  attacker: PlayerCombatInfo;
  defender: PlayerCombatInfo;
}): {
  attackerGlobalUnitRollModifiers: CombatDiceRollModifer[];
  defenderGlobalUnitRollModifiers: CombatDiceRollModifer[];
  attackerSpaceCombatRound1RollModifiers: CombatDiceRollModifer[];
  defenderSpaceCombatRound1RollModifiers: CombatDiceRollModifer[];
} {
  const { attacker, defender } = options;

  // setup global combat variables
  const attackerGlobalUnitRollModifiers: Array<CombatDiceRollModifer> = [];
  if (attacker.faction.getCombatRollModifier) {
    attackerGlobalUnitRollModifiers.push(
      attacker.faction.getCombatRollModifier
    );
  }
  const defenderGlobalUnitRollModifiers: Array<CombatDiceRollModifer> = [];
  if (defender.faction.getCombatRollModifier) {
    defenderGlobalUnitRollModifiers.push(
      defender.faction.getCombatRollModifier
    );
  }

  // setup space combat round 1 roll modifiers
  const attackerSpaceCombatRound1RollModifiers: Array<CombatDiceRollModifer> = [];
  attacker.actionCards.forEach((_, actionCardEnum) => {
    const actionCard = actionCardMap.get(actionCardEnum);
    if (actionCard) {
      const mod =
        actionCard.combatSimulationHooks.spaceCombatRound1RollModifier;
      if (mod) {
        attackerSpaceCombatRound1RollModifiers.push(mod);
      }
    }
  });
  const defenderSpaceCombatRound1RollModifiers: Array<CombatDiceRollModifer> = [];
  defender.actionCards.forEach((_, actionCardEnum) => {
    const actionCard = actionCardMap.get(actionCardEnum);
    if (actionCard) {
      const mod =
        actionCard.combatSimulationHooks.spaceCombatRound1RollModifier;
      if (mod) {
        defenderSpaceCombatRound1RollModifiers.push(mod);
      }
    }
  });

  return {
    attackerGlobalUnitRollModifiers,
    defenderGlobalUnitRollModifiers,
    attackerSpaceCombatRound1RollModifiers,
    defenderSpaceCombatRound1RollModifiers,
  };
}
