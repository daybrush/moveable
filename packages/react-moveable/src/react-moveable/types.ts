import { IObject } from "@daybrush/utils";
import Dragger, * as DraggerTypes from "@daybrush/drag";
import CustomDragger from "./CustomDragger";
import { Position } from "@daybrush/drag";

export interface MoveableClientRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    clientLeft?: number;
    clientTop?: number;
    clientWidth?: number;
    clientHeight?: number;
    scrollWidth?: number;
    scrollHeight?: number;
}
export type MoveableManagerProps<T = {}> = {
    parentMoveable?: any;
    parentPosition?: { left: number, top: number } | null;
} & MoveableDefaultProps & T;

/**
 * @typedef
 * @memberof Moveable
 * @property - The target(s) to indicate Moveable Control Box. (default: null)
 * @property - The target(s) to drag Moveable target(s) (default: target)
 * @property - Moveable Container. (default: parentElement)
 * @property - Moveable Root Container (No Transform Container). (default: container)
 * @property - You can specify the position of the rotation. (default: "top")
 * @property - Whether or not the origin control box will be visible or not (default: false)
 * @property - Zooms in the elements of a moveable. (default: 1)
 * @property - The default transformOrigin of the target can be set in advance. (default: "")
 * @property - Whether to scale and resize through edge lines. (default: false)
 * @property - You can add your custom able. (default: [])
 * @property - You can specify the className of the moveable controlbox. (default: "")
 * @property - Minimum distance to pinch. (default: 20)
 * @property - Whether the container containing the target becomes a pinch. (default: true)
 * @property - Lets generate events of ables at the same time. (like Resizable, Scalable) (default: false)
 * @property - Add padding around the target to increase the drag area. (default: null)
 */
export interface MoveableDefaultProps {
    target?: SVGElement | HTMLElement | null;
    dragTarget?: SVGElement | HTMLElement | null;
    container?: SVGElement | HTMLElement | null;
    rootContainer?: HTMLElement | null;
    dragArea?: boolean;
    origin?: boolean;
    zoom?: number;
    transformOrigin?: Array<string | number> | string | "";
    edge?: boolean;
    ables?: Able[];
    className?: string;
    pinchThreshold?: number;
    pinchOutside?: boolean;
    triggerAblesSimultaneously?: boolean;
    padding?: PaddingBox;
}
export type MoveableManagerState<T = {}> = {
    container: SVGElement | HTMLElement | null | undefined;
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
    rootMatrix: number[];
    targetMatrix: number[];
    offsetMatrix: number[];
    is3d: boolean;
    transformOrigin: number[];
    beforeOrigin: number[];
    origin: number[];
    beforeDirection: 1 | -1;
    direction: 1 | -1;
    renderPoses: number[][];
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
    dragger: Dragger | CustomDragger | null;
    targetClientRect: MoveableClientRect;
    containerClientRect: MoveableClientRect;
    moveableClientRect: MoveableClientRect;
    rotation: number;
} & T;

/**
 * @typedef
 * @memberof Moveable
 * @property - left padding
 * @property - top padding
 * @property - right padding
 * @property - bottom padding
 */
export interface PaddingBox {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
}
export interface Renderer {
    createElement(type: any, props?: any, ...children: any[]): any;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface Guideline {
    type: "horizontal" | "vertical";
    element?: Element | null;
    center?: boolean;
    pos: number[];
    size: number;
    sizes?: number[];
    gap?: number;
    gapGuidelines?: Guideline[];
}
export interface SnapBoundInfo {
    isBound: boolean;
    isSnap: boolean;
    offset: number;
}
export interface BoundInfo {
    isBound: boolean;
    offset: number;
    pos: number;
}
export interface SnapOffsetInfo {
    isSnap: boolean;
    offset: number;
    pos: number;
}
export interface SnapInfo {
    isSnap: boolean;
    posInfos: SnapPosInfo[];
}
export interface SnapPosInfo {
    pos: number;
    guidelineInfos: SnapGuidelineInfo[];
}
export interface SnapGuidelineInfo {
    dist: number;
    offset: number;
    guideline: Guideline;
}
export type ExcludeKey<T extends IObject<any>, U> = Pick<T, Exclude<keyof T, "target">>;
export interface MoveableProps extends
    ExcludeKey<MoveableManagerProps, "target">,
    DraggableProps,
    RotatableProps,
    ResizableProps,
    ScalableProps,
    WarpableProps,
    PinchableProps,
    GroupableProps,
    SnappableProps,
    ScrollableProps,
    // ClippableProps,
    RenderProps {
        target?: SVGElement | HTMLElement | Array<SVGElement | HTMLElement> | null;
}

export type MoveableState = MoveableManagerState;

export interface Able {
    name: string;
    props: IObject<any>;
    ableGroup?: string;
    updateRect?: boolean;
    canPinch?: boolean;
    unset?: (moveable: MoveableManagerProps<any>) => any;
    render?: (moveable: MoveableManagerProps<any>, renderer: Renderer) => any;

