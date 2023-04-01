import { hasClass } from "@daybrush/utils";
import { DraggableProps, MoveableGroupInterface, MoveableManagerInterface, Renderer } from "../types";
import { prefix } from "../utils";
import Draggable from "./Draggable";
import { makeAble } from "./AbleManager";
import { renderEdgeLines } from "../renderDirections";

function getDraggableEvent(e: any) {
    let datas = e.originalDatas.draggable;
    if (!datas) {
        e.originalDatas.draggable = {};
        datas = e.originalDatas.draggable;
    }
    return { ...e, datas };
}
export default makeAble("edgeDraggable", {
    css: [
        `.edge.edgeDraggable.line {
cursor: move;
}`,
    ],
    render(moveable: MoveableManagerInterface<DraggableProps>, React: Renderer) {
        const props = moveable.props;
        const edge = props.edgeDraggable!;

        if (!edge) {
            return [];
        }
        return renderEdgeLines(
            React,
            "edgeDraggable",
            edge,
            moveable.getState().renderPoses,
            props.zoom!,
        );
    },
    dragCondition(moveable: MoveableManagerInterface<DraggableProps>, e: any) {
        const props = moveable.props;
        const target = e.inputEvent?.target;

        if (!props.edgeDraggable || !target) {
            return false;
        }

        return !props.draggable
            && hasClass(target, prefix("direction"))
            && hasClass(target, prefix("edge"))
            && hasClass(target, prefix("edgeDraggable"));
    },
    dragStart(moveable: MoveableManagerInterface<DraggableProps>, e: any) {
        return Draggable.dragStart(moveable, getDraggableEvent(e));
    },
    drag(moveable: MoveableManagerInterface<DraggableProps>, e: any) {
        return Draggable.drag(moveable, getDraggableEvent(e));
    },
    dragEnd(moveable: MoveableManagerInterface<DraggableProps, any>, e: any) {
        return Draggable.dragEnd(moveable, getDraggableEvent(e));
    },
    dragGroupCondition(moveable: MoveableGroupInterface<DraggableProps>, e: any) {
        const props = moveable.props;
        const target = e.inputEvent?.target;

        if (!props.edgeDraggable || !target) {
            return false;
        }
        return !props.draggable && hasClass(target, prefix("direction")) && hasClass(target, prefix("line"));
    },
    dragGroupStart(moveable: MoveableGroupInterface<DraggableProps>, e: any) {
        return Draggable.dragGroupStart(moveable, getDraggableEvent(e));
    },
    dragGroup(moveable: MoveableGroupInterface<DraggableProps>, e: any) {
        return Draggable.dragGroup(moveable, getDraggableEvent(e));
    },
    dragGroupEnd(moveable: MoveableGroupInterface<DraggableProps, any>, e: any) {
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
