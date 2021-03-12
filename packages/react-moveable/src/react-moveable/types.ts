import { IObject } from "@daybrush/utils";
import Gesto, * as GestoTypes from "gesto";
import CustomGesto from "./gesto/CustomGesto";
import { MOVEABLE_EVENTS_MAP, MOVEABLE_PROPS_MAP } from "./ables/consts";

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
    overflow?: boolean;
}
export type MoveableManagerProps<T = {}> = {
    cssStyled: any;
    customStyledMap: Record<string, any>;
    wrapperMoveable?: MoveableManagerInterface | null;
    parentMoveable?: MoveableManagerInterface | null;
    parentPosition?: { left: number, top: number } | null;
    groupable?: boolean;
} & MoveableDefaultOptions & (unknown extends T ? IObject<any> : T);

export type AnyObject<T> = (unknown extends T ? IObject<any> : T);
/**
 * @typedef
 * @memberof Moveable
 * @property - The target(s) to indicate Moveable Control Box. (default: null)
 * @property - The target(s) to drag Moveable target(s) (default: target)
 * @property - Moveable Container. Don't set it. (default: parentElement)
 * @property - Moveable Portal Container to support other frameworks. Don't set it. (default: container)
 * @property - Moveable Root Container (No Transform Container). (default: container)
 * @property - Zooms in the elements of a moveable. (default: 1)
 * @property - The default transformOrigin of the target can be set in advance. (default: "")
 * @property - Whether to scale and resize through edge lines. (default: false)
 * @property - You can add your custom able. (default: [])
 * @property - You can specify the className of the moveable controlbox. (default: "")
 * @property - Minimum distance to pinch. (default: 20)
 * @property - Whether the container containing the target becomes a pinch. (default: true)
 * @property - Lets generate events of ables at the same time. (like Resizable, Scalable) (default: false)
 * @property - Checks whether this is an element to input text or contentEditable, and prevents dragging. (default: false)
 * @property - add nonce property to style for CSP (default: "")
 * @property - You can set the translateZ value of moveable (default: 50)
 * @property - You can use props in object format or custom props. (default: object)
 */
export interface DefaultOptions {
    target?: SVGElement | HTMLElement | null;
    dragTarget?: SVGElement | HTMLElement | null;
    container?: SVGElement | HTMLElement | null;
    portalContainer?: HTMLElement | null;
    rootContainer?: HTMLElement | null;
    zoom?: number;
    transformOrigin?: Array<string | number> | string | "";
    edge?: boolean;
    ables?: Able[];
    className?: string;
    pinchThreshold?: number;
    pinchOutside?: boolean;
    triggerAblesSimultaneously?: boolean;
    checkInput?: boolean;
    cspNonce?: string;
    translateZ?: number;
    props?: Record<string, any>;
}
/**
 * @typedef
 * @extends Moveable.DefaultOptions
 * @extends Moveable.DragAreaOptions
 * @extends Moveable.OriginOptions
 * @extends Moveable.PaddingOptions
 */
