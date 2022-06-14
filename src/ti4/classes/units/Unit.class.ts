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
  bombardment?: number;
  numBombardments?: number;
}

export class Unit {
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

  static copy(unit: Unit) {
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

  setHasSustainedDamage(value: boolean) {
    this._hasSustainedDamage = value;
  }

  get bombardment() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.bombardment
      : this._base.bombardment;
  }

  get numBombardments() {
    return this.isUpgraded && this._upgrade
      ? this._upgrade.numBombardments
      : this._base.numBombardments;
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
  simulateCombat() {
    let numHits = 0;
    for (let i = 0; i < this.numAttacks; i++) {
      if (randomIntFromInterval(1, 10) >= this.combat) {
        numHits += 1;
      }
    }
    return numHits;
  }

  sustainDamage() {
    if (this.isEligibleForSustainDamage) {
      this._hasSustainedDamage = true;
    }
  }
}
