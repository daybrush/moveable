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
function getRotateInfo(
    datas: IObject<any>,
    direction: number,
    clientX: number, clientY: number,
    throttleRotate: number,
) {
    const {
        startAbsoluteOrigin,
        prevDeg,
        startDeg,
        loop: prevLoop,
    } = datas;
    const deg = throttle(
        getRad(startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180,
        throttleRotate,
    );

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
export function rotateStart(moveable: Moveable, { datas, clientX, clientY }: any) {
    const target = moveable.props.target;

    if (!target) {
        return false;
    }
    const {
        left, top, origin, beforeOrigin,
        rotationPos, direction, beforeDirection, targetTransform,
    } = moveable.state;

    datas.transform = targetTransform;
    datas.left = left;
    datas.top = top;

    datas.afterInfo = {};
    datas.beforeInfo = {};

    setRotateStartInfo(datas.afterInfo, clientX, clientY, origin, rotationPos);
    setRotateStartInfo(datas.beforeInfo, clientX, clientY, beforeOrigin, rotationPos);

    datas.direction = direction;
    datas.beforeDirection = beforeDirection;
    datas.datas = {};

    if (datas.transform === "none") {
        datas.transform = "";
    }
    moveable.props.onRotateStart!({
        datas: datas.datas,
        target,
        clientX,
        clientY,
    });
}
export function rotate(moveable: Moveable, { datas, clientX, clientY }: any) {

    const {
        direction,
        beforeDirection,
    } = datas;
    const throttleRotate = moveable.props.throttleRotate!;
    const [delta, dist] = getRotateInfo(datas.afterInfo, direction, clientX, clientY, throttleRotate);
    const [beforeDelta, beforeDist] = getRotateInfo(
        datas.beforeInfo, beforeDirection, clientX, clientY, throttleRotate);

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
    });

    moveable.updateTarget();
}
export function rotateEnd(moveable: Moveable, { datas, isDrag, clientX, clientY }: any) {
    moveable.props.onRotateEnd!({
        datas: datas.datas,
        clientX,
        clientY,
        target: moveable.props.target!,
        isDrag,
    });
    if (isDrag) {
        moveable.updateRect();
    }
}
