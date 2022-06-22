import { Button, Paper } from "@mui/material";
import { useCallback, useState } from "react";
import { Unit } from "../../ti4/classes/units/Unit.class";
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
  const [result, setResult] = useState<CombatStats | null>(null);

  const onSimulateCombat = useCallback(
    (attackerFleet: Map<string, Unit>, defenderFleet: Map<string, Unit>) => {
      const result = simulateCombat(attackerFleet, defenderFleet);
      setResult(result);
    },
    []
  );

  const handleSimiulateClick = useCallback(() => {
    onSimulateCombat(attackerFleet, defenderFleet);
  }, [attackerFleet, defenderFleet, onSimulateCombat]);

  const handleDefenderFleetChange = useCallback(
    (newFleet: Map<string, Unit>) => {
      setDefenderFleet(newFleet);
      onSimulateCombat(attackerFleet, newFleet);
    },
    [attackerFleet, onSimulateCombat]
  );

  const handleAttackerFleetChange = useCallback(
    (newFleet: Map<string, Unit>) => {
      setAttackerFleet(newFleet);
      onSimulateCombat(newFleet, defenderFleet);
    },
    [defenderFleet, onSimulateCombat]
  );

  return (
    <div className="ti4-combat-calc">
      <div className="ti4-combat-calc__header">
        Twilight Imperium Combat Calculator
      </div>
      <Paper
        className="ti4-combat-calc__attacker ti-combat-calc__participant"
        elevation={7}
      >
        <div>Attacker</div>
        <FactionFleetBuilderForm onFleetChange={handleAttackerFleetChange} />
      </Paper>
      <Paper
        className="ti4-combat-calc__defender ti-combat-calc__participant"
        elevation={7}
      >
        <div>Defender</div>
        <FactionFleetBuilderForm onFleetChange={handleDefenderFleetChange} />
      </Paper>
      <Button
        className="ti4-combat-calc__simbutton"
        onClick={handleSimiulateClick}
      >
        Simulate
      </Button>
      <div className="ti4-combat-calc__results">
        <span
          style={{
            height: "40px",
            flex: result?.attackers.winPerc ?? 1,
            backgroundColor: "lightcoral",
          }}
        ></span>
        <span
          style={{
            height: "40px",
            flex: result?.tiePerc ?? 1,
            backgroundColor: "lightgray",
          }}
        ></span>
        <span
          style={{
            height: "40px",
            flex: result?.defenders.winPerc ?? 1,
            backgroundColor: "lightskyblue",
          }}
        ></span>
      </div>
    </div>
  );
};
