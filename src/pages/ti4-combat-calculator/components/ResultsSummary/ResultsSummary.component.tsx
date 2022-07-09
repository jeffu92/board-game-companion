import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import "./ResultsSummary.component.css";
import { useMemo } from "react";
import { Immutable } from "immer";
import { Faction } from "../../../../ti4/entities/factions/Faction";
import { SPACE_ZONE_ID } from "../../../../ti4/hooks/useFleetBuilder";
import { CombatStats } from "../../../../ti4/utils/combat-simulation/CombatStats";

export interface ResultsSummaryProps {
  combatStats: CombatStats;
  player1Faction: Immutable<Faction> | null;
  player2Faction: Immutable<Faction> | null;
  defendingFaction: Immutable<Faction> | null;
  defendingZoneInfo: {
    name: string;
    id: string;
  } | null;
  attackerSummaryTextColor: string;
  defenderSummaryTextColor: string;
}

export const ResultsSummary = (props: ResultsSummaryProps) => {
  const {
    combatStats,
    player1Faction,
    player2Faction,
    defendingFaction,
    defendingZoneInfo,
    attackerSummaryTextColor,
    defenderSummaryTextColor,
  } = props;

  const summaryTitle = useMemo(() => {
    if (
      player1Faction &&
      player2Faction &&
      defendingFaction &&
      defendingZoneInfo
    ) {
      const differential =
        defendingZoneInfo.name === SPACE_ZONE_ID
          ? combatStats.player1.winSpacePerc - combatStats.player2.winSpacePerc
          : combatStats.player1.winGroundPerc -
            combatStats.player2.winGroundPerc;
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
    attackerSummaryTextColor,
    combatStats,
    defenderSummaryTextColor,
    defendingFaction,
    defendingZoneInfo,
    player1Faction,
    player2Faction,
  ]);

  return (
    <Paper className="results-summary" elevation={3}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreRounded />}>
          <Typography>{summaryTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            {combatStats.player1.winSpacePerc.toFixed(2)}% Chance Player 1 Wins
            Space Combat
          </div>
          <div>
            {combatStats.player1.winGroundPerc.toFixed(2)}% Chance Player 1 Wins
            Ground Combat
          </div>
          <div>
            {combatStats.tieSpacePerc.toFixed(2)}% Chance Tie Space Combat
          </div>
          <div>
            {combatStats.player2.winSpacePerc.toFixed(2)}% Chance Player 2 Wins
            Space Combat
          </div>
          <div>
            {combatStats.player2.winGroundPerc.toFixed(2)}% Chance Player 2 Wins
            Ground Combat
          </div>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};
