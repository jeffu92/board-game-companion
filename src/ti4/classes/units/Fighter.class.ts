import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Fighter extends Unit {
  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.FIGHTER,
      base: {
        name: "Fighter 1",
        cost: 0.5,
        combat: 9,
        numAttacks: 1,
        move: 0,
        capacity: 0,
        canSustainDamage: false,
      },
      upgrade: {
        name: "Fighter 2",
        cost: 0.5,
        combat: 8,
        numAttacks: 1,
        move: 2,
        capacity: 0,
        canSustainDamage: false,
      },
      isUpgraded,
      productionLimit: 1000,
      hasSustainedDamage: false,
    });
  }
}
