import {
    triggerEvent,
    fillParams,
    fillEndParams,
    getAbsolutePosesByState,
    catchEvent,
    getOffsetSizeDist,
    getProps,
    getDirectionCondition,
    calculatePoses,
    fillAfterTransform,
    getDirectionViewClassName,
    getTotalDirection,
} from "../utils";
import {
    setDragStart,
    getResizeDist,
    getAbsolutePosition,
    getPosByDirection,
    getNextMatrix,
    getNextTransforms,
    getDirectionByPos,
} from "../gesto/GestoUtils";
import {
    ResizableProps, OnResizeGroup, OnResizeGroupEnd,
    OnResizeGroupStart, DraggableProps, OnDrag, OnResizeStart, SnappableState,
    OnResize, OnResizeEnd, MoveableManagerInterface, MoveableGroupInterface, SnappableProps,
    OnBeforeResize, OnBeforeResizeGroup, ResizableRequestParam,
} from "../types";
import { getRenderDirections } from "../renderDirections";
import {
    fillChildEvents,
    startChildDist,
    triggerChildAbles,
} from "../groupUtils";
import Draggable from "./Draggable";
import { calculate, convertDimension, createRotateMatrix, plus } from "@scena/matrix";
import CustomGesto, { setCustomDrag } from "../gesto/CustomGesto";
import { checkSnapResize } from "./Snappable";
import {
    calculateBoundSize,
    isString, convertUnitSize,
    throttle,
    isNumber,
} from "@daybrush/utils";
import { TINY_NUM } from "../consts";
import { parseMat } from "css-to-mat";

/**
 * @namespace Resizable
 * @memberof Moveable
 * @description Resizable indicates whether the target's width and height can be increased or decreased.
 */

const directionCondition = getDirectionCondition("resizable");

