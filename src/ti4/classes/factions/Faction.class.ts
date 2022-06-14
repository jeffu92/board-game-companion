import { UnitEnum } from "../../enums/Unit.enum";

export interface Faction {
  getUnits: () => Set<UnitEnum>;
}
