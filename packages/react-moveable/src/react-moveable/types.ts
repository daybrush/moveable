
export interface MoveableProps {
    target?: SVGElement | HTMLElement | null;
    container?: SVGElement | HTMLElement | null;
    origin?: boolean;
    rotatable?: boolean;
    draggable?: boolean;
    scalable?: boolean;
    resizable?: boolean;
    warpable?: boolean;
    keepRatio?: boolean;

    throttleDrag?: number;
    throttleResize?: number;
    throttleScale?: number;
    throttleRotate?: number;

    onWarpStart?: (e: OnWarpStart) => void;
    onWarp?: (e: OnWarp) => void;
    onWarpEnd?: (e: OnWarpEnd) => void;
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

export interface MoveableState {
    target: SVGElement | HTMLElement | null | undefined;
    left: number;
    top: number;
    width: number;
    height: number;
    beforeMatrix: number[];
    offsetMatrix: number[];
    offset: number[];
    matrix: number[];
    targetTransform: string;
    targetMatrix: number[];
    is3d: boolean;
    transformOrigin: number[];
    origin: number[];
    direction: 1 | -1;
    rotationRad: number;
    rotationPos: number[];
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
}

/**
 * @typedef
 * @memberof Moveable
 * @property - a target to drag
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnDragStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a dragging target
 * @property - The delta of [left, top]
 * @property - The distance of [left, top]
 * @property - The delta of [translateX, translateY]
 * @property - The distance of [translateX, translateY]
 * @property - a target's transform
 * @property - a target's left
 * @property - a target's top
 * @property - a target's bottom
 * @property - a target's right
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
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
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a drag finished target
 * @property - Whether drag called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnDragEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a target to scale
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnScaleStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a scaling target
 * @property - a target's scale
 * @property - The distance of scale
 * @property - The delta of scale
 * @property - a target's transform
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnScale {
    target: HTMLElement | SVGElement;
    scale: number[];
    dist: number[];
    delta: number[];
    transform: string;
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a scale finished target
 * @property - Whether scale called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnScaleEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - a target to resize
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnResizeStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a resizng target
 * @property - a target's width
 * @property - a target's height
 * @property - The distance of [width, height]
 * @property - The delta of [width, height]
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnResize {
    target: HTMLElement | SVGElement;
    width: number;
    height: number;
    dist: number[];
    delta: number[];
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a resize finished target
 * @property - Whether resize called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnResizeEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a target to rotate
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnRotateStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a rotating target
 * @property - The distance of rotation rad
 * @property - The delta of rotation rad
 * @property - The distance of rotation rad before transform is applied
 * @property - The delta of rotation rad before transform is applied
 * @property - a target's transform
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnRotate {
    target: HTMLElement | SVGElement;
    dist: number;
    delta: number;
    beforeDist: number;
    beforeDelta: number;
    transform: string;
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a rotate finished target
 * @property - Whether rotate called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnRotateEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - a target to warp
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnWarpStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a warping target
 * @property - a target's transform
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - The delta of warp matrix
 * @property - The dist of warp matrix
 * @property - Multiply function that can multiply previous matrix by warp matrix
 */
export interface OnWarp {
    target: HTMLElement | SVGElement;
    transform: string;
    clientX: number;
    clientY: number;
    delta: number[];
    dist: number[];
    multiply: (matrix1: number[], matrix2: number[], n?: number) => number[];
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a warp finished target
 * @property - Whether rotate called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 */
export interface OnWarpEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
}
