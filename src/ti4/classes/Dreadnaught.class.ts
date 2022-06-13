import { UnitEnum } from "../enums/Unit.enum";
import { Unit, UnitProperties } from "./Unit.class";

export class Dreadnaught extends Unit {
  static baseDreadnaught: UnitProperties = {
    name: "Dreadnaught 1",
    cost: 4,
    combat: 5,
    numAttacks: 1,
    move: 1,
    capacity: 1,
    canSustainDamage: true,
    bombardment: 5,
  };
  static upgradeDreadnaught: UnitProperties = {
    name: "Dreadnaught 2",
    cost: 4,
    combat: 5,
    numAttacks: 1,
    move: 2,
    capacity: 1,
    canSustainDamage: true,
    bombardment: 5,
  };

  constructor(options: { isUpgraded: boolean; hasSustainedDamage: boolean }) {
    const { isUpgraded = false, hasSustainedDamage = false } = options;

    super({
      unitEnum: UnitEnum.DREADNAUGHT,
      base: Dreadnaught.baseDreadnaught,
      upgrade: Dreadnaught.upgradeDreadnaught,
      isUpgraded,
      productionLimit: 5,
      hasSustainedDamage,
    });
  }
}
