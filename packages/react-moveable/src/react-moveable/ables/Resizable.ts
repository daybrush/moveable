import {
    throttle, getDirection, triggerEvent,
    fillParams, getKeepRatioHeight, getKeepRatioWidth, getCSSSize, getDistSize, caculateBoundSize, fillEndParams,
} from "../utils";
import {
    setDragStart,
    getDragDist,
    getResizeDist,
    getStartDirection,
    getAbsoluteFixedPosition,
} from "../DraggerUtils";
import {
    ResizableProps, OnResizeGroup, OnResizeGroupEnd,
    Renderer, OnResizeGroupStart, DraggableProps, OnDrag, OnResizeStart, SnappableState,
    OnResize, OnResizeEnd, MoveableManagerInterface, MoveableGroupInterface,
} from "../types";
import { renderAllDirections, renderDiagonalDirections } from "../renderDirection";
import {
    triggerChildAble,
} from "../groupUtils";
import Draggable from "./Draggable";
import { getRad, caculate, createRotateMatrix, plus } from "../matrix";
import CustomDragger, { setCustomDrag } from "../CustomDragger";
import { checkSnapSize } from "./Snappable";
import {
    directionCondition,
} from "./utils";
import { IObject, isString } from "@daybrush/utils";
import { TINY_NUM } from "../consts";

/**
 * @namespace Resizable
 * @memberof Moveable
 * @description Resizable indicates whether the target's width and height can be increased or decreased.
 */

