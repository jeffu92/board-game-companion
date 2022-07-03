import { UnitEnum } from "../../enums/Unit.enum";
import { Unit, UnitProperties } from "./Unit.class";

export class Destroyer extends Unit {
  static baseDestroyer: UnitProperties = {
    name: "Destroyer 1",
    space: {
      combat: {
        numRolls: 1,
        hitOn: 9,
      },
      antiFighterBarrage: {
        numRolls: 2,
        hitOn: 9,
      },
    },
  };

  static upgradedDestroyer: UnitProperties = {
    name: "Destroyer 2",
    space: {
      combat: {
        numRolls: 1,
        hitOn: 8,
      },
      antiFighterBarrage: {
        numRolls: 3,
        hitOn: 6,
      },
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
    });
  }
}
