import { UnitEnum } from "../enums/Unit.enum";
import { CombatDiceRollModifer, Unit } from "./units/Unit.class";
import { Immutable } from "immer";
import { v4 as uuidv4 } from "uuid";

/**
 * Sorts an array of units in ascending order of ground combat rating.
 * Weaker units -> Stronger units.
 * @param a First unit
 * @param b Second unit
 * @returns A number, if greater than 0, sort a before b
 */
const compareBySpaceCombatRating = (a: [string, Unit], b: [string, Unit]) => {
  return a[1].spaceCombatRating - b[1].spaceCombatRating;
};

/**
 * Sorts an array of units in ascending order of ground combat rating.
 * Weaker units -> Stronger units.
 * @param a First unit
 * @param b Second unit
 * @returns A number, if greater than 0, sort a before b
 */
const compareByGroundCombatRating = (a: [string, Unit], b: [string, Unit]) => {
  return a[1].groundCombatRating - b[1].groundCombatRating;
};

/**
 * Returns an array of unit IDs. The array is sorted in the order in which a rational player would assign hits.
 */
const getSpaceHitAssignmentOrder: (units: Map<string, Unit>) => string[] = (
  units
) => {
  const ships = Array.from(units.entries()).filter(([_, unit]) => unit.isShip);

  return getHitAssignmentOrder(ships, compareBySpaceCombatRating);
};

/**
 * Returns an array of unit IDs. The array is sorted in the order in which a rational player would assign hits.
 */
const getGroundHitAssignmentOrder: (units: Map<string, Unit>) => string[] = (
  units
) => {
  const groundForces = Array.from(units.entries()).filter(
    ([_, unit]) => unit.isGroundForce
  );

  return getHitAssignmentOrder(groundForces, compareByGroundCombatRating);
};

/**
 * Returns an array of unit IDs. The array is sorted in the order in which a rational player would assign hits.
 */
const getHitAssignmentOrder: (
  units: [string, Unit][],
  compare: (a: [string, Unit], b: [string, Unit]) => number
) => string[] = (units, compare) => {
  let sustainDamageUnits: Array<[string, Unit]> = [];
  let allUnits: Array<[string, Unit]> = [];

  units.forEach((unit) => {
    if (unit[1].isEligibleForSustainDamage) {
      sustainDamageUnits.push(unit);
    }

    // add sustain damage units to this list again in case they should be hit multiple times
    allUnits.push(unit);
  });

  sustainDamageUnits.sort(compare);
  allUnits.sort(compare);

  // assign hits to units that can sustain damage before units that can't
  return sustainDamageUnits.concat(allUnits).map(([id, _]) => id);
};

export class PlayerSimulator {
  private _space: Map<string, Unit> = new Map<string, Unit>();
  private _planets: Map<string, Map<string, Unit>> = new Map<
    string,
    Map<string, Unit>
  >();

  constructor(options: {
    space: Immutable<Map<string, Unit>>;
    planets: Immutable<Map<string, Map<string, Unit>>>;
  }) {
    // deep copy space
    options.space.forEach((unit, id) => {
      this._space.set(id, Unit.copy(unit));
    });
    // deep copy planets
    options.planets.forEach((planet, planetId) => {
      const planetCopy = new Map<string, Unit>();
      planet.forEach((unit, unitId) => {
        planetCopy.set(unitId, Unit.copy(unit));
      });
      this._planets.set(planetId, planetCopy);
    });
  }

  private numUnitsRemaining(options: {
    units: Map<string, Unit>;
    filter?: ((unit: Unit) => boolean) | undefined;
  }) {
    const { units, filter } = options;
    if (filter) {
      return Array.from(units).filter(([_, unit]) => filter(unit)).length;
    } else {
      return units.size;
    }
  }

  private numUnitsRemainingInSpace(options: {
    filter?: (unit: Unit) => boolean;
  }) {
    return this.numUnitsRemaining({
      units: this._space,
      filter: options.filter,
    });
  }

  hasUnitsRemainingInSpace(options: { filter?: (unit: Unit) => boolean } = {}) {
    return this.numUnitsRemainingInSpace(options) > 0;
  }

  get hasShipsRemainingInSpace() {
    return this.hasUnitsRemainingInSpace({
      filter: (unit: Unit) => unit.isShip,
    });
  }

