import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent, fillParams } from "../utils";
import { minus, plus } from "@moveable/matrix";
import MoveableManager from "../MoveableManager";
import { DraggableProps, OnDrag, OnDragGroup, OnDragGroupStart, OnDragStart, OnDragEnd } from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble } from "../groupUtils";
import { checkSnapDrag, startCheckSnapDrag } from "./Snappable";

export default {
    name: "draggable",
    props: {
        draggable: Boolean,
        throttleDrag: Number,
    },
    dragStart(
        moveable: MoveableManager<DraggableProps>,
        e: any,
    ) {
        const { datas, parentEvent, parentDragger } = e;
        const state = moveable.state;
        const {
            targetTransform,
            target,
            dragger,
        } = state;

        if (dragger) {
            return false;
        }
        state.dragger = parentDragger || moveable.targetDragger;
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
        datas.isDrag = false;

        startCheckSnapDrag(moveable, datas);
        const params = fillParams<OnDragStart>(moveable, e, {
            set: (translate: number[]) => {
                datas.startTranslate = translate;
            },
        });
        const result = parentEvent || triggerEvent(moveable, "onDragStart", params);

        if (result !== false) {
            datas.isDrag = true;
        } else {
            state.dragger = null;
            datas.isPinch = false;
        }
        return datas.isDrag ? params : false;
    },
    drag(
        moveable: MoveableManager<DraggableProps>,
        e: any,
    ): OnDrag | undefined {
        const { datas, parentEvent, parentFlag } = e;
        let { distX, distY } = e;
        const { isPinch, isDrag, prevDist, prevBeforeDist, transform, startTranslate } = datas;

        if (!isDrag) {
            return;
        }
        const props = moveable.props;
        const parentMoveable = props.parentMoveable;
        const throttleDrag = parentEvent ? 0 : (props.throttleDrag || 0);

        let isSnap = false;

        if (!isPinch && !parentEvent && !parentFlag) {
            const [verticalInfo, horizontalInfo] = checkSnapDrag(moveable, distX, distY, datas);

            isSnap = verticalInfo.isSnap || horizontalInfo.isSnap;
            distX -= verticalInfo.offset;
            distY -= horizontalInfo.offset;
        }
        datas.passDistX = distX;
        datas.passDistY = distY;
        const beforeTranslate = plus(getDragDist({ datas, distX, distY }, true), startTranslate);
        const translate = plus(getDragDist({ datas, distX, distY }, false), startTranslate);

        if (!isSnap) {
            throttleArray(translate, throttleDrag);
            throttleArray(beforeTranslate, throttleDrag);
        }

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
        const params = fillParams<OnDrag>(moveable, e, {
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
            isPinch,
        });

        !parentEvent && triggerEvent(moveable, "onDrag", params);
        return params;
    },
    dragEnd(
        moveable: MoveableManager<DraggableProps>,
        e: any,
    ) {
        const { parentEvent, datas, isDrag } = e;

        moveable.state.dragger = null;
        if (!datas.isDrag) {
            return;
        }
        datas.isDrag = false;
        !parentEvent && triggerEvent(moveable, "onDragEnd", fillParams<OnDragEnd>(moveable, e, {
            isDrag,
        }));
        return isDrag;
    },
    dragGroupStart(moveable: MoveableGroup, e: any) {
        const datas = e.datas;

        const params = this.dragStart(moveable, e);

        if (!params) {
            return false;
        }
        const events = triggerChildAble(moveable, this, "dragStart", datas, e);
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
        const datas = e.datas;

        if (!datas.isDrag) {
            return;
        }
        const params = this.drag(moveable, e);
        const { passDistX, passDistY } = e.datas;
        const events = triggerChildAble(moveable, this, "drag", datas, { ...e, distX: passDistX, distY: passDistY });

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
        const { isDrag, datas } = e;

        if (!datas.isDrag) {
            return;
        }
        this.dragEnd(moveable, e);
        triggerChildAble(moveable, this, "dragEnd", datas, e);
        triggerEvent(moveable, "onDragGroupEnd", fillParams(moveable, e, {
            targets: moveable.props.targets!,
            isDrag,
        }));

        return isDrag;
    },
};
