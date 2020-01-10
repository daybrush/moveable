import { prefixCSS } from "framework-utils";
import getAgent from "@egjs/agent";
import { IObject } from "@daybrush/utils";
import { throttle } from "./utils";

function getSVGCursor(scale: number, degree: number) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${32 * scale}px" height="${32 * scale}px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(${degree}deg);transform-origin: 16px 16px"></path></svg>`;
}
function getCursorCSS(degree: number) {
    const x1 = getSVGCursor(1, degree);
    const x2 = getSVGCursor(2, degree);
    const degree45 = throttle(degree, 45) % 180;
    const defaultCursor
        = degree45 === 135
        ? "nwse-resize"
        : degree45 === 45
        ? "nesw-resize"
        : degree45 === 90
        ? "ew-resize"
        : "ns-resize"; // 135

    // tslint:disable-next-line: max-line-length
    return `cursor:${defaultCursor};cursor: url('${x1}') 16 16, ${defaultCursor};cursor: -webkit-image-set(url('${x1}') 1x, url('${x2}') 2x) 16 16, ${defaultCursor};`;
}

export const agent = getAgent();
export const isWebkit
    = agent.os.name.indexOf("ios") > -1 || agent.browser.name.indexOf("safari") > -1;

export const PREFIX = "moveable-";
export const MOVEABLE_CSS = prefixCSS(PREFIX, `
{
	position: fixed;
	width: 0;
	height: 0;
	left: 0;
	top: 0;
	z-index: 3000;
}
.control-box {
    z-index: 0;
}
.line, .control {
	left: 0;
	top: 0;
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
    z-index: 10;
    will-change: transform;
}
.line {
	position: absolute;
	width: 1px;
	height: 1px;
	background: #4af;
	transform-origin: 0px 0.5px;
}
.line.dashed {
    box-sizing: border-box;
    background: transparent;
}
.line.dashed.horizontal {
    border-top: 1px dashed #4af;
}
.line.dashed.vertical {
    border-left: 1px dashed #4af;
}
.line.rotation-line {
	height: 40px;
	width: 1px;
	transform-origin: 0.5px 39.5px;
}
.line.rotation-line .control {
	border-color: #4af;
	background:#fff;
	cursor: alias;
}
.line.vertical {
    transform: translateX(-50%);
}
.line.horizontal {
    transform: translateY(-50%);
}
.line.vertical.bold {
    width: 2px;
}
.line.horizontal.bold {
    height: 2px;
}
.control.origin {
	border-color: #f55;
	background: #fff;
	width: 12px;
	height: 12px;
	margin-top: -6px;
	margin-left: -6px;
	pointer-events: none;
}
${[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map(degree => `
.direction[data-rotation="${degree}"] {
	${getCursorCSS(degree)}
}
`).join("\n")}
.group {
    z-index: -1;
}
.area {
    position: absolute;
}
.area-pieces {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
}
.area.avoid {
    pointer-events: none;
}
.area.avoid+.area-pieces {
    display: block;
}
.area-piece {
    position: absolute;
}
${isWebkit ? `:global svg *:before {
	content:"";
	transform-origin: inherit;
}` : ""}
`);
export const DRAGGER_EVENTS = ["dragstart", "drag", "dragend", "pinchstart", "pinch", "pinchend"];

export const NEARBY_POS = [
    [0, 1, 2],
    [1, 0, 3],
    [2, 0, 3],
    [3, 1, 2],
];

export const TINY_NUM = 0.0000001;
export const MIN_SCALE = 0.000000001;
export const MAX_NUM = Math.pow(10, 10);
export const MIN_NUM = -MAX_NUM;

export const DIRECTION_INDEXES: IObject<number[]> = {
    n: [0, 1],
    s: [2, 3],
    w: [2, 0],
    e: [1, 3],
    nw: [0],
    ne: [1],
    sw: [2],
    se: [3],
};
export const DIRECTION_ROTATIONS: IObject<number> = {
    n: 0,
    s: 180,
    w: 270,
    e: 90,
    nw: 315,
    ne: 45,
    sw: 225,
    se: 135,
};
