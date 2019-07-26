import Moveable from "./Moveable";
import { getRad, throttle } from "./utils";

function getRotateInfo(datas: any, clientX: number, clientY: number, throttleRotate: number) {
    const {
        startAbsoluteOrigin,
        startDeg,
        prevDeg,
        loop: prevLoop,
        direction,
    } = datas;
    const deg = throttle(getRad(startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180, throttleRotate);

    if (prevDeg > deg && prevDeg > 270 && deg < 90) {
        // 360 => 0
        ++datas.loop;
    } else if (prevDeg < deg && prevDeg < 90 && deg > 270) {
        // 0 => 360
        --datas.loop;
    }

    const absolutePrevDeg = prevLoop * 360 + prevDeg;
    const absoluteDeg = datas.loop * 360 + deg;

    datas.prevDeg = deg;
    return {
        delta: direction * (absoluteDeg - absolutePrevDeg),
        dist: direction * (absoluteDeg - startDeg),
        beforeDelta: (absoluteDeg - absolutePrevDeg),
        beforeDist: (absoluteDeg - startDeg),
        origin,
    };
}

export function rotateStart(moveable: Moveable, { datas, clientX, clientY }: any) {
    const target = moveable.props.target;

    if (!target) {
        return false;
    }
    const { matrix, left, top, origin, rotationPos, direction } = moveable.state;

    datas.transform = window.getComputedStyle(target!).transform;
    datas.matrix = matrix;
    datas.left = left;
    datas.top = top;
    datas.startAbsoluteOrigin = [clientX - rotationPos[0] + origin[0], clientY - rotationPos[1] + origin[1]];

    datas.prevDeg = getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180;
    datas.startDeg = datas.prevDeg;
    datas.loop = 0;
    datas.direction = direction;

    if (datas.transform === "none") {
        datas.transform = "";
    }
    moveable.props.onRotateStart!({
        target,
        clientX,
        clientY,
    });
}
export function rotate(moveable: Moveable, { datas, clientX, clientY }: any) {
    const {
        delta,
        dist,
        beforeDist,
        beforeDelta,
    } = getRotateInfo(datas, clientX, clientY, moveable.props.throttleRotate!);

    if (!delta) {
        return;
    }
    moveable.props.onRotate!({
        target: moveable.props.target!,
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
export function rotateEnd(moveable: Moveable, { isDrag, clientX, clientY }: any) {
    moveable.props.onRotateEnd!({
        clientX,
        clientY,
        target: moveable.props.target!,
        isDrag,
    });
    if (isDrag) {
        moveable.updateRect();
    }
}
