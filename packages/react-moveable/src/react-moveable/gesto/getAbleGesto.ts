import { Able, MoveableManagerInterface, MoveableGroupInterface } from "../types";
import { IObject } from "@daybrush/utils";
import { convertDragDist } from "../utils";
import Gesto from "gesto";
import BeforeRenderable from "../ables/BeforeRenderable";
import Renderable from "../ables/Renderable";

export function triggerAble(
    moveable: MoveableManagerInterface,
    ableType: string,
    eventOperation: string,
    eventAffix: string,
    eventType: any,
    e: any,
    requestInstant?: boolean,
) {
    const isStart = eventType === "Start";
    const target = moveable.state.target;
    const isRequest = e.isRequest;

    if (
        !target
        || (isStart && eventAffix.indexOf("Control") > -1
            && !isRequest && moveable.areaElement === e.inputEvent.target)
    ) {
        return false;
    }
    const eventName = `${eventOperation}${eventAffix}${eventType}`;
    const conditionName = `${eventOperation}${eventAffix}Condition`;
    const isEnd = eventType === "End";
    const isAfter = eventType.indexOf("After") > -1;
    const isFirstStart = isStart && (
        !moveable.targetGesto || !moveable.controlGesto
        || (!moveable.targetGesto.isFlag() || !moveable.controlGesto.isFlag())
    );

    if (isFirstStart) {
        moveable.updateRect(eventType, true, false);
    }
    if (eventType === "" && !isAfter) {
        convertDragDist(moveable.state, e);
    }
    const isGroup = eventAffix.indexOf("Group") > -1;
    const ables: Able[] = [BeforeRenderable, ...(moveable as any)[ableType].slice(), Renderable];

    if (isRequest) {
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

    if (isFirstStart) {
        events.forEach(able => {
            able.unset && able.unset(moveable);
        });
    }

    const inputEvent = e.inputEvent;
    let inputTarget: Element;

    if (isEnd && inputEvent) {
        inputTarget = document.elementFromPoint(e.clientX, e.clientY) || inputEvent.target;
    }
    const results = events.filter((able: any) => {
        const hasCondition = isStart && able[conditionName];
        const ableName = able.name;
        const nextDatas = datas[ableName] || (datas[ableName] = {});

        if (!hasCondition || able[conditionName](e, moveable)) {
            return able[eventName](moveable, { ...e, datas: nextDatas, originalDatas: datas, inputTarget });
        }
        return false;
    });

    const isUpdate = results.length;
    const isForceEnd = isStart && events.length && !isUpdate;

    if (isEnd || isForceEnd) {
        moveable.state.gesto = null;

        if ((moveable as MoveableGroupInterface).moveables) {
            (moveable as MoveableGroupInterface).moveables.forEach(childMoveable => {
                childMoveable.state.gesto = null;
            });
        }
    }
    if (isFirstStart && isForceEnd) {
        events.forEach(able => {
            able.unset && able.unset(moveable);
        });
    }
    if (moveable.isUnmounted || isForceEnd) {
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
    if (!isStart && !isEnd && !isAfter && isUpdate && !requestInstant) {
        triggerAble(moveable, ableType, eventOperation, eventAffix, eventType + "After", e);
    }
    return true;
}

export function getTargetAbleGesto(
    moveable: MoveableManagerInterface,
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

    return getAbleGesto(moveable, targets, "targetAbles", eventAffix, {
        dragStart: startFunc,
        pinchStart: startFunc,
    });
}
export function getAbleGesto(
    moveable: MoveableManagerInterface,
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
    const gesto = new Gesto(target!, options);

    ["drag", "pinch"].forEach(eventOperation => {
        ["Start", "", "End"].forEach(eventType => {
            gesto.on(`${eventOperation}${eventType}`, e => {
                const eventName = e.eventType;

                if (conditionFunctions[eventName] && !conditionFunctions[eventName](e)) {
                    e.stop();
                    return;
                }
                const result = triggerAble(moveable, ableType, eventOperation, eventAffix, eventType, e);

                if (!result) {
                    e.stop();
                }
            });
        });
    });

    return gesto;
}
