import { Faction } from "./Faction.class";
import { JolNar } from "./JolNar.class";
import { NazRokha } from "./NazRokha.class";
import { Winnu } from "./Winnu.class";
import { FactionEnum } from "../../enums/Faction.enum";

export const factionMap: Map<string, Faction> = new Map([
  [FactionEnum.WINNU, Winnu],
  [FactionEnum.NAAZROKHA, NazRokha],
  [FactionEnum.JOLNAR, JolNar],
]);
