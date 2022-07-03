import { useCallback, useState } from "react";
import { Cruiser } from "../classes/units/Cruiser.class";
import { Dreadnought } from "../classes/units/Dreadnought.class";
import { Fighter } from "../classes/units/Fighter.class";
import { Infantry } from "../classes/units/Infantry.class";
import { Unit } from "../classes/units/Unit.class";
import { WarSun } from "../classes/units/WarSun.class";
import { UnitEnum } from "../enums/Unit.enum";
import { v4 as uuidv4 } from "uuid";
import { Carrier } from "../classes/units/Carrier.class";
import { Destroyer } from "../classes/units/Destroyer.class";
import { useImmer } from "use-immer";
import { Immutable } from "immer";
import { Faction } from "../classes/factions/Faction.class";
import { Pds } from "../classes/units/Pds.class";

export const unitMap: Immutable<Map<UnitEnum, Unit>> = new Map([
  [UnitEnum.WARSUN, new WarSun({ hasSustainedDamage: false })],
  [
    UnitEnum.DREADNOUGHT,
    new Dreadnought({ isUpgraded: false, hasSustainedDamage: false }),
  ],
  [UnitEnum.CRUISER, new Cruiser({ isUpgraded: false })],
  [UnitEnum.FIGHTER, new Fighter({ isUpgraded: false })],
  [UnitEnum.INFANTRY, new Infantry({ isUpgraded: false })],
  [UnitEnum.CARRIER, new Carrier({ isUpgraded: false })],
  [UnitEnum.DESTROYER, new Destroyer({ isUpgraded: false })],
  [UnitEnum.PDS, new Pds({ isUpgraded: false })],
]);

export const SPACE_ZONE_ID = "space";

export const useFleetBuilder: () => {
  faction: Immutable<Faction> | null;
  setFaction: (faction: Faction | null) => void;
  spaceZone: Immutable<Map<string, Unit>>;
  planetZones: Immutable<Map<string, Map<string, Unit>>>;
  unitIsUpgraded: Immutable<Map<UnitEnum, boolean>>;
  selectedZone: string;
  setSelectedZone: (id: string) => void;
  addUnit: (unit: UnitEnum) => void;
  removeUnit: (id: string) => void;
  changeGrade: (options: {
    unitEnum: UnitEnum;
    shouldUpgrade: boolean;
  }) => void;
  sustainDamage: (id: string) => void;
  repairDamage: (id: string) => void;
  addPlanet: () => void;
  removePlanet: (id: string) => void;
} = () => {
  const [faction, setFaction] = useImmer<Immutable<Faction> | null>(null);
  const [unitIsUpgraded, setUnitIsUpgraded] = useImmer<
    Immutable<Map<UnitEnum, boolean>>
  >(new Map());
  const [spaceZone, setSpaceZone] = useImmer<Immutable<Map<string, Unit>>>(
    new Map()
  );
  const [planetZones, setPlanetZones] = useImmer<
    Immutable<Map<string, Map<string, Unit>>>
  >(new Map());
  const [selectedZone, setSelectedZone] = useState<string>(SPACE_ZONE_ID);

  const addUnit = useCallback(
    (unit: UnitEnum) => {
      const unitId = uuidv4();
      const unitToAdd = unitMap.get(unit);
      if (unitToAdd) {
        if (selectedZone === SPACE_ZONE_ID) {
          setSpaceZone((draft) => {
            draft.set(unitId, unitToAdd);
          });
        } else {
          setPlanetZones((draft) => {
            draft.get(selectedZone)?.set(unitId, unitToAdd);
          });
        }
      }
    },
    [selectedZone, setPlanetZones, setSpaceZone]
  );

  const removeUnit = useCallback(
    (id: string) => {
      setSpaceZone((draft) => {
        draft.delete(id);
      });
      setPlanetZones((draft) => {
        draft.forEach((planet) => {
          planet.delete(id);
        });
      });
    },
    [setPlanetZones, setSpaceZone]
  );

  const changeGrade = useCallback(
    (options: { unitEnum: UnitEnum; shouldUpgrade: boolean }) => {
      setSpaceZone((draft) => {
        draft.forEach((unit) => {
          if (unit.unitEnum === options.unitEnum) {
            unit.setIsUpgraded(options.shouldUpgrade);
          }
        });
      });
      setPlanetZones((draft) => {
        draft.forEach((planet) => {
          planet.forEach((unit) => {
            if (unit.unitEnum === options.unitEnum) {
              unit.setIsUpgraded(options.shouldUpgrade);
            }
          });
        });
      });
      setUnitIsUpgraded((draft) => {
        draft.set(options.unitEnum, options.shouldUpgrade);
      });
    },
    [setPlanetZones, setSpaceZone, setUnitIsUpgraded]
  );

  const sustainDamage = useCallback(
    (id: string) => {
      setSpaceZone((draft) => {
        draft.get(id)?.sustainDamage();
      });
      setPlanetZones((draft) => {
        draft.forEach((planet) => {
          planet.get(id)?.sustainDamage();
        });
      });
    },
    [setPlanetZones, setSpaceZone]
  );

  const repairDamage = useCallback(
    (id: string) => {
      setSpaceZone((draft) => {
        draft.get(id)?.repairDamage();
      });
      setPlanetZones((draft) => {
        draft.forEach((planet) => {
          planet.get(id)?.repairDamage();
        });
      });
    },
    [setPlanetZones, setSpaceZone]
  );

  const addPlanet = useCallback(() => {
    const planetId = uuidv4();
    setPlanetZones((draft) => {
      draft.set(planetId, new Map<string, Unit>());
    });
    setSelectedZone(planetId);
  }, [setPlanetZones]);

  const removePlanet = useCallback(
    (id: string) => {
      setPlanetZones((draft) => {
        draft.delete(id);
      });
    },
    [setPlanetZones]
  );

  return {
    faction,
    setFaction,
    spaceZone,
    planetZones,
    unitIsUpgraded,
    selectedZone,
    setSelectedZone,
    addUnit,
    removeUnit,
    changeGrade,
    sustainDamage,
    repairDamage,
    addPlanet,
    removePlanet,
  };
};
