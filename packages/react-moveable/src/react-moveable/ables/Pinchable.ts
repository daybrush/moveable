import { Client } from "@daybrush/drag";
import { triggerEvent, fillParams } from "../utils";
import MoveableManager from "../MoveableManager";
import { PinchableProps, Able, SnappableState, OnPinchStart, OnPinch, OnPinchEnd } from "../types";
import MoveableGroup from "../MoveableGroup";
import { getRad } from "@moveable/matrix";

function getRotatiion(touches: Client[]) {
    return getRad([
        touches[0].clientX,
        touches[0].clientY,
    ], [
        touches[1].clientX,
        touches[1].clientY,
    ]) / Math.PI * 180;
}

export default {
    name: "pinchable",
    updateRect: true,
    props: {
        pinchable: Boolean,
        pinchThreshold: Number,
    },
    pinchStart(
        moveable: MoveableManager<PinchableProps, SnappableState>,
        e: any,
    ) {
        const { datas, touches, targets } = e;
        const { pinchable, ables } = moveable.props;

        if (!pinchable) {
            return false;
        }
        const eventName = `onPinch${targets ? "Group" : ""}Start` as "onPinchStart";
        const controlEventName = `drag${targets ? "Group" : ""}ControlStart` as "dragControlStart";

        const pinchAbles = (pinchable === true ? moveable.controlAbles : ables!.filter(able => {
            return pinchable.indexOf(able.name as any) > -1;
        })).filter(able => able.canPinch && able[controlEventName]);

        const params = fillParams<OnPinchStart>(moveable, e, {}) as any;

        if (targets) {
            params.targets = targets;
        }
        const result = triggerEvent(moveable, eventName, params);

        datas.isPinch = result !== false;
        datas.ables = pinchAbles;

        const isPinch = datas.isPinch;

        if (!isPinch) {
            return false;
        }
        const parentRotate = getRotatiion(touches);

        pinchAbles.forEach(able => {
            datas[able.name + "Datas"] = {};

            if (!able[controlEventName]) {
                return;
            }
            const ableEvent: any = {
                ...e,
                datas: datas[able.name + "Datas"],
                parentRotate,
                isPinch: true,
            };
            able[controlEventName]!(moveable, ableEvent);
        });

        moveable.state.snapRenderInfo = {
            direction: [0, 0],
        };
        return isPinch;
    },
    pinch(
        moveable: MoveableManager<PinchableProps>,
        e: any,
    ) {
        const { datas, scale: pinchScale, distance, touches, inputEvent, targets } = e;
        if (!datas.isPinch) {
            return;
        }
        const parentRotate = getRotatiion(touches);
        const parentDistance = distance * (1 - 1 / pinchScale);
        const params = fillParams<OnPinch>(moveable, e, {}) as any;

        if (targets) {
            params.targets = targets;
        }
        const eventName = `onPinch${targets ? "Group" : ""}` as "onPinch";
        triggerEvent(moveable, eventName, params);

        const ables: Able[] = datas.ables;
        const controlEventName = `drag${targets ? "Group" : ""}Control` as "dragControl";

        ables.forEach(able => {
            if (!able[controlEventName]) {
                return;
            }
            able[controlEventName]!(moveable, {
                ...e,
                datas: datas[able.name + "Datas"],
                inputEvent,
                parentDistance,
                parentRotate,
                isPinch: true,
            } as any);
        });
        return params;
    },
    pinchEnd(
        moveable: MoveableManager<PinchableProps>,
        e: any,
    ) {
        const { datas, isPinch, inputEvent, targets } = e;
        if (!datas.isPinch) {
            return;
        }
        const eventName = `onPinch${targets ? "Group" : ""}End` as "onPinchEnd";

        const params = fillParams<OnPinchEnd>(moveable, e, { isDrag: isPinch }) as any;

        if (targets) {
            params.targets = targets;
        }
        triggerEvent(moveable, eventName, params);
        const ables: Able[] = datas.ables;
        const controlEventName = `drag${targets ? "Group" : ""}ControlEnd` as "dragControlEnd";

        ables.forEach(able => {
            if (!able[controlEventName]) {
                return;
            }
            able[controlEventName]!(moveable, {
                ...e,
                isDrag: isPinch,
                datas: datas[able.name + "Datas"],
                inputEvent,
                isPinch: true,
            } as any);
        });
        return isPinch;
    },
    pinchGroupStart(moveable: MoveableGroup, e: any) {
        return this.pinchStart(moveable, { ...e, targets: moveable.props.targets });
    },
    pinchGroup(moveable: MoveableGroup, e: any) {
        return this.pinch(moveable, { ...e, targets: moveable.props.targets });
    },
    pinchGroupEnd(moveable: MoveableGroup, e: any) {
        return this.pinchEnd(moveable, { ...e, targets: moveable.props.targets });
    },
};
