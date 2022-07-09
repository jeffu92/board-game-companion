import { FactionEnum } from "../../enums/Faction.enum";
import { UnitEnum } from "../../enums/Unit.enum";
import { Faction } from "./Faction";

const supportedUnits: Set<UnitEnum> = new Set<UnitEnum>([
  UnitEnum.JNSHYLARIM,
  UnitEnum.WARSUN,
  UnitEnum.DREADNOUGHT,
  UnitEnum.CRUISER,
  UnitEnum.CARRIER,
  UnitEnum.DESTROYER,
  UnitEnum.FIGHTER,
  UnitEnum.INFANTRY,
  UnitEnum.PDS,
]);

export const JolNar: Faction = {
  factionEnum: FactionEnum.JOLNAR,
  getUnits: () => supportedUnits,
  getCombatRollModifier: () => -1,
};
