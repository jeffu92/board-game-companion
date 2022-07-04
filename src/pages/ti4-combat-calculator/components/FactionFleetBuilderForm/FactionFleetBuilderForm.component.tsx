import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useContext } from "react";
import "./FactionFleetBuilderForm.component.css";
import { FleetBuilderForm } from "./components/FleetBuilderForm/FleetBuilderForm.component";
import { factionMap } from "../../../../ti4/utils/factionMap";
import { FleetBuilderContext } from "../../contexts/FactionBuilderContext.context";

export interface FactionFleetBuilderFormProps {
  shouldZonesBeOnRight: boolean;
}

export const FactionFleetBuilderForm = (
  props: FactionFleetBuilderFormProps
) => {
  const { shouldZonesBeOnRight } = props;

  const context = useContext(FleetBuilderContext);

  const handleFactionChange = useCallback(
    (event: SelectChangeEvent) => {
      const newFaction = factionMap.get(event.target.value);
      if (newFaction) {
        context?.setFaction(newFaction);
      }
    },
    [context]
  );

  if (!context) {
    return null;
  }

  return (
    <div className="faction-fleet-builder-form">
      <div className="faction-fleet-builder-form__faction-select-container">
        <FormControl fullWidth>
          <InputLabel id="faction-select-label">Faction</InputLabel>
          <Select
            className="faction-fleet-builder-form__faction-select"
            value={context.faction?.factionEnum ?? ""}
            labelId="faction-select-label"
            label="Faction"
            onChange={handleFactionChange}
          >
            {Array.from(factionMap.keys()).map((factionName: string) => {
              return (
                <MenuItem key={factionName} value={factionName}>
                  {factionName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
      {context.faction && (
        <FleetBuilderForm
          className="faction-fleet-builder-form__fleet-builder-form"
          shouldZonesBeOnRight={shouldZonesBeOnRight}
        />
      )}
    </div>
  );
};
