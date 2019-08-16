import { IObject } from "@daybrush/utils";
import * as Dragger from "@daybrush/drag";
import MoveableManager from "./MoveableManager";

export type MoveableManagerProps<T = {}> = {
    target?: SVGElement | HTMLElement | null;
    container?: SVGElement | HTMLElement | null;
    parentMoveable?: MoveableManager | null;
    parentPosition?: { left: number, top: number } | null;
    origin?: boolean;
    line?: boolean;
    keepRatio?: boolean;
    ables?: Array<Able<T>>;
} & T;
export interface MoveableManagerState<T = {}> {
    target: SVGElement | HTMLElement | null | undefined;
    left: number;
    top: number;
    width: number;
    height: number;
    beforeMatrix: number[];
    matrix: number[];
    targetTransform: string;
    targetMatrix: number[];
    is3d: boolean;
    transformOrigin: number[];
    beforeOrigin: number[];
    origin: number[];
    beforeDirection: 1 | -1;
    direction: 1 | -1;
    rotationRad: number;
    rotationPos: number[];
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
}

export interface MoveableProps
    extends DraggableProps,
    RotatableProps,
    ResizableProps,
    ScalableProps,
    WarpableProps,
    PinchableProps {
    target?: SVGElement | HTMLElement | null;
    container?: SVGElement | HTMLElement | null;
    origin?: boolean;
    keepRatio?: boolean;
}

export interface MoveableState {
    target: SVGElement | HTMLElement | null | undefined;
    left: number;
    top: number;
    width: number;
    height: number;
    beforeMatrix: number[];
    matrix: number[];
    targetTransform: string;
    targetMatrix: number[];
    is3d: boolean;
    transformOrigin: number[];
    beforeOrigin: number[];
    origin: number[];
    beforeDirection: 1 | -1;
    direction: 1 | -1;
    rotationRad: number;
    rotationPos: number[];
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
    isDrag: boolean;
    isRotate: boolean;
    isResize: boolean;
    isScale: boolean;
    isPinch: boolean;
    isWarp: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - a target to pinch
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnPinchStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a pinching target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnPinch {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a pinch finished target
 * @property - Whether pinch called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnPinchEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - a dragging target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - The delta of [left, top]
 * @property - The distance of [left, top]
 * @property - The delta of [translateX, translateY]
 * @property - The distance of [translateX, translateY]
 * @property - a target's transform
 * @property - a target's left
 * @property - a target's top
 * @property - a target's bottom
 * @property - a target's right
 * @property - Whether or not it is being pinched.
 */
export interface OnDrag {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    beforeDelta: number[];
    beforeDist: number[];
    delta: number[];
    dist: number[];
    transform: string;
    left: number;
    top: number;
    bottom: number;
    right: number;
    isPinch: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a drag finished target
 * @property - Whether drag called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnDragEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - a target to drag
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnDragStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a dragging target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - The delta of [left, top]
 * @property - The distance of [left, top]
 * @property - The delta of [translateX, translateY]
 * @property - The distance of [translateX, translateY]
 * @property - a target's transform
 * @property - a target's left
 * @property - a target's top
 * @property - a target's bottom
 * @property - a target's right
 * @property - Whether or not it is being pinched.
 */
export interface OnDrag {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    beforeDelta: number[];
    beforeDist: number[];
    delta: number[];
    dist: number[];
    transform: string;
    left: number;
    top: number;
    bottom: number;
    right: number;
    isPinch: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a drag finished target
 * @property - Whether drag called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnDragEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a target to scale
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnScaleStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a scaling target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - a target's scale
 * @property - The distance of scale
 * @property - The delta of scale
 * @property - a target's transform
 */
export interface OnScale {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    scale: number[];
    dist: number[];
    delta: number[];
    transform: string;
    isPinch: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a scale finished target
 * @property - Whether scale called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnScaleEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - a target to resize
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnResizeStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a resizng target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - The direction of resize.
 * @property - a target's width
 * @property - a target's height
 * @property - The distance of [width, height]
 * @property - The delta of [width, height]
 */
export interface OnResize {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    direction: number[];
    width: number;
    height: number;
    dist: number[];
    delta: number[];
    isPinch: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a resize finished target
 * @property - Whether resize called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnResizeEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a target to rotate
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnRotateStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a rotating target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - The distance of rotation rad
 * @property - The delta of rotation rad
 * @property - The distance of rotation rad before transform is applied
 * @property - The delta of rotation rad before transform is applied
 * @property - a target's transform
 */
export interface OnRotate {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    dist: number;
    delta: number;
    beforeDist: number;
    beforeDelta: number;
    transform: string;
    isPinch: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a rotate finished target
 * @property - Whether rotate called
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnRotateEnd {
    target: HTMLElement | SVGElement;
    isDrag: boolean;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - a target to warp
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnWarpStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a warping target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - a target's transform
 * @property - The delta of warp matrix
 * @property - The dist of warp matrix
 * @property - Multiply function that can multiply previous matrix by warp matrix
 */
export interface OnWarp {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    transform: string;
    delta: number[];
    dist: number[];
    multiply: (matrix1: number[], matrix2: number[], n?: number) => number[];
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a warp finished target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Whether rotate called
 * @property - Objects that can send information to the following events.
 */
export interface OnWarpEnd {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    isDrag: boolean;
    datas: IObject<any>;
}

export interface OnDragGroupStart {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
}

export interface OnDragGroup extends OnDrag {
    targets: Array<HTMLElement | SVGElement>;
    events: Array<OnDrag | undefined>;
}
export interface OnDragGroupEnd {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
    isDrag: boolean;
}

export interface OnRotateGroupStart {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
}

export interface OnRotateGroup extends OnRotate {
    targets: Array<HTMLElement | SVGElement>;
    events: Array<OnRotate & { drag: OnDrag } | undefined>;
}
export interface OnRotateGroupEnd {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
    isDrag: boolean;
}

export interface Able<T = any> {
    name: string & keyof MoveableManagerProps<T>;
    dragControlOnly?: boolean;
    updateRect?: boolean;

    render?: (moveable: MoveableManagerProps<any>) => any;

    dragStart?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragStart) => any;
    drag?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDrag) => any;
    dragEnd?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragEnd) => any;

    pinchStart?: (moveable: MoveableManagerProps<any>, e: Dragger.OnPinchStart) => any;
    pinch?: (moveable: MoveableManagerProps<any>, e: Dragger.OnPinch) => any;
    pinchEnd?: (moveable: MoveableManagerProps<any>, e: Dragger.OnPinchEnd) => any;

    dragControlCondition?: (target: SVGElement | HTMLElement) => boolean;
    dragControlStart?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragStart) => any;
    dragControl?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragStart) => any;
    dragControlEnd?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragEnd) => any;

    dragGroupCondition?: (target: SVGElement | HTMLElement) => boolean;
    dragGroupStart?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragStart) => any;
    dragGroup?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDrag) => any;
    dragGroupEnd?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragEnd) => any;