  private numUnitsRemainingOnPlanet(options: {
    planetId: string;
    filter?: (unit: Unit) => boolean;
  }) {
    const { planetId, filter } = options;
    const planet = this._planets.get(planetId);
    if (planet) {
      return this.numUnitsRemaining({
        units: planet,
        filter,
      });
    } else {
      return 0;
    }
  }

  hasUnitsRemainingOnPlanet(options: {
    planetId: string;
    filter?: (unit: Unit) => boolean;
  }) {
    return this.numUnitsRemainingOnPlanet(options) > 0;
  }

  hasGroundForcesRemainingOnPlanet(options: { planetId: string }) {
    return this.hasUnitsRemainingOnPlanet({
      planetId: options.planetId,
      filter: (unit: Unit) => unit.isGroundForce,
    });
  }

  destroyStructuresIfNoGroundForces(options: { planetId: string }) {
    const hasGroundForcesRemainingOnPlanet = this.hasGroundForcesRemainingOnPlanet(
      {
        planetId: options.planetId,
      }
    );

    if (!hasGroundForcesRemainingOnPlanet) {
      const structureIds: string[] = [];
      const planet = this._planets.get(options.planetId);
      planet?.forEach((unit, unitId) => {
        if (unit.isStructure) {
          structureIds.push(unitId);
        }
      });
      structureIds.forEach((structureId) => {
        planet?.delete(structureId);
      });
    }
  }

  assignHitsToShips(options: { numHits: number; unitEnum?: UnitEnum }) {
    const units = this._space;
    this.assignHits({
      numHits: options.numHits,
      units,
      unitEnum: options.unitEnum,
      getHitAssignmentOrder: () => {
        return getSpaceHitAssignmentOrder(units);
      },
    });
  }

  assignHitsToGroundForces(options: { numHits: number; planetId: string }) {
    const units = this._planets.get(options.planetId);
    if (units) {
      this.assignHits({
        numHits: options.numHits,
        units,
        getHitAssignmentOrder: () => {
          return getGroundHitAssignmentOrder(units);
        },
      });
    }
  }

  assignHits(options: {
    numHits: number;
    units: Map<string, Unit>;
    unitEnum?: UnitEnum | undefined;
    getHitAssignmentOrder: () => string[];
  }) {
    const { numHits, units, unitEnum, getHitAssignmentOrder } = options;

    // reevaluate hit assignment order
    let hitAssignmentOrder = getHitAssignmentOrder();

    if (unitEnum) {
      // if hits should be assigned to a particular unit type, filter out other units
      hitAssignmentOrder = hitAssignmentOrder.filter((id) => {
        return units.get(id)?.unitEnum === unitEnum;
      });
    }

    for (let i = 0; i < numHits && i < hitAssignmentOrder.length; i++) {
      // assign hits in hit assignment order
      const hitUnitId = hitAssignmentOrder[i];
      if (hitUnitId) {
        const hitUnit = units.get(hitUnitId);
        if (hitUnit?.isEligibleForSustainDamage) {
          hitUnit.sustainDamage();
        } else {
          units.delete(hitUnitId);
        }
      }
    }
  }

  /**
   * Simulates anti-fighter barrage for this fleet.
   * @returns The number of hits generated by all units in this fleet that have anti-fighter barrage.
   */
  simulateAntiFighterBarrage: () => number = () => {
    let numHits = 0;
    this._space.forEach((unit) => {
      numHits += unit.simulateAntiFighterBarrage();
    });
    return numHits;
  };

  /**
   * Simulates anti-fighter barrage for this fleet.
   * @returns The number of hits generated by all units in this fleet that have anti-fighter barrage.
   */
  simulateBombardment: () => number = () => {
    let numHits = 0;
    this._space.forEach((unit) => {
      numHits += unit.simulateBombardment();
    });
    return numHits;
  };

  /**
   * Simulates a round of space combat using units in space.
   * @returns The number of hits generated by all units in this fleet that can participate in combat.
   */
  simulateSpaceCombat: (options: {
    rollModifiers?: Array<CombatDiceRollModifer>;
  }) => number = (options = {}) => {
    let numHits = 0;
    this._space.forEach((unit) => {
      numHits += unit.simulateSpaceCombat(options);
    });
    return numHits;
  };

  /**
   * Simulates a round of ground combat using units from a given planet.
   * @returns The number of hits generated by all units in this fleet that can participate in combat.
   */
  simulateGroundCombat: (options: {
    planetId: string;
    rollModifiers?: Array<CombatDiceRollModifer>;
  }) => number = (options) => {
    let numHits = 0;
    this._planets.get(options.planetId)?.forEach((unit) => {
      numHits += unit.simulateGroundCombat({
        rollModifiers: options.rollModifiers,
      });
    });
    return numHits;
  };

