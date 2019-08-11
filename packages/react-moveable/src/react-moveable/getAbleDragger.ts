import MoveableManager from "./MoveableManager";
import Dragger, { OnDragStart, OnDrag, OnDragEnd, OnPinchEnd } from "@daybrush/drag";
import { Able } from "./types";
import { IObject } from "@daybrush/utils";

function triggerAble<T>(
    moveable: MoveableManager<T>,
    ableType: "targetAbles" | "controlAbles",
    eventOperation: string,
    prefix: string,
    eventType: string,
    e: OnDragStart | OnDrag | OnDragEnd | OnPinchEnd,
) {
    const eventName = `${eventOperation}${prefix}${eventType}`;
    const conditionName = `${eventOperation}${prefix}Condition`;
    const isStart = eventType === "Start";
    const ables: Array<Able<T>> = moveable.state[ableType];
    const result = ables.filter((able: any) => {
        const condition = isStart && able[conditionName];
        const event = able[eventName];

        if (event && (!condition || condition(e.inputEvent.target))) {
            return event(moveable, e);
        }
        return false;
    });

    if (!isStart && result.length) {
        if (result.some(able => able.updateRect)) {
            moveable.updateRect();
        } else {
            moveable.updateTarget();
        }
    }
}
export function getAbleDragger<T>(
    moveable: MoveableManager<T>,
    target: HTMLElement | SVGElement,
    ableType: "targetAbles" | "controlAbles",
    prefix: string,

) {
    const options: IObject<any> = {
        container: window,
    };
    ["drag", "pinch"].forEach(eventOperation => {
        ["Start", "", "End"].forEach(eventType => {
            options[`${eventOperation}${eventType.toLowerCase()}`]
                = (e: any) => triggerAble(moveable, ableType, eventOperation, prefix, eventType, e);
        });
    });

    return new Dragger(target!, options);
}
