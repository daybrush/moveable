import * as React from "react";
import { prefix } from "./utils";
import styler from "react-css-styler";
import { PREFIX } from "./consts";
import { drag } from "@daybrush/drag";
import { splitBracket } from "@daybrush/utils";
import { caculate3x2, multiple3x2 } from "./utils";

const ControlBoxElement = styler("div", `
{
    position: fixed;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
}
.control {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #fff;
    box-sizing: border-box;
    background: #4af;
    margin-top: -5px;
    margin-left: -5px;
}
.line {
    position: absolute;
    width: 1px;
    height: 1px;
    background: #4af;
    transform-origin: 0px 0.5px;
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
`.replace(/\.([^{,\s\d.]+)/g, `.${PREFIX}$1`));

function caculateMatrix(target: HTMLElement, width: number, height: number) {
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

    let [x1, y1] = caculate3x2(mat, [0, 0, 1]);
    let [x2, y2] = caculate3x2(mat, [1, 0, 1]);
    let [x3, y3] = caculate3x2(mat, [0, 1, 1]);
    let [x4, y4] = caculate3x2(mat, [1, 1, 1]);

    const minX = Math.min(x1, x2, x3, x4);
    const maxX = Math.max(x1, x2, x3, x4);
    const minY = Math.min(y1, y2, y3, y4);
    const maxY = Math.max(y1, y2, y3, y4);

    const ratioX = width / (maxX - minX);
    const ratioY = height / (maxY - minY);

    x1 = (x1 - minX) * ratioX || 0;
    x2 = (x2 - minX) * ratioX || 0;
    x3 = (x3 - minX) * ratioX || 0;
    x4 = (x4 - minX) * ratioX || 0;

    y1 = (y1 - minY) * ratioY || 0;
    y2 = (y2 - minY) * ratioY || 0;
    y3 = (y3 - minY) * ratioY || 0;
    y4 = (y4 - minY) * ratioY || 0;

    return [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
    ];
}

function getLineTransform(pos1: number[], pos2: number[]) {
    const distX = pos2[0] - pos1[0];
    const distY = pos2[1] - pos1[1];
    const width = Math.sqrt(distX * distX + distY * distY);
    const pi = Math.PI;
    let rad = 0;

    if (distX === 0) {
        if (distY > 0) {
            rad = pi / 2;
        }
    } else {
        rad = Math.atan (distY / distX);

        if (distX < 0) {
            rad += pi;
        }
    }

    return `translate(${pos1[0]}px, ${pos1[1]}px) rotate(${rad}rad) scale(${width}, 1.2)`;

}
export default class Moveable extends React.PureComponent<{
    target?: HTMLElement,
}, {
    target: HTMLElement | null | undefined,
    left: number,
    top: number,
    pos1: number[],
    pos2: number[],
    pos3: number[],
    pos4: number[],
}> {
    public state: {
        target: HTMLElement | null | undefined,
        left: number,
        top: number,
        pos1: number[],
        pos2: number[],
        pos3: number[],
        pos4: number[],
    } = {
        target: null,
        left: 0,
        top: 0,
        pos1: [0, 0],
        pos2: [0, 0],
        pos3: [0, 0],
        pos4: [0, 0],
    };
    private dragger!: ReturnType<typeof drag> | null;

    public updateRect(isNotSetState?: boolean) {
        const target = this.props.target;
        const state = this.state;
        let left = 0;
        let top = 0;
        let pos1 = [0, 0];
        let pos2 = [0, 0];
        let pos3 = [0, 0];
        let pos4 = [0, 0];

        if (state.target !== target) {
            const dragger = this.dragger;

            if (dragger) {
                dragger.unset();
                this.dragger = null;
            }
            if (target) {
                this.dragger = drag(target, {
                    container: window,
                    drag: this.onDrag,
                });
            }
        }
        if (target) {
            const rect = target.getBoundingClientRect();

            left = rect.left;
            top = rect.top;
            const width = rect.width;
            const height = rect.height;

            [pos1, pos2, pos3, pos4] = caculateMatrix(target, width, height);
        }
        if (isNotSetState) {
            state.target = target;
            state.left = left;
            state.top = top;
            state.pos1 = pos1;
            state.pos2 = pos2;
            state.pos3 = pos3;
            state.pos4 = pos4;
        } else {
            this.setState({
                target,
                left,
                top,
                pos1,
                pos2,
                pos3,
                pos4,
            });
        }
    }
    public render() {
        if (this.state.target !== this.props.target) {
            this.updateRect(true);
        }
        const { left, top, pos1, pos2, pos3, pos4, target } = this.state;

        return (
            <ControlBoxElement
                className={prefix("control-box")} style={{
                    position: "fixed", left: `${left}px`, top: `${top}px`, display: target ? "block" : "none",
                }}>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos1, pos2) }}></div>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos2, pos4) }}></div>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos1, pos3) }}></div>
                <div className={prefix("line")} style={{ transform: getLineTransform(pos3, pos4) }}></div>
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
    public onDrag = () => {

    }
    public componentWillUnmount() {
        const dragger = this.dragger;

        if (dragger) {
            dragger.unset();
        }

        this.dragger = null;
    }
}
