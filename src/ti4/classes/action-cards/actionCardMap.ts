import { ActionCardEnum } from "../../enums/ActionCard.enum";
import { ActionCard } from "./ActionCard.class";
import { FighterPrototype } from "./FighterPrototype.class";

export const actionCardMap: Map<ActionCardEnum, ActionCard> = new Map([
  [ActionCardEnum.FIGHTERPROTOTYPE, FighterPrototype],
]);
