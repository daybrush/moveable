/**
 * @typedef
 * @memberof Moveable
 */
export interface MoveableProps {
    target?: SVGElement | HTMLElement;
    container?: SVGElement | HTMLElement | null;
    origin?: boolean;
    rotatable?: boolean;
    draggable?: boolean;
    scalable?: boolean;
    resizable?: boolean;

    onRotateStart?: (e: OnRotateStart) => void;
    onRotate?: (e: OnRotate) => void;
    onRotateEnd?: (e: OnRotateEnd) => void;

    onDragStart?: (e: OnDragStart) => void;
    onDrag?: (e: OnDrag) => void;
    onDragEnd?: (e: OnDragEnd) => void;

    onScaleStart?: (e: OnScaleStart) => void;
    onScale?: (e: OnScale) => void;
    onScaleEnd?: (e: OnScaleEnd) => void;

    onResizeStart?: (e: OnResizeStart) => void;
    onResize?: (e: OnResize) => void;
    onResizeEnd?: (e: OnResizeEnd) => void;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface MoveableState {
    target: SVGElement | HTMLElement | null | undefined;
    left: number;
    top: number;
    width: number;
    height: number;
    beforeMatrix: number[];
    matrix: number[];
    transform: string;
    transformOrigin: number[];
    origin: number[];
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnDragStart {
    target: HTMLElement | SVGElement;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnDrag {
    target: HTMLElement | SVGElement;
    beforeDelta: number[];
    beforeDist: number[];
    delta: number[];
    dist: number[];
    transform: string;
    left: number;
    top: number;
    bottom: number;
    right: number;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnDragEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnScaleStart {
    target: HTMLElement | SVGElement;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnScale {
    target: HTMLElement | SVGElement;
    scale: number[];
    dist: number[];
    delta: number[];
    transform: string;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnScaleEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 */
export interface OnResizeStart {
    target: HTMLElement | SVGElement;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnResize {
    target: HTMLElement | SVGElement;
    width: number;
    height: number;
    dist: number[];
    delta: number[];
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnResizeEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnRotateStart {
    target: HTMLElement | SVGElement;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnRotate {
    target: HTMLElement | SVGElement;
    delta: number;
    dist: number;
    transform: string;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnRotateEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
}
