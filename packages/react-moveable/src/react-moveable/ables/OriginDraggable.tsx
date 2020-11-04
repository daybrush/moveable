import {
    prefix, triggerEvent,
    fillParams, calculatePoses, getRect, fillEndParams, convertCSSSize
} from "../utils";
import {
    OnDragOriginStart, OnDragOrigin,
    OnDragOriginEnd, MoveableManagerInterface, DraggableProps, OriginDraggableProps, MoveableGroupInterface
} from "../types";
import { hasClass, IObject } from "@daybrush/utils";
import { setDragStart, getDragDist, getNextMatrix } from "../gesto/GestoUtils";
import { minus, plus } from "@scena/matrix";
import Draggable from "./Draggable";
import CustomGesto, { setCustomDrag } from "../gesto/CustomGesto";

/**
 * @namespace OriginDraggable
 * @memberof Moveable
 * @description Whether to drag origin (default: false)
 */
export default {
    name: "originDraggable",
    props: {
        originDraggable: Boolean,
        originRelative: Boolean,
    } as const,
    events: {
        onDragOriginStart: "dragOriginStart",
        onDragOrigin: "dragOrigin",
        onDragOriginEnd: "dragOriginEnd",
    } as const,
    css: [
        `:host[data-able-origindraggable] .control.origin {
    pointer-events: auto;
}`,
    ],
    dragControlCondition(e: any) {
        if (e.isRequest) {
            return e.requestAble === "originDraggable";
        }
        return hasClass(e.inputEvent.target, prefix("origin"));
    },
    dragControlStart(moveable: MoveableManagerInterface<OriginDraggableProps & DraggableProps>, e: any) {
        const { datas } = e;

        setDragStart(moveable, e);

        const params = fillParams<OnDragOriginStart>(moveable, e, {
            dragStart: Draggable.dragStart(
                moveable,
                new CustomGesto().dragStart([0, 0], e),
            ),
        });
        const result = triggerEvent<OriginDraggableProps>(
            moveable, "onDragOriginStart", params);

        datas.startOrigin = moveable.state.transformOrigin;
        datas.startTargetOrigin = moveable.state.targetOrigin;
        datas.prevOrigin = [0, 0];
        datas.isDragOrigin = true;

        if (result === false) {
            datas.isDragOrigin = false;
            return false;
        }

        return params;
    },
    dragControl(moveable: MoveableManagerInterface<OriginDraggableProps & DraggableProps>, e: any) {
        const { datas, isPinch, isRequest } = e;

        if (!datas.isDragOrigin) {
            return false;
        }
        const [distX, distY] = getDragDist(e);
        const state = moveable.state;
        const {
            width,
            height,
            offsetMatrix,
            targetMatrix,
            is3d,
        } = state;
        const {
            originRelative = true,
        } = moveable.props;
        const n = is3d ? 4 : 3;
        let dist = [distX, distY];

        if (isRequest) {
            const distOrigin = e.distOrigin;
            if (distOrigin[0] || distOrigin[1]) {
                dist = distOrigin;
            }
        }
        const origin = plus(datas.startOrigin, dist);
        const targetOrigin = plus(datas.startTargetOrigin, dist);
        const delta = minus(dist, datas.prevOrigin);

        const nextMatrix = getNextMatrix(
            offsetMatrix,
            targetMatrix,
            origin,
            n,
        );

        const rect = moveable.getRect();
        const nextRect = getRect(calculatePoses(nextMatrix, width, height, n));

        const dragDelta = [
            rect.left - nextRect.left,
            rect.top - nextRect.top,
        ];

        datas.prevOrigin = dist;
        const transformOrigin = [
            convertCSSSize(targetOrigin[0], width, originRelative),
            convertCSSSize(targetOrigin[1], height, originRelative),
        ].join(" ");
        const params = fillParams<OnDragOrigin>(moveable, e, {
            width,
            height,
            origin,
            dist,
            delta,
            transformOrigin,
            drag: Draggable.drag(
                moveable,
                setCustomDrag(e, moveable.state, dragDelta, !!isPinch, false),
            )!,
        });
        triggerEvent<OriginDraggableProps>(moveable, "onDragOrigin", params);
        return params;
    },
    dragControlEnd(moveable: MoveableManagerInterface<OriginDraggableProps>, e: any) {
        const { datas } = e;

        if (!datas.isDragOrigin) {
            return false;
        }
        triggerEvent<OriginDraggableProps>(moveable, "onDragOriginEnd",
            fillEndParams<OnDragOriginEnd>(moveable, e, {}));
        return true;
    },
    dragGroupControlCondition(e: any) {
        return this.dragControlCondition(e);
    },
    dragGroupControlStart(moveable: MoveableGroupInterface<OriginDraggableProps>, e: any) {
        const params = this.dragControlStart(moveable, e);

        if (!params) {
            return false;
        }

        return true;
    },
    dragGroupControl(moveable: MoveableGroupInterface<OriginDraggableProps>, e: any) {
        const params = this.dragControl(moveable, e);

        if (!params) {
            return false;
        }
        moveable.transformOrigin = params.transformOrigin;

        return true;
    },
    /**
    * @method Moveable.OriginDraggable#request
    * @param {object} e - the OriginDraggable's request parameter
    * @param {number} [e.x] - x position
    * @param {number} [e.y] - y position
    * @param {number} [e.deltaX] - x number to move
    * @param {number} [e.deltaY] - y number to move
    * @param {array} [e.deltaOrigin] - left, top number to move transform-origin
    * @param {array} [e.origin] - transform-origin position
    * @param {number} [e.isInstant] - Whether to execute the request instantly
    * @return {Moveable.Requester} Moveable Requester
    * @example

    * // Instantly Request (requestStart - request - requestEnd)
    * // Use Relative Value
    * moveable.request("originDraggable", { deltaX: 10, deltaY: 10 }, true);
    * // Use Absolute Value
    * moveable.request("originDraggable", { x: 200, y: 100 }, true);
    * // Use Transform Value
    * moveable.request("originDraggable", { deltaOrigin: [10, 0] }, true);
    * moveable.request("originDraggable", { origin: [100, 0] }, true);
    * // requestStart
    * const requester = moveable.request("originDraggable");
    *
    * // request
    * // Use Relative Value
    * requester.request({ deltaX: 10, deltaY: 10 });
    * requester.request({ deltaX: 10, deltaY: 10 });
    * requester.request({ deltaX: 10, deltaY: 10 });
    * // Use Absolute Value
    * moveable.request("originDraggable", { x: 200, y: 100 });
    * moveable.request("originDraggable", { x: 220, y: 100 });
    * moveable.request("originDraggable", { x: 240, y: 100 });
    *
    * // requestEnd
    * requester.requestEnd();
    */
    request(moveable: MoveableManagerInterface<any, any>) {
        const datas = {};
        const rect = moveable.getRect();
        let distX = 0;
        let distY = 0;

        const transformOrigin = rect.transformOrigin;
        const distOrigin = [0, 0];

        return {
            isControl: true,
            requestStart() {
                return { datas };
            },
            request(e: IObject<any>) {
                if ("deltaOrigin" in e) {
                    distOrigin[0] += e.deltaOrigin[0];
                    distOrigin[1] += e.deltaOrigin[1];
                } else if ("origin" in e) {
                    distOrigin[0] = e.origin[0] - transformOrigin[0];
                    distOrigin[1] = e.origin[1] - transformOrigin[1];
                } else {
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
                }

                return { datas, distX, distY, distOrigin };
            },
            requestEnd() {
                return { datas, isDrag: true };
            },
        };
    },
};
/**
 * Whether to drag origin (default: false)
 * @name Moveable.OriginDraggable#originDraggable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     originDraggable: true,
 * });
 * let translate = [0, 0];
 * moveable.on("dragOriginStart", e => {
 *     e.dragStart && e.dragStart.set(translate);
 * }).on("dragOrigin", e => {
 *     translate = e.drag.beforeTranslate;
 *     e.target.style.cssText
 *         = `transform-origin: ${e.transformOrigin};`
 *         + `transform: translate(${translate[0]}px, ${translate[1]}px)`;
 * }).on("dragOriginEnd", e => {
 *     console.log(e);
 * });
 */

