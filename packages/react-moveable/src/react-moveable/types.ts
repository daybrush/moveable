import { IObject } from "@daybrush/utils";
import * as Dragger from "@daybrush/drag";

export type MoveableManagerProps<T = {}> = {
    target?: SVGElement | HTMLElement | null;
    container?: SVGElement | HTMLElement | null;
    dragArea?: boolean;
    parentMoveable?: any;
    parentPosition?: { left: number, top: number } | null;
    origin?: boolean;
    transformOrigin?: string;
    edge?: boolean;
    keepRatio?: boolean;
    pinchThreshold?: number;
    ables?: Array<Able<T>>;
} & T;
export type MoveableManagerState<T = {}> = {
    target: SVGElement | HTMLElement | null | undefined;
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    beforeMatrix: number[];
    matrix: number[];
    targetTransform: string;
    targetMatrix: number[];
    offsetMatrix: number[];
    is3d: boolean;
    transformOrigin: number[];
    beforeOrigin: number[];
    origin: number[];
    beforeDirection: 1 | -1;
    direction: 1 | -1;
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
} & T;

export interface Renderer {
    createElement(type: any, props?: any, ...children: any[]): any;
}
export interface Guideline {
    type: "horizontal" | "vertical";
    element?: Element | null;
    center?: boolean;
    pos: number[];
    size: number;
}
export interface SnapInfo {
    isSnap: boolean;
    dist: number;
    offset: number;
    guidelines: Guideline[];
    snapPoses: number[];
}
export interface MoveableProps
    extends DraggableProps,
    RotatableProps,
    ResizableProps,
    ScalableProps,
    WarpableProps,
    PinchableProps,
    GroupableProps,
    SnappableProps {
    target?: SVGElement | HTMLElement | Array<SVGElement | HTMLElement> | null;
    container?: SVGElement | HTMLElement | null;
    origin?: boolean;
    keepRatio?: boolean;
    edge?: boolean;
    pinchThreshold?: number;
    ables?: Able[];
}
export type MoveableState = MoveableManagerState;
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
 * @property - a target to drag
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - You can set the start translate value.
 */
export interface OnDragStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    set: (translate: number[]) => void;
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
 * @property - The position of [left, top]
 * @property - The delta of [translateX, translateY]
 * @property - The distance of [translateX, translateY]
 * @property - The position of [translateX, translateY]
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
    beforeTranslate: number[];
    delta: number[];
    dist: number[];
    translate: number[];
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
 * @property - You can set the start scale value.
 */
export interface OnScaleStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    set: (scale: number[]) => void;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a scaling target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - The direction of scale.
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
    direction: number[];
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
 * @property - resize causes a `dragStart` event.
 */
export interface OnResizeStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    dragStart: OnDragStart;
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
 * @property - resize causes a `drag` event.
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
    drag: OnDrag;
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
 * @property - You can set the start rotate value.
 */
export interface OnRotateStart {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    set: (rotate: number) => void;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a rotating target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - The distance of rotation rad before transform is applied
 * @property - The delta of rotation rad before transform is applied
 * @property - The now rotation rad before transform is applied
 * @property - The distance of rotation rad
 * @property - The delta of rotation rad
 * @property - The now rotation rad
 * @property - a target's transform
 */
export interface OnRotate {
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;

    beforeDist: number;
    beforeDelta: number;
    beforeRotate: number;

