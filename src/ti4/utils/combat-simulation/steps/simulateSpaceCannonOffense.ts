import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";

export function simulateSpaceCannonOffense(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
}) {
  const { attackerSimulator, defenderSimulator } = options;

  // space cannon offense
  const attackerSpaceCannonOffenseHits = attackerSimulator.simulateSpaceCannonOffense();
  const defenderSpaceCannonOffenseHits = defenderSimulator.simulateSpaceCannonOffense();
  attackerSimulator.assignHitsToShips({
    numHits: defenderSpaceCannonOffenseHits,
  });
  defenderSimulator.assignHitsToShips({
    numHits: attackerSpaceCannonOffenseHits,
  });
}
