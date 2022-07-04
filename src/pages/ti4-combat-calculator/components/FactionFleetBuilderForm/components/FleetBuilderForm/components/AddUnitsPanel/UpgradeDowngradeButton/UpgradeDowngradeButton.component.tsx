import { ArrowDownwardRounded, ArrowUpwardRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useCallback } from "react";

export interface UpgradeDowngradeButtonProps {
  isUpgraded: boolean;
  onUpgradeClick: () => void;
  onDowngradeClick: () => void;
}

export const UpgradeDowngradeButton = (props: UpgradeDowngradeButtonProps) => {
  const { isUpgraded, onUpgradeClick, onDowngradeClick } = props;

  const handleUpgradeClick = useCallback(() => {
    onUpgradeClick();
  }, [onUpgradeClick]);

  const handleDowngradeClick = useCallback(() => {
    onDowngradeClick();
  }, [onDowngradeClick]);

  return (
    <>
      {isUpgraded ? (
        <IconButton onClick={handleDowngradeClick} color="error">
          <ArrowDownwardRounded />
        </IconButton>
      ) : (
        <IconButton onClick={handleUpgradeClick} color="success">
          <ArrowUpwardRounded />
        </IconButton>
      )}
    </>
  );
};
