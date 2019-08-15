import { getRad, throttle, prefix, getDirection, triggerEvent } from "../utils";
import { setDragStart, getDragDist } from "../DraggerUtils";
import { ResizableProps } from "../types";
import MoveableManager from "../MoveableManager";
import { renderAllDirection } from "../renderDirection";
import { hasClass } from "@daybrush/utils";

export default {
    name: "resizable",
    dragControlOnly: true,
    updateRect: true,

    render(moveable: MoveableManager<Partial<ResizableProps>>) {
        if (moveable.props.resizable) {
            return renderAllDirection(moveable);
        }
    },
    dragControlCondition(target: HTMLElement | SVGElement) {
        return hasClass(target, prefix("direction"));
    },
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
};
