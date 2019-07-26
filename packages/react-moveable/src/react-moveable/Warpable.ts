import Moveable from "./Moveable";
import { warp as warpMatrix, getRad } from "./utils";
import {
    convertDimension, invert,
    ignoreTranslate, multiply,
    convertMatrixtoCSS, caculate,
    createIdentityMatrix,
    ignoreDimension,
    multiplyCSS,
} from "./matrix";
import { NEARBY_POS } from "./consts";

function getTriangleRad(pos1: number[], pos2: number[], pos3: number[]) {
    // pos1 Rad
    const rad1 = getRad(pos1, pos2);
    const rad2 = getRad(pos1, pos3);

    const rad = rad2 - rad1;

    return rad >= 0 ? rad : rad + 2 * Math.PI;
}
function isValidPos(poses1: number[][], poses2: number[][]) {
    const rad1 = getTriangleRad(poses1[0], poses1[1], poses1[2]);
    const rad2 = getTriangleRad(poses2[0], poses2[1], poses2[2]);
    const pi = Math.PI;

    if ((rad1 > pi && rad2 < pi) || (rad1 < pi && rad2 > pi)) {
        return false;
    }
    return true;
}
export function warpStart(moveable: Moveable, position: number[] | undefined, { datas, clientX, clientY }: any) {
    const target = moveable.props.target;

    if (!position || !target) {
        return false;
    }
    const {
        transformOrigin, is3d,
        beforeMatrix,
        targetTransform, targetMatrix, width, height,
    } = moveable.state;

    datas.targetTransform = targetTransform;
    datas.targetMatrix = is3d ? targetMatrix : convertDimension(targetMatrix, 3, 4);
    datas.targetInverseMatrix = ignoreDimension(invert(datas.targetMatrix, 4), 3, 4);
    datas.beforeMatrix = is3d ? beforeMatrix : convertDimension(beforeMatrix, 3, 4);
    datas.inverseBeforeMatrix = invert(ignoreTranslate(datas.beforeMatrix, 4), 4);
    datas.position = position;
    datas.is3d = is3d;

    datas.poses = [
        [0, 0],
        [width, 0],
        [0, height],
        [width, height],
    ].map(pos => pos.map((p, i) => p - transformOrigin[i]));

    datas.nextPoses = datas.poses.map(([x, y]: number[]) => caculate(datas.targetMatrix, [x, y, 0, 1], 4));
    datas.posNum =
        (position[0] === -1 ? 0 : 1)
        + (position[1] === -1 ? 0 : 2);

    datas.prevMatrix = createIdentityMatrix(4);

    moveable.props.onWarpStart!({
        target,
        clientX,
        clientY,
    });
}
export function warp(moveable: Moveable, { datas, clientX, clientY, distX, distY }: any) {
    const { posNum, poses, targetInverseMatrix, inverseBeforeMatrix, prevMatrix } = datas;
    const target = moveable.props.target!;
    const dist = caculate(inverseBeforeMatrix, [distX, distY, 0, 1], 4);
    const nextPoses = datas.nextPoses.slice();

    nextPoses[posNum] = [nextPoses[posNum][0] + dist[0], nextPoses[posNum][1] + dist[1]];

    if (!isValidPos( NEARBY_POS[posNum].map(i => poses[i]), NEARBY_POS[posNum].map(i => nextPoses[i]))) {
        return;
    }
    const h = warpMatrix(
        poses[0],
        poses[1],
        poses[2],
        poses[3],
        nextPoses[0],
        nextPoses[1],
        nextPoses[2],
        nextPoses[3],
    );

    if (!h.length) {
        return;
    }

    const matrix = convertMatrixtoCSS(multiply(targetInverseMatrix, h, 4));
    const transform = `${datas.targetTransform} matrix3d(${matrix.join(",")})`;

    const delta = multiply(invert(prevMatrix, 4), matrix, 4);

    datas.prevMatrix = matrix;
    moveable.props.onWarp!({
        target,
        clientX,
        clientY,
        delta,
        multiply: multiplyCSS,
        dist: matrix,
        transform,
    });

    moveable.updateRect();
}

export function warpEnd(moveable: Moveable, { isDrag, clientX, clientY }: any) {
    moveable.props.onWarpEnd!({
        target: moveable.props.target!,
        clientX,
        clientY,
        isDrag,
    });
    if (isDrag) {
        moveable.updateRect();
    }
}
