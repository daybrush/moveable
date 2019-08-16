import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent } from "../utils";
import { minus } from "../matrix";
import MoveableManager from "../MoveableManager";
import { DraggableProps, OnDrag, OnDragGroup } from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble } from "../groupUtils";
import { Frame } from "scenejs";

const draggable = {
    name: "draggable",
    dragStart(
        moveable: MoveableManager<DraggableProps>,
        { datas, clientX, clientY }: any,
    ) {
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
        const result = triggerEvent(moveable, "onDragStart", {
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
        return datas.isDrag;
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

        triggerEvent(moveable, "onDrag", params);
        return params;
    },
    dragEnd(moveable: MoveableManager<DraggableProps>, { datas, isDrag, clientX, clientY }: any) {
        if (!datas.isDrag) {
            return;
        }
        datas.isDrag = false;
        triggerEvent(moveable, "onDragEnd", {
            target: moveable.state.target!,
            isDrag,
            clientX,
            clientY,
            datas: datas.datas,
        });
        return isDrag;
    },
    groupStyle(frame: Frame, e: OnDragGroup) {
        const tx = parseFloat(frame.get("transform", "translateX"));
        const ty = parseFloat(frame.get("transform", "translateY"));

        frame.set("transform", "translateX", `${tx + e.beforeDelta[0]}px`);
        frame.set("transform", "translateY", `${ty + e.beforeDelta[1]}px`);
    },

    dragGroupStart(moveable: MoveableGroup, e: any) {
        const { clientX, clientY, datas } = e;

        triggerChildAble(moveable, this, "dragStart", e);

        this.dragStart(moveable, e);
        const result = triggerEvent(moveable, "onDragGroupStart", {
            targets: moveable.props.targets!,
            clientX,
            clientY,
        });

        datas.isDrag = result !== false;
        return datas.isDrag;
    },
    dragGroup(moveable: MoveableGroup, e: any) {
        if (!e.datas.isDrag) {
            return;
        }
        const events = triggerChildAble(moveable, this, "drag", e);
        const params = this.drag(moveable, e);

        if (!params) {
            return;
        }
        const nextParams: OnDragGroup = {
            targets: moveable.props.targets!,
            events,
            ...params,
        };

        triggerEvent(moveable, "onDragGroup", nextParams);
        return nextParams;
    },
    dragGroupEnd(moveable: MoveableGroup, e: any) {
        const { clientX, clientY, isDrag, datas } = e;

        if (!datas.isDrag) {
            return;
        }
        triggerChildAble(moveable, this, "dragEnd", e);
        triggerEvent(moveable, "onDragGroupEnd", {
            targets: moveable.props.targets!,
            isDrag,
            clientX,
            clientY,
        });

        return isDrag;
    },
};

export default draggable;
