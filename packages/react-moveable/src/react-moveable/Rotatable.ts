import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";
import { caculateRotationMatrix, caculatePosition } from "./utils";

function getRotateInfo(moveable: Moveable, datas: any, clientX: number, clientY: number) {
    const startRad = datas.startRad;
    const prevRad = datas.prevRad;
    const prevLoop = datas.loop;
    const rad = moveable.getRadByPos([clientX, clientY]);

    if (prevRad > rad && prevRad > 270 && rad < 90) {
        // 360 => 0
        ++datas.loop;
    } else if (prevRad < rad && prevRad < 90 && rad > 270) {
        // 0 => 360
        --datas.loop;
    }

    const absolutePrevRad = prevLoop * 360 + prevRad;
    const absoluteRad = datas.loop * 360 + rad;
    const {
        width,
        height,
        transformOrigin,
        origin: prevOrigin,
        left: prevLeft,
        top: prevTop,
    } = moveable.state;

    const direction = datas.direction;

    const matrix = caculateRotationMatrix(datas.matrix, direction * (rad - startRad));
    const prevAbsoluteOrigin = [prevLeft + prevOrigin[0], prevTop + prevOrigin[1]];
    const [origin, pos1, pos2, pos3, pos4]
        = caculatePosition(matrix, transformOrigin, width, height);
    const left = prevAbsoluteOrigin[0] - origin[0];
    const top = prevAbsoluteOrigin[1] - origin[1];

    datas.prevRad = rad;

    return {
        delta: direction * (absoluteRad - absolutePrevRad) / Math.PI * 180,
        dist: direction * (absolutePrevRad - startRad) / Math.PI * 180,
        origin,
        pos1,
        pos2,
        pos3,
        pos4,
        matrix,
        left,
        top,
    };
}

export function rotateStart(moveable: Moveable, { datas, clientX, clientY }: any) {
    const { target, matrix, left, top } = moveable.state;

    datas.transform = window.getComputedStyle(target!).transform;
    datas.matrix = matrix;
    datas.left = left;
    datas.top = top;
    datas.prevRad = moveable.getRadByPos([clientX, clientY]);
    datas.startRad = datas.prevRad;
    datas.loop = 0;
    datas.direction = moveable.getDirection();

    if (datas.transform === "none") {
        datas.transform = "";
    }
}
export function rotate(moveable: Moveable, { datas, clientX, clientY }: any) {
    const {
        delta,
        dist,
        origin,
        pos1,
        pos2,
        pos3,
        pos4,
        matrix,
        left,
        top,
    } = getRotateInfo(moveable, datas, clientX, clientY);

    moveable.props.onRotate!({
        delta,
        dist,
        transform: `${datas.transform} rotate(${dist}deg)`,
    });
    moveable.setState({
        origin,
        pos1,
        pos2,
        pos3,
        pos4,
        matrix,
        left,
        top,
    });
}
export function rotateEnd(moveable: Moveable, { isDrag }: any) {
    moveable.props.onRotateEnd!({ isDrag });
    if (isDrag) {
        moveable.updateRect();
    }
}