/**
 * % Can be used instead of the absolute px (default: true)
 * @name Moveable.OriginDraggable#originRelative
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     originDraggable: true,
 *     originRelative: false,
 * });
 * moveable.originRelative = true;
 */

/**
* When drag start the origin, the `dragOriginStart` event is called.
* @memberof Moveable.OriginDraggable
* @event dragOriginStart
* @param {Moveable.OriginDraggable.OnDragOriginStart} - Parameters for the `dragOriginStart` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     originDraggable: true,
* });
* let translate = [0, 0];
* moveable.on("dragOriginStart", e => {
*     e.dragStart && e.dragStart.set(translate);
* }).on("dragOrigin", e => {
*     translate = e.drag.beforeTranslate;
*     e.target.style.cssText
*         = `transform-origin: ${e.transformOrigin};`
*         + `transform: translate(${translate[0]}px, ${translate[1]}px)`;
* }).on("dragOriginEnd", e => {
*     console.log(e);
* });
*/

/**
* When drag the origin, the `dragOrigin` event is called.
* @memberof Moveable.OriginDraggable
* @event dragOrigin
* @param {Moveable.OriginDraggable.OnDragOrigin} - Parameters for the `dragOrigin` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     originDraggable: true,
* });
* let translate = [0, 0];
* moveable.on("dragOriginStart", e => {
*     e.dragStart && e.dragStart.set(translate);
* }).on("dragOrigin", e => {
*     translate = e.drag.beforeTranslate;
*     e.target.style.cssText
*         = `transform-origin: ${e.transformOrigin};`
*         + `transform: translate(${translate[0]}px, ${translate[1]}px)`;
* }).on("dragOriginEnd", e => {
*     console.log(e);
* });
*/

/**
* When drag end the origin, the `dragOriginEnd` event is called.
* @memberof Moveable.OriginDraggable
* @event dragOriginEnd
* @param {Moveable.OriginDraggable.OnDragOriginEnd} - Parameters for the `dragOriginEnd` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     originDraggable: true,
* });
* let translate = [0, 0];
* moveable.on("dragOriginStart", e => {
*     e.dragStart && e.dragStart.set(translate);
* }).on("dragOrigin", e => {
*     translate = e.drag.beforeTranslate;
*     e.target.style.cssText
*         = `transform-origin: ${e.transformOrigin};`
*         + `transform: translate(${translate[0]}px, ${translate[1]}px)`;
* }).on("dragOriginEnd", e => {
*     console.log(e);
* });
*/
