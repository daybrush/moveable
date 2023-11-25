import {
    SnapInfo, SnappableProps, SnappableState,
    SnapGuideline, ResizableProps, ScalableProps,
    SnapOffsetInfo, MoveableManagerInterface, SnapDirectionPoses, SnapDirectionInfo,
} from "../../types";
import {
    selectValue, getTinyDist, abs,
} from "../../utils";
import { getPosByDirection, getPosesByDirection } from "../../gesto/GestoUtils";
import { TINY_NUM } from "../../consts";
import { minus } from "@scena/matrix";
import { splitSnapDirectionPoses } from "./utils";



export function checkMoveableSnapPoses(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    posesX: number[],
    posesY: number[],
    dirXs: string[] = [],
    dirYs: string[] = [],
    customSnapVerticalThreshold: number | undefined,
    customSnapHorizontalThreshold: number | undefined,
) {
    const props = moveable.props;
    const snapThresholdMultiples = moveable.state.snapThresholdInfo?.multiples || [1, 1];
    const snapHorizontalThreshold = selectValue<number>(
        customSnapHorizontalThreshold,
        props.snapHorizontalThreshold,
        5,
    );
    const snapVerticalThreshold = selectValue<number>(
        customSnapVerticalThreshold,
        props.snapVerticalThreshold,
        5,
    );

    return checkSnapPoses(
        moveable.state.guidelines,
        posesX,
        posesY,
        dirXs,
        dirYs,
        snapHorizontalThreshold,
        snapVerticalThreshold,
        snapThresholdMultiples,
    );
}

export function checkSnapPoses(
    guidelines: SnapGuideline[],
    posesX: number[],
    posesY: number[],
    dirXs: string[],
    dirYs: string[],
    snapHorizontalThreshold: number,
    snapVerticalThreshold: number,
    multiples: number[],
) {
    return {
        vertical: checkSnap(guidelines, "vertical", posesX, snapVerticalThreshold * multiples[0], dirXs),
        horizontal: checkSnap(guidelines, "horizontal", posesY, snapHorizontalThreshold * multiples[1], dirYs),
    };
}
export function checkSnapKeepRatio(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    startPos: number[],
    endPos: number[],
): { vertical: SnapOffsetInfo, horizontal: SnapOffsetInfo } {
    const [endX, endY] = endPos;
    const [startX, startY] = startPos;
    let [dx, dy] = minus(endPos, startPos);
    const isBottom = dy > 0;
    const isRight = dx > 0;

    dx = getTinyDist(dx);
    dy = getTinyDist(dy);

    const verticalInfo: SnapOffsetInfo = {
        isSnap: false,
        offset: 0,
        pos: 0,
    };
    const horizontalInfo: SnapOffsetInfo = {
        isSnap: false,
        offset: 0,
        pos: 0,
    };

    if (dx === 0 && dy === 0) {
        return {
            vertical: verticalInfo,
            horizontal: horizontalInfo,
        };
    }
    const {
        vertical: verticalSnapInfo,
        horizontal: horizontalSnapInfo,
    } = checkMoveableSnapPoses(
        moveable,
        dx ? [endX] : [],
        dy ? [endY] : [],
        [],
        [],
        undefined,
        undefined,
    );

    verticalSnapInfo.posInfos.filter(({ pos }) => {
        return isRight ? pos >= startX : pos <= startX;
    });
    horizontalSnapInfo.posInfos.filter(({ pos }) => {
        return isBottom ? pos >= startY : pos <= startY;
    });
    verticalSnapInfo.isSnap = verticalSnapInfo.posInfos.length > 0;
    horizontalSnapInfo.isSnap = horizontalSnapInfo.posInfos.length > 0;

    const {
        isSnap: isVerticalSnap,
        guideline: verticalGuideline,
    } = getNearestSnapGuidelineInfo(verticalSnapInfo);
    const {
        isSnap: isHorizontalSnap,
        guideline: horizontalGuideline,
    } = getNearestSnapGuidelineInfo(horizontalSnapInfo);
    const horizontalPos = isHorizontalSnap ? horizontalGuideline!.pos[1] : 0;
    const verticalPos = isVerticalSnap ? verticalGuideline!.pos[0] : 0;

    if (dx === 0) {
        if (isHorizontalSnap) {
            horizontalInfo.isSnap = true;
            horizontalInfo.pos = horizontalGuideline!.pos[1];
            horizontalInfo.offset = endY - horizontalInfo.pos;
        }
    } else if (dy === 0) {
        if (isVerticalSnap) {
            verticalInfo.isSnap = true;
            verticalInfo.pos = verticalPos;
            verticalInfo.offset = endX - verticalPos;
        }
    } else {
        // y - y1 = a * (x - x1)
        const a = dy / dx;
        const b = endPos[1] - a * endX;
        let y = 0;
        let x = 0;
        let isSnap = false;

        if (isVerticalSnap) {
            x = verticalPos;
            y = a * x + b;
            isSnap = true;
        } else if (isHorizontalSnap) {
            y = horizontalPos;
            x = (y - b) / a;
            isSnap = true;
        }
        if (isSnap) {
            verticalInfo.isSnap = true;
            verticalInfo.pos = x;
            verticalInfo.offset = endX - x;

            horizontalInfo.isSnap = true;
            horizontalInfo.pos = y;
            horizontalInfo.offset = endY - y;
        }
    }
    return {
        vertical: verticalInfo,
        horizontal: horizontalInfo,
    };
}


