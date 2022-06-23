import { useCallback, useMemo, useState } from "react";
import { Cruiser } from "../classes/units/Cruiser.class";
import { Dreadnaught } from "../classes/units/Dreadnaught.class";
import { Fighter } from "../classes/units/Fighter.class";
import { Infantry } from "../classes/units/Infantry.class";
import { Unit } from "../classes/units/Unit.class";
import { WarSun } from "../classes/units/WarSun.class";
import { UnitEnum } from "../enums/Unit.enum";
import { v4 as uuidv4 } from "uuid";
import { Destroyer } from "../classes/units/Destroyer.class";

export const unitMap: Map<UnitEnum, Unit> = new Map([
  [UnitEnum.WARSUN, new WarSun({ hasSustainedDamage: false })],
  [
    UnitEnum.DREADNAUGHT,
    new Dreadnaught({ isUpgraded: false, hasSustainedDamage: false }),
  ],
  [UnitEnum.CRUISER, new Cruiser({ isUpgraded: false })],
  [UnitEnum.FIGHTER, new Fighter({ isUpgraded: false })],
  [UnitEnum.INFANTRY, new Infantry({ isUpgraded: false })],
  [UnitEnum.DESTROYER, new Destroyer({ isUpgraded: false })],
]);

export const useFleetBuilder: (
  supportedUnits: Set<UnitEnum>,
  onFleetChange: (newFleet: Map<string, Unit>) => void
) => {
  fleet: Map<string, Unit>;
  prototypes: Map<UnitEnum, Unit>;
  addUnit: (unit: UnitEnum) => void;
  removeUnit: (id: string) => void;
  changeGrade: (options: {
    unitEnum: UnitEnum;
    shouldUpgrade: boolean;
  }) => void;
  sustainDamage: (id: string) => void;
  repairDamage: (id: string) => void;
} = (supportedUnits, onFleetChange) => {
  const [fleet, setFleet] = useState<Map<string, Unit>>(new Map());
  const prototypes = useMemo<Map<UnitEnum, Unit>>(
    () =>
      new Map(
        Array.from(unitMap.entries())
          .filter(([unitEnum]) => {
            return supportedUnits.has(unitEnum);
          })
          .map(([unitEnum, unit]) => {
            return [unitEnum, Unit.copy(unit)];
          })
      ),
    [supportedUnits]
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

  const removeUnit = useCallback(
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

  const changeGrade = useCallback(
    (options: { unitEnum: UnitEnum; shouldUpgrade: boolean }) => {
      const { unitEnum, shouldUpgrade } = options;
      prototypes.get(unitEnum)?.setIsUpgraded(shouldUpgrade);
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
    [onFleetChange, prototypes]
  );

  const sustainDamage = useCallback(
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

  const repairDamage = useCallback(
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

  return {
    fleet,
    prototypes,
    addUnit,
    removeUnit,
    changeGrade,
    sustainDamage,
    repairDamage,
  };
};
