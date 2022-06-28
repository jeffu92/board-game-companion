import { Fleet } from "../classes/Fleet.class";
import { Unit } from "../classes/units/Unit.class";
import { UnitEnum } from "../enums/Unit.enum";

export interface CombatStats {
  attackers: {
    winPerc: number;
  };
  defenders: {
    winPerc: number;
  };
  tiePerc: number;
}

export const simulateCombat: (
  attackingUnits: Map<string, Unit>,
  defendingUnits: Map<string, Unit>
) => CombatStats = (attackingUnits, defendingUnits) => {
  const numSimulations = 10000;

  let attackerWins = 0;
  let defenderWins = 0;

  // simulate combat a number of times and record the results
  for (
    let simulationRound = 0;
    simulationRound < numSimulations;
    simulationRound++
  ) {
    const attackingFleet = new Fleet({ units: attackingUnits });
    const defendingFleet = new Fleet({ units: defendingUnits });

    // generate anti-fighter barrage hits for both sides
    const attackerAntiFighterBarrageHits = attackingFleet.simulateAntiFighterBarrage();
    const defenderAntiFighterBarrageHits = defendingFleet.simulateAntiFighterBarrage();
    attackingFleet.hit(defenderAntiFighterBarrageHits, UnitEnum.FIGHTER);
    defendingFleet.hit(attackerAntiFighterBarrageHits, UnitEnum.FIGHTER);

    // while there are units left on both sides
    while (attackingFleet.length > 0 && defendingFleet.length > 0) {
      // generate hits for both sides
      const remainingAttackingUnitHits = attackingFleet.simulateCombat();
      const remainingDefendingUnitHits = defendingFleet.simulateCombat();
      attackingFleet.hit(remainingDefendingUnitHits);
      defendingFleet.hit(remainingAttackingUnitHits);
    }

    if (attackingFleet.length > 0 && defendingFleet.length === 0) {
      attackerWins += 1;
    } else if (attackingFleet.length === 0 && defendingFleet.length > 0) {
      defenderWins += 1;
    }
  }

  const result: CombatStats = {
    attackers: {
      winPerc: (attackerWins / numSimulations) * 100,
    },
    defenders: {
      winPerc: (defenderWins / numSimulations) * 100,
    },
    tiePerc:
      ((numSimulations - (attackerWins + defenderWins)) / numSimulations) * 100,
  };
  return result;
};
