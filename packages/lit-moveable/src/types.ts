import { MoveableOptions } from "moveable";

export interface LitMoveableOptions extends Pick<MoveableOptions, Exclude<"draggable", keyof MoveableOptions>> {
    /**
     * @deprecated
     * use `litDraggable` prop
     */
    mvDraggable?: boolean;
    litDraggable?: boolean;
}
