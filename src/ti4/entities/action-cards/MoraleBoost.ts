import { Immutable } from "immer";
import { ActionCardEnum } from "../../enums/ActionCard.enum";
import { ActionCard } from "./ActionCard";

export const MoraleBoost: Immutable<ActionCard> = {
  actionCardEnum: ActionCardEnum.MORALEBOOST,
  numAvailable: 4,
  hooks: {
    combatRoll: {
      modifier: () => 1,
      applyIn: "any",
      applyOnRound: "any",
      applyNumTimes: "once",
    },
  },
};
