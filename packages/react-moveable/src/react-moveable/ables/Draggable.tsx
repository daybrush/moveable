import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent, fillParams, throttle, getDistSize, prefix } from "../utils";
import { minus, plus, getRad } from "@moveable/matrix";
import MoveableManager from "../MoveableManager";
import {
    DraggableProps, OnDrag, OnDragGroup,
    OnDragGroupStart, OnDragStart, OnDragEnd, DraggableState, Renderer,
} from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildAble } from "../groupUtils";
import { checkSnapDrag, startCheckSnapDrag } from "./Snappable";
import { IObject } from "@daybrush/utils";

/**
 * @namespace Draggable
 * @memberof Moveable
 */
export default {
    name: "draggable",
    props: {
        draggable: Boolean,
        throttleDrag: Number,
        throttleDragRotate: Number,
    },
    render(
        moveable: MoveableManager<DraggableProps, DraggableState>,
        React: Renderer,
    ) {
        const throttleDragRotate = moveable.props.throttleDragRotate;
        const { dragInfo, beforeOrigin } = moveable.state;

        if (!throttleDragRotate || !dragInfo) {
            return;
        }
        const dist = dragInfo.dist;

        if (!dist[0] && !dist[1]) {
            return;
        }

        const width = getDistSize(dist);
        const rad = getRad(dist, [0, 0]);

        return <div className={prefix(
            "line",
            "horizontal",
            "dragline",
            "dashed",
        )} key={`dragRotateGuideline`} style={{
            width: `${width}px`,
            transform: `translate(${beforeOrigin[0]}px, ${beforeOrigin[1]}px) rotate(${rad}rad)`,
        }} />;
    },
    dragStart(
        moveable: MoveableManager<DraggableProps, any>,
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
            moveable.state.dragInfo = {
                startRect: moveable.getRect(),
                dist: [0, 0],
            };
        } else {
            state.dragger = null;
            datas.isPinch = false;
        }
        return datas.isDrag ? params : false;
    },
    drag(
        moveable: MoveableManager<DraggableProps, any>,
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
        const throttleDragRotate = parentEvent ? 0 : (props.throttleDragRotate || 0);

        let isSnap = false;
        let dragRotateRad = 0;

        if (throttleDragRotate > 0 && (distX || distY)) {
            const deg = throttle(getRad([0, 0], [distX, distY]) * 180 / Math.PI, throttleDragRotate);
            const r = getDistSize([distX, distY]);
            dragRotateRad = deg * Math.PI / 180;

            distX = r * Math.cos(dragRotateRad);
            distY = r * Math.sin(dragRotateRad);
        }

        if (!isPinch && !parentEvent && !parentFlag && (distX || distY)) {
            const [verticalInfo, horizontalInfo] = checkSnapDrag(
                moveable, distX, distY, throttleDragRotate, datas,
            );
            const {
                isSnap: isVerticalSnap,
                isBound: isVerticalBound,
                offset: verticalOffset,
            } = verticalInfo;
            const {
                isSnap: isHorizontalSnap,
                isBound: isHorizontalBound,
                offset: horizontalOffset,
            } = horizontalInfo;
            isSnap = isVerticalSnap || isHorizontalSnap || isVerticalBound || isHorizontalBound;

            distX += verticalOffset;
            distY += horizontalOffset;
        }
        datas.passDistX = distX;
        datas.passDistY = distY;
        const beforeTranslate = plus(getDragDist({ datas, distX, distY }, true), startTranslate);
        const translate = plus(getDragDist({ datas, distX, distY }, false), startTranslate);

        if (!throttleDragRotate && !isSnap) {
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

        moveable.state.dragInfo.dist = parentEvent ? [0, 0] : dist;
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
        moveable: MoveableManager<DraggableProps, DraggableState>,
        e: any,
    ) {
        const { parentEvent, datas, isDrag } = e;

        moveable.state.dragger = null;
        moveable.state.dragInfo = null;
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
    /**
     * @method Moveable.Draggable#request
     * @param {object} [e] - the draggable's request parameter
     * @param {number} [e.deltaX] - X number to move
     * @param {number} [e.deltaY] - Y number to move
     * @param {number} [e.isInstant] - Whether to execute the request instantly
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * moveable.request("draggable", { deltaX: 10, deltaY: 10, isInstant: true });
     *
     * // requestStart
     * const requester = moveable.request("draggable");
     *
     * // request
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request() {
        const datas = {};
        let distX = 0;
        let distY = 0;

        return {
            isControl: false,
            requestStart(e: IObject<any>) {
                return { datas };
            },
            request(e: IObject<any>) {
                distX += e.deltaX;
                distY += e.deltaY;

                return { datas, distX, distY };
            },
            requestEnd() {
                return { datas, isDrag: true };
            },
        };
    },
    unset(moveable: any) {
        moveable.state.dragInfo = null;
    },
};
