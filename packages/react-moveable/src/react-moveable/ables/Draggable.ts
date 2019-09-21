import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent, prefix } from "../utils";
import { minus, plus } from "@moveable/matrix";
import MoveableManager from "../MoveableManager";
import { DraggableProps, OnDrag, OnDragGroup, OnDragGroupStart } from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble } from "../groupUtils";
import { hasClass } from "@daybrush/utils";

export default {
    name: "draggable",
    dragStart(
        moveable: MoveableManager<DraggableProps>,
        { datas, clientX, clientY, parentEvent }: any,
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
        datas.startTranslate = [0, 0];

        setDragStart(moveable, { datas });

        datas.prevDist = [0, 0];
        datas.prevBeforeDist = [0, 0];

        const params = {
            datas: datas.datas,
            target: target!,
            clientX,
            clientY,
            set: (translate: number[]) => {
                datas.startTranslate = translate;
            },
        };
        const result = parentEvent || triggerEvent(moveable, "onDragStart", params);

        if (result !== false) {
            datas.isDrag = true;
        } else {
            datas.isPinch = false;
        }
        return datas.isDrag ? params : false;
    },
    drag(
        moveable: MoveableManager<DraggableProps>,
        { datas, distX, distY, clientX, clientY, parentEvent }: any,
    ): OnDrag | undefined {
        const { isPinch, isDrag, prevDist, prevBeforeDist, transform, startTranslate } = datas;

        if (!isDrag) {
            return;
        }
        const props = moveable.props;
        const parentMoveable = props.parentMoveable;
        const throttleDrag = parentEvent ? 0 : (props.throttleDrag || 0);
        const target = moveable.state.target;
        const beforeTranslate = plus(getDragDist({ datas, distX, distY }, true), startTranslate);
        const translate = plus(getDragDist({ datas, distX, distY }, false), startTranslate);

        throttleArray(translate, throttleDrag);
        throttleArray(beforeTranslate, throttleDrag);

        const beforeDist = minus(beforeTranslate, startTranslate);
        const dist = minus(translate, startTranslate);
        const delta = minus(dist, prevDist);
        const beforeDelta = minus(beforeDist, prevBeforeDist);

        datas.prevDist = dist;
        datas.prevBeforeDist = beforeDist;

        const left = datas.left + beforeDist[0];
        const top = datas.top + beforeDist[1];
        const right = datas.right - beforeDist[0];
        const bottom = datas.bottom - beforeDist[1];
        const nextTransform = `${transform} translate(${dist[0]}px, ${dist[1]}px)`;

        if (!parentEvent && !parentMoveable && delta.every(num => !num) && beforeDelta.some(num => !num)) {
            return;
        }
        const params = {
            datas: datas.datas,
            target: target!,
            transform: nextTransform,
            dist,
            delta,
            translate,
            beforeDist,
            beforeDelta,
            beforeTranslate,
            left,
            top,
            right,
            bottom,
            clientX,
            clientY,
            isPinch,
        };

        !parentEvent && triggerEvent(moveable, "onDrag", params);
        return params;
    },
    dragEnd(
        moveable: MoveableManager<DraggableProps>,
        { parentEvent, datas, isDrag, clientX, clientY }: any,
    ) {
        if (!datas.isDrag) {
            return;
        }
        datas.isDrag = false;
        !parentEvent && triggerEvent(moveable, "onDragEnd", {
            target: moveable.state.target!,
            isDrag,
            clientX,
            clientY,
            datas: datas.datas,
        });
        return isDrag;
    },
    dragGroupCondition(target: HTMLElement | SVGElement) {
        return hasClass(target, prefix("area"));
    },
    dragGroupStart(moveable: MoveableGroup, e: any) {
        const datas = e.datas;

        const params = this.dragStart(moveable, e);

        if (!params) {
            return false;
        }
        const events = triggerChildAble(moveable, this, "dragStart", e);
        const nextParams: OnDragGroupStart = {
            ...params,
            targets: moveable.props.targets!,
            events,
        };
        const result = triggerEvent(moveable, "onDragGroupStart", nextParams);

        datas.isDrag = result !== false;
        return datas.isDrag ? params : false;
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
            datas: datas.datas,
        });

        return isDrag;
    },
};
