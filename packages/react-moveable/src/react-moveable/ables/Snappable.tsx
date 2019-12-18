import MoveableManager from "../MoveableManager";
import {
    Renderer,
    SnappableProps,
    SnappableState, Guideline,
    SnapInfo, BoundInfo,
    ScalableProps, ResizableProps,
} from "../types";
import {
    prefix, caculatePoses, getRect,
    getAbsolutePosesByState, getAbsolutePoses, selectValue, throttle
} from "../utils";
import { directionCondition } from "../groupUtils";
import { isUndefined, IObject } from "@daybrush/utils";
import {
    getPosByReverseDirection, getPosesByDirection,
    getDragDist, scaleMatrix, getPosByDirection,
} from "../DraggerUtils";
import { minus } from "@moveable/matrix";
import { TINY_NUM } from "../consts";

function snapStart(moveable: MoveableManager<SnappableProps, SnappableState>) {
    const state = moveable.state;
    if (state.guidelines && state.guidelines.length) {
        return;
    }

    const {
        horizontalGuidelines = [],
        verticalGuidelines = [],
        elementGuidelines = [],
        bounds,
        snapCenter,
    } = moveable.props;

    if (!bounds && !horizontalGuidelines.length && !verticalGuidelines.length && !elementGuidelines.length) {
        return;
    }

    const {
        containerRect: {
            top: containerTop,
            left: containerLeft,
        },
        clientRect: {
            top: clientTop,
            left: clientLeft,
        },
    } = state;
    const poses = getAbsolutePosesByState(state);
    const targetLeft = Math.min(...poses.map(pos => pos[0]));
    const targetTop = Math.min(...poses.map(pos => pos[1]));
    const distLeft = targetLeft - (clientLeft - containerLeft);
    const distTop = targetTop - (clientTop - containerTop);
    const guidelines: Guideline[] = [];

    elementGuidelines!.forEach(el => {
        const rect = el.getBoundingClientRect();
        const { top, left, width, height } = rect;
        const elementTop = top - containerTop;
        const elementBottom = elementTop + height;
        const elementLeft = left - containerLeft;
        const elementRight = elementLeft + width;

        guidelines.push({ type: "vertical", element: el, pos: [
            throttle(elementLeft + distLeft, 0.1),
            elementTop,
        ], size: height });
        guidelines.push({ type: "vertical", element: el, pos: [
            throttle(elementRight + distLeft, 0.1),
            elementTop,
        ], size: height });
        guidelines.push({ type: "horizontal", element: el, pos: [
            elementLeft,
            throttle(elementTop + distTop, 0.1),
        ], size: width });
        guidelines.push({ type: "horizontal", element: el, pos: [
            elementLeft,
            throttle(elementBottom + distTop, 0.1),
        ], size: width });

        if (snapCenter) {
            guidelines.push({
                type: "vertical",
                element: el,
                pos: [
                    throttle((elementLeft + elementRight) / 2 + distLeft, 0.1),
                    elementTop,
                ],
                size: height,
                center: true,
            });
            guidelines.push({
                type: "horizontal",
                element: el,
                pos: [
                    elementLeft,
                    throttle((elementTop + elementBottom) / 2 + distTop, 0.1),
                ],
                size: width,
                center: true,
            });
        }
    });

    state.guidelines = guidelines;
    state.enableSnap = true;
}
function checkBounds(
    moveable: MoveableManager<SnappableProps>,
    verticalPoses: number[],
    horizontalPoses: number[],
    snapThreshold?: number,
) {
    return {
        vertical: checkBound(moveable, verticalPoses, true, snapThreshold),
        horizontal: checkBound(moveable, horizontalPoses, false, snapThreshold),
    };
}
function checkBound(
    moveable: MoveableManager<SnappableProps>,
    poses: number[],
    isVertical: boolean,
    snapThreshold: number = 0,
): BoundInfo {
    const bounds = moveable.props.bounds;

    if (bounds) {
        const startPos = bounds[isVertical ? "left" : "top"];
        const endPos = bounds[isVertical ? "right" : "bottom"];

        const minPos = Math.min(...poses);
        const maxPos = Math.max(...poses);

        if (!isUndefined(startPos) && startPos + snapThreshold > minPos) {
            return {
                isBound: true,
                offset: minPos - startPos,
                pos: startPos,
            };
        }
        if (!isUndefined(endPos) && endPos - snapThreshold < maxPos) {
            return {
                isBound: true,
                offset: maxPos - endPos,
                pos: endPos,
            };
        }
    }

    return {
        isBound: false,
        offset: 0,
        pos: 0,
    };
}
function checkSnap(
    guidelines: Guideline[],
    targetType: "horizontal" | "vertical",
    targetPoses: number[],
    snapThreshold: number,
    snapCenter: boolean,
    snapElement: boolean,
): SnapInfo {
    if (!guidelines || !guidelines.length) {
        return {
            isSnap: false,
            dist: -1,
            offset: 0,
            guidelines: [],
            snapPoses: [],
        };
    }
    let snapGuidelines: Guideline[] = [];
    let snapDist = Infinity;
    let snapOffset = 0;
    const isVertical = targetType === "vertical";
    const posType = isVertical ? 0 : 1;

    const snapPoses = targetPoses.filter(targetPos => {
        let count = 0;
        guidelines.forEach(guideline => {
            const { type, pos, center, element } = guideline;

            if (
                (!snapElement && element)
                || (!snapCenter && center)
                || type !== targetType
            ) {
                return;
            }
            const offset = targetPos - pos[posType];
            const dist = Math.abs(offset);

            if (dist > snapThreshold) {
                return;
            }
            if (snapDist > dist) {
                snapDist = dist;
                snapGuidelines = [];
                count = 0;
            }
            if (snapDist === dist) {
                snapOffset = offset;
                snapGuidelines.push(guideline);
                ++count;
            }
        });

        return count;
    });

    return {
        isSnap: !!snapGuidelines.length,
        dist: isFinite(snapDist) ? snapDist : -1,
        offset: snapOffset,
        guidelines: snapGuidelines,
        snapPoses,
    };
}
export function hasGuidelines(
    moveable: MoveableManager<any, any>,
    ableName: string,
): moveable is MoveableManager<SnappableProps, SnappableState> {
    const {
        props: {
            snappable,
            bounds,
            verticalGuidelines,
            horizontalGuidelines,
        },
        state: {
            guidelines,
            enableSnap,
        },
    } = moveable;

    if (
        !snappable
        || !enableSnap
        || (ableName && snappable !== true && snappable.indexOf(ableName))
    ) {
        return false;
    }
    if (
        bounds
        || (guidelines && guidelines.length)
        || (verticalGuidelines && verticalGuidelines.length)
        || (horizontalGuidelines && horizontalGuidelines.length)
     ) {
        return true;
    }
    return false;
}
export function checkSnapPoses(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    posesX: number[],
    posesY: number[],
    snapCenter?: boolean,
    customSnapThreshold?: number,
) {
    const {
        guidelines,
        containerRect: {
            height: containerHeight,
            width: containerWidth,
        },
     } = moveable.state;
    const props = moveable.props;
    const snapThreshold = selectValue<number>(customSnapThreshold, props.snapThreshold, 5);
    const {
        snapElement = true,
        snapHorizontal = true,
        snapVertical = true,
        verticalGuidelines,
        horizontalGuidelines,
    } = props;

    const totalGuidelines = [...guidelines];

    if (snapHorizontal && horizontalGuidelines) {
        horizontalGuidelines!.forEach(pos => {
            totalGuidelines.push({ type: "horizontal", pos: [0, throttle(pos, 0.1)], size: containerWidth });
        });
    }
    if (snapVertical && verticalGuidelines) {
        verticalGuidelines!.forEach(pos => {
            totalGuidelines.push({ type: "vertical", pos: [throttle(pos, 0.1), 0], size: containerHeight });
        });
    }
    return {
        vertical: checkSnap(
            totalGuidelines,
            "vertical", posesX, snapThreshold,
            snapCenter!,
            snapElement,
        ),
        horizontal: checkSnap(
            totalGuidelines,
            "horizontal", posesY, snapThreshold,
            snapCenter!,
            snapElement,
        ),
    };
}
export function checkSnaps(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    rect: {
        left?: number,
        top?: number,
        bottom?: number,
        right?: number,
        center?: number,
        middle?: number,
    },
    isCenter: boolean,
    customSnapThreshold?: number,
) {
    const snapCenter = moveable.props.snapCenter;
    const isSnapCenter = snapCenter! && isCenter;

    let verticalNames: Array<"left" | "center" | "right"> = ["left", "right"];
    let horizontalNames: Array<"top" | "middle" | "bottom"> = ["top", "bottom"];

    if (isSnapCenter) {
        verticalNames.push("center");
        horizontalNames.push("middle");
    }
    verticalNames = verticalNames.filter(name => name in rect);
    horizontalNames = horizontalNames.filter(name => name in rect);

    return checkSnapPoses(
        moveable,
        verticalNames.map(name => rect[name]!),
        horizontalNames.map(name => rect[name]!),
        isSnapCenter,
        customSnapThreshold,
    );
}
export function getSize(x: number, y: number) {
    return Math.sqrt(x * x + y * y);
}
function checkBoundOneWayDist(
    moveable: MoveableManager<any, any>,
    pos: number[],
) {
    const {
        horizontal: {
            isBound: isHorizontalBound,
            offset: horizontalBoundOffset,
        },
        vertical: {
            isBound: isVerticalBound,
            offset: verticalBoundOffset,
        },
    } = checkBounds(
        moveable,
        [pos[0]],
        [pos[1]],
    );
    if (isHorizontalBound || isVerticalBound) {
        let isVertical!: boolean;

        if (isHorizontalBound && isVerticalBound) {
            isVertical = Math.abs(horizontalBoundOffset) < Math.abs(verticalBoundOffset);
        } else {
            isVertical = isVerticalBound;
        }
        const offset = isVertical ? verticalBoundOffset : horizontalBoundOffset;
        return {
            isVertical,
            offset,
            dist: Math.abs(offset),
        };
    }
    return;
}
function solveNextDist(
    pos1: number[],
    pos2: number[],
    offset: number,
    isVertical: boolean,
    isDirectionVertical: boolean,
    datas: IObject<any>,
) {
    const sizeOffset = solveEquation(
        pos1,
        pos2,
        -offset,
        isVertical,
    );

    if (!sizeOffset) {
        return NaN;
    }
    const [widthDist, heightDist] = getDragDist({
        datas,
        distX: sizeOffset[0],
        distY: sizeOffset[1],
    });

    return isDirectionVertical ? heightDist : widthDist;
}
function getFixedPoses(
    matrix: number[],
    width: number,
    height: number,
    fixedPos: number[],
    direction: number[],
    is3d: boolean,
) {
    const nextPoses = caculatePoses(matrix, width, height, is3d ? 4 : 3);
    const nextPos = getPosByReverseDirection(nextPoses, direction);

    return  getAbsolutePoses(nextPoses, minus(fixedPos, nextPos));
}

