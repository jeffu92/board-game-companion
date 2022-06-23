import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Destroyer extends Unit {
  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.DESTROYER,
      base: {
        name: "Destroyer 1",
        cost: 1,
        combat: 9,
        numAttacks: 1,
        move: 2,
        capacity: 0,
        canSustainDamage: false,
      },
      upgrade: {
        name: "Destroyer 2",
        cost: 1,
        combat: 8,
        numAttacks: 1,
        move: 2,
        capacity: 0,
        canSustainDamage: false,
      },
      isUpgraded,
      productionLimit: 8,
      hasSustainedDamage: false,
    });
  }
}
