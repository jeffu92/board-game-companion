import { StarRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Immutable } from "immer";
import { useCallback, useContext } from "react";
import { Unit } from "../../../../../../../../ti4/entities/units/Unit.class";
import { FleetBuilderContext } from "../../../../../../contexts/FactionBuilderContext.context";

export interface UpgradeDowngradeButtonProps {
  unit: Immutable<Unit>;
}

export const UpgradeDowngradeButton = (props: UpgradeDowngradeButtonProps) => {
  const { unit } = props;
  const context = useContext(FleetBuilderContext);

  const handleUpgradeClick = useCallback(() => {
    context?.changeGrade({
      unitEnum: unit.unitEnum,
      shouldUpgrade: true,
    });
  }, [context, unit.unitEnum]);

  const handleDowngradeClick = useCallback(() => {
    context?.changeGrade({
      unitEnum: unit.unitEnum,
      shouldUpgrade: false,
    });
  }, [context, unit.unitEnum]);

  return (
    <>
      {unit.isUpgraded ? (
        <IconButton
          onClick={handleDowngradeClick}
          color="warning"
          title="Downgrade."
        >
          <StarRounded />
        </IconButton>
      ) : (
        <IconButton onClick={handleUpgradeClick} title="Upgrade.">
          <StarRounded />
        </IconButton>
      )}
    </>
  );
};