function checkSnapOneWayPos(
    moveable: MoveableManager<any, any>,
    pos: number[],
    reversePos: number[],
    isDirectionVertical: boolean,
    datas: any,
) {
    const {
        horizontal: {
            isSnap: isHorizontalSnap,
            offset: horizontalOffset,
            dist: horizontalDist,
        },
        vertical: {
            isSnap: isVerticalSnap,
            offset: verticalOffset,
            dist: verticalDist,
        },
    } = checkSnapPoses(
        moveable,
        [pos[0]],
        [pos[1]],
    );
    const fixedHorizontal = Math.abs(reversePos[1] - pos[1]) < TINY_NUM;
    const fixedVertical = Math.abs(reversePos[0] - pos[0]) < TINY_NUM;

    let isVertical!: boolean;

    if (!isHorizontalSnap && !isVerticalSnap) {
        // no snap
        return NaN;
    } else if (isHorizontalSnap && isVerticalSnap) {
        if (horizontalDist === 0 && fixedHorizontal) {
            isVertical = true;
        } else if (verticalOffset === 0 && fixedVertical) {
            isVertical = false;
        } else {
            isVertical = horizontalDist > verticalDist;
        }
    } else {
        isVertical = isVerticalSnap;
    }
    return solveNextDist(
        reversePos, pos,
        (isVertical ? verticalOffset : horizontalOffset),
        isVertical,
        isDirectionVertical,
        datas,
    );
}
export function checkOneWayPos(
    moveable: MoveableManager<any, any>,
    poses: number[][],
    reversePoses: number[][],
    isDirectionVertical: boolean,
    datas: any,
) {
    let posOffset = 0;
    let boundInfo!: {
        isVertical: boolean,
        offset: number,
        dist: number,
    } | undefined;
    let boundIndex = -1;
    const boundInfos = poses.map(pos => checkBoundOneWayDist(moveable, pos));

    boundInfos.forEach((info, i) => {
        if (!info) {
            return;
        }
        if (!boundInfo || boundInfo.dist < info.dist) {
            boundInfo = info;
            boundIndex = i;
        }
    });

    if (boundInfo) {
        const nextDist = solveNextDist(
            reversePoses[boundIndex],
            poses[boundIndex],
            boundInfo.offset,
            boundInfo.isVertical,
            isDirectionVertical,
            datas,
        );

        if (!isNaN(nextDist)) {
            posOffset = nextDist;
        }
    } else  {
        poses.some((pos, i) => {
            const nextDist = checkSnapOneWayPos(moveable, pos, reversePoses[i], isDirectionVertical, datas);

            if (isNaN(nextDist)) {
                return false;
            }
            posOffset = nextDist;
            return true;
        });
    }
    return posOffset;
}
export function checkOneWayDist(
    moveable: MoveableManager<any, any>,
    poses: number[][],
    direction: number[],
    datas: any,
) {

    const directionIndex = direction[0] !== 0 ? 0 : 1;
    const isDirectionVertical = directionIndex > 0;
    const reversePoses = poses.slice().reverse();
    let directionPoses!: number[][];
    let reverseDirectionPoses!: number[][];

    if (moveable.props.keepRatio) {
        directionPoses = [getPosByDirection(poses, direction)];
        reverseDirectionPoses = [getPosByDirection(reversePoses, direction)];
    } else {
        directionPoses = getPosesByDirection(poses, direction);
        reverseDirectionPoses = getPosesByDirection(reversePoses, direction);

        directionPoses.push([
            (directionPoses[0][0] + directionPoses[1][0]) / 2,
            (directionPoses[0][1] + directionPoses[1][1]) / 2,
        ]);
        reverseDirectionPoses.reverse();
        reverseDirectionPoses.push([
            (reverseDirectionPoses[0][0] + reverseDirectionPoses[1][0]) / 2,
            (reverseDirectionPoses[0][1] + reverseDirectionPoses[1][1]) / 2,
        ]);
    }

    const posOffset = checkOneWayPos(moveable, directionPoses, reverseDirectionPoses, isDirectionVertical, datas);

    const offset = [0, 0];

    offset[directionIndex] = direction[directionIndex] * posOffset;
    return offset;
}
export function checkTwoWayDist(
    moveable: MoveableManager<any, any>,
    poses: number[][],
    direction: number[],
    datas: any,
    matrix: number[],
    width: number,
    height: number,
    fixedPos: number[],
    is3d: boolean,
) {
    const directionPoses = getPosesByDirection(poses, direction);
    const verticalDirection = [direction[0], direction[1] * -1];
    const horizontalDirection = [direction[0] * -1, direction[1]];
    const verticalPos = getPosByDirection(poses, verticalDirection);
    const horizontalPos = getPosByDirection(poses, horizontalDirection);
    const {
        horizontal: {
            isBound: isHorizontalBound,
            offset: horizontalBoundOffset,
        },
        vertical: {
            isBound: isVerticalBound,
            offset: verticalBoundOffset,
        },
    } = checkBounds(
        moveable,
        [directionPoses[0][0]],
        [directionPoses[0][1]],
    );

    // share drag event
    let widthDist = 0;
    let heightDist = 0;

    const verticalBoundInfo = checkBoundOneWayDist(moveable, verticalPos);
    const horizontalBoundInfo = checkBoundOneWayDist(moveable, horizontalPos);
    const isVeritcalDirectionBound = verticalBoundInfo && verticalBoundInfo.dist > Math.abs(verticalBoundOffset);
    const isHorizontalDirectionBound
        = horizontalBoundInfo && horizontalBoundInfo.dist > Math.abs(horizontalBoundOffset);

    if (!isVeritcalDirectionBound && !isHorizontalDirectionBound) {
        const {
            horizontal: {
                offset: horizontalOffset,
            },
            vertical: {
                offset: verticalOffset,
            },
        } = checkSnapPoses(
            moveable,
            [directionPoses[0][0]],
            [directionPoses[0][1]],
        );
        [widthDist, heightDist] = getDragDist({
            datas,
            distX: -(isVerticalBound ? verticalBoundOffset : verticalOffset),
            distY: -(isHorizontalBound ? horizontalBoundOffset : horizontalOffset),
        });
    } else if (isVeritcalDirectionBound) {
        // left to right, right to left
        const reversePos = getPosByDirection(poses, [
            verticalDirection[0] * -1,
            verticalDirection[1],
        ]);
        const nextDist = solveNextDist(
            reversePos, verticalPos,
            verticalBoundInfo!.offset, verticalBoundInfo!.isVertical,
            false, datas,
        );
        if (!isNaN(nextDist)) {
            widthDist = nextDist;
        }
        const nextPoses = getFixedPoses(
            matrix,
            width + direction[0] * widthDist,
            height + direction[1] * heightDist,
            fixedPos,
            direction,
            is3d,
        );
        heightDist = checkOneWayPos(
            moveable,
            [getPosByDirection(nextPoses, direction)],
            [getPosByDirection(nextPoses, verticalDirection)] ,
            true,
            datas,
        );
    } else {
        // top to bottom, bottom to top
        const reversePos = getPosByDirection(poses, [
            horizontalDirection[0] * -1,
            horizontalDirection[1],
        ]);
        const nextDist = solveNextDist(
            reversePos, verticalPos,
            horizontalBoundInfo!.offset, horizontalBoundInfo!.isVertical,
            true, datas,
        );
        if (!isNaN(nextDist)) {
            heightDist = nextDist;
        }
        const nextPoses = getFixedPoses(
            matrix,
            width + direction[0] * widthDist,
            height + direction[1] * heightDist,
            fixedPos,
            direction,
            is3d,
        );
        widthDist = checkOneWayPos(
            moveable,
            [getPosByDirection(nextPoses, direction)],
            [getPosByDirection(nextPoses, horizontalDirection)] ,
            false,
            datas,
        );
    }

    return [
        direction[0] * widthDist,
        direction[1] * heightDist,
    ];
}
export function checkSizeDist(
    moveable: MoveableManager<any, any>,
    matrix: number[],
    width: number,
    height: number,
    direction: number[],
    snapDirection: number[],
    datas: any,
    is3d: boolean,
) {
    const poses = getAbsolutePosesByState(moveable.state);
    const fixedPos = getPosByReverseDirection(poses, snapDirection);
    const nextPoses = getFixedPoses(matrix, width, height, fixedPos, direction, is3d);

    if (direction[0] && direction[1]) {
        return checkTwoWayDist(
            moveable, nextPoses, direction, datas,
            matrix, width, height, fixedPos, is3d,
        );
    } else {
        return checkOneWayDist(moveable, nextPoses, direction, datas);
    }

}
export function checkSnapSize(
    moveable: MoveableManager<any, any>,
    width: number,
    height: number,
    direction: number[],
    datas: any,
) {
    if (!hasGuidelines(moveable, "resizable")) {
        return [0, 0];
    }
    const {
        matrix,
        is3d,
    } = moveable.state;
    return checkSizeDist(moveable, matrix, width, height, direction, direction, datas, is3d);
}
export function checkSnapScale(
    moveable: MoveableManager<ScalableProps, any>,
    scale: number[],
    direction: number[],
    snapDirection: number[],
    datas: any,
) {
    const {
        width,
        height,
    } = datas;

    if (!hasGuidelines(moveable, "scalable")) {
        return [0, 0];
    }
    const sizeDist = checkSizeDist(
        moveable, scaleMatrix(datas, scale),
        width, height,
        direction,
        snapDirection,
        datas, datas.is3d,
    );

    return [
        sizeDist[0] / width,
        sizeDist[1] / height,
    ];
}
export function solveEquation(
    pos1: number[],
    pos2: number[],
    snapOffset: number,
    isVertical: boolean,
) {
    let dx = pos2[0] - pos1[0];
    let dy = pos2[1] - pos1[1];

    if (Math.abs(dx) < TINY_NUM) {
        dx = 0;
    }
    if (Math.abs(dy) < TINY_NUM) {
        dy = 0;
    }
    if (!dx) {
        // y = 0 * x + b
        // only horizontal
        if (!isVertical) {
            return [0, snapOffset];
        }
        return;
    }
    if (!dy) {
        // only vertical
        if (isVertical) {
            return [snapOffset, 0];
        }
        return;
    }
    // y = ax + b
    const a = dy / dx;
    const b = pos1[1] - a * pos1[0];

    if (isVertical) {
        // y = a * x + b
        const y = a * (pos2[0] + snapOffset) + b;

        return [snapOffset, y - pos2[1]];
    } else {
        // x = (y - b) / a
        const x = (pos2[1] + snapOffset - b) / a;

        return [x - pos2[0], snapOffset];
    }
}

