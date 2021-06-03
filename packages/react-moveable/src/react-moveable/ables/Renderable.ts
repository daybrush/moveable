import {
    MoveableManagerInterface, RenderableProps, OnRenderStart, OnRender,
    OnRenderEnd, MoveableGroupInterface,
    OnRenderGroupStart, OnRenderGroup, OnRenderGroupEnd,
} from "../types";
import { triggerEvent, fillParams } from "../utils";

export default {
    name: "renderable",
    props: {
    } as const,
    events: {
        onRenderStart: "renderStart",
        onRender: "render",
        onRenderEnd: "renderEnd",
        onRenderGroupStart: "renderGroupStart",
        onRenderGroup: "renderGroup",
        onRenderGroupEnd: "renderGroupEnd",
    } as const,
    dragStart(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRenderStart`, fillParams<OnRenderStart>(moveable, e, {
            isPinch: !!e.isPinch,
        }));
    },
    drag(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRender`, fillParams<OnRender>(moveable, e, {
            isPinch: !!e.isPinch,
        }));
    },
    dragEnd(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRenderEnd`, fillParams<OnRenderEnd>(moveable, e, {
            isPinch: !!e.isPinch,
            isDrag: e.isDrag,
        }));
    },
    dragGroupStart(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRenderGroupStart`, fillParams<OnRenderGroupStart>(moveable, e, {
            isPinch: !!e.isPinch,
            targets: moveable.props.targets,
        }));
    },
    dragGroup(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRenderGroup`, fillParams<OnRenderGroup>(moveable, e, {
            isPinch: !!e.isPinch,
            targets: moveable.props.targets,
        }));
    },
    dragGroupEnd(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        triggerEvent(moveable, `onRenderGroupEnd`, fillParams<OnRenderGroupEnd>(moveable, e, {
            isPinch: !!e.isPinch,
            isDrag: e.isDrag,
            targets: moveable.props.targets,
        }));
    },
    dragControlStart(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        return this.dragStart(moveable, e);
    },
    dragControl(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        return this.drag(moveable, e);
    },
    dragControlEnd(moveable: MoveableManagerInterface<RenderableProps>, e: any) {
        return this.dragEnd(moveable, e);
    },
    dragGroupControlStart(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        return this.dragGroupStart(moveable, e);
    },
    dragGroupControl(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        return this.dragGroup(moveable, e);
    },
    dragGroupControlEnd(moveable: MoveableGroupInterface<RenderableProps>, e: any) {
        return this.dragGroupEnd(moveable, e);
    },
} as const;