    dragStart?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDragStart) => any;
    drag?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDrag) => any;
    dragEnd?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDragEnd) => any;

    pinchStart?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnPinchStart) => any;
    pinch?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnPinch) => any;
    pinchEnd?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnPinchEnd) => any;

    dragControlCondition?: (target: SVGElement | HTMLElement) => boolean;
    dragControlStart?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDragStart) => any;
    dragControl?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDrag) => any;
    dragControlEnd?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDragEnd) => any;

    dragGroupCondition?: (e: any) => boolean;
    dragGroupStart?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDragStart) => any;
    dragGroup?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDrag) => any;
    dragGroupEnd?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDragEnd) => any;

    pinchGroupStart?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnPinchStart) => any;
    pinchGroup?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnPinch) => any;
    pinchGroupEnd?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnPinchEnd) => any;

    dragGroupControlCondition?: (e: any) => boolean;
    dragGroupControlStart?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDragStart) => any;
    dragGroupControl?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDragStart) => any;
    dragGroupControlEnd?: (moveable: MoveableManagerProps<any>, e: DraggerTypes.OnDragEnd) => any;

    request?: (moveable: MoveableManagerProps<any>) => AbleRequester;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - The Moveable instance
 * @property - The Moveable target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - The mouse or touch input event that is invoking the moveable event
 */
