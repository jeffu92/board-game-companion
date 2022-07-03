import { UnitEnum } from "../../enums/Unit.enum";
import { Unit, UnitProperties } from "./Unit.class";

export class Dreadnought extends Unit {
  static baseDreadnaught: UnitProperties = {
    name: "Dreadnaught 1",
    space: {
      combat: {
        numRolls: 1,
        hitOn: 5,
      },
    },
    ground: {
      bombardment: {
        numRolls: 1,
        hitOn: 5,
      },
    },
    capacity: 1,
    canSustainDamage: true,
  };
  static upgradeDreadnaught: UnitProperties = {
    name: "Dreadnaught 2",
    space: {
      combat: {
        numRolls: 1,
        hitOn: 5,
      },
    },
    ground: {
      bombardment: {
        numRolls: 1,
        hitOn: 5,
      },
    },
    capacity: 1,
    canSustainDamage: true,
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
