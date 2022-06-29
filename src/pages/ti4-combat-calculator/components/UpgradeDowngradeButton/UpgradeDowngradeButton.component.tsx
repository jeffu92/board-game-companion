import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Button } from "@mui/material";
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
        <Button
          onClick={handleDowngradeClick}
          variant="outlined"
          color="error"
          startIcon={<ArrowDownward />}
          size="small"
        >
          Downgrade
        </Button>
      ) : (
        <Button
          onClick={handleUpgradeClick}
          variant="outlined"
          color="success"
          startIcon={<ArrowUpward />}
          size="small"
        >
          Upgrade
        </Button>
      )}
    </>
  );
};