function getStringDirection(dir: number | string) {
    let stringDirection = "";

    if (dir === -1 || dir === "top" || dir === "left") {
        stringDirection = "start";
    } else if (dir === 0 || dir === "center" || dir === "middle") {
        stringDirection = "center";
    } else if (dir === 1 || dir === "right" || dir === "bottom") {
        stringDirection = "end";
    }
    return stringDirection;
}


export function checkSnaps(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    rect: SnapDirectionPoses,
    customSnapVerticalThreshold: number | undefined,
    customSnapHorizontalThreshold: number | undefined,
): { vertical: SnapDirectionInfo; horizontal: SnapDirectionInfo } {
    const poses = splitSnapDirectionPoses(moveable.props.snapDirections, rect);

    const result = checkMoveableSnapPoses(
        moveable,
        poses.vertical,
        poses.horizontal,
        poses.verticalNames.map(name => getStringDirection(name)),
        poses.horizontalNames.map(name => getStringDirection(name)),
        customSnapVerticalThreshold,
        customSnapHorizontalThreshold,
    );
    const horizontalDirection = getStringDirection(poses.horizontalNames[result.horizontal.index]);
    const verticalDirection = getStringDirection(poses.verticalNames[result.vertical.index]);

    return {
        vertical: {
            ...result.vertical,
            direction: verticalDirection,
        },
        horizontal: {
            ...result.horizontal,
            direction: horizontalDirection,
        },
    };
}

export function getNearestSnapGuidelineInfo(
    snapInfo: SnapInfo,
) {
    const isSnap = snapInfo.isSnap;

    if (!isSnap) {
        return {
            isSnap: false,
            offset: 0,
            dist: -1,
            pos: 0,
            guideline: null,
        };
    }
    const posInfo = snapInfo.posInfos[0];
    const guidelineInfo = posInfo!.guidelineInfos[0];
    const offset = guidelineInfo!.offset;
    const dist = guidelineInfo!.dist;
    const guideline = guidelineInfo!.guideline;

    return {
        isSnap,
        offset,
        dist,
        pos: posInfo!.pos,
        guideline,
    };
}

