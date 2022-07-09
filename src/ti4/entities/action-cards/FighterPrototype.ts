import { Immutable } from "immer";
import { ActionCardEnum } from "../../enums/ActionCard.enum";
import { UnitEnum } from "../../enums/Unit.enum";
import { Unit } from "../units/Unit.class";
import { ActionCard } from "./ActionCard";

export const FighterPrototype: Immutable<ActionCard> = {
  actionCardEnum: ActionCardEnum.FIGHTERPROTOTYPE,
  numAvailable: 1,
  hooks: {
    combatRoll: {
      modifier: (unit: Unit) => {
        return unit.unitEnum === UnitEnum.FIGHTER ? 2 : 0;
      },
      applyIn: "space",
      applyOnRound: "first",
      applyNumTimes: "once",
    },
  },
};
