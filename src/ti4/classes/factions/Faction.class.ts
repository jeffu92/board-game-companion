import { FactionEnum } from "../../enums/Faction.enum";
import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "../units/Unit.class";

export interface Faction {
  factionEnum: FactionEnum;
  getUnits: () => Set<UnitEnum>;
  getCombatRollModifier?: (unit: Unit) => number;
}
