import { ActionCardEnum } from "../../enums/ActionCard.enum";
import { CombatSimulationHooks } from "../../utils/combat-simulation/CombatSimulationHooks";

export interface ActionCard {
  actionCardEnum: ActionCardEnum;
  numAvailable: number;
  hooks: Partial<CombatSimulationHooks>;
}
