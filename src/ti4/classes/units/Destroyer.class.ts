import { AbilityEnum } from "../../enums/Ability.enum";
import { UnitEnum } from "../../enums/Unit.enum";
import { Unit, UnitProperties } from "./Unit.class";

export class Destroyer extends Unit {
  static baseDestroyer: UnitProperties = {
    name: "Destroyer 1",
    cost: 1,
    combat: 9,
    numAttacks: 1,
    move: 2,
    capacity: 0,
    canSustainDamage: false,
    antiFighterBarrage: {
      abilityEnum: AbilityEnum.ANTI_FIGHTER_BARRAGE,
      numAttacks: 2,
      combat: 9,
    },
  };

  static upgradedDestroyer: UnitProperties = {
    name: "Destroyer 2",
    cost: 1,
    combat: 8,
    numAttacks: 1,
    move: 2,
    capacity: 0,
    canSustainDamage: false,
    antiFighterBarrage: {
      abilityEnum: AbilityEnum.ANTI_FIGHTER_BARRAGE,
      numAttacks: 3,
      combat: 6,
    },
  };

  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.DESTROYER,
      base: Destroyer.baseDestroyer,
      upgrade: Destroyer.upgradedDestroyer,
      isUpgraded,
      productionLimit: 8,
      hasSustainedDamage: false,
    });
  }
}
