import { getRad, throttle, prefix, getDirection } from "../utils";
import { MIN_SCALE } from "../consts";
import { setDragStart, getDragDist } from "../DraggerUtils";
import { minus } from "../matrix";
import MoveableManager from "../MoveableManager";
import { renderAllDirection } from "../renderDirection";
import { ScalableProps, ResizableProps } from "../types";
import { hasClass } from "@daybrush/utils";

export default {
    name: "scalable",
    dragControlOnly: true,
    render(moveable: MoveableManager<Partial<ResizableProps & ScalableProps>>) {
        const { resizable, scalable } = moveable.props;
        if (!resizable && scalable) {
            return renderAllDirection(moveable);
        }
    },
    dragControlCondition(target: HTMLElement | SVGElement) {
        return hasClass(target, prefix("direction"));
    },
    dragControlStart(
        moveable: MoveableManager<ScalableProps>,
        { datas, clientX, clientY, pinchFlag, inputEvent: { target: inputTarget } }: any) {

        const direction = getDirection(inputTarget);
        const { onScaleStart, target } = moveable.props;

        if (!direction || !target) {
            return false;
        }
        const {
            width,
            height,
            targetTransform,
        } = moveable.state;

        if (!pinchFlag) {
            setDragStart(moveable, { datas });
        }

        datas.datas = {};
        datas.transform = targetTransform;
        datas.prevDist = [1, 1];
        datas.direction = direction;
        datas.width = width;
        datas.height = height;

        const result = onScaleStart && onScaleStart({
            target,
            clientX,
            clientY,
            datas: datas.datas,
        });
        if (result !== false) {
            datas.isScale = true;
        }
        return result;
    },
    dragControl(
        moveable: MoveableManager<ScalableProps>,
        { datas, clientX, clientY, distX, distY, pinchDistance, pinchFlag }: any) {
        const {
            prevDist,
            direction,
            width,
            height,
            transform,
            isScale,
        } = datas;

        if (!isScale) {
            return false;
        }
        const { keepRatio, target, throttleScale, onScale } = moveable.props;

        let scaleX: number;
        let scaleY: number;
        if (pinchFlag) {
            scaleX = (width + pinchDistance) / width;
            scaleY = (height + pinchDistance * height / width) / height;
        } else {
            const dist = getDragDist({ datas, distX, distY });
            let distWidth = direction[0] * dist[0];
            let distHeight = direction[1] * dist[1];

            // diagonal
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
            const nextWidth = width + distWidth;
            const nextHeight = height + distHeight;
            scaleX = nextWidth / width;
            scaleY = nextHeight / height;
        }
        scaleX = throttle(scaleX, throttleScale!);
        scaleY = throttle(scaleY, throttleScale!);

        if (scaleX === 0) {
            scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }
        if (scaleY === 0) {
            scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }
        const nowScale = [scaleX, scaleY];
        datas.prevDist = nowScale;

        if (scaleX === prevDist[0] && scaleY === prevDist[1]) {
            return false;
        }

        onScale && onScale({
            target: target!,
            scale: nowScale,
            dist: [scaleX / prevDist[0], scaleY / prevDist[1]],
            delta: minus(nowScale, prevDist),
            transform: `${transform} scale(${scaleX}, ${scaleY})`,
            clientX,
            clientY,
            datas: datas.datas,
            isPinch: !!pinchFlag,
        });

        return true;
    },
    dragControlEnd(
        moveable: MoveableManager<ScalableProps>,
        { datas, isDrag, clientX, clientY, pinchFlag }: any) {
        if (!datas.isScale) {
            return false;
        }
        const { target, onScaleEnd } = moveable.props;

        datas.isScale = false;
        onScaleEnd && onScaleEnd({
            target: target!,
            isDrag,
            clientX,
            clientY,
            datas: datas.datas,
        });
        return isDrag;
    },
};
