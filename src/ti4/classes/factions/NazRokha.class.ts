import { UnitEnum } from "../../enums/Unit.enum";
import { Faction } from "./Faction.class";

const supportedUnits: Set<UnitEnum> = new Set<UnitEnum>([
  UnitEnum.WARSUN,
  UnitEnum.DREADNAUGHT,
  UnitEnum.CRUISER,
  UnitEnum.FIGHTER,
]);

export const NazRokha: Faction = {
  getUnits: () => supportedUnits,
};
