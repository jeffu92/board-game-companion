import { Button } from "@mui/material";
import { Unit } from "../../../../ti4/classes/units/Unit.class";
import { ShipConfiguration } from "../ShipConfiguration/ShipConfiguration.component";
import { Add } from "@mui/icons-material";
import "./FleetBuilderForm.component.css";
import { UpgradeDowngradeButton } from "../UpgradeDowngradeButton/UpgradeDowngradeButton.component";
import {
  unitMap,
  useFleetBuilder,
} from "../../../../ti4/hooks/useFleetBuilder";
import { useCallback, useMemo } from "react";
import { factionMap } from "../../../../ti4/utils/factionMap";

export interface FleetBuilderFormProps {
  faction: string;
  onFleetChange: (newFleet: Map<string, Unit>) => void;
}

export const FleetBuilderForm = (props: FleetBuilderFormProps) => {
  const { faction, onFleetChange } = props;
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

  return (
    <div>
      <div className="fleet-builder-form__add-ship-buttons">
        {renderFleetBuilderButtons()}
      </div>
      {renderFleet()}
    </div>
  );
};
