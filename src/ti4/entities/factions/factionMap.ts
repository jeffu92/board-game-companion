import { Faction } from "./Faction";
import { JolNar } from "./JolNar";
import { NazRokha } from "./NazRokha";
import { Winnu } from "./Winnu";
import { FactionEnum } from "../../enums/Faction.enum";

export const factionMap: Map<string, Faction> = new Map([
  [FactionEnum.WINNU, Winnu],
  [FactionEnum.NAAZROKHA, NazRokha],
  [FactionEnum.JOLNAR, JolNar],
]);
