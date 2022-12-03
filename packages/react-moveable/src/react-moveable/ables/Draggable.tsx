import {
    setDragStart, getBeforeDragDist, getTransformDist,
    convertTransformFormat, resolveTransformEvent, fillTransformStartEvent,
    setDefaultTransformIndex, fillOriginalTransform,
} from "../gesto/GestoUtils";
import {
    triggerEvent, fillParams,
    getDistSize, prefix,
    fillEndParams,
    fillCSSObject,
} from "../utils";
import { minus, plus } from "@scena/matrix";
import {
    DraggableProps, OnDrag, OnDragGroup,
    OnDragGroupStart, OnDragStart, OnDragEnd, DraggableState,
    Renderer, OnDragGroupEnd, MoveableManagerInterface, MoveableGroupInterface,
} from "../types";
import { triggerChildGesto } from "../groupUtils";
import { startCheckSnapDrag } from "./Snappable";
import { IObject, getRad, throttle, throttleArray } from "@daybrush/utils";
import { checkSnapBoundsDrag } from "./snappable/snapBounds";
import { TINY_NUM } from "../consts";

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
        edgeDraggable: Boolean,
    } as const,
    events: {
        onDragStart: "dragStart",
        onDrag: "drag",
        onDragEnd: "dragEnd",
        onDragGroupStart: "dragGroupStart",
        onDragGroup: "dragGroup",
        onDragGroupEnd: "dragGroupEnd",
    } as const,
    requestStyle(): string[] {
        return ["left", "top", "right", "bottom"];
    },
    render(
        moveable: MoveableManagerInterface<DraggableProps, DraggableState>,
        React: Renderer,
    ): any[] {
        const { throttleDragRotate, zoom } = moveable.props;
        const { dragInfo, beforeOrigin } = moveable.getState();

        if (!throttleDragRotate || !dragInfo) {
            return [];
        }
        const dist = dragInfo.dist;

        if (!dist[0] && !dist[1]) {
            return [];
        }

        const width = getDistSize(dist);
        const rad = getRad(dist, [0, 0]);

        return [<div className={prefix(
            "line",
            "horizontal",
            "dragline",
            "dashed",
        )} key={`dragRotateGuideline`} style={{
            width: `${width}px`,
            transform: `translate(${beforeOrigin[0]}px, ${beforeOrigin[1]}px) rotate(${rad}rad) scaleY(${zoom})`,
        }} />];
    },
    dragStart(
        moveable: MoveableManagerInterface<DraggableProps, any>,
        e: any,
    ) {
        const { datas, parentEvent, parentGesto } = e;
        const state = moveable.state;
        const {
            gestos,
            style,
        } = state;

        if (gestos.draggable) {
            return false;
        }
        gestos.draggable = parentGesto || moveable.targetGesto;

        datas.datas = {};
        datas.left = parseFloat(style.left || "") || 0;
        datas.top = parseFloat(style.top || "") || 0;
        datas.bottom = parseFloat(style.bottom || "") || 0;
        datas.right = parseFloat(style.right || "") || 0;
        datas.startValue = [0, 0];

        setDragStart(moveable, e);
        setDefaultTransformIndex(e, "translate");
        startCheckSnapDrag(moveable, datas);

        datas.prevDist = [0, 0];
        datas.prevBeforeDist = [0, 0];
        datas.isDrag = false;
        datas.deltaOffset = [0, 0];

        const params = fillParams<OnDragStart>(moveable, e, {
            set: (translate: number[]) => {
                datas.startValue = translate;
            },
            ...fillTransformStartEvent(e),
        });
        const result = parentEvent || triggerEvent(moveable, "onDragStart", params);

        if (result !== false) {
            datas.isDrag = true;
            moveable.state.dragInfo = {
                startRect: moveable.getRect(),
                dist: [0, 0],
            };
        } else {
            gestos.draggable = null;
            datas.isPinch = false;
        }
        return datas.isDrag ? params : false;
    },
    drag(
        moveable: MoveableManagerInterface<DraggableProps, any>,
        e: any,
    ): OnDrag | undefined {
        if (!e) {
            return;
        }
        resolveTransformEvent(e, "translate");

        const { datas, parentEvent, parentFlag, isPinch, isRequest, deltaOffset } = e;
        let { distX, distY } = e;
        const { isDrag, prevDist, prevBeforeDist, startValue } = datas;

        if (!isDrag) {
            return;
        }

        if (deltaOffset) {
            distX += deltaOffset[0];
            distY += deltaOffset[1];
        }
        const props = moveable.props;

        const parentMoveable = props.parentMoveable;
        const throttleDrag = parentEvent ? 0 : (props.throttleDrag || 0);
        const throttleDragRotate = parentEvent ? 0 : (props.throttleDragRotate || 0);

        let dragRotateRad = 0;
        let isVerticalSnap = false;
        let isVerticalBound = false;
        let isHorizontalSnap = false;
        let isHorizontalBound = false;

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
            const [verticalInfo, horizontalInfo] = checkSnapBoundsDrag(
                moveable, distX, distY, throttleDragRotate, isRequest || deltaOffset, datas,
            );
            isVerticalSnap = verticalInfo.isSnap;
            isVerticalBound = verticalInfo.isBound;
            isHorizontalSnap = horizontalInfo.isSnap;
            isHorizontalBound = horizontalInfo.isBound;

            const verticalOffset = verticalInfo.offset;
            const horizontalOffset = horizontalInfo.offset;

            distX += verticalOffset;
            distY += horizontalOffset;
        }

        const beforeTranslate = plus(getBeforeDragDist({ datas, distX, distY }), startValue);
        const translate = plus(getTransformDist({ datas, distX, distY }), startValue);

        throttleArray(translate, TINY_NUM);
        throttleArray(beforeTranslate, TINY_NUM);

        if (!throttleDragRotate) {
            if (!isVerticalSnap && !isVerticalBound) {
                translate[0] = throttle(translate[0], throttleDrag);
                beforeTranslate[0] = throttle(beforeTranslate[0], throttleDrag);
            }
            if (!isHorizontalSnap && !isHorizontalBound) {
                translate[1] = throttle(translate[1], throttleDrag);
                beforeTranslate[1] = throttle(beforeTranslate[1], throttleDrag);
            }
        }


        const beforeDist = minus(beforeTranslate, startValue);
        const dist = minus(translate, startValue);
        const delta = minus(dist, prevDist);
        const beforeDelta = minus(beforeDist, prevBeforeDist);

        datas.prevDist = dist;
        datas.prevBeforeDist = beforeDist;


        datas.passDelta = delta; //distX - (datas.passDistX || 0);
        // datas.passDeltaY = distY - (datas.passDistY || 0);
        datas.passDist = dist; //distX;
        // datas.passDistY = distY;

        const left = datas.left + beforeDist[0];
        const top = datas.top + beforeDist[1];
        const right = datas.right - beforeDist[0];
        const bottom = datas.bottom - beforeDist[1];
        const nextTransform = convertTransformFormat(datas,
            `translate(${translate[0]}px, ${translate[1]}px)`, `translate(${dist[0]}px, ${dist[1]}px)`);

        fillOriginalTransform(e, nextTransform);

        moveable.state.dragInfo.dist = parentEvent ? [0, 0] : dist;
        if (!parentEvent && !parentMoveable && delta.every(num => !num) && beforeDelta.some(num => !num)) {
            return;
        }

        const {
            width,
            height,
        } = moveable.state;
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
            width,
            height,
            isPinch,
            ...fillCSSObject({
                transform: nextTransform,
            }, e),
        });

        !parentEvent && triggerEvent(moveable, "onDrag", params);
        return params;
    },
    dragAfter(
        moveable: MoveableManagerInterface<DraggableProps, DraggableState>,
        e: any,
    ) {
        const datas = e.datas;
        const {
            deltaOffset,
        } = datas;

        if (deltaOffset[0] || deltaOffset[1]) {
            datas.deltaOffset = [0, 0];
            return this.drag(moveable, {...e, deltaOffset });
        }
        return false;
    },
    dragEnd(
        moveable: MoveableManagerInterface<DraggableProps, DraggableState>,
        e: any,
    ) {
        const { parentEvent, datas } = e;

        moveable.state.dragInfo = null;
        if (!datas.isDrag) {
            return;
        }
        datas.isDrag = false;
        const param = fillEndParams<OnDragEnd>(moveable, e, {});
        !parentEvent && triggerEvent(moveable, "onDragEnd", param);
        return param;
    },
    dragGroupStart(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { datas, clientX, clientY } = e;

        const params = this.dragStart(moveable, e);

        if (!params) {
            return false;
        }
        const events = triggerChildGesto(moveable, this, "dragStart", [
            clientX || 0,
            clientY || 0,
        ], e, false, "draggable");

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
        const { passDelta } = e.datas;
        const events = triggerChildGesto(moveable, this, "drag", passDelta, e, false, "draggable");

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
        const events = triggerChildGesto(moveable, this, "dragEnd", [0, 0], e, false, "draggable");
        triggerEvent(moveable, "onDragGroupEnd", fillEndParams<OnDragGroupEnd>(moveable, e, {
            targets: moveable.props.targets!,
            events,
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
    unset(moveable: MoveableManagerInterface<any, Record<string, any>>) {
        moveable.state.gestos.draggable = null;
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