function checkSnap(
    guidelines: SnapGuideline[],
    targetType: "horizontal" | "vertical",
    targetPoses: number[],
    snapThreshold: number,
    dirs: string[] = [],
): SnapInfo {
    if (!guidelines || !guidelines.length) {
        return {
            isSnap: false,
            index: -1,
            direction: "",
            posInfos: [],
        };
    }
    const isVertical = targetType === "vertical";
    const posType = isVertical ? 0 : 1;

    const snapPosInfos = targetPoses.map((targetPos, index) => {
        const direction = dirs[index] || "";

        const guidelineInfos = guidelines.map(guideline => {
            const { pos } = guideline;
            const offset = targetPos - pos[posType];

            return {
                offset,
                dist: abs(offset),
                guideline,
                direction,
            };
        }).filter(({ guideline, dist }) => {
            const { type } = guideline;
            if (
                type !== targetType
                || dist > snapThreshold
            ) {
                return false;
            }
            return true;
        }).sort(
            (a, b) => a.dist - b.dist,
        );


        return {
            pos: targetPos,
            index,
            guidelineInfos,
            direction,
        };
    }).filter(snapPosInfo => {
        return snapPosInfo.guidelineInfos.length > 0;
    }).sort((a, b) => {
        return a.guidelineInfos[0].dist - b.guidelineInfos[0].dist;
    });

    const isSnap = snapPosInfos.length > 0;
    return {
        isSnap,
        index: isSnap ? snapPosInfos[0].index : -1,
        direction: snapPosInfos[0]?.direction ?? "",
        posInfos: snapPosInfos,
    };
}

export function getSnapInfosByDirection(
    moveable: MoveableManagerInterface<SnappableProps & (ResizableProps | ScalableProps), SnappableState>,
    // pos1 pos2 pos3 pos4
    poses: number[][],
    snapDirection: number[],
    customSnapVerticalThreshold: number | undefined,
    customSnapHorizontalThreshold: number | undefined,
): { vertical: SnapDirectionInfo; horizontal: SnapDirectionInfo } {
    let dirs: number[][] = [];

    if (snapDirection[0] && snapDirection[1]) {
        dirs = [
            snapDirection,
            [-snapDirection[0], snapDirection[1]],
            [snapDirection[0], -snapDirection[1]],
        ];
    } else if (!snapDirection[0] && !snapDirection[1]) {
        [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
        ].forEach((dir, i, arr) => {
            const nextDir = (arr[i + 1] || arr[0]);
            dirs.push(dir);
            dirs.push([
                (dir[0] + nextDir[0]) / 2,
                (dir[1] + nextDir[1]) / 2,
            ]);
        });
    } else {
        if (moveable.props.keepRatio) {
            dirs.push(
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1],
                snapDirection,
            );
        } else {
            dirs.push(...getPosesByDirection([
                [-1, -1],
                [1, -1],
                [-1, -1],
                [1, 1],
            ], snapDirection));

            if (dirs.length > 1) {
                dirs.push([
                    (dirs[0][0] + dirs[1][0]) / 2,
                    (dirs[0][1] + dirs[1][1]) / 2,
                ]);
            }
        }
    }
    const nextPoses = dirs.map(dir => getPosByDirection(poses, dir));
    const xs = nextPoses.map(pos => pos[0]);
    const ys = nextPoses.map(pos => pos[1]);
    const result = checkMoveableSnapPoses(
        moveable,
        xs, ys,
        dirs.map(dir => getStringDirection(dir[0])),
        dirs.map(dir => getStringDirection(dir[1])),
        customSnapVerticalThreshold,
        customSnapHorizontalThreshold,
    );
    const verticalDirection = getStringDirection(dirs.map(dir => dir[0])[result.vertical.index]);
    const horizontalDirection = getStringDirection(dirs.map(dir => dir[1])[result.horizontal.index]);

    return {
        vertical: {
            ...result.vertical,
            direction: verticalDirection,
        },
        horizontal: {
            ...result.horizontal,
            direction: horizontalDirection,
        },
    };
}

