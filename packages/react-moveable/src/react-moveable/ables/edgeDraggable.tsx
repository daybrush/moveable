import { hasClass } from "@daybrush/utils";
import { DraggableProps, MoveableGroupInterface, MoveableManagerInterface } from "../types";
import { prefix } from "../utils";
import Draggable from "./Draggable";
import { makeAble } from "./AbleManager";

function getDraggableEvent(e: any) {
    let datas = e.originalDatas.draggable;
    if (!datas) {
        e.originalDatas.draggable = {};
        datas = e.originalDatas.draggable;
    }
    return { ...e, datas };
}
export default makeAble("edgeDraggable", {
    dragControlCondition(moveable: MoveableManagerInterface<DraggableProps>, e: any) {
        if (!moveable.props.edgeDraggable || !e.inputEvent) {
            return false;
        }
        const target = e.inputEvent.target;
        return hasClass(target, prefix("direction"))
            && hasClass(target, prefix("line"))
            && !hasClass(target, prefix("edge"));
    },
    dragControlStart(moveable: MoveableManagerInterface<DraggableProps>, e: any) {
        (moveable.state as any).snapRenderInfo = {
            request: e.isRequest,
            snap: true,
            center: true,
        };
        return Draggable.dragStart(moveable, getDraggableEvent(e));
    },
    dragControl(moveable: MoveableManagerInterface<DraggableProps>, e: any) {
        return Draggable.drag(moveable, getDraggableEvent(e));
    },
    dragControlEnd(moveable: MoveableManagerInterface<DraggableProps, any>, e: any) {
        return Draggable.dragEnd(moveable, getDraggableEvent(e));
    },
    dragGroupControlCondition(moveable: MoveableGroupInterface<DraggableProps>, e: any) {
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
        return Draggable.unset(moveable);
    },
});

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
