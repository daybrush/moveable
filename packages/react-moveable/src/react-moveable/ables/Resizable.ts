import { throttle, getDirection, triggerEvent, getAbsolutePosesByState, fillParams } from "../utils";
import {
    setDragStart,
    getDragDist,
    getResizeDist,
    getPosByReverseDirection,
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
        datas.offsetWidth = width;
        datas.offsetHeight = height;
        datas.prevWidth = 0;
        datas.prevHeight = 0;
        datas.width = width;
        datas.height = height;
        datas.transformOrigin = moveable.props.transformOrigin;

        const params = fillParams<OnResizeStart>(moveable, e, {
            direction,
            set: ([startWidth, startHeight]: number[]) => {
                datas.width = startWidth;
                datas.height = startHeight;
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
            moveable.state.snapDirection = direction;
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
            dragClient,
        } = e;
        const {
            direction,
            width,
            height,
            offsetWidth,
            offsetHeight,
            prevWidth,
            prevHeight,
            isResize,
            transformOrigin,
        } = datas;

        if (!isResize) {
            return;
        }
        const {
            keepRatio,
            throttleResize = 0,
            parentMoveable,
        } = moveable.props;

        let distWidth: number = 0;
        let distHeight: number = 0;

        // diagonal
        if (parentScale) {
            distWidth = (parentScale[0] - 1) * offsetWidth;
            distHeight = (parentScale[1] - 1) * offsetHeight;

        } else if (pinchFlag) {
            if (parentDistance) {
                distWidth = parentDistance;
                distHeight = parentDistance * offsetHeight / offsetWidth;
            }
        } else {
            const dist = getDragDist({ datas, distX, distY });

            distWidth = direction[0] * dist[0];
            distHeight = direction[1] * dist[1];

            if (keepRatio && offsetWidth && offsetHeight) {
                const size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
                const rad = getRad([0, 0], dist);
                const standardRad = getRad([0, 0], direction);
                const distDiagonal = Math.cos(rad - standardRad) * size;
                const isWidth = direction[0] || !direction[1];

                distWidth = isWidth ? distDiagonal : distDiagonal * offsetWidth / offsetHeight;
                distHeight = isWidth ? distDiagonal * offsetHeight / offsetWidth : distDiagonal;
            }
        }
        let nextWidth = direction[0]
            ? throttle(Math.max(offsetWidth + distWidth, 0), throttleResize!)
            : offsetWidth;
        let nextHeight = direction[1]
            ? throttle(Math.max(offsetHeight + distHeight, 0), throttleResize!)
            : offsetHeight;

        if (!pinchFlag) {
            [nextWidth, nextHeight] = checkSnapSize(moveable, nextWidth, nextHeight, direction, datas);
        }

        if (keepRatio && (!direction[0] || !direction[1])) {
            if (direction[0]) {
                nextHeight = throttle(nextWidth * offsetHeight / offsetWidth, throttleResize!);
            } else {
                nextWidth = throttle(nextHeight * offsetWidth / offsetHeight, throttleResize!);
            }
        }
        nextWidth = Math.round(nextWidth);
        nextHeight = Math.round(nextHeight);

        distWidth = nextWidth - offsetWidth;
        distHeight = nextHeight - offsetHeight;

        const delta = [distWidth - prevWidth, distHeight - prevHeight];

        datas.prevWidth = distWidth;
        datas.prevHeight = distHeight;

        if (!parentMoveable && delta.every(num => !num)) {
            return;
        }

        const inverseDelta = !parentFlag && pinchFlag
            ? [0, 0]
            : getResizeDist(moveable, nextWidth, nextHeight, direction, transformOrigin, dragClient);

        const params = fillParams<OnResize>(moveable, e, {
            width: width + distWidth,
            height: height + distHeight,
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
            direction,
        } = params;

        const parentScale = [
            offsetWidth / (offsetWidth - dist[0]),
            offsetHeight / (offsetHeight - dist[1]),
        ];
        const prevPos = getPosByReverseDirection(getAbsolutePosesByState(moveable.state), direction);

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

                return { ...e, parentScale, dragClient: plus(prevPos, [clientX, clientY]) };
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
