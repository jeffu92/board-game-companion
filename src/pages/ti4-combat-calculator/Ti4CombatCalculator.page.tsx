import { ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material";
import classNames from "classnames";
import { useCallback, useMemo, useState } from "react";
import { Faction } from "../../ti4/classes/factions/Faction.class";
import {
  SPACE_ZONE_ID,
  useFleetBuilder,
} from "../../ti4/hooks/useFleetBuilder";
import { CombatStats, simulateCombat } from "../../ti4/utils/simulateCombat";
import { FactionFleetBuilderForm } from "./components/FactionFleetBuilderForm/FactionFleetBuilderForm.component";
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
  } = useFleetBuilder();
  const [result, setResult] = useState<CombatStats | null>(null);
  const [defendingFaction, setDefendingFaction] = useState<Faction | null>(
    null
  );
  const [defendingZoneInfo, setDefendingZoneInfo] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const handleSimulateCombatClick = useCallback(
    (options: {
      defendingFaction: Faction;
      planet?: { name: string; id: string };
    }) => {
      const { defendingFaction, planet } = options;
      if (player1Faction && player2Faction) {
        const result = simulateCombat({
          player1: {
            faction: player1Faction,
            space: player1SpaceZone,
            planets: player1PlanetZones,
          },
          player2: {
            faction: player2Faction,
            space: player2SpaceZone,
            planets: player2PlanetZones,
          },
          planetId: planet?.id,
        });
        setResult(result);
        setDefendingFaction(defendingFaction);
        setDefendingZoneInfo({
          name: planet?.name ?? SPACE_ZONE_ID,
          id: planet?.id ?? SPACE_ZONE_ID,
        });
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
    return defendingZoneInfo?.name && defendingZoneInfo?.name !== SPACE_ZONE_ID;
  }, [defendingZoneInfo]);

  const summaryTitle = useMemo(() => {
    if (
      player1Faction &&
      player2Faction &&
      defendingFaction &&
      defendingZoneInfo &&
      result
    ) {
      const differential =
        defendingZoneInfo.name === SPACE_ZONE_ID
          ? result.player1.winSpacePerc - result.player2.winSpacePerc
          : result.player1.winGroundPerc - result.player2.winGroundPerc;
      if (differential <= 10 && differential >= -10) {
        return (
          <>
            <span>
              It's a <b>toss-up.</b>
            </span>
          </>
        );
      } else {
        const winningFaction =
          differential > 0 ? player1Faction : player2Faction;
        let winningDescription;
        if (differential > 80 || differential < -80) {
          winningDescription = "Extremely Favored";
        } else if (differential > 50 || differential < -50) {
          winningDescription = "Heavily Favored";
        } else if (differential > 30 || differential < -30) {
          winningDescription = "Favored";
        } else if (differential > 10 || differential < -10) {
          winningDescription = "Slightly Favored";
        }

        let outcomeDescription;
        if (winningFaction.factionEnum === defendingFaction.factionEnum) {
          outcomeDescription = "Maintain Control";
        } else {
          outcomeDescription = "Gain Control";
        }

        const winningFactionTextColor =
          winningFaction.factionEnum === defendingFaction.factionEnum
            ? defenderSummaryTextColor
            : attackerSummaryTextColor;
        return (
          <>
            <span>
              <b
                style={{
                  color: winningFactionTextColor,
                }}
              >
                {winningFaction.factionEnum}
              </b>{" "}
              are <b>{winningDescription}</b> to <b>{outcomeDescription}</b> of{" "}
              <b>{defendingZoneInfo.name}</b>.
            </span>
          </>
        );
      }
    }

    return "Summary";
  }, [
    defendingFaction,
    defendingZoneInfo,
    player1Faction,
    player2Faction,
    result,
  ]);

  const combatCalcClassnames = classNames([
    "ti4-combat-calc",
    {
      "ti4-combat-calc--results": !!result,
    },
  ]);

  return (
    <div className={combatCalcClassnames}>
      {result && (
        <Paper
          className="ti4-combat-calc__results"
          style={{
            backgroundColor: "transparent",
          }}
          elevation={3}
        >
          <span
            style={{
              flex: isGroundCombat
                ? result.player1.winGroundPerc
                : result.player1.winSpacePerc,
              backgroundColor: player1ResultsBackgroundColor,
            }}
          ></span>
          {!isGroundCombat && (
            <span
              style={{
                flex: result.tieSpacePerc,
                backgroundColor: tieResultsBackgroundColor,
              }}
            ></span>
          )}
          <span
            style={{
              flex: isGroundCombat
                ? result.player2.winGroundPerc
                : result.player2.winSpacePerc,
              backgroundColor: player2ResultsBackgroundColor,
            }}
          ></span>
        </Paper>
      )}
      {result && (
        <Paper className="ti4-combat-calc__summary" elevation={3}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreRounded />}>
              <Typography>{summaryTitle}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {result.player1.winSpacePerc.toFixed(2)}% Chance Player 1 Wins
                Space Combat
              </div>
              <div>
                {result.player1.winGroundPerc.toFixed(2)}% Chance Player 1 Wins
                Ground Combat
              </div>
              <div>
                {result.tieSpacePerc.toFixed(2)}% Chance Tie Space Combat
              </div>
              <div>
                {result.player2.winSpacePerc.toFixed(2)}% Chance Player 2 Wins
                Space Combat
              </div>
              <div>
                {result.player2.winGroundPerc.toFixed(2)}% Chance Player 2 Wins
                Ground Combat
              </div>
            </AccordionDetails>
          </Accordion>
        </Paper>
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
          }}
        >
          <FactionFleetBuilderForm shouldZonesBeOnRight={false} />
        </FleetBuilderContext.Provider>
      </Paper>
    </div>
  );
};
