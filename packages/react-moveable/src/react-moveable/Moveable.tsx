import * as React from "react";
import { MOVEABLE_CSS, PREFIX } from "./consts";
import {
    prefix, getRad, getLineTransform,
    getTargetInfo,
    getControlTransform,
} from "./utils";
import styler from "react-css-styler";
import { drag } from "@daybrush/drag";
import { ref } from "framework-utils";
import { MoveableState, OnRotate, OnDrag, OnDragStart, OnRotateEnd, OnDragEnd } from "./types";
import { getDraggableDragger } from "./DraggableDragger";
import { getMoveableDragger } from "./MoveableDragger";

const ControlBoxElement = styler("div", MOVEABLE_CSS);

export default class Moveable extends React.PureComponent<{
    target?: HTMLElement,
    rotatable?: boolean,
    draggable?: boolean,
    resizable?: boolean,
    onRotateStart?: () => void,
    onRotate?: (e: OnRotate) => void,
    onRotateEnd?: (e: OnRotateEnd) => void,
    onDragStart?: (e: OnDragStart) => void,
    onDrag?: (e: OnDrag) => void,
    onDragEnd?: (e: OnDragEnd) => void,
    onResizeStart?: () => void,
    onResize?: () => void,
    onResizeEnd?: () => void,
}, MoveableState> {
    public static defaultProps = {
        rotatable: true,
        draggable: true,
        resizable: true,
        onRotateStart: () => { },
        onRotate: () => { },
        onRotateEnd: () => { },
        onDragStart: () => { },
        onDrag: () => { },
        onDragEnd: () => { },
        onResizeStart: () => { },
        onResize: () => { },
        onResizeEnd: () => { },
    };
    public state: MoveableState = {
        target: null,
        beforeMatrix: [1, 0, 0, 1, 0, 0],
        matrix: [1, 0, 0, 1, 0, 0],
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        transform: "",
        transformOrigin: [0, 0],
        origin: [0, 0],
        pos1: [0, 0],
        pos2: [0, 0],
        pos3: [0, 0],
        pos4: [0, 0],
    };
    private moveableDragger!: ReturnType<typeof drag> | null;
    private draggableDragger!: ReturnType<typeof drag> | null;
    private controlBox!: typeof ControlBoxElement extends new (...args: any[]) => infer U ? U : never;
    private controlBoxElement!: HTMLElement;

    public isMoveableElement(target: HTMLElement) {
        return target && target.className.indexOf(PREFIX) > -1;
    }
    public render() {
        if (this.state.target !== this.props.target) {
            this.updateRect(true);
        }
        const { origin, left, top, pos1, pos2, pos3, pos4, target, transform } = this.state;
        const rotationRad = getRad(pos1, pos2) - this.getDirection() * Math.PI / 2;

        return (
            <ControlBoxElement
                ref={ref(this, "controlBox")}
                className={prefix("control-box")} style={{
                    position: "fixed", left: `${left}px`, top: `${top}px`, display: target ? "block" : "none",
                    transform,
                }}>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos1, pos2) }}></div>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos2, pos4) }}></div>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos1, pos3) }}></div>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos3, pos4) }}></div>
                <div className={prefix("line rotation")} style={{
                    // tslint:disable-next-line: max-line-length
                    transform: `translate(${(pos1[0] + pos2[0]) / 2}px, ${(pos1[1] + pos2[1]) / 2}px) rotate(${rotationRad}rad)`,
                }}>
                    <div className={prefix("control", "rotation")} ref={ref(this, "rotationElement")}></div>
                </div>
                <div className={prefix("control", "origin")} style={getControlTransform(origin)}></div>
                <div className={prefix("control", "nw")} data-position="nw"
                    style={getControlTransform(pos1)}></div>
                <div className={prefix("control", "n")} data-position="n"
                    style={getControlTransform(pos1, pos2)}></div>
                <div className={prefix("control", "ne")} data-position="ne"
                    style={getControlTransform(pos2)}></div>
                <div className={prefix("control", "w")} data-position="w"
                    style={getControlTransform(pos1, pos3)}></div>
                <div className={prefix("control", "e")} data-position="e"
                    style={getControlTransform(pos2, pos4)}></div>
                <div className={prefix("control", "sw")} data-position="sw"
                    style={getControlTransform(pos3)}></div>
                <div className={prefix("control", "s")} data-position="s"
                    style={getControlTransform(pos3, pos4)}></div>
                <div className={prefix("control", "se")} data-position="se"
                    style={getControlTransform(pos4)}></div>
            </ControlBoxElement>
        );
    }
    public componentDidMount() {
        /* rotatable */
        /* resizable */
        this.moveableDragger = getMoveableDragger(this, this.controlBox.getElement());
    }
    public componentWillUnmount() {
        if (this.draggableDragger) {
            this.draggableDragger.unset();
            this.draggableDragger = null;
        }
        if (this.moveableDragger) {
            this.moveableDragger.unset();
            this.moveableDragger = null;
        }
    }
    public getRadByPos(pos: number[]) {
        const { left, top, origin } = this.state;
        const center = [left + origin[0], top + origin[1]];

        return getRad(center, pos);
    }
    public getDirection() {
        const { pos1, pos2, origin } = this.state;
        const pi = Math.PI;
        const pos1Rad = getRad(origin, pos1);
        const pos2Rad = getRad(origin, pos2);

        // 1 : clockwise
        // -1 : counterclockwise
        return (pos1Rad < pos2Rad && pos2Rad - pos1Rad < pi) || (pos1Rad > pos2Rad && pos2Rad - pos1Rad < -pi)
            ? 1 : -1;
    }
    public updateRect(isNotSetState?: boolean) {
        const target = this.props.target;
        const state = this.state;
        if (state.target !== target) {
            if (this.draggableDragger) {
                this.draggableDragger.unset();
                this.draggableDragger = null;
            }
            if (target && this.props.draggable) {
                this.draggableDragger = getDraggableDragger(this, target);
            }
        }
        this.updateState(getTargetInfo(target), isNotSetState);
    }
    private updateState(nextState: any, isNotSetState?: boolean) {
        const state = this.state as any;

        if (isNotSetState) {
            for (const name in nextState) {
                state[name] = nextState[name];
            }
        } else {
            this.setState(nextState);
        }
    }
}
