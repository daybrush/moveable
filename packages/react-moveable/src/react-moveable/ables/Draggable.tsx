import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent, fillParams, throttle, getDistSize, prefix, fillEndParams } from "../utils";
import { minus, plus, getRad } from "../matrix";
import MoveableManager from "../MoveableManager";
import {
    DraggableProps, OnDrag, OnDragGroup,
    OnDragGroupStart, OnDragStart, OnDragEnd, DraggableState, Renderer, OnDragGroupEnd,
} from "../types";
import MoveableGroup from "../MoveableGroup";
import { triggerChildDragger } from "../groupUtils";
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
        startDragRotate: Number,
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
        const { datas, parentEvent, parentFlag, isPinch, isRequest } = e;
        let { distX, distY } = e;
        const { isDrag, prevDist, prevBeforeDist, transform, startTranslate } = datas;

        if (!isDrag) {
            return;
        }
        const props = moveable.props;

        const parentMoveable = props.parentMoveable;
        const throttleDrag = parentEvent ? 0 : (props.throttleDrag || 0);
        const throttleDragRotate = parentEvent ? 0 : (props.throttleDragRotate || 0);

        let isSnap = false;
        let dragRotateRad = 0;

        if (!parentEvent && throttleDragRotate > 0 && (distX || distY)) {
            const startDragRotate = props.startDragRotate || 0;
            const deg
                = throttle(startDragRotate + getRad([0, 0], [distX, distY]) * 180 / Math.PI, throttleDragRotate)
                - startDragRotate;
            const ry  = distY * Math.abs(Math.cos((deg - 90) / 180 * Math.PI));
            const rx  = distX * Math.abs(Math.cos(deg / 180 * Math.PI));
            const r = getDistSize([rx, ry]);
            dragRotateRad = deg * Math.PI / 180;

            distX = r * Math.cos(dragRotateRad);
            distY = r * Math.sin(dragRotateRad);
        }

        if (!isPinch && !parentEvent && !parentFlag && (!throttleDragRotate || distX || distY)) {
            const [verticalInfo, horizontalInfo] = checkSnapDrag(
                moveable, distX, distY, throttleDragRotate, isRequest, datas,
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
        datas.passDeltaX = distX - (datas.passDistX || 0);
        datas.passDeltaY = distY - (datas.passDistY || 0);
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
        !parentEvent && triggerEvent<DraggableProps>(moveable, "onDragEnd", fillEndParams<OnDragEnd>(moveable, e, {}));
        return isDrag;
    },
    dragGroupStart(moveable: MoveableGroup, e: any) {
        const { datas, clientX, clientY } = e;

        const params = this.dragStart(moveable, e);

        if (!params) {
            return false;
        }
        const events = triggerChildDragger(moveable, this, "dragStart", [
            clientX || 0,
            clientY || 0,
        ], e, false);

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
        const { datas } = e;

        if (!datas.isDrag) {
            return;
        }
        const params = this.drag(moveable, e);
        const { passDeltaX, passDeltaY } = e.datas;
        const events = triggerChildDragger(moveable, this, "drag", [passDeltaX, passDeltaY], e, false);

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
        triggerChildDragger(moveable, this, "dragEnd", [0, 0], e, false);
        triggerEvent(moveable, "onDragGroupEnd", fillEndParams<OnDragGroupEnd>(moveable, e, {
            targets: moveable.props.targets!,
        }));

        return isDrag;
    },
    /**
     * @method Moveable.Draggable#request
     * @param {object} [e] - the draggable's request parameter
     * @param {number} [e.x] - x position
     * @param {number} [e.y] - y position
     * @param {number} [e.deltaX] - X number to move
     * @param {number} [e.deltaY] - Y number to move
     * @param {number} [e.isInstant] - Whether to execute the request instantly
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * // Use Relative Value
     * moveable.request("draggable", { deltaX: 10, deltaY: 10, isInstant: true });
     * // Use Absolute Value
     * moveable.request("draggable", { x: 200, y: 100, isInstant: true });
     *
     * // requestStart
     * const requester = moveable.request("draggable");
     *
     * // request
     * // Use Relative Value
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * // Use Absolute Value
     * moveable.request("draggable", { x: 200, y: 100, isInstant: true });
     * moveable.request("draggable", { x: 220, y: 100, isInstant: true });
     * moveable.request("draggable", { x: 240, y: 100, isInstant: true });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request(moveable: MoveableManager<any, any>) {
        const datas = {};
        const rect = moveable.getRect();
        let distX = 0;
        let distY = 0;

        return {
            isControl: false,
            requestStart(e: IObject<any>) {
                return { datas };
            },
            request(e: IObject<any>) {
                if ("x" in e) {
                    distX = e.x - rect.left;
                } else if ("deltaX" in e) {
                    distX += e.deltaX;
                }
                if ("y" in e) {
                    distY = e.y - rect.top;
                } else if ("deltaY" in e) {
                    distY += e.deltaY;
                }

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
