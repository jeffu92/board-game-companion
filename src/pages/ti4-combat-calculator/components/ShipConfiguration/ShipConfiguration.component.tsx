import { HighlightOff } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useCallback } from "react";

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
    <div>
      <IconButton onClick={handleRemoveClick}>
        <HighlightOff></HighlightOff>
      </IconButton>
      <span>{name}</span>
      {canSustainDamage ? (
        hasSustainedDamage ? (
          <Button onClick={handleRepairDamageClick}>Repair Damage</Button>
        ) : (
          <Button onClick={handleSustainDamageClick}>Sustain Damage</Button>
        )
      ) : null}
    </div>
  );
};
