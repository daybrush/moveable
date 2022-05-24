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
 */
export interface DefaultOptions {
    /**
     * The target(s) to indicate Moveable Control Box.
     * @default null
     */
    target?: SVGElement | HTMLElement | null;
    /**
     * The target(s) to drag Moveable target(s)
     * @default target
     */
    dragTarget?: SVGElement | HTMLElement | null;
    /**
     * Moveable Container. Don't set it.
     * @private
     * @default parentElement
     */
    container?: SVGElement | HTMLElement | null;
    /**
     * Moveable Portal Container to support other frameworks. Don't set it.
     * @private
     * @default parentElement
     */
    portalContainer?: HTMLElement | null;
    /**
     * Moveable Root Container (No Transformed Container)
     * @default parentElement
     */
    rootContainer?: HTMLElement | null;
    /**
     * Whether the target size is detected and updated whenever it changes.
     * @default false
     */
    useResizeObserver?: boolean;
    /**
     * Zooms in the elements of a moveable.
     * @default 1
     */
    zoom?: number;
    /**
     * The default transformOrigin of the target can be set in advance.
     * @default ""
     */
    transformOrigin?: Array<string | number> | string | "";
    /**
     * Whether to scale and resize through edge lines.
     * @default false
     */
    edge?: boolean;
    /**
     * You can add your custom able.
     * @default []
     */
    ables?: Able[];
    /**
     * You can specify the className of the moveable controlbox.
     * @default ""
     */
    className?: string;
    /**
     * Minimum distance to pinch.
     * @default 20
     */
    pinchThreshold?: number;
    /**
     * Whether the container containing the target becomes a pinch.
     * @default true
     */
    pinchOutside?: boolean;
    /**
     * Lets generate events of ables at the same time. (like Resizable, Scalable)
     * @default false
     */
    triggerAblesSimultaneously?: boolean;
    /**
     * Checks whether this is an element to input text or contentEditable, and prevents dragging.
     * @default false
     */
    checkInput?: boolean;
    /**
     * add nonce property to style for CSP.
     * @deprecated
     * @default ""
     */
    cspNonce?: string;
    /**
     * You can set the translateZ value of moveable.
     * @default 50
     */
    translateZ?: number | string;
    /**
     * Whether to hide the line corresponding to the rect of the target.
     * @default false
     */
    hideDefaultLines?: boolean;
    /**
     * You can use props in object format or custom props.
     * @default empty object
     */
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
export interface MatrixInfo {
    type: "offset" | "target";
    target: SVGElement | HTMLElement;
    matrix?: number[];
    origin?: number[];
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
    disableNativeEvent: boolean;
    pos1: number[];
    pos2: number[];
    pos3: number[];
    pos4: number[];
    gesto: Gesto | CustomGesto | null;
    targetClientRect: MoveableClientRect;
    containerClientRect: MoveableClientRect;
    moveableClientRect: MoveableClientRect;
    rotation: number;

    hasFixed: boolean;
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
export interface SnapGuideline {
    type: "horizontal" | "vertical";
    hide?: boolean;
    element?: Element | null;

    isStart?: boolean;
    isEnd?: boolean;
    isCenter?: boolean;
    isInner?: boolean;

    pos: number[];
    size: number;
    className?: string;
    sizes?: number[];

    gap?: number;
    elementRect?: SnapElementRect;
    gapRects?: SnapElementRect[];
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
    guideline: SnapGuideline;
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
export type ExcludeKeys<T extends IObject<any>, U> = Pick<T, Exclude<keyof T, U>>;

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
    ExcludeKeys<GroupableProps, "targets" | "updateGroup">,
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
export interface MoveableDefaultProps extends ExcludeKeys<MoveableDefaultOptions, "target"> {
    target?: MoveableRefType | ArrayFormat<MoveableRefType>;
}
/**
 * @memberof Moveable
 * @typedef
 */
export type MoveableRefType<T extends Element = HTMLElement | SVGElement>
    = string | (() => T) | MoveableRefObject<T> | T | null | undefined;
/**
 * @memberof Moveable
 * @typedef
 */
export interface MoveableRefObject<T extends Element = HTMLElement | SVGElement> {
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
 * @extends Moveable.Group.GroupableOptions
 * @extends Moveable.OriginDraggable.OriginDraggableOptions
 * @extends Moveable.Scrollable.ScrollableOptions
 * @extends Moveable.Clippable.ClippableOptions
 * @extends Moveable.Roundable.RoundableOptions
 * @extends Moveable.Clickable.ClickableOptions
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
    RoundableOptions,
    ClickableOptions {
}

export type MoveableState = MoveableManagerState;

/**
 * You can make Able that can work in Moveable.
 * @typedef
 * In Able, you can manage drag events, props, state, fire event props, and render elements.
 * @memberof Moveable
 */
export interface Able<Props extends IObject<any> = IObject<any>, Events extends IObject<any> = IObject<any>> {
    name: string;
    props?: { [key in keyof Props]: any };
    events?: { [key in keyof Events]: string };
    // Whether to always include in able. It is recommended to use always in frameworks other than react
    always?: boolean;
    ableGroup?: string;
    updateRect?: boolean;
    canPinch?: boolean;
    css?: string[];
    dragRelation?: "strong" | "weak" | undefined | null | false,
    /**
     * Fired when the event is cleared
     */
    unset?(moveable: any): any;
    /**
     * Renders the React DOM structure for the able.
     */
    render?(moveable: any, renderer: Renderer): any;

