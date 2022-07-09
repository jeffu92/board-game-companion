import { PlayerSimulator } from "../../../entities/PlayerSimulator.class";
import { UnitEnum } from "../../../enums/Unit.enum";

export function simulateAntiFighterBarrage(options: {
  attackerSimulator: PlayerSimulator;
  defenderSimulator: PlayerSimulator;
}) {
  const { attackerSimulator, defenderSimulator } = options;

  // space cannon offense
  const attackerAntiFighterBarrageHits = attackerSimulator.simulateAntiFighterBarrage();
  const defenderAntiFighterBarrageHits = defenderSimulator.simulateAntiFighterBarrage();
  attackerSimulator.assignHitsToShips({
    numHits: defenderAntiFighterBarrageHits,
    unitEnum: UnitEnum.FIGHTER,
  });
  defenderSimulator.assignHitsToShips({
    numHits: attackerAntiFighterBarrageHits,
    unitEnum: UnitEnum.FIGHTER,
  });
}
