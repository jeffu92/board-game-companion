import { Button, IconButton, Paper, Typography } from "@mui/material";
import { Unit } from "../../../../../../../../../../ti4/classes/units/Unit.class";
import "./UnitZone.component.css";
import { ShipConfiguration } from "./components/ShipConfiguration/ShipConfiguration.component";
import { Immutable } from "immer";
import { BarChart, Cancel } from "@mui/icons-material";

export interface UnitZoneProps {
  name: string;
  units: Immutable<Map<string, Unit>>;
  isSelected: boolean;
  onSimulateZone: () => void;
  onRemoveZone?: () => void;
  onSelectZone: () => void;
}

export const UnitZone = (props: UnitZoneProps) => {
  const {
    name,
    units,
    isSelected,
    onSimulateZone,
    onRemoveZone,
    onSelectZone,
  } = props;

  return (
    <Paper
      className="unit-zone"
      elevation={isSelected ? 15 : 1}
      sx={{
        border: `1px ${isSelected ? "gray" : "lightgray"} solid`,
      }}
    >
      <div className="unit-zone__title-container">
        <IconButton color="success" onClick={onSimulateZone}>
          <BarChart />
        </IconButton>
        <Button className="unit-zone__title" onClick={onSelectZone}>
          {name}
        </Button>
        {onRemoveZone && (
          <IconButton color="error" onClick={onRemoveZone}>
            <Cancel />
          </IconButton>
        )}
      </div>
      {units.size === 0 ? (
        <Typography>No Units</Typography>
      ) : (
        Array.from(units.entries()).map(([id, unit]) => {
          return (
            <ShipConfiguration
              key={id}
              id={id}
              name={unit.name}
              canSustainDamage={unit.canSustainDamage}
              hasSustainedDamage={unit.hasSustainedDamage}
            />
          );
        })
      )}
    </Paper>
  );
};