export interface OnEvent {
    currentTarget: MoveableInterface;
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - Run the request instantly. (requestStart, request, requestEnd happen at the same time)
 */
export interface AbleRequestParam {
    isInstant?: boolean;
    [key: string]: any;
}
/**
 * @typedef
 * @memberof Moveable
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.html#request|Request Method}
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Draggable.html#request|Draggable Requester}
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Resizable.html#request|Resizable Requester}
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Scalable.html#request|Scalable Requester}
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Rotatable.html#request|Rotatable Requester}
 * @property - Continue executing the request.
 * @property - End the request.
 */
export interface Requester {
    request(param: IObject<any>): this;
    requestEnd(param: IObject<any>): this;
}
export interface AbleRequester {
    isControl: boolean;
    requestStart(param: IObject<any>): IObject<any>;
    request(param: IObject<any>): IObject<any>;
    requestEnd(): IObject<any>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 */
export interface OnPinchStart extends OnEvent {
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 */
export interface OnPinch extends OnEvent {
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 */
export interface OnPinchEnd extends OnEvent {
    isDrag: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - You can set the start translate value.
 */
export interface OnDragStart extends OnEvent {
    set: (translate: number[]) => void;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
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
export interface OnDrag extends OnEvent {
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
 * @extends Moveable.OnEvent
 * @property - Whether drag called
 */
export interface OnDragEnd extends OnEvent {
    isDrag: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - The direction of scale.
 * @property - scale causes a `dragStart` event.
 * @property - You can set the start scale value.
 */
export interface OnScaleStart extends OnEvent {
    direction: number[];
    dragStart: OnDragStart | false;
    set: (scale: number[]) => void;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - The direction of scale.
 * @property - a target's scale
 * @property - The distance of scale
 * @property - The delta of scale
 * @property - a target's transform
 * @property - scale causes a `drag` event.
 */
export interface OnScale extends OnEvent {
    direction: number[];
    scale: number[];
    dist: number[];
    delta: number[];
    transform: string;
    isPinch: boolean;
    drag: OnDrag;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether scale called
 */
export interface OnScaleEnd extends OnEvent {
    isDrag: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - The direction of resize.
 * @property - resize causes a `dragStart` event.
 * @property - You can set the css width, height value.
 */
export interface OnResizeStart extends OnEvent {
    direction: number[];
    dragStart: OnDragStart | false;
    set: (sizes: number[]) => any;
    setOrigin: (origin: Array<string | number>) => any;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - The direction of resize.
 * @property - a target's cssWidth
 * @property - a target's cssHeight
 * @property - a target's offsetWidth
 * @property - a target's offsetHeight
 * @property - The distance of [width, height]
 * @property - The delta of [width, height]
 * @property - resize causes a `drag` event.
 */
export interface OnResize extends OnEvent {
    direction: number[];
    width: number;
    height: number;
    offsetWidth: number;
    offsetHeight: number;
    dist: number[];
    delta: number[];
    isPinch: boolean;
    drag: OnDrag;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether resize called
 */
export interface OnResizeEnd extends OnEvent {
    isDrag: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - You can set the start rotate value.
 */
export interface OnRotateStart extends OnEvent {
    set: (rotate: number) => void;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - The distance of rotation rad before transform is applied
 * @property - The delta of rotation rad before transform is applied
 * @property - The now rotation rad before transform is applied
 * @property - The distance of rotation rad
 * @property - The delta of rotation rad
 * @property - The now rotation rad
 * @property - a target's transform
 */
export interface OnRotate extends OnEvent {
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
 * @extends Moveable.OnEvent
 * @property - Whether rotate called
 */
export interface OnRotateEnd extends OnEvent {
    isDrag: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - You can set the start matrix value.
 */
export interface OnWarpStart extends OnEvent {
    set: (matrix: number[]) => any;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - a target's transform
 * @property - The delta of warp matrix
 * @property - The dist of warp matrix
 * @property - The caculated warp matrix
 * @property - Multiply function that can multiply previous matrix by warp matrix
 */
export interface OnWarp extends OnEvent {
    transform: string;
    delta: number[];
    dist: number[];
    matrix: number[];
    multiply: (matrix1: number[], matrix2: number[], n?: number) => number[];
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether rotate called
 */
export interface OnWarpEnd extends OnEvent {
    isDrag: boolean;
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
 * @extends Moveable.OnDragEnd
 * @property - The drag finished targets
 * @property - Whether `dragGroup` called
 */
export interface OnDragGroupEnd extends OnDragEnd {
    targets: Array<HTMLElement | SVGElement>;
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
    events: Array<OnRotateStart & { dragStart: OnDragStart | false }>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnRotate
 * @property - The rotating targets
 * @property - Each `rotate` & `drag` event on the targets
 * @property - You can set the current rotate value.
 */
export interface OnRotateGroup extends OnRotate {
    targets: Array<HTMLElement | SVGElement>;
    events: Array<OnRotate & { drag: OnDrag }>;
    set: (rotation: number) => any;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnRotateEnd
 * @property - The rotate finished targets
 * @property - Whether `rotateGroup` called
 */
export interface OnRotateGroupEnd extends OnRotateEnd {
    targets: Array<HTMLElement | SVGElement>;
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
 * @extends Moveable.OnResizeEnd
 * @property - The resize finished targets
 * @property - Whether `resizeGroup` called
 */
export interface OnResizeGroupEnd extends OnResizeEnd {
    targets: Array<HTMLElement | SVGElement>;
    isDrag: boolean;
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
    events: OnScaleStart[];
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
 * @extends Moveable.OnScaleEnd
 * @property - The scale finished targets
 * @property - Whether `scaleGroup` called
 */
export interface OnScaleGroupEnd extends OnScaleEnd {
    targets: Array<HTMLElement | SVGElement>;
    isDrag: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnPinchStart
 * @property - targets to pinch
 */
export interface OnPinchGroupStart extends OnPinchStart {
    targets: Array<HTMLElement | SVGElement>;
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
 * @extends Moveable.OnPinchEnd
 * @property - The pinch finished targets
 */
export interface OnPinchGroupEnd extends OnPinchEnd {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Clicked target.
 * @property - Whether the clicked target is moveable target.
 * @property - Whether the clicked target is a child of moveable target.
 * @property - Whether it is double-click
 */
export interface OnClick extends OnEvent {
    inputTarget: HTMLElement | SVGElement;
    isTarget: boolean;
    containsTarget: boolean;
    isDouble: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - targets set to group.
 * @property - Clicked target.
 * @property - Whether the clicked target is on the targets set in the group.
 * @property - Whether the clicked target is a child of the targets set in the group.
 * @property - The corresponding index among the targets set as a group.
 * @property - Whether it is double-click
 */
export interface OnClickGroup extends OnEvent {
    targets: Array<HTMLElement | SVGElement>;
    inputTarget: HTMLElement | SVGElement;
    isTarget: boolean;
    containsTarget: boolean;
    targetIndex: number;
    isDouble: boolean;
}

// `renderStart` event occurs at the first start of all events.
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being pinched.
 */
export interface OnRenderStart extends OnEvent {
    isPinch: boolean;
}

// `render` event occurs before the target is drawn on the screen.
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being pinched.
 */
export interface OnRender extends OnEvent {
    isPinch: boolean;
}

// `renderEnd` event occurs at the end of all events.
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being dragged.
 * @property - Whether or not it is being pinched.
 */
export interface OnRenderEnd extends OnEvent {
    isPinch: boolean;
    isDrag: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - The container corresponding to scrolling area (scrollContainer >= rootContainer >= container)
 * @property - The direction of scrolling [left, top]
 */
export interface OnScroll extends OnEvent {
    scrollContainer: HTMLElement;
    direction: number[];
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnScroll
 * @property - targets set to group.
 */
export interface OnScrollGroup extends OnScroll {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnRenderStart
 * @property - targets set to group.
 */
export interface OnRenderGroupStart extends OnRenderStart {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnRender
 * @property - targets set to group.
 */
export interface OnRenderGroup extends OnRender {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnRenderEnd
 * @property - targets set to group.
 */
export interface OnRenderGroupEnd extends OnRenderEnd {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - Whether or not target can be dragged. (default: false)
 * @property - throttle of x, y when drag. (default: 0)
 * @property - throttle of angle(degree) of x,y when drag. (default: 0)
 */
export interface DraggableOptions {
    draggable?: boolean;
    throttleDrag?: number;
    throttleDragRotate?: number;
}
export interface DraggableProps extends DraggableOptions {

