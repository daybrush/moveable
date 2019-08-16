import { getRad, throttle, prefix, getDirection, triggerEvent } from "../utils";
import { setDragStart, getDragDist } from "../DraggerUtils";
import { ResizableProps, OnRotateGroup, OnRotateGroupEnd, OnResizeGroup, OnResizeGroupEnd } from "../types";
import MoveableManager from "../MoveableManager";
import { renderAllDirection } from "../renderDirection";
import { hasClass } from "@daybrush/utils";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble, setCustomEvent, getCustomEvent } from "../groupUtils";
import { sum, minus, rotate } from "../matrix";
import Draggable from "./Draggable";

function dragControlCondition(target: HTMLElement | SVGElement) {
    return hasClass(target, prefix("direction"));
}

export default {
    name: "resizable",
    dragControlOnly: true,
    updateRect: true,

    render(moveable: MoveableManager<Partial<ResizableProps>>) {
        if (moveable.props.resizable) {
            return renderAllDirection(moveable);
        }
    },
    dragControlCondition,
    dragControlStart(
        moveable: MoveableManager<ResizableProps>,
        e: any,
    ) {
        const {
            inputEvent: {
                target: inputTarget,
            },
            pinchFlag,
            direction = getDirection(inputTarget),
        } = e;

        const { target, width, height } = moveable.state;
        const { clientX, clientY, datas } = e;

        if (!direction || !target) {
            return false;
        }
        !pinchFlag && setDragStart(moveable, { datas });

        datas.datas = {};
        datas.direction = direction;
        datas.width = width;
        datas.height = height;
        datas.prevWidth = 0;
        datas.prevHeight = 0;

        const result = triggerEvent(moveable, "onResizeStart", {
            datas: datas.datas,
            target,
            clientX,
            clientY,
        });
        if (result !== false) {
            datas.isResize = true;
        }
        return result;
    },
    dragControl(
        moveable: MoveableManager<ResizableProps>,
        { datas, clientX, clientY, distX, distY, pinchFlag, pinchDistance }: any,
    ) {
        const {
            direction,
            width,
            height,
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
        } = moveable.props;
        const {
            target,
        } = moveable.state;

        let distWidth: number = 0;
        let distHeight: number = 0;

        // diagonal
        if (pinchFlag) {
            if (pinchDistance) {
                distWidth = pinchDistance;
                distHeight = pinchDistance * height / width;
            }
        } else {
            const dist = getDragDist({ datas, distX, distY });

            distWidth = direction[0] * dist[0];
            distHeight = direction[1] * dist[1];
            if (
                keepRatio
                && direction[0] && direction[1]
                && width && height
            ) {
                const size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
                const rad = getRad([0, 0], dist);
                const standardRad = getRad([0, 0], direction);
                const distDiagonal = Math.cos(rad - standardRad) * size;

                distWidth = distDiagonal;
                distHeight = distDiagonal * height / width;
            }
        }
        distWidth = throttle(distWidth, throttleResize!);
        distHeight = throttle(distHeight, throttleResize!);

        const nextWidth = width + distWidth;
        const nextHeight = height + distHeight;
        const delta = [distWidth - prevWidth, distHeight - prevHeight];

        datas.prevWidth = distWidth;
        datas.prevHeight = distHeight;

        if (delta.every(num => !num)) {
            return;
        }
        const params = {
            target: target!,
            width: nextWidth,
            height: nextHeight,
            direction,
            dist: [distWidth, distHeight],
            datas: datas.datas,
            delta,
            clientX,
            clientY,
            isPinch: !!pinchFlag,
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
    dragGroupControlCondition: dragControlCondition,
    dragGroupControlStart(moveable: MoveableGroup, e: any) {
        const { clientX, clientY, datas, inputEvent } = e;

        triggerChildAble(
            moveable,
            this,
            "dragControlStart",
            { ...e, parentRotate: 0 },
            (child, childDatas) => {
                const { left, top } = child.state;
                const dragDatas = childDatas.drag || (childDatas.drag = {});

                Draggable.dragStart(
                    child,
                    setCustomEvent(left, top, dragDatas, inputEvent),
                );
            },
        );

        this.dragControlStart(moveable, e);

        const result = triggerEvent(moveable, "onResizeGroupStart", {
            targets: moveable.props.targets!,
            clientX,
            clientY,
        });

        datas.isResize = result !== false;
        return datas.isDrag;
    },
    dragGroupControl(moveable: MoveableGroup, e: any) {
        const { inputEvent, datas } = e;
        if (!datas.isResize) {
            return;
        }
        const params = this.dragControl(moveable, e);

        if (!params) {
            return;
        }
        const {width, height, dist } = params;
        const parentScale = [
            width / (width - dist[0]),
            height / (height - dist[1]),
        ];
        const events = triggerChildAble(
            moveable,
            this,
            "dragControl",
            { ...e, parentScale },
            (child, childDatas, result, i) => {
                const dragDatas = childDatas.drag || (childDatas.drag = {});
                const { startX, startY } = getCustomEvent(dragDatas);
                const clientX = parentScale[0] * startX;
                const clientY = parentScale[1] * startY;

                const dragResult = Draggable.drag(
                    child,
                    setCustomEvent(clientX, clientY, dragDatas, inputEvent),
                );

                result.drag = dragResult;
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
        if (!e.datas.isResize) {
            return;
        }
        const { clientX, clientY, isDrag } = e;

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", e);

        const nextParams: OnResizeGroupEnd = {
            targets: moveable.props.targets!,
            clientX,
            clientY,
            isDrag,
        };

        triggerEvent(moveable, "onResizeGroupEnd", nextParams);
        return isDrag;
    },
};
