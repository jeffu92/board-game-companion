import { Button } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const Ti4ToolPicker = () => {
  const navigate = useNavigate();

  const handleTI4CombatCalculatorClick = useCallback(() => {
    navigate("combat-calc");
  }, [navigate]);

  return (
    <div>
      <Button onClick={handleTI4CombatCalculatorClick}>
        Combat Calculator
      </Button>
    </div>
  );
};
