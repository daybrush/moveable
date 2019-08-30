import { prefix, getLineStyle, getDirection } from "../utils";
import {
    convertDimension, invert, multiply,
    convertMatrixtoCSS, caculate,
    createIdentityMatrix,
    ignoreDimension,
    multiplyCSS,
    minus,
    createWarpMatrix,
    getRad,
} from "@moveable/matrix";
import { NEARBY_POS } from "../consts";
import { setDragStart, getDragDist } from "../DraggerUtils";
import MoveableManager from "../MoveableManager";
import { WarpableProps, ScalableProps, ResizableProps, Renderer } from "../types";
import { hasClass, dot } from "@daybrush/utils";
import { renderDiagonalDirection } from "../renderDirection";

function getMiddleLinePos(pos1: number[], pos2: number[]) {
    return pos1.map((pos, i) => dot(pos, pos2[i], 1, 2));
}

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

export default {
    name: "warpable",
    dragControlOnly: true,
    render(moveable: MoveableManager<ResizableProps & ScalableProps & WarpableProps>, React: Renderer) {
        const { resizable, scalable, warpable } = moveable.props;

        if (resizable || scalable || !warpable) {
            return;
        }
        const { pos1, pos2, pos3, pos4 } = moveable.state;

        const linePosFrom1 = getMiddleLinePos(pos1, pos2);
        const linePosFrom2 = getMiddleLinePos(pos2, pos1);
        const linePosFrom3 = getMiddleLinePos(pos1, pos3);
        const linePosFrom4 = getMiddleLinePos(pos3, pos1);
        const linePosTo1 = getMiddleLinePos(pos3, pos4);
        const linePosTo2 = getMiddleLinePos(pos4, pos3);
        const linePosTo3 = getMiddleLinePos(pos2, pos4);
        const linePosTo4 = getMiddleLinePos(pos4, pos2);

        return [
            <div className={prefix("line")} key="middeLine1" style={getLineStyle(linePosFrom1, linePosTo1)}></div>,
            <div className={prefix("line")} key="middeLine2" style={getLineStyle(linePosFrom2, linePosTo2)}></div>,
            <div className={prefix("line")} key="middeLine3" style={getLineStyle(linePosFrom3, linePosTo3)}></div>,
            <div className={prefix("line")} key="middeLine4" style={getLineStyle(linePosFrom4, linePosTo4)}></div>,
            ...renderDiagonalDirection(moveable, React),
        ];
    },
    dragControlCondition(target: HTMLElement | SVGElement) {
        return hasClass(target, prefix("direction"));
    },
    dragControlStart(
        moveable: MoveableManager<WarpableProps>,
        { datas, clientX, clientY, inputEvent: { target: inputTarget } }: any,
    ) {
        const { target, onWarpStart } = moveable.props;
        const direction = getDirection(inputTarget);

        if (!direction || !target) {
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
        datas.direction = direction;

        setDragStart(moveable, { datas });
        datas.poses = [
            [0, 0],
            [width, 0],
            [0, height],
            [width, height],
        ].map((p, i) => minus(p, transformOrigin));

        datas.nextPoses = datas.poses.map(([x, y]: number[]) => caculate(datas.targetMatrix, [x, y, 0, 1], 4));
        datas.posNum =
            (direction[0] === -1 ? 0 : 1)
            + (direction[1] === -1 ? 0 : 2);
        datas.prevMatrix = createIdentityMatrix(4);
        const result = onWarpStart && onWarpStart!({
            target,
            clientX,
            clientY,
            datas: datas.datas,
        });
        if (result !== false) {
            datas.isWarp = true;
        }
        return result;
    },
    dragControl(moveable: MoveableManager<WarpableProps>, { datas, clientX, clientY, distX, distY }: any) {
        const { posNum, poses, targetInverseMatrix, prevMatrix, isWarp } = datas;

        if (!isWarp) {
            return false;
        }
        const { target, onWarp } = moveable.props!;
        const dist = getDragDist({ datas, distX, distY }, true);
        const nextPoses = datas.nextPoses.slice();

        nextPoses[posNum] = [nextPoses[posNum][0] + dist[0], nextPoses[posNum][1] + dist[1]];

        if (!NEARBY_POS.every(
            nearByPoses => isValidPos(nearByPoses.map(i => poses[i]), nearByPoses.map(i => nextPoses[i])),
        )) {
            return false;
        }
        const h = createWarpMatrix(
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
            return false;
        }

        const matrix = convertMatrixtoCSS(multiply(targetInverseMatrix, h, 4));
        const transform = `${datas.targetTransform} matrix3d(${matrix.join(",")})`;

        const delta = multiply(invert(prevMatrix, 4), matrix, 4);

        datas.prevMatrix = matrix;
        onWarp && onWarp({
            target: target!,
            clientX,
            clientY,
            delta,
            multiply: multiplyCSS,
            dist: matrix,
            transform,
            datas: datas.datas,
        });
        return true;
    },
    dragControlEnd(moveable: MoveableManager<WarpableProps>, { datas, isDrag, clientX, clientY }: any) {
        if (!datas.isWarp) {
            return false;
        }
        datas.isWarp = false;

        const { target, onWarpEnd } = moveable.props;
        onWarpEnd && onWarpEnd!({
            target: target!,
            clientX,
            clientY,
            isDrag,
            datas: datas.datas,
        });
        return isDrag;
    },
};
