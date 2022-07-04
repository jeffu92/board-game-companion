import { ActionCardEnum } from "../../enums/ActionCard.enum";
import { CombatDiceRollModifer } from "../units/Unit.class";

export interface ActionCard {
  actionCardEnum: ActionCardEnum;
  numAvailable: number;
  getSpaceCombatRound1RollModifier?: CombatDiceRollModifer | undefined;
}
