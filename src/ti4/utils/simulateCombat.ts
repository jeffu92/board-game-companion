import { Faction } from "../classes/factions/Faction.class";
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
  attacker: {
    faction: Faction;
    units: Map<string, Unit>;
  },
  defender: {
    faction: Faction;
    units: Map<string, Unit>;
  }
) => CombatStats = (attacker, defender) => {
  const numSimulations = 10000;

  let attackerWins = 0;
  let defenderWins = 0;

  // simulate combat a number of times and record the results
  for (
    let simulationRound = 0;
    simulationRound < numSimulations;
    simulationRound++
  ) {
    const attackingFleet = new Fleet(attacker);
    const defendingFleet = new Fleet(defender);

    // generate anti-fighter barrage hits for both sides
    const attackerAntiFighterBarrageHits = attackingFleet.simulateAntiFighterBarrage();
    const defenderAntiFighterBarrageHits = defendingFleet.simulateAntiFighterBarrage();
    attackingFleet.assignHits(defenderAntiFighterBarrageHits, UnitEnum.FIGHTER);
    defendingFleet.assignHits(attackerAntiFighterBarrageHits, UnitEnum.FIGHTER);

    // while there are units left on both sides
    while (
      attackingFleet.hasUnitsRemaining &&
      defendingFleet.hasUnitsRemaining
    ) {
      // generate hits for both sides
      const attackingUnitRollModifiers: Array<(unit: Unit) => number> = [];
      if (attacker.faction.getCombatRollModifier) {
        attackingUnitRollModifiers.push(attacker.faction.getCombatRollModifier);
      }
      const remainingAttackingUnitHits = attackingFleet.simulateCombat({
        rollModifiers: attackingUnitRollModifiers,
      });

      const defendingUnitRollModifiers: Array<(unit: Unit) => number> = [];
      if (defender.faction.getCombatRollModifier) {
        defendingUnitRollModifiers.push(defender.faction.getCombatRollModifier);
      }
      const remainingDefendingUnitHits = defendingFleet.simulateCombat({
        rollModifiers: defendingUnitRollModifiers,
      });

      attackingFleet.assignHits(remainingDefendingUnitHits);
      defendingFleet.assignHits(remainingAttackingUnitHits);
    }

    if (attackingFleet.hasUnitsRemaining && !defendingFleet.hasUnitsRemaining) {
      attackerWins += 1;
    } else if (
      !attackingFleet.hasUnitsRemaining &&
      defendingFleet.hasUnitsRemaining
    ) {
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
