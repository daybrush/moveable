import MoveableManager from "../MoveableManager";
import { Renderer, SnappableProps, SnappableState, Guideline, SnapInfo, BoundInfo } from "../types";
import { OnDrag, OnDragStart } from "@daybrush/drag";
import { prefix, caculatePoses, getRect, getAbsolutePosesByState, getAbsolutePoses } from "../utils";
import { directionCondition } from "../groupUtils";
import { isUndefined } from "@daybrush/utils";
import { getPosByReverseDirection, getPosesByDirection, getDragDist, scaleMatrix } from "../DraggerUtils";
import { minus, plus } from "@moveable/matrix";

function snapStart(moveable: MoveableManager<SnappableProps, SnappableState>, { datas }: OnDragStart) {
    const state = moveable.state;
    if (state.guidelines && state.guidelines.length) {
        return;
    }

    const {
        horizontalGuidelines = [],
        verticalGuidelines = [],
        elementGuildelines = [],
        container,
        snapCenter,
    } = moveable.props;

    if (!horizontalGuidelines.length && !verticalGuidelines.length && !elementGuildelines.length) {
        return;
    }

    const containerRect = (container || document.documentElement).getBoundingClientRect();
    const {
        top: containerTop,
        left: containerLeft,
        width: containerWidth,
        height: containerHeight,
    } = containerRect;

    const guidelines: Guideline[] = [];

    horizontalGuidelines!.forEach(pos => {
        guidelines.push({ type: "horizontal", pos: [0, pos], size: containerWidth });
    });
    verticalGuidelines!.forEach(pos => {
        guidelines.push({ type: "vertical", pos: [pos, 0], size: containerHeight });
    });
    elementGuildelines!.forEach(el => {
        const rect = el.getBoundingClientRect();
        const { top, left, width, height } = rect;

        const elementTop = top - containerTop;
        const elementBottom = elementTop + height;
        const elementLeft = left - containerLeft;
        const elementRight = elementLeft + width;

        guidelines.push({ type: "vertical", element: el, pos: [elementLeft, elementTop], size: height });
        guidelines.push({ type: "vertical", element: el, pos: [elementRight, elementTop], size: height });
        guidelines.push({ type: "horizontal", element: el, pos: [elementLeft, elementTop], size: width });
        guidelines.push({ type: "horizontal", element: el, pos: [elementLeft, elementBottom], size: width });

        if (snapCenter) {
            guidelines.push({
                type: "vertical",
                element: el,
                pos: [(elementLeft + elementRight) / 2, elementTop],
                size: height,
                center: true,
            });
            guidelines.push({
                type: "horizontal",
                element: el,
                pos: [elementLeft, (elementTop + elementBottom) / 2],
                size: width,
                center: true,
            });
        }
    });

    const { pos1, pos2, pos3, pos4, left: targetLeft, top: targetTop } = state;
    const startLeft = targetLeft + Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
    const startRight = targetLeft + Math.max(pos1[0], pos2[0], pos3[0], pos4[0]);
    const startTop = targetTop + Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
    const startBottom = targetTop + Math.max(pos1[1], pos2[1], pos3[1], pos4[1]);

    state.guidelines = guidelines;
    state.startLeft = startLeft;
    state.startRight = startRight;
    state.startTop = startTop;
    state.startBottom = startBottom;
}
function checkBounds(
    moveable: MoveableManager<SnappableProps>,
    verticalPoses: number[],
    horizontalPoses: number[],
) {
    return {
        vertical: checkBound(moveable, verticalPoses, true),
        horizontal: checkBound(moveable, horizontalPoses, false),
    };
}
function checkBound(
    moveable: MoveableManager<SnappableProps>,
    poses: number[],
    isVertical: boolean,
): BoundInfo {
    const bounds = moveable.props.bounds;

    if (!bounds) {
        return {
            isBound: false,
            offset: 0,
        };
    }

    const startPos = bounds[isVertical ? "left" : "top"];
    const endPos = bounds[isVertical ? "right" : "bottom"];

    const minPos = Math.min(...poses);
    const maxPos = Math.max(...poses);

    if (!isUndefined(startPos) && startPos > minPos) {
        return {
            isBound: true,
            offset: minPos - startPos,
        };
    }
    if (!isUndefined(endPos) && endPos < maxPos) {
        return {
            isBound: true,
            offset: maxPos - endPos,
        };
    }

    return {
        isBound: false,
        offset: 0,
    };
}
function checkSnap(
    guidelines: Guideline[],
    targetType: "horizontal" | "vertical",
    targetPoses: number[],
    snapThreshold: number,
    isSnapCenter?: boolean,
): SnapInfo {
    let snapGuidelines: Guideline[] = [];
    let snapDist = Infinity;
    let snapOffset = 0;
    const isVertical = targetType === "vertical";
    const posType = isVertical ? 0 : 1;

    const snapPoses = targetPoses.filter(targetPos => {
        return guidelines.filter(guideline => {
            const { type, pos, center } = guideline;

            if ((!isSnapCenter && center) || type !== targetType) {
                return false;
            }
            const offset = targetPos - pos[posType];
            const dist = Math.abs(offset);

            if (dist > snapThreshold) {
                return false;
            }
            if (snapDist > dist) {
                snapDist = dist;
                snapGuidelines = [];
            }
            if (snapDist === dist) {
                snapOffset = offset;
                snapGuidelines.push(guideline);
            }
            return true;
        }).length;
    });

    return {
        isSnap: !!snapGuidelines.length,
        dist: isFinite(snapDist) ? snapDist : -1,
        offset: snapOffset,
        guidelines: snapGuidelines,
        snapPoses,
    };
}
export function hasGuidlines(
    moveable: MoveableManager<any, any>,
): moveable is MoveableManager<SnappableProps, SnappableState> {
    const {
        props: {
            snappable,
        },
        state: {
            guidelines,
        },
    } = moveable;

    if (!snappable || !guidelines || !guidelines.length) {
        return false;
    }
    return true;
}
export function checkSnapPos(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    targetType: "vertical" | "horizontal",
    poses: number[],
    isSnapCenter?: boolean,
    customSnapThreshold?: number,
) {
    const guidelines = moveable.state.guidelines;
    const snapThreshold = !isUndefined(customSnapThreshold)
        ? customSnapThreshold
        : !isUndefined(moveable.props.snapThreshold)
            ? moveable.props.snapThreshold
            : 5;

    return checkSnap(guidelines, targetType, poses, snapThreshold, isSnapCenter);
}
export function checkSnapPoses(
    moveable: MoveableManager<SnappableProps, SnappableState>,
    posesX: number[],
    posesY: number[],
    isSnapCenter?: boolean,
    customSnapThreshold?: number,
) {
    return {
        vertical: checkSnapPos(moveable, "vertical", posesX, isSnapCenter, customSnapThreshold),
        horizontal: checkSnapPos(moveable, "horizontal", posesY, isSnapCenter, customSnapThreshold),
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

    const nextPoses = caculatePoses(matrix, width, height, is3d ? 4 : 3);
    const nextPos = getPosByReverseDirection(nextPoses, direction);
    const [pos1, pos2, pos3, pos4] = getAbsolutePoses(nextPoses, minus(fixedPos, nextPos));
    const directionPoses = getPosesByDirection([pos1, pos2, pos3, pos4], direction);

    if (direction[0] && direction[1]) {
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
        const [widthDist, heightDist] = getDragDist({
            datas,
            distX: isVerticalBound ? verticalBoundOffset : verticalOffset,
            distY: isHorizontalBound ? horizontalBoundOffset : horizontalOffset,
        });

        return [
            -direction[0] * widthDist,
            -direction[1] * heightDist,
        ];
    } else {
        const directionIndex = direction[0] !== 0 ? 0 : 1;
        const reverseDirectionPoses = getPosesByDirection([pos4, pos3, pos2, pos1], direction);
        let posOffset = 0;

        directionPoses.push([
            (directionPoses[0][0] + directionPoses[1][0]) / 2,
            (directionPoses[0][1] + directionPoses[1][1]) / 2,
        ]);
        reverseDirectionPoses.reverse();
        reverseDirectionPoses.push([
            (reverseDirectionPoses[0][0] + reverseDirectionPoses[1][0]) / 2,
            (reverseDirectionPoses[0][1] + reverseDirectionPoses[1][1]) / 2,
        ]);
        directionPoses.some((directionPos, i) => {
            const snapInfos = checkSnapPoses(
                moveable,
                [directionPos[0]],
                [directionPos[1]],
            );
            const {
                horizontal: {
                    isSnap: isHorizontalSnap,
                    offset: horizontalSnapOffset,
                    dist: horizontalDist,
                },
                vertical: {
                    isSnap: isVerticalSnap,
                    offset: verticalSnapOffset,
                    dist: verticalDist,
                },
            } = snapInfos;
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
                [directionPos[0]],
                [directionPos[1]],
            );
            const fixedHorizontal = reverseDirectionPoses[i][1] === directionPos[1];
            const fixedVertical = reverseDirectionPoses[i][0] === directionPos[0];

            let isVertical!: boolean;

            const horizontalOffset = isHorizontalBound || isVerticalBound
                ? horizontalBoundOffset : horizontalSnapOffset;
            const verticalOffset = isHorizontalBound || isVerticalBound
                ? verticalBoundOffset : verticalSnapOffset;

            if (isHorizontalBound && isVerticalBound) {
                if (fixedHorizontal) {
                    isVertical = true;
                } else if (fixedVertical) {
                    isVertical = false;
                } else {
                    isVertical = Math.abs(horizontalBoundOffset) < Math.abs(verticalBoundOffset);
                }
            } else if (isHorizontalBound || isVerticalBound) {
                isVertical = isVerticalBound;
            } else if (!isHorizontalSnap && !isVerticalSnap) {
                // no snap
                return false;
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

            const sizeOffset = solveEquation(
                reverseDirectionPoses[i],
                directionPos,
                -(isVertical ? verticalOffset : horizontalOffset),
                isVertical,
            );

            if (!sizeOffset) {
                return false;
            }
            const [widthDist, heightDist] = getDragDist({
                datas,
                distX: sizeOffset[0],
                distY: sizeOffset[1],
            });

            posOffset = direction[directionIndex] * (directionIndex ? heightDist : widthDist);
            return true;
        });

        const offset = [0, 0];

        offset[directionIndex] = posOffset;

        return offset;
    }
}
export function checkSnapSize(
    moveable: MoveableManager<any, any>,
    width: number,
    height: number,
    direction: number[],
    datas: any,
) {
    const nextSizes = [width, height];
    if (!hasGuidlines(moveable)) {
        return nextSizes;
    }
    const {
        matrix,
        is3d,
    } = moveable.state;
    return plus(nextSizes, checkSizeDist(moveable, matrix, width, height, direction, direction, datas, is3d));
}
export function checkSnapScale(
    moveable: MoveableManager<any, any>,
    scale: number[],
    direction: number[],
    snapDirection: number[],
    datas: any,
) {
    const {
        width,
        height,
    } = datas;
    const nextScale = scale.slice();

    if (!hasGuidlines(moveable)) {
        return nextScale;
    }
    const sizeDist = checkSizeDist(
        moveable, scaleMatrix(datas, scale),
        width, height,
        direction,
        snapDirection,
        datas, datas.is3d,
    );

    return [
        scale[0] + sizeDist[0] / width,
        scale[1] + sizeDist[1] / height,
    ];
}
export function solveEquation(
    pos1: number[],
    pos2: number[],
    snapOffset: number,
    isVertical: boolean,
) {
    const dx = pos2[0] - pos1[0];
    const dy = pos2[1] - pos1[1];

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
    moveable: MoveableManager<SnappableProps, SnappableState>,
    poses: number[][],
    snapDirection: number[] | true,
) {
    if (snapDirection === true) {
        const rect = getRect(poses);

        (rect as any).middle = (rect.top + rect.bottom) / 2;
        (rect as any).center = (rect.left + rect.right) / 2;

        return checkSnaps(moveable, rect, true, 1);
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
        const nextPoses = getPosesByDirection(poses, snapDirection);

        if (nextPoses.length > 1) {
            nextPoses.push([
                (nextPoses[0][0] + nextPoses[1][0]) / 2,
                (nextPoses[0][1] + nextPoses[1][1]) / 2,
            ]);
        }
        return checkSnapPoses(moveable, nextPoses.map(pos => pos[0]), nextPoses.map(pos => pos[1]), true, 1);
    }
}

export default {
    name: "snappable",
    render(moveable: MoveableManager<SnappableProps, SnappableState>, React: Renderer): any[] {
        const {
            left: targetLeft,
            top: targetTop,
            snapDirection,
         } = moveable.state;

        if (!snapDirection || !hasGuidlines(moveable)) {
            return [];
        }
        const poses = getAbsolutePosesByState(moveable.state);
        const { width, height } = getRect(poses);
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

        return [
            ...verticalSnapPoses.map((pos, i) => {
                return <div className={prefix(
                    "line",
                    "vertical",
                    "guideline",
                    "target",
                    "bold",
                )} key={`verticalTargetGuidline${i}`} style={{
                    top: `${0}px`,
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
                    left: `${0}px`,
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
                    top: `${-targetTop + pos[1]}px`,
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
                    left: `${-targetLeft + pos[0]}px`,
                    width: `${size}px`,
                }} />;
            }),
        ];
    },
    dragStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        moveable.state.snapDirection = true;
        snapStart(moveable, e);
    },
    drag(moveable: MoveableManager<SnappableProps, SnappableState>, e: OnDrag) {
        const { clientX, clientY, distX, distY } = e;
        const {
            startLeft,
            startTop,
            startBottom,
            startRight,
        } = moveable.state;

        if (!hasGuidlines(moveable)) {
            return false;
        }
        const left = startLeft + distX;
        const right = startRight + distX;
        const center = (left + right) / 2;
        const top = startTop + distY;
        const bottom = startBottom + distY;
        const middle = (top + bottom) / 2;

        const snapInfos = checkSnaps(moveable, {
            left,
            right,
            top,
            bottom,
            center,
            middle,
        }, true);
        const boundInfos = checkBounds(moveable, [left, right], [top, bottom]);
        let offsetX = 0;
        let offsetY = 0;

        if (boundInfos.vertical.isBound) {
            offsetX = boundInfos.vertical.offset;
        } else if (snapInfos.vertical.isSnap) {
            // has vertical guidelines
            offsetX = snapInfos.vertical.offset;
        }
        if (boundInfos.horizontal.isBound) {
            offsetY = boundInfos.horizontal.offset;
        } else  if (snapInfos.horizontal.isSnap) {
            // has horizontal guidelines
            offsetY = snapInfos.horizontal.offset;
        }
        e.clientX = clientX - offsetX;
        e.clientY = clientY - offsetY;
        e.distX = distX - offsetX;
        e.distY = distY - offsetY;
    },
    dragEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        moveable.state.guidelines = [];
        moveable.state.snapDirection = null;
    },
    dragControlCondition: directionCondition,
    dragControlStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        moveable.state.snapDirection = null;
        snapStart(moveable, e);
    },
    dragControlEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        this.dragEnd(moveable);
    },
    dragGroupStart(moveable: any, e: any) {
        moveable.state.snapDirection = true;
        snapStart(moveable, e);
    },
    dragGroup(moveable: any, e: any) {
        this.drag(moveable, e);
    },
    dragGroupEnd(moveable: any) {
        this.dragEnd(moveable);
    },
    dragGroupControlStart(moveable: any, e: any) {
        moveable.state.snapDirection = null;
        snapStart(moveable, e);
    },
    dragGroupControlEnd(moveable: any) {
        this.dragEnd(moveable);
    },
    unset(moveable: any) {
        this.dragEnd(moveable);
    },
};
