import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent, prefix } from "../utils";
import { minus, sum, createWarpMatrix, convertMatrixtoCSS } from "@moveable/matrix";
import MoveableManager from "../MoveableManager";
import { DraggableProps, OnDrag, OnDragGroup, OnDragGroupStart, MoveableManagerProps, Renderer } from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble } from "../groupUtils";
import { hasClass } from "@daybrush/utils";
import { ref } from "framework-utils";

export default {
    name: "draggable",
    render(moveable: MoveableManager<DraggableProps>, React: Renderer): any[] {
        const { dragArea, target } = moveable.props;

        if (!target || !dragArea) {
            return [];
        }
        const { width, height, pos1, pos2, pos3, pos4 } = moveable.state;

        const h = createWarpMatrix(
            [0, 0],
            [width, 0],
            [0, height],
            [width, height],
            pos1,
            pos2,
            pos3,
            pos4,
        );

        if (!h.length) {
            return [];
        }
        return [
            <div key="area" ref={ref(moveable, "areaElement")} className={prefix("area")} style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `matrix3d(${convertMatrixtoCSS(h).join(",")})`,
            }}/>,
        ];
    },
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
        const result = triggerEvent(moveable, "onDragStart", params);

        if (result !== false) {
            datas.isDrag = true;
        } else {
            datas.isPinch = false;
        }
        return datas.isDrag ? params : false;
    },
    drag(
        moveable: MoveableManager<DraggableProps>,
        { datas, distX, distY, clientX, clientY }: any,
    ): OnDrag | undefined {
        const { isPinch, isDrag, prevDist, prevBeforeDist, transform, startTranslate } = datas;
        if (!isDrag) {
            return;
        }

        const {
            throttleDrag = 0,
            parentMoveable,
        } = moveable.props;
        const target = moveable.state.target;
        const beforeTranslate = sum(getDragDist({ datas, distX, distY }, true), startTranslate);
        const translate = sum(getDragDist({ datas, distX, distY }, false), startTranslate);

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

        if (!parentMoveable && delta.every(num => !num) && beforeDelta.some(num => !num)) {
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
    dragGroupCondition(target: HTMLElement | SVGElement) {
        return hasClass(target, prefix("group"));
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
