import { actionCardMap } from "../../../entities/action-cards/actionCardMap";
import { CombatDiceRollModifer } from "../../../entities/units/Unit.class";
import { CombatSimulationHooks } from "../CombatSimulationHooks";
import { PlayerCombatInfo } from "../PlayerCombatInfo";

export function getPlayerCombatHooks(options: {
  player: PlayerCombatInfo;
}): {
  spaceCombatRollModifiers: CombatDiceRollModifer[];
  groundCombatRollModifiers: CombatDiceRollModifer[];
  spaceCombatRound1RollModifiers: CombatDiceRollModifer[];
} {
  const { player } = options;

  // setup global combat variables
  const spaceCombatRollModifiers: Array<CombatDiceRollModifer> = [];
  const groundCombatRollModifiers: Array<CombatDiceRollModifer> = [];
  const spaceCombatRound1RollModifiers: Array<CombatDiceRollModifer> = [];

  const allHooks: Array<Partial<CombatSimulationHooks> | undefined> = [
    player.faction.hooks,
  ].concat(
    Array.from(player.actionCards).map(([actionCardEnum]) => {
      return actionCardMap.get(actionCardEnum)?.hooks;
    })
  );

  allHooks.forEach((hooks) => {
    if (hooks) {
      const {
        spaceCombatRollModifier,
        groundCombatRollModifier,
        spaceCombatRound1RollModifier,
      } = hooks;

      if (spaceCombatRollModifier) {
        spaceCombatRollModifiers.push(spaceCombatRollModifier);
      }

      if (groundCombatRollModifier) {
        groundCombatRollModifiers.push(groundCombatRollModifier);
      }

      if (spaceCombatRound1RollModifier) {
        spaceCombatRound1RollModifiers.push(spaceCombatRound1RollModifier);
      }
    }
  });

  return {
    spaceCombatRollModifiers,
    groundCombatRollModifiers,
    spaceCombatRound1RollModifiers,
  };
}
