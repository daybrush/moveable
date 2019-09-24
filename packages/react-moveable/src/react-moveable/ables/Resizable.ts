import { throttle, getDirection, triggerEvent } from "../utils";
import { setDragStart, getDragDist, setSizeInfo, getResizeDist } from "../DraggerUtils";
import {
    ResizableProps, OnResizeGroup, OnResizeGroupEnd,
    Renderer, OnResizeGroupStart, DraggableProps, OnDragStart, OnDrag,
} from "../types";
import MoveableManager from "../MoveableManager";
import { renderAllDirection, renderDiagonalDirection } from "../renderDirection";
import MoveableGroup from "../MoveableGroup";
import {
    triggerChildAble, setCustomEvent, getCustomEvent, directionCondition, getCustomPrevClient,
} from "../groupUtils";
import Draggable from "./Draggable";
import { getRad, caculate, createRotateMatrix } from "@moveable/matrix";
import { checkSnapSize } from "./Snappable";

export default {
    name: "resizable",
    dragControlOnly: true,
    updateRect: true,
    canPinch: true,

    render(moveable: MoveableManager<Partial<ResizableProps>>, React: Renderer): any[] | undefined {
        const { resizable, edge } = moveable.props;
        if (resizable) {
            if (edge) {
                return renderDiagonalDirection(moveable, React);
            }
            return renderAllDirection(moveable, React);
        }
    },
    dragControlCondition: directionCondition,
    dragControlStart(
        moveable: MoveableManager<ResizableProps & DraggableProps>,
        e: any,
    ) {
        const {
            inputEvent,
            pinchFlag,
            clientX,
            clientY,
            datas,
            dragClient = [0, 0],
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

        setSizeInfo(moveable, e);

        const params = {
            datas: datas.datas,
            target,
            clientX,
            clientY,
            set: (startWidth: number, startHeight: number) => {
                datas.width = startWidth;
                datas.height = startHeight;
            },
            dragStart: Draggable.dragStart(
                moveable,
                setCustomEvent(dragClient[0], dragClient[1], datas, inputEvent),
            ) as OnDragStart,
        };
        const result = triggerEvent(moveable, "onResizeStart", params);
        if (result !== false) {
            datas.isResize = true;
        }
        return datas.isResize ? params : false;
    },
    dragControl(
        moveable: MoveableManager<ResizableProps & DraggableProps>,
        e: any,
    ) {
        const {
            datas,
            clientX,
            clientY,
            distX, distY,
            pinchFlag, parentDistance, parentScale, inputEvent,
            dragClient = getCustomPrevClient(datas),
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
        } = datas;

        if (!isResize) {
            return;
        }
        const {
            keepRatio,
            throttleResize = 0,
            parentMoveable,
        } = moveable.props;
        const {
            target,
        } = moveable.state;

        // checkSnapSize(moveable as any, e, 1);
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

            if (
                keepRatio
                && direction[0] && direction[1]
                && offsetWidth && offsetHeight
            ) {
                const size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
                const rad = getRad([0, 0], dist);
                const standardRad = getRad([0, 0], direction);
                const distDiagonal = Math.cos(rad - standardRad) * size;

                distWidth = distDiagonal;
                distHeight = distDiagonal * offsetHeight / offsetWidth;
            }
        }
        const nextWidth = direction[0]
            ? throttle(Math.max(offsetWidth + distWidth, 0), throttleResize!)
            : offsetWidth;
        const nextHeight = direction[1]
            ? throttle(Math.max(offsetHeight + distHeight, 0), throttleResize!)
            : offsetHeight;

        distWidth = nextWidth - offsetWidth;
        distHeight = nextHeight - offsetHeight;

        const delta = [distWidth - prevWidth, distHeight - prevHeight];

        datas.prevWidth = distWidth;
        datas.prevHeight = distHeight;

        if (!parentMoveable && delta.every(num => !num)) {
            return;
        }

        let inverseDist = [0, 0];

        if (!pinchFlag && !parentScale) {
            inverseDist = getResizeDist(moveable, e, nextWidth, nextHeight, direction);
        }
        const params = {
            target: target!,
            width: width + distWidth,
            height: height + distHeight,
            offsetWidth: nextWidth,
            offsetHeight: nextHeight,
            direction,
            dist: [distWidth, distHeight],
            datas: datas.datas,
            delta,
            clientX,
            clientY,
            isPinch: !!pinchFlag,
            drag: Draggable.drag(
                moveable,
                setCustomEvent(dragClient[0] + inverseDist[0], dragClient[1] + inverseDist[1], datas, inputEvent),
            ) as OnDrag,
        };
        triggerEvent(moveable, "onResize", params);
        return params;
    },
    dragControlEnd(moveable: MoveableManager<ResizableProps>, { datas, isDrag, clientX, clientY }: any) {
        if (!datas.isResize) {
            return false;
        }
        datas.isResize = false;

        triggerEvent(moveable, "onResizeEnd", {
            target: moveable.state.target!,
            datas: datas.datas,
            clientX,
            clientY,
            isDrag,
        });
        return isDrag;
    },
    dragGroupControlCondition: directionCondition,
    dragGroupControlStart(moveable: MoveableGroup, e: any) {
        const { datas, inputEvent } = e;
        const {
            left: parentLeft,
            top: parentTop,
            pos1, pos2, pos3, pos4,
        } = moveable.state;
        const startLeft = parentLeft + Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const startTop = parentTop + Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);

        const params = this.dragControlStart(moveable, e);

        if (!params) {
            return false;
        }
        const events = triggerChildAble(
            moveable,
            this,
            "dragControlStart",
            datas,
            (child, childDatas) => {
                const { left, top } = child.state;
                const startX = left - startLeft;
                const startY = top - startTop;

                const [originalX, originalY] = caculate(
                    createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3),
                    [startX, startY, 1],
                    3,
                );
                childDatas.originalX = originalX;
                childDatas.originalY = originalY;
                return { ...e, parentRotate: 0, dragClient: [left - startLeft, top - startTop] };
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
            width, height, dist,
            drag: {
                beforeDist,
            },
        } = params;

        const parentScale = [
            width / (width - dist[0]),
            height / (height - dist[1]),
        ];

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

                return { ...e, parentScale, dragClient: [clientX + beforeDist[0], clientY + beforeDist[1]] };
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
        const { clientX, clientY, isDrag, datas } = e;

        if (!datas.isResize) {
            return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);

        const nextParams: OnResizeGroupEnd = {
            targets: moveable.props.targets!,
            clientX,
            clientY,
            isDrag,
            datas: datas.datas,
        };

        triggerEvent(moveable, "onResizeGroupEnd", nextParams);
        return isDrag;
    },
};
