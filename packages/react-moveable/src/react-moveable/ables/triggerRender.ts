import { triggerEvent, fillParams } from "../utils";
import { IObject } from "@daybrush/utils";
import { MoveableManagerInterface } from "../types";

export function triggerRenderStart(
    moveable: MoveableManagerInterface<any, any>,
    isGroup: boolean,
    e: any,
) {
    const params: IObject<any> = fillParams(moveable, e, {
        isPinch: !!e.isPinch,
    });

    const eventAffix = isGroup ? "Group" : "";

    if (isGroup) {
        params.targets = moveable.props.targets;
    }
    triggerEvent<any>(moveable, `onRender${eventAffix}Start`, params);
}
export function triggerRender(
    moveable: MoveableManagerInterface<any, any>,
    isGroup: boolean,
    e: any,
) {
    const params: IObject<any> = fillParams(moveable, e, {
        isPinch: !!e.isPinch,
    });

    const eventAffix = isGroup ? "Group" : "";

    if (isGroup) {
        params.targets = moveable.props.targets;
    }
    triggerEvent<any>(moveable, `onRender${eventAffix}`, params);
}
export function triggerRenderEnd(
    moveable: MoveableManagerInterface<any, any>,
    isGroup: boolean,
    e: any,
) {
    const params: IObject<any> = fillParams(moveable, e, {
        isPinch: !!e.sPinch,
        isDrag: e.isDrag,
    });

    const eventAffix = isGroup ? "Group" : "";

    if (isGroup) {
        params.targets = moveable.props.targets;
    }
    triggerEvent<any>(moveable, `onRender${eventAffix}End`, params);
}
