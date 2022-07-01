import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useState } from "react";
import { FactionEnum } from "../../../../ti4/enums/Faction.enum";
import "./FactionFleetBuilderForm.component.css";
import { FleetBuilderForm } from "./components/FleetBuilderForm/FleetBuilderForm.component";
import { Unit } from "../../../../ti4/classes/units/Unit.class";

export interface FactionFleetBuilderFormProps {
  onFleetChange: (newFleet: Map<string, Unit>) => void;
  onFactionChange: (newFaction: string) => void;
}

export const FactionFleetBuilderForm = (
  props: FactionFleetBuilderFormProps
) => {
  const { onFleetChange, onFactionChange } = props;

  const [faction, setFaction] = useState<string>("");

  const handleFactionChange = useCallback(
    (event: SelectChangeEvent) => {
      const newFaction = event.target.value;
      setFaction(newFaction);
      onFactionChange(newFaction);
    },
    [onFactionChange]
  );

  return (
    <div className="faction-fleet-builder-form">
      <div className="faction-fleet-builder-form__faction-select-container">
        <FormControl fullWidth>
          <InputLabel id="faction-select-label">Faction</InputLabel>
          <Select
            value={faction}
            labelId="faction-select-label"
            label="Faction"
            onChange={handleFactionChange}
          >
            <MenuItem value={FactionEnum.WINNU}>{FactionEnum.WINNU}</MenuItem>
            <MenuItem value={FactionEnum.NAAZROKHA}>
              {FactionEnum.NAAZROKHA}
            </MenuItem>
            <MenuItem value={FactionEnum.JOLNAR}>{FactionEnum.JOLNAR}</MenuItem>
          </Select>
        </FormControl>
      </div>
      {faction && (
        <FleetBuilderForm
          className="faction-fleet-builder-form__fleet-builder-form"
          faction={faction}
          onFleetChange={onFleetChange}
        />
      )}
    </div>
  );
};
