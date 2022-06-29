import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "../units/Unit.class";

export interface Faction {
  getUnits: () => Set<UnitEnum>;
  getCombatRollModifier?: (unit: Unit) => number;
}
