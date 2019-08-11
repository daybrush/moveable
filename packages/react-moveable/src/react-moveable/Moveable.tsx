import * as React from "react";
import { ref } from "framework-utils";
import { MoveableProps, Able } from "./types";
import MoveableManager from "./MoveableManager";
import Pinchable from "./ables/Pinchable";
import Rotatable from "./ables/Rotatable";
import Draggable from "./ables/Draggable";
import Resizable from "./ables/Resizable";
import Scalable from "./ables/Scalable";
import Warpable from "./ables/Warpable";

const MOVEABLE_ABLES: Able[] = [Pinchable, Draggable, Rotatable, Resizable, Scalable, Warpable];

export default class Moveable extends React.PureComponent<MoveableProps> {
    private manager!: MoveableManager<MoveableProps>;

    public render() {
        return <MoveableManager ables={MOVEABLE_ABLES} ref={ref(this, "manager")} {...this.props}/>;
    }
    public dragStart(e: any) {
        // this.manager.drag
    }
    public isInside(clientX: number, clientY: number) {
        return this.manager.isInside(clientX, clientY);
    }
    public isMoveableElement(target: HTMLElement) {
        return this.manager.isMoveableElement(target);
    }
    public updateRect() {
        return this.manager.updateRect();
    }
    public updateTarget() {
        return this.manager.updateTarget();
    }
}