    // Operates when a drag event occurs for the single target.
    dragStart?(moveable: any, e: GestoTypes.OnDragStart): any;
    drag?(moveable: any, e: GestoTypes.OnDrag): any;
    dragEnd?(moveable: any, e: GestoTypes.OnDragEnd): any;
    dragAfter?(moveable: any, e: GestoTypes.OnDrag): any;

    // Operates when a pinch event occurs for the single target.
    pinchStart?(moveable: any, e: GestoTypes.OnPinchStart): any;
    pinch?(moveable: any, e: GestoTypes.OnPinch): any;
    pinchEnd?(moveable: any, e: GestoTypes.OnPinchEnd): any;

    // Condition that occurs dragControl
    dragControlCondition?(moveable: any, e: any): boolean;
    // Operates when a drag event occurs for the moveable control and single target.
    dragControlStart?(moveable: any, e: GestoTypes.OnDragStart): any;
    dragControl?(moveable: any, e: GestoTypes.OnDrag): any;
    dragControlEnd?(moveable: any, e: GestoTypes.OnDragEnd): any;
    dragControlAfter?(moveable: any, e: GestoTypes.OnDrag): any;

    // Condition that occurs dragGroup
    dragGroupCondition?(moveable: any, e: any): boolean;
    // Operates when a drag event occurs for the multi target.
    dragGroupStart?(moveable: any, e: GestoTypes.OnDragStart): any;
    dragGroup?(moveable: any, e: GestoTypes.OnDrag): any;
    dragGroupEnd?(moveable: any, e: GestoTypes.OnDragEnd): any;

    // Operates when a pinch event occurs for the multi target.
    pinchGroupStart?(moveable: any, e: GestoTypes.OnPinchStart): any;
    pinchGroup?(moveable: any, e: GestoTypes.OnPinch): any;
    pinchGroupEnd?(moveable: any, e: GestoTypes.OnPinchEnd): any;

    // Condition that occurs dragGroupControl
    dragGroupControlCondition?(moveable: any, e: any): boolean;

    // Operates when a drag event occurs for the moveable control and multi target.
    dragGroupControlStart?(moveable: any, e: GestoTypes.OnDragStart): any;
    dragGroupControl?(moveable: any, e: GestoTypes.OnDragStart): any;
    dragGroupControlEnd?(moveable: any, e: GestoTypes.OnDragEnd): any;

    // mouse enter event
    mouseEnter?(moveable: any, e: any): any;
    // mouse leave event
    mouseLeave?(moveable: any, e: any): any;

    // mouse enter event for group
    mouseGroupEnter?(moveable: any, e: any): any;
    // mouse leave event for group
    mouseGroupLeave?(moveable: any, e: any): any;


