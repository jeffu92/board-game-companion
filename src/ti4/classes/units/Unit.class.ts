import { immerable, Immutable } from "immer";
import { UnitEnum } from "../../enums/Unit.enum";
import { randomIntFromInterval } from "../../utils/randomIntFromInterval";

interface UnitBehaviorModifiers {
  combat?: {
    produceAdditionalHitsBeforeRollModifiers?: (roll: number) => number;
  };
}

export interface UnitProperties {
  name: string;
  space?: {
    combat?: CombatDiceRoll;
    antiFighterBarrage?: CombatDiceRoll;
    capacity?: number;
    requiresCapacity?: boolean;
  };
  ground?: {
    combat?: CombatDiceRoll;
    bombardment?: CombatDiceRoll;
  };
  spaceCannon?: CombatDiceRoll;
  canSustainDamage?: boolean;
  providesPlanetaryShield?: boolean;
  ignoresPlanetaryShield?: boolean;
  behaviorModifiers?: UnitBehaviorModifiers;
}

export interface CombatDiceRoll {
  numRolls: number;
  hitOn: number;
}

export class Unit {
  [immerable] = true;

  private _unitEnum: UnitEnum;
  private _base: UnitProperties;
  private _upgrade?: UnitProperties | undefined;
  private _isUpgraded: boolean;
  private _productionLimit: number;
  private _hasSustainedDamage?: boolean | undefined;

  constructor(options: {
    unitEnum: UnitEnum;
    base: UnitProperties;
    upgrade?: UnitProperties | undefined;
    isUpgraded: boolean;
    productionLimit: number;
    hasSustainedDamage?: boolean | undefined;
  }) {
    this._unitEnum = options.unitEnum;
    this._base = options.base;
    this._upgrade = options.upgrade;
    this._isUpgraded = options.isUpgraded;
    this._productionLimit = options.productionLimit;
    this._hasSustainedDamage = options.hasSustainedDamage;
  }

  static copy(unit: Immutable<Unit>) {
    return new Unit({
      unitEnum: unit.unitEnum,
      base: unit.base,
      upgrade: unit.upgrade,
      isUpgraded: unit.isUpgraded,
      productionLimit: unit.productionLimit,
      hasSustainedDamage: unit.hasSustainedDamage,
    });
  }

  get unitEnum() {
    return this._unitEnum;
  }

  get base() {
    return this._base;
  }

  get upgrade() {
    return this._upgrade;
  }

