import { UnitEnum } from "../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Cruiser extends Unit {
  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.CRUISER,
      base: {
        name: "Cruiser 1",
        cost: 2,
        combat: 7,
        numAttacks: 1,
        move: 2,
        capacity: 0,
        canSustainDamage: false,
      },
      upgrade: {
        name: "Cruiser 2",
        cost: 2,
        combat: 6,
        numAttacks: 1,
        move: 3,
        capacity: 1,
        canSustainDamage: false,
      },
      isUpgraded,
      productionLimit: 8,
      hasSustainedDamage: false,
    });
  }
}
