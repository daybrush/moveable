import MoveableManager from "./MoveableManager";
import { Able } from "./types";
import { IObject } from "@daybrush/utils";
import { triggerRenderStart, triggerRenderEnd, triggerRender } from "./ables/triggerRender";
import MoveableGroup from "./MoveableGroup";
import { convertDragDist } from "./utils";
import Dragger from "@daybrush/drag";

export function triggerAble<T extends IObject<any>>(
    moveable: MoveableManager,
    ableType: string,
    eventOperation: string,
    eventAffix: string,
    eventType: any,
    e: any,
    requestInstant?: boolean,
) {
    const isStart = eventType === "Start";
    const target = moveable.state.target;

    if (
        !target
        || (isStart && eventAffix.indexOf("Control") > -1
            && !e.isRequest && moveable.areaElement === e.inputEvent.target)
    ) {
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
    const ables: Able[] = (moveable as any)[ableType].slice();

    if (e.isRequest) {
        const requestAble = e.requestAble;
        if (!ables.some(able => able.name === requestAble)) {
            ables.push(...moveable.props.ables!.filter(able => able.name === requestAble));
        }
    }

    if (!ables.length) {
        return false;
    }
    const events = ables.filter((able: any) => able[eventName]);
    const datas = e.datas;
    const renderDatas = datas.render || (datas.render = {});
    const renderEvent = { ...e, datas: renderDatas, originalDatas: datas };

    const results = events.filter((able: any) => {
        const condition = isStart && able[conditionName];
        const ableName = able.name;
        const nextDatas = datas[ableName] || (datas[ableName] = {});

        if (!condition || condition(e, moveable)) {
            return able[eventName](moveable, { ...e, datas: nextDatas, originalDatas: datas });
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
            events.forEach(able => {
                able.unset && able.unset(moveable);
            });
            return false;
        }
        triggerRenderStart(moveable, isGroup, renderEvent);
    } else if (isEnd) {
        triggerRenderEnd(moveable, isGroup, renderEvent);
    } else if (!isAfter || isUpdate) {
        triggerRender(moveable, isGroup, renderEvent);
    }
    if (isEnd) {
        moveable.state.dragger = null;
    }
    if (moveable.isUnmounted) {
        return false;
    }
    if ((!isStart && isUpdate && !requestInstant) || isEnd) {
        if (results.some(able => able.updateRect) && !isGroup) {
            moveable.updateRect(eventType, false, false);
        } else {
            moveable.updateRect(eventType, true, false);
        }
        moveable.forceUpdate();
    }
    if (!isStart && !isEnd && !isAfter && isUpdate) {
        triggerAble(moveable, ableType, eventOperation, eventAffix, eventType + "After", e);
    }
}

export function getTargetAbleDragger<T>(
    moveable: MoveableManager<T>,
    moveableTarget: HTMLElement | SVGElement,
    eventAffix: string,
) {
    const controlBox = moveable.controlBox.getElement();
    const targets: Array<HTMLElement | SVGElement> = [];

    targets.push(controlBox);

    if (!moveable.props.dragArea) {
        targets.push(moveableTarget);
    }

    const startFunc = (e: any) => {
        const eventTarget = e.inputEvent.target;
        const areaElement = moveable.areaElement;

        return eventTarget === areaElement
            || !moveable.isMoveableElement(eventTarget)
            || eventTarget.className.indexOf("moveable-area") > -1
            || eventTarget.className.indexOf("moveable-padding") > -1;
    };

    return getAbleDragger(moveable, targets, "targetAbles", eventAffix, {
        dragstart: startFunc,
        pinchstart: startFunc,
    });
}
export function getAbleDragger<T>(
    moveable: MoveableManager<T>,
    target: HTMLElement | SVGElement | Array<HTMLElement | SVGElement>,
    ableType: string,
    eventAffix: string,
    conditionFunctions: IObject<any> = {},
) {
    const {
        pinchOutside,
        pinchThreshold,
    } = moveable.props;
    const options: IObject<any> = {
        container: window,
        pinchThreshold,
        pinchOutside,
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
