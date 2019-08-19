import { MoveableProps } from "./types";
import MoveableManager from "./MoveableManager";
import { MOVEABLE_ABLES } from "./consts";
import { MoveableGroup } from ".";
import React from "react";
import { ref } from "framework-utils";
import { isArray } from "@daybrush/utils";

export default class Moveable extends React.PureComponent<MoveableProps> {
    public static defaultProps = {
        ...MoveableManager.defaultProps,
        ables: MOVEABLE_ABLES,
    };
    public moveable!: MoveableManager<MoveableProps> | MoveableGroup;
    public render() {
        const target = this.props.target || this.props.targets;
        const isArr = isArray(target);
        const isGroup = isArr && (target as any[]).length > 1;

        if (isGroup) {
            return <MoveableGroup key="group" ref={ref(this, "moveable")}
                {...{ ...this.props, target: null, targets: target as any[] }} />;
        } else {
            const moveableTarget = isArr ? (target as any[])[0] : target;
            return <MoveableManager key="single" ref={ref(this, "moveable")}
                {...{ ...this.props, target: moveableTarget }} />;
        }
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
