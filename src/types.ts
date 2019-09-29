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
    OnPinchGroup, OnPinchGroupEnd, OnClickGroup,
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
 * @property - Whether or not the origin controlbox will be visible or not (default: false)
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
 * @property - Distance value that can snap to guidelines. (default: 0)
 * @property - Add guidelines in the horizontal direction. (default: [])
 * @property - Add guidelines in the vertical direction. (default: [])
 * @property - Add guidelines for the element. (default: [])
 * @property - You can set up boundaries. (default: null)
 * @property - Add an event to the moveable area instead of the target for stopPropagation. (default: false)
 * @property - You can specify the position of the rotation. (default: "top")
 */
export interface MoveableOptions {
    draggable?: boolean;
    resizable?: boolean;
    scalable?: boolean;
    rotatable?: boolean;
    warpable?: boolean;
    pinchable?: boolean | Array<"rotatable" | "resizable" | "scalable">;
    snappable?: boolean | string[];
    origin?: boolean;
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
    snapThreshold?: number;
    horizontalGuidelines?: number[];
    verticalGuidelines?: number[];
    elementGuildelines?: Element[];
    bounds?: { left?: number, top?: number, right?: number, bottom?: number };

    dragArea?: boolean;
    rotationPosition?: "top" | "bottom" | "left" | "right";
}

export interface MoveableGetterSetter extends Pick<MoveableOptions, Exclude<keyof MoveableOptions, "container">> {

}
export interface MoveableEvents {
    dragStart: OnDragStart;
    drag: OnDrag;
    dragEnd: OnDragEnd;

    resizeStart: OnResizeStart;
    resize: OnResize;
    resizeEnd: OnResizeEnd;

    scaleStart: OnScaleStart;
    scale: OnScale;
    scaleEnd: OnScaleEnd;

    rotateStart: OnRotateStart;
    rotate: OnRotate;
    rotateEnd: OnRotateEnd;

    warpStart: OnWarpStart;
    warp: OnWarp;
    warpEnd: OnWarpEnd;

    pinchStart: OnPinchStart;
    pinch: OnPinch;
    pinchEnd: OnPinchEnd;

    dragGroupStart: OnDragGroupStart;
    dragGroup: OnDragGroup;
    dragGroupEnd: OnDragGroupEnd;

    resizeGroupStart: OnResizeGroupStart;
    resizeGroup: OnResizeGroup;
    resizeGroupEnd: OnResizeGroupEnd;

    scaleGroupStart: OnScaleGroupStart;
    scaleGroup: OnScaleGroup;
    scaleGroupEnd: OnScaleGroupEnd;

    rotateGroupStart: OnRotateGroupStart;
    rotateGroup: OnRotateGroup;
    rotateGroupEnd: OnRotateGroupEnd;

    pinchGroupStart: OnPinchGroupStart;
    pinchGroup: OnPinchGroup;
    pinchGroupEnd: OnPinchGroupEnd;

    clickGroup: OnClickGroup;
}
