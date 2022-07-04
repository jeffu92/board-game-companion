import { RemoveModeratorRounded, ShieldRounded } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Immutable } from "immer";
import { useCallback, useContext } from "react";
import { Unit } from "../../../../../../../../../../../../ti4/classes/units/Unit.class";
import { FleetBuilderContext } from "../../../../../../../../../../contexts/FactionBuilderContext.context";
import { UpgradeDowngradeButton } from "../../../../../UpgradeDowngradeButton/UpgradeDowngradeButton.component";
import "./ShipConfiguration.component.css";

interface ShipConfigurationProps {
  id: string;
  unit: Immutable<Unit>;
}

export const ShipConfiguration = (props: ShipConfigurationProps) => {
  const { id, unit } = props;
  const context = useContext(FleetBuilderContext);

  const handleSustainDamageClick = useCallback(
    () => context?.sustainDamage(id),
    [context, id]
  );
  const handleRepairDamageClick = useCallback(() => context?.repairDamage(id), [
    context,
    id,
  ]);
  const handleRemoveClick = useCallback(() => context?.removeUnit(id), [
    context,
    id,
  ]);

  if (!context) {
    return null;
  }

  return (
    <div className="ship-configuration">
      {unit.canSustainDamage ? (
        unit.hasSustainedDamage ? (
          <IconButton color="error" onClick={handleRepairDamageClick}>
            <RemoveModeratorRounded />
          </IconButton>
        ) : (
          <IconButton color="success" onClick={handleSustainDamageClick}>
            <ShieldRounded />
          </IconButton>
        )
      ) : (
        <span />
      )}
      <Button onClick={handleRemoveClick}>{unit.name}</Button>
      {unit.upgrade ? <UpgradeDowngradeButton unit={unit} /> : <span></span>}
    </div>
  );
};
