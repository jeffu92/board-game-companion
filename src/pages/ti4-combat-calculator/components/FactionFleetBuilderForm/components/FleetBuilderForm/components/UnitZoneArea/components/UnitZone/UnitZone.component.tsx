import { useContext } from "react";
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
  isSelected: boolean;
  onSimulateZone: () => void;
  onRemoveZone?: () => void;
  onSelectZone: () => void;
}

export const UnitZone = (props: UnitZoneProps) => {
  const context = useContext(FleetBuilderContext);

  if (!context) {
    return null;
  }

  const { id, name, units, onSimulateZone, onRemoveZone, onSelectZone } = props;

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
          sx={{ marginRight: "5px" }}
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
        {onRemoveZone && (
          <IconButton
            color="error"
            onClick={onRemoveZone}
            sx={{ marginLeft: "5px" }}
          >
            <CloseRounded />
          </IconButton>
        )}
      </div>
      {units.size === 0 ? (
        <Typography>No Units</Typography>
      ) : (
        <div style={{ margin: "10px" }}>
          {Array.from(units.entries()).map(([id, unit]) => {
            return (
              <ShipConfiguration
                key={id}
                id={id}
                name={unit.name}
                canSustainDamage={unit.canSustainDamage ?? false}
                hasSustainedDamage={unit.hasSustainedDamage ?? false}
              />
            );
          })}
        </div>
      )}
    </Paper>
  );
};
