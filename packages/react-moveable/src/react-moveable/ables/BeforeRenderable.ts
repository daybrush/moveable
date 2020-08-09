import {
    MoveableManagerInterface, BeforeRenderableProps,
    OnBeforeRenderStart, OnBeforeRender, OnBeforeRenderEnd,
    MoveableGroupInterface, OnBeforeRenderGroupStart,
    OnBeforeRenderGroup, OnBeforeRenderGroupEnd
} from "../types";
import { fillParams, triggerEvent } from "../utils";

export default {
    name: "beforeRenderable",
    props: {
    } as const,
    events: {
        onBeforeRenderStart: "beforeRenderStart",
        onBeforeRender: "beforeRender",
        onBeforeRenderEnd: "beforeRenderEnd",
        onBeforeRenderGroupStart: "beforeRenderGroupStart",
        onBeforeRenderGroup: "beforeRenderGroup",
        onBeforeRenderGroupEnd: "beforeRenderGroupEnd",
    } as const,
    dragStart(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        triggerEvent(moveable, `onBeforeRenderStart`, fillParams<OnBeforeRenderStart>(moveable, e, {
            isPinch: !!e.isPinch,
        }));
    },
    drag(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        triggerEvent(moveable, `onBeforeRender`, fillParams<OnBeforeRender>(moveable, e, {
            isPinch: !!e.isPinch,
        }));
    },
    dragEnd(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        triggerEvent(moveable, `onBeforeRenderEnd`, fillParams<OnBeforeRenderEnd>(moveable, e, {
            isPinch: !!e.isPinch,
            isDrag: e.isDrag,
        }));
    },
    dragGroupStart(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        triggerEvent(moveable, `onBeforeRenderGroupStart`, fillParams<OnBeforeRenderGroupStart>(moveable, e, {
            isPinch: !!e.isPinch,
            targets: moveable.props.targets,
        }));
    },
    dragGroup(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        triggerEvent(moveable, `onBeforeRenderGroup`, fillParams<OnBeforeRenderGroup>(moveable, e, {
            isPinch: !!e.isPinch,
            targets: moveable.props.targets,
        }));
    },
    dragGroupEnd(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        triggerEvent(moveable, `onBeforeRenderGroupEnd`, fillParams<OnBeforeRenderGroupEnd>(moveable, e, {
            isPinch: !!e.isPinch,
            isDrag: e.isDrag,
            targets: moveable.props.targets,
        }));
    },
    dragControlStart(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        return this.dragStart(moveable, e);
    },
    dragControl(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        return this.drag(moveable, e);
    },
    dragControlEnd(moveable: MoveableManagerInterface<BeforeRenderableProps>, e: any) {
        return this.dragEnd(moveable, e);
    },
    dragControlGroupStart(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        return this.dragGroupStart(moveable, e);
    },
    dragControlGroup(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        return this.dragGroup(moveable, e);
    },
    dragControlGroupEnd(moveable: MoveableGroupInterface<BeforeRenderableProps>, e: any) {
        return this.dragGroupEnd(moveable, e);
    },
} as const;
