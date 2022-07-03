import { FactionEnum } from "../../enums/Faction.enum";
import { UnitEnum } from "../../enums/Unit.enum";
import { Faction } from "./Faction.class";

const supportedUnits: Set<UnitEnum> = new Set<UnitEnum>([
  UnitEnum.WARSUN,
  UnitEnum.DREADNOUGHT,
  UnitEnum.CRUISER,
  UnitEnum.FIGHTER,
  UnitEnum.INFANTRY,
  UnitEnum.CARRIER,
  UnitEnum.DESTROYER,
  UnitEnum.PDS,
]);

export const JolNar: Faction = {
  factionEnum: FactionEnum.JOLNAR,
  getUnits: () => supportedUnits,
  getCombatRollModifier: () => -1,
};
