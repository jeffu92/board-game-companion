import { Box, CircularProgress, Modal, Paper } from "@mui/material";
import classNames from "classnames";
import { Immutable } from "immer";
import { useCallback, useMemo, useState } from "react";
import { actionCardMap } from "../../ti4/classes/action-cards/actionCardMap";
import { Faction } from "../../ti4/classes/factions/Faction.class";
import { ActionCardEnum } from "../../ti4/enums/ActionCard.enum";
import {
  SPACE_ZONE_ID,
  useFleetBuilder,
} from "../../ti4/hooks/useFleetBuilder";
import { CombatStats, simulateCombat } from "../../ti4/utils/simulateCombat";
import { FactionFleetBuilderForm } from "./components/FactionFleetBuilderForm/FactionFleetBuilderForm.component";
import { ResultsBar } from "./components/ResultsBar/ResultsBar.component";
import { ResultsSummary } from "./components/ResultsSummary/ResultsSummary.component";
import { FleetBuilderContext } from "./contexts/FactionBuilderContext.context";
import "./Ti4CombatCalculator.page.css";

const paperOffColorValue = 245;
const resultsSpaceOffColorValue = paperOffColorValue - 55;
const resultsGroundOffColorValue = resultsSpaceOffColorValue - 40;
const summaryOffColorValue = resultsGroundOffColorValue - 50;
const attackerPaperBackgroundColor = `rgb(255, ${paperOffColorValue}, ${paperOffColorValue})`;
const defenderPaperBackgroundColor = `rgb(${paperOffColorValue}, ${paperOffColorValue}, 255)`;
const attackerResultsBackgroundColor = `rgb(255, ${resultsSpaceOffColorValue}, ${resultsSpaceOffColorValue})`;
const tieResultsBackgroundColor = `rgb(${resultsSpaceOffColorValue}, ${resultsSpaceOffColorValue}, ${resultsSpaceOffColorValue})`;
const defenderResultsBackgroundColor = `rgb(${resultsSpaceOffColorValue}, ${resultsSpaceOffColorValue}, 255)`;
const attackerSummaryTextColor = `rgb(255, ${summaryOffColorValue}, ${summaryOffColorValue})`;
const defenderSummaryTextColor = `rgb(${summaryOffColorValue}, ${summaryOffColorValue}, 255)`;
export const Ti4CombatCalculator = () => {
  const {
    faction: player1Faction,
    setFaction: player1SetFaction,
    spaceZone: player1SpaceZone,
    planetZones: player1PlanetZones,
    prototypes: player1Prototypes,
    selectedZone: player1SelectedZone,
    setSelectedZone: player1SetSelectedZone,
    addUnit: player1AddUnit,
    removeUnit: player1RemoveUnit,
    changeGrade: player1ChangeGrade,
    sustainDamage: player1SustainDamage,
    repairDamage: player1RepairDamage,
    addPlanet: player1AddPlanet,
    removePlanet: player1RemovePlanet,
    canUnitBeAddedToSelectedZone: player1CanUnitBeAddedToSelectedZone,
    remainingSpaceCapacity: player1RemainingSpaceCapacity,
    hasAtLeastOneUnit: player1HasAtLeastOneUnit,
    actionCards: player1ActionCards,
    addActionCard: player1AddActionCard,
    removeActionCard: player1RemoveActionCard,
  } = useFleetBuilder();
  const {
    faction: player2Faction,
    setFaction: player2SetFaction,
    spaceZone: player2SpaceZone,
    planetZones: player2PlanetZones,
    prototypes: player2Prototypes,
    selectedZone: player2SelectedZone,
    setSelectedZone: player2SetSelectedZone,
    addUnit: player2AddUnit,
    removeUnit: player2RemoveUnit,
    changeGrade: player2ChangeGrade,
    sustainDamage: player2SustainDamage,
    repairDamage: player2RepairDamage,
    addPlanet: player2AddPlanet,
    removePlanet: player2RemovePlanet,
    canUnitBeAddedToSelectedZone: player2CanUnitBeAddedToSelectedZone,
    remainingSpaceCapacity: player2RemainingSpaceCapacity,
    hasAtLeastOneUnit: player2HasAtLeastOneUnit,
    actionCards: player2ActionCards,
    addActionCard: player2AddActionCard,
    removeActionCard: player2RemoveActionCard,
  } = useFleetBuilder();
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [combatStats, setCombatStats] = useState<CombatStats | null>(null);
  const [
    defendingFaction,
    setDefendingFaction,
  ] = useState<Immutable<Faction> | null>(null);
  const [defendingZoneInfo, setDefendingZoneInfo] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const handleSimulateCombatClick = useCallback(
    async (options: {
      defendingFaction: Faction;
      planet?: { name: string; id: string };
    }) => {
      const { defendingFaction, planet } = options;
      if (player1Faction && player2Faction) {
        setIsSimulating(true);
        const combatStats = await simulateCombat({
          player1: {
            faction: player1Faction,
            space: player1SpaceZone,
            planets: player1PlanetZones,
            actionCards: player1ActionCards,
          },
          player2: {
            faction: player2Faction,
            space: player2SpaceZone,
            planets: player2PlanetZones,
            actionCards: player2ActionCards,
          },
          planetId: planet?.id,
        });
        setCombatStats(combatStats);
        setDefendingFaction(defendingFaction);
        setDefendingZoneInfo({
          name: planet?.name ?? SPACE_ZONE_ID,
          id: planet?.id ?? SPACE_ZONE_ID,
        });
        setIsSimulating(false);
      }
    },
    [
      player1ActionCards,
      player1Faction,
      player1PlanetZones,
      player1SpaceZone,
      player2ActionCards,
      player2Faction,
      player2PlanetZones,
      player2SpaceZone,
    ]
  );

  const areActionCardsAvailable = useCallback(
    (actionCardEnum: ActionCardEnum) => {
      return (
        (player1ActionCards.get(actionCardEnum) ?? 0) +
          (player2ActionCards.get(actionCardEnum) ?? 0) <
        (actionCardMap.get(actionCardEnum)?.numAvailable ?? 0)
      );
    },
    [player1ActionCards, player2ActionCards]
  );

  const shouldAllowSimulate = useMemo(() => {
    return (
      player1HasAtLeastOneUnit &&
      player2HasAtLeastOneUnit &&
      player1RemainingSpaceCapacity >= 0 &&
      player2RemainingSpaceCapacity >= 0
    );
  }, [
    player1HasAtLeastOneUnit,
    player1RemainingSpaceCapacity,
    player2HasAtLeastOneUnit,
    player2RemainingSpaceCapacity,
  ]);

  const player1BackgroundColor = useMemo(() => {
    if (!player1Faction || !defendingFaction) {
      return "white";
    }

    return defendingFaction.factionEnum === player1Faction.factionEnum
      ? defenderPaperBackgroundColor
      : attackerPaperBackgroundColor;
  }, [defendingFaction, player1Faction]);

  const player2BackgroundColor = useMemo(() => {
    if (!player2Faction || !defendingFaction) {
      return "white";
    }

    return defendingFaction.factionEnum === player2Faction.factionEnum
      ? defenderPaperBackgroundColor
      : attackerPaperBackgroundColor;
  }, [defendingFaction, player2Faction]);

  const player1ResultsBackgroundColor = useMemo(() => {
    if (!player1Faction || !defendingFaction) {
      return "white";
    }

    return defendingFaction.factionEnum === player1Faction.factionEnum
      ? defenderResultsBackgroundColor
      : attackerResultsBackgroundColor;
  }, [defendingFaction, player1Faction]);

  const player2ResultsBackgroundColor = useMemo(() => {
    if (!player2Faction || !defendingFaction) {
      return "white";
    }

    return defendingFaction.factionEnum === player2Faction.factionEnum
      ? defenderResultsBackgroundColor
      : attackerResultsBackgroundColor;
  }, [defendingFaction, player2Faction]);

  const isGroundCombat = useMemo(() => {
    return !!(
      defendingZoneInfo?.name && defendingZoneInfo?.name !== SPACE_ZONE_ID
    );
  }, [defendingZoneInfo]);

  const combatCalcClassnames = useMemo(
    () =>
      classNames([
        "ti4-combat-calc",
        {
          "ti4-combat-calc--results": !!combatStats,
        },
      ]),
    [combatStats]
  );

  return (
    <>
      <Modal open={isSimulating}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ padding: "20px" }}>
            <CircularProgress />
          </Paper>
        </Box>
      </Modal>
      <div className={combatCalcClassnames}>
        {combatStats && (
          <ResultsBar
            combatStats={combatStats}
            isGroundCombat={isGroundCombat}
            player1ResultsBackgroundColor={player1ResultsBackgroundColor}
            tieResultsBackgroundColor={tieResultsBackgroundColor}
            player2ResultsBackgroundColor={player2ResultsBackgroundColor}
          />
        )}
        {combatStats && (
          <ResultsSummary
            combatStats={combatStats}
            player1Faction={player1Faction}
            player2Faction={player2Faction}
            defendingFaction={defendingFaction}
            defendingZoneInfo={defendingZoneInfo}
            attackerSummaryTextColor={attackerSummaryTextColor}
            defenderSummaryTextColor={defenderSummaryTextColor}
          />
        )}
        <Paper
          style={{
            backgroundColor: player1BackgroundColor,
          }}
          className="ti4-combat-calc__player1 ti-combat-calc__participant"
          elevation={3}
        >
          <FleetBuilderContext.Provider
            value={{
              faction: player1Faction,
              setFaction: player1SetFaction,
              spaceZone: player1SpaceZone,
              planetZones: player1PlanetZones,
              prototypes: player1Prototypes,
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
              defendingZoneId: defendingZoneInfo?.id,
              canUnitBeAddedToSelectedZone: player1CanUnitBeAddedToSelectedZone,
              remainingSpaceCapacity: player1RemainingSpaceCapacity,
              hasAtLeastOneUnit: player1HasAtLeastOneUnit,
              shouldAllowSimulate,
              actionCards: player1ActionCards,
              addActionCard: player1AddActionCard,
              removeActionCard: player1RemoveActionCard,
              areActionCardsAvailable,
            }}
          >
            <FactionFleetBuilderForm shouldZonesBeOnRight={true} />
          </FleetBuilderContext.Provider>
        </Paper>
        <Paper
          style={{
            backgroundColor: player2BackgroundColor,
          }}
          className="ti4-combat-calc__player2 ti-combat-calc__participant"
          elevation={3}
        >
          <FleetBuilderContext.Provider
            value={{
              faction: player2Faction,
              setFaction: player2SetFaction,
              spaceZone: player2SpaceZone,
              planetZones: player2PlanetZones,
              prototypes: player2Prototypes,
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
              defendingZoneId: defendingZoneInfo?.id,
              canUnitBeAddedToSelectedZone: player2CanUnitBeAddedToSelectedZone,
              remainingSpaceCapacity: player2RemainingSpaceCapacity,
              hasAtLeastOneUnit: player2HasAtLeastOneUnit,
              shouldAllowSimulate,
              actionCards: player2ActionCards,
              addActionCard: player2AddActionCard,
              removeActionCard: player2RemoveActionCard,
              areActionCardsAvailable,
            }}
          >
            <FactionFleetBuilderForm shouldZonesBeOnRight={false} />
          </FleetBuilderContext.Provider>
        </Paper>
      </div>
    </>
  );
};
