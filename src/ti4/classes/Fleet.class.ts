import { UnitEnum } from "../enums/Unit.enum";
import { Unit } from "./units/Unit.class";
import { v4 as uuidv4 } from "uuid";

/**
 * Sorts an array of units in ascending order of combat rating.
 * Weaker units -> Stronger units.
 * @param a First unit
 * @param b Second unit
 * @returns A number, if greater than 0, sort a before b
 */
const compareByCombatRating = (a: [string, Unit], b: [string, Unit]) => {
  return a[1].combatRating - b[1].combatRating;
};

/**
 * Returns an array of unit IDs. The array is sorted in the order in which a rational player would assign hits.
 */
const getHitAssignmentOrder: (unitMap: Map<string, Unit>) => string[] = (
  unitMap
) => {
  const unitEntries = Array.from(unitMap.entries());
  let sustainDamageUnitEntries: Array<[string, Unit]> = [];
  let nonSustainDamageUnitEntries: Array<[string, Unit]> = [];

  unitEntries.forEach((unitEntry) => {
    if (unitEntry[1].isEligibleForSustainDamage) {
      sustainDamageUnitEntries.push(unitEntry);
    } else {
      nonSustainDamageUnitEntries.push(unitEntry);
    }
  });

  sustainDamageUnitEntries.sort(compareByCombatRating);
  nonSustainDamageUnitEntries.sort(compareByCombatRating);

  // assign hits to units that can sustain damage before units that can't
  return sustainDamageUnitEntries
    .concat(nonSustainDamageUnitEntries)
    .map(([id, _]) => id);
};

export class Fleet {
  private _units: Map<string, Unit> = new Map<string, Unit>();
  private _hitAssignmentOrder: string[] = [];

  constructor(options?: { units: Map<string, Unit> }) {
    const units = options?.units;
    if (units) {
      // deep copy
      this._units = new Map<string, Unit>(
        Array.from(units?.entries()).map(([id, unit]) => [id, Unit.copy(unit)])
      );
      this._hitAssignmentOrder = getHitAssignmentOrder(this._units);
    }
  }

  get numUnitsRemaining() {
    return this._hitAssignmentOrder.length;
  }

  get hasUnitsRemaining() {
    return this.numUnitsRemaining > 0;
  }

  /**
   * Adds a unit to the fleet.
   * @param unit - Unit to add.
   */
  add(unit: Unit) {
    const unitCopy = Unit.copy(unit);
    const unitId = uuidv4();
    this._units.set(unitId, unitCopy);
    this._hitAssignmentOrder = getHitAssignmentOrder(this._units);
  }

  /**
   * Assigns hits to units in this fleet in hit assignment order.
   * @param numHits - Number of hits to apply.
   * @param unitEnum - Type of unit to apply hits to. Other types of units won't be hit.
   */
  assignHits(numHits: number = 1, unitEnum?: UnitEnum) {
    let hitAssignmentOrder = this._hitAssignmentOrder;
    if (unitEnum) {
      // if hits should be assigned to a particular unit type, filter out other units
      hitAssignmentOrder = hitAssignmentOrder.filter((id) => {
        return this._units.get(id)?.unitEnum === unitEnum;
      });
    }

    for (let i = 0; i < numHits && i < hitAssignmentOrder.length; i++) {
      // assign hits in hit assignment order
      const hitUnitId = hitAssignmentOrder[i];
      if (hitUnitId) {
        const hitUnit = this._units.get(hitUnitId);
        if (hitUnit?.isEligibleForSustainDamage) {
          hitUnit.sustainDamage();
        } else {
          this._units.delete(hitUnitId);
        }
      }
    }

    // reevaluate hit assignment order
    this._hitAssignmentOrder = getHitAssignmentOrder(this._units);
  }

  /**
   * Simulates anti-fighter barrage for this fleet.
   * @returns The number of hits generated by all units in this fleet that have anti-fighter barrage.
   */
  simulateAntiFighterBarrage: () => number = () => {
    let numHits = 0;
    this._units.forEach((unit) => {
      numHits += unit.simulateAntiFighterBarrage();
    });
    return numHits;
  };

  /**
   * Simulates a round of combat for this fleet.
   * @returns The number of hits generated by all units in this fleet that can participate in combat.
   */
  simulateCombat: () => number = () => {
    let numHits = 0;
    this._units.forEach((unit) => {
      numHits += unit.simulateCombat();
    });
    return numHits;
  };
}
