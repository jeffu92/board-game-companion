import { Faction } from "../classes/factions/Faction.class";
import { NazRokha } from "../classes/factions/NazRokha.class";
import { Winnu } from "../classes/factions/Winnu.class";
import { FactionEnum } from "../enums/Faction.enum";

export const factionMap: Map<string, Faction> = new Map([
  [FactionEnum.WINNU, Winnu],
  [FactionEnum.NAAZROKHA, NazRokha],
]);
