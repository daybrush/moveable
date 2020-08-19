import { MoveableProps, Able } from "./types";
import { MOVEABLE_ABLES } from "./ables/consts";
import { InitialMoveable } from "./InitialMoveable";

export default class Moveable extends InitialMoveable<MoveableProps> {
    public static defaultAbles: Able[] = MOVEABLE_ABLES as any;
}
