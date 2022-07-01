import { Button, Paper } from "@mui/material";
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

  const handleSimulateCombatClick = useCallback(() => {
    if (attackerFaction && defenderFaction) {
      onSimulateCombat(
        {
          faction: attackerFaction,
          units: attackerFleet,
        },
        {
          faction: defenderFaction,
          units: defenderFleet,
        }
      );
    }
  }, [
    attackerFaction,
    attackerFleet,
    defenderFaction,
    defenderFleet,
    onSimulateCombat,
  ]);

  const handleDefenderFleetChange = useCallback(
    (newFleet: Map<string, Unit>) => {
      setDefenderFleet(newFleet);
      setResult(null);
    },
    []
  );

  const handleAttackerFleetChange = useCallback(
    (newFleet: Map<string, Unit>) => {
      setAttackerFleet(newFleet);
      setResult(null);
    },
    []
  );

  const handleDefenderFactionChange = useCallback((newFaction: string) => {
    const newDefenderFaction = factionMap.get(newFaction);
    if (newDefenderFaction) {
      setDefenderFaction(newDefenderFaction);
      setResult(null);
    }
  }, []);

  const handleAttackerFactionChange = useCallback((newFaction: string) => {
    const newAttackerFaction = factionMap.get(newFaction);
    if (newAttackerFaction) {
      setAttackerFaction(newAttackerFaction);
      setResult(null);
    }
  }, []);

  const offColorValue = 190;
  const borderValue = offColorValue - 50;

  return (
    <div className="ti4-combat-calc">
      {result ? (
        <div
          className="ti4-combat-calc__results"
          onClick={handleSimulateCombatClick}
        >
          <span
            style={{
              flex: result?.attackers.winPerc ?? 0,
              backgroundColor: `rgb(255, ${offColorValue}, ${offColorValue})`,
              borderRight: `1px rgb(${borderValue}, ${borderValue}, ${borderValue}) solid`,
            }}
          ></span>
          <span
            style={{
              flex: result?.tiePerc ?? 1,
              backgroundColor: `rgb(${offColorValue}, ${offColorValue}, ${offColorValue})`,
            }}
          ></span>
          <span
            style={{
              flex: result?.defenders.winPerc ?? 0,
              backgroundColor: `rgb(${offColorValue}, ${offColorValue}, 255)`,
              borderLeft: `1px rgb(${borderValue}, ${borderValue}, ${borderValue}) solid`,
            }}
          ></span>
        </div>
      ) : (
        <Button
          variant="contained"
          color="success"
          disabled={
            !attackerFaction ||
            !defenderFaction ||
            attackerFleet.size === 0 ||
            defenderFleet.size === 0
          }
          className="ti4-combat-calc__simbutton"
          onClick={handleSimulateCombatClick}
        >
          Simulate!
        </Button>
      )}
      <Paper
        style={{ backgroundColor: "rgb(255, 245, 245)" }}
        className="ti4-combat-calc__attacker ti-combat-calc__participant"
        elevation={3}
      >
        <FactionFleetBuilderForm
          shouldUnitsBeOnRight={true}
          onFleetChange={handleAttackerFleetChange}
          onFactionChange={handleAttackerFactionChange}
        />
      </Paper>
      <Paper
        style={{ backgroundColor: "rgb(245, 245, 255)" }}
        className="ti4-combat-calc__defender ti-combat-calc__participant"
        elevation={3}
      >
        <FactionFleetBuilderForm
          shouldUnitsBeOnRight={false}
          onFleetChange={handleDefenderFleetChange}
          onFactionChange={handleDefenderFactionChange}
        />
      </Paper>
    </div>
  );
};
