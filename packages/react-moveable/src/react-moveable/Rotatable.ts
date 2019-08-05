import Moveable from "./Moveable";
import { getRad, throttle } from "./utils";
import { IObject } from "@daybrush/utils";

function setRotateStartInfo(
    datas: IObject<any>, clientX: number, clientY: number, origin: number[], rotationPos: number[]) {
    datas.startAbsoluteOrigin = [
        clientX - rotationPos[0] + origin[0],
        clientY - rotationPos[1] + origin[1],
    ];
    datas.prevDeg = getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180;
    datas.startDeg = datas.prevDeg;
    datas.loop = 0;
}
function getDeg(
    datas: IObject<any>,
    deg: number,
    direction: number,
    throttleRotate: number,
) {
    const {
        prevDeg,
        startDeg,
        loop: prevLoop,
    } = datas;
    deg = throttle(deg, throttleRotate);
    if (prevDeg > deg && prevDeg > 270 && deg < 90) {
        // 360 => 0
        ++datas.loop;
    } else if (prevDeg < deg && prevDeg < 90 && deg > 270) {
        // 0 => 360
        --datas.loop;
    }
    const absolutePrevDeg = prevLoop * 360 + prevDeg;
    const absoluteDeg = datas.loop * 360 + deg;

    const delta = direction * (absoluteDeg - absolutePrevDeg);
    const dist = direction * (absoluteDeg - startDeg);

    datas.prevDeg = deg;

    return [delta, dist];
}
function getRotateInfo(
    datas: IObject<any>,
    direction: number,
    clientX: number, clientY: number,
    throttleRotate: number,
) {
    return getDeg(
        datas,
        getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180,
        direction,
        throttleRotate,
    );
}
export function rotateStart(moveable: Moveable, { datas, clientX, clientY, pinchRotate, pinchFlag }: any) {
    const target = moveable.props.target;

    if (!target) {
        return false;
    }
    const state = moveable.state;
    const {
        left, top, origin, beforeOrigin,
        rotationPos, direction, beforeDirection, targetTransform,
    } = state;

    datas.transform = targetTransform;
    datas.left = left;
    datas.top = top;

    if (pinchFlag) {
        datas.beforeInfo = { prevDeg: pinchRotate, startDeg: pinchRotate, loop: 0 };
        datas.afterInfo = { prevDeg: pinchRotate, startDeg: pinchRotate, loop: 0 };
    } else {
        datas.afterInfo = {};
        datas.beforeInfo = {};
        setRotateStartInfo(datas.afterInfo, clientX, clientY, origin, rotationPos);
        setRotateStartInfo(datas.beforeInfo, clientX, clientY, beforeOrigin, rotationPos);
    }

    datas.direction = direction;
    datas.beforeDirection = beforeDirection;
    datas.datas = {};

    const result = moveable.props.onRotateStart!({
        datas: datas.datas,
        target,
        clientX,
        clientY,
    });
    if (result !== false) {
        state.isRotate = true;
    }
    return result;
}
export function rotate(moveable: Moveable, { datas, clientX, clientY, pinchRotate, pinchFlag }: any) {
    const {
        direction,
        beforeDirection,
        beforeInfo,
        afterInfo,
    } = datas;
    const throttleRotate = moveable.props.throttleRotate!;

    let delta: number;
    let dist: number;
    let beforeDelta: number;
    let beforeDist: number;

    if (pinchFlag) {
        [delta, dist] = getDeg(afterInfo, pinchRotate, direction, throttleRotate);
        [beforeDelta, beforeDist] = getDeg(beforeInfo, pinchRotate, direction, throttleRotate);
    } else {
        [delta, dist] = getRotateInfo(afterInfo, direction, clientX, clientY, throttleRotate);
        [beforeDelta, beforeDist] = getRotateInfo(
            beforeInfo, beforeDirection, clientX, clientY, throttleRotate);
    }
    if (!delta && !beforeDelta) {
        return;
    }
    moveable.props.onRotate!({
        target: moveable.props.target!,
        datas: datas.datas,
        delta,
        dist,
        clientX,
        clientY,
        beforeDist,
        beforeDelta,
        transform: `${datas.transform} rotate(${dist}deg)`,
        isPinch: !!pinchFlag,
    });

    !pinchFlag && moveable.updateTarget();
}
export function rotateEnd(moveable: Moveable, { datas, isDrag, clientX, clientY, pinchFlag }: any) {
    moveable.state.isRotate = false;
    moveable.props.onRotateEnd!({
        datas: datas.datas,
        clientX,
        clientY,
        target: moveable.props.target!,
        isDrag,
    });
    if (isDrag && !pinchFlag) {
        moveable.updateRect();
    }
}
