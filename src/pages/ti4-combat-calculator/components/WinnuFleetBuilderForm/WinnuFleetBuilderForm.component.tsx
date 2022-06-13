import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { Unit } from "../../../../ti4/classes/Unit.class";
import { ShipConfiguration } from "../ShipConfiguration/ShipConfiguration.component";
import { v4 as uuidv4 } from "uuid";
import { Dreadnaught } from "../../../../ti4/classes/Dreadnaught.class";
import { Add } from "@mui/icons-material";
import { UnitEnum } from "../../../../ti4/enums/Unit.enum";
import { Cruiser } from "../../../../ti4/classes/Cruiser.class";
import { Fighter } from "../../../../ti4/classes/Fighter.class";
import "./WinnuFleetBuilderForm.component.css";
import { UpgradeDowngradeButton } from "../UpgradeDowngradeButton/UpgradeDowngradeButton.component";
import { WarSun } from "../../../../ti4/classes/WarSun.class";
import { Carrier } from "../../../../ti4/classes/Carrier.class";

export interface WinnuFleetBuilderFormProps {
  onFleetChange: (newFleet: Map<string, Unit>) => void;
}

export const WinnuFleetBuilderForm = (props: WinnuFleetBuilderFormProps) => {
  const { onFleetChange } = props;
  const [fleet, setFleet] = useState<Map<string, Unit>>(new Map());
  const [prototypes, setPrototypes] = useState<Map<UnitEnum, Unit>>(
    new Map([
      [UnitEnum.WARSUN, new WarSun({ hasSustainedDamage: false })],
      [
        UnitEnum.DREADNAUGHT,
        new Dreadnaught({ isUpgraded: false, hasSustainedDamage: false }),
      ],
      [UnitEnum.CRUISER, new Cruiser({ isUpgraded: false })],
      [UnitEnum.FIGHTER, new Fighter({ isUpgraded: false })],
      [UnitEnum.CARRIER, new Carrier({isUpgraded:false})],
    ])
  );

  const addUnit = useCallback(
    (unit: UnitEnum) => {
      setFleet((currentFleet) => {
        const newFleet = new Map<string, Unit>(currentFleet);

        const unitToAdd = prototypes.get(unit);
        if (unitToAdd) {
          newFleet.set(uuidv4(), Unit.copy(unitToAdd));
        }

        onFleetChange(newFleet);
        return newFleet;
      });
    },
    [onFleetChange, prototypes]
  );

  const handleAddWarSunClick = useCallback(() => {
    addUnit(UnitEnum.WARSUN);
  }, [addUnit]);

  const handleAddDreadnaughtClick = useCallback(() => {
    addUnit(UnitEnum.DREADNAUGHT);
  }, [addUnit]);

  const handleAddCruiserClick = useCallback(() => {
    addUnit(UnitEnum.CRUISER);
  }, [addUnit]);

  const handleAddFighterClick = useCallback(() => {
    addUnit(UnitEnum.FIGHTER);
  }, [addUnit]);

  const handleAddCarrierClick = useCallback(() => {
    addUnit(UnitEnum.CARRIER);
  }, [addUnit]);

  const handleRemoveUnitClick = useCallback(
    (id: string) => {
      setFleet((currentFleet) => {
        const newFleet = new Map<string, Unit>(currentFleet);
        newFleet.delete(id);

        onFleetChange(newFleet);
        return newFleet;
      });
    },
    [onFleetChange]
  );

  const onGradeChange = useCallback(
    (options: { unitEnum: UnitEnum; shouldUpgrade: boolean }) => {
      const { unitEnum, shouldUpgrade } = options;
      setPrototypes((currentPrototypes) => {
        const newPrototypes = new Map<UnitEnum, Unit>(currentPrototypes);
        newPrototypes.get(unitEnum)?.setIsUpgraded(shouldUpgrade);
        return newPrototypes;
      });
      setFleet((currentFleet) => {
        const newFleet = new Map<string, Unit>(currentFleet);

        newFleet.forEach((unit) => {
          if (unit.unitEnum === unitEnum) {
            unit.setIsUpgraded(shouldUpgrade);
          }
        });

        onFleetChange(newFleet);
        return newFleet;
      });
    },
    [onFleetChange]
  );

  const handleUpgradeDreadnaughtClick = useCallback(() => {
    onGradeChange({ unitEnum: UnitEnum.DREADNAUGHT, shouldUpgrade: true });
  }, [onGradeChange]);

  const handleDowngradeDreadnaughtClick = useCallback(() => {
    onGradeChange({ unitEnum: UnitEnum.DREADNAUGHT, shouldUpgrade: false });
  }, [onGradeChange]);

  const handleUpgradeCruiserClick = useCallback(() => {
    onGradeChange({ unitEnum: UnitEnum.CRUISER, shouldUpgrade: true });
  }, [onGradeChange]);

  const handleDowngradeCruiserClick = useCallback(() => {
    onGradeChange({ unitEnum: UnitEnum.CRUISER, shouldUpgrade: false });
  }, [onGradeChange]);

  const handleUpgradeFighterClick = useCallback(() => {
    onGradeChange({ unitEnum: UnitEnum.FIGHTER, shouldUpgrade: true });
  }, [onGradeChange]);

  const handleDowngradeFighterClick = useCallback(() => {
    onGradeChange({ unitEnum: UnitEnum.FIGHTER, shouldUpgrade: false });
  }, [onGradeChange]);

  const handleUpgradeCarrierClick = useCallback(() => {
    onGradeChange({ unitEnum: UnitEnum.CARRIER, shouldUpgrade: true });
  }, [onGradeChange]);

  const handleDowngradeCarrierClick = useCallback(() => {
    onGradeChange({ unitEnum: UnitEnum.CARRIER, shouldUpgrade: false });
  }, [onGradeChange]);

  const handleSustainDamageClick = useCallback(
    (id: string) => {
      setFleet((currentFleet) => {
        const newFleet = new Map<string, Unit>(currentFleet);
        newFleet.get(id)?.setHasSustainedDamage(true);

        onFleetChange(newFleet);
        return newFleet;
      });
    },
    [onFleetChange]
  );

  const handleRepairDamageClick = useCallback(
    (id: string) => {
      setFleet((currentFleet) => {
        const newFleet = new Map<string, Unit>(currentFleet);
        newFleet.get(id)?.setHasSustainedDamage(false);

        onFleetChange(newFleet);
        return newFleet;
      });
    },
    [onFleetChange]
  );

  return (
    <div>
      <div className="winnu-fleet-builder-form__add-ship-buttons">
        <Button
          onClick={handleAddWarSunClick}
          startIcon={<Add />}
          variant="outlined"
        >
          {prototypes.get(UnitEnum.WARSUN)?.name ?? ""}
        </Button>
        <div></div>
        <Button
          onClick={handleAddDreadnaughtClick}
          startIcon={<Add />}
          variant="outlined"
        >
          {prototypes.get(UnitEnum.DREADNAUGHT)?.name ?? ""}
        </Button>
        <UpgradeDowngradeButton
          isUpgraded={prototypes.get(UnitEnum.DREADNAUGHT)?.isUpgraded ?? false}
          onUpgradeClick={handleUpgradeDreadnaughtClick}
          onDowngradeClick={handleDowngradeDreadnaughtClick}
        />
        <Button
          onClick={handleAddCruiserClick}
          startIcon={<Add />}
          variant="outlined"
        >
          {prototypes.get(UnitEnum.CRUISER)?.name ?? ""}
        </Button>
        <UpgradeDowngradeButton
          isUpgraded={prototypes.get(UnitEnum.CRUISER)?.isUpgraded ?? false}
          onUpgradeClick={handleUpgradeCruiserClick}
          onDowngradeClick={handleDowngradeCruiserClick}
        />
        <Button
          onClick={handleAddFighterClick}
          startIcon={<Add />}
          variant="outlined"
        >
          {prototypes.get(UnitEnum.FIGHTER)?.name ?? ""}
        </Button>
        <UpgradeDowngradeButton
          isUpgraded={prototypes.get(UnitEnum.FIGHTER)?.isUpgraded ?? false}
          onUpgradeClick={handleUpgradeFighterClick}
          onDowngradeClick={handleDowngradeFighterClick}
        />
        <Button
          onClick={handleAddCarrierClick}
          startIcon={<Add />}
          variant="outlined"
        >
          {prototypes.get(UnitEnum.CARRIER)?.name ?? ""}
        </Button>
        <UpgradeDowngradeButton
          isUpgraded={prototypes.get(UnitEnum.CARRIER)?.isUpgraded ?? false}
          onUpgradeClick={handleUpgradeCarrierClick}
          onDowngradeClick={handleDowngradeCarrierClick}
        />
      </div>
      {Array.from(fleet.entries()).map(([id, unit]) => {
        return (
          <ShipConfiguration
            key={id}
            id={id}
            name={unit.name}
            canSustainDamage={unit.canSustainDamage}
            hasSustainedDamage={unit.hasSustainedDamage}
            onSustainDamage={handleSustainDamageClick}
            onRepairSustainedDamage={handleRepairDamageClick}
            onRemove={handleRemoveUnitClick}
          />
        );
      })}
    </div>
  );
};
