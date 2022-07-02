import { Paper } from "@mui/material";
import { useCallback, useState } from "react";
import { useFleetBuilder } from "../../ti4/hooks/useFleetBuilder";
import { CombatStats, simulateCombat } from "../../ti4/utils/simulateCombat";
import { FactionFleetBuilderForm } from "./components/FactionFleetBuilderForm/FactionFleetBuilderForm.component";
import { FleetBuilderContext } from "./contexts/FactionBuilderContext.context";
import "./Ti4CombatCalculator.page.css";

export const Ti4CombatCalculator = () => {
  const {
    faction: attackerFaction,
    setFaction: attackerSetFaction,
    spaceZone: attackerSpaceZone,
    planetZones: attackerPlanetZones,
    unitIsUpgraded: attackerUnitIsUpgraded,
    selectedZone: attackerSelectedZone,
    setSelectedZone: attackerSetSelectedZone,
    addUnit: attackerAddUnit,
    removeUnit: attackerRemoveUnit,
    changeGrade: attackerChangeGrade,
    sustainDamage: attackerSustainDamage,
    repairDamage: attackerRepairDamage,
    addPlanet: attackerAddPlanet,
    removePlanet: attackerRemovePlanet,
  } = useFleetBuilder();
  const {
    faction: defenderFaction,
    setFaction: defenderSetFaction,
    spaceZone: defenderSpaceZone,
    planetZones: defenderPlanetZones,
    unitIsUpgraded: defenderUnitIsUpgraded,
    selectedZone: defenderSelectedZone,
    setSelectedZone: defenderSetSelectedZone,
    addUnit: defenderAddUnit,
    removeUnit: defenderRemoveUnit,
    changeGrade: defenderChangeGrade,
    sustainDamage: defenderSustainDamage,
    repairDamage: defenderRepairDamage,
    addPlanet: defenderAddPlanet,
    removePlanet: defenderRemovePlanet,
  } = useFleetBuilder();
  const [result, setResult] = useState<CombatStats | null>(null);

  const handleSimulateCombatClick = useCallback(
    (id: string) => {
      if (attackerFaction && defenderFaction) {
        const attackerUnits = attackerPlanetZones.get(id) ?? attackerSpaceZone;
        const defenderUnits = defenderPlanetZones.get(id) ?? defenderSpaceZone;

        if (attackerUnits && defenderUnits) {
          const result = simulateCombat(
            {
              faction: attackerFaction,
              units: attackerUnits,
            },
            {
              faction: defenderFaction,
              units: defenderUnits,
            }
          );
          setResult(result);
        }
      }
    },
    [
      attackerFaction,
      attackerPlanetZones,
      attackerSpaceZone,
      defenderFaction,
      defenderPlanetZones,
      defenderSpaceZone,
    ]
  );

  const offColorValue = 190;
  const borderValue = offColorValue - 50;

  return (
    <div className="ti4-combat-calc">
      <div className="ti4-combat-calc__results">
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
      <Paper
        style={{ backgroundColor: "rgb(255, 245, 245)" }}
        className="ti4-combat-calc__attacker ti-combat-calc__participant"
        elevation={3}
      >
        <FleetBuilderContext.Provider
          value={{
            faction: attackerFaction,
            setFaction: attackerSetFaction,
            spaceZone: attackerSpaceZone,
            planetZones: attackerPlanetZones,
            unitIsUpgraded: attackerUnitIsUpgraded,
            selectedZone: attackerSelectedZone,
            setSelectedZone: attackerSetSelectedZone,
            addUnit: attackerAddUnit,
            removeUnit: attackerRemoveUnit,
            changeGrade: attackerChangeGrade,
            sustainDamage: attackerSustainDamage,
            repairDamage: attackerRepairDamage,
            addPlanet: attackerAddPlanet,
            removePlanet: attackerRemovePlanet,
            simulateCombatInZone: handleSimulateCombatClick,
          }}
        >
          <FactionFleetBuilderForm shouldZonesBeOnRight={true} />
        </FleetBuilderContext.Provider>
      </Paper>
      <Paper
        style={{ backgroundColor: "rgb(245, 245, 255)" }}
        className="ti4-combat-calc__defender ti-combat-calc__participant"
        elevation={3}
      >
        <FleetBuilderContext.Provider
          value={{
            faction: defenderFaction,
            setFaction: defenderSetFaction,
            spaceZone: defenderSpaceZone,
            planetZones: defenderPlanetZones,
            unitIsUpgraded: defenderUnitIsUpgraded,
            selectedZone: defenderSelectedZone,
            setSelectedZone: defenderSetSelectedZone,
            addUnit: defenderAddUnit,
            removeUnit: defenderRemoveUnit,
            changeGrade: defenderChangeGrade,
            sustainDamage: defenderSustainDamage,
            repairDamage: defenderRepairDamage,
            addPlanet: defenderAddPlanet,
            removePlanet: defenderRemovePlanet,
            simulateCombatInZone: handleSimulateCombatClick,
          }}
        >
          <FactionFleetBuilderForm shouldZonesBeOnRight={false} />
        </FleetBuilderContext.Provider>
      </Paper>
    </div>
  );
};
