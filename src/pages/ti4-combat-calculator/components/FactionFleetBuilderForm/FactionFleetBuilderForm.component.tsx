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
import { FleetBuilderForm } from "../FleetBuilderForm/FleetBuilderForm.component";
import { Unit } from "../../../../ti4/classes/Unit.class";

export interface FactionFleetBuilderFormProps {
  onFleetChange: (newFleet: Map<string, Unit>) => void;
}

export const FactionFleetBuilderForm = (
  props: FactionFleetBuilderFormProps
) => {
  const { onFleetChange } = props;

  const [faction, setFaction] = useState<string>("");

  const handleFactionChange = useCallback((event: SelectChangeEvent) => {
    const newFaction = event.target.value;
    setFaction(newFaction);
  }, []);

  return (
    <div className="faction-fleet-builder-form">
      <FormControl>
        <InputLabel id="faction-select-label">Faction</InputLabel>
        <Select
          value={faction}
          labelId="faction-select-label"
          label="Faction"
          onChange={handleFactionChange}
        >
          <MenuItem value={FactionEnum.WINNU}>The Winnu</MenuItem>
          <MenuItem value={FactionEnum.NAAZROKHA}>
            The Naaz-Rokha Alliance
          </MenuItem>
        </Select>
      </FormControl>
      <FleetBuilderForm faction={faction} onFleetChange={onFleetChange} />
    </div>
  );
};