export function getSnapInfosByDirection(
    moveable: MoveableManager<SnappableProps & (ResizableProps | ScalableProps), SnappableState>,
    poses: number[][],
    snapDirection: number[] | true,
) {
    if (snapDirection === true) {
        const rect = getRect(poses);

        (rect as any).middle = (rect.top + rect.bottom) / 2;
        (rect as any).center = (rect.left + rect.right) / 2;

        const snaps =  checkSnaps(moveable, rect, true, 1);

        console.log(snaps);
        return snaps;
    } else if (!snapDirection[0] && !snapDirection[1]) {
        const alignPoses = [poses[0], poses[1], poses[3], poses[2], poses[0]];
        const nextPoses = [];

        for (let i = 0; i < 4; ++i) {
            nextPoses.push(alignPoses[i]);
            poses.push([
                (alignPoses[i][0] + alignPoses[i + 1][0]) / 2,
                (alignPoses[i][1] + alignPoses[i + 1][1]) / 2,
            ]);
        }
        return checkSnapPoses(moveable, nextPoses.map(pos => pos[0]), nextPoses.map(pos => pos[1]), true, 1);
    } else {
        let nextPoses!: number[][];

        if (moveable.props.keepRatio) {
            nextPoses = [getPosByDirection(poses, snapDirection)];
        } else {
            nextPoses = getPosesByDirection(poses, snapDirection);

            if (nextPoses.length > 1) {
                nextPoses.push([
                    (nextPoses[0][0] + nextPoses[1][0]) / 2,
                    (nextPoses[0][1] + nextPoses[1][1]) / 2,
                ]);
            }
        }
        return checkSnapPoses(moveable, nextPoses.map(pos => pos[0]), nextPoses.map(pos => pos[1]), true, 1);
    }
}
export function startCheckSnapDrag(
    moveable: MoveableManager<any, any>,
    datas: any,
) {
    datas.absolutePoses = getAbsolutePosesByState(moveable.state);
}
export function checkSnapDrag(
    moveable: MoveableManager<any, any>,
    distX: number,
    distY: number,
    datas: any,
) {
    const snapVerticalInfo = {
        isSnap: false,
        offset: 0,
    };
    const snapHorizontalInfo = {
        isSnap: false,
        offset: 0,
    };

    if (!hasGuidelines(moveable, "draggable")) {
        return [snapVerticalInfo, snapHorizontalInfo];
    }
    const poses = getAbsolutePoses(
        datas.absolutePoses,
        [distX, distY],
    );
    const { left, right, top, bottom } = getRect(poses);

    const snapInfos = checkSnaps(moveable, {
        left,
        right,
        top,
        bottom,
        center: (left + right) / 2,
        middle: (top + bottom) / 2,
    }, true);
    const boundInfos = checkBounds(moveable, [left, right], [top, bottom]);

    if (boundInfos.vertical.isBound) {
        snapVerticalInfo.offset = boundInfos.vertical.offset;
        snapVerticalInfo.isSnap = true;
    } else if (snapInfos.vertical.isSnap) {
        // has vertical guidelines
        snapVerticalInfo.offset = snapInfos.vertical.offset;
        snapVerticalInfo.isSnap = true;
    }
    if (boundInfos.horizontal.isBound) {
        snapHorizontalInfo.offset = boundInfos.horizontal.offset;
        snapHorizontalInfo.isSnap = true;
    } else if (snapInfos.horizontal.isSnap) {
        // has horizontal guidelines
        snapHorizontalInfo.offset = snapInfos.horizontal.offset;
        snapHorizontalInfo.isSnap = true;
    }

    return [
        snapVerticalInfo,
        snapHorizontalInfo,
    ];
}

