import { Paper } from "@mui/material";
import { CombatStats } from "../../../../ti4/utils/simulateCombat";
import "./ResultsBar.component.css";

export interface ResultsBarProps {
  combatStats: CombatStats;
  isGroundCombat: boolean;
  player1ResultsBackgroundColor: string;
  tieResultsBackgroundColor: string;
  player2ResultsBackgroundColor: string;
}

export const ResultsBar = (props: ResultsBarProps) => {
  const {
    combatStats,
    isGroundCombat,
    player1ResultsBackgroundColor,
    tieResultsBackgroundColor,
    player2ResultsBackgroundColor,
  } = props;

  return (
    <Paper
      className="results-bar"
      style={{
        backgroundColor: "transparent",
      }}
      elevation={3}
    >
      <span
        style={{
          flex: isGroundCombat
            ? combatStats.player1.winGroundPerc
            : combatStats.player1.winSpacePerc,
          backgroundColor: player1ResultsBackgroundColor,
        }}
      ></span>
      {!isGroundCombat && (
        <span
          style={{
            flex: combatStats.tieSpacePerc,
            backgroundColor: tieResultsBackgroundColor,
          }}
        ></span>
      )}
      <span
        style={{
          flex: isGroundCombat
            ? combatStats.player2.winGroundPerc
            : combatStats.player2.winSpacePerc,
          backgroundColor: player2ResultsBackgroundColor,
        }}
      ></span>
    </Paper>
  );
};