    dist: number;
    delta: number;
    rotate: number;

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

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnDragStart
 * @property - targets to drag
 * @property - Each `dragStart` event on the targets
 */
export interface OnDragGroupStart extends OnDragStart {
    targets: Array<HTMLElement | SVGElement>;
    events: OnDragStart[];
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnDrag
 * @property - The dragging targets
 * @property - Each `drag` event on the targets
 */
export interface OnDragGroup extends OnDrag {
    targets: Array<HTMLElement | SVGElement>;
    events: OnDrag[];
}
/**
 * @typedef
 * @memberof Moveable
 * @property - The drag finished targets
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - Whether `dragGroup` called
 */
export interface OnDragGroupEnd {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    isDrag: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnRotateStart
 * @property - targets to rotate
 * @property - Each `rotateStart` & `dragStart` event on the targets
 */
export interface OnRotateGroupStart extends OnRotateStart {
    targets: Array<HTMLElement | SVGElement>;
    events: Array<OnRotateStart & { dragStart: OnDragStart }>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnRotate
 * @property - The rotating targets
 * @property - Each `rotate` & `drag` event on the targets
 */
export interface OnRotateGroup extends OnRotate {
    targets: Array<HTMLElement | SVGElement>;
    events: Array<OnRotate & { drag: OnDrag }>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - The rotate finished targets
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - Whether `rotateGroup` called
 */
export interface OnRotateGroupEnd {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    isDrag: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnResizeStart
 * @property - targets to resize
 * @property - Each `resizeStart` event on the targets
 */
export interface OnResizeGroupStart extends OnResizeStart {
    targets: Array<HTMLElement | SVGElement>;
    events: OnResizeStart[];
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnResize
 * @property - The resizing targets
 * @property - Each `resize` & `drag `event on the targets
 */
export interface OnResizeGroup extends OnResize {
    targets: Array<HTMLElement | SVGElement>;
    events: Array<OnResize & { drag: OnDrag }>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - The resize finished targets
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - Whether `resizeGroup` called
 */
export interface OnResizeGroupEnd {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
    isDrag: boolean;
    datas: IObject<any>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnScaleStart
 * @property - targets to scale
 * @property - Each `scaleStart` & `dragStart` event on the targets
 */
export interface OnScaleGroupStart extends OnScaleStart {
    targets: Array<HTMLElement | SVGElement>;
    events: Array<OnScaleStart & { drag: OnDragStart }>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnScale
 * @property - The scaling targets
 * @property - Each `scale` & `drag` event on the targets
 */
export interface OnScaleGroup extends OnScale {
    targets: Array<HTMLElement | SVGElement>;
    events: Array<OnScale & { drag: OnDrag }>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - The scale finished targets
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - Whether `scaleGroup` called
 */
export interface OnScaleGroupEnd {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
    isDrag: boolean;
    datas: IObject<any>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - targets to pinch
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 */
export interface OnPinchGroupStart {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnPinch
 * @property - targets to pinch
 */
export interface OnPinchGroup extends OnPinch {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - The pinch finished targets
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - Whether `pinchGroup` called
 */
export interface OnPinchGroupEnd {
    targets: Array<HTMLElement | SVGElement>;
    clientX: number;
    clientY: number;
    isDrag: boolean;
    datas: IObject<any>;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - targets set to group.
 * @property - Clicked target.
 * @property - Whether the clicked target is on the targets set in the group.
 * @property - Whether the clicked target is a child of the targets set in the group.
 * @property - The corresponding index among the targets set as a group.
 */
export interface OnClickGroup {
    targets: Array<HTMLElement | SVGElement>;
    target: HTMLElement | SVGElement;
    hasTarget: boolean;
    containsTarget: boolean;
    targetIndex: number;
}

export interface Able<T = any> {
    name: string & keyof MoveableManagerProps<T>;
    dragControlOnly?: boolean;
    updateRect?: boolean;
    canPinch?: boolean;

    render?: (moveable: MoveableManagerProps<any>, renderer: Renderer) => any;

    dragStart?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragStart) => any;
    drag?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDrag) => any;
    dragEnd?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragEnd) => any;

    pinchStart?: (moveable: MoveableManagerProps<any>, e: Dragger.OnPinchStart) => any;
    pinch?: (moveable: MoveableManagerProps<any>, e: Dragger.OnPinch) => any;
    pinchEnd?: (moveable: MoveableManagerProps<any>, e: Dragger.OnPinchEnd) => any;

    dragControlCondition?: (target: SVGElement | HTMLElement) => boolean;
    dragControlStart?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDragStart) => any;
    dragControl?: (moveable: MoveableManagerProps<any>, e: Dragger.OnDrag) => any;
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

    onResizeGroupStart?: (e: OnResizeGroupStart) => any;
    onResizeGroup?: (e: OnResizeGroup) => any;
    onResizeGroupEnd?: (e: OnResizeGroupEnd) => any;
}
export interface ScalableProps {
    scalable?: boolean;
    throttleScale?: number;

    onScaleStart?: (e: OnScaleStart) => any;
    onScale?: (e: OnScale) => any;
    onScaleEnd?: (e: OnScaleEnd) => any;

    onScaleGroupStart?: (e: OnScaleGroupStart) => any;
    onScaleGroup?: (e: OnScaleGroup) => any;
    onScaleGroupEnd?: (e: OnScaleGroupEnd) => any;
}

export interface RotatableProps {
    rotatable?: boolean;
    rotationPosition?: "top" | "bottom" | "left" | "right";
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

    onPinchGroupStart?: (e: OnPinchGroupStart) => any;
    onPinchGroup?: (e: OnPinchGroup) => any;
    onPinchGroupEnd?: (e: OnPinchGroupEnd) => any;
}

export interface GroupableProps extends PinchableProps, DraggableProps, RotatableProps, ResizableProps, ScalableProps {
    groupable?: boolean;
    targets?: Array<HTMLElement | SVGElement>;
    updateGroup?: boolean;
    onClickGroup?: (e: OnClickGroup) => any;
}

export interface SnappableProps {
    snappable?: boolean;
    snapCenter?: boolean;
    snapThreshold?: number;
    horizontalGuidelines?: number[];
    verticalGuidelines?: number[];
    elementGuildelines?: Element[];
}
export interface SnappableState {
    guidelines: any[];
    startLeft: number;
    startTop: number;
    startRight: number;
    startBottom: number;
}
