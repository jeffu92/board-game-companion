import { immerable, Immutable } from "immer";
import { AbilityEnum } from "../../enums/Ability.enum";
import { UnitEnum } from "../../enums/Unit.enum";
import { randomIntFromInterval } from "../../utils/randomIntFromInterval";

export interface UnitProperties {
  name: string;
  cost: number;
  combat: number;
  numAttacks: number;
  move: number;
  capacity: number;
  canSustainDamage: boolean;
  bombardment?: Ability;
  antiFighterBarrage?: Ability;
}

export interface Ability {
  abilityEnum: AbilityEnum;
  numAttacks: number;
  combat: number;
}

export class Unit {
  [immerable] = true;

  private _unitEnum: UnitEnum;
  private _base: UnitProperties;
  private _upgrade?: UnitProperties | undefined;
  private _isUpgraded: boolean;
  private _productionLimit: number;
  private _hasSustainedDamage: boolean;

  constructor(options: {
    unitEnum: UnitEnum;
    base: UnitProperties;
    upgrade?: UnitProperties | undefined;
    isUpgraded: boolean;
    productionLimit: number;
    hasSustainedDamage: boolean;
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

  get cost() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.cost
      : this._base.cost;
  }

  get combat() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.combat
      : this._base.combat;
  }

  get numAttacks() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.numAttacks
      : this._base.numAttacks;
  }

  get move() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.move
      : this._base.move;
  }

  get capacity() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.capacity
      : this._base.capacity;
  }

  get canSustainDamage() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.canSustainDamage
      : this._base.canSustainDamage;
  }

  get hasSustainedDamage() {
    return this._hasSustainedDamage;
  }

  get bombardment() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.bombardment
      : this._base.bombardment;
  }

  get antiFighterBarrage() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.antiFighterBarrage
      : this._base.antiFighterBarrage;
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

  get combatRating() {
    return this.calculateCombatRating(this.numAttacks, this.combat);
  }

  private calculateCombatRating(numAttacks: number, combat: number) {
    return numAttacks * (10 - combat);
  }

  get isEligibleForSustainDamage() {
    return this.canSustainDamage && !this.hasSustainedDamage;
  }

  /**
   * Simulates this unit participating in combat.
   * @returns The number of hits this unit produced.
   */
  simulateCombat(
    options: {
      rollModifiers?: Array<(unit: Unit) => number>;
    } = {}
  ) {
    // if an override is not provided for rolling combat die, use baseline
    const { rollModifiers } = options;

    let numHits = 0;
    for (let i = 0; i < this.numAttacks; i++) {
      if (this.rollCombatDie(rollModifiers) >= this.combat) {
        numHits += 1;
      }
    }

    return numHits;
  }

  simulateAntiFighterBarrage() {
    let numHits = 0;
    if (this.antiFighterBarrage) {
      for (let i = 0; i < this.antiFighterBarrage.numAttacks; i++) {
        if (this.rollCombatDie() >= this.antiFighterBarrage.combat) {
          numHits += 1;
        }
      }
    }
    return numHits;
  }

  sustainDamage() {
    if (this.isEligibleForSustainDamage) {
      this._hasSustainedDamage = true;
    }
  }

  repairDamage() {
    this._hasSustainedDamage = false;
  }

  private rollCombatDie(rollModifiers?: Array<(unit: Unit) => number>) {
    return (
      randomIntFromInterval(1, 10) +
      (rollModifiers?.reduce((prev, curr) => prev + curr(this), 0) ?? 0)
    );
  }
}
