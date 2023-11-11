import { Able, MoveableManagerInterface, MoveableGroupInterface } from "../types";
import { getWindow, hasClass, IObject } from "@daybrush/utils";
import { convertDragDist, defaultSync, getRefTarget } from "../utils";
import Gesto, { GestoOptions } from "gesto";
import BeforeRenderable from "../ables/BeforeRenderable";
import Renderable from "../ables/Renderable";

export function triggerAble(
    moveable: MoveableManagerInterface,
    moveableAbles: Able[],
    eventOperations: string[],
    eventAffix: string,
    eventType: any,
    e: any,
    requestInstant?: boolean,
) {
    // pre setting
    e.clientDistX = e.distX;
    e.clientDistY = e.distY;

    const isStart = eventType === "Start";
    const isEnd = eventType === "End";
    const isAfter = eventType === "After";
    const target = moveable.state.target;
    const isRequest = e.isRequest;
    const isControl = eventAffix.indexOf("Control") > -1;

    if (
        !target
        || (isStart && isControl && !isRequest && moveable.areaElement === e.inputEvent.target)
    ) {
        return false;
    }
    const ables: Able[] = [...moveableAbles];

    if (isRequest) {
        const requestAble = e.requestAble;

        if (!ables.some(able => able.name === requestAble)) {
            ables.push(...moveable.props.ables!.filter(able => able.name === requestAble));
        }
    }
    if (!ables.length || ables.every(able => able.dragRelation)) {
        return false;
    }
    // "drag" "Control" "After"

    const inputEvent = e.inputEvent;
    let inputTarget: Element;

    if (isEnd && inputEvent) {
        inputTarget = document.elementFromPoint(e.clientX, e.clientY) || inputEvent.target;
    }
    let isDragStop = false;
    const stop = () => {
        isDragStop = true;
        e.stop?.();
    };
    const isFirstStart = isStart && (
        !moveable.targetGesto || !moveable.controlGesto
        || (!moveable.targetGesto.isFlag() || !moveable.controlGesto.isFlag())
    );

    if (isFirstStart) {
        moveable.updateRect(eventType, true, false);
    }


    // trigger ables
    const datas = e.datas;
    const gestoType = isControl ? "controlGesto" : "targetGesto";
    const prevGesto = moveable[gestoType];

    const trigger = (able: any, eventName: string, conditionName?: string) => {
        if (!(eventName in able) || prevGesto !== moveable[gestoType]) {
            return false;
        }
        const ableName = able.name;
        const nextDatas = datas[ableName] || (datas[ableName] = {});

        if (isStart) {
            nextDatas.isEventStart = !conditionName
                || !able[conditionName] || able[conditionName](moveable, e);
        }

        if (!nextDatas.isEventStart) {
            return false;
        }
        const result = able[eventName](moveable, {
            ...e,
            stop,
            datas: nextDatas,
            originalDatas: datas,
            inputTarget,
        });
        (moveable as any)._emitter.off();

        if (isStart && result === false) {
            nextDatas.isEventStart = false;
        }
        return result;
    };

    // unset ables for first drag start
    if (isFirstStart) {
        ables.forEach(able => {
            able.unset && able.unset(moveable);
        });
    }
    // BeforeRenderable
    trigger(BeforeRenderable, `drag${eventAffix}${eventType}`);

    let forceEndedCount = 0;
    let updatedCount = 0;

    eventOperations.forEach(eventOperation => {
        if (isDragStop) {
            return false;
        }
        const eventName = `${eventOperation}${eventAffix}${eventType}`;
        const conditionName = `${eventOperation}${eventAffix}Condition`;

        if (eventType === "" && !isRequest) {
            // Convert distX, distY
            convertDragDist(moveable.state, e);
        }
        // const isGroup = eventAffix.indexOf("Group") > -1;
        let eventAbles: Able[] = ables.filter((able: any) => able[eventName]);

        eventAbles = eventAbles.filter((able, i) => {
            return able.name && eventAbles.indexOf(able) === i;
        });

        const results = eventAbles.filter(able => trigger(able, eventName, conditionName));
        const isUpdate = results.length;

        // end ables
        if (isDragStop) {
            ++forceEndedCount;
        }
        if (isUpdate) {
            ++updatedCount;
        }

        if (!isDragStop && isStart && eventAbles.length && !isUpdate) {
            forceEndedCount += eventAbles.filter(able => {
                const ableName = able.name;
                const nextDatas = datas[ableName];

                if (nextDatas.isEventStart) {
                    if (able.dragRelation === "strong") {
                        return false;
                    }
                    // stop drag
                    return true;
                }
                // pre stop drag
                return false;
            }).length ? 1 : 0;
        }
    });


    if (!isAfter || updatedCount) {
        trigger(Renderable, `drag${eventAffix}${eventType}`);
    }
    // stop gesto condition
    const isForceEnd = prevGesto !== moveable[gestoType] || forceEndedCount === eventOperations.length;

    if (isEnd || isDragStop || isForceEnd) {
        moveable.state.gestos = {};

        if ((moveable as MoveableGroupInterface).moveables) {
            (moveable as MoveableGroupInterface).moveables.forEach(childMoveable => {
                childMoveable.state.gestos = {};
            });
        }
        ables.forEach(able => {
            able.unset && able.unset(moveable);
        });
    }
    if (isStart && !isForceEnd && !isRequest && updatedCount && moveable.props.preventDefault) {
        e?.preventDefault();
    }
    if (moveable.isUnmounted || isForceEnd) {
        return false;
    }
    if ((!isStart && updatedCount && !requestInstant) || isEnd) {
        const flushSync = moveable.props.flushSync || defaultSync;

        flushSync(() => {
            moveable.updateRect(isEnd ? eventType : "", true, false);
            moveable.forceUpdate();
        });

    }
    if (!isStart && !isEnd && !isAfter && updatedCount && !requestInstant) {
        triggerAble(moveable, moveableAbles, eventOperations, eventAffix, eventType + "After", e);
    }
    return true;
}

