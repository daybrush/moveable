import { MoveableOptions } from "moveable";

export interface LitMoveableOptions extends Pick<MoveableOptions, Exclude<"draggable", keyof MoveableOptions>> {
    mvDraggable?: boolean;
}
