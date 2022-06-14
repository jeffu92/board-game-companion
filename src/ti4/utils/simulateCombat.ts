import { Unit } from "../classes/units/Unit.class";

export interface CombatStats {
  attackers: {
    winPerc: number;
  };
  defenders: {
    winPerc: number;
  };
  tiePerc: number;
}

const generateHits: (units: Unit[]) => number = (units) => {
  let numHits = 0;
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (unit) {
      numHits += unit.simulateCombat();
    }
  }
  return numHits;
};

/**
 * Sorts an array of units in descending order of combat rating.
 * @param a First unit
 * @param b Second unit
 * @returns A number, if greater than 0, sort a before b
 */
const compareByCombatRating = (a: Unit, b: Unit) => {
  return b.combatRating - a.combatRating;
};

const sortByHitAssignmentOrder: (units: Unit[]) => Unit[] = (units) => {
  let sustainDamageUnits: Unit[] = [];
  let nonSustainDamageUnits: Unit[] = [];

  units.forEach((unit) => {
    if (unit.isEligibleForSustainDamage) {
      sustainDamageUnits.push(unit);
    } else {
      nonSustainDamageUnits.push(unit);
    }
  });

  sustainDamageUnits.sort(compareByCombatRating);
  nonSustainDamageUnits.sort(compareByCombatRating);

  return sustainDamageUnits.concat(nonSustainDamageUnits);
};

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
    // initialize remaining units
    let remainingAttackingUnitsByHitAssignmentOrder = sortByHitAssignmentOrder(
      Array.from(attackingUnits.values()).map((unit) => Unit.copy(unit))
    );
    let remainingDefendingUnitsByHitAssignmentOrder = sortByHitAssignmentOrder(
      Array.from(defendingUnits.values()).map((unit) => Unit.copy(unit))
    );

    // while there are units left on both sides
    while (
      remainingAttackingUnitsByHitAssignmentOrder.length > 0 &&
      remainingDefendingUnitsByHitAssignmentOrder.length > 0
    ) {
      // generate hits for both sides
      const remainingAttackingUnitHits = generateHits(
        remainingAttackingUnitsByHitAssignmentOrder
      );
      const remainingDefendingUnitHits = generateHits(
        remainingDefendingUnitsByHitAssignmentOrder
      );

      // assign hits to both sides
      // assign hits to defenders
      const defendingUnitsThatSustainedDamage = [];
      for (let i = 0; i < remainingAttackingUnitHits; i++) {
        const hitUnit = remainingDefendingUnitsByHitAssignmentOrder.pop();
        if (hitUnit?.isEligibleForSustainDamage) {
          hitUnit.sustainDamage();
          defendingUnitsThatSustainedDamage.push(hitUnit);
        }
      }
      remainingDefendingUnitsByHitAssignmentOrder.push(
        ...defendingUnitsThatSustainedDamage
      );

      // assign hits to attackers
      const attackingUnitsThatSustainedDamage = [];
      for (let i = 0; i < remainingDefendingUnitHits; i++) {
        const hitUnit = remainingAttackingUnitsByHitAssignmentOrder.pop();
        if (hitUnit?.isEligibleForSustainDamage) {
          hitUnit.sustainDamage();
          attackingUnitsThatSustainedDamage.push(hitUnit);
        }
      }
      remainingAttackingUnitsByHitAssignmentOrder.push(
        ...attackingUnitsThatSustainedDamage
      );

      // reorder units on both sides by combat rating
      remainingAttackingUnitsByHitAssignmentOrder = sortByHitAssignmentOrder(
        remainingAttackingUnitsByHitAssignmentOrder
      );
      remainingDefendingUnitsByHitAssignmentOrder = sortByHitAssignmentOrder(
        remainingDefendingUnitsByHitAssignmentOrder
      );
    }

    if (
      remainingAttackingUnitsByHitAssignmentOrder.length > 0 &&
      remainingDefendingUnitsByHitAssignmentOrder.length === 0
    ) {
      attackerWins += 1;
    } else if (
      remainingAttackingUnitsByHitAssignmentOrder.length === 0 &&
      remainingDefendingUnitsByHitAssignmentOrder.length > 0
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
