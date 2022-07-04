import { Button, Paper, Typography } from "@mui/material";
import "./AddUnitsPanel.component.css";
import { UpgradeDowngradeButton } from "../../../../../UpgradeDowngradeButton/UpgradeDowngradeButton.component";
import { useContext } from "react";
import { FleetBuilderContext } from "../../../../../../contexts/FactionBuilderContext.context";

export const AddUnitsPanel = () => {
  const context = useContext(FleetBuilderContext);

  if (!context || !context.faction) {
    return null;
  }

  return (
    <Paper className="add-units-panel" elevation={1}>
      <Typography className="add-units-panel__title">Units</Typography>
      {Array.from(context.prototypes).map(([unitEnum, unit]) => {
        const unitName = unit.name;
        const addThisUnit = () => context.addUnit(unitEnum);
        if (unit?.upgrade) {
          return (
            <div key={unitEnum} className="add-units-panel__container">
              <Button onClick={addThisUnit}>{unitName}</Button>
              <UpgradeDowngradeButton
                isUpgraded={unit.isUpgraded}
                onUpgradeClick={() =>
                  context.changeGrade({ unitEnum, shouldUpgrade: true })
                }
                onDowngradeClick={() =>
                  context.changeGrade({ unitEnum, shouldUpgrade: false })
                }
              />
            </div>
          );
        }

        return (
          <div key={unitEnum} className="add-units-panel__container">
            <Button key={`${unitEnum}-addbutton`} onClick={addThisUnit}>
              {unitName}
            </Button>
            <span key={`${unitEnum}-upgrade-placeholder`}></span>
          </div>
        );
      })}
    </Paper>
  );
};