  /**
   * Simulates a round of combat for this fleet.
   * @returns The number of hits generated by all units in this fleet that can participate in combat.
   */
  simulateSpaceCannonOffense: () => number = () => {
    let numHits = 0;
    this._space.forEach((unit) => {
      numHits += unit.simulateSpaceCannon();
    });
    this._planets.forEach((planet) => {
      planet.forEach((unit) => {
        numHits += unit.simulateSpaceCannon();
      });
    });
    return numHits;
  };

  /**
   * Simulates a round of combat for this fleet.
   * @returns The number of hits generated by all units in this fleet that can participate in combat.
   */
  simulateSpaceCannonDefense: (options: { planetId: string }) => number = (
    options
  ) => {
    let numHits = 0;
    this._planets.get(options.planetId)?.forEach((unit) => {
      numHits += unit.simulateSpaceCannon();
    });
    return numHits;
  };

  private countSpaceCapacity: () => number = () => {
    let capacity = 0;
    this._space.forEach((unit) => {
      capacity += unit.capacity ?? 0;
    });
    return capacity;
  };

  private getAllUnitsInSpace: (options: { unit: UnitEnum }) => string[] = (
    options
  ) => {
    const fighterIds: string[] = [];
    this._space.forEach((unit, id) => {
      if (unit.unitEnum === options.unit) {
        fighterIds.push(id);
      }
    });
    return fighterIds;
  };

  destroyExcessFightersThenGroundForces: () => void = () => {
    const capacity = this.countSpaceCapacity();
    const fighterIds = this.getAllUnitsInSpace({ unit: UnitEnum.FIGHTER });
    const infantryIds = this.getAllUnitsInSpace({ unit: UnitEnum.INFANTRY });
    const numUnitsRequiringCapacity = fighterIds.length + infantryIds.length;
    if (capacity < numUnitsRequiringCapacity) {
      const numUnitsToRemove = numUnitsRequiringCapacity - capacity;
      const unitsToRemoveInRemovalOrder: string[] = fighterIds.concat(
        infantryIds
      );
      for (let i = 0; i < numUnitsToRemove; i++) {
        const unitIdToRemove = unitsToRemoveInRemovalOrder[i];
        if (unitIdToRemove) {
          this._space.delete(unitIdToRemove);
        }
      }
    }
  };

  doesPlanetHavePlanetaryShield(options: { planetId: string }) {
    let doesPlanetHavePlanetaryShield = false;

    this._planets.get(options.planetId)?.forEach((unit) => {
      doesPlanetHavePlanetaryShield =
        doesPlanetHavePlanetaryShield || !!unit.providesPlanetaryShield;
    });

    return doesPlanetHavePlanetaryShield;
  }

  doesPlanetExist(options: { planetId: string }) {
    return !!this._planets.get(options.planetId);
  }

  doesSpaceIgnorePlanetaryShield() {
    let doesSpaceIgnorePlanetaryShield = false;

    this._space.forEach((unit) => {
      doesSpaceIgnorePlanetaryShield =
        doesSpaceIgnorePlanetaryShield || !!unit.ignoresPlanetaryShield;
    });

    return doesSpaceIgnorePlanetaryShield;
  }

  commitGroundForces(options: { planetId: string }) {
    // get the units to commit from space
    const groundForces = Array.from(this._space).filter(([_, unit]) => {
      return unit.isGroundForce;
    });

    // add those units to the planet
    this.addUnitsToPlanet({
      units: groundForces,
      planetId: options.planetId,
    });

    // remove units from space
    groundForces.forEach(([id]) => {
      this._space.delete(id);
    });
  }

  private addUnitsToPlanet(options: {
    units: [string, Unit][];
    planetId?: string;
  }) {
    const planetId = options.planetId ?? uuidv4();
    const planet = this._planets.get(planetId);
    if (planet) {
      options.units.forEach(([id, unit]) => {
        planet.set(id, Unit.copy(unit));
      });
    } else {
      this._planets.set(planetId, new Map<string, Unit>());
      options.units.forEach(([id, unit]) => {
        this._planets.get(planetId)?.set(id, Unit.copy(unit));
      });
    }
  }
}
