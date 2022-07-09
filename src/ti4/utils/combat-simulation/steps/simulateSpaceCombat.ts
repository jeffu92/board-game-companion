import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";

export function simulateSpaceCombat(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
}) {
  const { attackerSimulator, defenderSimulator } = options;

  // space combat
  for (
    let round = 1;
    attackerSimulator.hasShipsRemainingInSpace &&
    defenderSimulator.hasShipsRemainingInSpace;
    round++
  ) {
    const remainingAttackerUnitHits = attackerSimulator.simulateSpaceCombat({
      round,
    });
    const remainingDefenderUnitHits = defenderSimulator.simulateSpaceCombat({
      round,
    });
    attackerSimulator.assignHitsToShips({
      numHits: remainingDefenderUnitHits,
    });
    defenderSimulator.assignHitsToShips({
      numHits: remainingAttackerUnitHits,
    });

    round++;
  }
}
