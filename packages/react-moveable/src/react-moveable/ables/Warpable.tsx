import { prefix, getLineStyle, getDirection, getAbsolutePosesByState, triggerEvent, fillParams } from "../utils";
import {
    convertDimension, invert, multiply,
    convertMatrixtoCSS, caculate,
    createIdentityMatrix,
    ignoreDimension,
    multiplyCSS,
    minus,
    createWarpMatrix,
    getRad,
    plus,
} from "@moveable/matrix";
import { NEARBY_POS } from "../consts";
import { setDragStart, getDragDist, getPosIndexesByDirection } from "../DraggerUtils";
import MoveableManager from "../MoveableManager";
import {
    WarpableProps, ScalableProps, ResizableProps,
    Renderer, SnappableProps, SnappableState,
    OnWarpStart, OnWarp, OnWarpEnd,
} from "../types";
import { hasClass, dot } from "@daybrush/utils";
import { renderAllDirections } from "../renderDirection";
import { checkSnapPoses, hasGuidelines, getNearestSnapGuidelineInfo } from "./Snappable";

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
    ableGroup: "size",
    props: {
        warpable: Boolean,
        renderDirections: Array,
    },
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
            ...renderAllDirections(moveable, React),
        ];
    },
    dragControlCondition(target: HTMLElement | SVGElement) {
        return hasClass(target, prefix("direction"));
    },
    dragControlStart(
        moveable: MoveableManager<WarpableProps, SnappableState>,
        e: any,
    ) {
        const { datas, inputEvent } = e;
        const { target } = moveable.props;
        const { target: inputTarget } = inputEvent;
        const direction = getDirection(inputTarget);

        if (!direction || !target) {
            return false;
        }
        const state = moveable.state;
        const {
            transformOrigin, is3d,
            targetTransform, targetMatrix,
            width, height,
            left, top,
        } = state;

        datas.datas = {};
        datas.targetTransform = targetTransform;
        datas.warpTargetMatrix = is3d ? targetMatrix : convertDimension(targetMatrix, 3, 4);
        datas.targetInverseMatrix = ignoreDimension(invert(datas.warpTargetMatrix, 4), 3, 4);
        datas.direction = direction;
        datas.left = left;
        datas.top = top;

        setDragStart(moveable, { datas });
        datas.poses = [
            [0, 0],
            [width, 0],
            [0, height],
            [width, height],
        ].map((p, i) => minus(p, transformOrigin));

        datas.nextPoses = datas.poses.map(([x, y]: number[]) => caculate(datas.warpTargetMatrix, [x, y, 0, 1], 4));
        datas.startMatrix = createIdentityMatrix(4);
        datas.prevMatrix = createIdentityMatrix(4);
        datas.absolutePoses = getAbsolutePosesByState(state);
        datas.posIndexes = getPosIndexesByDirection(direction);
        state.snapRenderInfo = {
            direction,
        };

        const params = fillParams<OnWarpStart>(moveable, e, {
            set: (matrix: number[]) => {
                datas.startMatrix = matrix;
            },
        });
        const result = triggerEvent(moveable, "onWarpStart", params);
        if (result !== false) {
            datas.isWarp = true;
        }
        return datas.isWarp;
    },
    dragControl(
        moveable: MoveableManager<WarpableProps & SnappableProps, SnappableState>,
        e: any,
    ) {
        const { datas } = e;
        let { distX, distY } = e;
        const {
            targetInverseMatrix, prevMatrix, isWarp, startMatrix,
            poses,
            posIndexes,
            absolutePoses,
        } = datas;

        if (!isWarp) {
            return false;
        }

        if (hasGuidelines(moveable, "warpable")) {
            const selectedPoses: number[][] = posIndexes.map((index: number) => absolutePoses[index]);

            if (selectedPoses.length > 1) {
                selectedPoses.push([
                    (selectedPoses[0][0] + selectedPoses[1][0]) / 2,
                    (selectedPoses[0][1] + selectedPoses[1][1]) / 2,
                ]);
            }
            const {
                horizontal: horizontalSnapInfo,
                vertical: verticalSnapInfo,
            } = checkSnapPoses(
                moveable,
                selectedPoses.map(pos => pos[0] + distX),
                selectedPoses.map(pos => pos[1] + distY),
            );

            distY -= getNearestSnapGuidelineInfo(horizontalSnapInfo).offset;
            distX -= getNearestSnapGuidelineInfo(verticalSnapInfo).offset;
        }

        const dist = getDragDist({ datas, distX, distY }, true);
        const nextPoses = datas.nextPoses.slice();

        posIndexes.forEach((index: number) => {
            nextPoses[index] = plus(nextPoses[index], dist);
        });

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

        const delta = multiplyCSS(invert(prevMatrix, 4), matrix, 4);

        datas.prevMatrix = matrix;

        triggerEvent(moveable, "onWarp", fillParams<OnWarp>(moveable, e, {
            delta,
            matrix: multiplyCSS(startMatrix, matrix, 4),
            multiply: multiplyCSS,
            dist: matrix,
            transform,
        }));
        return true;
    },
    dragControlEnd(
        moveable: MoveableManager<WarpableProps>,
        e: any,
    ) {
        const { datas, isDrag } = e;
        if (!datas.isWarp) {
            return false;
        }
        datas.isWarp = false;

        triggerEvent(moveable, "onWarpEnd", fillParams<OnWarpEnd>(moveable, e, {
            isDrag,
        }));
        return isDrag;
    },
};
