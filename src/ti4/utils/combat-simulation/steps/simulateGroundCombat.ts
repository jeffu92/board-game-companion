import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";

/**
 * Simulates the ground combat step of an invasion.
 * Throws an error if the given one or both of the simulators aren't aware of the planet.
 */
export function simulateGroundCombat(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
  planetId: string;
}) {
  const { attackerSimulator, defenderSimulator, planetId } = options;

  if (
    attackerSimulator.doesPlanetExist({ planetId }) &&
    defenderSimulator.doesPlanetExist({ planetId })
  ) {
    // ground combat
    for (
      let round = 1;
      attackerSimulator.hasGroundForcesRemainingOnPlanet({
        planetId,
      }) &&
      defenderSimulator.hasGroundForcesRemainingOnPlanet({
        planetId,
      });
      round++
    ) {
      const remainingInvadingUnitHits = attackerSimulator.simulateGroundCombat({
        planetId,
        round,
      });
      const remainingDefendingUnitHits = defenderSimulator.simulateGroundCombat(
        {
          planetId,
          round,
        }
      );

      attackerSimulator.assignHitsToGroundForces({
        planetId,
        numHits: remainingDefendingUnitHits,
      });
      defenderSimulator.assignHitsToGroundForces({
        planetId,
        numHits: remainingInvadingUnitHits,
      });
    }
  } else {
    throw new Error(
      `Ground Combat: one or both of the player simulators aren't aware of the planet.`
    );
  }
}
