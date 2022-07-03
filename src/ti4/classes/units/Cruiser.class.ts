import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Cruiser extends Unit {
  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.CRUISER,
      base: {
        name: "Cruiser 1",
        space: {
          combat: {
            numRolls: 1,
            hitOn: 7,
          },
        },
      },
      upgrade: {
        name: "Cruiser 2",
        space: {
          combat: {
            numRolls: 1,
            hitOn: 6,
          },
        },
      },
      isUpgraded,
      productionLimit: 8,
    });
  }
}
