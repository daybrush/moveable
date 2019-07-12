import { MoveableProps, MoveableState } from "react-moveable/declaration/types";
import { Component } from "preact";

export interface MoveableInterface extends Component<MoveableProps, MoveableState> {
    isMoveableElement(target: HTMLElement | SVGElement): boolean;
    getRadByPos(pos: number[]): number;
    getDirection(): 1 | -1;
    updateRect(isNotSetState?: boolean): void;
}