    // Execute the operation of able for external request
    request?(moveable: any): AbleRequester;
}

/**
 * @typedef
 * @memberof Moveable
 */
export interface OnEvent {
    /**
     * The Moveable instance
     */
    currentTarget: MoveableManagerInterface<any, any>;
    /**
     * The Moveable instance
     */
    moveable: MoveableManagerInterface<any, any>;
    /**
     * The Moveable's target
     */
    target: HTMLElement | SVGElement;
    /**
     * The horizontal coordinate within the application's client area at which the event occurred.
     */
    clientX: number;
    /**
     * The vertical coordinate within the application's client area at which the event occurred.
     */
    clientY: number;
    /**
     * Objects that can send information to the following events.
     */
    datas: IObject<any>;
    /**
     * The mouse or touch input event that is invoking the moveable event
     */
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
 */
export interface OnTransformStartEvent {
    /**
     * Set your original transform.
     * `transformIndex` is the sequence of functions used in the event.
     * If you use `setTransform`, you don't need to use `set` function.
     * @default transform of target's inline style
     */
    setTransform(transform: string | string[], transformIndex?: number): void;
    /**
     * `transformIndex` is the sequence of functions used in the event.
     * @default index with that property in transform or last
     */
    setTransformIndex(transformIndex: number): void;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OnTransformEvent {
    /**
     * a target's next transform string value.
     */
    transform: string;
    /**
     * transform events causes a `drag` event.
     */
    drag: OnDrag;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface AbleRequestParam {
    /**
     * Run the request instantly. (requestStart, request, requestEnd happen at the same time)
     */
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
export interface Requester<RequestParam extends {} = AbleRequestParam> {
    request(param: RequestParam): this;
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
 * When the drag starts, the dragStart event is called.
 * @typedef
 * @memberof Moveable.Draggable
 * @extends Moveable.OnEvent
 * @extends Moveable.OnTransformStartEvent
 */
export interface OnDragStart extends OnEvent, OnTransformStartEvent {
    /**
     * You can set the start translate value.
     */
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
 * @property - a target's offset width
 * @property - a target's offset height
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
 */
export interface OnScaleStart extends OnEvent, OnTransformStartEvent {
    /**
     * The direction of scale.
     */
    direction: number[];
    /**
     * scale causes a `dragStart` event.
     */
    dragStart: OnDragStart | false;
    /**
     * You can set the start scale value.
     */
    set: (scale: number[]) => void;
    /**
     * Set a fixed direction to scale.
     * @default Opposite direction
     */
    setFixedDirection: (startDirecition: number[]) => void;
    /**
     * Set the ratio of width and height.
     * @default offsetWidth / offsetHeight
     */
    setRatio: (ratio: number) => any;
}

/**
 * @typedef
 * @memberof Moveable.Scalable
 * @extends Moveable.OnEvent
 */
export interface OnBeforeScale extends OnEvent {
    /**
     * Set a fixed direction to scale.
     * If fixedDirection is set, the scale values can be changed and can be reconfirmed as a return value.
     */
    setFixedDirection: (startDirecition: number[]) => number[];
    /**
     * Set target's scale to scaling.
     */
    setScale: (scale: number[]) => void;
    /**
     * a target's scale before snap and throttle and format
     */
    scale: number[];
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
 */
export interface OnBeforeResize extends OnEvent {
    /**
     * Set a fixed direction to resize.
     * If fixedDirection is set, the boundingWidth and boundingHeight values can be changed and can be reconfirmed as a return value.
     */
    setFixedDirection: (startDirecition: number[]) => number[];
    /**
     * Set the bounding size to resizing.
     */
    setSize: (size: number[]) => void;
    /**
     * a target's bounding width before snap and throttle and format
     */
    boundingWidth: number;
    /**
     * a target's bounding height before snap and throttle and format
     */
    boundingHeight: number;
}

/**
 * @typedef
 * @memberof Moveable.Resizable
 * @extends Moveable.OnEvent
 * @property - The direction of resize.
 * @property - a target's cssWidth
 * @property - a target's cssHeight
 * @property - a target's offset width as an integer with bounding width
 * @property - a target's offset height as an integer with bounding height
 * @property - a target's bounding width
 * @property - a target's bounding height
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
    boundingWidth: number;
    boundingHeight: number;
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
 */
export interface OnRotateStart extends OnEvent, OnTransformStartEvent {
    /**
     * You can set the start rotate value.
     */
    set: (rotate: number) => void;
    /**
     * rotate causes a `dragStart` event.
     */
    dragStart: OnDragStart | false;
}
/**
 * @typedef
 * @description Parameters for the `beforeRotate` event
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnEvent
 */
export interface OnBeforeRotate extends OnEvent {
    /**
     * The rotation degree before transform is applied before snap and throttle and format
     */
    beforeRotation: number;
    /**
     * The rotation degree before snap and throttle and format
     */
    rotation: number;
    /**
     * The client rotation degree before snap and throttle and format
     */
    absoluteRotation: number;
    /**
     * You can set the value of `rotation`.
     */
    setRotation(nextRotation: number): void;
}


/**
 * @typedef
 * @description Parameters for the `rotate` event
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnEvent
 * @extends Moveable.OnTransformEvent
 */
export interface OnRotate extends OnEvent {
    /**
     * The distance of rotation degree before transform is applied
     */
    beforeDist: number;
    /**
     * The delta of rotation degree before transform is applied
     */
    beforeDelta: number;
    /**
     * The now rotation degree before transform is applied
     * @deprecated
     */
    beforeRotate: number;
    /**
     * The now rotation degree before transform is applied
     */
    beforeRotation: number;
    /**
     * The distance of rotation degree
     */
    dist: number;
    /**
     * The delta of rotation degree
     */
    delta: number;
    /**
     * The now rotation degree
     * @deprecated
     */
    rotate: number;
    /**
     * The now rotation degree
     */
    rotation: number;
    /**
     * The distance of client rotation degree
     */
    absoluteDist: number;
    /**
     * The delta of client rotation degree
     */
    absoluteDelta: number;
    /**
     * The now client rotation degree
     * @deprecated
     */
    absoluteRotate: number;
    /**
     * The now client rotation degree
     */
    absoluteRotation: number;
    /**
     * a target's transform
     */
    transform: string;
    /**
     * Whether or not it is being pinched.
     */
    isPinch: boolean;
    /**
     * rotate causes a `drag` event.
     */
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
 * @property - Each `dragEnd` event on the targets
 */
export interface OnDragGroupEnd extends OnDragEnd {
    targets: Array<HTMLElement | SVGElement>;
    events: OnDragEnd[];
}

/**
 * @typedef
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnRotateStart
 * @property - targets to rotate
 * @property - Each `rotateStart` event on the targets
 */
export interface OnRotateGroupStart extends OnRotateStart {
    targets: Array<HTMLElement | SVGElement>;
    events: OnRotateStart[];
}

/**
 * @typedef
 * @description Parameters for the `beforeRotateGroup` event
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnBeforeRotate
 */
export interface OnBeforeRotateGroup extends OnBeforeRotate {
    /**
     * The rotating targets
     */
    targets: Array<HTMLElement | SVGElement>;
}
/**
 * @typedef
 * @description Parameters for the `rotateGroup` event
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnRotate
 */
export interface OnRotateGroup extends OnRotate {
    /**
     * The rotating targets
     */
    targets: Array<HTMLElement | SVGElement>;
    /**
     * Each `rotate` event on the targets
     */
    events: OnRotate[];
    /**
     * You can set the group's rotation.
     * @deprecated
     */
    set: (rotation: number) => any;
    /**
     * You can set the group's rotation.
     */
    setGroupRotation: (rotation: number) => any;
}

/**
 * @typedef
 * @memberof Moveable.Rotatable
 * @extends Moveable.OnRotateEnd
 * @property - The rotate finished targets
 * @property - Each `rotateEnd` event on the targets
 */
export interface OnRotateGroupEnd extends OnRotateEnd {
    targets: Array<HTMLElement | SVGElement>;
    events: OnRotateEnd[];
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
 * @extends Moveable.OnBeforeResize
 */
export interface OnBeforeResizeGroup extends OnBeforeResize {
    /**
     * The resizing targets
     */
    targets: Array<HTMLElement | SVGElement>;
}

/**
 * @typedef
 * @memberof Moveable.Resizable
 * @extends Moveable.OnResize
 * @property - The resizing targets
 * @property - Each `resize`event on the targets
 */
export interface OnResizeGroup extends OnResize {
    targets: Array<HTMLElement | SVGElement>;
    events: OnResize[];
}

/**
 * @typedef
 * @memberof Moveable.Resizable
 * @extends Moveable.OnResizeEnd
 * @property - The resize finished targets
 * @property - Each `resizeEnd` event on the targets
 */
export interface OnResizeGroupEnd extends OnResizeEnd {
    targets: Array<HTMLElement | SVGElement>;
    events: OnResizeEnd[];
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
 * @extends Moveable.OnBeforeScale
 * @property - The scaling targets
 */
export interface OnBeforeScaleGroup extends OnBeforeScale {
    targets: Array<HTMLElement | SVGElement>;
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
 * @property - Each `scaleEnd` event on the targets
 */
export interface OnScaleGroupEnd extends OnScaleEnd {
    targets: Array<HTMLElement | SVGElement>;
    events: OnScaleEnd[];
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
 * `beforeRenderStart` event occurs before the first start of all events.
 * @typedef
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
 * `beforeRender` event occurs before the dragging of all events.
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being pinched.
 */
export interface OnBeforeRender extends OnEvent {
    isPinch: boolean;
}

/**
 * `beforeRenderEnd` event occurs before the end of all events.
 * @typedef
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
 * `renderStart` event occurs at the first start of all events.
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - Whether or not it is being pinched.
 */
export interface OnRenderStart extends OnEvent {
    isPinch: boolean;
}

/**
 * `render` event occurs before the target is drawn on the screen.
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnEvent
 * @property - a target's next transform string value.
 * @property - Whether or not it is being pinched.
 */
export interface OnRender extends OnEvent {
    transform: string;
    isPinch: boolean;
}

/**
 * `renderEnd` event occurs at the end of all events.
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
 * @property - Each `render` event on the targets
 */
export interface OnRenderGroup extends OnRender {
    targets: Array<HTMLElement | SVGElement>;
    events: OnRender[];
}

/**
 * @typedef
 * @memberof Moveable
 * @extends Moveable.OnRenderEnd
 * @property - targets set to group.
 * @property - Each `renderEnd` event on the targets
 */
export interface OnRenderGroupEnd extends OnRenderEnd {
    targets: Array<HTMLElement | SVGElement>;
    events: OnRenderEnd[];
}

/**
 * @typedef
 * @memberof Moveable.Draggable
 */
export interface DraggableOptions {
    /**
     * Whether or not target can be dragged.
     * @default false
     */
    draggable?: boolean;
    /**
     * throttle of x, y when drag.
     * @default 0
     */
    throttleDrag?: number;
    /**
     * throttle of angle(degree) of x,y when drag.
     * @default 0
     */
    throttleDragRotate?: number;
    /**
     * start angle(degree) of x,y for throttleDragRotate when drag.
     * @default 0
     */
    startDragRotate?: number;
    /**
     * Whether to move by dragging the edge line
     * @default false
     */
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
 */
export interface PaddingOptions {
    /**
     * Add padding around the target to increase the drag area.
     * @default null
     */
    padding?: PaddingBox;
}
/**
 * @typedef
 * @memberof Moveable
 */
export interface OriginOptions {
    /**
     * Whether or not the origin control box will be visible or not.
     * @default true
     */
    origin?: boolean;
}
/**
 * @typedef
 * @memberof Moveable.OriginDraggable
 */
export interface OriginDraggableOptions {
    /**
     * Whether to drag origin.
     * @default false
     */
    originDraggable?: boolean;
    /**
     * % Can be used instead of the absolute px.
     * @default true
     */
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
 */
export interface RoundableOptions {
    /**
     * Whether to show and drag border-radius.
     * @default false
     */
    roundable?: boolean;
    /**
     * % Can be used instead of the absolute px
     * @default false
     */
    roundRelative?: boolean;
    /**
     * Minimum number of round controls. It moves in proportion by control. [horizontal, vertical]
     * @default [0, 0]
     */
    minRoundControls?: number[];
    /**
     * Maximum number of round controls. It moves in proportion by control. [horizontal, vertical]
     * @default [4, 4]
     */
    maxRoundControls?: number[];
    /**
     * Whether you can add/delete round controls by double-clicking a line or control.
     * @default true
     */
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
 */
export interface ResizableOptions extends RenderDirections {
    /**
     * Whether or not target can be resized.
     * @default false
     */
    resizable?: boolean;
    /**
     * throttle of width, height when resize.
     * @default 1
     */
    throttleResize?: number;
    /**
     * When resize or scale, keeps a ratio of the width, height.
     * @default false
     */
    keepRatio?: boolean;
    /**
     * Function to convert size for resize.
     * @default oneself
     */
    resizeFormat?: (size: number[]) => number[];
}
/**
 * @typedef
 * @memberof Moveable.Resizable
 * @extends Moveable.AbleRequestParam
 * @description the Resizable's request parameter
 */
export interface ResizableRequestParam extends AbleRequestParam {
    /**
     * Direction to resize
     * @default [1, 1]
     */
    direction?: number[];
    /**
     * Whether to force keepRatio to resize
     */
    keepRatio?: boolean;
    /**
     * delta number of width
     */
    deltaWidth?: number;
    /**
     * delta number of height
     */
    deltaHeight?: number;
    /**
     * offset number of width
     */
    offsetWidth?: number;
    /**
     * offset number of height
     */
    offsetHeight?: number;
}

export interface ResizableEvents {
    onResizeStart: OnResizeStart;
    onBeforeResize: OnBeforeResize;
    onResize: OnResize;
    onResizeEnd: OnResizeEnd;

    onResizeGroupStart: OnResizeGroupStart;
    onBeforeResizeGroup: OnBeforeResizeGroup;
    onResizeGroup: OnResizeGroup;
    onResizeGroupEnd: OnResizeGroupEnd;
}

export interface ResizableProps extends ResizableOptions, EventInterface<ResizableEvents> {
}

/**
 * @typedef
 * @memberof Moveable.Scalable
 * @extends Moveable.RenderDirections
 */
export interface ScalableOptions extends RenderDirections {
    /**
     * Whether or not target can be scaled.
     * @default false
     */
    scalable?: boolean;
    /**
     * throttle of scaleX, scaleY when scale.
     * @default 0
     */
    throttleScale?: number;
    /**
     * When resize or scale, keeps a ratio of the width, height.
     * @default false
     */
    keepRatio?: boolean;
}


/**
 * @typedef
 * @memberof Moveable.Scalable
 * @extends Moveable.AbleRequestParam
 * @description the Scalable's request parameter
 */
export interface ScalableRequestParam extends AbleRequestParam {
    /**
     * Direction to scale
     * @default [1, 1]
     */
    direction?: number[];
    /**
     * Whether to force keepRatio to resize
     */
    keepRatio?: boolean;
    /**
     * delta number of width
     */
    deltaWidth?: number;
    /**
     * delta number of height
     */
    deltaHeight?: number;
}
export interface ScalableEvents {
    onScaleStart: OnScaleStart;
    onBeforeScale: OnBeforeScale;
    onScale: OnScale;
    onScaleEnd: OnScaleEnd;

    onScaleGroupStart: OnScaleGroupStart;
    onBeforeScaleGroup: OnBeforeScaleGroup;
    onScaleGroup: OnScaleGroup;
    onScaleGroupEnd: OnScaleGroupEnd;
}
export interface ScalableProps extends ScalableOptions, EventInterface<ScalableEvents> {
}

/**
 * @typedef
 * @memberof Moveable.Snappable
 */
export interface GapGuideline extends SnapGuideline {
    renderPos: number[];
    inner?: boolean;
}

/**
 * @typedef
 * @memberof Moveable
 */
export interface RenderDirections {
    /**
     * Set directions to show the control box.
     * @default false if rotatable, ["n", "nw", "ne", "s", "se", "sw", "e", "w"] otherwise
     */
    renderDirections?: boolean | string[];
}
/**
 * @typedef
 * @memberof Moveable.Rotatable
 * @extends Moveable.RenderDirections
 */
export interface RotatableOptions extends RenderDirections {
    /**
     * Whether or not target can be rotated.
     * @default false
     */
    rotatable?: boolean;
    /**
     * You can specify the position of the rotation.
     * @default "top"
     */
    rotationPosition?:
    "top" | "bottom" | "left" | "right"
    | "top-right" | "top-left"
    | "bottom-right" | "bottom-left"
    | "left-top" | "left-bottom"
    | "right-top" | "right-bottom"
    | "none";
    /**
     * throttle of angle(degree) when rotate.
     * @default 0
     */
    throttleRotate?: number;
    /**
     * Set additional rotationTargets.
     * @default null
     */
    rotationTarget?: MoveableRefType | ArrayFormat<MoveableRefType> | false;
}
export interface RotatableEvents {
    onRotateStart: OnRotateStart;
    onBeforeRotate: OnBeforeRotate;
    onRotate: OnRotate;
    onRotateEnd: OnRotateEnd;

    onRotateGroupStart: OnRotateGroupStart;
    onBeforeRotateGroup: OnBeforeRotateGroup;
    onRotateGroup: OnRotateGroup;
    onRotateGroupEnd: OnRotateGroupEnd;
}
export interface RotatableProps extends RotatableOptions, EventInterface<RotatableEvents> {
}
/**
 * @typedef
 * @memberof Moveable.Warpable
 */
export interface WarpableOptions {
    /**
     * Whether or not target can be warped.
     * @default false
     */
    warpable?: boolean;
    /**
     * Set directions to show the control box.
     * @default ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
     */
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
 */
export interface PinchableOptions {
    /**
     * Whether or not target can be pinched with draggable, resizable, scalable, rotatable.
     * @default false
     */
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
 */
export interface GroupableOptions {
    /**
     * Sets the initial rotation of the group.
     * @default 0
     * @deprecated
     */
    defaultGroupRotate?: number;
    /**
     * Sets the initial transform origin of the group.
     * @default  "50% 50%"
     */
    defaultGroupOrigin?: string;
    /**
     * @private
     */
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
 */
export interface SnappableOptions {
    /**
     * Whether or not target can be snapped to the guideline.
     * @default false
     */
    snappable?: boolean | string[];
    /**
     * A snap container that is the basis for snap, bounds, and innerBounds.
     * @default null
     */
    snapContainer?: MoveableRefType<HTMLElement | SVGElement>;
    /**
     * You can specify the directions to snap to the target.
     * @default true (true is all directions)
     */
    snapDirections?: boolean | SnapDirections;
    /**
     * You can specify the snap directions of elements.
     * @default true (true is all directions)
     */
    elementSnapDirections?: boolean | SnapDirections;
    /**
     * When you drag, make the gap snap in the element guidelines.
     * @default true
     */
    snapGap?: boolean;
    /**
    /**
     * Distance value that can snap to guidelines.
     * @default 5
     */
    snapThreshold?: number;
    /**
     * snap distance digits.
     * @default 0
     */
    snapDigit?: number;
    /**
     * If width size is greater than 0, you can vertical snap to the grid.
     * @default 0 (0 is not used)
     */
    snapGridWidth?: number;
    /**
     * If height size is greater than 0, you can horizontal snap to the grid.
     * @default 0 (0 is not used)
     */
    snapGridHeight?: number;
    /**
     * Whether to show snap distance.
     * @default true
     */
    isDisplaySnapDigit?: boolean;
    /**
     * Whether to show element inner snap distance
     * @default false
     */
    isDisplayInnerSnapDigit?: boolean;
    /**
     * Add guidelines in the horizontal direction.
     * @default []
     */
    horizontalGuidelines?: number[];
    /**
     * Add guidelines in the vertical direction.
     * @default []
     */
    verticalGuidelines?: number[];
    /**
     * Add guidelines for the element.
     * @default []
     */
    elementGuidelines?: Array<ElementGuidelineValue | MoveableRefType<Element>>;
    /**
     * You can set up boundaries.
     * @default null
     */
    bounds?: BoundType | null;
    /**
     * You can set up inner boundaries.
     * @default null
     */
    innerBounds?: InnerBoundType | null;
    /**
     * You can set the text format of the distance shown in the guidelines.
     * @default oneself
     */
    snapDistFormat?: (distance: number, type: "vertical" | "horizontal") => number | string;
}

/**
 * @typedef
 * @memberof Moveable.Snappable
 */
export interface SnapDirections {
    /**
     * Whether to snap the top of the element
     * @default true
     */
    left?: boolean;
    /**
     * Whether to snap the left of the element
     * @default true
     */
    top?: boolean;
    /**
     * Whether to snap the right of the element
     * @default true
     */
    right?: boolean;
    /**
     * Whether to snap the bottom of the element
     * @default true
     */
    bottom?: boolean;
    /**
     * Whether to snap the center((left + right) / 2) of the element
     * @default false
     */
    center?: boolean;
    /**
     * Whether to snap the middle((top + bottom) / 2) of the element
     * @default false
     */
    middle?: boolean;
}
/**
 * @typedef
 * @memberof Moveable.Snappable
 * @extends Moveable.Snappable.SnapDirections
 */
export interface ElementGuidelineValue extends SnapDirections {
    /**
     * guideline element
     */
    element: Element;
    /**
     * class names to add to guideline
     * @default ""
     */
    className?: string;
    /**
     * Whether to update the element size at every render
     * @default false
     */
    refresh?: boolean;
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
    guidelines: SnapGuideline[];
    elements: SnapGuideline[];
    gaps: SnapGuideline[];
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
 * @property - If position is css, right and bottom are calculated as css right and css bottom of container. (default: "client")
 */
export interface BoundType {
    position?: "client" | "css";
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
}

export interface SnapDirectionPoses {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
    center?: number;
    middle?: number;
}

export interface SnapElementRect extends ElementGuidelineValue {
    rect: SnapDirectionPoses;
}
export interface SnappableState {
    staticGuidelines: SnapGuideline[];
    elementRects: SnapElementRect[];
    guidelines: SnapGuideline[];
    snapOffset: { left: number, top: number, bottom: number, right: number }
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
 */
export interface ScrollableOptions {
    /**
     * Whether or not target can be scrolled to the scroll container
     * @default false
     */
    scrollable?: boolean;
    /**
     * The container to which scroll is applied
     * @default container
     */
    scrollContainer?: MoveableRefType<HTMLElement>;
    /**
     * Expand the range of the scroll check area.
     * @default 0
     */
    scrollThreshold?: number;
    /**
     * Sets a function to get the scroll position.
     * @default scrollContainer's scrollTop, scrollLeft
     */
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
 */
export interface DragAreaOptions {
    /**
     * Instead of firing an event on the target, we add it to the moveable control element. You can use click and clickGroup events.
     * @default if group, true, else fals
     */
    dragArea?: boolean;
    /**
     * Set `pointerEvents: none;` css to pass events in dragArea.
     * @default false
     */
    passDragArea?: boolean;
}
export interface DragAreaProps extends DragAreaOptions {
}
/**
 * @typedef
 * @memberof Moveable.Clickable
 */
export interface ClickableEvents {
    onClick: OnClick;
    onClickGroup: OnClickGroup;
}

export interface ArrayFormat<T = any> {
    length: number;
    [key: number]: T;
}
/**
 * @typedef
 * @memberof Moveable.Clickable
 */
export interface ClickableOptions {
    /**
     * Whether to trigger the moveable's click event.
     * If true, the event is not propagated to the target's parent element.
     * @default true
     */
    clickable?: boolean;
}
/**
 * @memberof Moveable.Clickable
 * @extends Moveable.Clickable.ClickableEvents
 * @extends Moveable.Clickable.ClickableOptions
 * @typedef
 */
export interface ClickableProps extends EventInterface<ClickableEvents>, ClickableOptions {
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
 */
export interface ClippableOptions {
    /**
     * Whether to clip the target.
     * @default false
     */
    clippable?: boolean;
    /**
     * You can force the custom clipPath. (defaultClipPath < style < customClipPath < dragging clipPath)
     */
    customClipPath?: string;
    /**
     * If clippath is not set, the default value can be set. (defaultClipPath < style < customClipPath < dragging clipPath)
     */
    defaultClipPath?: string;
    /**
     * % Can be used instead of the absolute px (`rect` not possible)
     * @default false
     */
    clipRelative?: boolean;
    /**
     * When dragging the target, the clip also moves.
     * @default true
     */
    dragWithClip?: boolean;
    /**
     * You can drag the clip by setting clipArea.
     * @default false
     */
    clipArea?: boolean;
    /**
     * Whether the clip is bound to the target.
     * @default false
     */
    clipTargetBounds?: boolean;
    /**
     * Add clip guidelines in the vertical direction.
     * @default []
     */
    clipVerticalGuidelines?: Array<string | number>;
    /**
     * Add clip guidelines in the horizontal direction.
     * @default []
     */
    clipHorizontalGuidelines?: Array<string | number>;
    /**
     * Distance value that can snap to clip guidelines.
     * @default 5
     */
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
    triggerEvent(name: string, params: IObject<any>, isManager?: boolean): any;
    onPreventClick(e: any): void;
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
    request<RequestParam extends {} = AbleRequestParam>(
        ableName: string, params?: RequestParam, isInstant?: boolean): Requester<RequestParam>;
    destroy(): void;
    dragStart(e: MouseEvent | TouchEvent): void;
    isInside(clientX: number, clientY: number): boolean;
    isDragging(): boolean;
    hitTest(el: Element | HitRect): number;
    setState(state: any, callback?: () => any): any;
    forceUpdate(callback?: () => any): any;
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

export type ExcludeParams<T>
    = ExcludeKeys<T, keyof OnEvent>;
export type ExcludeEndParams<T>
    = ExcludeKeys<ExcludeParams<T>, "lastEvent" | "isDrag" | "isDouble">;
export type DefaultProps<Name extends string, AbleObject extends Partial<Able<any, any>>>
    = AbleObject extends { props: {} } ? AbleObject["props"] : { readonly [key in Name]: BooleanConstructor; };
