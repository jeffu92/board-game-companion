import { createContext } from "react";
import { Faction } from "../../../ti4/entities/factions/Faction";
import { ActionCardEnum } from "../../../ti4/enums/ActionCard.enum";
import { useFleetBuilder } from "../../../ti4/hooks/useFleetBuilder";

export const FleetBuilderContext = createContext<
  | (ReturnType<typeof useFleetBuilder> & {
      simulateCombatInZone: (options: {
        defendingFaction: Faction;
        planet?: { name: string; id: string };
      }) => void;
      defendingZoneId?: string | undefined;
      shouldAllowSimulate: boolean;
      areActionCardsAvailable: (actionCardEnum: ActionCardEnum) => boolean;
    })
  | null
>(null);
