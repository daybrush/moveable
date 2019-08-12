import { MoveableProps, Able } from "./types";
import MoveableManager from "./MoveableManager";
import { MOVEABLE_ABLES } from "./consts";

export default class Moveable extends MoveableManager<MoveableProps> {
    public static defaultProps = {
        ...MoveableManager.defaultProps,
        ables: MOVEABLE_ABLES,
    }
}
