import { OnPinchStart, OnPinch, OnPinchEnd, Client } from "@daybrush/drag";
import { getRad } from "../utils";
import Scalable from "./Scalable";
import Rotatable from "./Rotatable";
import Resizable from "./Resizable";
import MoveableManager from "../MoveableManager";
import { PinchableProps } from "../types";

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
    pinchStart(
        moveable: MoveableManager<PinchableProps>,
        { datas, clientX, clientY, touches, inputEvent }: OnPinchStart,
    ) {
        datas.scaleDatas = {};
        datas.rotateDatas = {};
        datas.pinchDatas = {};

        const { pinchable, rotatable, scalable, resizable, target, onPinchStart } = moveable.props;
        const isRotatable = pinchable && (pinchable === true ? rotatable : pinchable.indexOf("rotatable") > -1);
        const isResizable = pinchable && (pinchable === true ? resizable : pinchable.indexOf("resizable") > -1);
        const isScalable = isResizable
            ? false
            : (pinchable && (pinchable === true ? scalable : pinchable.indexOf("scalable") > -1));

        datas.isPinch = true;
        onPinchStart && onPinchStart!({
            target: target!,
            clientX,
            clientY,
            datas: datas.pinchDatas,
        });
        if (isRotatable) {
            Rotatable.dragControlStart(moveable, {
                datas: datas.rotateDatas,
                clientX,
                clientY,
                pinchFlag: true,
                pinchRotate: getRotatiion(touches),
            });
        }
        if (isResizable) {
            Resizable.dragControlStart(moveable, {
                datas: datas.scaleDatas,
                clientX,
                clientY,
                pinchFlag: true,
                inputEvent,
            });
        }
        if (isScalable) {
            Scalable.dragControlStart(moveable, {
                datas: datas.scaleDatas,
                clientX,
                clientY,
                pinchFlag: true,
                inputEvent,
            });
        }
        datas.isPinch = true;
    },
    pinch(
        moveable: MoveableManager<PinchableProps>,
        { datas, clientX, clientY, scale: pinchScale, distance, touches, inputEvent }: OnPinch,
    ) {
        const {
            rotateDatas: { isRotate },
            scaleDatas: { isScale },
            resizeDatas: { isResize },
        } = datas;
        const { target, onPinch } = moveable.props;

        inputEvent.preventDefault();
        inputEvent.stopPropagation();

        onPinch && onPinch!({
            target: target!,
            clientX,
            clientY,
            datas: datas.pinchDatas,
        });
        if (isRotate) {
            Rotatable.dragControl(moveable, {
                datas: datas.rotateDatas,
                pinchRotate: getRotatiion(touches),
                pinchFlag: true,
            });
        }
        if (isResize) {
            const pinchDistance = distance * (1 - 1 / pinchScale);

            Resizable.dragControl(moveable, {
                datas: datas.scaleDatas,
                clientX, clientY,
                pinchDistance,
                pinchFlag: true,
            });
        }
        if (isScale) {
            const pinchDistance = distance * (1 - 1 / pinchScale);

            Scalable.dragControl(moveable, {
                datas: datas.scaleDatas,
                clientX, clientY,
                pinchDistance,
                pinchFlag: true,
            });
        }
        return true;
    },
    pinchEnd(moveable: MoveableManager<PinchableProps>, { datas, clientX, clientY, isPinch }: OnPinchEnd) {
        const {
            rotateDatas: { isRotate },
            scaleDatas: { isScale },
            resizeDatas: { isResize },
        } = datas;
        const { target, onPinchEnd } = moveable.props;
        datas.isPinch = false;
        onPinchEnd && onPinchEnd!({
            target: target!,
            isDrag: isPinch,
            clientX,
            clientY,
            datas: datas.pinchDatas,
        });
        if (isRotate) {
            Rotatable.dragControlEnd(moveable, {
                datas: datas.rotateDatas,
                clientX, clientY,
                isDrag: isPinch,
                pinchFlag: true,
            });
        }
        if (isResize) {
            Resizable.dragControlEnd(moveable, {
                datas: datas.scaleDatas,
                clientX, clientY,
                isDrag: isPinch,
                pinchFlag: true,
            });
        }
        if (isScale) {
            Scalable.dragControlEnd(moveable, {
                datas: datas.scaleDatas,
                clientX, clientY,
                isDrag: isPinch,
                pinchFlag: true,
            });
        }
        return isPinch;
    },
};
