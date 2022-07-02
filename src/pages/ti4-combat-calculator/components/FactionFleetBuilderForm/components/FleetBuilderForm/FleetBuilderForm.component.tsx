import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import "./FleetBuilderForm.component.css";
import { useCallback, useContext, useMemo, useState } from "react";
import classNames from "classnames";
import { AddUnitsPanel } from "./components/AddUnitsPanel/AddUnitsPanel.component";
import { UnitZoneArea } from "./components/UnitZoneArea/UnitZoneArea.component";
import { FleetBuilderContext } from "../../../../contexts/FactionBuilderContext.context";

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
  const [
    isActionCardsSectionExpanded,
    setIsActionCardSectionExpanded,
  ] = useState(false);

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

  const handleActionCardsSectionExpansionChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
      setIsActionCardSectionExpanded(expanded);
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
        <div>
          <Accordion
            expanded={isFactionSectionExpanded}
            onChange={handleFactionSectionExpansionChange}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
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
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Technology</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>Technology!</div>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={isActionCardsSectionExpanded}
            onChange={handleActionCardsSectionExpansionChange}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Action Cards</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>Action Cards!</div>
            </AccordionDetails>
          </Accordion>
        </div>
        <AddUnitsPanel />
      </div>
      {shouldZonesBeOnRight && <UnitZoneArea />}
    </div>
  );
};
