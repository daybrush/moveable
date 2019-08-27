import MoveableManager from "./MoveableManager";
import Dragger, { OnDragStart, OnDrag, OnDragEnd, OnPinchEnd } from "@daybrush/drag";
import { Able } from "./types";
import { IObject } from "@daybrush/utils";

function triggerAble<T>(
    moveable: MoveableManager<T>,
    ableType: string,
    eventOperation: string,
    eventAffix: string,
    eventType: any,
    e: OnDragStart | OnDrag | OnDragEnd | OnPinchEnd,
) {
    const eventName = `${eventOperation}${eventAffix}${eventType}`;
    const conditionName = `${eventOperation}${eventAffix}Condition`;
    const isStart = eventType === "Start";
    const isGroup = eventAffix.indexOf("Group") > -1;
    const ables: Array<Able<T>> = (moveable as any)[ableType];
    const results = ables.filter((able: any) => {
        const condition = isStart && able[conditionName];

        if (able[eventName] && (!condition || condition(e.inputEvent.target))) {
            return able[eventName](moveable, e);
        }
        return false;
    });
    if (!isStart && results.length) {
        if (results.some(able => able.updateRect) && !isGroup) {
            moveable.updateRect(eventType);
        } else {
            moveable.updateTarget(eventType);
        }
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