export default {
    name: "resizable",
    ableGroup: "size",
    updateRect: true,
    canPinch: true,
    props: {
        resizable: Boolean,
        throttleResize: Number,
        renderDirections: Array,
        keepRatio: Boolean,
    } as const,
    events: {
        onResizeStart: "resizeStart",
        onResize: "resize",
        onResizeEnd: "resizeEnd",

        onResizeGroupStart: "onResizeGroupStart",
        onResizeGroup: "onResizeGroup",
        onResizeGroupEnd: "onResizeGroupEnd",
    } as const,
    render(moveable: MoveableManagerInterface<Partial<ResizableProps>>, React: Renderer): any[] | undefined {
        const { resizable, edge } = moveable.props;
        if (resizable) {
            if (edge) {
                return renderDiagonalDirections(moveable, React);
            }
            return renderAllDirections(moveable, React);
        }
    },
    dragControlCondition: directionCondition,
    dragControlStart(
        moveable: MoveableManagerInterface<ResizableProps & DraggableProps, SnappableState>,
        e: any,
    ) {
        const {
            inputEvent,
            isPinch,
            parentDirection,
            datas,
            parentFlag,
        } = e;

        const direction = parentDirection || (isPinch ? [0, 0] : getDirection(inputEvent.target));

        const { target, width, height } = moveable.state;

        if (!direction || !target) {
            return false;
        }
        !isPinch && setDragStart(moveable, { datas });

        datas.datas = {};
        datas.direction = direction;
        datas.startOffsetWidth = width;
        datas.startOffsetHeight = height;
        datas.prevWidth = 0;
        datas.prevHeight = 0;
        [
            datas.startWidth,
            datas.startHeight,
        ] = getCSSSize(target);
        const padding = [Math.max(0, width - datas.startWidth), Math.max(0, height - datas.startHeight)];
        datas.minSize = padding;
        datas.maxSize = [Infinity, Infinity];

        if (!parentFlag) {
            const style = window.getComputedStyle(target);

            datas.minSize = plus([
                parseFloat(style.minWidth!) || 0,
                parseFloat(style.minHeight!) || 0,
            ], padding);
            datas.maxSize = plus([
                parseFloat(style.maxWidth!) || Infinity,
                parseFloat(style.maxHeight!) || Infinity,
            ], padding);
        }
        const transformOrigin = moveable.props.transformOrigin || "% %";

        datas.transformOrigin = transformOrigin && isString(transformOrigin)
            ? transformOrigin.split(" ")
            : transformOrigin;
        datas.startDirection = getStartDirection(moveable, direction);
        datas.fixedPosition = getAbsoluteFixedPosition(moveable, datas.startDirection);
        datas.fixedOriginalPosition = getAbsoluteFixedPosition(moveable, direction);

        const params = fillParams<OnResizeStart>(moveable, e, {
            direction,
            set: ([startWidth, startHeight]: number[]) => {
                datas.startWidth = startWidth;
                datas.startHeight = startHeight;
            },
            setMin: (minSize: number[]) => {
                datas.minSize = minSize;
            },
            setMax: (maxSize: number[]) => {
                datas.maxSize = maxSize;
            },
            setOrigin: (origin: Array<string | number>) => {
                datas.transformOrigin = origin;
            },
            dragStart: Draggable.dragStart(
                moveable,
                new CustomDragger().dragStart([0, 0], inputEvent),
            ),
        });
        const result = triggerEvent<ResizableProps>(moveable, "onResizeStart", params);
        if (result !== false) {
            datas.isResize = true;
            moveable.state.snapRenderInfo = {
                request: e.isRequest,
                direction,
            };
        }
        return datas.isResize ? params : false;
    },
    dragControl(
        moveable: MoveableManagerInterface<ResizableProps & DraggableProps>,
        e: any,
    ) {
        const {
            datas,
            distX, distY,
            parentFlag, isPinch,
            parentDistance, parentScale, inputEvent,
            parentKeepRatio,
            dragClient,
            parentDist,
            isRequest,
        } = e;

        const {
            direction,
            isResize,
            transformOrigin,
        } = datas;

        if (!isResize) {
            return;
        }
        const {
            startWidth,
            startHeight,
            startOffsetWidth,
            startOffsetHeight,
            prevWidth,
            prevHeight,
            minSize,
            maxSize,
        } = datas;
        const {
            throttleResize = 0,
            parentMoveable,
        } = moveable.props;
        let sizeDirection = direction;

        if (!direction[0] && !direction[1]) {
            sizeDirection = [1, 1];
        }
        const keepRatio = moveable.props.keepRatio || parentKeepRatio;
        const isWidth = sizeDirection[0] || !sizeDirection[1];
        const ratio = isWidth ? startOffsetHeight / startOffsetWidth : startOffsetWidth / startOffsetHeight;
        const startDirection = keepRatio || parentFlag ? direction : datas.startDirection;
        let fixedPosition = dragClient;
        let distWidth: number = 0;
        let distHeight: number = 0;

        if (!dragClient) {
            if (!parentFlag && isPinch) {
                fixedPosition = getAbsoluteFixedPosition(moveable, [0, 0]);
            } else {
                fixedPosition = (keepRatio ? datas.fixedOriginalPosition : datas.fixedPosition);
            }
        }

        if (parentDist) {
            distWidth = parentDist[0];
            distHeight = parentDist[1];
        } else if (parentScale) {
            distWidth = (parentScale[0] - 1) * startOffsetWidth;
            distHeight = (parentScale[1] - 1) * startOffsetHeight;
        } else if (isPinch) {
            if (parentDistance) {
                distWidth = parentDistance;
                distHeight = parentDistance * startOffsetHeight / startOffsetWidth;
            }
        } else {
            const dist = getDragDist({ datas, distX, distY });

            distWidth = sizeDirection[0] * dist[0];
            distHeight = sizeDirection[1] * dist[1];

            if (keepRatio && startOffsetWidth && startOffsetHeight) {
                const rad = getRad([0, 0], dist);
                const standardRad = getRad([0, 0], sizeDirection);
                const ratioRad = getRad([0, 0], [startOffsetWidth, startOffsetHeight]);
                const size = getDistSize([distWidth, distHeight]);
                const signSize = Math.cos(rad - standardRad) * size;

                if (!sizeDirection[0]) {
                    // top, bottom
                    distHeight = signSize;
                    distWidth = getKeepRatioWidth(distHeight, isWidth, ratio);
                } else if (!sizeDirection[1]) {
                    // left, right
                    distWidth = signSize;
                    distHeight = getKeepRatioHeight(distWidth, isWidth, ratio);
                } else {
                    // two-way
                    distWidth = Math.cos(ratioRad) * signSize;
                    distHeight = Math.sin(ratioRad) * signSize;
                }
            }
        }
        let nextWidth = sizeDirection[0] || keepRatio
            ? Math.max(startOffsetWidth + distWidth, TINY_NUM) : startOffsetWidth;
        let nextHeight = sizeDirection[1] || keepRatio
            ? Math.max(startOffsetHeight + distHeight, TINY_NUM) : startOffsetHeight;

        if (keepRatio && startOffsetWidth && startOffsetHeight) {
            // startOffsetWidth : startOffsetHeight = nextWidth : nextHeight
            nextHeight = nextWidth * startOffsetHeight / startOffsetWidth;
        }
        let snapDist = [0, 0];

        if (!isPinch) {
            snapDist = checkSnapSize(
                moveable, nextWidth,
                nextHeight, direction,
                datas.fixedOriginalPosition,
                isRequest,
                datas,
            );
        }
        if (parentDist) {
            !parentDist[0] && (snapDist[0] = 0);
            !parentDist[1] && (snapDist[1] = 0);
        }
        if (keepRatio) {
            if (sizeDirection[0] && sizeDirection[1] && snapDist[0] && snapDist[1]) {
                if (Math.abs(snapDist[0]) > Math.abs(snapDist[1])) {
                    snapDist[1] = 0;
                } else {
                    snapDist[0] = 0;
                }
            }
            const isNoSnap = !snapDist[0] && !snapDist[1];

            if (isNoSnap) {
                if (isWidth) {
                    nextWidth = throttle(nextWidth, throttleResize!);
                } else {
                    nextHeight = throttle(nextHeight, throttleResize!);
                }
            }
            if (
                (sizeDirection[0] && !sizeDirection[1])
                || (snapDist[0] && !snapDist[1])
                || (isNoSnap && isWidth)
            ) {
                nextWidth += snapDist[0];
                nextHeight = getKeepRatioHeight(nextWidth, isWidth, ratio);
            } else if (
                (!sizeDirection[0] && sizeDirection[1])
                || (!snapDist[0] && snapDist[1])
                || (isNoSnap && !isWidth)
            ) {
                nextHeight += snapDist[1];
                nextWidth = getKeepRatioWidth(nextHeight, isWidth, ratio);
            }
        } else {
            nextWidth += snapDist[0];
            nextHeight += snapDist[1];
            if (!snapDist[0]) {
                nextWidth = throttle(nextWidth, throttleResize!);
            }
            if (!snapDist[1]) {
                nextHeight = throttle(nextHeight, throttleResize!);
            }
        }
        [nextWidth, nextHeight] = caculateBoundSize(
            [nextWidth, nextHeight],
            minSize,
            maxSize,
            keepRatio,
        );
        nextWidth = Math.round(nextWidth);
        nextHeight = Math.round(nextHeight);
        distWidth = nextWidth - startOffsetWidth;
        distHeight = nextHeight - startOffsetHeight;

        const delta = [distWidth - prevWidth, distHeight - prevHeight];

        datas.prevWidth = distWidth;
        datas.prevHeight = distHeight;

        const inverseDelta = getResizeDist(
                moveable,
                nextWidth, nextHeight,
                startDirection, fixedPosition, transformOrigin);

        if (!parentMoveable && delta.every(num => !num) && inverseDelta.every(num => !num)) {
            return;
        }
        const params = fillParams<OnResize>(moveable, e, {
            width: startWidth + distWidth,
            height: startHeight + distHeight,
            offsetWidth: nextWidth,
            offsetHeight: nextHeight,
            direction,
            dist: [distWidth, distHeight],
            delta,
            isPinch: !!isPinch,
            drag: Draggable.drag(
                moveable,
                setCustomDrag(moveable.state, inverseDelta, inputEvent, !!isPinch, false),
            ) as OnDrag,
        });
        triggerEvent<ResizableProps>(moveable, "onResize", params);
        return params;
    },
    dragControlAfter(
        moveable: MoveableManagerInterface<ResizableProps & DraggableProps>,
        e: any,
    ) {
        const datas = e.datas;
        const {
            isResize,
            startOffsetWidth,
            startOffsetHeight,
            prevWidth,
            prevHeight,
        } = datas;

        if (!isResize) {
            return;
        }
        const {
            width,
            height,
        } = moveable.state;
        const errorWidth = width - (startOffsetWidth + prevWidth);
        const errorHeight = height - (startOffsetHeight + prevHeight);
        const isErrorWidth = Math.abs(errorWidth) > 3;
        const isErrorHeight = Math.abs(errorHeight) > 3;

        if (isErrorWidth) {
            datas.startWidth += errorWidth;
            datas.startOffsetWidth += errorWidth;
            datas.prevWidth += errorWidth;
        }
        if (isErrorHeight) {
            datas.startHeight += errorHeight;
            datas.startOffsetHeight += errorHeight;
            datas.prevHeight += errorHeight;
        }
        if (isErrorWidth || isErrorHeight) {
            this.dragControl(moveable, e);
            return true;
        }
    },
    dragControlEnd(
        moveable: MoveableManagerInterface<ResizableProps & DraggableProps>,
        e: any,
    ) {
        const { datas, isDrag } = e;
        if (!datas.isResize) {
            return false;
        }
        datas.isResize = false;

        const params = fillEndParams<OnResizeEnd>(moveable, e, {});
        triggerEvent<ResizableProps>(moveable, "onResizeEnd", params);
        return isDrag;
    },
    dragGroupControlCondition: directionCondition,
    dragGroupControlStart(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { datas } = e;
        const params = this.dragControlStart(moveable, e);

        if (!params) {
            return false;
        }
        const direction = params.direction;
        const fixedPosition = datas.fixedOriginalPosition;

        const events = triggerChildAble(
            moveable,
            this,
            "dragControlStart",
            datas,
            (child, childDatas) => {
                const pos = getAbsoluteFixedPosition(child, direction);
                const [originalX, originalY] = caculate(
                    createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3),
                    [pos[0] - fixedPosition[0], pos[1] - fixedPosition[1], 1],
                    3,
                );
                childDatas.originalX = originalX;
                childDatas.originalY = originalY;

                return e;
            },
        );

        const nextParams: OnResizeGroupStart = {
            ...params,
            targets: moveable.props.targets!,
            events,
        };
        const result = triggerEvent<ResizableProps>(moveable, "onResizeGroupStart", nextParams);

        datas.isResize = result !== false;
        return datas.isResize ? params : false;
    },
    dragGroupControl(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { datas } = e;
        if (!datas.isResize) {
            return;
        }
        const params = this.dragControl(moveable, e);

        if (!params) {
            return;
        }
        const {
            offsetWidth, offsetHeight, dist,
        } = params;

        const keepRatio = moveable.props.keepRatio;

        const parentScale = [
            offsetWidth / (offsetWidth - dist[0]),
            offsetHeight / (offsetHeight - dist[1]),
        ];
        const fixedPosition = datas.fixedOriginalPosition;

        const events = triggerChildAble(
            moveable,
            this,
            "dragControl",
            datas,
            (_, childDatas) => {
                const [clientX, clientY] = caculate(
                    createRotateMatrix(moveable.rotation / 180 * Math.PI, 3),
                    [
                        childDatas.originalX * parentScale[0],
                        childDatas.originalY * parentScale[1],
                        1,
                    ],
                    3,
                );

                return {
                    ...e,
                    parentDist: null,
                    parentScale,
                    dragClient: plus(fixedPosition, [clientX, clientY]),
                    parentKeepRatio: keepRatio,
                };
            },
        );
        const nextParams: OnResizeGroup = {
            targets: moveable.props.targets!,
            events,
            ...params,
        };

        triggerEvent<ResizableProps>(moveable, "onResizeGroup", nextParams);
        return nextParams;
    },
    dragGroupControlEnd(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { isDrag, datas } = e;

        if (!datas.isResize) {
            return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);

        const nextParams: OnResizeGroupEnd = fillEndParams<OnResizeGroupEnd>(moveable, e, {
            targets: moveable.props.targets!,
        });

        triggerEvent<ResizableProps>(moveable, "onResizeGroupEnd", nextParams);
        return isDrag;
    },
    /**
     * @method Moveable.Resizable#request
     * @param {object} [e] - the Resizable's request parameter
     * @param {number} [e.direction=[1, 1]] - Direction to resize
     * @param {number} [e.deltaWidth] - delta number of width
     * @param {number} [e.deltaHeight] - delta number of height
     * @param {number} [e.offsetWidth] - offset number of width
     * @param {number} [e.offsetHeight] - offset number of height
     * @param {number} [e.isInstant] - Whether to execute the request instantly
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * // Use Relative Value
     * moveable.request("resizable", { deltaWidth: 10, deltaHeight: 10 }, true);
     *
     * // Use Absolute Value
     * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100 }, true);
     *
     * // requestStart
     * const requester = moveable.request("resizable");
     *
     * // request
     * // Use Relative Value
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     *
     * // Use Absolute Value
     * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100 });
     * moveable.request("resizable", { offsetWidth: 110, offsetHeight: 100 });
     * moveable.request("resizable", { offsetWidth: 120, offsetHeight: 100 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request(moveable: MoveableManagerInterface<any>) {
        const datas = {};
        let distWidth = 0;
        let distHeight = 0;
        const rect = moveable.getRect();

        return {
            isControl: true,
            requestStart(e: IObject<any>) {
                return { datas, parentDirection: e.direction || [1, 1] };
            },
            request(e: IObject<any>) {
                if ("offsetWidth" in e) {
                    distWidth = e.offsetWidth - rect.offsetWidth;
                } else if ("deltaWidth" in e) {
                    distWidth += e.deltaWidth;
                }
                if ("offsetHeight" in e) {
                    distHeight = e.offsetHeight - rect.offsetHeight;
                } else if ("deltaHeight" in e) {
                    distHeight += e.deltaHeight;
                }

                return { datas, parentDist: [distWidth, distHeight] };
            },
            requestEnd() {
                return { datas, isDrag: true };
            },
        };
    },
};

/**
 * Whether or not target can be resized. (default: false)
 * @name Moveable.Resizable#resizable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     resizable: false,
 * });
 *
 * moveable.resizable = true;
 */

