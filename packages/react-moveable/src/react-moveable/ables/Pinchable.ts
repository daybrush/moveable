import { Client } from "@daybrush/drag";
import { getRad, triggerEvent } from "../utils";
import MoveableManager from "../MoveableManager";
import { PinchableProps, Able } from "../types";
import MoveableGroup from "../MoveableGroup";

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
    pinchStart(
        moveable: MoveableManager<PinchableProps>,
        { datas, clientX, clientY, touches, inputEvent, targets }: any,
    ) {
        const { pinchable, ables } = moveable.props;

        if (!pinchable) {
            return false;
        }
        const state = moveable.state;
        const eventName = `onPinch${targets ? "Group" : ""}Start` as "onPinchStart";
        const controlEventName = `drag${targets ? "Group" : ""}ControlStart` as "dragControlStart";

        const pinchAbles = (pinchable === true ? moveable.controlAbles : ables!.filter(able => {
            return pinchable.indexOf(able.name as any) > -1;
        })).filter(able => able.canPinch && able[controlEventName]);

        datas.pinchableDatas = {};

        const result = triggerEvent(moveable, eventName, {
            [targets ? "targets" : "target"]: targets ? targets : state.target!,
            clientX,
            clientY,
            datas: datas.pinchableDatas,
        } as any);

        datas.isPinch = result !== false;
        datas.ables = pinchAbles;

        const isPinch = datas.isPinch;

        if (!isPinch) {
            return false;
        }
        const parentRotate = getRotatiion(touches);

        pinchAbles.forEach(able => {
            datas[able.name + "Datas"] = {};
            const e: any = {
                datas: datas[able.name + "Datas"],
                clientX,
                clientY,
                inputEvent,
                parentRotate,
                pinchFlag: true,
            };
            able[controlEventName]!(moveable, e);
        });

        return isPinch;
    },
    pinch(
        moveable: MoveableManager<PinchableProps>,
        { datas, clientX, clientY, scale: pinchScale, distance, touches, inputEvent, targets }: any,
    ) {
        if (!datas.isPinch) {
            return;
        }
        const parentRotate = getRotatiion(touches);
        const parentDistance = distance * (1 - 1 / pinchScale);
        const target = moveable.state.target!;
        const params: any = {
            [targets ? "targets" : "target"]: targets ? targets : target,
            clientX,
            clientY,
            datas: datas.pinchableDatas,
        };
        const eventName = `onPinch${targets ? "Group" : ""}` as "onPinch";
        triggerEvent(moveable, eventName, params);

        const ables: Able[] = datas.ables;
        const controlEventName = `drag${targets ? "Group" : ""}Control` as "dragControl";

        ables.forEach(able => {
            able[controlEventName]!(moveable, {
                clientX,
                clientY,
                datas: datas[able.name + "Datas"],
                inputEvent,
                parentDistance,
                parentRotate,
                pinchFlag: true,
            } as any);
        });
        return params;
    },
    pinchEnd(
        moveable: MoveableManager<PinchableProps>,
        { datas, clientX, clientY, isPinch, inputEvent, targets }: any,
    ) {
        if (!datas.isPinch) {
            return;
        }
        const target = moveable.state.target!;
        const eventName = `onPinch${targets ? "Group" : ""}End` as "onPinchEnd";
        triggerEvent(moveable, eventName, {
            [targets ? "targets" : "target"]: targets ? targets : target,
            isDrag: isPinch,
            clientX,
            clientY,
            datas: datas.pinchableDatas,
        } as any);
        const ables: Able[] = datas.ables;
        const controlEventName = `drag${targets ? "Group" : ""}ControlEnd` as "dragControlEnd";

        ables.forEach(able => {
            able[controlEventName]!(moveable, {
                clientX,
                clientY,
                isDrag: isPinch,
                datas: datas[able.name + "Datas"],
                inputEvent,
                pinchFlag: true,
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
