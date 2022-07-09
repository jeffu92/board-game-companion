import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";
import { getAllCombatHooks } from "../hooks/getAllCombatHooks";

type SpaceCombatSimulationHooks = Pick<
  ReturnType<typeof getAllCombatHooks>,
  | "attackerSpaceCombatRollModifiers"
  | "attackerSpaceCombatRound1RollModifiers"
  | "defenderSpaceCombatRollModifiers"
  | "defenderSpaceCombatRound1RollModifiers"
>;

export function simulateSpaceCombat(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
  hooks: SpaceCombatSimulationHooks;
}) {
  const { attackerSimulator, defenderSimulator, hooks } = options;

  // space combat
  let spaceCombatRound = 1;
  while (
    attackerSimulator.hasShipsRemainingInSpace &&
    defenderSimulator.hasShipsRemainingInSpace
  ) {
    const attackerUnitRollModifiersThisRound = [
      ...hooks.attackerSpaceCombatRollModifiers,
    ];
    const defenderUnitRollModifiersThisRound = [
      ...hooks.defenderSpaceCombatRollModifiers,
    ];

    if (spaceCombatRound === 1) {
      attackerUnitRollModifiersThisRound.push(
        ...hooks.attackerSpaceCombatRound1RollModifiers
      );
      defenderUnitRollModifiersThisRound.push(
        ...hooks.defenderSpaceCombatRound1RollModifiers
      );
    }

    const remainingAttackerUnitHits = attackerSimulator.simulateSpaceCombat({
      rollModifiers: attackerUnitRollModifiersThisRound,
    });
    const remainingDefenderUnitHits = defenderSimulator.simulateSpaceCombat({
      rollModifiers: defenderUnitRollModifiersThisRound,
    });
    attackerSimulator.assignHitsToShips({
      numHits: remainingDefenderUnitHits,
    });
    defenderSimulator.assignHitsToShips({
      numHits: remainingAttackerUnitHits,
    });
  }
}
