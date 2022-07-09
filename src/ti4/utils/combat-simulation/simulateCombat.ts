import { PlayerSimulator } from "../../entities/PlayerSimulator.class";
import { CombatStats } from "./CombatStats";
import { PlayerCombatInfo } from "./PlayerCombatInfo";
import { commitGroundForces } from "./steps/commitGroundForces";
import { establishControl } from "./steps/establishControl";
import { simulateAntiFighterBarrage } from "./steps/simulateAntiFighterBarrage";
import { simulateBombardment } from "./steps/simulateBombardment";
import { simulateDestructionOfExcessFightersThenGroundForces } from "./steps/simulateDestructionOfExcessFightersThenGroundForces";
import { simulateGroundCombat } from "./steps/simulateGroundCombat";
import { simulateSpaceCannonDefense } from "./steps/simulateSpaceCannonDefense";
import { simulateSpaceCannonOffense } from "./steps/simulateSpaceCannonOffense";
import { simulateSpaceCombat } from "./steps/simulateSpaceCombat";

export function simulateCombat(options: {
  player1: PlayerCombatInfo;
  player2: PlayerCombatInfo;
  planetId?: string | undefined;
  numSimulations?: number | undefined;
}) {
  return new Promise<CombatStats>((resolve, reject) => {
    setTimeout(() => {
      try {
        const { player1, player2, planetId, numSimulations = 10000 } = options;

        let attackingPlayer: "player1" | "player2" = "player1";
        if (planetId) {
          const doesZoneBelongToPlayer1 = !!player1.planets.get(planetId);
          const doesZoneBelongToPlayer2 = !!player2.planets.get(planetId);
          if (doesZoneBelongToPlayer1 && !doesZoneBelongToPlayer2) {
            attackingPlayer = "player2";
          } else if (!doesZoneBelongToPlayer1 && doesZoneBelongToPlayer2) {
            attackingPlayer = "player1";
          } else {
            throw new Error("Cannot determine attacker and defender.");
          }
        }

        const attacker = attackingPlayer === "player1" ? player1 : player2;
        const defender = attackingPlayer === "player1" ? player2 : player1;

        let attackerWinsSpace = 0;
        let attackerWinsGround = 0;
        let defenderWinsSpace = 0;
        let defenderWinsGround = 0;

        // simulate combat a number of times and record the results
        for (
          let simulationRound = 0;
          simulationRound < numSimulations;
          simulationRound++
        ) {
          const attackerSimulator = new PlayerSimulator(attacker);
          const defenderSimulator = new PlayerSimulator(defender);

          simulateSpaceCannonOffense({
            attackerSimulator,
            defenderSimulator,
          });

          simulateAntiFighterBarrage({
            attackerSimulator,
            defenderSimulator,
          });

          simulateSpaceCombat({
            attackerSimulator,
            defenderSimulator,
          });

          simulateDestructionOfExcessFightersThenGroundForces({
            attackerSimulator,
            defenderSimulator,
          });

          // register stats for space combat
          if (
            attackerSimulator.hasUnitsRemainingInSpace() &&
            !defenderSimulator.hasUnitsRemainingInSpace()
          ) {
            attackerWinsSpace += 1;
          } else if (
            !attackerSimulator.hasUnitsRemainingInSpace() &&
            defenderSimulator.hasUnitsRemainingInSpace()
          ) {
            defenderWinsSpace += 1;
          }

          // invasion
          if (planetId) {
            simulateBombardment({
              attackerSimulator,
              defenderSimulator,
              planetId,
            });

            commitGroundForces({
              attackerSimulator,
              planetId,
            });

            simulateSpaceCannonDefense({
              attackerSimulator,
              defenderSimulator,
              planetId,
            });

            simulateGroundCombat({
              attackerSimulator,
              defenderSimulator,
              planetId,
            });

            establishControl({
              attackerSimulator,
              defenderSimulator,
              planetId,
            });

            // register stats for invasion
            if (
              attackerSimulator.hasUnitsRemainingOnPlanet({
                planetId,
              }) &&
              !defenderSimulator.hasUnitsRemainingOnPlanet({
                planetId,
              })
            ) {
              attackerWinsGround += 1;
            } else if (
              !attackerSimulator.hasUnitsRemainingOnPlanet({
                planetId,
              })
            ) {
              // defender wins on a tie
              defenderWinsGround += 1;
            }
          }
        }

        const attackerCombatStats = {
          winSpacePerc: (attackerWinsSpace / numSimulations) * 100,
          winGroundPerc: (attackerWinsGround / numSimulations) * 100,
        };
        const defenderCombatStats = {
          winSpacePerc: (defenderWinsSpace / numSimulations) * 100,
          winGroundPerc: (defenderWinsGround / numSimulations) * 100,
        };

        const combatStats: CombatStats = {
          player1:
            attackingPlayer === "player1"
              ? attackerCombatStats
              : defenderCombatStats,
          player2:
            attackingPlayer === "player2"
              ? attackerCombatStats
              : defenderCombatStats,
          tieSpacePerc:
            ((numSimulations - (attackerWinsSpace + defenderWinsSpace)) /
              numSimulations) *
            100,
        };
        resolve(combatStats);
      } catch (e) {
        if (e instanceof Error) {
          reject(e.message);
        } else {
          reject("Unknown error structure.");
        }
      }
    }, 1000);
  });
}
