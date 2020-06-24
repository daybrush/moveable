import MoveableManager from "../MoveableManager";
import {
    prefix, getControlTransform, triggerEvent,
    fillParams, caculatePoses, getRect, fillEndParams
} from "../utils";
import { Renderer, OriginProps, OnDragOriginStart, OnDragOrigin, OnDragOriginEnd } from "../types";
import { hasClass } from "@daybrush/utils";
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
            return e.requestAble === "origin";
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
        const { datas, inputEvent, isPinch } = e;

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
        const dist = [distX, distY];
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
};
