import { FavoriteBorder, HeartBrokenOutlined } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useCallback } from "react";
import "./ShipConfiguration.component.css";

interface ShipConfigurationProps {
  id: string;
  name: string;
  canSustainDamage: boolean;
  hasSustainedDamage: boolean;
  onSustainDamage: (id: string) => void;
  onRepairSustainedDamage: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ShipConfiguration = (props: ShipConfigurationProps) => {
  const {
    id,
    name,
    canSustainDamage,
    hasSustainedDamage,
    onSustainDamage,
    onRepairSustainedDamage,
    onRemove,
  } = props;
  const handleSustainDamageClick = useCallback(() => onSustainDamage(id), [
    id,
    onSustainDamage,
  ]);
  const handleRepairDamageClick = useCallback(
    () => onRepairSustainedDamage(id),
    [id, onRepairSustainedDamage]
  );
  const handleRemoveClick = useCallback(() => onRemove(id), [id, onRemove]);

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
