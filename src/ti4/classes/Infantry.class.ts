import { UnitEnum } from "../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Infantry extends Unit {
  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.INFANTRY,
      base: {
        name: "Infantry 1",
        cost: 0.5,
        combat: 8,
        numAttacks: 1,
        move: 0,
        capacity: 0,
        canSustainDamage: false,
      },
      upgrade: {
        name: "Infantry 2",
        cost: 0.5,
        combat: 7,
        numAttacks: 1,
        move: 0,
        capacity: 0,
        canSustainDamage: false,
      },
      isUpgraded,
      productionLimit: 1000,
      hasSustainedDamage: false,
    });
  }
}
