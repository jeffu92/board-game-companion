import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import "./AddUnitsPanel.component.css";
import { UpgradeDowngradeButton } from "../UpgradeDowngradeButton/UpgradeDowngradeButton.component";
import { useCallback, useContext } from "react";
import { FleetBuilderContext } from "../../../../../../contexts/FactionBuilderContext.context";
import { SPACE_ZONE_ID } from "../../../../../../../../ti4/hooks/useFleetBuilder";

export const AddUnitsPanel = () => {
  const context = useContext(FleetBuilderContext);

  const handleAddUnitToZoneChanged = useCallback(
    (event: SelectChangeEvent) => {
      context?.setSelectedZone(event.target.value);
    },
    [context]
  );

  if (!context || !context.faction) {
    return null;
  }

  return (
    <Paper className="add-units-panel" elevation={1}>
      <div style={{ padding: "20px 20px 10px 20px" }}>
        <FormControl fullWidth>
          <InputLabel id="zone">Add Units To</InputLabel>
          <Select
            value={context.selectedZone}
            labelId="zone"
            label="Add Units To"
            onChange={handleAddUnitToZoneChanged}
          >
            <MenuItem key={SPACE_ZONE_ID} value={SPACE_ZONE_ID}>
              {SPACE_ZONE_ID}
            </MenuItem>
            {Array.from(context.planetZones.keys()).map(
              (planetId: string, index: number) => {
                return (
                  <MenuItem key={planetId} value={planetId}>
                    Planet {index + 1}
                  </MenuItem>
                );
              }
            )}
          </Select>
        </FormControl>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 20px 10px 20px",
          borderBottom: "1px lightgray solid",
        }}
      >
        <Button onClick={context.addPlanet}>Add Planet</Button>
      </div>
      <div style={{ padding: "20px" }}>
        {Array.from(context.prototypes).map(([unitEnum, unit]) => {
          const unitName = unit.name;
          const addThisUnit = () => context.addUnit(unitEnum);
          if (context.canUnitBeAddedToSelectedZone(unit)) {
            return (
              <div key={unitEnum} className="add-units-panel__container">
                <span></span>
                <Button onClick={addThisUnit}>{unitName}</Button>
                {unit.upgrade ? (
                  <UpgradeDowngradeButton unit={unit} />
                ) : (
                  <span></span>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </Paper>
  );
};
