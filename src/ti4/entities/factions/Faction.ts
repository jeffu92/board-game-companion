import { FactionEnum } from "../../enums/Faction.enum";
import { UnitEnum } from "../../enums/Unit.enum";
import { CombatSimulationHooks } from "../../utils/combat-simulation/CombatSimulationHooks";

export interface Faction {
  factionEnum: FactionEnum;
  getUnits: () => Set<UnitEnum>;
  hooks?: Partial<CombatSimulationHooks> | undefined;
}
