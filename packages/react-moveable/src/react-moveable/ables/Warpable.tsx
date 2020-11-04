import {
    prefix, getLineStyle, getDirection, getAbsolutePosesByState,
    triggerEvent, fillParams, fillEndParams,
 } from "../utils";
import {
    convertDimension, invert, multiply,
    calculate,
    createIdentityMatrix,
    ignoreDimension,
    minus,
    createWarpMatrix,
    plus,
} from "@scena/matrix";
import { NEARBY_POS } from "../consts";
import {
    setDragStart, getDragDist, getPosIndexesByDirection, setDefaultTransformIndex,
    fillTransformStartEvent, resolveTransformEvent, convertTransformFormat, fillOriginalTransform, getTransfromMatrix
} from "../gesto/GestoUtils";
import {
    WarpableProps, ScalableProps, ResizableProps,
    Renderer, SnappableProps, SnappableState,
    OnWarpStart, OnWarp, OnWarpEnd, MoveableManagerInterface,
} from "../types";
import { hasClass, dot, getRad } from "@daybrush/utils";
import { renderAllDirections } from "../renderDirection";
import { hasGuidelines, checkMoveableSnapBounds } from "./Snappable";

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

/**
 * @namespace Moveable.Warpable
 * @description Warpable indicates whether the target can be warped(distorted, bented).
 */
export default {
    name: "warpable",
    ableGroup: "size",
    props: {
        warpable: Boolean,
        renderDirections: Array,
    } as const,
    events: {
        onWarpStart: "warpStart",
        onWarp: "warp",
        onWarpEnd: "warpEnd",
    } as const,
    render(moveable: MoveableManagerInterface<ResizableProps & ScalableProps & WarpableProps>, React: Renderer): any[] {
        const { resizable, scalable, warpable } = moveable.props;

        if (resizable || scalable || !warpable) {
            return [];
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
    dragControlCondition(e: any) {
        if (e.isRequest) {
            return false;
        }
        return hasClass(e.inputEvent.target, prefix("direction"));
    },
    dragControlStart(
        moveable: MoveableManagerInterface<WarpableProps, SnappableState>,
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

        setDragStart(moveable, e);
        setDefaultTransformIndex(e);

        datas.poses = [
            [0, 0],
            [width, 0],
            [0, height],
            [width, height],
        ].map(p => minus(p, transformOrigin));

        datas.nextPoses = datas.poses.map(([x, y]: number[]) => calculate(datas.warpTargetMatrix, [x, y, 0, 1], 4));
        datas.startValue = createIdentityMatrix(4);
        datas.prevMatrix = createIdentityMatrix(4);
        datas.absolutePoses = getAbsolutePosesByState(state);
        datas.posIndexes = getPosIndexesByDirection(direction);

        state.snapRenderInfo = {
            request: e.isRequest,
            direction,
        };

        const params = fillParams<OnWarpStart>(moveable, e, {
            set: (matrix: number[]) => {
                datas.startValue = matrix;
            },
            ...fillTransformStartEvent(e),
        });
        const result = triggerEvent(moveable, "onWarpStart", params);
        if (result !== false) {
            datas.isWarp = true;
        }
        return datas.isWarp;
    },
    dragControl(
        moveable: MoveableManagerInterface<WarpableProps & SnappableProps, SnappableState>,
        e: any,
    ) {
        const { datas, isRequest } = e;
        let { distX, distY } = e;
        const {
            targetInverseMatrix, prevMatrix, isWarp, startValue,
            poses,
            posIndexes,
            absolutePoses,
        } = datas;

        if (!isWarp) {
            return false;
        }
        resolveTransformEvent(e, "matrix3d");
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
            } = checkMoveableSnapBounds(
                moveable,
                isRequest,
                selectedPoses.map(pos => [pos[0] + distX, pos[1] + distY]),
            );

            distY -= horizontalSnapInfo.offset;
            distX -= verticalSnapInfo.offset;
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
            poses[2],
            poses[1],
            poses[3],
            nextPoses[0],
            nextPoses[2],
            nextPoses[1],
            nextPoses[3],
        );

        if (!h.length) {
            return false;
        }
        // B * A * M
        const afterMatrix = multiply(targetInverseMatrix, h, 4);

        // B * M * A
        const matrix = getTransfromMatrix(datas, afterMatrix, true);

        const delta = multiply(invert(prevMatrix, 4), matrix, 4);

        datas.prevMatrix = matrix;
        const totalMatrix = multiply(startValue, matrix, 4);
        const nextTransform = convertTransformFormat(
            datas, `matrix3d(${totalMatrix.join(", ")})`, `matrix3d(${matrix.join(", ")})`);

        fillOriginalTransform(e, nextTransform);
        triggerEvent(moveable, "onWarp", fillParams<OnWarp>(moveable, e, {
            delta,
            matrix: totalMatrix,
            dist: matrix,
            multiply,
            transform: nextTransform,
        }));
        return true;
    },
    dragControlEnd(
        moveable: MoveableManagerInterface<WarpableProps>,
        e: any,
    ) {
        const { datas, isDrag } = e;
        if (!datas.isWarp) {
            return false;
        }
        datas.isWarp = false;

        triggerEvent(moveable, "onWarpEnd", fillEndParams<OnWarpEnd>(moveable, e, {}));
        return isDrag;
    },
};

/**
 * Whether or not target can be warped. (default: false)
 * @name Moveable.Warpable#warpable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.warpable = true;
 */

 /**
 * Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
 * @name Moveable.Warpable#renderDirections
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     warpable: true,
 *     renderDirections: ["n", "nw", "ne", "s", "se", "sw", "e", "w"],
 * });
 *
 * moveable.renderDirections = ["nw", "ne", "sw", "se"];
 */
/**
* When the warp starts, the warpStart event is called.
* @memberof Moveable.Warpable
* @event warpStart
* @param {Moveable.Warpable.OnWarpStart} - Parameters for the warpStart event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, { warpable: true });
* moveable.on("warpStart", ({ target }) => {
*     console.log(target);
* });
*/
/**
 * When warping, the warp event is called.
 * @memberof Moveable.Warpable
 * @event warp
 * @param {Moveable.Warpable.OnWarp} - Parameters for the warp event
 * @example
 * import Moveable from "moveable";
 * let matrix = [
 *  1, 0, 0, 0,
 *  0, 1, 0, 0,
 *  0, 0, 1, 0,
 *  0, 0, 0, 1,
 * ];
 * const moveable = new Moveable(document.body, { warpable: true });
 * moveable.on("warp", ({ target, transform, delta, multiply }) => {
 *    // target.style.transform = transform;
 *    matrix = multiply(matrix, delta);
 *    target.style.transform = `matrix3d(${matrix.join(",")})`;
 * });
 */
/**
 * When the warp finishes, the warpEnd event is called.
 * @memberof Moveable.Warpable
 * @event warpEnd
 * @param {Moveable.Warpable.OnWarpEnd} - Parameters for the warpEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { warpable: true });
 * moveable.on("warpEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
