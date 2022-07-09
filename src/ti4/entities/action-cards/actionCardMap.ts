import { ActionCardEnum } from "../../enums/ActionCard.enum";
import { ActionCard } from "./ActionCard";
import { FighterPrototype } from "./FighterPrototype";

export const actionCardMap: Map<ActionCardEnum, ActionCard> = new Map([
  [ActionCardEnum.FIGHTERPROTOTYPE, FighterPrototype],
]);
