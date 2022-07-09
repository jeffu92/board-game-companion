import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";

/**
 * Simulates the establish control step of an invasion.
 * Throws an error if the given one or both of the simulators aren't aware of the planet.
 */
export function establishControl(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
  planetId: string;
}) {
  const { attackerSimulator, defenderSimulator, planetId } = options;

  if (
    attackerSimulator.doesPlanetExist({ planetId }) &&
    defenderSimulator.doesPlanetExist({ planetId })
  ) {
    // establish control (destroy non-ground combat units)
    attackerSimulator.destroyStructuresIfNoGroundForces({
      planetId,
    });
    defenderSimulator.destroyStructuresIfNoGroundForces({
      planetId,
    });
  } else {
    throw new Error(
      `Establish Control: one or both of the player simulators aren't aware of the planet.`
    );
  }
}