export interface MoveableDefaultOptions
    extends DefaultOptions, DragAreaOptions, OriginOptions, PaddingOptions {
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
    allMatrix: number[];
    targetTransform: string;
    rootMatrix: number[];
    targetMatrix: number[];
    offsetMatrix: number[];
    is3d: boolean;
    transformOrigin: number[];
    targetOrigin: number[];
    beforeOrigin: number[];
    origin: number[];
    originalBeforeOrigin: number[];
    beforeDirection: number;
    direction: number;
    renderPoses: number[][];
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
    gesto: Gesto | CustomGesto | null;
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
 * @memberof Moveable.Snappable
 */
export interface Guideline {
    type: "horizontal" | "vertical";
    element?: Element | null;
    center?: boolean;
    pos: number[];
    size: number;
    className?: string;
    sizes?: number[];
    gap?: number;
    gapGuidelines?: Guideline[];
}
export interface SnapBoundInfo {
    isBound: boolean;
    isSnap: boolean;
    offset: number;
    dist: number;
    snapIndex?: number;
    bounds?: BoundInfo[];
    snap?: SnapInfo;
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
    index: number;
    posInfos: SnapPosInfo[];
}
export interface SnapPosInfo {
    pos: number;
    index: number;
    guidelineInfos: SnapGuidelineInfo[];
}
export interface SnapGuidelineInfo {
    dist: number;
    offset: number;
    guideline: Guideline;
}

/**
 * @typedef
 * @memberof Moveable.Snappable
 */
export interface RenderGuidelineInfo {
    key?: string;
    direction: string;
    classNames: string[];
    size: string;
    pos: string[];
    sizeValue: number;
    posValue: number[];
    zoom: number;
}
export interface RenderGuidelineInnerInfo {
    key?: string;
    direction: string;
    classNames: Array<string | undefined>;
    size?: string;
    pos?: string[];
    sizeValue: number;
    posValue: number[];
    zoom: number;
}
export type ExcludeKey<T extends IObject<any>, U> = Pick<T, Exclude<keyof T, U>>;

export interface MoveableProps extends
    MoveableDefaultProps,
    DraggableProps,
    DragAreaProps,
    OriginDraggableProps,
    RotatableProps,
    ResizableProps,
    ScalableProps,
    WarpableProps,
    PinchableProps,
    ExcludeKey<GroupableProps, "targets" | "updateGroup">,
    IndividualGroupableProps,
    SnappableProps,
    ScrollableProps,
    ClippableProps,
    RoundableProps,
    BeforeRenderableProps,
    ClickableProps,
    RenderableProps {
}
/**
 * @memberof Moveable
 * @typedef
 * @extends Moveable.MoveableDefaultOptions
 */
export interface MoveableDefaultProps extends ExcludeKey<MoveableDefaultOptions, "target"> {
    target?: MoveableRefType | ArrayFormat<MoveableRefType>;
}
export type MoveableRefType<T extends HTMLElement | SVGElement = HTMLElement | SVGElement>
    = string |(() => T) | MoveableRefObject<T> | T | null | undefined;
export interface MoveableRefObject<T extends HTMLElement | SVGElement = HTMLElement | SVGElement> {
    current: T | undefined | null;
}
/**
 * @memberof Moveable
 * @typedef
 * @extends Moveable.MoveableDefaultProps
 * @extends Moveable.Draggable.DraggableOptions
 * @extends Moveable.Resizable.ResizableOptions
 * @extends Moveable.Scalable.ScalableOptions
 * @extends Moveable.Rotatable.RotatableOptions
 * @extends Moveable.Warpable.WarpableOptions
 * @extends Moveable.Pinchable.PinchableOptions
 * @extends Moveable.Scrollable.ScrollableOptions
 * @extends Moveable.Group.GroupableOptions
 * @extends Moveable.Clippable.ClippableOptions
 * @extends Moveable.OriginDraggable.OriginDraggableOptions
 * @extends Moveable.Roundable.RoundableOptions
 */
export interface MoveableOptions extends
    MoveableDefaultProps,
    DraggableOptions,
    DragAreaOptions,
    OriginDraggableOptions,
    RotatableOptions,
    ResizableOptions,
    ScalableOptions,
    WarpableOptions,
    PinchableOptions,
    GroupableOptions,
    IndividualGroupableOptions,
    SnappableOptions,
    ScrollableOptions,
    ClippableOptions,
    RoundableOptions {
}

export type MoveableState = MoveableManagerState;

export interface Able<Props extends IObject<any> = IObject<any>, Events extends IObject<any> = IObject<any>> {
    name: string;
    props: { [key in keyof Props]: any };
    events: { [key in keyof Events]: string };
    // Whether to always include in able. It is recommended to use always in frameworks other than react
    always?: boolean;
    ableGroup?: string;
    updateRect?: boolean;
    canPinch?: boolean;
    css?: string[];
    // Fired when the event is cleared
    unset?: (moveable: any) => any;
    // Renders the React DOM structure for the able.
    render?: (moveable: any, renderer: Renderer) => any;

    // Operates when a drag event occurs for the single target.
    dragStart?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    drag?: (moveable: any, e: GestoTypes.OnDrag) => any;
    dragEnd?: (moveable: any, e: GestoTypes.OnDragEnd) => any;

    // Operates when a pinch event occurs for the single target.
    pinchStart?: (moveable: any, e: GestoTypes.OnPinchStart) => any;
    pinch?: (moveable: any, e: GestoTypes.OnPinch) => any;
    pinchEnd?: (moveable: any, e: GestoTypes.OnPinchEnd) => any;

    // Condition that occurs dragControl
    dragControlCondition?: (e: any, moveable: any) => boolean;
    // Operates when a drag event occurs for the moveable control and single target.
    dragControlStart?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    dragControl?: (moveable: any, e: GestoTypes.OnDrag) => any;
    dragControlEnd?: (moveable: any, e: GestoTypes.OnDragEnd) => any;

    // Condition that occurs dragGroup
    dragGroupCondition?: (e: any, moveable: any) => boolean;
    // Operates when a drag event occurs for the multi target.
    dragGroupStart?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    dragGroup?: (moveable: any, e: GestoTypes.OnDrag) => any;
    dragGroupEnd?: (moveable: any, e: GestoTypes.OnDragEnd) => any;

    // Operates when a pinch event occurs for the multi target.
    pinchGroupStart?: (moveable: any, e: GestoTypes.OnPinchStart) => any;
    pinchGroup?: (moveable: any, e: GestoTypes.OnPinch) => any;
    pinchGroupEnd?: (moveable: any, e: GestoTypes.OnPinchEnd) => any;

    // Condition that occurs dragGroupControl
    dragGroupControlCondition?: (e: any, moveable: any) => boolean;

    // Operates when a drag event occurs for the moveable control and multi target.
    dragGroupControlStart?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    dragGroupControl?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    dragGroupControlEnd?: (moveable: any, e: GestoTypes.OnDragEnd) => any;

    // mouse enter event
    mouseEnter?: (e: any, moveable: any) => any;
    // mouse leave event
    mouseLeave?: (e: any, moveable: any) => any;


    // Execute the operation of able for external request
    request?: (moveable: any) => AbleRequester;
}

/**
 * @typedef
 * @memberof Moveable
 * @property - The Moveable instance
 * @property - The Moveable instance
 * @property - The Moveable target
 * @property - The horizontal coordinate within the application's client area at which the event occurred.
 * @property - The vertical coordinate within the application's client area at which the event occurred.
 * @property - Objects that can send information to the following events.
 * @property - The mouse or touch input event that is invoking the moveable event
 */
export interface OnEvent {
    currentTarget: MoveableManagerInterface<any, any>;
    moveable: MoveableManagerInterface<any, any>;
    target: HTMLElement | SVGElement;
    clientX: number;
    clientY: number;
    datas: IObject<any>;
    inputEvent: any;
}
/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - This is the last dragged event. No, if you haven't dragged.
 * @property - Whether this moved
 * @property - Whether it is double-click
 */
export interface OnEndEvent extends OnEvent {
    lastEvent: any | undefined;
    isDrag: boolean;
    isDouble: boolean;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - Set your original transform. `index` is the sequence of functions used in the event. If you use `setTransform`, you don't need to use `set` function.
 * @property - `index` is the sequence of functions used in the event.
 */
export interface OnTransformStartEvent {
    setTransform(transform: string | string[], index?: number): void;
    setTransformIndex(transformIndex: number): void;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - a target's next transform string value.
 * @property - transform events causes a `drag` event.
 */
export interface OnTransformEvent {
    transform: string;
    drag: OnDrag;
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
    requestEnd(): this;
}
export interface AbleRequester {
    isControl: boolean;
    requestStart(param: IObject<any>): IObject<any>;
    request(param: IObject<any>): IObject<any>;
    requestEnd(): IObject<any>;
}

/**
 * @typedef
 * @memberof Moveable.Pinchable
 * @extends Moveable.OnEvent
 */
export interface OnPinchStart extends OnEvent {
}
/**
 * @typedef
 * @memberof Moveable.Pinchable
 * @extends Moveable.OnEvent
 */
export interface OnPinch extends OnEvent {
}
/**
 * @typedef
 * @memberof Moveable.Pinchable
 * @extends Moveable.OnEndEvent
 */
export interface OnPinchEnd extends OnEndEvent { }
/**
 * @typedef
 * @memberof Moveable.Draggable
 * @extends Moveable.OnEvent
 * @extends Moveable.OnTransformStartEvent
 * @property - You can set the start translate value.
 */
export interface OnDragStart extends OnEvent, OnTransformStartEvent {
    set: (translate: number[]) => void;
}
/**
 * @typedef
 * @memberof Moveable.Draggable
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
 * @property - a target's offset width
 * @property - a target's offset height
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
    width: number;
    height: number;
    right: number;
    isPinch: boolean;
}
/**
 * @typedef
 * @memberof Moveable.Draggable
 * @extends Moveable.OnEndEvent
 */
export interface OnDragEnd extends OnEndEvent {
}

/**
 * @typedef
 * @memberof Moveable.OriginDraggable
 * @extends Moveable.OnEvent
 * @property - dragOrigin causes a `dragStart` event.
 */
export interface OnDragOriginStart extends OnEvent {
    dragStart: OnDragStart | false;
}

/**
 * @typedef
 * @memberof Moveable.OriginDraggable
 * @extends Moveable.OnEvent
 * @property - Offset width of target
 * @property - Offset height of target
 * @property - The delta of [x, y]
 * @property - The distance of [x, y]
 * @property - The target's moved transform-origin poses
 * @property - The target's moved transform-origin css
 * @property - `dragOrigin` causes a `drag` event.
 */
export interface OnDragOrigin extends OnEvent {
    width: number;
    height: number;
    delta: number[];
    dist: number[];
    origin: number[];
    transformOrigin: string;
    drag: OnDrag;
}
/**
 * @typedef
 * @memberof Moveable.OriginDraggable
 * @extends Moveable.OnEndEvent
 */
export interface OnDragOriginEnd extends OnEndEvent {
}

/**
 * @typedef
 * @memberof Moveable.Roundable
 * @extends Moveable.OnEvent
 */
export interface OnRoundStart extends OnEvent { }

/**
 * @typedef
 * @memberof Moveable.Roundable
 * @extends Moveable.OnEvent
 * @property - Offset width of target
 * @property - Offset height of target
 * @property - The delta of [x, y]
 * @property - The distance of [x, y]
 * @property - The target's moved border-radius's horizontal poses
 * @property - The target's moved border-radius's vertical poses
 * @property - The target's moved border-radius
 */
export interface OnRound extends OnEvent {
    width: number;
    height: number;
    delta: number[];
    dist: number[];
    horizontals: number[];
    verticals: number[];
    borderRadius: string;
}
/**
 * @typedef
 * @memberof Moveable.Roundable
 * @extends Moveable.OnEndEvent
 */
export interface OnRoundEnd extends OnEndEvent {
}
/**
 * @typedef
 * @memberof Moveable.Scalable
 * @extends Moveable.OnEvent
 * @extends Moveable.OnTransformStartEvent
 * @property - The direction of scale.
 * @property - scale causes a `dragStart` event.
 * @property - You can set the start scale value.
 * @property - Set a fixed direction to resize. (default: Opposite direction)
 * @property - Set the ratio of width and height. (default: offsetWidth / offsetHeight)
 */
export interface OnScaleStart extends OnEvent, OnTransformStartEvent {
    direction: number[];
    dragStart: OnDragStart | false;
    set: (scale: number[]) => void;
    setFixedDirection: (fixedDirection: number[]) => void;
    setRatio: (ratio: number) => any;
}
/**
 * @typedef
 * @memberof Moveable.Scalable
 * @extends Moveable.OnEvent
 * @extends Moveable.OnTransformEvent
 * @property - The direction of scale.
 * @property - a target's offsetWidth
 * @property - a target's offsetHeight
 * @property - a target's scale
 * @property - The distance of scale
 * @property - The delta of scale
 *
 * @property - Whether or not it is being pinched.
 */
export interface OnScale extends OnEvent, OnTransformEvent {
    direction: number[];
    offsetWidth: number;
    offsetHeight: number;

    scale: number[];
    dist: number[];
    delta: number[];

    isPinch: boolean;
}
/**
 * @typedef
 * @memberof Moveable.Scalable
 * @extends Moveable.OnEndEvent
 */
export interface OnScaleEnd extends OnEndEvent {
}

/**
 * @typedef
 * @memberof Moveable.Resizable
 * @extends Moveable.OnEvent
 * @property - The direction of resize.
 * @property - resize causes a `dragStart` event.
 * @property - You can set the css width, height value.
 * @property - You can set the css min width, min height value. (default: min-width)
 * @property - You can set the css max width, max height value. (default: max-width)
 * @property - You can set the css origin (default: % %)
 * @property - Set a fixed direction to resize. (default: Opposite direction)
 * @property - Set the ratio of width and height. (default: offsetWidth / offsetHeight)
 */
export interface OnResizeStart extends OnEvent {
    direction: number[];
    dragStart: OnDragStart | false;
    set: (size: number[]) => any;
    setMin: (minSize: number[]) => any;
    setMax: (maxSize: number[]) => any;
    setOrigin: (origin: Array<string | number>) => any;
    setFixedDirection: (startDirecition: number[]) => any;
    setRatio: (ratio: number) => any;
}
/**
 * @typedef
 * @memberof Moveable.Resizable
 * @extends Moveable.OnEvent
 * @property - The direction of resize.
 * @property - a target's cssWidth
 * @property - a target's cssHeight
 * @property - a target's offsetWidth
 * @property - a target's offsetHeight
 * @property - The distance of [width, height]
 * @property - The delta of [width, height]
 * @property - Whether or not it is being pinched.
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
 * @memberof Moveable.Resizable
 * @extends Moveable.OnEndEvent
 */
export interface OnResizeEnd extends OnEndEvent {
}
/**
 * @typedef
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnEvent
 * @extends Moveable.OnTransformStartEvent
 * @property - You can set the start rotate value.
 * @property - rotate causes a `dragStart` event.
 */
export interface OnRotateStart extends OnEvent, OnTransformStartEvent {
    set: (rotate: number) => void;
    dragStart: OnDragStart | false;
}
/**
 * @typedef
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnEvent
 * @extends Moveable.OnTransformEvent
 * @property - The distance of rotation rad before transform is applied
 * @property - The delta of rotation rad before transform is applied
 * @property - The now rotation rad before transform is applied
 * @property - The distance of rotation rad
 * @property - The delta of rotation rad
 * @property - The now rotation rad
 * @property - a target's transform
 * @property - Whether or not it is being pinched.
 * @property - rotate causes a `drag` event.
 */
export interface OnRotate extends OnEvent {
    beforeDist: number;
    beforeDelta: number;
    beforeRotate: number;

    dist: number;
    delta: number;
    rotate: number;

    absoluteDist: number;
    absoluteDelta: number;
    absoluteRotate: number;

    transform: string;
    isPinch: boolean;
    drag: OnDrag;
}
/**
 * @typedef
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnEndEvent
 */
export interface OnRotateEnd extends OnEndEvent { }

/**
 * @typedef
 * @memberof Moveable.Warpable
 * @extends Moveable.OnEvent
 * @extends Moveable.OnTransformStartEvent
 * @property - You can set the start matrix value.
 */
export interface OnWarpStart extends OnEvent, OnTransformStartEvent {
    set: (matrix: number[]) => any;
}
/**
 * @typedef
 * @memberof Moveable.Warpable
 * @extends Moveable.OnEvent
 * @property - a target's transform
 * @property - The delta of warp matrix
 * @property - The dist of warp matrix
 * @property - The calculated warp matrix
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
 * @memberof Moveable.Warpable
 * @extends Moveable.OnEndEvent
 */
export interface OnWarpEnd extends OnEndEvent { }

/**
 * @typedef
 * @memberof Moveable.Draggable
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
 * @memberof Moveable.Draggable
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
 * @memberof Moveable.Draggable
 * @extends Moveable.OnDragEnd
 * @property - The drag finished targets
 */
export interface OnDragGroupEnd extends OnDragEnd {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable.Rotatable
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
 * @memberof Moveable.Rotatable
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
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnRotateEnd
 * @property - The rotate finished targets
 */
export interface OnRotateGroupEnd extends OnRotateEnd {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable.Resizable
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
 * @memberof Moveable.Resizable
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
 * @memberof Moveable.Resizable
 * @extends Moveable.OnResizeEnd
 * @property - The resize finished targets
 */
export interface OnResizeGroupEnd extends OnResizeEnd {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable.Scalable
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
 * @memberof Moveable.Scalable
 * @extends Moveable.OnScale
 * @property - The scaling targets
 * @property - Each `scale` & `drag` event on the targets
 */
export interface OnScaleGroup extends OnScale {
    targets: Array<HTMLElement | SVGElement>;
    events: OnScale[];
}

/**
 * @typedef
 * @memberof Moveable.Scalable
 * @extends Moveable.OnScaleEnd
 * @property - The scale finished targets
 */
export interface OnScaleGroupEnd extends OnScaleEnd {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable.Pinchable
 * @extends Moveable.OnPinchStart
 * @property - targets to pinch
 */
export interface OnPinchGroupStart extends OnPinchStart {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable.Pinchable
 * @extends Moveable.OnPinch
 * @property - targets to pinch
 */
export interface OnPinchGroup extends OnPinch {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable.Pinchable
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
    inputTarget: Element;
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
    targets: Element[];
    inputTarget: Element;
    isTarget: boolean;
    containsTarget: boolean;
    targetIndex: number;
    isDouble: boolean;
}

/**
 * @typedef - `beforeRenderStart` event occurs before the first start of all events.
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being pinched.
 * @property - Set your original transform.
 */
export interface OnBeforeRenderStart extends OnEvent {
    isPinch: boolean;
    setTransform(transform: string | string[]): any;
}

/**
 * @typedef - `beforeRender` event occurs before the dragging of all events.
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being pinched.
 */
export interface OnBeforeRender extends OnEvent {
    isPinch: boolean;
}

/**
 * @typedef - `beforeRenderEnd` event occurs before the end of all events.
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being dragged.
 * @property - Whether or not it is being pinched.
 */
export interface OnBeforeRenderEnd extends OnEvent {
    isPinch: boolean;
    isDrag: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnBeforeRenderStart
 * @property - targets set to group.
 * @property - children's `beforeRenderStart` events
 */
export interface OnBeforeRenderGroupStart extends OnBeforeRenderStart {
    targets: Array<HTMLElement | SVGElement>;
    events: OnBeforeRenderStart[];
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnBeforeRender
 * @property - targets set to group.
 * @property - children's `beforeRender` events
 */
export interface OnBeforeRenderGroup extends OnBeforeRender {
    targets: Array<HTMLElement | SVGElement>;
    events: OnBeforeRender[];
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnBeforeRenderEnd
 * @property - targets set to group.
 */
export interface OnBeforeRenderGroupEnd extends OnBeforeRenderEnd {
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef - `renderStart` event occurs at the first start of all events.
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being pinched.
 */
export interface OnRenderStart extends OnEvent {
    isPinch: boolean;
}

/**
 * @typedef - `render` event occurs before the target is drawn on the screen.
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being pinched.
 */
export interface OnRender extends OnEvent {
    isPinch: boolean;
}

/**
 * @typedef - `renderEnd` event occurs at the end of all events.
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being dragged.
 * @property - Whether or not it is being pinched.
 */
export interface OnRenderEnd extends OnEvent {
    isPinch: boolean;
    isDrag: boolean;
}

export type EventInterface<T extends IObject<any> = {}> = {
    [key in keyof T]?: (e: T[key]) => any;
};

/**
 * @typedef
 * @memberof Moveable.Scrollable
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
 * @memberof Moveable.Scrollable
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
 * @memberof Moveable.Draggable
 * @property - Whether or not target can be dragged. (default: false)
 * @property - throttle of x, y when drag. (default: 0)
 * @property - throttle of angle(degree) of x,y when drag. (default: 0)
 * @property - start angle(degree) of x,y for throttleDragRotate when drag. (default: 0)
 * @property - Whether to move by dragging the edge line
 */
export interface DraggableOptions {
    draggable?: boolean;
    throttleDrag?: number;
    throttleDragRotate?: number;
    startDragRotate?: number;
    edgeDraggable?: boolean;
}
export interface DraggableEvents {
    onDragStart: OnDragStart;
    onDrag: OnDrag;
    onDragEnd: OnDragEnd;

    onDragGroupStart: OnDragGroupStart;
    onDragGroup: OnDragGroup;
    onDragGroupEnd: OnDragGroupEnd;
}
export interface DraggableProps extends DraggableOptions, EventInterface<DraggableEvents> {
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
 * @property - Add padding around the target to increase the drag area. (default: null)
 */
export interface PaddingOptions {
    padding?: PaddingBox;
}
/**
 * @typedef
 * @memberof Moveable
 * @property - Whether or not the origin control box will be visible or not (default: true)
 */
export interface OriginOptions {
    origin?: boolean;
}
/**
 * @typedef
 * @memberof Moveable.OriginDraggable
 * @property - * Whether to drag origin (default: false)
 * @property - % Can be used instead of the absolute px (default: true)
 */
export interface OriginDraggableOptions {
    originDraggable?: boolean;
    originRelative?: boolean;
}
export interface OriginDraggableEvents {
    onDragOriginStart: OnDragOriginStart;
    onDragOrigin: OnDragOrigin;
    onDragOriginEnd: OnDragOriginEnd;
}
export interface OriginDraggableProps extends OriginDraggableOptions, EventInterface<OriginDraggableEvents> {
}

/**
 * @typedef
 * @memberof Moveable.Roundable
 * @property - Whether to show and drag border-radius
 * @property - % Can be used instead of the absolute px
 * @property - Minimum number of round controls. It moves in proportion by control. [horizontal, vertical] (default: [0, 0])
 * @property - Maximum number of round controls. It moves in proportion by control. [horizontal, vertical] (default: [4, 4])
 * @property - Whether you can add/delete round controls by double-clicking a line or control. (default: true)
 */
export interface RoundableOptions {
    roundable?: boolean;
    roundRelative?: boolean;
    minRoundControls?: number[];
    maxRoundControls?: number[];
    roundClickable?: boolean;
}

export interface RoundableEvents {
    onRoundStart: OnRoundStart;
    onRound: OnRound;
    onRoundEnd: OnRoundEnd;
}
export interface RoundableProps extends RoundableOptions, EventInterface<RoundableEvents> {
}

export interface RoundableState {
    borderRadiusState?: string;
}
/**
 * @typedef
 * @memberof Moveable.Resizable
 * @extends Moveable.RenderDirections
 * @property - Whether or not target can be resized. (default: false)
 * @property - throttle of width, height when resize. (default: 0)
 * @property - When resize or scale, keeps a ratio of the width, height. (default: false)
 */
export interface ResizableOptions extends RenderDirections {
    resizable?: boolean;
    throttleResize?: number;
    keepRatio?: boolean;
}
export interface ResizableEvents {
    onResizeStart: OnResizeStart;
    onResize: OnResize;
    onResizeEnd: OnResizeEnd;

    onResizeGroupStart: OnResizeGroupStart;
    onResizeGroup: OnResizeGroup;
    onResizeGroupEnd: OnResizeGroupEnd;
}
export interface ResizableProps extends ResizableOptions, EventInterface<ResizableEvents> {
}
/**
 * @typedef
 * @memberof Moveable.Scalable
 * @extends Moveable.RenderDirections
 * @property - Whether or not target can be scaled. (default: false)
 * @property - throttle of scaleX, scaleY when scale. (default: 0)
 * @property - When resize or scale, keeps a ratio of the width, height. (default: false)
 */
export interface ScalableOptions extends RenderDirections {
    scalable?: boolean;
    throttleScale?: number;
    keepRatio?: boolean;
}
export interface ScalableEvents {
    onScaleStart: OnScaleStart;
    onScale: OnScale;
    onScaleEnd: OnScaleEnd;

    onScaleGroupStart: OnScaleGroupStart;
    onScaleGroup: OnScaleGroup;
    onScaleGroupEnd: OnScaleGroupEnd;
}
export interface ScalableProps extends ScalableOptions, EventInterface<ScalableEvents> {
}

/**
 * @typedef
 * @memberof Moveable.Snappable
 */
export interface GapGuideline extends Guideline {
    renderPos: number[];
}

/**
 * @typedef
 * @memberof Moveable
 * @property - Set directions to show the control box. (default: false if rotatable, ["n", "nw", "ne", "s", "se", "sw", "e", "w"] otherwise)
 */
export interface RenderDirections {
    renderDirections?: boolean | string[];
}
/**
 * @typedef
 * @memberof Moveable.Rotatable
 * @extends Moveable.RenderDirections
 * @property - Whether or not target can be rotated. (default: false)
 * @property - You can specify the position of the rotation. (default: "top")
 * @property - throttle of angle(degree) when rotate. (default: 0)
 * @property - Set additional rotationTargets.
 */
export interface RotatableOptions extends RenderDirections {
    rotatable?: boolean;
    rotationPosition?:
    "top" | "bottom" | "left" | "right"
    | "top-right" | "top-left"
    | "bottom-right" | "bottom-left"
    | "left-top" | "left-bottom"
    | "right-top" | "right-bottom"
    | "none";
    throttleRotate?: number;
    rotationTarget?: MoveableRefType | ArrayFormat<MoveableRefType> | false;
}
export interface RotatableEvents {
    onRotateStart: OnRotateStart;
    onRotate: OnRotate;
    onRotateEnd: OnRotateEnd;

    onRotateGroupStart: OnRotateGroupStart;
    onRotateGroup: OnRotateGroup;
    onRotateGroupEnd: OnRotateGroupEnd;
}
export interface RotatableProps extends RotatableOptions, EventInterface<RotatableEvents> {
}
/**
 * @typedef
 * @memberof Moveable.Warpable
 * @property - Whether or not target can be warped. (default: false)
 * @property - Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
 */
export interface WarpableOptions {
    warpable?: boolean;
    renderDirections?: boolean | string[];
}

export interface WarpableEvents {
    onWarpStart: OnWarpStart;
    onWarp: OnWarp;
    onWarpEnd: OnWarpEnd;
}
export interface WarpableProps extends WarpableOptions, EventInterface<WarpableEvents> {
}

/**
 * @typedef
 * @memberof Moveable.Pinchable
 * @property - Whether or not target can be pinched with draggable, resizable, scalable, rotatable. (default: false)
 */
export interface PinchableOptions {
    pinchable?: boolean | Array<"rotatable" | "resizable" | "scalable">;
}
export interface PinchableEvents {
    onPinchStart: OnPinchStart;
    onPinch: OnPinch;
    onPinchEnd: OnPinchEnd;

    onPinchGroupStart: OnPinchGroupStart;
    onPinchGroup: OnPinchGroup;
    onPinchGroupEnd: OnPinchGroupEnd;
}
export interface PinchableProps
    extends PinchableOptions, ResizableProps, ScalableProps,
    RotatableProps, EventInterface<PinchableEvents> {
}

/**
 * @typedef
 * @memberof Moveable.Group
 * @property - Sets the initial rotation of the group. (default 0)
 * @property - Sets the initial transform origin of the group. (default "50% 50%")
 */
export interface GroupableOptions {
    defaultGroupRotate?: number;
    defaultGroupOrigin?: string;
    groupable?: boolean;
}


/**
 * @typedef
 * @memberof Moveable.IndividualGroup
 * @property - Create targets individually, not as a group.
 */
export interface IndividualGroupableOptions {
    individualGroupable?: boolean;
}

export interface IndividualGroupableProps extends IndividualGroupableOptions {
}

export interface GroupableProps extends GroupableOptions {
    targets?: Array<HTMLElement | SVGElement>;
    updateGroup?: boolean;
}

/**
 * @typedef
 * @memberof Moveable.Snappable
 * @property - Whether or not target can be snapped to the guideline. (default: false)
 * @property - When you drag, make the snap in the center of the target. (default: false)
 * @property - When you drag, make the snap in the horizontal guidelines. (default: true)
 * @property - When you drag, make the snap in the vertical guidelines. (default: true)
 * @property - When you drag, make the snap in the element guidelines. (default: true)
 * @property - When you drag, make the gap snap in the element guidelines. (default: true)
 * @property - Distance value that can snap to guidelines. (default: 5)
 * @property - snap distance digits (default: 0)
 * @property - Whether to show snap distance (default: true)
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
    elementGuidelines?: Array<ElementGuidelineValue | Element>;
    bounds?: BoundType;
    innerBounds?: InnerBoundType;
    snapDistFormat?: (distance: number) => number | string;
}

/**
 * @typedef
 * @memberof Moveable.Snappable
 * @property - guideline element
 * @property - Whether to snap the top of the element (default: true)
 * @property - Whether to snap the left of the element (default: true)
 * @property - Whether to snap the right of the element (default: true)
 * @property - Whether to snap the bottom of the element (default: true)
 * @property - Whether to update the guideline every render (default: false)
 * @property - class names to add to guideline (default: "")
 */
export interface ElementGuidelineValue {
    element: Element;
    top?: boolean;
    left?: boolean;
    right?: boolean;
    bottom?: boolean;
    refresh?: boolean;
    className?: string;
}
export interface SnappableEvents {
    onSnap: OnSnap;
}
export interface SnappableProps extends SnappableOptions, EventInterface<SnappableEvents> {
    onSnap?: (e: OnSnap) => any;
}

/**
 * @typedef
 * @memberof Moveable.Snappable
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
 * @memberof Moveable.Snappable
 */
export interface InnerBoundType {
    left: number;
    top: number;
    width: number;
    height: number;
}
/**
 * @typedef
 * @memberof Moveable.Snappable
 */
export interface BoundType {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
}
export interface SnappableState {
    staticGuidelines: Guideline[];
    elementGuidelineValues: ElementGuidelineValue[];
    guidelines: Guideline[];
    snapRenderInfo?: SnapRenderInfo | null;
    enableSnap: boolean;

}
export interface SnapRenderInfo {
    direction?: number[];
    snap?: boolean;
    center?: boolean;
    request?: boolean;
    externalPoses?: number[][];
    externalBounds?: BoundType | false | null;
}

/**
 * @typedef
 * @memberof Moveable.Scrollable
 * @property - Whether or not target can be scrolled to the scroll container (default: false)
 * @property - The container to which scroll is applied (default: container)
 * @property - Expand the range of the scroll check area. (default: 0)
 * @property - Sets a function to get the scroll position. (default: Function)
 */
export interface ScrollableOptions {
    scrollable?: boolean;
    scrollContainer?: MoveableRefType<HTMLElement>;
    scrollThreshold?: number;
    getScrollPosition?: (e: { scrollContainer: HTMLElement, direction: number[] }) => number[];
}
export interface ScrollableEvents {
    onScroll: OnScroll;
    onScrollGroup: OnScrollGroup;
}
export interface ScrollableProps extends ScrollableOptions, EventInterface<ScrollableEvents> {
}

/**
 * @typedef
 * @memberof Moveable
 * @property - Instead of firing an event on the target, we add it to the moveable control element. You can use click and clickGroup events. (default: if group, true, else false)
 * @property - Set `pointerEvents: none;` css to pass events in dragArea.
 */
export interface DragAreaOptions {
    dragArea?: boolean;
    passDragArea?: boolean;
}
export interface DragAreaProps extends DragAreaOptions {
}

export interface ClickableEvents {
    onClick: OnClick;
    onClickGroup: OnClickGroup;
}

export interface ArrayFormat<T = any> {
    length: number;
    [key: number]: T;
}
export interface ClickableProps extends EventInterface<ClickableEvents> {
}
export interface BeforeRenderableEvents {
    onBeforeRenderStart: OnBeforeRenderStart;
    onBeforeRender: OnBeforeRender;
    onBeforeRenderEnd: OnBeforeRenderEnd;
    onBeforeRenderGroupStart: OnBeforeRenderGroupStart;
    onBeforeRenderGroup: OnBeforeRenderGroup;
    onBeforeRenderGroupEnd: OnBeforeRenderGroupEnd;
}
export interface BeforeRenderableProps extends EventInterface<BeforeRenderableEvents> {
}
export interface RenderableEvents {
    onRenderStart: OnRenderStart;
    onRender: OnRender;
    onRenderEnd: OnRenderEnd;
    onRenderGroupStart: OnRenderGroupStart;
    onRenderGroup: OnRenderGroup;
    onRenderGroupEnd: OnRenderGroupEnd;
}
export interface RenderableProps extends EventInterface<RenderableEvents> {
}

/**
 * @typedef
 * @memberof Moveable.Clippable
 * @property - Whether to clip the target.
 * @property - You can force the custom clipPath. (defaultClipPath < style < customClipPath < dragging clipPath)
 * @property - If clippath is not set, the default value can be set. (defaultClipPath < style < customClipPath < dragging clipPath)
 * @property - % Can be used instead of the absolute px (`rect` not possible) (default: false)
 * @property - When dragging the target, the clip also moves. (default: true)
 * @property - You can drag the clip by setting clipArea. (default: false)
 * @property - Whether the clip is bound to the target. (default: false)
 * @property - Add clip guidelines in the vertical direction. (default: [])
 * @property - Add clip guidelines in the horizontal direction. (default: [])
 * @property - Distance value that can snap to clip guidelines. (default: 5)
 */
export interface ClippableOptions {
    clippable?: boolean;
    customClipPath?: string;
    defaultClipPath?: string;
    clipRelative?: boolean;
    dragWithClip?: boolean;
    clipArea?: boolean;
    clipTargetBounds?: boolean;
    clipVerticalGuidelines?: Array<string | number>;
    clipHorizontalGuidelines?: Array<string | number>;
    clipSnapThreshold?: number;
}
export interface ClippableEvents {
    onClipStart: OnClipStart;
    onClip: OnClip;
    onClipEnd: OnClipEnd;
}
export interface ClippableProps extends ClippableOptions, EventInterface<ClippableEvents> {
}
export interface ClippableState {
    clipPathState?: string;
    snapBoundInfos?: { vertical: Required<SnapBoundInfo>, horizontal: Required<SnapBoundInfo> } | null;
}

/**
 * @typedef
 * @memberof Moveable.Clippable
 * @extends Moveable.OnEvent
 * @property - The clip type.
 * @property - The control positions
 * @property - CSS style of changed clip
 */
export interface OnClipStart extends OnEvent {
    clipType: "polygon" | "circle" | "ellipse" | "inset" | "rect";
    poses: number[][];
    clipStyle: string;
}
/**
 * @typedef
 * @memberof Moveable.Clippable
 * @extends Moveable.OnEvent
 * @property - The clip type.
 * @property - The clip event type.
 * @property - The control positions
 * @property - x position of the distance the control has moved
 * @property - y position of the distance the control has moved
 * @property - CSS style of changed clip
 * @property - Splited CSS styles of changed clip
 */
export interface OnClip extends OnEvent {
    clipType: "polygon" | "circle" | "ellipse" | "inset" | "rect";
    clipEventType: "added" | "changed" | "removed";
    poses: number[][];
    distX: number;
    distY: number;
    clipStyle: string;
    clipStyles: string[];
}
/**
 * @typedef
 * @memberof Moveable.Clippable
 * @extends Moveable.OnEndEvent
 */
export interface OnClipEnd extends OnEndEvent { }

export interface OnCustomDrag extends GestoTypes.Position {
    type: string;
    inputEvent: any;
    isDrag: boolean;
    datas: IObject<any>;
    originalDatas: IObject<any>;
    parentEvent: boolean;
    parentGesto: CustomGesto;
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
 * @property - The absolute transform origin before transformation
 * @property - The target transform origin
 * @property - you can get the absolute rotation value
 * @property - If you use a group, you can get child moveables' rect info
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
    transformOrigin: number[];
    rotation: number;
    children?: RectInfo[];
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
export interface MoveableManagerInterface<T = {}, U = {}> extends MoveableInterface {
    moveables?: MoveableManagerInterface[];
    props: MoveableManagerProps<T>;
    state: MoveableManagerState<U>;
    rotation: number;
    scale: number[];
    controlGesto: Gesto;
    targetGesto: Gesto;
    enabledAbles: Able[];
    controlAbles: Able[];
    targetAbles: Able[];
    areaElement: HTMLElement;
    controlBox: {
        getElement(): HTMLElement,
    };
    isUnmounted: boolean;
    useCSS(tag: string, css: string): any;
    getContainer(): HTMLElement | SVGElement;
    getRotation(): number;
    forceUpdate(): any;
}
export interface MoveableGroupInterface<T = {}, U = {}> extends MoveableManagerInterface<T, U> {
    moveables: MoveableManagerInterface[];
    props: MoveableManagerProps<T> & { targets: Array<HTMLElement | SVGElement> };
    transformOrigin: string;
}
export interface MoveableInterface {
    getManager(): MoveableManagerInterface<any, any>;
    getRect(): RectInfo;
    isMoveableElement(target: Element): boolean;
    updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState?: boolean): void;
    updateTarget(): void;
    request(ableName: string, params?: IObject<any>, isInstant?: boolean): Requester;
    destroy(): void;
    dragStart(e: MouseEvent | TouchEvent): void;
    isInside(clientX: number, clientY: number): boolean;
    isDragging(): boolean;
    hitTest(el: Element | HitRect): number;
    setState(state: any, callback?: () => any): any;
}

export interface ControlPose {
    vertical: number;
    horizontal: number;
    pos: number[];
    sub?: boolean;
    raw?: number;
    direction?: "n" | "e" | "s" | "w" | "nw" | "ne" | "sw" | "se" | "nesw";
}

export type AnyProps<T extends IObject<any>> = Required<{ [key in keyof T]: any }>;
export type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// export type MoveableEventsProps = Parameters<Required<MoveableProps>[keyof typeof MOVEABLE_EVENTS_PROPS_MAP]>[0];
export type MoveableEvents = {
    [key in keyof typeof MOVEABLE_EVENTS_MAP]: Parameters<Required<MoveableProps>[typeof MOVEABLE_EVENTS_MAP[key]]>[0];
};

export type MoveableProperties = {
    -readonly [key in keyof typeof MOVEABLE_PROPS_MAP]: MoveableProps[key];
};

export interface SnappableRenderType {
    type: "snap" | "bounds";
    pos: number;
}
