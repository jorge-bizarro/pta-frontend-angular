import { ICampus } from "./campus";
import { IDoorType } from "./door-type";
import { ILevel } from "./level";

export interface IDoor {
    campus: ICampus;
    // level: ILevel;
    type: IDoorType;
}
