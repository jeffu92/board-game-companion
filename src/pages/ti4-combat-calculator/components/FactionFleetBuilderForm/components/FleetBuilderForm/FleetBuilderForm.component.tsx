import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import "./FleetBuilderForm.component.css";
import { useCallback, useContext, useMemo, useState } from "react";
import classNames from "classnames";
import { AddUnitsPanel } from "./components/AddUnitsPanel/AddUnitsPanel.component";
import { UnitZoneArea } from "./components/UnitZoneArea/UnitZoneArea.component";
import { FleetBuilderContext } from "../../../../contexts/FactionBuilderContext.context";
import { ActionCards } from "./components/ActionCards/ActionCards.component";

export interface FleetBuilderFormProps {
  className?: string;
  shouldZonesBeOnRight: boolean;
}

export const FleetBuilderForm = (props: FleetBuilderFormProps) => {
  const { className, shouldZonesBeOnRight } = props;
  const context = useContext(FleetBuilderContext);
  const [isFactionSectionExpanded, setIsFactionSectionExpanded] = useState(
    false
  );
  const [isTechSectionExpanded, setIsTechSectionExpanded] = useState(false);

  const handleFactionSectionExpansionChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
      setIsFactionSectionExpanded(expanded);
    },
    []
  );

  const handleTechSectionExpansionChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
      setIsTechSectionExpanded(expanded);
    },
    []
  );

  const fleetBuilderFormClassnames = useMemo(
    () => classNames(["fleet-builder-form", className]),
    [className]
  );

  if (!context || !context.faction) {
    return null;
  }

  return (
    <div className={fleetBuilderFormClassnames}>
      {!shouldZonesBeOnRight && <UnitZoneArea />}
      <div className="fleet-builder-form__options">
        <AddUnitsPanel />
        <Paper className="fleet-builder-form__optional">
          <Accordion
            expanded={isFactionSectionExpanded}
            onChange={handleFactionSectionExpansionChange}
          >
            <AccordionSummary expandIcon={<ExpandMoreRounded />}>
              <Typography>Faction</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>Faction!</div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={isTechSectionExpanded}
            onChange={handleTechSectionExpansionChange}
          >
            <AccordionSummary expandIcon={<ExpandMoreRounded />}>
              <Typography>Technology</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>Technology!</div>
            </AccordionDetails>
          </Accordion>
          <ActionCards />
        </Paper>
      </div>
      {shouldZonesBeOnRight && <UnitZoneArea />}
    </div>
  );
};
