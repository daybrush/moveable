import * as React from "react";
import { MoveableProps } from "./types";
import MoveableManager from "./MoveableManager";
import { MOVEABLE_ABLES } from "./consts";
import MoveableGroup from "./MoveableGroup";
import { ref } from "framework-utils";
import { isArray } from "@daybrush/utils";

export default class Moveable extends React.PureComponent<MoveableProps> {
    public moveable!: MoveableManager<MoveableProps> | MoveableGroup;
    public render() {
        const props = this.props;
        const ables = props.ables || [];
        const target = this.props.target || this.props.targets;
        const isArr = isArray(target);
        const isGroup = isArr && (target as any[]).length > 1;

        if (isGroup) {
            return <MoveableGroup key="group" ref={ref(this, "moveable")}
                {...{ ...this.props, target: null, targets: target as any[], ables: [...MOVEABLE_ABLES, ...ables] }} />;
        } else {
            const moveableTarget = isArr ? (target as any[])[0] : target;
            return <MoveableManager key="single" ref={ref(this, "moveable")}
                {...{ ...this.props, target: moveableTarget, ables: [...MOVEABLE_ABLES, ...ables] }} />;
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
    public destroy() {
        this.moveable.componentWillUnmount();
    }
}
