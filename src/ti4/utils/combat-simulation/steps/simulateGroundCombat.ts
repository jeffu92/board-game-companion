import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";
import { getAllCombatHooks } from "../hooks/getAllCombatHooks";

type GroundCombatSimulationHooks = Pick<
  ReturnType<typeof getAllCombatHooks>,
  "attackerGlobalUnitRollModifiers" | "defenderGlobalUnitRollModifiers"
>;

/**
 * Simulates the ground combat step of an invasion.
 * Throws an error if the given one or both of the simulators aren't aware of the planet.
 */
export function simulateGroundCombat(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
  planetId: string;
  hooks: GroundCombatSimulationHooks;
}) {
  const { attackerSimulator, defenderSimulator, planetId, hooks } = options;

  if (
    attackerSimulator.doesPlanetExist({ planetId }) &&
    defenderSimulator.doesPlanetExist({ planetId })
  ) {
    // ground combat
    while (
      attackerSimulator.hasGroundForcesRemainingOnPlanet({
        planetId,
      }) &&
      defenderSimulator.hasGroundForcesRemainingOnPlanet({
        planetId,
      })
    ) {
      const remainingInvadingUnitHits = attackerSimulator.simulateGroundCombat({
        planetId,
        rollModifiers: hooks.attackerGlobalUnitRollModifiers,
      });
      const remainingDefendingUnitHits = defenderSimulator.simulateGroundCombat(
        {
          planetId,
          rollModifiers: hooks.defenderGlobalUnitRollModifiers,
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
