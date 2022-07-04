import { useCallback, useMemo, useState } from "react";
import { Unit } from "../classes/units/Unit.class";
import { UnitEnum } from "../enums/Unit.enum";
import { v4 as uuidv4 } from "uuid";
import { useImmer } from "use-immer";
import { Immutable } from "immer";
import { Faction } from "../classes/factions/Faction.class";
import { unitMap } from "../classes/units/unitMap";

export const SPACE_ZONE_ID = "Space";

export const useFleetBuilder: () => {
  faction: Immutable<Faction> | null;
  setFaction: (faction: Faction) => void;
  spaceZone: Immutable<Map<string, Unit>>;
  planetZones: Immutable<Map<string, Map<string, Unit>>>;
  prototypes: Immutable<Map<UnitEnum, Unit>>;
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
  canUnitBeAddedToSelectedZone: (unit: Immutable<Unit>) => boolean;
  remainingSpaceCapacity: number;
  hasAtLeastOneUnit: boolean;
} = () => {
  const [faction, setFaction] = useImmer<Immutable<Faction> | null>(null);
  const [prototypes, setPrototypes] = useImmer<Immutable<Map<UnitEnum, Unit>>>(
    new Map()
  );
  const [spaceZone, setSpaceZone] = useImmer<Immutable<Map<string, Unit>>>(
    new Map()
  );
  const [planetZones, setPlanetZones] = useImmer<
    Immutable<Map<string, Map<string, Unit>>>
  >(new Map());
  const [selectedZone, setSelectedZone] = useState<string>(SPACE_ZONE_ID);
  const remainingSpaceCapacity = useMemo(() => {
    let totalCapacity = 0;
    let requiredCapacity = 0;
    spaceZone.forEach((unit) => {
      totalCapacity += unit.capacity ?? 0;
      if (unit.requiresCapacity) {
        requiredCapacity++;
      }
    });
    return totalCapacity - requiredCapacity;
  }, [spaceZone]);

  const setFactionAndPrototypes = useCallback(
    (faction: Faction) => {
      setFaction(faction);
      const prototypes = new Map<UnitEnum, Unit>();
      faction.getUnits().forEach((unitEnum) => {
        const unit = unitMap.get(unitEnum);
        if (unit) {
          prototypes.set(unitEnum, Unit.copy(unit));
        }
      });
      setPrototypes(prototypes);
    },
    [setFaction, setPrototypes]
  );

  const canUnitBeAddedToSelectedZone = useCallback(
    (unit: Immutable<Unit>) => {
      if (selectedZone === SPACE_ZONE_ID) {
        return unit.requiresCapacity ? remainingSpaceCapacity > 0 : unit.isShip;
      }

      return unit.isGroundForce || unit.isStructure;
    },
    [remainingSpaceCapacity, selectedZone]
  );

  const hasAtLeastOneUnit = useMemo(() => {
    let totalUnits = spaceZone.size;
    planetZones.forEach((planet) => {
      totalUnits += planet.size;
    });
    return totalUnits > 0;
  }, [planetZones, spaceZone.size]);

  const addUnit = useCallback(
    (unit: UnitEnum) => {
      const unitId = uuidv4();
      const prototypalUnit = prototypes.get(unit);
      if (prototypalUnit) {
        const unitToAdd = Unit.copy(prototypalUnit);
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
      }
    },
    [prototypes, selectedZone, setPlanetZones, setSpaceZone]
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
      setPrototypes((draft) => {
        draft.get(options.unitEnum)?.setIsUpgraded(options.shouldUpgrade);
      });
    },
    [setPlanetZones, setPrototypes, setSpaceZone]
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
    setFaction: setFactionAndPrototypes,
    spaceZone,
    planetZones,
    prototypes,
    selectedZone,
    setSelectedZone,
    addUnit,
    removeUnit,
    changeGrade,
    sustainDamage,
    repairDamage,
    addPlanet,
    removePlanet,
    canUnitBeAddedToSelectedZone,
    remainingSpaceCapacity,
    hasAtLeastOneUnit,
  };
};