export function checkSnapBoundPriority(
    a: { isBound: boolean, isSnap: boolean, offset: number },
    b: { isBound: boolean, isSnap: boolean, offset: number },
) {
    const aDist = abs(a.offset);
    const bDist = abs(b.offset);

    if (a.isBound && b.isBound) {
        return bDist - aDist;
    } else if (a.isBound) {
        return -1;
    } else if (b.isBound) {
        return 1;
    } else if (a.isSnap && b.isSnap) {
        return bDist - aDist;
    } else if (a.isSnap) {
        return -1;
    } else if (b.isSnap) {
        return 1;
    } else if (aDist < TINY_NUM) {
        return 1;
    } else if (bDist < TINY_NUM) {
        return -1;
    }
    return aDist - bDist;
}
export function getNearOffsetInfo<T extends { offset: number[], isBound: boolean, isSnap: boolean, sign: number[] }>(
    offsets: T[],
    index: number,
) {
    return offsets.slice().sort((a, b) => {
        const aSign = a.sign[index];
        const bSign = b.sign[index];
        const aOffset = a.offset[index];
        const bOffset = b.offset[index];
        // -1 The positions of a and b do not change.
        // 1 The positions of a and b are reversed.
        if (!aSign) {
            return 1;
        } else if (!bSign) {
            return -1;
        }
        return checkSnapBoundPriority(
            { isBound: a.isBound, isSnap: a.isSnap, offset: aOffset },
            { isBound: b.isBound, isSnap: b.isSnap, offset: bOffset },
        );
    })[0];
}


export function getCheckSnapDirections(
    direction: number[],
    fixedDirection: number[],
    keepRatio: boolean
) {
    const directions: number[][][] = [];
    // const fixedDirection = [-direction[0], -direction[1]];

    if (keepRatio) {
        if (abs(fixedDirection[0]) !== 1 || abs(fixedDirection[1]) !== 1) {
            directions.push(
                [fixedDirection, [-1, -1]],
                [fixedDirection, [-1, 1]],
                [fixedDirection, [1, -1]],
                [fixedDirection, [1, 1]],
            );
        } else {
            directions.push(
                [fixedDirection, [direction[0], -direction[1]]],
                [fixedDirection, [-direction[0], direction[1]]],
            );
        }
        directions.push([fixedDirection, direction]);
    } else {
        if ((direction[0] && direction[1]) || (!direction[0] && !direction[1])) {
            const endDirection = direction[0] ? direction : [1, 1];

            [1, -1].forEach(signX => {
                [1, -1].forEach(signY => {
                    const nextDirection = [signX * endDirection[0], signY * endDirection[1]];

                    if (
                        fixedDirection[0] === nextDirection[0]
                        && fixedDirection[1] === nextDirection[1]
                    ) {
                        return;
                    }
                    directions.push([fixedDirection, nextDirection]);
                });
            });
        } else if (direction[0]) {
            const signs = abs(fixedDirection[0]) === 1 ? [1] : [1, -1];

            signs.forEach(sign => {
                directions.push(
                    [
                        [fixedDirection[0], -1],
                        [sign * direction[0], -1],
                    ],
                    [
                        [fixedDirection[0], 0],
                        [sign * direction[0], 0],
                    ],
                    [
                        [fixedDirection[0], 1],
                        [sign * direction[0], 1],
                    ]
                );
            });
        } else if (direction[1]) {
            const signs = abs(fixedDirection[1]) === 1 ? [1] : [1, -1];

            signs.forEach(sign => {
                directions.push(
                    [
                        [-1, fixedDirection[1]],
                        [-1, sign * direction[1]],
                    ],
                    [
                        [0, fixedDirection[1]],
                        [0, sign * direction[1]],
                    ],
                    [
                        [1, fixedDirection[1]],
                        [1, sign * direction[1]],
                    ]
                );
            });
        }
    }
    return directions;
}
