import { FavoriteBorder, HeartBrokenOutlined } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useCallback, useContext } from "react";
import { FleetBuilderContext } from "../../../../../../../../../../contexts/FactionBuilderContext.context";
import "./ShipConfiguration.component.css";

interface ShipConfigurationProps {
  id: string;
  name: string;
  canSustainDamage: boolean;
  hasSustainedDamage: boolean;
}

export const ShipConfiguration = (props: ShipConfigurationProps) => {
  const { id, name, canSustainDamage, hasSustainedDamage } = props;
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
      <Button onClick={handleRemoveClick}>{name}</Button>
      {canSustainDamage ? (
        hasSustainedDamage ? (
          <IconButton color="error" onClick={handleRepairDamageClick}>
            <HeartBrokenOutlined />
          </IconButton>
        ) : (
          <IconButton color="success" onClick={handleSustainDamageClick}>
            <FavoriteBorder />
          </IconButton>
        )
      ) : (
        <span />
      )}
    </div>
  );
};
