import { MoveableProps, Able } from "./types";
import { MOVEABLE_ABLES } from "./ables/consts";
import { InitialMoveable } from "./InitialMoveable";

export default class Moveable<T = {}> extends InitialMoveable<MoveableProps & T> {
    public static defaultAbles: Able[] = MOVEABLE_ABLES as any;
}
