import { UnitEnum } from "../../enums/Unit.enum";
import { Faction } from "./Faction.class";

const supportedUnits: Set<UnitEnum> = new Set<UnitEnum>([
  UnitEnum.WARSUN,
  UnitEnum.DREADNAUGHT,
  UnitEnum.CRUISER,
  UnitEnum.FIGHTER,
  UnitEnum.INFANTRY,
]);

export const Winnu: Faction = {
  getUnits: () => supportedUnits,
};
