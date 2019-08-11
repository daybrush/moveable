import { getRad, throttle, prefix, getDirection } from "../utils";
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
        { datas, clientX, clientY, pinchFlag, inputEvent: { target: inputTarget } }: any) {

        const direction = getDirection(inputTarget);
        const { target, onResizeStart } = moveable.props;

        if (!target || !direction) {
            return false;
        }
        const { width, height } = moveable.state;

        !pinchFlag && setDragStart(moveable, { datas });

        datas.datas = {};
        datas.direction = direction;
        datas.width = width;
        datas.height = height;
        datas.prevWidth = 0;
        datas.prevHeight = 0;

        const result = onResizeStart && onResizeStart!({
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
            return false;
        }
        const {
            target,
            keepRatio,
            throttleResize = 0,
            onResize,
        } = moveable.props;
        let distWidth: number;
        let distHeight: number;

        // diagonal
        if (pinchFlag) {
            distWidth = pinchDistance;
            distHeight = pinchDistance * height / width;
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
            return false;
        }
        onResize && onResize({
            target: target!,
            width: nextWidth,
            height: nextHeight,
            dist: [distWidth, distHeight],
            datas: datas.datas,
            delta,
            clientX,
            clientY,
            isPinch: !!pinchFlag,
        });

        return true;
    },
    dragControlEnd(moveable: MoveableManager<ResizableProps>, { datas, isDrag, clientX, clientY, pinchFlag }: any) {
        if (!datas.isResize) {
            return false;
        }
        const { target, onResizeEnd } = moveable.props;
        datas.isResize = false;
        onResizeEnd && onResizeEnd({
            target: target!,
            datas: datas.datas,
            clientX,
            clientY,
            isDrag,
        });
        return isDrag;
    },
};
