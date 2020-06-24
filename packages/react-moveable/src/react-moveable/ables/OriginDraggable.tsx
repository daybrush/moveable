import MoveableManager from "../MoveableManager";
import {
    prefix, getControlTransform, triggerEvent,
    fillParams, caculatePoses, getRect, fillEndParams
} from "../utils";
import { Renderer, OriginProps, OnDragOriginStart, OnDragOrigin, OnDragOriginEnd } from "../types";
import { hasClass, IObject } from "@daybrush/utils";
import { setDragStart, getDragDist, getNextMatrix } from "../DraggerUtils";
import { minus, plus } from "../matrix";
import Draggable from "./Draggable";
import CustomDragger, { setCustomDrag } from "../CustomDragger";

export default {
    name: "originDraggable",
    props: {
        originDraggable: Boolean,
    },
    css: [
`.control.origin.origin-draggable {
    pointer-events: auto;
}`,
    ],
    render(moveable: MoveableManager<OriginProps>, React: Renderer): any {
        if (!origin) {
            return null;
        }
        const { beforeOrigin, rotation } = moveable.state;

        return [
            <div className={prefix("control", "origin", "origin-draggable")}
                style={getControlTransform(rotation, beforeOrigin)} key="beforeOrigin"></div>,
        ];
    },
    dragControlCondition(e: any) {
        if (e.isRequest) {
            return e.requestAble === "originDraggable";
        }
        return hasClass(e.inputEvent.target, prefix("origin"));
    },
    dragControlStart(moveable: MoveableManager<OriginProps>, e: any) {
        const { inputEvent, datas } = e;

        setDragStart(moveable, e);

        const result = triggerEvent<OriginProps>(
            moveable, "onDragOriginStart", fillParams<OnDragOriginStart>(moveable, e, {
                dragStart: Draggable.dragStart(
                    moveable,
                    new CustomDragger().dragStart([0, 0], inputEvent),
                ),
            }));

        datas.startOrigin = moveable.state.transformOrigin;
        datas.prevOrigin = [0, 0];
        datas.isDragOrigin = true;

        if (result === false) {
            datas.isDragOrigin = false;
            return false;
        }

        return true;
    },
    dragControl(moveable: MoveableManager<OriginProps>, e: any) {
        const { datas, inputEvent, isPinch, isRequest } = e;

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
        const n = is3d ? 4 : 3;
        let dist = [distX, distY];

        if (isRequest) {
            const distOrigin = e.distOrigin;
            if (distOrigin[0] || distOrigin[1]) {
                dist = distOrigin;
            }
        }
        const origin = plus(datas.startOrigin, dist);
        const delta = minus(dist, datas.prevOrigin);

        const nextMatrix = getNextMatrix(
            offsetMatrix,
            targetMatrix,
            origin,
            n,
        );

        const rect = moveable.getRect();
        const nextRect = getRect(caculatePoses(nextMatrix, width, height, n));

        const dragDelta = [
            rect.left - nextRect.left,
            rect.top - nextRect.top,
        ];

        datas.prevOrigin = dist;
        triggerEvent<OriginProps>(moveable, "onDragOrigin", fillParams<OnDragOrigin>(moveable, e, {
            width,
            height,
            origin,
            dist,
            delta,
            drag: Draggable.drag(
                moveable,
                setCustomDrag(moveable.state, dragDelta, inputEvent, !!isPinch, false),
            )!,
        }));
    },
    dragControlEnd(moveable: MoveableManager<OriginProps>, e: any) {
        const { datas } = e;

        if (!datas.isDragOrigin) {
            return false;
        }
        triggerEvent<OriginProps>(moveable, "onDragOriginEnd",
            fillEndParams<OnDragOriginEnd>(moveable, e, {}));
        return true;
    },
     /**
     * @method Moveable.OriginDraggable#request
     * @param {object} [e] - the OriginDraggable's request parameter
     * @param {number} [e.x] - x position
     * @param {number} [e.y] - y position
     * @param {number} [e.deltaX] - x number to move
     * @param {number} [e.deltaY] - y number to move
     * @param {number[]} [e.deltaOrigin] - left, top number to move transform-origin
     * @param {number[]} [e.origin] - transform-origin position
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
    request(moveable: MoveableManager<any, any>) {
        const datas = {};
        const rect = moveable.getRect();
        let distX = 0;
        let distY = 0;

        const transformOrigin = rect.transformOrigin;
        const distOrigin = [0, 0];

        return {
            isControl: true,
            requestStart(e: IObject<any>) {
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
