import Moveable from "./Moveable";
import { OnPinchStart, OnPinch, OnPinchEnd, Client } from "@daybrush/drag";
import { scaleStart, scale, scaleEnd } from "./Scalable";
import { rotateStart, rotate, rotateEnd } from "./Rotatable";
import { getRad } from "./utils";
import { resizeStart, resize, resizeEnd } from "./Resizable";

function getRotatiion(touches: Client[]) {
    return getRad([
        touches[0].clientX,
        touches[0].clientY,
    ], [
            touches[1].clientX,
            touches[1].clientY,
        ]) / Math.PI * 180;
}
export function pinchStart(moveable: Moveable, { datas, clientX, clientY, touches }: OnPinchStart) {
    datas.scaleDatas = {};
    datas.rotateDatas = {};

    const { pinchable, rotatable, scalable, resizable } = moveable.props;

    const isRotatable = pinchable && (pinchable === true ? rotatable : pinchable.indexOf("rotatable") > -1);
    const isResizable = pinchable && (pinchable === true ? resizable : pinchable.indexOf("resizable") > -1);
    const isScalable = isResizable
        ? false
        : (pinchable && (pinchable === true ? scalable : pinchable.indexOf("scalable") > -1));

    if (isRotatable) {
        rotateStart(moveable, {
            datas: datas.rotateDatas,
            clientX,
            clientY,
            pinchFlag: true,
            pinchRotate: getRotatiion(touches),
        });
    }
    if (isResizable) {
        resizeStart(moveable, [1, 1], {
            datas: datas.scaleDatas,
            clientX,
            clientY,
            pinchFlag: true,
        });
    }
    if (isScalable) {
        scaleStart(moveable, [1, 1], {
            datas: datas.scaleDatas,
            clientX,
            clientY,
            pinchFlag: true,
        });
    }
}
export function pinch(
    moveable: Moveable, { datas, clientX, clientY, scale: pinchScale, distance, touches, inputEvent }: OnPinch) {
    const { isRotate, isScale, isResize } = moveable.state;

    inputEvent.preventDefault();
    inputEvent.stopPropagation();

    if (isRotate) {
        rotate(moveable, {
            datas: datas.rotateDatas,
            pinchRotate: getRotatiion(touches),
            pinchFlag: true,
        });
    }
    if (isResize) {
        const pinchDistance = distance * (1 - 1 / pinchScale);

        resize(moveable, {
            datas: datas.scaleDatas,
            clientX, clientY,
            pinchDistance,
            pinchFlag: true,
        });
    }
    if (isScale) {
        const pinchDistance = distance * (1 - 1 / pinchScale);

        scale(moveable, {
            datas: datas.scaleDatas,
            clientX, clientY,
            pinchDistance,
            pinchFlag: true,
        });
    }

    moveable.updateRect();
}
export function pinchEnd(moveable: Moveable, { datas, clientX, clientY, isPinch }: OnPinchEnd) {
    const { isRotate, isScale, isResize } = moveable.state;

    if (isRotate) {
        rotateEnd(moveable, {
            datas: datas.rotateDatas,
            clientX, clientY,
            isDrag: isPinch,
            pinchFlag: true,
        });
    }
    if (isResize) {
        resizeEnd(moveable, {
            datas: datas.scaleDatas,
            clientX, clientY,
            isDrag: isPinch,
            pinchFlag: true,
        });
    }
    if (isScale) {
        scaleEnd(moveable, {
            datas: datas.scaleDatas,
            clientX, clientY,
            isDrag: isPinch,
            pinchFlag: true,
        });
    }
    moveable.updateRect();
}
