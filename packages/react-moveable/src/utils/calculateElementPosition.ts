import { MoveablePosition } from "../types";
import { calculatePoses, calculatePosition, sign } from "../utils";

export function calculateElementPosition(
    matrix: number[],
    origin: number[],
    width: number,
    height: number,
): MoveablePosition {
    const is3d = matrix.length === 16;
    const n = is3d ? 4 : 3;
    const poses = calculatePoses(matrix, width, height, n);
    let [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
    ] = poses;
    let [originX, originY] = calculatePosition(matrix, origin, n);

    const left = Math.min(x1, x2, x3, x4);
    const top = Math.min(y1, y2, y3, y4);
    const right = Math.max(x1, x2, x3, x4);
    const bottom = Math.max(y1, y2, y3, y4);

    x1 = (x1 - left) || 0;
    x2 = (x2 - left) || 0;
    x3 = (x3 - left) || 0;
    x4 = (x4 - left) || 0;

    y1 = (y1 - top) || 0;
    y2 = (y2 - top) || 0;
    y3 = (y3 - top) || 0;
    y4 = (y4 - top) || 0;

    originX = (originX - left) || 0;
    originY = (originY - top) || 0;


    const sx = matrix[0];
    const sy = matrix[n + 1];
    const direction = sign(sx * sy);

    return {
        left,
        top,
        right,
        bottom,
        origin: [originX, originY],
        pos1: [x1, y1],
        pos2: [x2, y2],
        pos3: [x3, y3],
        pos4: [x4, y4],
        direction,
    };
}
