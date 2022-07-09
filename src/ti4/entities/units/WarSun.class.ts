import { UnitEnum } from "../../enums/Unit.enum";
import { Unit, UnitProperties } from "./Unit.class";

export class WarSun extends Unit {
  static baseWarSun: UnitProperties = {
    name: "War Sun",
    space: {
      combat: {
        hitOn: 3,
        numRolls: 3,
      },
      capacity: 6,
    },
    ground: {
      bombardment: {
        hitOn: 3,
        numRolls: 3,
      },
    },
    canSustainDamage: true,
    ignoresPlanetaryShield: true,
  };

  constructor(options: { hasSustainedDamage: boolean }) {
    const { hasSustainedDamage = false } = options;

    super({
      unitEnum: UnitEnum.WARSUN,
      base: WarSun.baseWarSun,
      isUpgraded: false,
      productionLimit: 2,
      hasSustainedDamage,
    });
  }
}
