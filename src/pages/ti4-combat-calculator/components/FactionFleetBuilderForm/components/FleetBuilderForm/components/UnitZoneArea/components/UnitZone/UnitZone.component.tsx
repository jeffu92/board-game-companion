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

  return (
    <Paper
      className="unit-zone"
      sx={{
        border: `1px lightgray solid`,
      }}
    >
      <div className="unit-zone__title-container">
        <IconButton
          color="success"
          onClick={onSimulateZone}
          disabled={!context.shouldAllowSimulate}
        >
          {context.defendingZoneId === id ? (
            <RocketLaunchRounded />
          ) : (
            <BarChartRounded />
          )}
        </IconButton>
        <Button className="unit-zone__title" onClick={onSelectZone}>
          {name}
        </Button>
        {remainingCapacity !== undefined && (
          <Typography sx={{ color: capacityColor, fontWeight: "bold" }}>
            {remainingCapacity}
          </Typography>
        )}
        {onRemoveZone && (
          <IconButton color="error" onClick={onRemoveZone}>
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
