import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Infantry extends Unit {
  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.INFANTRY,
      base: {
        name: "Infantry 1",
        space: {
          requiresCapacity: true,
        },
        ground: {
          combat: {
            numRolls: 1,
            hitOn: 8,
          },
        },
      },
      upgrade: {
        name: "Infantry 2",
        space: {
          requiresCapacity: true,
        },
        ground: {
          combat: {
            numRolls: 1,
            hitOn: 7,
          },
        },
      },
      isUpgraded,
      productionLimit: 1000,
    });
  }
}
