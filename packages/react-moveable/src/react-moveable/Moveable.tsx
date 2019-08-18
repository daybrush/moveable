import { MoveableProps } from "./types";
import MoveableManager from "./MoveableManager";
import { MOVEABLE_ABLES } from "./consts";
import { MoveableGroup } from ".";
import React from "react";
import { ref } from "framework-utils";

export default class Moveable extends React.PureComponent<MoveableProps> {
    public static defaultProps = {
        ...MoveableManager.defaultProps,
        targets: [],
        ables: MOVEABLE_ABLES,
    };
    public moveable!: MoveableManager<MoveableProps> | MoveableGroup;
    public render() {
        const isGroup = !!this.props.targets!.length;

        return isGroup
            ? <MoveableGroup key="group" ref={ref(this, "moveable")} {...this.props} />
            : <MoveableManager key="single" ref={ref(this, "moveable")} {...this.props}/>;
    }
    public isMoveableElement(target: HTMLElement) {
        return this.moveable.isMoveableElement(target);
    }
    public dragStart(e: MouseEvent | TouchEvent) {
        this.moveable.dragStart(e);
    }
    public isInside(clientX: number, clientY: number) {
        return this.moveable.isInside(clientX, clientY);
    }
    public updateRect() {
        this.moveable.updateRect();
    }
    public updateTarget() {
        this.moveable.updateTarget();
    }
}
