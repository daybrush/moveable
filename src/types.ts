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
    OnRenderGroup, OnRenderGroupEnd, OnClick, MoveableDefaultProps, DraggableOptions,
    ResizableOptions, ScalableOptions, RotatableOptions,
    WarpableOptions, ScrollableOptions, GroupableOptions, SnappableOptions, PinchableOptions, OnSnap,
} from "react-moveable/declaration/types";

/**
 * @memberof Moveable
 * @typedef
 * @extends Moveable.MoveableDefaultProps
 * @extends Moveable.DraggableOptions
 * @extends Moveable.ResizableOptions
 * @extends Moveable.ScalableOptions
 * @extends Moveable.PinchableOptions
 * @extends Moveable.RotatableOptions
 * @extends Moveable.WarpableOptions
 * @extends Moveable.ScrollableOptions
 * @extends Moveable.GroupableOptions
 * @extends Moveable.SnappableOptions
 */
export interface MoveableOptions extends
    Pick<MoveableDefaultProps, Exclude<keyof MoveableDefaultProps, "target">>,
    DraggableOptions,
    ResizableOptions,
    ScalableOptions,
    RotatableOptions,
    WarpableOptions,
    PinchableOptions,
    ScrollableOptions,
    GroupableOptions,
    SnappableOptions {
    target?: HTMLElement | SVGElement | Array<SVGElement | HTMLElement>;
}

export interface MoveableGetterSetter extends Pick<MoveableOptions, Exclude<keyof MoveableOptions, "container">> {

}
export interface MoveableEvents {
    dragStart: OnDragStart & WithEventStop;
    drag: OnDrag & WithEventStop;
    dragEnd: OnDragEnd & WithEventStop;
    dragGroupStart: OnDragGroupStart & WithEventStop;
    dragGroup: OnDragGroup & WithEventStop;
    dragGroupEnd: OnDragGroupEnd & WithEventStop;

    resizeStart: OnResizeStart & WithEventStop;
    resize: OnResize & WithEventStop;
    resizeEnd: OnResizeEnd & WithEventStop;
    resizeGroupStart: OnResizeGroupStart & WithEventStop;
    resizeGroup: OnResizeGroup & WithEventStop;
    resizeGroupEnd: OnResizeGroupEnd & WithEventStop;

    scaleStart: OnScaleStart & WithEventStop;
    scale: OnScale & WithEventStop;
    scaleEnd: OnScaleEnd & WithEventStop;
    scaleGroupStart: OnScaleGroupStart & WithEventStop;
    scaleGroup: OnScaleGroup & WithEventStop;
    scaleGroupEnd: OnScaleGroupEnd & WithEventStop;

    rotateStart: OnRotateStart & WithEventStop;
    rotate: OnRotate & WithEventStop;
    rotateEnd: OnRotateEnd & WithEventStop;
    rotateGroupStart: OnRotateGroupStart & WithEventStop;
    rotateGroup: OnRotateGroup & WithEventStop;
    rotateGroupEnd: OnRotateGroupEnd & WithEventStop;

    warpStart: OnWarpStart & WithEventStop;
    warp: OnWarp & WithEventStop;
    warpEnd: OnWarpEnd & WithEventStop;

    pinchStart: OnPinchStart & WithEventStop;
    pinch: OnPinch & WithEventStop;
    pinchEnd: OnPinchEnd & WithEventStop;

    renderStart: OnRenderStart & WithEventStop;
    render: OnRender & WithEventStop;
    renderEnd: OnRenderEnd & WithEventStop;
    renderGroupStart: OnRenderGroupStart & WithEventStop;
    renderGroup: OnRenderGroup & WithEventStop;
    renderGroupEnd: OnRenderGroupEnd & WithEventStop;

    pinchGroupStart: OnPinchGroupStart & WithEventStop;
    pinchGroup: OnPinchGroup & WithEventStop;
    pinchGroupEnd: OnPinchGroupEnd & WithEventStop;

    click: OnClick & WithEventStop;
    clickGroup: OnClickGroup & WithEventStop;

    scroll: OnScroll;
    scrollGroup: OnScrollGroup;

    snap: OnSnap;
}

export interface WithEventStop {
    stop: () => any;
}
