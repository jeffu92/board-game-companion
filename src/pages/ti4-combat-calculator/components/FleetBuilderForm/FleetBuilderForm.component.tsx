import { Unit } from "../../../../ti4/classes/Unit.class";
import { FactionEnum } from "../../../../ti4/enums/Faction.enum";
import { WinnuFleetBuilderForm } from "../WinnuFleetBuilderForm/WinnuFleetBuilderForm.component";

interface FleetBuilderFormProps {
  faction: string;
  onFleetChange: (newFleet: Map<string, Unit>) => void;
}

export const FleetBuilderForm = (props: FleetBuilderFormProps) => {
  const { faction, onFleetChange } = props;

  if (faction === FactionEnum.WINNU) {
    return <WinnuFleetBuilderForm onFleetChange={onFleetChange} />;
  }

  return null;
};
