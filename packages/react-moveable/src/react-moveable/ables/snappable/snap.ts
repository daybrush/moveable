import { SnapInfo, SnappableProps, SnappableState, Guideline, ResizableProps, ScalableProps } from "../../types";
import MoveableManager from "../../MoveableManager";
import { selectValue, throttle } from "../../utils";
import { getPosByDirection, getPosesByDirection } from "../../DraggerUtils";
import { TINY_NUM } from "../../consts";

export function checkSnapPoses(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    posesX: number[],
    posesY: number[],
    snapCenter?: boolean,
    customSnapThreshold?: number,
) {
    const {
        guidelines,
        containerClientRect: {
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
            posInfos: [],
        };
    }
    const isVertical = targetType === "vertical";
    const posType = isVertical ? 0 : 1;

    const snapPosInfos = targetPoses.map(targetPos => {
        const guidelineInfos = guidelines.map(guideline => {
            const { pos } = guideline;
            const offset = targetPos - pos[posType];

            return {
                offset,
                dist: Math.abs(offset),
                guideline,
            };
        }).filter(({ guideline, dist }) => {
            const { type, center, element } = guideline;
            if (
                (!snapElement && element)
                || (!snapCenter && center)
                || type !== targetType
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
            guidelineInfos,
        };
    }).filter(snapPosInfo => {
        return snapPosInfo.guidelineInfos.length > 0;
    }).sort((a, b) => {
        return a.guidelineInfos[0].dist - b.guidelineInfos[0].dist;
    });

    return {
        isSnap: snapPosInfos.length > 0,
        posInfos: snapPosInfos,
    };
}

export function getSnapInfosByDirection(
    moveable: MoveableManager<SnappableProps & (ResizableProps | ScalableProps), SnappableState>,
    poses: number[][],
    snapDirection: number[],
) {
    let nextPoses = [];
    if (snapDirection[0] && snapDirection[1]) {
        nextPoses = [
            snapDirection,
            [-snapDirection[0], snapDirection[1]],
            [snapDirection[0], -snapDirection[1]],
        ].map(direction => getPosByDirection(poses, direction));
    } else if (!snapDirection[0] && !snapDirection[1]) {
        const alignPoses = [poses[0], poses[1], poses[3], poses[2], poses[0]];

        for (let i = 0; i < 4; ++i) {
            nextPoses.push(alignPoses[i]);
            nextPoses.push([
                (alignPoses[i][0] + alignPoses[i + 1][0]) / 2,
                (alignPoses[i][1] + alignPoses[i + 1][1]) / 2,
            ]);
        }
    } else {
        if (moveable.props.keepRatio) {
            nextPoses = [
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1],
                snapDirection,
            ].map(dir => getPosByDirection(poses, dir));
        } else {
            nextPoses = getPosesByDirection(poses, snapDirection);

            if (nextPoses.length > 1) {
                nextPoses.push([
                    (nextPoses[0][0] + nextPoses[1][0]) / 2,
                    (nextPoses[0][1] + nextPoses[1][1]) / 2,
                ]);
            }
        }
    }
    return checkSnapPoses(moveable, nextPoses.map(pos => pos[0]), nextPoses.map(pos => pos[1]), true, 1);
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
        const aDist = Math.abs(aOffset);
        const bDist = Math.abs(bOffset);
        // -1 The positions of a and b do not change.
        // 1 The positions of a and b are reversed.
        if (!aSign) {
            return 1;
        } else if (!bSign) {
            return -1;
        } else if (a.isBound && b.isBound) {
            return bDist - aDist;
        } else if (a.isBound) {
            return -1;
        } else if (b.isBound) {
            return 1;
        } else if (a.isSnap && b.isSnap) {
            return aDist - bDist;
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
    })[0];
}
