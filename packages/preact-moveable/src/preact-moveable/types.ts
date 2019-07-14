import { MoveableProps, MoveableState } from "react-moveable/declaration/types";
import { Component } from "preact";

export interface MoveableInterface extends Component<MoveableProps, MoveableState> {
    isMoveableElement(target: HTMLElement | SVGElement): boolean;
    updateRect(isNotSetState?: boolean): void;
    move(pos: number[]): void;
}
