import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";
import { getAllCombatHooks } from "../hooks/getAllCombatHooks";

type SpaceCombatSimulationHooks = Pick<
  ReturnType<typeof getAllCombatHooks>,
  | "attackerGlobalUnitRollModifiers"
  | "attackerSpaceCombatRound1RollModifiers"
  | "defenderGlobalUnitRollModifiers"
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
    // make a copy of the
    const attackerUnitRollModifiersThisRound = [
      ...hooks.attackerGlobalUnitRollModifiers,
    ];
    const defenderUnitRollModifiersThisRound = [
      ...hooks.defenderGlobalUnitRollModifiers,
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
