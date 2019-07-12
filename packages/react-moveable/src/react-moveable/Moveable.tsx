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
import { MoveableState, MoveableProps } from "./types";
import { getDraggableDragger } from "./DraggableDragger";
import { getMoveableDragger } from "./MoveableDragger";

const ControlBoxElement = styler("div", MOVEABLE_CSS);

export default class Moveable extends React.PureComponent<MoveableProps, MoveableState> {
    public static defaultProps = {
        rotatable: false,
        draggable: false,
        scalable: false,
        resizable: false,
        origin: true,
        onRotateStart: () => { },
        onRotate: () => { },
        onRotateEnd: () => { },
        onDragStart: () => { },
        onDrag: () => { },
        onDragEnd: () => { },
        onScaleStart: () => { },
        onScale: () => { },
        onScaleEnd: () => { },
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

    public isMoveableElement(target: HTMLElement) {
        return target && target.className.indexOf(PREFIX) > -1;
    }
    public render() {
        if (this.state.target !== this.props.target) {
            this.updateRect(true);
        }
        const { left, top, pos1, pos2, pos3, pos4, target, transform } = this.state;
        const direction = this.getDirection();

        return (
            <ControlBoxElement
                ref={ref(this, "controlBox")}
                className={prefix("control-box", direction === -1 ? "reverse" : "")} style={{
                    position: "fixed", display: target ? "block" : "none",
                    transform: `translate(${left}px, ${top}px) ${transform}`,
                }}>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos1, pos2) }}></div>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos2, pos4) }}></div>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos1, pos3) }}></div>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos3, pos4) }}></div>
                {this.renderRotation(direction)}
                {this.renderPosition()}
                {this.renderOrigin()}
            </ControlBoxElement>
        );
    }
    public renderRotation(direction: number) {
        if (!this.props.rotatable) {
            return null;
        }
        const { pos1, pos2 } = this.state;
        const rotationRad = getRad(pos1, pos2) - direction * Math.PI / 2;

        return (
            <div className={prefix("line rotation")} style={{
                // tslint:disable-next-line: max-line-length
                transform: `translate(${(pos1[0] + pos2[0]) / 2}px, ${(pos1[1] + pos2[1]) / 2}px) rotate(${rotationRad}rad)`,
            }}>
                <div className={prefix("control", "rotation")} ref={ref(this, "rotationElement")}></div>
            </div>
        );
    }
    public renderOrigin() {
        if (!this.props.origin) {
            return null;
        }
        const { origin } = this.state;

        return (<div className={prefix("control", "origin")} style={getControlTransform(origin)}></div>);
    }
    public renderPosition() {
        if (!this.props.resizable && !this.props.scalable) {
            return null;
        }
        const { pos1, pos2, pos3, pos4 } = this.state;
        return [
            <div className={prefix("control", "nw")} data-position="nw" key="nw"
                style={getControlTransform(pos1)}></div>,
            <div className={prefix("control", "n")} data-position="n" key="n"
                style={getControlTransform(pos1, pos2)}></div>,
            <div className={prefix("control", "ne")} data-position="ne" key="ne"
                style={getControlTransform(pos2)}></div>,
            <div className={prefix("control", "w")} data-position="w" key="w"
                style={getControlTransform(pos1, pos3)}></div>,
            <div className={prefix("control", "e")} data-position="e" key="e"
                style={getControlTransform(pos2, pos4)}></div>,
            <div className={prefix("control", "sw")} data-position="sw" key="sw"
                style={getControlTransform(pos3)}></div>,
            <div className={prefix("control", "s")} data-position="s" key="s"
                style={getControlTransform(pos3, pos4)}></div>,
            <div className={prefix("control", "se")} data-position="se" key="se"
                style={getControlTransform(pos4)}></div>,
        ];

    }
    public componentDidMount() {
        /* rotatable */
        /* resizable */
        /* scalable */
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
