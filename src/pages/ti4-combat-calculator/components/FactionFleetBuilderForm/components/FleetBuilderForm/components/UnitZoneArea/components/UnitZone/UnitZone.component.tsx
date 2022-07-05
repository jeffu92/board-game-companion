import { useContext, useMemo } from "react";
import { Button, IconButton, Paper, Typography } from "@mui/material";
import { Unit } from "../../../../../../../../../../ti4/classes/units/Unit.class";
import "./UnitZone.component.css";
import { ShipConfiguration } from "./components/ShipConfiguration/ShipConfiguration.component";
import { Immutable } from "immer";
import {
  BarChartRounded,
  CloseRounded,
  RocketLaunchRounded,
} from "@mui/icons-material";
import { FleetBuilderContext } from "../../../../../../../../contexts/FactionBuilderContext.context";

export interface UnitZoneProps {
  id: string;
  name: string;
  units: Immutable<Map<string, Unit>>;
  remainingCapacity?: number;
  onSimulateZone: () => void;
  onRemoveZone?: () => void;
  onSelectZone: () => void;
}

export const UnitZone = (props: UnitZoneProps) => {
  const {
    id,
    name,
    units,
    remainingCapacity,
    onSimulateZone,
    onRemoveZone,
    onSelectZone,
  } = props;
  const context = useContext(FleetBuilderContext);

  const capacityColor = useMemo(() => {
    if (remainingCapacity !== undefined) {
      if (remainingCapacity > 0) {
        return "green";
      } else if (remainingCapacity < 0) {
        return "red";
      }
    }

    return "inherit";
  }, [remainingCapacity]);

  if (!context) {
    return null;
  }

  const isTheDefendingZone = context.defendingZoneId === id;

  return (
    <Paper
      className="unit-zone"
      sx={{
        border: `1px lightgray solid`,
      }}
    >
      <div className="unit-zone__title-container">
        <IconButton
          color={isTheDefendingZone ? "error" : "default"}
          onClick={onSimulateZone}
          disabled={!context.shouldAllowSimulate}
          title={
            isTheDefendingZone
              ? "Simulation occured here. Click to run simulation again."
              : "Simulate."
          }
        >
          {isTheDefendingZone ? <RocketLaunchRounded /> : <BarChartRounded />}
        </IconButton>
        <Button
          className="unit-zone__title"
          onClick={onSelectZone}
          title="Select to add units to this area."
        >
          {name}
        </Button>
        {remainingCapacity !== undefined && (
          <Typography
            sx={{ color: capacityColor, fontWeight: "bold" }}
            title="Remaining capacity."
          >
            {remainingCapacity}
          </Typography>
        )}
        {onRemoveZone && (
          <IconButton
            onClick={onRemoveZone}
            title="Delete planet and all units."
          >
            <CloseRounded />
          </IconButton>
        )}
      </div>
      {units.size === 0 ? (
        <Typography style={{ margin: "10px" }}>No Units</Typography>
      ) : (
        <div style={{ margin: "10px" }}>
          {Array.from(units.entries()).map(([id, unit]) => {
            return <ShipConfiguration key={id} id={id} unit={unit} />;
          })}
        </div>
      )}
    </Paper>
  );
};
