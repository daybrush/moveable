import { MoveableProps, MoveableState } from "react-moveable/declaration/types";
import Preact from "preact";

export interface MoveableInterface extends JSX.ElementClass {
    props: MoveableProps;
    state: MoveableState;
    isMoveableElement(target: HTMLElement): boolean;
    getRadByPos(pos: number[]): number;
    getDirection(): 1 | -1;
    updateRect(isNotSetState?: boolean): void;
}
