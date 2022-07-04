import { createContext } from "react";
import { Faction } from "../../../ti4/classes/factions/Faction.class";
import { useFleetBuilder } from "../../../ti4/hooks/useFleetBuilder";

export const FleetBuilderContext = createContext<
  | (ReturnType<typeof useFleetBuilder> & {
      simulateCombatInZone: (options: {
        defendingFaction: Faction;
        planet?: { name: string; id: string };
      }) => void;
    })
  | null
>(null);
