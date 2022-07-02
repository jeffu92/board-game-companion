import { Button } from "@mui/material";
import { useContext } from "react";
import { SPACE_ZONE_ID } from "../../../../../../../../ti4/hooks/useFleetBuilder";
import { FleetBuilderContext } from "../../../../../../contexts/FactionBuilderContext.context";
import { UnitZone } from "./components/UnitZone/UnitZone.component";
import "./UnitZoneArea.component.css";

export const UnitZoneArea = () => {
  const context = useContext(FleetBuilderContext);

  if (!context) {
    return null;
  }

  return (
    <div className="unit-zone-area">
      <UnitZone
        name="Space"
        units={context.spaceZone}
        isSelected={context.selectedZone === SPACE_ZONE_ID}
        onSelectZone={() => context.setSelectedZone(SPACE_ZONE_ID)}
        onSimulateZone={() => context.simulateCombatInZone(SPACE_ZONE_ID)}
      />
      <Button onClick={context.addPlanet}>Add Planet</Button>
      {Array.from(context.planetZones).map(([id, units], index) => {
        const name = `Planet ${index + 1}`;
        const isSelected = context.selectedZone === id;
        return (
          <UnitZone
            key={id}
            name={name}
            units={units}
            isSelected={isSelected}
            onSelectZone={() => {
              context.setSelectedZone(id);
            }}
            onRemoveZone={() => {
              context.removePlanet(id);
              if (isSelected) {
                context.setSelectedZone(SPACE_ZONE_ID);
              }
            }}
            onSimulateZone={() => context.simulateCombatInZone(id)}
          />
        );
      })}
    </div>
  );
};
