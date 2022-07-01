import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import { Unit } from "../../../../../../ti4/classes/units/Unit.class";
import { ShipConfiguration } from "../../../ShipConfiguration/ShipConfiguration.component";
import { Add, ExpandMore } from "@mui/icons-material";
import "./FleetBuilderForm.component.css";
import { UpgradeDowngradeButton } from "../../../UpgradeDowngradeButton/UpgradeDowngradeButton.component";
import {
  unitMap,
  useFleetBuilder,
} from "../../../../../../ti4/hooks/useFleetBuilder";
import { useCallback, useMemo, useState } from "react";
import { factionMap } from "../../../../../../ti4/utils/factionMap";
import classNames from "classnames";

export interface FleetBuilderFormProps {
  className?: string;
  faction: string;
  onFleetChange: (newFleet: Map<string, Unit>) => void;
}

export const FleetBuilderForm = (props: FleetBuilderFormProps) => {
  const { className, faction, onFleetChange } = props;
  const supportedUnits = useMemo(
    () => factionMap.get(faction)?.getUnits() ?? new Set([]),
    [faction]
  );
  const {
    fleet,
    prototypes,
    addUnit,
    removeUnit,
    changeGrade,
    sustainDamage,
    repairDamage,
  } = useFleetBuilder(supportedUnits, onFleetChange);
  const [isTechSectionExpanded, setIsTechSectionExpanded] = useState(false);
  const [
    isActionCardsSectionExpanded,
    setIsActionCardSectionExpanded,
  ] = useState(false);

  const renderFleetBuilderButtons = useCallback(() => {
    return Array.from(supportedUnits.keys()).map((unitEnum) => {
      const unit = unitMap.get(unitEnum);
      const addThisUnit = () => addUnit(unitEnum);
      if (unit?.upgrade) {
        return (
          <>
            <Button
              key={`${unitEnum}-addbutton`}
              onClick={addThisUnit}
              startIcon={<Add />}
              variant="outlined"
              size="small"
            >
              {prototypes.get(unitEnum)?.name ?? ""}
            </Button>
            <UpgradeDowngradeButton
              key={`${unitEnum}-upgradebutton`}
              isUpgraded={prototypes.get(unitEnum)?.isUpgraded ?? false}
              onUpgradeClick={() =>
                changeGrade({ unitEnum, shouldUpgrade: true })
              }
              onDowngradeClick={() =>
                changeGrade({ unitEnum, shouldUpgrade: false })
              }
            />
          </>
        );
      }

      return (
        <>
          <Button
            key={`${unitEnum}-addbutton`}
            onClick={addThisUnit}
            startIcon={<Add />}
            variant="outlined"
            size="small"
          >
            {prototypes.get(unitEnum)?.name ?? ""}
          </Button>
          <div key={`${unitEnum}-upgrade-placeholder`}></div>
        </>
      );
    });
  }, [addUnit, changeGrade, prototypes, supportedUnits]);

  const renderFleet = useCallback(() => {
    return Array.from(fleet.entries()).map(([id, unit]) => {
      return (
        <ShipConfiguration
          key={id}
          id={id}
          name={unit.name}
          canSustainDamage={unit.canSustainDamage}
          hasSustainedDamage={unit.hasSustainedDamage}
          onSustainDamage={sustainDamage}
          onRepairSustainedDamage={repairDamage}
          onRemove={removeUnit}
        />
      );
    });
  }, [fleet, removeUnit, repairDamage, sustainDamage]);

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

  return (
    <div className={fleetBuilderFormClassnames}>
      <div>
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
      <div>
        <div className="fleet-builder-form__add-ship-buttons">
          {renderFleetBuilderButtons()}
        </div>
        {renderFleet()}
      </div>
    </div>
  );
};