export default {
    name: "snappable",
    props: {
        snappable: [Boolean, Array],
        snapCenter: Boolean,
        snapHorizontal: Boolean,
        snapVertical: Boolean,
        snapElement: Boolean,
        snapThreshold: Number,
        horizontalGuidelines: Array,
        verticalGuidelines: Array,
        elementGuidelines: Array,
        bounds: Object,
    } as const,
    render(moveable: MoveableManager<SnappableProps, SnappableState>, React: Renderer): any[] {
        const {
            top: targetTop,
            left: targetLeft,
            pos1, pos2, pos3, pos4,
            snapDirection,
            clientRect,
            containerRect,
        } = moveable.state;

        const clientLeft = clientRect.left - containerRect.left;
        const clientTop = clientRect.top - containerRect.top;
        const minLeft = Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const minTop = Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);

        if (!snapDirection || !hasGuidelines(moveable, "")) {
            return [];
        }
        const poses = getAbsolutePosesByState(moveable.state);
        const { width, height, top, left, bottom, right } = getRect(poses);

        const {
            vertical: {
                guidelines: verticalGuildelines,
                snapPoses: verticalSnapPoses,
            },
            horizontal: {
                guidelines: horizontalGuidelines,
                snapPoses: horizontalSnapPoses,
            },
        } = getSnapInfosByDirection(moveable, poses, snapDirection);

        const {
            vertical: {
                isBound: isVerticalBound,
                pos: verticalBoundPos,
            },
            horizontal: {
                isBound: isHorizontalBound,
                pos: horizontalBoundPos,
            },
        } = checkBounds(moveable, [left, right], [top, bottom], 1);

        if (isVerticalBound && verticalSnapPoses.indexOf(verticalBoundPos) < 0) {
            verticalSnapPoses.push(verticalBoundPos);
        }
        if (isHorizontalBound && horizontalSnapPoses.indexOf(horizontalBoundPos) < 0) {
            horizontalSnapPoses.push(horizontalBoundPos);
        }
        const elementVerticalGuidelines = verticalGuildelines.filter(({ element }) => element);
        const elementHorizontalGuidelines = horizontalGuidelines.filter(({ element }) => element);

        return [
            ...elementHorizontalGuidelines.map(({ pos, size }, i) => {
                const lineLeft = Math.min(0, pos[0] - clientLeft);
                const lineRight = Math.max(width, pos[0] - clientLeft + size);

                return <div className={prefix(
                    "line",
                    "horizontal",
                    "guideline",
                    "dashed",
                )} key={`horizontalLinkGuidline${i}`} style={{
                    left: `${minLeft + lineLeft}px`,
                    top: `${-targetTop + pos[1]}px`,
                    width: `${lineRight - lineLeft}px`,
                }} />;
            }),
            ...elementVerticalGuidelines.map(({ pos, size }, i) => {
                const lineTop = Math.min(0, pos[1] - clientTop);
                const lineBottom = Math.max(height, pos[1] - clientTop + size);

                return <div className={prefix(
                    "line",
                    "vertical",
                    "guideline",
                    "dashed",
                )} key={`verticalDashedGuidline${i}`} style={{
                    top: `${minTop + lineTop}px`,
                    left: `${-targetLeft + pos[0]}px`,
                    height: `${lineBottom - lineTop}px`,
                }} />;
            }),
            ...verticalSnapPoses.map((pos, i) => {
                return <div className={prefix(
                    "line",
                    "vertical",
                    "guideline",
                    "target",
                    "bold",
                )} key={`verticalTargetGuidline${i}`} style={{
                    top: `${minTop}px`,
                    left: `${-targetLeft + pos}px`,
                    height: `${height}px`,
                }} />;
            }),
            ...horizontalSnapPoses.map((pos, i) => {
                return <div className={prefix(
                    "line",
                    "horizontal",
                    "guideline",
                    "target",
                    "bold",
                )} key={`horizontalTargetGuidline${i}`} style={{
                    top: `${-targetTop + pos}px`,
                    left: `${minLeft}px`,
                    width: `${width}px`,
                }} />;
            }),
            ...verticalGuildelines.map((guideline, i) => {
                const { pos, size, element } = guideline;

                return <div className={prefix(
                    "line",
                    "vertical",
                    "guideline",
                    element ? "bold" : "",
                )} key={`verticalGuidline${i}`} style={{
                    top: `${minTop - clientTop + pos[1]}px`,
                    left: `${-targetLeft + pos[0]}px`,
                    height: `${size}px`,
                }} />;
            }),
            ...horizontalGuidelines.map((guideline, i) => {
                const { pos, size, element } = guideline;

                return <div className={prefix(
                    "line",
                    "horizontal",
                    "guideline",
                    element ? "bold" : "",
                )} key={`horizontalGuidline${i}`} style={{
                    top: `${-targetTop + pos[1]}px`,
                    left: `${minLeft - clientLeft + pos[0]}px`,
                    width: `${size}px`,
                }} />;
            }),
        ];
    },
    dragStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        moveable.state.snapDirection = true;
        snapStart(moveable);
    },
    pinchStart(moveable: MoveableManager<SnappableProps, SnappableState>) {
        this.unset(moveable);
    },
    dragEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        this.unset(moveable);
    },
    dragControlCondition: directionCondition,
    dragControlStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        moveable.state.snapDirection = null;
        snapStart(moveable);
    },
    dragControlEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        this.unset(moveable);
    },
    dragGroupStart(moveable: any, e: any) {
        moveable.state.snapDirection = true;
        snapStart(moveable);
    },
    dragGroupEnd(moveable: any) {
        this.unset(moveable);
    },
    dragGroupControlStart(moveable: any, e: any) {
        moveable.state.snapDirection = null;
        snapStart(moveable);
    },
    dragGroupControlEnd(moveable: any) {
        this.unset(moveable);
    },
    unset(moveable: any) {
        const state = moveable.state;

        state.enableSnap = false;
        state.guidelines = [];
        state.snapDirection = null;
    },
};
