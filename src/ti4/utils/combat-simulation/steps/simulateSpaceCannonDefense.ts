import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";

/**
 * Simulates the space cannon defense step of an invasion.
 * Throws an error if the given planetId does not belong to the defending player.
 */
export function simulateSpaceCannonDefense(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
  planetId: string;
}) {
  const { attackerSimulator, defenderSimulator, planetId } = options;

  if (defenderSimulator.doesPlanetExist({ planetId })) {
    // space cannon defense
    const spaceCannonDefenseHits = defenderSimulator.simulateSpaceCannonDefense(
      { planetId }
    );
    attackerSimulator.assignHitsToGroundForces({
      numHits: spaceCannonDefenseHits,
      planetId,
    });
  } else {
    throw new Error(`Space Cannon Defense: defender does not own planet.`);
  }
}
