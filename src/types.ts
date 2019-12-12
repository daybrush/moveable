import {
    OnDragStart, OnDrag, OnDragEnd,
    OnResizeStart, OnResize, OnResizeEnd,
    OnScaleStart, OnScale, OnScaleEnd,
    OnWarpStart, OnWarp, OnWarpEnd,
    OnPinchStart, OnPinch, OnPinchEnd, OnRotateStart,
    OnRotate, OnRotateEnd, OnDragGroupStart,
    OnDragGroup, OnDragGroupEnd, OnResizeGroupStart,
    OnResizeGroup, OnResizeGroupEnd, OnScaleGroupStart,
    OnScaleGroup, OnScaleGroupEnd, OnRotateGroupStart,
    OnRotateGroup, OnRotateGroupEnd, OnPinchGroupStart,
    OnPinchGroup, OnPinchGroupEnd, OnClickGroup, OnRenderStart,
    OnRender, OnRenderEnd, OnScroll, OnScrollGroup, OnRenderGroupStart,
    OnRenderGroup, OnRenderGroupEnd, OnClick, Able,
} from "react-moveable/declaration/types";

/**
 * @memberof Moveable
 * @typedef
 * @property - Whether or not target can be dragged. (default: false)
 * @property - Whether or not target can be resized. (default: false)
 * @property - Whether or not target can be scaled. (default: false)
 * @property - Whether or not target can be rotated. (default: false)
 * @property - Whether or not target can be warped. (default: false)
 * @property - Whether or not target can be pinched with draggable, resizable, scalable, rotatable. (default: false)
 * @property - Whether or not target can be snapped to the guideline. (default: false)
 * @property - You can add your custom able. (default: [])
 * @property - Whether or not the origin control box will be visible or not (default: false)
 * @property - You can specify the className of the moveable controlbox. (default: "")
 * @property - The target(s) to indicate Moveable Control Box. (default: true)
 * @property - Moveable Container. (default: parentElement)
 * @property - throttle of x, y when drag. (default: 0)
 * @property - throttle of width, height when resize. (default: 0)
 * @property - throttle of scaleX, scaleY when scale. (default: 0)
 * @property - throttle of angle(degree) when rotate. (default: 0)
 * @property - When resize or scale, keeps a ratio of the width, height. (default: false)
 * @property - Whether to scale and resize through edge lines. (default: false)
 * @property - Minimum distance to pinch. (default: 20)
 * @property - When you drag, make the snap in the center of the target. (default: false)
 * @property - When you drag, make the snap in the vertical guidelines. (default: true)
 * @property - When you drag, make the snap in the horizontal guidelines. (default: true)
 * @property - When you drag, make the snap in the element guidelines. (default: true)

 * @property - Distance value that can snap to guidelines. (default: 0)
 * @property - Add guidelines in the horizontal direction. (default: [])
 * @property - Add guidelines in the vertical direction. (default: [])
 * @property - Add guidelines for the element. (default: [])
 * @property - You can set up boundaries. (default: null)
 * @property - Add an event to the moveable area instead of the target for stopPropagation. (default: false)

 * @property - Target's base direcition using top, left, right, bottom (top: -1, left: -1, right: 1, bottom: 1) (default: [-1, -1])
 * @property - You can specify the position of the rotation. (default: "top")
 * @property - Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])

 * @property - Sets the initial rotation of the group. (default 0)

 * @property - Whether or not target can be scrolled to the scroll container (default: false)
 * @property - The container to which scroll is applied (default: container)
 * @property - Expand the range of the scroll check area. (default: 0)
 * @property - Sets a function to get the scroll position. (default: Function)
 */
export interface MoveableOptions {
    draggable?: boolean;
    resizable?: boolean;
    scalable?: boolean;
    rotatable?: boolean;
    warpable?: boolean;
    pinchable?: boolean | Array<"rotatable" | "resizable" | "scalable">;
    snappable?: boolean | string[];

    ables?: Able[];
    origin?: boolean;
    className?: string;
    target?: SVGElement | HTMLElement | Array<SVGElement | HTMLElement>;
    container?: SVGElement | HTMLElement | null;
    throttleDrag?: number;
    throttleResize?: number;
    throttleScale?: number;
    throttleRotate?: number;
    keepRatio?: boolean;
    edge?: boolean;
    pinchThreshold?: number;

    snapCenter?: boolean;
    snapVertical?: boolean;
    snapHorizontal?: boolean;
    snapElement?: boolean;

    snapThreshold?: number;
    horizontalGuidelines?: number[];
    verticalGuidelines?: number[];
    elementGuidelines?: Element[];
    bounds?: { left?: number, top?: number, right?: number, bottom?: number };

    dragArea?: boolean;
    rotationPosition?: "top" | "bottom" | "left" | "right";

    baseDirection?: number[];
    renderDirections?: string[];

    defaultGroupRotate?: boolean;

    scrollable?: boolean;
    scrollContainer?: HTMLElement;
    scrollThreshold?: number;
    getScrollPosition?: (e: {
        scrollContainer: HTMLElement;
        direction: number[];
    }) => number[];
}

export interface MoveableGetterSetter extends Pick<MoveableOptions, Exclude<keyof MoveableOptions, "container">> {

}
export interface MoveableEvents {
    dragStart: OnDragStart;
    drag: OnDrag;
    dragEnd: OnDragEnd;
    dragGroupStart: OnDragGroupStart;
    dragGroup: OnDragGroup;
    dragGroupEnd: OnDragGroupEnd;

    resizeStart: OnResizeStart;
    resize: OnResize;
    resizeEnd: OnResizeEnd;
    resizeGroupStart: OnResizeGroupStart;
    resizeGroup: OnResizeGroup;
    resizeGroupEnd: OnResizeGroupEnd;

    scaleStart: OnScaleStart;
    scale: OnScale;
    scaleEnd: OnScaleEnd;
    scaleGroupStart: OnScaleGroupStart;
    scaleGroup: OnScaleGroup;
    scaleGroupEnd: OnScaleGroupEnd;

    rotateStart: OnRotateStart;
    rotate: OnRotate;
    rotateEnd: OnRotateEnd;
    rotateGroupStart: OnRotateGroupStart;
    rotateGroup: OnRotateGroup;
    rotateGroupEnd: OnRotateGroupEnd;

    warpStart: OnWarpStart;
    warp: OnWarp;
    warpEnd: OnWarpEnd;

    pinchStart: OnPinchStart;
    pinch: OnPinch;
    pinchEnd: OnPinchEnd;

    renderStart: OnRenderStart;
    render: OnRender;
    renderEnd: OnRenderEnd;
    renderGroupStart: OnRenderGroupStart;
    renderGroup: OnRenderGroup;
    renderGroupEnd: OnRenderGroupEnd;

    pinchGroupStart: OnPinchGroupStart;
    pinchGroup: OnPinchGroup;
    pinchGroupEnd: OnPinchGroupEnd;

    click: OnClick;
    clickGroup: OnClickGroup;

    scroll: OnScroll;
    scrollGroup: OnScrollGroup;
}
