import {
    throttle, getDirection, triggerEvent,
    fillParams, getKeepRatioHeight, getKeepRatioWidth, getCSSSize, getDistSize,
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
    OnResize, OnResizeEnd,
} from "../types";
import MoveableManager from "../MoveableManager";
import { renderAllDirections, renderDiagonalDirections } from "../renderDirection";
import MoveableGroup from "../MoveableGroup";
import {
    triggerChildAble,
} from "../groupUtils";
import Draggable from "./Draggable";
import { getRad, caculate, createRotateMatrix, plus } from "@moveable/matrix";
import CustomDragger, { setCustomDrag } from "../CustomDragger";
import { checkSnapSize } from "./Snappable";
import {
    directionCondition,
} from "./utils";
import { IObject } from "@daybrush/utils";
import { TINY_NUM } from "../consts";

/**
 * @namespace Resizable
 * @memberof Moveable
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
        baseDirection: Array,
        keepRatio: Boolean,
    },
    render(moveable: MoveableManager<Partial<ResizableProps>>, React: Renderer): any[] | undefined {
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
        moveable: MoveableManager<ResizableProps & DraggableProps, SnappableState>,
        e: any,
    ) {
        const {
            inputEvent,
            isPinch,
            parentDirection,
            datas,
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
        datas.transformOrigin = moveable.props.transformOrigin;
        datas.startDirection = getStartDirection(moveable, direction);
        datas.fixedPosition = getAbsoluteFixedPosition(moveable, datas.startDirection);
        datas.fixedOriginalPosition = getAbsoluteFixedPosition(moveable, direction);

        const params = fillParams<OnResizeStart>(moveable, e, {
            direction,
            set: ([startWidth, startHeight]: number[]) => {
                datas.startWidth = startWidth;
                datas.startHeight = startHeight;
            },
            setOrigin: (origin: Array<string | number>) => {
                datas.transformOrigin = origin;
            },
            dragStart: Draggable.dragStart(
                moveable,
                new CustomDragger().dragStart([0, 0], inputEvent),
            ),
        });
        const result = triggerEvent(moveable, "onResizeStart", params);
        if (result !== false) {
            datas.isResize = true;
            moveable.state.snapRenderInfo = {
                direction,
            };
        }
        return datas.isResize ? params : false;
    },
    dragControl(
        moveable: MoveableManager<ResizableProps & DraggableProps>,
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
                parentDist,
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
        nextWidth = Math.round(nextWidth);
        nextHeight = Math.round(nextHeight);

        distWidth = nextWidth - startOffsetWidth;
        distHeight = nextHeight - startOffsetHeight;

        const delta = [distWidth - prevWidth, distHeight - prevHeight];

        datas.prevWidth = distWidth;
        datas.prevHeight = distHeight;

        if (!parentMoveable && delta.every(num => !num)) {
            return;
        }

        const inverseDelta = getResizeDist(
                moveable,
                nextWidth, nextHeight,
                startDirection, fixedPosition, transformOrigin);

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
        triggerEvent(moveable, "onResize", params);
        return params;
    },
    dragControlAfter(
        moveable: MoveableManager<ResizableProps & DraggableProps>,
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
        moveable: MoveableManager<ResizableProps & DraggableProps>,
        e: any,
    ) {
        const { datas, isDrag } = e;
        if (!datas.isResize) {
            return false;
        }
        datas.isResize = false;

        const params = fillParams<OnResizeEnd>(moveable, e, {
            isDrag,
        });
        triggerEvent(moveable, "onResizeEnd", params);
        return isDrag;
    },
    dragGroupControlCondition: directionCondition,
    dragGroupControlStart(moveable: MoveableGroup, e: any) {
        const { datas } = e;
        const params = this.dragControlStart(moveable, e);

        if (!params) {
            return false;
        }
        const direction = params.direction;
        const startPos = getAbsoluteFixedPosition(moveable, direction);

        const events = triggerChildAble(
            moveable,
            this,
            "dragControlStart",
            datas,
            (child, childDatas) => {
                const pos = getAbsoluteFixedPosition(child, direction);
                const [originalX, originalY] = caculate(
                    createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3),
                    [pos[0] - startPos[0], pos[1] - startPos[1], 1],
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
        const result = triggerEvent(moveable, "onResizeGroupStart", nextParams);

        datas.isResize = result !== false;
        return datas.isResize ? params : false;
    },
    dragGroupControl(moveable: MoveableGroup, e: any) {
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
        const fixedPosition = getAbsoluteFixedPosition(moveable, datas.direction);

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

        triggerEvent(moveable, "onResizeGroup", nextParams);
        return nextParams;
    },
    dragGroupControlEnd(moveable: MoveableGroup, e: any) {
        const { isDrag, datas } = e;

        if (!datas.isResize) {
            return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);

        const nextParams: OnResizeGroupEnd = fillParams<OnResizeGroupEnd>(moveable, e, {
            targets: moveable.props.targets!,
            isDrag,
        });

        triggerEvent(moveable, "onResizeGroupEnd", nextParams);
        return isDrag;
    },
    /**
     * @method Moveable.Resizable#request
     * @param {object} [e] - the Resizable's request parameter
     * @param {number} [e.direction=[1, 1]] - Direction to resize
     * @param {number} [e.deltaWidth] - delta number of width
     * @param {number} [e.deltaHeight] - delta number of height
     * @param {number} [e.isInstant] - Whether to execute the request instantly
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * // Use Relative Value
     * moveable.request("resizable", { deltaWidth: 10, deltaHeight: 10, isInstant: true });
     *
     * // Use Absolute Value
     * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100, isInstant: true });
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
     * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100, isInstant: true });
     * moveable.request("resizable", { offsetWidth: 110, offsetHeight: 100, isInstant: true });
     * moveable.request("resizable", { offsetWidth: 120, offsetHeight: 100, isInstant: true });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request(moveable: MoveableManager<any>) {
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
