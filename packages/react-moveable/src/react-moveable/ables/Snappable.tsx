import MoveableManager from "../MoveableManager";
import { Renderer, SnappableProps, SnappableState, Guideline, SnapInfo, MoveableManagerState } from "../types";
import { OnDrag, OnDragStart } from "@daybrush/drag";
import { prefix, throttle, caculatePoses } from "../utils";
import { directionCondition } from "../groupUtils";
import { isUndefined } from "@daybrush/utils";
import { getSizeInfo, getPosByReverseDirection, getPosesByDirection, getDragDist, scaleMatrix } from "../DraggerUtils";
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

    const guideliens: Guideline[] = [];

    horizontalGuidelines!.forEach(pos => {
        guideliens.push({ type: "horizontal", pos: [0, pos], size: containerWidth });
    });
    verticalGuidelines!.forEach(pos => {
        guideliens.push({ type: "vertical", pos: [pos, 0], size: containerHeight });
    });
    elementGuildelines!.forEach(el => {
        const rect = el.getBoundingClientRect();
        const { top, left, width, height } = rect;

        const elementTop = top - containerTop;
        const elementBottom = elementTop + height;
        const elementLeft = left - containerLeft;
        const elementRight = elementLeft + width;

        guideliens.push({ type: "vertical", element: el, pos: [elementLeft, elementTop], size: height });
        guideliens.push({ type: "vertical", element: el, pos: [elementRight, elementTop], size: height });
        guideliens.push({ type: "horizontal", element: el, pos: [elementLeft, elementTop], size: width });
        guideliens.push({ type: "horizontal", element: el, pos: [elementLeft, elementBottom], size: width });

        if (snapCenter) {
            guideliens.push({
                type: "vertical",
                element: el,
                pos: [(elementLeft + elementRight) / 2, elementTop],
                size: height,
                center: true,
            });
            guideliens.push({
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

    state.guidelines = guideliens;
    state.startLeft = startLeft;
    state.startRight = startRight;
    state.startTop = startTop;
    state.startBottom = startBottom;
}

function checkSnap(
    guidelines: Guideline[],
    targetType: "horizontal" | "vertical",
    targetPoses: number[],
    snapThreshold: number,
    isSnapCenter?: boolean,
    throttleSnap: number = 0,
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
            const offset = throttle(targetPos, throttleSnap) - throttle(pos[posType], throttleSnap);
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
    const guidelines = moveable.state.guidelines;

    if (!guidelines || !guidelines.length) {
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
    const guidelines = moveable.state.guidelines;

    if (!guidelines || !guidelines.length) {
        return false;
    }
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
    datas: any,
    is3d: boolean,
) {
    const poses = getSizeInfo(moveable);
    const fixedPos = getPosByReverseDirection(poses, direction);
    const nextPoses = caculatePoses(matrix, width, height, is3d ? 4 : 3);
    const nextPos = getPosByReverseDirection(nextPoses, direction);

    const dist = minus(fixedPos, nextPos);
    const pos1 = plus(nextPoses[0], dist);
    const pos2 = plus(nextPoses[1], dist);
    const pos3 = plus(nextPoses[2], dist);
    const pos4 = plus(nextPoses[3], dist);
    const directionPoses = getPosesByDirection([pos1, pos2, pos3, pos4], direction);

    if (direction[0] && direction[1]) {
        const snapInfo = checkSnapPoses(
            moveable,
            directionPoses.map(pos => pos[0]),
            directionPoses.map(pos => pos[1]),
        );
        const {
            offset: horizontalOffset,
        } = snapInfo.horizontal;
        const {
            offset: verticalOffset,
        } = snapInfo.vertical;

        // share drag event
        const [widthDist, heightDist] = getDragDist({
            datas,
            distX: verticalOffset,
            distY: horizontalOffset,
        });

        return[
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
                isSnap: isHorizontalSnap,
                offset: horizontalOffset,
                dist: horizontalDist,
            } = snapInfos.horizontal;
            const {
                isSnap: isVerticalSnap,
                offset: verticalOffset,
                dist: verticalDist,
            } = snapInfos.vertical;

            if (!isHorizontalSnap && !isVerticalSnap) {
                return false;
            }
            let isVertical!: boolean;

            if (isHorizontalSnap && isVerticalSnap) {
                if (horizontalDist === 0 && reverseDirectionPoses[i][1] === directionPos[1]) {
                    isVertical = true;
                } else if (verticalOffset === 0 && reverseDirectionPoses[i][0] === directionPos[0]) {
                    isVertical = false;
                } else {
                    isVertical = horizontalDist > verticalDist ? true : false;
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
    return plus(nextSizes, checkSizeDist(moveable, matrix, width, height, direction, datas, is3d));
}
export function checkSnapScale(
    moveable: MoveableManager<any, any>,
    scale: number[],
    direction: number[],
    datas: any,
) {
    const {
        width,
        height,
    } = moveable.state;
    const nextScale = scale.slice();

    if (!hasGuidlines(moveable)) {
        return nextScale;
    }

    const sizeDist = checkSizeDist(moveable, scaleMatrix(datas, scale), width, height, direction, datas, datas.is3d);

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

export default {
    name: "snappable",
    render(moveable: MoveableManager<SnappableProps, SnappableState>, React: Renderer): any[] {
        const { pos1, pos2, pos3, pos4, left: targetLeft, top: targetTop } = moveable.state;

        const left = targetLeft + Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const right = targetLeft + Math.max(pos1[0], pos2[0], pos3[0], pos4[0]);
        const top = targetTop + Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
        const bottom = targetTop + Math.max(pos1[1], pos2[1], pos3[1], pos4[1]);
        const center = (left + right) / 2;
        const middle = (top + bottom) / 2;
        const snapInfos = checkSnaps(moveable, {
            left,
            right,
            top,
            bottom,
            center,
            middle,
        }, true, 1);

        if (!snapInfos) {
            return [];
        }
        const {
            guidelines: verticalGuildelines,
            snapPoses: verticalSnapPoses,
        } = snapInfos.vertical!;
        const {
            guidelines: horizontalGuidelines,
            snapPoses: horizontalSnapPoses,
        } = snapInfos.horizontal!;

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
                    height: `${bottom - top}px`,
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
                    width: `${right - left}px`,
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
        snapStart(moveable, e);
    },
    drag(moveable: MoveableManager<SnappableProps, SnappableState>, e: OnDrag) {
        const { clientX, clientY, distX, distY } = e;
        const {
            guidelines,
            startLeft,
            startTop,
            startBottom,
            startRight,
        } = moveable.state;

        if (!guidelines || !guidelines.length) {
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

        if (!snapInfos) {
            return;
        }
        const verticalSnapInfo = snapInfos.vertical!;
        const horizontallSnapInfo = snapInfos.horizontal!;

        if (verticalSnapInfo.isSnap) {
            // has vertical guidelines
            const offsetX = verticalSnapInfo.offset;

            e.clientX = clientX - offsetX;
            e.distX = distX - offsetX;
        }
        if (horizontallSnapInfo.isSnap) {
            // has horizontal guidelines
            const offsetY = horizontallSnapInfo.offset;

            e.clientY = clientY - offsetY;
            e.distY = distY - offsetY;
        }
    },
    dragEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        moveable.state.guidelines = [];
    },
    dragControlCondition: directionCondition,
    dragControlStart(moveable: MoveableManager<SnappableProps, SnappableState>, e: any) {
        snapStart(moveable, e);
    },
    dragControlEnd(moveable: MoveableManager<SnappableProps, SnappableState>) {
        this.dragEnd(moveable);
    },
    dragGroupStart(moveable: any, e: any) {
        snapStart(moveable, e);
    },
    dragGroup(moveable: any, e: any) {
        this.drag(moveable, e);
    },
    dragGroupEnd(moveable: any) {
        this.dragEnd(moveable);
    },
    dragGroupControlStart(moveable: any, e: any) {
        snapStart(moveable, e);
    },
    dragGroupControlEnd(moveable: any) {
        this.dragEnd(moveable);
    },
    unset(moveable: any) {
        this.dragEnd(moveable);
    },
};
