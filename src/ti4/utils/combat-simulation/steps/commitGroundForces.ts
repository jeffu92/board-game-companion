import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";

/**
 * Simulates the commit ground forces step of an invasion.
 */
export function commitGroundForces(options: {
  attackerSimulator: PlayerSimulator;
  planetId: string;
}) {
  const { attackerSimulator, planetId } = options;

  // commit ground forces
  attackerSimulator.commitGroundForces({ planetId });
}
