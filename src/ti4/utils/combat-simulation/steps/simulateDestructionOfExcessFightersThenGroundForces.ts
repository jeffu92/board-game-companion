import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";

export function simulateDestructionOfExcessFightersThenGroundForces(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
}) {
  const { attackerSimulator, defenderSimulator } = options;

  // winner destroys any excess fighters or ground forces in the space area
  if (attackerSimulator.hasUnitsRemainingInSpace()) {
    attackerSimulator.destroyExcessFightersThenGroundForces();
  }
  if (defenderSimulator.hasUnitsRemainingInSpace()) {
    defenderSimulator.destroyExcessFightersThenGroundForces();
  }
}
