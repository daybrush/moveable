import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray } from "../utils";
import { minus } from "../matrix";
import MoveableManager from "../MoveableManager";
import { DraggableProps, OnDrag } from "../types";

export default {
    name: "draggable",
    dragStart(
        moveable: MoveableManager<DraggableProps>,
        { datas, clientX, clientY }: any,
    ) {
        const { onDragStart } = moveable.props;
        const {
            targetTransform,
            target,
        } = moveable.state;
        const style = window.getComputedStyle(target!);

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
    drag(
        moveable: MoveableManager<DraggableProps>,
        { datas, distX, distY, clientX, clientY, inputEvent }: any,
    ): OnDrag | undefined {
        const { isPinch, isDrag, prevDist, prevBeforeDist, transform } = datas;
        if (!isDrag) {
            return;
        }
        inputEvent.preventDefault();
        inputEvent.stopPropagation();

        const {
            throttleDrag = 0,
        } = moveable.props;
        const target = moveable.state.target;
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
        const params = {
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
        };

        moveable.triggerEvent("onDrag", params);
        return params;
    },
    dragEnd(moveable: MoveableManager<DraggableProps>, { datas, isDrag, clientX, clientY }: any) {
        if (!datas.isDrag) {
            return;
        }
        datas.isDrag = false;
        moveable.triggerEvent("onDragEnd", {
            target: moveable.state.target!,
            isDrag,
            clientX,
            clientY,
            datas: datas.datas,
        });
        return isDrag;
    },
};
