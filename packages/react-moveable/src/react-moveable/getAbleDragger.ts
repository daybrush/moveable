import MoveableManager from "./MoveableManager";
import Dragger from "@daybrush/drag";
import { Able } from "./types";
import { IObject } from "@daybrush/utils";
import { triggerRenderStart, triggerRenderEnd, triggerRender } from "./ables/triggerRender";
import MoveableGroup from "./MoveableGroup";
import { convertDragDist } from "./utils";

export function triggerAble<T extends IObject<any>>(
    moveable: MoveableManager<any>,
    ableType: string,
    eventOperation: string,
    eventAffix: string,
    eventType: any,
    e: any,
    isReqeust?: boolean,
) {
    const isStart = eventType === "Start";

    if (isStart && eventAffix.indexOf("Control") > -1 && !e.isRequest && moveable.areaElement === e.inputEvent.target) {
        return false;
    }
    const eventName = `${eventOperation}${eventAffix}${eventType}`;
    const conditionName = `${eventOperation}${eventAffix}Condition`;
    const isEnd = eventType === "End";
    const isAfter = eventType.indexOf("After") > -1;

    if (isStart) {
        moveable.updateRect(eventType, true, false);
    }
    if (eventType === "" && !isAfter) {
       convertDragDist(moveable.state, e);
    }
    const isGroup = eventAffix.indexOf("Group") > -1;
    const ables: Array<Able<T>> = (moveable as any)[ableType];
    const events = ables.filter((able: any) => able[eventName]);
    const results = events.filter((able: any) => {
        const condition = isStart && able[conditionName];

        if (!condition || condition(e, moveable)) {
            return able[eventName](moveable, e);
        }
        return false;
    });
    const isUpdate = results.length;

    if (isStart) {
        if (events.length && !isUpdate) {
            moveable.state.dragger = null;

            if ((moveable as MoveableGroup).moveables) {
                (moveable as MoveableGroup).moveables.forEach(childeMoveable => {
                    childeMoveable.state.dragger = null;
                });
            }
            return false;
        }
        triggerRenderStart(moveable, isGroup, e);
    } else if (isEnd) {
        triggerRenderEnd(moveable, isGroup, e);
    } else if (isUpdate) {
        triggerRender(moveable, isGroup, e);
    }
    if (isEnd) {
        moveable.state.dragger = null;
    }
    if (moveable.isUnmounted) {
        return;
    }
    if (!isStart && isUpdate) {
        if (results.some(able => able.updateRect) && !isGroup) {
            moveable.updateRect(eventType, false, false);
        } else {
            moveable.updateRect(eventType, true, false);
        }
    }
    if (((!isStart && isUpdate) || (isEnd && !isUpdate)) && !isReqeust) {
        moveable.forceUpdate();
    }
    if (!isStart && !isEnd && !isAfter && isUpdate) {
        triggerAble(moveable, ableType, eventOperation, eventAffix, eventType + "After", e);
    }
}
export function getAbleDragger<T>(
    moveable: MoveableManager<T>,
    target: HTMLElement | SVGElement,
    ableType: string,
    eventAffix: string,
) {
    const options: IObject<any> = {
        container: window,
        pinchThreshold: moveable.props.pinchThreshold,
    };
    ["drag", "pinch"].forEach(eventOperation => {
        ["Start", "", "End"].forEach(eventType => {
            options[`${eventOperation}${eventType.toLowerCase()}`]
                = (e: any) => triggerAble(moveable, ableType, eventOperation, eventAffix, eventType, e);
        });
    });

    return new Dragger(target!, options);
}
