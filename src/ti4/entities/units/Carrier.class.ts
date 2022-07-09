import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Carrier extends Unit {
  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.CARRIER,
      base: {
        name: "Carrier 1",
        space: {
          combat: {
            numRolls: 1,
            hitOn: 9,
          },
          capacity: 4,
        },
      },
      upgrade: {
        name: "Carrier 2",
        space: {
          combat: {
            numRolls: 1,
            hitOn: 9,
          },
          capacity: 6,
        },
      },
      isUpgraded,
      productionLimit: 4,
    });
  }
}