    onDragStart?: (e: OnDragStart) => any;
    onDrag?: (e: OnDrag) => any;
    onDragEnd?: (e: OnDragEnd) => any;

    onDragGroupStart?: (e: OnDragGroupStart) => any;
    onDragGroup?: (e: OnDragGroup) => any;
    onDragGroupEnd?: (e: OnDragGroupEnd) => any;
}
export interface DraggableState {
    dragInfo: {
        startRect: RectInfo;
        dist: number[];
    } | null;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - Whether or not target can be resized. (default: false)
 * @property - throttle of width, height when resize. (default: 0)
 * @property - Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
 * @property - Target's base direcition using top, left, right, bottom (top: -1, left: -1, right: 1, bottom: 1) (default: [-1, -1])
 * @property - When resize or scale, keeps a ratio of the width, height. (default: false)
 */
export interface ResizableOptions {
    resizable?: boolean;
    throttleResize?: number;
    renderDirections?: string[];
    baseDirection?: number[];
    keepRatio?: boolean;
}
export interface ResizableProps extends ResizableOptions {
    onResizeStart?: (e: OnResizeStart) => any;
    onResize?: (e: OnResize) => any;
    onResizeEnd?: (e: OnResizeEnd) => any;

    onResizeGroupStart?: (e: OnResizeGroupStart) => any;
    onResizeGroup?: (e: OnResizeGroup) => any;
    onResizeGroupEnd?: (e: OnResizeGroupEnd) => any;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - Whether or not target can be scaled. (default: false)
 * @property - throttle of scaleX, scaleY when scale. (default: 0)
 * @property - Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
 * @property - When resize or scale, keeps a ratio of the width, height. (default: false)
 */
export interface ScalableOptions {
    scalable?: boolean;
    throttleScale?: number;
    renderDirections?: string[];
    keepRatio?: boolean;
}
export interface ScalableProps extends ScalableOptions {
    onScaleStart?: (e: OnScaleStart) => any;
    onScale?: (e: OnScale) => any;
    onScaleEnd?: (e: OnScaleEnd) => any;

