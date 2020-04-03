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
    const datas = e.datas;
    const renderDatas = datas.render || (datas.render = {});
    const renderEvent = {...e, datas: renderDatas, originalDatas: datas };

    const results = events.filter((able: any) => {
        const condition = isStart && able[conditionName];
        const ableName = able.name;
        const nextDatas = datas[ableName] || (datas[ableName] = {});

        if (!condition || condition(e, moveable)) {
            return able[eventName](moveable, {...e, datas: nextDatas, originalDatas: datas });
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
        triggerRenderStart(moveable, isGroup, renderEvent);
    } else if (isEnd) {
        triggerRenderEnd(moveable, isGroup, renderEvent);
    } else if (isUpdate) {
        triggerRender(moveable, isGroup, renderEvent);
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
export function getAreaAbleDragger<T>(
    moveable: MoveableManager<T>,
    ableType: string,
    eventAffix: string,
) {
    const controlBox = moveable.controlBox.getElement();

    return getAbleDragger(moveable, controlBox, ableType, eventAffix, {
        dragstart: (e: any) => {
            const eventTarget = e.inputEvent.target;
            const areaElement = moveable.areaElement;

            if (eventTarget === areaElement || eventTarget.className.indexOf("moveable-area") > -1) {
                return true;
            }
            return false;
        },
        pinchstart: (e: any) => {
            const eventTarget = e.inputEvent.target;
            const areaElement = moveable.areaElement;

            if (eventTarget === areaElement || eventTarget.className.indexOf("moveable-area") > -1) {
                return true;
            }
            return false;
        },
    });
}
export function getAbleDragger<T>(
    moveable: MoveableManager<T>,
    target: HTMLElement | SVGElement,
    ableType: string,
    eventAffix: string,
    conditionFunctions: IObject<any> = {},
) {
    const options: IObject<any> = {
        container: window,
        pinchThreshold: moveable.props.pinchThreshold,
    };
    ["drag", "pinch"].forEach(eventOperation => {
        ["Start", "", "End"].forEach(eventType => {
            const eventName = `${eventOperation}${eventType.toLowerCase()}`;
            options[eventName]
                = (e: any) => {
                    if (conditionFunctions[eventName] && !conditionFunctions[eventName](e)) {
                        return false;
                    }
                    return triggerAble(moveable, ableType, eventOperation, eventAffix, eventType, e);
                };
        });
    });

    return new Dragger(target!, options);
}
