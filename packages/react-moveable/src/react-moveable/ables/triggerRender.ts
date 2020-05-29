import MoveableManager from "../MoveableManager";
import { triggerEvent, fillParams } from "../utils";
import { IObject } from "@daybrush/utils";

export function triggerRenderStart(
    moveable: MoveableManager<any>,
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
    moveable: MoveableManager<any>,
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
    moveable: MoveableManager<any>,
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
