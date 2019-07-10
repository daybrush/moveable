import Moveable from "react-moveable";
import Preact from "preact";

import {
    MoveableProps, MoveableState
} from "react-moveable/declaration/types";

interface PreactMoveable extends Preact.Component<MoveableProps, MoveableState> {
    state: MoveableState;
    isMoveableElement(target: HTMLElement): boolean;
    getRadByPos(pos: number[]): number;
    getDirection(): 1 | -1;
    updateRect(isNotSetState?: boolean): void;
}

export default Moveable as new (...args: any[]) => PreactMoveable;