export function checkMoveableTarget(moveable: MoveableManagerInterface) {
    return (e: { inputEvent: Event }) => {
        const eventTarget = e.inputEvent.target as Element;
        const areaElement = moveable.areaElement;
        const dragTargetElement = (moveable as any)._dragTarget;

        if (!dragTargetElement || moveable.controlGesto?.isFlag()) {
            return false;
        }

        return eventTarget === dragTargetElement
            || dragTargetElement.contains(eventTarget)
            || eventTarget === areaElement
            || (!moveable.isMoveableElement(eventTarget) && !moveable.controlBox.contains(eventTarget))
            || hasClass(eventTarget, "moveable-area")
            || hasClass(eventTarget, "moveable-padding")
            || hasClass(eventTarget, "moveable-edgeDraggable");
    };
}

export function getTargetAbleGesto(
    moveable: MoveableManagerInterface,
    moveableTarget: HTMLElement | SVGElement,
    eventAffix: string,
) {
    const controlBox = moveable.controlBox;
    const targets: Array<HTMLElement | SVGElement> = [];
    const props = moveable.props;
    const dragArea =  props.dragArea;
    const target = moveable.state.target;
    const dragTarget = props.dragTarget;

    targets.push(controlBox);

    if (!dragArea || dragTarget) {
        targets.push(moveableTarget);
    }

    if (!dragArea && dragTarget && target && moveableTarget !== target && props.dragTargetSelf) {
        targets.push(target);
    }

    return getAbleGesto(moveable, targets, "targetAbles", eventAffix, {
        dragStart: checkMoveableTarget(moveable),
        pinchStart: checkMoveableTarget(moveable),
    });
}
export function getAbleGesto(
    moveable: MoveableManagerInterface,
    target: HTMLElement | SVGElement | Array<HTMLElement | SVGElement>,
    ableType: string,
    eventAffix: string,
    conditionFunctions: IObject<any> = {},
) {
    const isTargetAbles = ableType === "targetAbles";
    const {
        pinchOutside,
        pinchThreshold,
        preventClickEventOnDrag,
        preventClickDefault,
        checkInput,
        dragFocusedInput,
        preventDefault = true,
        preventRightClick = true,
        preventWheelClick = true,
        dragContainer: dragContaienrOption,
    } = moveable.props;
    const dragContainer = getRefTarget(dragContaienrOption, true);

    const options: GestoOptions = {
        preventDefault,
        preventRightClick,
        preventWheelClick,
        container: dragContainer || getWindow(moveable.getControlBoxElement()),
        pinchThreshold,
        pinchOutside,
        preventClickEventOnDrag: isTargetAbles ? preventClickEventOnDrag : false,
        preventClickEventOnDragStart: isTargetAbles ? preventClickDefault : false,
        preventClickEventByCondition: isTargetAbles ? null : (e: MouseEvent) => {
            return moveable.controlBox.contains(e.target as Element);
        },
        checkInput: isTargetAbles ? checkInput : false,
        dragFocusedInput,
    };
    const gesto = new Gesto(target!, options);
    const isControl = eventAffix === "Control";

    ["drag", "pinch"].forEach(eventOperation => {
        ["Start", "", "End"].forEach(eventType => {

            gesto.on(`${eventOperation}${eventType}` as any, e => {
                const eventName = e.eventType;
                const isPinchScheduled = eventOperation === "drag" && e.isPinch;

                if (conditionFunctions[eventName] && !conditionFunctions[eventName](e)) {
                    e.stop();
                    return;
                }

                if (isPinchScheduled) {
                    return;
                }
                const eventOperations = eventOperation === "drag" ? [eventOperation] : ["drag", eventOperation];
                const moveableAbles: Able[] = [...(moveable as any)[ableType]];
                const result = triggerAble(moveable, moveableAbles, eventOperations, eventAffix, eventType, e);

                if (!result) {
                    e.stop();
                } else if (moveable.props.stopPropagation || (eventType === "Start" && isControl)) {
                    e?.inputEvent?.stopPropagation();
                }
            });
        });
    });

    return gesto;
}
