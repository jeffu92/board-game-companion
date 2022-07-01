import { Paper } from "@mui/material";
import { useCallback, useState } from "react";
import { Faction } from "../../ti4/classes/factions/Faction.class";
import { Unit } from "../../ti4/classes/units/Unit.class";
import { factionMap } from "../../ti4/utils/factionMap";
import { CombatStats, simulateCombat } from "../../ti4/utils/simulateCombat";
import { FactionFleetBuilderForm } from "./components/FactionFleetBuilderForm/FactionFleetBuilderForm.component";
import "./Ti4CombatCalculator.page.css";

export const Ti4CombatCalculator = () => {
  const [defenderFleet, setDefenderFleet] = useState<Map<string, Unit>>(
    new Map()
  );
  const [attackerFleet, setAttackerFleet] = useState<Map<string, Unit>>(
    new Map()
  );
  const [defenderFaction, setDefenderFaction] = useState<Faction | undefined>(
    undefined
  );
  const [attackerFaction, setAttackerFaction] = useState<Faction | undefined>(
    undefined
  );
  const [result, setResult] = useState<CombatStats | null>(null);

  const onSimulateCombat = useCallback(
    (
      attacker: {
        faction: Faction;
        units: Map<string, Unit>;
      },
      defender: {
        faction: Faction;
        units: Map<string, Unit>;
      }
    ) => {
      const result = simulateCombat(attacker, defender);
      setResult(result);
    },
    []
  );

  const handleDefenderFleetChange = useCallback(
    (newFleet: Map<string, Unit>) => {
      setDefenderFleet(newFleet);
      if (attackerFaction && defenderFaction) {
        onSimulateCombat(
          {
            faction: attackerFaction,
            units: attackerFleet,
          },
          {
            faction: defenderFaction,
            units: newFleet,
          }
        );
      }
    },
    [attackerFaction, attackerFleet, defenderFaction, onSimulateCombat]
  );

  const handleAttackerFleetChange = useCallback(
    (newFleet: Map<string, Unit>) => {
      setAttackerFleet(newFleet);
      if (attackerFaction && defenderFaction) {
        onSimulateCombat(
          {
            faction: attackerFaction,
            units: newFleet,
          },
          {
            faction: defenderFaction,
            units: defenderFleet,
          }
        );
      }
    },
    [attackerFaction, defenderFaction, defenderFleet, onSimulateCombat]
  );

  const handleDefenderFactionChange = useCallback(
    (newFaction: string) => {
      const newDefenderFaction = factionMap.get(newFaction);
      if (newDefenderFaction) {
        setDefenderFaction(newDefenderFaction);
        if (attackerFaction) {
          onSimulateCombat(
            {
              faction: attackerFaction,
              units: attackerFleet,
            },
            {
              faction: newDefenderFaction,
              units: defenderFleet,
            }
          );
        }
      }
    },
    [attackerFaction, attackerFleet, defenderFleet, onSimulateCombat]
  );

  const handleAttackerFactionChange = useCallback(
    (newFaction: string) => {
      const newAttackerFaction = factionMap.get(newFaction);
      if (newAttackerFaction) {
        setAttackerFaction(newAttackerFaction);
        if (defenderFaction) {
          onSimulateCombat(
            {
              faction: newAttackerFaction,
              units: attackerFleet,
            },
            {
              faction: defenderFaction,
              units: defenderFleet,
            }
          );
        }
      }
    },
    [attackerFleet, defenderFaction, defenderFleet, onSimulateCombat]
  );

  return (
    <div className="ti4-combat-calc">
      <div className="ti4-combat-calc__results">
        <span
          style={{
            flex: result?.attackers.winPerc ?? 0,
            backgroundColor: "lightcoral",
          }}
        ></span>
        <span
          style={{
            flex: result?.tiePerc ?? 1,
            backgroundColor: "lightgray",
          }}
        ></span>
        <span
          style={{
            flex: result?.defenders.winPerc ?? 0,
            backgroundColor: "lightskyblue",
          }}
        ></span>
      </div>
      <Paper
        className="ti4-combat-calc__attacker ti-combat-calc__participant"
        elevation={7}
      >
        <FactionFleetBuilderForm
          onFleetChange={handleAttackerFleetChange}
          onFactionChange={handleAttackerFactionChange}
        />
      </Paper>
      <Paper
        className="ti4-combat-calc__defender ti-combat-calc__participant"
        elevation={7}
      >
        <FactionFleetBuilderForm
          onFleetChange={handleDefenderFleetChange}
          onFactionChange={handleDefenderFactionChange}
        />
      </Paper>
    </div>
  );
};
