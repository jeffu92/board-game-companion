import { UnitEnum } from "../../enums/Unit.enum";
import { Unit, UnitProperties } from "./Unit.class";

export class Destroyer extends Unit {
  static baseDestroyer: UnitProperties = {
    name: "Destroyer 1",
    cost: 1,
    combat: 9,
    numAttacks: 1,
    move: 2,
    capacity: 0,
    canSustainDamage: false,
    antiFighterBarrage: 9,
    numAntiFighterBarrages: 2,
  };

  static upgradedDestroyer: UnitProperties = {
    name: "Destroyer 2",
    cost: 1,
    combat: 8,
    numAttacks: 1,
    move: 2,
    capacity: 0,
    canSustainDamage: false,
    antiFighterBarrage: 6,
    numAntiFighterBarrages: 3,
  };

  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.DESTROYER,
      base: Destroyer.baseDestroyer,
      upgrade: Destroyer.upgradedDestroyer,
      isUpgraded,
      productionLimit: 8,
      hasSustainedDamage: false,
    });
  }
}
