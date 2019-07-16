import Moveable from "./Moveable";
import { getRad } from "./utils";

function getRotateInfo(datas: any, clientX: number, clientY: number) {
    const {
        startAbsoluteOrigin,
        startRad,
        prevRad,
        loop: prevLoop,
        direction,
    } = datas;
    const rad = getRad(startAbsoluteOrigin, [clientX, clientY]);

    if (prevRad > rad && prevRad > 270 && rad < 90) {
        // 360 => 0
        ++datas.loop;
    } else if (prevRad < rad && prevRad < 90 && rad > 270) {
        // 0 => 360
        --datas.loop;
    }

    const absolutePrevRad = prevLoop * 360 + prevRad;
    const absoluteRad = datas.loop * 360 + rad;

    datas.prevRad = rad;
    return {
        delta: direction * (absoluteRad - absolutePrevRad) / Math.PI * 180,
        dist: direction * (absolutePrevRad - startRad) / Math.PI * 180,
        beforeDelta: (absoluteRad - absolutePrevRad) / Math.PI * 180,
        beforeDist: (absolutePrevRad - startRad) / Math.PI * 180,
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

    datas.prevRad = getRad(datas.startAbsoluteOrigin, [clientX, clientY]);
    datas.startRad = datas.prevRad;
    datas.loop = 0;
    datas.direction = direction;

    if (datas.transform === "none") {
        datas.transform = "";
    }
    moveable.props.onRotateStart!({
        target,
    });
}
export function rotate(moveable: Moveable, { datas, clientX, clientY }: any) {
    const {
        delta,
        dist,
        beforeDist,
        beforeDelta,
    } = getRotateInfo(datas, clientX, clientY);

    moveable.props.onRotate!({
        target: moveable.props.target!,
        delta,
        dist,
        beforeDist,
        beforeDelta,
        transform: `${datas.transform} rotate(${dist}deg)`,
    });

    moveable.updateTargetRect(moveable.props.target!, moveable.state);
}
export function rotateEnd(moveable: Moveable, { isDrag }: any) {
    moveable.props.onRotateEnd!({
        target: moveable.props.target!,
        isDrag,
    });
    if (isDrag) {
        moveable.updateRect();
    }
}
