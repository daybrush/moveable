import { getDragDist, setDragStart } from "../DraggerUtils";
import { throttleArray, triggerEvent, fillParams, throttle, getDistSize, prefix, fillEndParams } from "../utils";
import { minus, plus, getRad } from "../matrix";
import {
    DraggableProps, OnDrag, OnDragGroup,
    OnDragGroupStart, OnDragStart, OnDragEnd, DraggableState,
    Renderer, OnDragGroupEnd, MoveableManagerInterface, MoveableGroupInterface,
} from "../types";
import { triggerChildDragger } from "../groupUtils";
import { checkSnapDrag, startCheckSnapDrag } from "./Snappable";
import { IObject } from "@daybrush/utils";

/**
 * @namespace Draggable
 * @memberof Moveable
 * @description Draggable refers to the ability to drag and move targets.
 */
export default {
    name: "draggable",
    props: {
        draggable: Boolean,
        throttleDrag: Number,
        throttleDragRotate: Number,
        startDragRotate: Number,
    } as const,
    events: {
        onDragStart: "dragStart",
        onDrag: "drag",
        onDragEnd: "dragEnd",
        onDragGroupStart: "dragGroupStart",
        onDragGroup: "dragGroup",
        onDragGroupEnd: "dragGroupEnd",
    } as const,
    render(
        moveable: MoveableManagerInterface<DraggableProps, DraggableState>,
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
        moveable: MoveableManagerInterface<DraggableProps, any>,
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
        moveable: MoveableManagerInterface<DraggableProps, any>,
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
            const ry = distY * Math.abs(Math.cos((deg - 90) / 180 * Math.PI));
            const rx = distX * Math.abs(Math.cos(deg / 180 * Math.PI));
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
        moveable: MoveableManagerInterface<DraggableProps, DraggableState>,
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
    dragGroupStart(moveable: MoveableGroupInterface<any, any>, e: any) {
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
    dragGroup(moveable: MoveableGroupInterface<any, any>, e: any) {
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
    dragGroupEnd(moveable: MoveableGroupInterface<any, any>, e: any) {
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
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * // Use Relative Value
     * moveable.request("draggable", { deltaX: 10, deltaY: 10 }, true);
     * // Use Absolute Value
     * moveable.request("draggable", { x: 200, y: 100 }, true);
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
     * moveable.request("draggable", { x: 200, y: 100 });
     * moveable.request("draggable", { x: 220, y: 100 });
     * moveable.request("draggable", { x: 240, y: 100 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request(moveable: MoveableManagerInterface<any, any>) {
        const datas = {};
        const rect = moveable.getRect();
        let distX = 0;
        let distY = 0;

        return {
            isControl: false,
            requestStart() {
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

/**
 * Whether or not target can be dragged. (default: false)
 * @name Moveable.Draggable#draggable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.draggable = true;
 */

/**
 * throttle of x, y when drag.
 * @name Moveable.Draggable#throttleDrag
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleDrag = 1;
 */

/**
* throttle of angle of x, y when drag.
* @name Moveable.Draggable#throttleDragRotate
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body);
*
* moveable.throttleDragRotate = 45;
*/

/**
* start angle of throttleDragRotate of x, y when drag.
* @name Moveable.Draggable#startDragRotate
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body);
*
* // 45, 135, 225, 315
* moveable.throttleDragRotate = 90;
* moveable.startDragRotate = 45;
*/

/**
 * When the drag starts, the dragStart event is called.
 * @memberof Moveable.Draggable
 * @event dragStart
 * @param {Moveable.Draggable.OnDragStart} - Parameters for the dragStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { draggable: true });
 * moveable.on("dragStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When dragging, the drag event is called.
 * @memberof Moveable.Draggable
 * @event drag
 * @param {Moveable.Draggable.OnDrag} - Parameters for the drag event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { draggable: true });
 * moveable.on("drag", ({ target, transform }) => {
 *     target.style.transform = transform;
 * });
 */
/**
 * When the drag finishes, the dragEnd event is called.
 * @memberof Moveable.Draggable
 * @event dragEnd
 * @param {Moveable.Draggable.OnDragEnd} - Parameters for the dragEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { draggable: true });
 * moveable.on("dragEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */

 /**
 * When the group drag starts, the `dragGroupStart` event is called.
 * @memberof Moveable.Draggable
 * @event dragGroupStart
 * @param {Moveable.Draggable.OnDragGroupStart} - Parameters for the `dragGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     draggable: true
 * });
 * moveable.on("dragGroupStart", ({ targets }) => {
 *     console.log("onDragGroupStart", targets);
 * });
 */

 /**
 * When the group drag, the `dragGroup` event is called.
 * @memberof Moveable.Draggable
 * @event dragGroup
 * @param {Moveable.Draggable.OnDragGroup} - Parameters for the `dragGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     draggable: true
 * });
 * moveable.on("dragGroup", ({ targets, events }) => {
 *     console.log("onDragGroup", targets);
 *     events.forEach(ev => {
 *          // drag event
 *          console.log("onDrag left, top", ev.left, ev.top);
 *          // ev.target!.style.left = `${ev.left}px`;
 *          // ev.target!.style.top = `${ev.top}px`;
 *          console.log("onDrag translate", ev.dist);
 *          ev.target!.style.transform = ev.transform;)
 *     });
 * });
 */

/**
 * When the group drag finishes, the `dragGroupEnd` event is called.
 * @memberof Moveable.Draggable
 * @event dragGroupEnd
 * @param {Moveable.Draggable.OnDragGroupEnd} - Parameters for the `dragGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     draggable: true
 * });
 * moveable.on("dragGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onDragGroupEnd", targets, isDrag);
 * });
 */
