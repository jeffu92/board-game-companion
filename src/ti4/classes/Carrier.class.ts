import { UnitEnum } from "../enums/Unit.enum";
import { Unit } from "./Unit.class";

export class Carrier extends Unit {
    constructor(options: {isUpgraded: boolean}) {
        const {isUpgraded=false} = options;
        
        super({
            unitEnum: UnitEnum.CARRIER,
            base: {
                name: "Carrier 1",
                cost:3,
                combat:9,
                numAttacks:1,
                move:1,
                capacity:4,
                canSustainDamage:false,
            },
            upgrade:{
                name: "Carrier 2",
                cost: 3,
                combat:9,
                numAttacks: 1,
                move:2,
                capacity:6,
                canSustainDamage:false,
            },
            isUpgraded,
            productionLimit: 4,
            hasSustainedDamage: false,
        });
    }
}