  get name() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.name
      : this._base.name;
  }

  get behaviorModifiers() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.behaviorModifiers
      : this._base.behaviorModifiers;
  }

  get requiresCapacity() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.space?.requiresCapacity
      : this._base.space?.requiresCapacity;
  }

  get spaceCombat() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.space?.combat
      : this._base.space?.combat;
  }

  get groundCombat() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.ground?.combat
      : this._base.ground?.combat;
  }

  get isShip() {
    return !!this.spaceCombat;
  }

  get isGroundForce() {
    return !!this.groundCombat;
  }

  get isStructure() {
    return !this.isShip && !this.isGroundForce;
  }

  get spaceCannon() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.spaceCannon
      : this._base.spaceCannon;
  }

  get capacity() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.space?.capacity
      : this._base.space?.capacity;
  }

  get canSustainDamage() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.canSustainDamage
      : this._base.canSustainDamage;
  }

  get hasSustainedDamage() {
    return this._hasSustainedDamage;
  }

  get providesPlanetaryShield() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.providesPlanetaryShield
      : this._base.providesPlanetaryShield;
  }

  get ignoresPlanetaryShield() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.ignoresPlanetaryShield
      : this._base.ignoresPlanetaryShield;
  }

  get bombardment() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.ground?.bombardment
      : this._base.ground?.bombardment;
  }

  get antiFighterBarrage() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.space?.antiFighterBarrage
      : this._base.space?.antiFighterBarrage;
  }

  get isUpgraded() {
    return this._isUpgraded;
  }

  setIsUpgraded(value: boolean) {
    this._isUpgraded = value;
  }

  get productionLimit() {
    return this._productionLimit;
  }

  get spaceCombatRating() {
    if (!this.spaceCombat) {
      return 0;
    }

    return this.calculateCombatRating(
      this.spaceCombat.numRolls,
      this.spaceCombat.hitOn
    );
  }

  get groundCombatRating() {
    if (!this.groundCombat) {
      return 0;
    }

    return this.calculateCombatRating(
      this.groundCombat.numRolls,
      this.groundCombat.hitOn
    );
  }

  get isEligibleForSustainDamage() {
    return this.canSustainDamage && !this.hasSustainedDamage;
  }

  /**
   * Simulates this unit participating in space combat.
   * @returns The number of hits this unit produced.
   */
  simulateSpaceCombat(
    options: {
      rollModifiers?: Array<(unit: Unit) => number> | undefined;
    } = {}
  ) {
    if (!this.spaceCombat) {
      return 0;
    }

    return this.simulateDiceRolls({
      diceRollStats: this.spaceCombat,
      rollModifiers: options.rollModifiers,
      hitModifiers: {
        produceAdditionalHitsBeforeRollModifiers: this.behaviorModifiers?.combat
          ?.produceAdditionalHitsBeforeRollModifiers,
      },
    });
  }

  /**
   * Simulates this unit participating in ground combat.
   * @returns The number of hits this unit produced.
   */
  simulateGroundCombat(
    options: {
      rollModifiers?: Array<(unit: Unit) => number> | undefined;
    } = {}
  ) {
    if (!this.groundCombat) {
      return 0;
    }

    return this.simulateDiceRolls({
      diceRollStats: this.groundCombat,
      rollModifiers: options.rollModifiers,
      hitModifiers: {
        produceAdditionalHitsBeforeRollModifiers: this.behaviorModifiers?.combat
          ?.produceAdditionalHitsBeforeRollModifiers,
      },
    });
  }

  simulateAntiFighterBarrage() {
    if (!this.antiFighterBarrage) {
      return 0;
    }

    return this.simulateDiceRolls({
      diceRollStats: this.antiFighterBarrage,
    });
  }

  simulateBombardment() {
    if (!this.bombardment) {
      return 0;
    }

    return this.simulateDiceRolls({
      diceRollStats: this.bombardment,
    });
  }

  simulateSpaceCannon() {
    if (!this.spaceCannon) {
      return 0;
    }

    return this.simulateDiceRolls({
      diceRollStats: this.spaceCannon,
    });
  }

  sustainDamage() {
    if (this.isEligibleForSustainDamage) {
      this._hasSustainedDamage = true;
    }
  }

  repairDamage() {
    this._hasSustainedDamage = false;
  }

  private simulateDiceRolls(options: {
    diceRollStats: CombatDiceRoll;
    rollModifiers?: Array<(unit: Unit) => number> | undefined;
    hitModifiers?:
      | {
          produceAdditionalHitsBeforeRollModifiers?:
            | ((roll: number) => number)
            | undefined;
        }
      | undefined;
  }) {
    const { diceRollStats, rollModifiers = [], hitModifiers } = options;

    let numHits = 0;
    for (let i = 0; i < diceRollStats.numRolls; i++) {
      const rollBeforeModifiers = randomIntFromInterval(1, 10);

      numHits +=
        hitModifiers?.produceAdditionalHitsBeforeRollModifiers?.(
          rollBeforeModifiers
        ) ?? 0;

      const rollAfterModifiers =
        rollBeforeModifiers +
        (rollModifiers?.reduce((prev, curr) => prev + curr(this), 0) ?? 0);
      if (rollAfterModifiers >= diceRollStats.hitOn) {
        numHits += 1;
      }
    }

    return numHits;
  }

  private calculateCombatRating(numAttacks: number, combat: number) {
    return numAttacks * (10 - combat);
  }
}
