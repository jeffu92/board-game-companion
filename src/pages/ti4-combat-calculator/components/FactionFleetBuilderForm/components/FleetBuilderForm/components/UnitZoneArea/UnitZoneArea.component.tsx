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
        onSimulateZone={() => {
          if (context.faction) {
            context.simulateCombatInZone({
              defendingFaction: context.faction,
            });
          }
        }}
      />
      <Button onClick={context.addPlanet}>Add Planet</Button>
      {Array.from(context.planetZones).map(([planetId, units], index) => {
        const name = `Planet ${index + 1}`;
        const isSelected = context.selectedZone === planetId;
        return (
          <UnitZone
            key={planetId}
            name={name}
            units={units}
            isSelected={isSelected}
            onSelectZone={() => {
              context.setSelectedZone(planetId);
            }}
            onRemoveZone={() => {
              context.removePlanet(planetId);
              if (isSelected) {
                context.setSelectedZone(SPACE_ZONE_ID);
              }
            }}
            onSimulateZone={() => {
              if (context.faction) {
                context.simulateCombatInZone({
                  defendingFaction: context.faction,
                  planet: {
                    id: planetId,
                    name,
                  },
                });
              }
            }}
          />
        );
      })}
    </div>
  );
};