export default {
    name: "resizable",
    ableGroup: "size",
    canPinch: true,
    props: [
        "resizable",
        "throttleResize",
        "renderDirections",
        "displayAroundControls",
        "keepRatio",
        "resizeFormat",
        "keepRatioFinally",
        "edge",
        "checkResizableError",
    ] as const,
    events: [
        "resizeStart",
        "beforeResize",
        "resize",
        "resizeEnd",
        "resizeGroupStart",
        "beforeResizeGroup",
        "resizeGroup",
        "resizeGroupEnd",
    ] as const,
    render: getRenderDirections("resizable"),
    dragControlCondition: directionCondition,
    viewClassName: getDirectionViewClassName("resizable"),
    dragControlStart(
        moveable: MoveableManagerInterface<ResizableProps & DraggableProps, SnappableState>,
        e: any,
    ) {
        const {
            inputEvent,
            isPinch,
            isGroup,
            parentDirection,
            parentGesto,
            datas,
            parentFixedDirection,
            parentEvent,
        } = e;

        const direction = getTotalDirection(
            parentDirection,
            isPinch,
            inputEvent,
            datas,
        );

        const state = moveable.state;
        const { target, width, height, gestos } = state;

        if (!direction || !target) {
            return false;
        }
        if (gestos.resizable) {
            return false;
        }
        gestos.resizable = parentGesto || moveable.controlGesto;
        !isPinch && setDragStart(moveable, e);

        datas.datas = {};
        datas.direction = direction;
        datas.startOffsetWidth = width;
        datas.startOffsetHeight = height;
        datas.prevWidth = 0;
        datas.prevHeight = 0;

        datas.minSize = [0, 0];


        datas.startWidth = state.inlineCSSWidth || state.cssWidth;
        datas.startHeight = state.inlineCSSHeight || state.cssHeight;
        datas.maxSize = [Infinity, Infinity];

        if (!isGroup) {
            datas.minSize = [
                state.minOffsetWidth,
                state.minOffsetHeight,
            ];
            datas.maxSize = [
                state.maxOffsetWidth,
                state.maxOffsetHeight,
            ];
        }
        const transformOrigin = moveable.props.transformOrigin || "% %";

        datas.transformOrigin = transformOrigin && isString(transformOrigin)
            ? transformOrigin.split(" ")
            : transformOrigin;

        datas.startOffsetMatrix = state.offsetMatrix;
        datas.startTransformOrigin = state.transformOrigin;

        datas.isWidth = e?.parentIsWidth ?? ((!direction[0] && !direction[1]) || direction[0] || !direction[1]);

        function setRatio(ratio: number) {
            datas.ratio = ratio && isFinite(ratio) ? ratio : 0;
        }


        datas.startPositions = getAbsolutePosesByState(moveable.state);

        function setFixedDirection(fixedDirection: number[]) {
            datas.fixedDirection = fixedDirection;
            datas.fixedPosition = getPosByDirection(datas.startPositions, fixedDirection);
        }
        function setFixedPosition(fixedPosition: number[]) {
            const {
                width,
                height,
            } = moveable.state;

            datas.fixedPosition = fixedPosition;
            datas.fixedDirection = getDirectionByPos(fixedPosition, width, height);
        }
        function setMin(minSize: Array<string | number>)  {
            datas.minSize = [
                convertUnitSize(`${minSize[0]}`, 0) || 0,
                convertUnitSize(`${minSize[1]}`, 0) || 0,
            ];
        }
        function setMax(maxSize: Array<string | number>) {
            const nextMaxSize = [
                maxSize[0] || Infinity,
                maxSize[1] || Infinity,
            ];
            if (!isNumber(nextMaxSize[0]) || isFinite(nextMaxSize[0])) {
                nextMaxSize[0] = convertUnitSize(`${nextMaxSize[0]}`, 0) || Infinity;
            }
            if (!isNumber(nextMaxSize[1]) || isFinite(nextMaxSize[1])) {
                nextMaxSize[1] = convertUnitSize(`${nextMaxSize[1]}`, 0) || Infinity;
            }
            datas.maxSize = nextMaxSize;
        }

        setRatio(width / height);
        setFixedDirection(parentFixedDirection || [-direction[0], -direction[1]]);

        datas.setFixedDirection = setFixedDirection;
        datas.setFixedPosition = setFixedPosition;
        datas.setMin = setMin;
        datas.setMax = setMax;
        const params = fillParams<OnResizeStart>(moveable, e, {
            direction,
            startRatio: datas.ratio,
            set: ([startWidth, startHeight]: number[]) => {
                datas.startWidth = startWidth;
                datas.startHeight = startHeight;
            },
            setMin,
            setMax,
            setRatio,
            setFixedDirection,
            setFixedPosition,
            setOrigin: (origin: Array<string | number>) => {
                datas.transformOrigin = origin;
            },
            dragStart: Draggable.dragStart(
                moveable,
                new CustomGesto().dragStart([0, 0], e),
            ),
        });
        const result = parentEvent || triggerEvent(moveable, "onResizeStart", params);

        datas.startFixedDirection = datas.fixedDirection;
        datas.startFixedPosition = datas.fixedPosition;
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
        moveable: MoveableManagerInterface<ResizableProps & DraggableProps & SnappableProps>,
        e: any,
    ) {
        const {
            datas,
            parentFlag,
            isPinch,
            parentKeepRatio,
            dragClient,
            parentDist,
            isRequest,
            isGroup,
            parentEvent,
            resolveMatrix,
        } = e;

        const {
            isResize,
            transformOrigin,
            startWidth,
            startHeight,
            prevWidth,
            prevHeight,
            minSize,
            maxSize,
            ratio,
            startOffsetWidth,
            startOffsetHeight,
            isWidth,
        } = datas;

        if (!isResize) {
            return;
        }
        if (resolveMatrix) {
            const {
                is3d,
            } = moveable.state;
            const {
                startOffsetMatrix,
                startTransformOrigin,
            } = datas;
            const n = is3d ? 4 : 3;
            let targetMatrix = parseMat(getNextTransforms(e));
            const targetN = Math.sqrt(targetMatrix.length);

            if (n !== targetN) {
                targetMatrix = convertDimension(targetMatrix, targetN, n);
            }

            const nextAllMatrix = getNextMatrix(
                startOffsetMatrix,
                targetMatrix,
                startTransformOrigin,
                n,
            );
            const poses = calculatePoses(nextAllMatrix, startOffsetWidth, startOffsetHeight, n);

            datas.startPositions = poses;
            datas.nextTargetMatrix = targetMatrix;
            datas.nextAllMatrix = nextAllMatrix;
        }
        const props = getProps(moveable.props, "resizable");
        const {
            resizeFormat,
            throttleResize = parentFlag ? 0 : 1,
            parentMoveable,
            keepRatioFinally,
        } = props;
        const direction = datas.direction;
        let sizeDirection = direction;
        let distWidth = 0;
        let distHeight = 0;

        if (!direction[0] && !direction[1]) {
            sizeDirection = [1, 1];
        }
        const keepRatio = (ratio && (parentKeepRatio != null ? parentKeepRatio : props.keepRatio)) || false;

        function getNextBoundingSize() {
            const fixedDirection = datas.fixedDirection;
            const nextSize = getOffsetSizeDist(sizeDirection, keepRatio, datas, e);

            distWidth = nextSize.distWidth;
            distHeight = nextSize.distHeight;

            let nextWidth = (sizeDirection[0] - fixedDirection[0]) || keepRatio
                ? Math.max(startOffsetWidth + distWidth, TINY_NUM) : startOffsetWidth;
            let nextHeight = (sizeDirection[1] - fixedDirection[1]) || keepRatio
                ? Math.max(startOffsetHeight + distHeight, TINY_NUM) : startOffsetHeight;

            if (keepRatio && startOffsetWidth && startOffsetHeight) {
                // startOffsetWidth : startOffsetHeight = nextWidth : nextHeight
                if (isWidth) {
                    nextHeight = nextWidth / ratio;
                } else {
                    nextWidth = nextHeight * ratio;
                }
            }
            return [nextWidth, nextHeight];
        }

        let [boundingWidth, boundingHeight] = getNextBoundingSize();

        if (!parentEvent) {
            datas.setFixedDirection(datas.fixedDirection);

            triggerEvent(moveable, "onBeforeResize", fillParams<OnBeforeResize>(moveable, e, {
                startFixedDirection: datas.startFixedDirection,
                startFixedPosition: datas.startFixedPosition,
                setFixedDirection(nextFixedDirection: number[]) {
                    datas.setFixedDirection(nextFixedDirection);

                    [boundingWidth, boundingHeight] = getNextBoundingSize();

                    return [boundingWidth, boundingHeight];
                },
                setFixedPosition(nextFixedPosition: number[]) {
                    datas.setFixedPosition(nextFixedPosition);

                    [boundingWidth, boundingHeight] = getNextBoundingSize();

                    return [boundingWidth, boundingHeight];
                },
                boundingWidth,
                boundingHeight,
                setSize(size: number[]) {
                    [boundingWidth, boundingHeight] = size;
                },
            }, true));
        }

        let fixedPosition = dragClient;

        if (!dragClient) {
            if (!parentFlag && isPinch) {
                fixedPosition = getAbsolutePosition(moveable, [0, 0]);
            } else {
                fixedPosition = datas.fixedPosition;
            }
        }

        let snapDist = [0, 0];

        if (!isPinch) {
            snapDist = checkSnapResize(
                moveable,
                boundingWidth,
                boundingHeight,
                direction,
                fixedPosition,
                isRequest,
                datas,
            );
        }
        if (parentDist) {
            !parentDist[0] && (snapDist[0] = 0);
            !parentDist[1] && (snapDist[1] = 0);
        }

        function computeSize() {
            if (resizeFormat) {
                [boundingWidth, boundingHeight] = resizeFormat([boundingWidth, boundingHeight]);
            }
            boundingWidth = throttle(boundingWidth, throttleResize!);
            boundingHeight = throttle(boundingHeight, throttleResize!);
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
                // pre-compute before maintaining the ratio
                computeSize();
            }
            if (
                (sizeDirection[0] && !sizeDirection[1])
                || (snapDist[0] && !snapDist[1])
                || (isNoSnap && isWidth)
            ) {
                boundingWidth += snapDist[0];
                boundingHeight = boundingWidth / ratio;
            } else if (
                (!sizeDirection[0] && sizeDirection[1])
                || (!snapDist[0] && snapDist[1])
                || (isNoSnap && !isWidth)
            ) {
                boundingHeight += snapDist[1];
                boundingWidth = boundingHeight * ratio;
            }
        } else {
            boundingWidth += snapDist[0];
            boundingHeight += snapDist[1];

            boundingWidth = Math.max(0, boundingWidth);
            boundingHeight = Math.max(0, boundingHeight);
        }

        [boundingWidth, boundingHeight] = calculateBoundSize(
            [boundingWidth, boundingHeight],
            minSize,
            maxSize,
            keepRatio ? ratio : false,
        );
        computeSize();

        if (keepRatio && (isGroup || keepRatioFinally)) {
            if (isWidth) {
                boundingHeight = boundingWidth / ratio;
            } else {
                boundingWidth = boundingHeight * ratio;
            }
        }
        distWidth = boundingWidth - startOffsetWidth;
        distHeight = boundingHeight - startOffsetHeight;

        const delta = [distWidth - prevWidth, distHeight - prevHeight];

        datas.prevWidth = distWidth;
        datas.prevHeight = distHeight;

        const inverseDelta = getResizeDist(
            moveable,
            boundingWidth,
            boundingHeight,
            fixedPosition,
            transformOrigin,
            datas,
        );

        if (!parentMoveable && delta.every(num => !num) && inverseDelta.every(num => !num)) {
            return;
        }
        const drag = Draggable.drag(
            moveable,
            setCustomDrag(e, moveable.state, inverseDelta, !!isPinch, false, "draggable"),
        ) as OnDrag;
        const transform = drag.transform;

        const nextWidth = startWidth + distWidth;
        const nextHeight = startHeight + distHeight;

        const params = fillParams<OnResize>(moveable, e, {
            width: nextWidth,
            height: nextHeight,
            offsetWidth: Math.round(boundingWidth),
            offsetHeight: Math.round(boundingHeight),
            startRatio: ratio,
            boundingWidth,
            boundingHeight,
            direction,
            dist: [distWidth, distHeight],
            delta,
            isPinch: !!isPinch,
            drag,
            ...fillAfterTransform({
                style: {
                    width: `${nextWidth}px`,
                    height: `${nextHeight}px`,
                },
                transform,
            }, drag, e),
        });
        !parentEvent && triggerEvent(moveable, "onResize", params);
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

        if (!isResize || moveable.props.checkResizableError === false) {
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
            return this.dragControl(moveable, e);
        }
    },
    dragControlEnd(
        moveable: MoveableManagerInterface<ResizableProps & DraggableProps>,
        e: any,
    ) {
        const { datas, parentEvent } = e;
        if (!datas.isResize) {
            return;
        }
        datas.isResize = false;

        const params = fillEndParams<OnResizeEnd>(moveable, e, {});
        !parentEvent && triggerEvent(moveable, "onResizeEnd", params);
        return params;
    },
    dragGroupControlCondition: directionCondition,
    dragGroupControlStart(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { datas } = e;
        const params = this.dragControlStart(moveable, {...e, isGroup: true });

        if (!params) {
            return false;
        }
        const originalEvents = fillChildEvents(moveable, "resizable", e);
        const {
            startOffsetWidth: parentStartOffsetWidth,
            startOffsetHeight: parentStartOffsetHeight,
        } = datas;

        function updateGroupMin() {
            const originalMinSize = datas.minSize;
            originalEvents.forEach(ev => {
                const {
                    minSize: childMinSize,
                    startOffsetWidth: childStartOffsetWidth,
                    startOffsetHeight: childStartOffsetHeight,
                } = ev.datas;

                const parentMinWidth = parentStartOffsetWidth
                    * (childStartOffsetWidth ? childMinSize[0] / childStartOffsetWidth : 0);
                const parentMinHeight = parentStartOffsetHeight
                    * (childStartOffsetHeight ? childMinSize[1] / childStartOffsetHeight : 0);

                originalMinSize[0] = Math.max(originalMinSize[0], parentMinWidth);
                originalMinSize[1] = Math.max(originalMinSize[1], parentMinHeight);
            });
        }

        function updateGroupMax() {
            const originalMaxSize = datas.maxSize;
            originalEvents.forEach(ev => {
                const {
                    maxSize: childMaxSize,
                    startOffsetWidth: childStartOffsetWidth,
                    startOffsetHeight: childStartOffsetHeight,
                } = ev.datas;

                const parentMaxWidth = parentStartOffsetWidth
                    * (childStartOffsetWidth ? childMaxSize[0] / childStartOffsetWidth : 0);
                const parentMaxHeight = parentStartOffsetHeight
                    * (childStartOffsetHeight ? childMaxSize[1] / childStartOffsetHeight : 0);

                originalMaxSize[0] = Math.min(originalMaxSize[0], parentMaxWidth);
                originalMaxSize[1] = Math.min(originalMaxSize[1], parentMaxHeight);
            });
        }
        const events = triggerChildAbles(
            moveable,
            this,
            "dragControlStart",
            e,
            (child, ev) => {
                return startChildDist(moveable, child, datas, ev);
            },
        );


        updateGroupMin();
        updateGroupMax();

        const setFixedDirection = (fixedDirection: number[]) => {
            params.setFixedDirection(fixedDirection);
            events.forEach((ev, i) => {
                ev.setFixedDirection(fixedDirection);
                startChildDist(moveable, ev.moveable, datas, originalEvents[i]);
            });
        };

        datas.setFixedDirection = setFixedDirection;

        const nextParams: OnResizeGroupStart = {
            ...params,
            targets: moveable.props.targets!,
            events: events.map(ev => {
                return {
                    ...ev,
                    setMin: (minSize: Array<number | string>) => {
                        ev.setMin(minSize);
                        updateGroupMin();
                    },
                    setMax: (maxSize: Array<number | string>) => {
                        ev.setMax(maxSize);
                        updateGroupMax();
                    },
                };
            }),
            setFixedDirection,
            setMin: (minSize: Array<number | string>) => {
                params.setMin(minSize);
                updateGroupMin();
            },
            setMax: (maxSize: Array<number | string>) => {
                params.setMax(maxSize);
                updateGroupMax();
            },
        };
        const result = triggerEvent(moveable, "onResizeGroupStart", nextParams);

        datas.isResize = result !== false;
        return datas.isResize ? params : false;
    },
    dragGroupControl(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { datas } = e;
        if (!datas.isResize) {
            return;
        }
        const props = getProps(moveable.props, "resizable");

        catchEvent(moveable, "onBeforeResize", parentEvent => {
            triggerEvent(moveable, "onBeforeResizeGroup", fillParams<OnBeforeResizeGroup>(moveable, e, {
                ...parentEvent,
                targets: props.targets!,
            }, true));
        });


        const params = this.dragControl(moveable, {...e, isGroup: true });

        if (!params) {
            return;
        }
        const {
            boundingWidth,
            boundingHeight,
            dist,
        } = params;

        const keepRatio = props.keepRatio;

        const parentScale = [
            boundingWidth / (boundingWidth - dist[0]),
            boundingHeight / (boundingHeight - dist[1]),
        ];
        const fixedPosition = datas.fixedPosition;

        const events = triggerChildAbles(
            moveable,
            this,
            "dragControl",
            e,
            (_, ev) => {
                const [clientX, clientY] = calculate(
                    createRotateMatrix(moveable.rotation / 180 * Math.PI, 3),
                    [
                        ev.datas.originalX * parentScale[0],
                        ev.datas.originalY * parentScale[1],
                        1,
                    ],
                    3,
                );

                return {
                    ...ev,
                    parentDist: null,
                    parentScale,
                    dragClient: plus(fixedPosition, [clientX, clientY]),
                    parentKeepRatio: keepRatio,
                };
            },
        );
        const nextParams: OnResizeGroup = {
            targets: props.targets!,
            events,
            ...params,
        };

        triggerEvent(moveable, "onResizeGroup", nextParams);
        return nextParams;
    },
    dragGroupControlEnd(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { isDrag, datas } = e;

        if (!datas.isResize) {
            return;
        }

        this.dragControlEnd(moveable, e);
        const events = triggerChildAbles(moveable, this, "dragControlEnd", e);

        const nextParams: OnResizeGroupEnd = fillEndParams<OnResizeGroupEnd>(moveable, e, {
            targets: moveable.props.targets!,
            events,
        });

        triggerEvent(moveable, "onResizeGroupEnd", nextParams);
        return isDrag;
    },
    /**
     * @method Moveable.Resizable#request
     * @param {Moveable.Resizable.ResizableRequestParam} e - the Resizable's request parameter
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
        const datas: Record<string, any> = {};
        let distWidth = 0;
        let distHeight = 0;
        const rect = moveable.getRect();

        return {
            isControl: true,
            requestStart(e: ResizableRequestParam) {
                return { datas, parentDirection: e.direction || [1, 1], parentIsWidth: e?.horizontal ?? true };
            },
            request(e: ResizableRequestParam) {
                if ("offsetWidth" in e) {
                    distWidth = e.offsetWidth! - rect.offsetWidth;
                } else if ("deltaWidth" in e) {
                    distWidth += e.deltaWidth!;
                }
                if ("offsetHeight" in e) {
                    distHeight = e.offsetHeight! - rect.offsetHeight;
                } else if ("deltaHeight" in e) {
                    distHeight += e.deltaHeight!;
                }


                return { datas, parentDist: [distWidth, distHeight], parentKeepRatio: e.keepRatio };
            },
            requestEnd() {
                return { datas, isDrag: true };
            },
        };
    },
    unset(moveable: MoveableManagerInterface<any, {}>) {
        moveable.state.gestos.resizable = null;
    },
};

/**
 * Whether or not target can be resized.
 * @name Moveable.Resizable#resizable
 * @default false
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
 * throttle of width, height when resize. If throttleResize is set to less than 1, the target may shake.
 * @name Moveable.Resizable#throttleResize
 * @default 1
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   resizable: true,
 *   throttleResize: 1,
 * });
 *
 * moveable.throttleResize = 0;
 */
/**
 * When resize or scale, keeps a ratio of the width, height.
 * @name Moveable.Resizable#keepRatio
 * @default false
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
 * Set directions to show the control box.
 * @name Moveable.Resizable#renderDirections
 * @default ["n", "nw", "ne", "s", "se", "sw", "e", "w"]
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
 * Function to convert size for resize
 * @name Moveable.Resizable#resizeFormat
 * @default oneself
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   resizable: true,
 *   resizeFormat: v => v,
 * });
 *
 * moveable.resizeFormat = (size: number[]) => ([Math.trunc(size[0]), Math.trunc(size[1])];
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
 * When resizing, `beforeResize` is called before `resize` occurs. In `beforeResize`, you can get and set the pre-value before resizing.
 * @memberof Moveable.Resizable
 * @event beforeResize
 * @param {Moveable.Resizable.OnBeforeResize} - Parameters for the `beforeResize` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("beforeResize", ({ setFixedDirection }) => {
 *     if (shiftKey) {
 *        setFixedDirection([0, 0]);
 *     }
 * });
 * moveable.on("resize", ({ target, width, height, drag }) => {
 *     target.style.width = `${width}px`;
 *     target.style.height = `${height}px`;
 *     target.style.transform = drag.transform;
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