    pinchGroupStart?: (moveable: MoveableManagerProps<any>, e: Dragger.OnPinchStart) => any;
    pinchGroup?: (moveable: MoveableManagerProps<any>, e: Dragger.OnPinch) => any;
    pinchGroupEnd?: (moveable: MoveableManagerProps<any>, e: Dragger.OnPinchEnd) => any;

    dragGroupControlCondition?: (target: SVGElement | HTMLElement) => boolean;
    dragGroupControlStart?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragStart) => any;
    dragGroupControl?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragStart) => any;
    dragGroupControlEnd?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragEnd) => any;
}
export interface OriginProps {
    origin: boolean;
}
export interface DraggableProps {
    draggable?: boolean;
    throttleDrag?: number;

    onDragStart?: (e: OnDragStart) => any;
    onDrag?: (e: OnDrag) => any;
    onDragEnd?: (e: OnDragEnd) => any;

    onDragGroupStart?: (e: OnDragGroupStart) => any;
    onDragGroup?: (e: OnDragGroup) => any;
    onDragGroupEnd?: (e: OnDragGroupEnd) => any;
}
export interface ResizableProps {
    resizable?: boolean;
    throttleResize?: number;

    onResizeStart?: (e: OnResizeStart) => any;
    onResize?: (e: OnResize) => any;
    onResizeEnd?: (e: OnResizeEnd) => any;
}
export interface ScalableProps {
    scalable?: boolean;
    throttleScale?: number;
    onScaleStart?: (e: OnScaleStart) => any;
    onScale?: (e: OnScale) => any;
    onScaleEnd?: (e: OnScaleEnd) => any;
}

export interface RotatableProps {
    rotatable?: boolean;
    throttleRotate?: number;

    onRotateStart?: (e: OnRotateStart) => any;
    onRotate?: (e: OnRotate) => any;
    onRotateEnd?: (e: OnRotateEnd) => any;

    onRotateGroupStart?: (e: OnRotateGroupStart) => any;
    onRotateGroup?: (e: OnRotateGroup) => any;
    onRotateGroupEnd?: (e: OnRotateGroupEnd) => any;
}

export interface WarpableProps {
    warpable?: boolean;
    onWarpStart?: (e: OnWarpStart) => any;
    onWarp?: (e: OnWarp) => any;
    onWarpEnd?: (e: OnWarpEnd) => any;
}

export interface PinchableProps extends ResizableProps, ScalableProps, RotatableProps {
    pinchable?: boolean | Array<"rotatable" | "resizable" | "scalable">;
    onPinchStart?: (e: OnPinchStart) => any;
    onPinch?: (e: OnPinch) => any;
    onPinchEnd?: (e: OnPinchEnd) => any;
}

export interface GroupableProps extends DraggableProps, RotatableProps, ResizableProps, ScalableProps {
    groupable?: boolean;
    targets?: Array<HTMLElement | SVGElement>;
    updateGroup?: boolean;
}