    onScaleGroupStart?: (e: OnScaleGroupStart) => any;
    onScaleGroup?: (e: OnScaleGroup) => any;
    onScaleGroupEnd?: (e: OnScaleGroupEnd) => any;
}

/**
 * @typedef
 * @memberof Moveable
 */
export interface GapGuideline extends Guideline {
    renderPos: number[];
}
/**
 * @typedef
 * @memberof Moveable
 * @property - Whether or not target can be rotated. (default: false)
 * @property - You can specify the position of the rotation. (default: "top")
 * @property - throttle of angle(degree) when rotate. (default: 0)
 */
export interface RotatableOptions {
    rotatable?: boolean;
    rotationPosition?: "top" | "bottom" | "left" | "right";
    throttleRotate?: number;
}
export interface RotatableProps extends RotatableOptions {
    onRotateStart?: (e: OnRotateStart) => any;
    onRotate?: (e: OnRotate) => any;
    onRotateEnd?: (e: OnRotateEnd) => any;

    onRotateGroupStart?: (e: OnRotateGroupStart) => any;
    onRotateGroup?: (e: OnRotateGroup) => any;
    onRotateGroupEnd?: (e: OnRotateGroupEnd) => any;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - Whether or not target can be warped. (default: false)
 * @property - Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
 */
export interface WarpableOptions {
    warpable?: boolean;
    renderDirections?: string[];
}
export interface WarpableProps extends WarpableOptions {
    onWarpStart?: (e: OnWarpStart) => any;
    onWarp?: (e: OnWarp) => any;
    onWarpEnd?: (e: OnWarpEnd) => any;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - Whether or not target can be pinched with draggable, resizable, scalable, rotatable. (default: false)
 */
export interface PinchableOptions {
    pinchable?: boolean | Array<"rotatable" | "resizable" | "scalable">;
}

export interface PinchableProps extends PinchableOptions, ResizableProps, ScalableProps, RotatableProps {
    onPinchStart?: (e: OnPinchStart) => any;
    onPinch?: (e: OnPinch) => any;
    onPinchEnd?: (e: OnPinchEnd) => any;

