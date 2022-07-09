import { Immutable } from "immer";
import { Faction } from "../../entities/factions/Faction";
import { Unit } from "../../entities/units/Unit.class";
import { ActionCardEnum } from "../../enums/ActionCard.enum";

export interface PlayerCombatInfo {
  faction: Immutable<Faction>;
  space: Immutable<Map<string, Unit>>;
  planets: Immutable<Map<string, Map<string, Unit>>>;
  actionCards: Immutable<Map<ActionCardEnum, number>>;
}
