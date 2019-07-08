import * as React from "react";
import { MOVEABLE_CSS } from "./consts";
import {
    prefix, getRad, getLineTransform,
    caculateRotationMatrix, caculatePosition,
    caculateMatrixStack,
} from "./utils";
import styler from "react-css-styler";
import { drag } from "@daybrush/drag";
import { ref } from "framework-utils";
import { MoveableState } from "./types";

const ControlBoxElement = styler("div", MOVEABLE_CSS);

export default class Moveable extends React.PureComponent<{
    target?: HTMLElement,
    rotatable?: boolean,
    draggable?: boolean,
    resizable?: boolean,
    onRotate?: (e: { delta: number, dist: number }) => void,
}, MoveableState> {
    public state: MoveableState = {
        target: null,
        matrix: [1, 0, 0, 1, 0, 0],
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        transformOrigin: [0, 0],
        origin: [0, 0],
        pos1: [0, 0],
        pos2: [0, 0],
        pos3: [0, 0],
        pos4: [0, 0],
    };
    private rotatableDragger!: ReturnType<typeof drag> | null;
    private resizableDragger!: ReturnType<typeof drag> | null;
    private draggableDragger!: ReturnType<typeof drag> | null;
    private rotationElement!: HTMLElement;

    public render() {
        if (this.state.target !== this.props.target) {
            this.updateRect(true);
        }
        const { origin, left, top, pos1, pos2, pos3, pos4, target } = this.state;
        const rotationRad = getRad(pos1, pos2) - Math.PI / 2;

        return (
            <ControlBoxElement
                className={prefix("control-box")} style={{
                    position: "fixed", left: `${left}px`, top: `${top}px`, display: target ? "block" : "none",
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
                <div className={prefix("control", "origin")} style={{
                    transform: `translate(${origin[0]}px,${origin[1]}px)`,
                }}></div>
                <div className={prefix("control", "nw")} style={{
                    transform: `translate(${pos1[0]}px,${pos1[1]}px)`,
                }}></div>
                <div className={prefix("control", "n")} style={{
                    transform: `translate(${(pos1[0] + pos2[0]) / 2}px,${(pos1[1] + pos2[1]) / 2}px)`,
                }}></div>
                <div className={prefix("control", "ne")} style={{
                    transform: `translate(${pos2[0]}px,${pos2[1]}px)`,
                }}></div>
                <div className={prefix("control", "w")} style={{
                    transform: `translate(${(pos1[0] + pos3[0]) / 2}px,${(pos1[1] + pos3[1]) / 2}px)`,
                }}></div>
                <div className={prefix("control", "e")} style={{
                    transform: `translate(${(pos2[0] + pos4[0]) / 2}px,${(pos2[1] + pos4[1]) / 2}px)`,
                }}></div>
                <div className={prefix("control", "sw")} style={{
                    transform: `translate(${pos3[0]}px,${pos3[1]}px)`,
                }}></div>
                <div className={prefix("control", "s")} style={{
                    transform: `translate(${(pos3[0] + pos4[0]) / 2}px,${(pos3[1] + pos4[1]) / 2}px)`,
                }}></div>
                <div className={prefix("control", "se")} style={{
                    transform: `translate(${pos4[0]}px,${pos4[1]}px)`,
                }}></div>
            </ControlBoxElement>
        );
    }
    public getRadByPos(pos: number[]) {
        const { left, top, origin } = this.state;
        const center = [left + origin[0], top + origin[1]];

        return getRad(center, pos);
    }
    public componentDidMount() {
        /* rotatable */
        this.rotatableDragger = drag(this.rotationElement, {
            container: window,
            dragstart: ({ datas, clientX, clientY }) => {
                const { matrix, left, top, pos1, pos2 } = this.state;

                datas.matrix = matrix;
                datas.left = left;
                datas.top = top;
                datas.prevRad = this.getRadByPos([clientX, clientY]);
                datas.startRad = datas.prevRad;
                datas.loop = 0;

                const pos1Rad = this.getRadByPos(pos1);
                const pos2Rad = this.getRadByPos(pos2);

                datas.direction =
                    (pos1Rad < pos2Rad && pos2Rad - pos1Rad < 180)
                    || (pos1Rad > pos2Rad && pos2Rad - pos1Rad < -180)
                    ? 1 : -1;
            },
            drag: ({ datas, clientX, clientY }) => {
                const startRad = datas.startRad;
                const prevRad = datas.prevRad;
                const prevLoop = datas.loop;
                const rad = this.getRadByPos([clientX, clientY]);

                if (prevRad > rad && prevRad > 270 && rad < 90) {
                    // 360 => 0
                    ++datas.loop;
                } else if (prevRad < rad && prevRad < 90 && rad > 270) {
                    // 0 => 360
                    --datas.loop;
                }

                const absolutePrevRad = prevLoop * 360 + prevRad;
                const absoluteRad = datas.loop * 360 + rad;
                const {
                    width,
                    height,
                    transformOrigin,
                    origin: prevOrigin,
                    left: prevLeft,
                    top: prevTop,
                } = this.state;

                const matrix = caculateRotationMatrix(datas.matrix, datas.direction * (rad - startRad));
                const prevAbsoluteOrigin = [prevLeft + prevOrigin[0], prevTop + prevOrigin[1]];
                const [origin, pos1, pos2, pos3, pos4]
                    = caculatePosition(matrix, transformOrigin, width, height);

                this.rotate({
                    delta: absoluteRad - absolutePrevRad,
                    dist: absolutePrevRad - startRad,
                });
                this.setState({
                    origin,
                    pos1,
                    pos2,
                    pos3,
                    pos4,
                    matrix,
                    left: prevAbsoluteOrigin[0] - origin[0],
                    top: prevAbsoluteOrigin[1] - origin[1],
                });
                datas.prevRad = rad;
            },
        });
    }
    public componentWillUnmount() {
        if (this.draggableDragger) {
            this.draggableDragger.unset();
            this.draggableDragger = null;
        }
        if (this.rotatableDragger) {
            this.rotatableDragger.unset();
            this.rotatableDragger = null;
        }
    }
    public rotate = (e: { delta: number, dist: number }) => {
        const onRotate = this.props.onRotate;

        onRotate && onRotate(e);
    }
    public updateState(nextState: any, isNotSetState?: boolean) {
        const state = this.state as any;

        if (isNotSetState) {
            for (const name in nextState) {
                state[name] = nextState[name];
            }
        } else {
            this.setState(nextState);
        }
    }
    public updateRect(isNotSetState?: boolean) {
        const target = this.props.target;
        const state = this.state;
        let left = 0;
        let top = 0;
        let origin = [0, 0];
        let pos1 = [0, 0];
        let pos2 = [0, 0];
        let pos3 = [0, 0];
        let pos4 = [0, 0];
        let matrix = [1, 0, 0, 1, 0, 0];
        let width = 0;
        let height = 0;
        let transformOrigin = [0, 0];

        if (state.target !== target) {
            if (this.draggableDragger) {
                this.draggableDragger.unset();
                this.draggableDragger = null;
            }
            if (target) {
                this.draggableDragger = drag(target, {
                    container: window,
                });
            }
        }
        if (target) {
            const rect = target.getBoundingClientRect();

            left = rect.left;
            top = rect.top;
            width = target.offsetWidth;
            height = target.offsetHeight;
            matrix = caculateMatrixStack(target);
            transformOrigin = window.getComputedStyle(target).transformOrigin!.split(" ").map(pos => parseFloat(pos));
            [origin, pos1, pos2, pos3, pos4] = caculatePosition(matrix, transformOrigin, width, height);
        }
        this.updateState({
            target,
            left,
            top,
            pos1,
            pos2,
            pos3,
            pos4,
            width,
            height,
            matrix,
            origin,
            transformOrigin,
        }, isNotSetState);
    }
}
