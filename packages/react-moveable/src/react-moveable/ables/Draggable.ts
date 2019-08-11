import Moveable from "..";
import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray } from "../utils";
import { minus } from "../matrix";
import MoveableManager from "../MoveableManager";
import { DraggableProps } from "../types";

export default {
    name: "draggable",
    dragStart(moveable: MoveableManager<DraggableProps>, { datas, clientX, clientY }: any) {
        const { target, onDragStart } = moveable.props;
        const style = window.getComputedStyle(target!);
        const state = moveable.state;
        const {
            targetTransform,
        } = state;

        datas.datas = {};
        datas.left = parseFloat(style.left || "") || 0;
        datas.top = parseFloat(style.top || "") || 0;
        datas.bottom = parseFloat(style.bottom || "") || 0;
        datas.right = parseFloat(style.right || "") || 0;
        datas.transform = targetTransform;

        setDragStart(moveable, { datas });

        datas.prevDist = [0, 0];
        datas.prevBeforeDist = [0, 0];
        const result = onDragStart && onDragStart!({
            datas: datas.datas,
            target: target!,
            clientX,
            clientY,
        });

        if (result !== false) {
            datas.isDrag = true;
        } else {
            datas.isPinch = false;
        }
        return result;
    },
    drag(moveable: Moveable, { datas, distX, distY, clientX, clientY, inputEvent }: any) {
        const { isPinch, isDrag } = datas;
        if (!isDrag) {
            return false;
        }
        inputEvent.preventDefault();
        inputEvent.stopPropagation();

        const {
            target,
            onDrag,
            throttleDrag = 0,
        } = moveable.props;
        const { prevDist, prevBeforeDist, transform } = datas;

        const beforeDist = getDragDist({ datas, distX, distY }, true);
        const dist = getDragDist({ datas, distX, distY }, false);

        throttleArray(dist, throttleDrag);
        throttleArray(beforeDist, throttleDrag);

        const delta = minus(dist, prevDist);
        const beforeDelta = minus(beforeDist, prevBeforeDist);

        datas.prevDist = dist;
        datas.prevBeforeDist = beforeDist;

        const left = datas.left + beforeDist[0];
        const top = datas.top + beforeDist[1];
        const right = datas.right - beforeDist[0];
        const bottom = datas.bottom - beforeDist[1];
        const nextTransform = `${transform} translate(${dist[0]}px, ${dist[1]}px)`;

        if (delta.every(num => !num) && beforeDelta.some(num => !num)) {
            return;
        }
        onDrag && onDrag!({
            datas: datas.datas,
            target: target!,
            transform: nextTransform,
            dist,
            delta,
            beforeDist,
            beforeDelta,
            left,
            top,
            right,
            bottom,
            clientX,
            clientY,
            isPinch,
        });
        return true;
    },
    dragEnd(moveable: Moveable, { datas, isDrag, clientX, clientY }: any) {
        const { target, onDragEnd } = moveable.props;

        if (!datas.isDrag) {
            return;
        }
        datas.isDrag = false;
        onDragEnd && onDragEnd!({
            target: target!,
            isDrag,
            clientX,
            clientY,
            datas: datas.datas,
        });
        return isDrag;
    },
};
