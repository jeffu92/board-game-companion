import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Fighter extends Unit {
  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.FIGHTER,
      base: {
        name: "Fighter 1",
        space: {
          combat: {
            numRolls: 1,
            hitOn: 9,
          },
          requiresCapacity: true,
        },
      },
      upgrade: {
        name: "Fighter 2",
        space: {
          combat: {
            numRolls: 1,
            hitOn: 8,
          },
          requiresCapacity: true,
        },
      },
      isUpgraded,
      productionLimit: 1000,
    });
  }
}
