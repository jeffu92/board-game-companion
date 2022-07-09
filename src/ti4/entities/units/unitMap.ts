import { Immutable } from "immer";
import { UnitEnum } from "../../enums/Unit.enum";
import { Carrier } from "./Carrier.class";
import { Cruiser } from "./Cruiser.class";
import { Destroyer } from "./Destroyer.class";
import { Dreadnought } from "./Dreadnought.class";
import { Fighter } from "./Fighter.class";
import { Infantry } from "./Infantry.class";
import { JNSHylarim } from "./jol-nar/JNSHylarim.class";
import { Pds } from "./Pds.class";
import { Unit } from "./Unit.class";
import { WarSun } from "./WarSun.class";

export const unitMap: Immutable<Map<UnitEnum, Unit>> = new Map([
  [UnitEnum.JNSHYLARIM, new JNSHylarim({ hasSustainedDamage: false })],
  [UnitEnum.WARSUN, new WarSun({ hasSustainedDamage: false })],
  [
    UnitEnum.DREADNOUGHT,
    new Dreadnought({ isUpgraded: false, hasSustainedDamage: false }),
  ],
  [UnitEnum.CRUISER, new Cruiser({ isUpgraded: false })],
  [UnitEnum.FIGHTER, new Fighter({ isUpgraded: false })],
  [UnitEnum.INFANTRY, new Infantry({ isUpgraded: false })],
  [UnitEnum.CARRIER, new Carrier({ isUpgraded: false })],
  [UnitEnum.DESTROYER, new Destroyer({ isUpgraded: false })],
  [UnitEnum.PDS, new Pds({ isUpgraded: false })],
]);
