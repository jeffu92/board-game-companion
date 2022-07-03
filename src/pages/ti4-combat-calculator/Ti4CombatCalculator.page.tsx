import { Paper } from "@mui/material";
import { useCallback, useState } from "react";
import { useFleetBuilder } from "../../ti4/hooks/useFleetBuilder";
import { CombatStats, simulateCombat } from "../../ti4/utils/simulateCombat";
import { FactionFleetBuilderForm } from "./components/FactionFleetBuilderForm/FactionFleetBuilderForm.component";
import { FleetBuilderContext } from "./contexts/FactionBuilderContext.context";
import "./Ti4CombatCalculator.page.css";

export const Ti4CombatCalculator = () => {
  const {
    faction: player1Faction,
    setFaction: player1SetFaction,
    spaceZone: player1SpaceZone,
    planetZones: player1PlanetZones,
    unitIsUpgraded: player1UnitIsUpgraded,
    selectedZone: player1SelectedZone,
    setSelectedZone: player1SetSelectedZone,
    addUnit: player1AddUnit,
    removeUnit: player1RemoveUnit,
    changeGrade: player1ChangeGrade,
    sustainDamage: player1SustainDamage,
    repairDamage: player1RepairDamage,
    addPlanet: player1AddPlanet,
    removePlanet: player1RemovePlanet,
  } = useFleetBuilder();
  const {
    faction: player2Faction,
    setFaction: player2SetFaction,
    spaceZone: player2SpaceZone,
    planetZones: player2PlanetZones,
    unitIsUpgraded: player2UnitIsUpgraded,
    selectedZone: player2SelectedZone,
    setSelectedZone: player2SetSelectedZone,
    addUnit: player2AddUnit,
    removeUnit: player2RemoveUnit,
    changeGrade: player2ChangeGrade,
    sustainDamage: player2SustainDamage,
    repairDamage: player2RepairDamage,
    addPlanet: player2AddPlanet,
    removePlanet: player2RemovePlanet,
  } = useFleetBuilder();
  const [result, setResult] = useState<CombatStats | null>(null);

  const handleSimulateCombatClick = useCallback(
    (planetId?: string) => {
      if (player1Faction && player2Faction) {
        const result = simulateCombat(
          {
            faction: player1Faction,
            space: player1SpaceZone,
            planets: player1PlanetZones,
          },
          {
            faction: player2Faction,
            space: player2SpaceZone,
            planets: player2PlanetZones,
          },
          planetId
        );
        setResult(result);
      }
    },
    [
      player1Faction,
      player1PlanetZones,
      player1SpaceZone,
      player2Faction,
      player2PlanetZones,
      player2SpaceZone,
    ]
  );

  const offColorValue = 190;
  const borderValue = offColorValue - 50;

  return (
    <div className="ti4-combat-calc">
      <div className="ti4-combat-calc__results">
        <span
          style={{
            flex: result?.player1.winPerc ?? 0,
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
            flex: result?.player2.winPerc ?? 0,
            backgroundColor: `rgb(${offColorValue}, ${offColorValue}, 255)`,
            borderLeft: `1px rgb(${borderValue}, ${borderValue}, ${borderValue}) solid`,
          }}
        ></span>
      </div>
      <Paper
        style={{ backgroundColor: "rgb(255, 245, 245)" }}
        className="ti4-combat-calc__player1 ti-combat-calc__participant"
        elevation={3}
      >
        <FleetBuilderContext.Provider
          value={{
            faction: player1Faction,
            setFaction: player1SetFaction,
            spaceZone: player1SpaceZone,
            planetZones: player1PlanetZones,
            unitIsUpgraded: player1UnitIsUpgraded,
            selectedZone: player1SelectedZone,
            setSelectedZone: player1SetSelectedZone,
            addUnit: player1AddUnit,
            removeUnit: player1RemoveUnit,
            changeGrade: player1ChangeGrade,
            sustainDamage: player1SustainDamage,
            repairDamage: player1RepairDamage,
            addPlanet: player1AddPlanet,
            removePlanet: player1RemovePlanet,
            simulateCombatInZone: handleSimulateCombatClick,
          }}
        >
          <FactionFleetBuilderForm shouldZonesBeOnRight={true} />
        </FleetBuilderContext.Provider>
      </Paper>
      <Paper
        style={{ backgroundColor: "rgb(245, 245, 255)" }}
        className="ti4-combat-calc__player2 ti-combat-calc__participant"
        elevation={3}
      >
        <FleetBuilderContext.Provider
          value={{
            faction: player2Faction,
            setFaction: player2SetFaction,
            spaceZone: player2SpaceZone,
            planetZones: player2PlanetZones,
            unitIsUpgraded: player2UnitIsUpgraded,
            selectedZone: player2SelectedZone,
            setSelectedZone: player2SetSelectedZone,
            addUnit: player2AddUnit,
            removeUnit: player2RemoveUnit,
            changeGrade: player2ChangeGrade,
            sustainDamage: player2SustainDamage,
            repairDamage: player2RepairDamage,
            addPlanet: player2AddPlanet,
            removePlanet: player2RemovePlanet,
            simulateCombatInZone: handleSimulateCombatClick,
          }}
        >
          <FactionFleetBuilderForm shouldZonesBeOnRight={false} />
        </FleetBuilderContext.Provider>
      </Paper>
    </div>
  );
};
