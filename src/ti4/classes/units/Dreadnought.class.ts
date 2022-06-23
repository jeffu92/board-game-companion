import { AbilityEnum } from "../../enums/Ability.enum";
import { UnitEnum } from "../../enums/Unit.enum";
import { Unit, UnitProperties } from "./Unit.class";

export class Dreadnought extends Unit {
  static baseDreadnaught: UnitProperties = {
    name: "Dreadnaught 1",
    cost: 4,
    combat: 5,
    numAttacks: 1,
    move: 1,
    capacity: 1,
    canSustainDamage: true,
    bombardment: {
      abilityEnum: AbilityEnum.BOMBARDMENT,
      combat: 5,
      numAttacks: 1,
    },
  };
  static upgradeDreadnaught: UnitProperties = {
    name: "Dreadnaught 2",
    cost: 4,
    combat: 5,
    numAttacks: 1,
    move: 2,
    capacity: 1,
    canSustainDamage: true,
    bombardment: {
      abilityEnum: AbilityEnum.BOMBARDMENT,
      combat: 5,
      numAttacks: 1,
    },
  };

  constructor(options: { isUpgraded: boolean; hasSustainedDamage: boolean }) {
    const { isUpgraded = false, hasSustainedDamage = false } = options;

    super({
      unitEnum: UnitEnum.DREADNOUGHT,
      base: Dreadnought.baseDreadnaught,
      upgrade: Dreadnought.upgradeDreadnaught,
      isUpgraded,
      productionLimit: 5,
      hasSustainedDamage,
    });
  }
}