/**
 * throttle of width, height when resize.
 * @name Moveable.Resizable#throttleResize
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   resizable: true,
 *   throttleResize: 0,
 * });
 *
 * moveable.throttleResize = 1;
 */
/**
 * When resize or scale, keeps a ratio of the width, height. (default: false)
 * @name Moveable.Resizable#keepRatio
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   resizable: true,
 * });
 *
 * moveable.keepRatio = true;
 */
/**
 * Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
 * @name Moveable.Resizable#renderDirections
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   resizable: true,
 *   renderDirections: ["n", "nw", "ne", "s", "se", "sw", "e", "w"],
 * });
 *
 * moveable.renderDirections = ["nw", "ne", "sw", "se"];
 */

/**
 * When the resize starts, the resizeStart event is called.
 * @memberof Moveable.Resizable
 * @event resizeStart
 * @param {Moveable.Resizable.OnResizeStart} - Parameters for the resizeStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("resizeStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When resizing, the resize event is called.
 * @memberof Moveable.Resizable
 * @event resize
 * @param {Moveable.Resizable.OnResize} - Parameters for the resize event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("resize", ({ target, width, height }) => {
 *     target.style.width = `${e.width}px`;
 *     target.style.height = `${e.height}px`;
 * });
 */
/**
 * When the resize finishes, the resizeEnd event is called.
 * @memberof Moveable.Resizable
 * @event resizeEnd
 * @param {Moveable.Resizable.OnResizeEnd} - Parameters for the resizeEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("resizeEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */

 /**
 * When the group resize starts, the `resizeGroupStart` event is called.
 * @memberof Moveable.Resizable
 * @event resizeGroupStart
 * @param {Moveable.Resizable.OnResizeGroupStart} - Parameters for the `resizeGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     resizable: true
 * });
 * moveable.on("resizeGroupStart", ({ targets }) => {
 *     console.log("onResizeGroupStart", targets);
 * });
 */

 /**
 * When the group resize, the `resizeGroup` event is called.
 * @memberof Moveable.Resizable
 * @event resizeGroup
 * @param {Moveable.Resizable.onResizeGroup} - Parameters for the `resizeGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     resizable: true
 * });
 * moveable.on("resizeGroup", ({ targets, events }) => {
 *     console.log("onResizeGroup", targets);
 *     events.forEach(ev => {
 *         const offset = [
 *             direction[0] < 0 ? -ev.delta[0] : 0,
 *             direction[1] < 0 ? -ev.delta[1] : 0,
 *         ];
 *         // ev.drag is a drag event that occurs when the group resize.
 *         const left = offset[0] + ev.drag.beforeDist[0];
 *         const top = offset[1] + ev.drag.beforeDist[1];
 *         const width = ev.width;
 *         const top = ev.top;
 *     });
 * });
 */

/**
 * When the group resize finishes, the `resizeGroupEnd` event is called.
 * @memberof Moveable.Resizable
 * @event resizeGroupEnd
 * @param {Moveable.Resizable.OnResizeGroupEnd} - Parameters for the `resizeGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     resizable: true
 * });
 * moveable.on("resizeGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onResizeGroupEnd", targets, isDrag);
 * });
 */
