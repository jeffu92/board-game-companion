import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";

/**
 * Simulates the bombardment step of an invasion.
 * Throws an error if the given planetId does not belong to the defending player.
 */
export function simulateBombardment(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
  planetId: string;
}) {
  const { attackerSimulator, defenderSimulator, planetId } = options;

  if (defenderSimulator.doesPlanetExist({ planetId })) {
    if (
      attackerSimulator.doesSpaceIgnorePlanetaryShield() ||
      !defenderSimulator.doesPlanetHavePlanetaryShield({
        planetId,
      })
    ) {
      // bombardment
      const bombardmentHits = attackerSimulator.simulateBombardment();
      defenderSimulator.assignHitsToGroundForces({
        numHits: bombardmentHits,
        planetId,
      });
    }
  } else {
    throw new Error(`Bombardment: defender does not own planet.`);
  }
}