    onPinchGroupStart?: (e: OnPinchGroupStart) => any;
    onPinchGroup?: (e: OnPinchGroup) => any;
    onPinchGroupEnd?: (e: OnPinchGroupEnd) => any;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - Sets the initial rotation of the group. (default 0)
 */
export interface GroupableOptions {
    defaultGroupRotate?: number;
}
export interface GroupableProps extends
    PinchableProps,
    DraggableProps,
    RotatableProps,
    ResizableProps,
    ScalableProps,
    SnappableProps,
    RenderProps,
    DragAreaProps,
    ScrollableProps,
    GroupableOptions {
    groupable?: boolean;
    targets?: Array<HTMLElement | SVGElement>;
    updateGroup?: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - Whether or not target can be snapped to the guideline. (default: false)
 * @property - When you drag, make the snap in the center of the target. (default: false)
 * @property - When you drag, make the snap in the horizontal guidelines. (default: true)
 * @property - When you drag, make the snap in the vertical guidelines. (default: true)
 * @property - When you drag, make the snap in the element guidelines. (default: true)
 * @property - When you drag, make the gap snap in the element guidelines. (default: true)
 * @property - Distance value that can snap to guidelines. (default: 5)
 * @property snapDigit - snap distance digits (default: 0)
 * @property isDisplaySnapDigit - Whether to show snap distance (default: true)
 * @property - Add guidelines in the horizontal direction. (default: [])
 * @property - Add guidelines in the vertical direction. (default: [])
 * @property - Add guidelines for the element. (default: [])
 * @property - You can set up boundaries. (default: null)
 * @property - You can set up inner boundaries. (default: null)
 * @property - You can set the text format of the distance shown in the guidelines. (default: self)
 */
export interface SnappableOptions {
    snappable?: boolean | string[];
    snapCenter?: boolean;
    snapHorizontal?: boolean;
    snapVertical?: boolean;
    snapElement?: boolean;
    snapGap?: boolean;
    snapThreshold?: number;
    snapDigit?: number;
    isDisplaySnapDigit?: boolean;
    horizontalGuidelines?: number[];
    verticalGuidelines?: number[];
    elementGuidelines?: Element[];
    bounds?: BoundType;
    innerBounds?: InnerBoundType;
    snapDistFormat?: (distance: number) => number | string;
}

export interface SnappableProps extends SnappableOptions {
    onSnap?: (e: OnSnap) => any;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - snapped verticalGuidelines, horizontalGuidelines,
 * @property - snapped elements (group by element)
 * @property - gaps is snapped guidelines that became gap snap between elements.
 */
export interface OnSnap {
    guidelines: Guideline[];
    elements: Guideline[][];
    gaps: GapGuideline[];
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface InnerBoundType {
    left: number;
    top: number;
    width: number;
    height: number;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface BoundType {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
}
export interface SnappableState {
    guidelines: any[];
    snapRenderInfo?: SnapRenderInfo | null;
    enableSnap: boolean;
}
export interface SnapRenderInfo {
    direction?: number[];
    snap?: boolean;
    center?: boolean;
    request?: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - Whether or not target can be scrolled to the scroll container (default: false)
 * @property - The container to which scroll is applied (default: container)
 * @property - Expand the range of the scroll check area. (default: 0)
 * @property - Sets a function to get the scroll position. (default: Function)
 */
export interface ScrollableOptions {
    scrollable?: boolean;
    scrollContainer?: HTMLElement;
    scrollThreshold?: number;
    getScrollPosition?: (e: { scrollContainer: HTMLElement, direction: number[] }) => number[];
}
export interface ScrollableProps extends ScrollableOptions {
    onScroll?: (e: OnScroll) => any;
    onScrollGroup?: (e: OnScrollGroup) => any;
}
export interface DragAreaProps {
    onClick?: (e: OnClick) => any;
    onClickGroup?: (e: OnClickGroup) => any;
}
export interface RenderProps {
    onRenderStart?: (e: OnRenderStart) => any;
    onRender?: (e: OnRender) => any;
    onRenderEnd?: (e: OnRenderEnd) => any;
    onRenderGroupStart?: (e: OnRenderGroupStart) => any;
    onRenderGroup?: (e: OnRenderGroup) => any;
    onRenderGroupEnd?: (e: OnRenderGroupEnd) => any;
}

export interface ClippableOptions {
    clipType?: "polygon" | "circle" | "ellipsis" | "rect";
    customClipArea?: { left: number, top: number, width: number, height: number };
    clipRelative?: boolean;
    clippable?: boolean;
    dragWithClip?: boolean;
}
export interface ClippableProps extends ClippableOptions {
    onClip?: (e: OnClip) => any;
}
export interface OnClip extends OnEvent {
    clipType: "polygon" | "circle" | "ellipsis" | "rect";
    poses: number[][];
    addedIndex: number;
    removedIndex: number;
    changedIndexes: number[];
    distX: number;
    distY: number;
    clipStyle: string;
}
export interface OnCustomDrag extends Position {
    type: string;
    inputEvent: any;
    isDrag: boolean;
    datas: IObject<any>;
    originalDatas: IObject<any>;
    parentEvent: boolean;
    parentDragger: CustomDragger;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - The coordinates of the vertex 1
 * @property - The coordinates of the vertex 1
 * @property - The coordinates of the vertex 1
 * @property - The coordinates of the vertex 1
 * @property - left position of the target relative to the container
 * @property - top position of the target relative to the container
 * @property - The width of moveable element
 * @property - The height of moveable element
 * @property - The offset width of the target
 * @property - The offset height of the target
 * @property - The absolute transform origin
 * @property - the absolute transform origin before transformation
 */
export interface RectInfo {
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
    left: number;
    top: number;
    width: number;
    height: number;
    offsetWidth: number;
    offsetHeight: number;
    origin: number[];
    beforeOrigin: number[];
}
/**
 * @typedef
 * @memberof Moveable
 * @property - top position
 * @property - left position
 * @property - target's width
 * @property - target's height
 */
export interface HitRect {
    top: number;
    left: number;
    width?: number;
    height?: number;
}
export interface MoveableInterface {
    getRect(): RectInfo;
    isMoveableElement(target: HTMLElement | SVGElement): boolean;
    updateRect(isNotSetState?: boolean): void;
    updateTarget(): void;
    request(ableName: string, params: IObject<any>): Requester;
    destroy(): void;
    dragStart(e: MouseEvent | TouchEvent): void;
    isInside(clientX: number, clientY: number): boolean;
    isDragging(): boolean;
    hitTest(el: Element | HitRect): number;
    setState(state: any, callback?: () => any): any;
}
