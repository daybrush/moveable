import {
    throttle, getDirection, triggerEvent,
    getAbsolutePosesByState, fillParams, getKeepRatioHeight, getKeepRatioWidth, getCSSSize, getDistSize,
} from "../utils";
import {
    setDragStart,
    getDragDist,
    getResizeDist,
    getPosByReverseDirection,
    getFixedPosition,
    getStartDirection,
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
    triggerChildAble, directionCondition,
} from "../groupUtils";
import Draggable from "./Draggable";
import { getRad, caculate, createRotateMatrix, plus } from "@moveable/matrix";
import CustomDragger, { setCustomDrag } from "../CustomDragger";
import { checkSnapSize } from "./Snappable";

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
            pinchFlag,
            datas,
        } = e;
        const {
            target: inputTarget,
        } = inputEvent;

        const direction = pinchFlag ? [1, 1] : getDirection(inputTarget);
        const { target, width, height } = moveable.state;

        if (!direction || !target) {
            return false;
        }
        !pinchFlag && setDragStart(moveable, { datas });

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
        datas.fixedPosition = getFixedPosition(moveable, datas.startDirection);
        datas.fixedOriginalPosition = getFixedPosition(moveable, direction);

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
            parentFlag, pinchFlag,
            parentDistance, parentScale, inputEvent,
            parentKeepRatio,
            dragClient,
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
        const keepRatio = moveable.props.keepRatio || parentKeepRatio;
        const isWidth = direction[0] || !direction[1];
        const ratio = isWidth ? startOffsetHeight / startOffsetWidth : startOffsetWidth / startOffsetHeight;
        let distWidth: number = 0;
        let distHeight: number = 0;

        if (parentScale) {
            distWidth = (parentScale[0] - 1) * startOffsetWidth;
            distHeight = (parentScale[1] - 1) * startOffsetHeight;

        } else if (pinchFlag) {
            if (parentDistance) {
                distWidth = parentDistance;
                distHeight = parentDistance * startOffsetHeight / startOffsetWidth;
            }
        } else {
            const dist = getDragDist({ datas, distX, distY });

            distWidth = direction[0] * dist[0];
            distHeight = direction[1] * dist[1];

            if (keepRatio && startOffsetWidth && startOffsetHeight) {
                const rad = getRad([0, 0], dist);
                const standardRad = getRad([0, 0], direction);
                const ratioRad = getRad([0, 0], [startOffsetWidth, startOffsetHeight]);
                const size = getDistSize([distWidth, distHeight]);
                const signSize = Math.cos(rad - standardRad) * size;

                if (!direction[0]) {
                    // top, bottom
                    distHeight = signSize;
                    distWidth = getKeepRatioWidth(distHeight, isWidth, ratio);
                } else if (!direction[1]) {
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
        let nextWidth = direction[0] || keepRatio ? Math.max(startOffsetWidth + distWidth, 0) : startOffsetWidth;
        let nextHeight = direction[1] || keepRatio ? Math.max(startOffsetHeight + distHeight, 0) : startOffsetHeight;

        let snapDist = [0, 0];

        if (!pinchFlag) {
            snapDist = checkSnapSize(moveable, nextWidth, nextHeight, direction, datas);
        }
        if (keepRatio) {
            if (direction[0] && direction[1] && snapDist[0] && snapDist[1]) {
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
                (direction[0] && !direction[1])
                || (snapDist[0] && !snapDist[1])
                || (isNoSnap && isWidth)
            ) {
                nextWidth += snapDist[0];
                nextHeight = getKeepRatioHeight(nextWidth, isWidth, ratio);
            } else if (
                (!direction[0] && direction[1])
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

        const startDirection = keepRatio || parentFlag ? direction : datas.startDirection;
        const fixedPosition = dragClient || (keepRatio ? datas.fixedOriginalPosition : datas.fixedPosition);

        const inverseDelta = !parentFlag && pinchFlag
            ? [0, 0]
            : getResizeDist(
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
            isPinch: !!pinchFlag,
            drag: Draggable.drag(
                moveable,
                setCustomDrag(moveable.state, inverseDelta, inputEvent),
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
        const startPos = getPosByReverseDirection(getAbsolutePosesByState(moveable.state), direction);

        const events = triggerChildAble(
            moveable,
            this,
            "dragControlStart",
            datas,
            (child, childDatas) => {
                const pos = getPosByReverseDirection(getAbsolutePosesByState(child.state), direction);
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
};
