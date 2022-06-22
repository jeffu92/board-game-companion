import { UnitEnum } from "../../enums/Unit.enum";
import { Unit, UnitProperties } from "./Unit.class";

export class WarSun extends Unit {
  static baseWarSun: UnitProperties = {
    name: "War Sun",
    cost: 12,
    combat: 3,
    numAttacks: 3,
    move: 2,
    capacity: 6,
    canSustainDamage: true,
    bombardment: 3,
    numBombardments: 3,
  };

  constructor(options: { hasSustainedDamage: boolean }) {
    const { hasSustainedDamage = false } = options;

    super({
      unitEnum: UnitEnum.DREADNAUGHT,
      base: WarSun.baseWarSun,
      isUpgraded: false,
      productionLimit: 2,
      hasSustainedDamage,
    });
  }
}
