import Moveable from "./Moveable";
import { warp as warpMatrix, getRad } from "./utils";
import {
    convertDimension, invert, multiply,
    convertMatrixtoCSS, caculate,
    createIdentityMatrix,
    ignoreDimension,
    multiplyCSS,
    minus,
} from "./matrix";
import { NEARBY_POS } from "./consts";
import { dragStart, getDragDist } from "./Draggable";

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

    if ((rad1 >= pi && rad2 <= pi) || (rad1 <= pi && rad2 >= pi)) {
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
        targetTransform, targetMatrix, width, height,
    } = moveable.state;

    datas.datas = {};
    datas.targetTransform = targetTransform;
    datas.targetMatrix = is3d ? targetMatrix : convertDimension(targetMatrix, 3, 4);
    datas.targetInverseMatrix = ignoreDimension(invert(datas.targetMatrix, 4), 3, 4);
    datas.position = position;

    dragStart(moveable, { datas });
    datas.poses = [
        [0, 0],
        [width, 0],
        [0, height],
        [width, height],
    ].map((p, i) => minus(p, transformOrigin));

    datas.nextPoses = datas.poses.map(([x, y]: number[]) => caculate(datas.targetMatrix, [x, y, 0, 1], 4));
    datas.posNum =
        (position[0] === -1 ? 0 : 1)
        + (position[1] === -1 ? 0 : 2);
    datas.prevMatrix = createIdentityMatrix(4);
    return moveable.props.onWarpStart!({
        target,
        clientX,
        clientY,
        datas: datas.datas,
    });
}
export function warp(moveable: Moveable, { datas, clientX, clientY, distX, distY }: any) {
    const { posNum, poses, targetInverseMatrix, prevMatrix } = datas;
    const target = moveable.props.target!;
    const dist = getDragDist({ datas, distX, distY }, true);
    const nextPoses = datas.nextPoses.slice();

    nextPoses[posNum] = [nextPoses[posNum][0] + dist[0], nextPoses[posNum][1] + dist[1]];

    if (!NEARBY_POS.every(
        nearByPoses => isValidPos(nearByPoses.map(i => poses[i]), nearByPoses.map(i => nextPoses[i])),
    )) {
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
        datas: datas.datas,
    });

    moveable.updateRect();
}

export function warpEnd(moveable: Moveable, { datas, isDrag, clientX, clientY }: any) {
    moveable.props.onWarpEnd!({
        target: moveable.props.target!,
        clientX,
        clientY,
        isDrag,
        datas: datas.datas,
    });
    if (isDrag) {
        moveable.updateRect();
    }
}
