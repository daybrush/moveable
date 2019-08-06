import {
    OnDragStart, OnDrag, OnDragEnd,
    OnResizeStart, OnResize, OnResizeEnd,
    OnScaleStart, OnScale, OnScaleEnd,
    OnWarpStart, OnWarp, OnWarpEnd,
    OnPinchStart, OnPinch, OnPinchEnd,
} from "react-moveable/declaration/types";

/**
 * @memberof Moveable
 * @typedef
 * @property - Whether or not target can be dragged.
 * @property - Whether or not target can be resized.
 * @property - Whether or not target can be scaled.
 * @property - Whether or not target can be rotated.
 * @property - Whether or not target can be warped.
 * @property - Whether or not target can be pinched with draggable, resizable, scalable, rotatable.
 * @property - Whether or not the origin controlbox will be visible or not
 * @property - The target to indicate Moveable Control Box.
 * @property - Moveable Container.
 * @property - throttle of x, y when drag.
 * @property - throttle of width, height when resize.
 * @property - throttle of scaleX, scaleY when scale.
 * @property - throttle of angle(degree) when rotate.
 * @property - When resize or scale, keeps a ratio of the width, height.
 */
export interface MoveableOptions {
    draggable?: boolean;
    resizable?: boolean;
    scalable?: boolean;
    rotatable?: boolean;
    warpable?: boolean;
    pinchable?: boolean | Array<"rotatable" | "resizable" | "scalable">;
    origin?: boolean;
    target?: SVGElement | HTMLElement;
    container?: SVGElement | HTMLElement | null;
    throttleDrag?: number;
    throttleResize?: number;
    throttleScale?: number;
    throttleRotate?: number;
    keepRatio?: boolean;
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
    warpStart: OnWarpStart;
    warp: OnWarp;
    warpEnd: OnWarpEnd;
    pinchStart: OnPinchStart;
    pinch: OnPinch;
    pinchEnd: OnPinchEnd;
}
