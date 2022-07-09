import { UnitEnum } from "../../../enums/Unit.enum";
import { Unit, UnitProperties } from "../Unit.class";

export class JNSHylarim extends Unit {
  static base: UnitProperties = {
    name: "J.N.S. Hylarim",
    space: {
      combat: {
        numRolls: 2,
        hitOn: 6,
      },
      capacity: 3,
    },
    behaviorModifiers: {
      combat: {
        produceAdditionalHitsBeforeRollModifiers: (roll: number) => {
          if (roll >= 9) {
            return 2;
          }

          return 0;
        },
      },
    },
    canSustainDamage: true,
  };

  constructor(options: { hasSustainedDamage: boolean }) {
    const { hasSustainedDamage = false } = options;

    super({
      unitEnum: UnitEnum.JNSHYLARIM,
      base: JNSHylarim.base,
      isUpgraded: false,
      productionLimit: 1,
      hasSustainedDamage,
    });
  }
}
