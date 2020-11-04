import { hasClass } from "@daybrush/utils";
import { DraggableProps, MoveableGroupInterface, MoveableManagerInterface } from "../types";
import { prefix } from "../utils";
import Draggable from "./Draggable";

function getDraggableEvent(e: any) {
    let datas = e.originalDatas.draggable;
    if (!datas) {
        e.originalDatas.draggable = {};
        datas = e.originalDatas.draggable;
    }
    return { ...e, datas };
}
export default {
    name: "edgeDraggable",
    props: {
        edgeDraggable: Boolean,
    } as const,
    events: {} as const,
    dragControlCondition(e: any, moveable: MoveableManagerInterface<DraggableProps>) {
        if (!moveable.props.edgeDraggable || !e.inputEvent) {
            return false;
        }
        const target = e.inputEvent.target;
        return hasClass(target, prefix("direction")) && hasClass(target, prefix("line"));
    },
    dragControlStart(moveable: MoveableManagerInterface<DraggableProps>, e: any) {
        return Draggable.dragStart(moveable, getDraggableEvent(e));
    },
    dragControl(moveable: MoveableManagerInterface<DraggableProps>, e: any) {
        return Draggable.drag(moveable, getDraggableEvent(e));
    },
    dragControlEnd(moveable: MoveableManagerInterface<DraggableProps, any>, e: any) {
        return Draggable.dragEnd(moveable, getDraggableEvent(e));
    },
    dragGroupControlCondition(e: any, moveable: MoveableGroupInterface<DraggableProps>) {
        if (!moveable.props.edgeDraggable || !e.inputEvent) {
            return false;
        }
        const target = e.inputEvent.target;
        return hasClass(target, prefix("direction")) && hasClass(target, prefix("line"));
    },
    dragGroupControlStart(moveable: MoveableGroupInterface<DraggableProps>, e: any) {
        return Draggable.dragGroupStart(moveable, getDraggableEvent(e));
    },
    dragGroupControl(moveable: MoveableGroupInterface<DraggableProps>, e: any) {
        return Draggable.dragGroup(moveable, getDraggableEvent(e));
    },
    dragGroupControlEnd(moveable: MoveableGroupInterface<DraggableProps, any>, e: any) {
        return Draggable.dragGroupEnd(moveable, getDraggableEvent(e));
    },
    unset(moveable: any) {
        moveable.state.dragInfo = null;
    },
} as const;

/**
 * Whether to move by dragging the edge line (default: false)
 * @name Moveable.Draggable#edgeDraggable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  draggable: true,
 *  edgeDraggable: false,
 * });
 *
 * moveable.edgeDraggable = true;
 */
