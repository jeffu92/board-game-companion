import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Pds extends Unit {
  constructor(options: { isUpgraded: boolean }) {
    const { isUpgraded = false } = options;

    super({
      unitEnum: UnitEnum.PDS,
      base: {
        name: "PDS 1",
        spaceCannon: {
          numRolls: 1,
          hitOn: 6,
        },
        providesPlanetaryShield: true,
      },
      upgrade: {
        name: "PDS 2",
        spaceCannon: {
          numRolls: 1,
          hitOn: 5,
        },
        providesPlanetaryShield: true,
      },
      isUpgraded,
      productionLimit: 6,
    });
  }
}
