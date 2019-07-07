import * as React from "react";
import { PREFIX } from "./consts";
import { prefix } from "./utils";
import styler from "react-css-styler";
import { drag } from "@daybrush/drag";
import { splitBracket } from "@daybrush/utils";
import { caculate3x2, multiple3x2 } from "./utils";
import { prefixCSS, ref } from "framework-utils";
import { MoveableState } from "./types";

const ControlBoxElement = styler("div", prefixCSS(PREFIX, `
{
    position: fixed;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
    z-index: 3000;
}
.control {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-sizing: border-box;
    background: #4af;
    margin-top: -7px;
    margin-left: -7px;
}
.line {
    position: absolute;
    width: 1px;
    height: 1px;
    background: #4af;
    transform-origin: 0px 0.5px;
}
.line.rotation {
    width: 60px;
}
.line.rotation .control {
    left: 100%;
    border-color: #4af;
    background:#fff;
    cursor: alias;
}
.control.e, .control.w {
    cursor: ew-resize;
}
.control.s, .control.n {
    cursor: ns-resize;
}
.control.nw, .control.se {
    cursor: nwse-resize
}
.control.ne, .control.sw {
    cursor: nesw-resize;
}
`));

function caculateMatrix(target: HTMLElement) {
    let el: HTMLElement | null = target;
    const matrixes: number[][] = [];
    while (el) {
        const transform = window.getComputedStyle(el).transform!;

        if (transform !== "none") {
            const value = splitBracket(transform).value!;

            matrixes.push(value.split(/s*,\s*/g).map(v => parseFloat(v)));
        }
        el = el.parentElement;
    }
    // matrixes.reverse();

    // 1 0 0
    // 0 1 0
    const mat = [1, 0, 0, 1, 0, 0];

    matrixes.forEach(matrix => {
        multiple3x2(mat, matrix);
    });
    mat[4] = 0;
    mat[5] = 0;

    return mat;
}
function caculatePosition(matrix: number[], origin: number[], width: number, height: number) {
    let [x1, y1] = caculate3x2(matrix, [0, 0, 1]);
    let [x2, y2] = caculate3x2(matrix, [width, 0, 1]);
    let [x3, y3] = caculate3x2(matrix, [0, height, 1]);
    let [x4, y4] = caculate3x2(matrix, [width, height, 1]);
    let [originX, originY] = caculate3x2(matrix, [origin[0], origin[1], 1]);

    const minX = Math.min(x1, x2, x3, x4);
    const minY = Math.min(y1, y2, y3, y4);

    x1 = (x1 - minX) || 0;
    x2 = (x2 - minX) || 0;
    x3 = (x3 - minX) || 0;
    x4 = (x4 - minX) || 0;

    y1 = (y1 - minY) || 0;
    y2 = (y2 - minY) || 0;
    y3 = (y3 - minY) || 0;
    y4 = (y4 - minY) || 0;

    originX = (originX - minX) || 0;
    originY = (originY - minY) || 0;

    return [
        [originX, originY],
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
    ];
}
function caculateRotationMatrix(matrix: number[], rad: number) {
    const mat = matrix.slice();
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotationMatrix = [cos, sin, -sin, cos, 0, 0];

    return multiple3x2(rotationMatrix, mat);
}

function getRad(pos1: number[], pos2: number[]) {
    const distX = pos2[0] - pos1[0];
    const distY = pos2[1] - pos1[1];
    const rad = Math.atan2(distY, distX);

    return rad > 0 ? rad : rad + Math.PI * 2;
}
function getLineTransform(pos1: number[], pos2: number[]) {
    const distX = pos2[0] - pos1[0];
    const distY = pos2[1] - pos1[1];
    const width = Math.sqrt(distX * distX + distY * distY);
    const rad = getRad(pos1, pos2);

    return `translate(${pos1[0]}px, ${pos1[1]}px) rotate(${rad}rad) scale(${width}, 1.2)`;
}
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
            matrix = caculateMatrix(target);
            transformOrigin = window.getComputedStyle(target).transformOrigin!.split(" ").map(pos => parseFloat(pos));
            [origin, pos1, pos2, pos3, pos4] = caculatePosition(matrix, transformOrigin, width, height);
        }
        if (isNotSetState) {
            state.target = target;
            state.left = left;
            state.top = top;
            state.pos1 = pos1;
            state.pos2 = pos2;
            state.pos3 = pos3;
            state.pos4 = pos4;
            state.width = width;
            state.height = height;
            state.matrix = matrix;
            state.origin = origin;
            state.transformOrigin = transformOrigin;
        } else {
            this.setState({
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
            });
        }
    }
}
