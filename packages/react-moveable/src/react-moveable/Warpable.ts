import Moveable from "./Moveable";
import { warp as warpMatrix } from "./utils";
import { convertDimension, invert, ignoreTranslate, multiply, convertMatrixtoCSS } from "./matrix";

export function warpStart(moveable: Moveable, position: number[] | undefined, { datas, clientX, clientY }: any) {
    const target = moveable.props.target;

    if (!position || !target) {
        return false;
    }
    const {
        transformOrigin, is3d,
        beforeMatrix, targetTransform, targetMatrix, width, height,
    } = moveable.state;

    datas.targetTransform = targetTransform;
    datas.targetMatrix = is3d ? targetMatrix : convertDimension(targetMatrix, 3, 4);
    datas.beforeMatrix = is3d ? beforeMatrix : convertDimension(beforeMatrix, 3, 4);
    datas.targetInverseMatrix = invert(datas.targetMatrix, 4);
    datas.position = position;
    datas.is3d = is3d;

    datas.poses = [
        [0, 0],
        [width, 0],
        [0, height],
        [width, height],
    ].map(pos => pos.map((p, i) => p - transformOrigin[i]));

    datas.nextPoses = datas.poses.map(([x, y]: number[]) => multiply(datas.targetMatrix, [x, y, 0, 1], 4));
    datas.posNum =
        (position[0] === -1 ? 0 : 1)
        + (position[1] === -1 ? 0 : 2);

    moveable.props.onWarpStart!({
        target,
        clientX,
        clientY,
    });
}

export function warp(moveable: Moveable, { datas, clientX, clientY, distX, distY, deltaX, deltaY }: any) {
    const { posNum, poses, targetInverseMatrix } = datas;
    const target = moveable.props.target!;
    // moveable.setState({
    //     [posName]: [x + deltaX, y + deltaY],
    // });
    const nextPoses = datas.nextPoses.slice();

    nextPoses[posNum] = [nextPoses[posNum][0] + distX, nextPoses[posNum][1] + distY];

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

    target.style.transform = `${datas.targetTransform} matrix3d(${
        convertMatrixtoCSS(multiply(targetInverseMatrix, h, 4)).join(",")
    })`;

}
