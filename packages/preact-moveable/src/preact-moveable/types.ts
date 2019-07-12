import { MoveableProps, MoveableState } from "react-moveable/declaration/types";
import Preact from "preact";

export interface MoveableInterface extends Preact.Component<MoveableProps, MoveableState> {
    isMoveableElement(target: HTMLElement | SVGElement): boolean;
    getRadByPos(pos: number[]): number;
    getDirection(): 1 | -1;
    updateRect(isNotSetState?: boolean): void;
}
