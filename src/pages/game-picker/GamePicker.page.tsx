import { Button } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const GamePicker = () => {
  const navigate = useNavigate();

  const handleTI4CombatCalculatorClick = useCallback(() => {
    navigate("ti4");
  }, [navigate]);

  return (
    <div>
      <Button onClick={handleTI4CombatCalculatorClick}>
        Twilight Imperium 4th Edition
      </Button>
    </div>
  );
};
