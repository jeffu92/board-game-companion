import { createContext } from "react";
import { useFleetBuilder } from "../../../ti4/hooks/useFleetBuilder";

export const FleetBuilderContext = createContext<
  | (ReturnType<typeof useFleetBuilder> & {
      simulateCombatInZone: (id: string) => void;
    })
  | null
>(null);
