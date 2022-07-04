import { Immutable } from "immer";
import { Faction } from "../classes/factions/Faction.class";
import { PlayerSimulator } from "../classes/PlayerSimulator.class";
import { Unit } from "../classes/units/Unit.class";
import { UnitEnum } from "../enums/Unit.enum";

export interface CombatStats {
  player1: {
    winSpacePerc: number;
    winGroundPerc: number;
  };
  player2: {
    winSpacePerc: number;
    winGroundPerc: number;
  };
  tieSpacePerc: number;
}

export function simulateCombat(options: {
  player1: {
    faction: Immutable<Faction>;
    space: Immutable<Map<string, Unit>>;
    planets: Immutable<Map<string, Map<string, Unit>>>;
  };
  player2: {
    faction: Immutable<Faction>;
    space: Immutable<Map<string, Unit>>;
    planets: Immutable<Map<string, Map<string, Unit>>>;
  };
  planetId?: string | undefined;
}) {
  return new Promise<CombatStats>((resolve) => {
    setTimeout(() => {
      const { player1, player2, planetId } = options;
      const numSimulations = 10000;

      let player1WinsSpace = 0;
      let player1WinsGround = 0;
      let player2WinsSpace = 0;
      let player2WinsGround = 0;

      // simulate combat a number of times and record the results
      for (
        let simulationRound = 0;
        simulationRound < numSimulations;
        simulationRound++
      ) {
        const player1Simulator = new PlayerSimulator(player1);
        const player2Simulator = new PlayerSimulator(player2);

        // space cannon offense
        const player1SpaceCannonOffenseHits = player1Simulator.simulateSpaceCannonOffense();
        const player2SpaceCannonOffenseHits = player2Simulator.simulateSpaceCannonOffense();
        player1Simulator.assignHitsToShips({
          numHits: player2SpaceCannonOffenseHits,
        });
        player2Simulator.assignHitsToShips({
          numHits: player1SpaceCannonOffenseHits,
        });

        // anti-fighter barrage
        const player1AntiFighterBarrageHits = player1Simulator.simulateAntiFighterBarrage();
        const player2AntiFighterBarrageHits = player2Simulator.simulateAntiFighterBarrage();
        player1Simulator.assignHitsToShips({
          numHits: player2AntiFighterBarrageHits,
          unitEnum: UnitEnum.FIGHTER,
        });
        player2Simulator.assignHitsToShips({
          numHits: player1AntiFighterBarrageHits,
          unitEnum: UnitEnum.FIGHTER,
        });

        // setup global combat variables
        const player1UnitRollModifiers: Array<(unit: Unit) => number> = [];
        if (player1.faction.getCombatRollModifier) {
          player1UnitRollModifiers.push(player1.faction.getCombatRollModifier);
        }
        const player2UnitRollModifiers: Array<(unit: Unit) => number> = [];
        if (player2.faction.getCombatRollModifier) {
          player2UnitRollModifiers.push(player2.faction.getCombatRollModifier);
        }

        // space combat
        while (
          player1Simulator.hasShipsRemainingInSpace &&
          player2Simulator.hasShipsRemainingInSpace
        ) {
          const remainingPlayer1UnitHits = player1Simulator.simulateSpaceCombat(
            {
              rollModifiers: player1UnitRollModifiers,
            }
          );
          const remainingPlayer2UnitHits = player2Simulator.simulateSpaceCombat(
            {
              rollModifiers: player2UnitRollModifiers,
            }
          );
          player1Simulator.assignHitsToShips({
            numHits: remainingPlayer2UnitHits,
          });
          player2Simulator.assignHitsToShips({
            numHits: remainingPlayer1UnitHits,
          });
        }

        // winner destroys any excess fighters or ground forces in the space area
        if (player1Simulator.hasUnitsRemainingInSpace()) {
          player1Simulator.destroyExcessFightersThenGroundForces();
        }
        if (player2Simulator.hasUnitsRemainingInSpace()) {
          player2Simulator.destroyExcessFightersThenGroundForces();
        }

        // register stats for space combat
        if (
          player1Simulator.hasUnitsRemainingInSpace() &&
          !player2Simulator.hasUnitsRemainingInSpace()
        ) {
          player1WinsSpace += 1;
        } else if (
          !player1Simulator.hasUnitsRemainingInSpace() &&
          player2Simulator.hasUnitsRemainingInSpace()
        ) {
          player2WinsSpace += 1;
        }

        // invasion
        if (planetId) {
          const isPlayer1Invading = player2Simulator.doesPlanetExist({
            planetId,
          });
          const invadingPlayerSimulator = isPlayer1Invading
            ? player1Simulator
            : player2Simulator;
          const defendingPlayerSimulator = isPlayer1Invading
            ? player2Simulator
            : player1Simulator;
          const invadingPlayerUnitRollModifiers = isPlayer1Invading
            ? player1UnitRollModifiers
            : player2UnitRollModifiers;
          const defendingPlayerUnitRollModifiers = isPlayer1Invading
            ? player2UnitRollModifiers
            : player1UnitRollModifiers;

          // bombardment
          if (
            invadingPlayerSimulator.doesSpaceIgnorePlanetaryShield() ||
            !defendingPlayerSimulator.doesPlanetHavePlanetaryShield({
              planetId,
            })
          ) {
            const bombardmentHits = invadingPlayerSimulator.simulateBombardment();
            defendingPlayerSimulator.assignHitsToGroundForces({
              numHits: bombardmentHits,
              planetId,
            });
          }

          // commit ground forces
          invadingPlayerSimulator.commitGroundForces({ planetId });

          // space cannon defense
          const spaceCannonDefenseHits = defendingPlayerSimulator.simulateSpaceCannonDefense(
            { planetId }
          );
          invadingPlayerSimulator.assignHitsToGroundForces({
            numHits: spaceCannonDefenseHits,
            planetId,
          });

          // ground combat
          while (
            invadingPlayerSimulator.hasGroundForcesRemainingOnPlanet({
              planetId,
            }) &&
            defendingPlayerSimulator.hasGroundForcesRemainingOnPlanet({
              planetId,
            })
          ) {
            const remainingInvadingUnitHits = invadingPlayerSimulator.simulateGroundCombat(
              {
                planetId,
                rollModifiers: invadingPlayerUnitRollModifiers,
              }
            );
            const remainingDefendingUnitHits = defendingPlayerSimulator.simulateGroundCombat(
              {
                planetId,
                rollModifiers: defendingPlayerUnitRollModifiers,
              }
            );

            invadingPlayerSimulator.assignHitsToGroundForces({
              planetId,
              numHits: remainingDefendingUnitHits,
            });
            defendingPlayerSimulator.assignHitsToGroundForces({
              planetId,
              numHits: remainingInvadingUnitHits,
            });
          }

          // establish control (destroy non-ground combat units)
          invadingPlayerSimulator.destroyStructuresIfNoGroundForces({
            planetId,
          });
          defendingPlayerSimulator.destroyStructuresIfNoGroundForces({
            planetId,
          });

          // register stats for invasion
          if (
            invadingPlayerSimulator.hasUnitsRemainingOnPlanet({
              planetId,
            }) &&
            !defendingPlayerSimulator.hasUnitsRemainingOnPlanet({
              planetId,
            })
          ) {
            if (isPlayer1Invading) {
              player1WinsGround += 1;
            } else {
              player2WinsGround += 1;
            }
          } else if (
            !invadingPlayerSimulator.hasUnitsRemainingOnPlanet({
              planetId,
            })
          ) {
            // defender wins on a tie
            if (isPlayer1Invading) {
              player2WinsGround += 1;
            } else {
              player1WinsGround += 1;
            }
          }
        }
      }

      const combatStats: CombatStats = {
        player1: {
          winSpacePerc: (player1WinsSpace / numSimulations) * 100,
          winGroundPerc: (player1WinsGround / numSimulations) * 100,
        },
        player2: {
          winSpacePerc: (player2WinsSpace / numSimulations) * 100,
          winGroundPerc: (player2WinsGround / numSimulations) * 100,
        },
        tieSpacePerc:
          ((numSimulations - (player1WinsSpace + player2WinsSpace)) /
            numSimulations) *
          100,
      };
      resolve(combatStats);
    }, 1000);
  });
}
