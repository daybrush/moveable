import {
    Renderer,
    SnappableProps,
    SnappableState,
    SnapGuideline,
    SnapInfo,
    ScalableProps,
    SnapPosInfo,
    RotatableProps,
    RectInfo,
    MoveableManagerInterface,
    SnappableRenderType,
    BoundType,
    MoveableGroupInterface,
} from "../types";
import {
    prefix,
    calculatePoses,
    getRect,
    getAbsolutePosesByState,
    getAbsolutePoses,
    directionCondition,
    getClientRect,
    getRefTarget,
    getDragDistByState,
    triggerEvent,
} from "../utils";
import {
    findIndex, hasClass, throttle,
} from "@daybrush/utils";
import {
    getDragDist,
    scaleMatrix,
    getPosByDirection,
} from "../gesto/GestoUtils";
import { minus, rotate, plus } from "@scena/matrix";
import { dragControlCondition as rotatableDragControlCondtion } from "./Rotatable";
import { FLOAT_POINT_NUM } from "../consts";
import {
    getInnerBoundInfo,
    getCheckInnerBoundLines,
    checkRotateInnerBounds,
    checkInnerBoundPoses,
} from "./snappable/innerBounds";
import {
    checkBoundPoses,
    checkRotateBounds,
    getBounds,
} from "./snappable/bounds";
import {
    checkSnaps,
    getSnapInfosByDirection,
    getNearOffsetInfo,
    getCheckSnapDirections,
} from "./snappable/snap";
import {
    renderSnapPoses,
    renderGuidelines,
    renderDashedGuidelines,
    renderGapGuidelines,
} from "./snappable/render";
import {
    getTotalGuidelines,
    hasGuidelines,
} from "./snappable/utils";
import {
    checkMaxBounds,
    checkMoveableSnapBounds,
    getSnapBoundInfo,
} from "./snappable/snapBounds";


export interface SnapPoses {
    vertical: number[];
    horizontal: number[];
}

export function snapStart(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>
) {
    const state = moveable.state;

    if (state.guidelines && state.guidelines.length) {
        return;
    }
    const container = moveable.state.container;
    const snapContainer = moveable.props.snapContainer || container!;

    const containerClientRect = state.containerClientRect;
    const snapOffset = {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    };

    if (container !== snapContainer) {
        const snapContainerTarget = getRefTarget(snapContainer, true);

        if (snapContainerTarget) {
            const snapContainerRect = getClientRect(snapContainerTarget);
            const offset1 = getDragDistByState(state, [
                snapContainerRect.left - containerClientRect.left,
                snapContainerRect.top - containerClientRect.top,
            ]);
            const offset2 = getDragDistByState(state, [
                snapContainerRect.right - containerClientRect.right,
                snapContainerRect.bottom - containerClientRect.bottom,
            ]);
            snapOffset.left = throttle(offset1[0], 0.1);
            snapOffset.top = throttle(offset1[1], 0.1);
            snapOffset.right = throttle(offset2[0], 0.1);
            snapOffset.bottom = throttle(offset2[1], 0.1);
        }
    }

    state.snapOffset = snapOffset;
    state.guidelines = getTotalGuidelines(moveable);
    state.enableSnap = true;
}

function getNextFixedPoses(
    matrix: number[],
    width: number,
    height: number,
    fixedDirection: number[],
    fixedPos: number[],
    is3d: boolean
) {
    const nextPoses = calculatePoses(matrix, width, height, is3d ? 4 : 3);
    const nextFixedPos = getPosByDirection(nextPoses, fixedDirection);

    return getAbsolutePoses(nextPoses, minus(fixedPos, nextFixedPos));
}

export function normalized(value: number) {
    return value ? value / Math.abs(value) : 0;
}


export function getSizeOffsetInfo(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    poses: number[][],
    direction: number[],
    keepRatio: boolean,
    isRequest: boolean,
    datas: any
) {
    const { fixedDirection } = datas;
    const directions = getCheckSnapDirections(direction, fixedDirection, keepRatio);
    const lines = getCheckInnerBoundLines(poses, direction, keepRatio);
    const offsets = [
        ...getSnapBoundInfo(
            moveable,
            poses,
            directions,
            keepRatio,
            isRequest,
            datas
        ),
        ...getInnerBoundInfo(
            moveable,
            lines,
            getPosByDirection(poses, [0, 0]),
            datas
        ),
    ];
    const widthOffsetInfo = getNearOffsetInfo(offsets, 0);
    const heightOffsetInfo = getNearOffsetInfo(offsets, 1);

    return {
        width: {
            isBound: widthOffsetInfo.isBound,
            offset: widthOffsetInfo.offset[0],
        },
        height: {
            isBound: heightOffsetInfo.isBound,
            offset: heightOffsetInfo.offset[1],
        },
    };
}
export function recheckSizeByTwoDirection(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    poses: number[][],
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
    direction: number[],
    isRequest: boolean,
    datas: any
) {
    const snapPos = getPosByDirection(poses, direction);

    const {
        horizontal: { offset: horizontalOffset },
        vertical: { offset: verticalOffset },
    } = checkMoveableSnapBounds(moveable, isRequest, {
        vertical: [snapPos[0]],
        horizontal: [snapPos[1]],
    });

    if (verticalOffset || horizontalOffset) {
        const [nextWidthOffset, nextHeightOffset] = getDragDist({
            datas,
            distX: -verticalOffset,
            distY: -horizontalOffset,
        });
        const nextWidth = Math.min(
            maxWidth || Infinity,
            width + direction[0] * nextWidthOffset
        );
        const nextHeight = Math.min(
            maxHeight || Infinity,
            height + direction[1] * nextHeightOffset
        );

        return [nextWidth - width, nextHeight - height];
    }
    return [0, 0];
}
export function checkSizeDist(
    moveable: MoveableManagerInterface<any, any>,
    getNextPoses: (widthOffset: number, heightOffset: number) => number[][],
    width: number,
    height: number,
    direction: number[],
    fixedPosition: number[],
    isRequest: boolean,
    datas: any
) {
    const poses = getAbsolutePosesByState(moveable.state);
    const keepRatio = moveable.props.keepRatio;

    let widthOffset = 0;
    let heightOffset = 0;

    for (let i = 0; i < 2; ++i) {
        const nextPoses = getNextPoses(widthOffset, heightOffset);
        const {
            width: widthOffsetInfo,
            height: heightOffsetInfo,
        } = getSizeOffsetInfo(
            moveable,
            nextPoses,
            direction,
            keepRatio,
            isRequest,
            datas
        );

        const isWidthBound = widthOffsetInfo.isBound;
        const isHeightBound = heightOffsetInfo.isBound;
        let nextWidthOffset = widthOffsetInfo.offset;
        let nextHeightOffset = heightOffsetInfo.offset;

        if (i === 1) {
            if (!isWidthBound) {
                nextWidthOffset = 0;
            }
            if (!isHeightBound) {
                nextHeightOffset = 0;
            }
        }
        if (i === 0 && isRequest && !isWidthBound && !isHeightBound) {
            return [0, 0];
        }
        if (keepRatio) {
            const widthDist =
                Math.abs(nextWidthOffset) * (width ? 1 / width : 1);
            const heightDist =
                Math.abs(nextHeightOffset) * (height ? 1 / height : 1);
            const isGetWidthOffset =
                isWidthBound && isHeightBound
                    ? widthDist < heightDist
                    : isHeightBound ||
                    (!isWidthBound && widthDist < heightDist);
            if (isGetWidthOffset) {
                // width : height = ? : heightOffset
                nextWidthOffset = (width * nextHeightOffset) / height;
            } else {
                // width : height = widthOffset : ?
                nextHeightOffset = (height * nextWidthOffset) / width;
            }
        }
        widthOffset += nextWidthOffset;
        heightOffset += nextHeightOffset;
    }

    if (direction[0] && direction[1]) {
        const { maxWidth, maxHeight } = checkMaxBounds(
            moveable,
            poses,
            direction,
            fixedPosition,
            datas
        );

        const [nextWidthOffset, nextHeightOffset] = recheckSizeByTwoDirection(
            moveable,
            getNextPoses(widthOffset, heightOffset).map(pos => pos.map(p => throttle(p, FLOAT_POINT_NUM))),
            width + widthOffset,
            height + heightOffset,
            maxWidth,
            maxHeight,
            direction,
            isRequest,
            datas
        );
        widthOffset += nextWidthOffset;
        heightOffset += nextHeightOffset;
    }

    return [widthOffset, heightOffset];
}

export function checkSnapRotate(
    moveable: MoveableManagerInterface<SnappableProps & RotatableProps, any>,
    rect: RectInfo,
    origin: number[],
    rotation: number
) {
    if (!hasGuidelines(moveable, "rotatable")) {
        return rotation;
    }

    const { pos1, pos2, pos3, pos4 } = rect;
    const rad = (rotation * Math.PI) / 180;
    const prevPoses = [pos1, pos2, pos3, pos4].map((pos) => minus(pos, origin));
    const nextPoses = prevPoses.map((pos) => rotate(pos, rad));

    const result = [
        ...checkRotateBounds(moveable, prevPoses, nextPoses, origin, rotation),
        ...checkRotateInnerBounds(
            moveable,
            prevPoses,
            nextPoses,
            origin,
            rotation
        ),
    ];
    result.sort((a, b) => Math.abs(a - rotation) - Math.abs(b - rotation));

    if (result.length) {
        return result[0];
    } else {
        return rotation;
    }
}
export function checkSnapResize(
    moveable: MoveableManagerInterface<{}, {}>,
    width: number,
    height: number,
    direction: number[],
    fixedPosition: number[],
    isRequest: boolean,
    datas: any
) {
    if (!hasGuidelines(moveable, "resizable")) {
        return [0, 0];
    }
    const { fixedDirection } = datas;
    const { allMatrix, is3d } = moveable.state;
    return checkSizeDist(
        moveable,
        (widthOffset: number, heightOffset: number) => {
            return getNextFixedPoses(
                allMatrix,
                width + widthOffset,
                height + heightOffset,
                fixedDirection,
                fixedPosition,
                is3d
            );
        },
        width,
        height,
        direction,
        fixedPosition,
        isRequest,
        datas
    );
}
export function checkSnapScale(
    moveable: MoveableManagerInterface<ScalableProps, any>,
    scale: number[],
    direction: number[],
    isRequest: boolean,
    datas: any
) {
    if (!hasGuidelines(moveable, "scalable")) {
        return [0, 0];
    }
    const { startOffsetWidth, startOffsetHeight, fixedPosition, fixedDirection, is3d } = datas;
    const sizeDist = checkSizeDist(
        moveable,
        (widthOffset: number, heightOffset: number) => {
            return getNextFixedPoses(
                scaleMatrix(
                    datas,
                    plus(scale, [widthOffset / startOffsetWidth, heightOffset / startOffsetHeight]),
                ),
                startOffsetWidth,
                startOffsetHeight,
                fixedDirection,
                fixedPosition,
                is3d
            );
        },
        startOffsetWidth,
        startOffsetHeight,
        direction,
        fixedPosition,
        isRequest,
        datas
    );
    return [sizeDist[0] / startOffsetWidth, sizeDist[1] / startOffsetHeight];
}

export function startCheckSnapDrag(
    moveable: MoveableManagerInterface<any, any>,
    datas: any
) {
    datas.absolutePoses = getAbsolutePosesByState(moveable.state);
}



function getSnapGuidelines(posInfos: SnapPosInfo[]) {
    const guidelines: SnapGuideline[] = [];

    posInfos.forEach((posInfo) => {
        posInfo.guidelineInfos.forEach(({ guideline }) => {
            if (guidelines.indexOf(guideline) > -1) {
                return;
            }
            guidelines.push(guideline);
        });
    });

    return guidelines;
}

function addBoundGuidelines(
    moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
    verticalPoses: number[],
    horizontalPoses: number[],
    verticalSnapPoses: SnappableRenderType[],
    horizontalSnapPoses: SnappableRenderType[],
    externalBounds?: BoundType | false | null
) {
    const {
        vertical: verticalBoundInfos,
        horizontal: horizontalBoundInfos,
    } = checkBoundPoses(
        getBounds(moveable, externalBounds),
        verticalPoses,
        horizontalPoses
    );
    verticalBoundInfos.forEach((info) => {
        if (info.isBound) {
            verticalSnapPoses.push({
                type: "bounds",
                pos: info.pos,
            });
        }
    });
    horizontalBoundInfos.forEach((info) => {
        if (info.isBound) {
            horizontalSnapPoses.push({
                type: "bounds",
                pos: info.pos,
            });
        }
    });
    const {
        vertical: verticalInnerBoundPoses,
        horizontal: horizontalInnerBoundPoses,
    } = checkInnerBoundPoses(moveable);

    verticalInnerBoundPoses.forEach((innerPos) => {
        if (
            findIndex(
                verticalSnapPoses,
                ({ type, pos }) => type === "bounds" && pos === innerPos
            ) >= 0
        ) {
            return;
        }
        verticalSnapPoses.push({
            type: "bounds",
            pos: innerPos,
        });
    });

    horizontalInnerBoundPoses.forEach((innerPos) => {
        if (
            findIndex(
                horizontalSnapPoses,
                ({ type, pos }) => type === "bounds" && pos === innerPos
            ) >= 0
        ) {
            return;
        }
        horizontalSnapPoses.push({
            type: "bounds",
            pos: innerPos,
        });
    });
}
/**
 * @namespace Moveable.Snappable
 * @description Whether or not target can be snapped to the guideline. (default: false)
 * @sort 2
 */
export default {
    name: "snappable",
    dragRelation: "strong",
    props: {
        snappable: [Boolean, Array],
        snapContainer: Object,

        snapDirections: [Boolean, Object],
        elementSnapDirections: [Boolean, Object],

        snapGap: Boolean,
        snapGridWidth: Number,
        snapGridHeight: Number,
        isDisplaySnapDigit: Boolean,
        isDisplayInnerSnapDigit: Boolean,
        snapDigit: Number,
        snapThreshold: Number,

        horizontalGuidelines: Array,
        verticalGuidelines: Array,
        elementGuidelines: Array,

        bounds: Object,
        innerBounds: Object,
        snapDistFormat: Function,
    } as const,
    events: {
        onSnap: "snap",
    } as const,
    css: [
        `:host {
    --bounds-color: #d66;
}
.guideline {
    pointer-events: none;
    z-index: 2;
}
.guideline.bounds {
    background: #d66;
    background: var(--bounds-color);
}
.guideline-group {
    position: absolute;
    top: 0;
    left: 0;
}
.guideline-group .size-value {
    position: absolute;
    color: #f55;
    font-size: 12px;
    font-weight: bold;
}
.guideline-group.horizontal .size-value {
    transform-origin: 50% 100%;
    transform: translateX(-50%);
    left: 50%;
    bottom: 5px;
}
.guideline-group.vertical .size-value {
    transform-origin: 0% 50%;
    top: 50%;
    transform: translateY(-50%);
    left: 5px;
}
.guideline.gap {
    background: #f55;
}
.size-value.gap {
    color: #f55;
}
`,
    ],
    render(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
        React: Renderer
    ): any[] {
        const state = moveable.state;
        const {
            top: targetTop,
            left: targetLeft,
            pos1,
            pos2,
            pos3,
            pos4,
            snapRenderInfo,
        } = state;

        if (!snapRenderInfo || !hasGuidelines(moveable, "")) {
            return [];
        }
        state.guidelines = getTotalGuidelines(moveable);


        const minLeft = Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        const minTop = Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
        const externalPoses = snapRenderInfo.externalPoses || [];
        const poses = getAbsolutePosesByState(moveable.state);
        const verticalSnapPoses: SnappableRenderType[] = [];
        const horizontalSnapPoses: SnappableRenderType[] = [];
        const verticalGuidelines: SnapGuideline[] = [];
        const horizontalGuidelines: SnapGuideline[] = [];
        const snapInfos: Array<{
            vertical: SnapInfo;
            horizontal: SnapInfo;
        }> = [];
        const { width, height, top, left, bottom, right } = getRect(poses);
        const targetRect = { left, right, top, bottom, center: (left + right) / 2, middle: (top + bottom) / 2 };
        const hasExternalPoses = externalPoses.length > 0;
        const externalRect = hasExternalPoses
            ? getRect(externalPoses)
            : ({} as ReturnType<typeof getRect>);

        if (!snapRenderInfo.request) {
            if (snapRenderInfo.direction) {
                snapInfos.push(
                    getSnapInfosByDirection(
                        moveable,
                        poses,
                        snapRenderInfo.direction
                    )
                );
            }
            if (snapRenderInfo.snap) {
                const rect = getRect(poses);
                if (snapRenderInfo.center) {
                    (rect as any).middle = (rect.top + rect.bottom) / 2;
                    (rect as any).center = (rect.left + rect.right) / 2;
                }
                snapInfos.push(checkSnaps(moveable, rect, 1));
            }
            if (hasExternalPoses) {
                if (snapRenderInfo.center) {
                    (externalRect as any).middle =
                        (externalRect.top + externalRect.bottom) / 2;
                    (externalRect as any).center =
                        (externalRect.left + externalRect.right) / 2;
                }
                snapInfos.push(checkSnaps(moveable, externalRect, 1));
            }
            snapInfos.forEach((snapInfo) => {
                const {
                    vertical: { posInfos: verticalPosInfos },
                    horizontal: { posInfos: horizontalPosInfos },
                } = snapInfo;
                verticalSnapPoses.push(
                    ...verticalPosInfos.filter(({ guidelineInfos }) => {
                        return guidelineInfos.some(({ guideline }) => !guideline.hide);
                    }).map(
                        (posInfo) => ({
                            type: "snap",
                            pos: posInfo.pos,
                        } as const)
                    )
                );
                horizontalSnapPoses.push(
                    ...horizontalPosInfos.filter(({ guidelineInfos }) => {
                        return guidelineInfos.some(({ guideline }) => !guideline.hide);
                    }).map(
                        (posInfo) => ({
                            type: "snap",
                            pos: posInfo.pos,
                        } as const)
                    )
                );
                verticalGuidelines.push(...getSnapGuidelines(verticalPosInfos));
                horizontalGuidelines.push(...getSnapGuidelines(horizontalPosInfos));
            });
        }

        addBoundGuidelines(
            moveable,
            [left, right],
            [top, bottom],
            verticalSnapPoses,
            horizontalSnapPoses
        );
        if (hasExternalPoses) {
            addBoundGuidelines(
                moveable,
                [externalRect.left, externalRect.right],
                [externalRect.top, externalRect.bottom],
                verticalSnapPoses,
                horizontalSnapPoses,
                snapRenderInfo.externalBounds
            );
        }
        const allGuidelines = [...verticalGuidelines, ...horizontalGuidelines];
        const elementGuidelines = allGuidelines.filter(guideline => guideline.element && !guideline.gapRects);
        const gapGuidelines = allGuidelines.filter(guideline => guideline.gapRects);
        triggerEvent(
            moveable,
            "onSnap",
            {
                guidelines: allGuidelines.filter(({ element }) => !element),
                elements: elementGuidelines,
                gaps: gapGuidelines,
            },
            true
        );
        return [
            ...renderDashedGuidelines(
                moveable,
                elementGuidelines,
                [minLeft, minTop],
                targetRect,
                React,
            ),
            ...renderGapGuidelines(
                moveable,
                gapGuidelines,
                [minLeft, minTop],
                targetRect,
                React,
            ),
            ...renderGuidelines(
                moveable,
                "horizontal",
                horizontalGuidelines,
                [targetLeft, targetTop],
                targetRect,
                React
            ),
            ...renderGuidelines(
                moveable,
                "vertical",
                verticalGuidelines,
                [targetLeft, targetTop],
                targetRect,
                React
            ),
            ...renderSnapPoses(
                moveable,
                "horizontal",
                horizontalSnapPoses,
                minLeft,
                targetTop,
                width,
                0,
                React
            ),
            ...renderSnapPoses(
                moveable,
                "vertical",
                verticalSnapPoses,
                minTop,
                targetLeft,
                height,
                1,
                React
            ),
        ];
    },
    dragStart(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>,
        e: any
    ) {
        moveable.state.snapRenderInfo = {
            request: e.isRequest,
            snap: true,
            center: true,
        };
        snapStart(moveable);
    },
    drag(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        const state = moveable.state;
        state.guidelines = getTotalGuidelines(moveable);
    },
    pinchStart(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    dragEnd(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    dragControlCondition(moveable: MoveableManagerInterface, e: any) {
        if (directionCondition(moveable, e) || rotatableDragControlCondtion(moveable, e)) {
            return true;
        }
        if (!e.isRequest && e.inputEvent) {
            return hasClass(e.inputEvent.target, prefix("snap-control"));
        }
    },
    dragControlStart(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        moveable.state.snapRenderInfo = null;
        snapStart(moveable);
    },
    dragControl(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.drag(moveable);
    },
    dragControlEnd(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    dragGroupStart(moveable: any, e: any) {
        this.dragStart(moveable, e);
    },
    dragGroup(
        moveable: MoveableGroupInterface<SnappableProps, SnappableState>
    ) {
        this.drag(moveable);
    },
    dragGroupEnd(
        moveable: MoveableGroupInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    dragGroupControlStart(
        moveable: MoveableGroupInterface<SnappableProps, SnappableState>
    ) {
        moveable.state.snapRenderInfo = null;
        snapStart(moveable);
    },
    dragGroupControl(
        moveable: MoveableManagerInterface<SnappableProps, SnappableState>
    ) {
        this.drag(moveable);
    },
    dragGroupControlEnd(
        moveable: MoveableGroupInterface<SnappableProps, SnappableState>
    ) {
        this.unset(moveable);
    },
    unset(moveable: any) {
        const state = moveable.state;

        state.enableSnap = false;
        state.guidelines = [];
        state.snapRenderInfo = null;
        state.elementRects = [];
    },
};


/**
 * Whether or not target can be snapped to the guideline. (default: false)
 * @name Moveable.Snappable#snappable
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snappable = true;
 */
/**
 *  A snap container that is the basis for snap, bounds, and innerBounds. (default: null = container)
 * @name Moveable.Snappable#snapContainer
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.querySelector(".container"));
 *
 * moveable.snapContainer = document.body;
 */
/**
 * You can specify the directions to snap to the target. (default: { left: true, top: true, right: true, bottom: true })
 * @name Moveable.Snappable#snapDirections
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   snapDirections: true,
 * });
 * // snap center
 * moveable.snapDirections = { left: true, top: true, right: true, bottom: true, center: true, middle: true };
 */

/**
 * You can specify the snap directions of elements. (default: { left: true, top: true, right: true, bottom: true })
 * @name Moveable.Snappable#elementSnapDirections
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   elementSnapDirections: true,
 * });
 * // snap center
 * moveable.elementSnapDirections = { left: true, top: true, right: true, bottom: true, center: true, middle: true };
 */
/**
 * When you drag, make the gap snap in the element guidelines. (default: true)
 * @name Moveable.Snappable#snapGap
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   snapElement: true,
 *   snapGap: true,
 * });
 *
 * moveable.snapGap = false;
 */
/**
 * Distance value that can snap to guidelines. (default: 5)
 * @name Moveable.Snappable#snapThreshold
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapThreshold = 5;
 */

/**
 * Add guidelines in the horizontal direction. (default: [])
 * @name Moveable.Snappable#horizontalGuidelines
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.horizontalGuidelines = [100, 200, 500];
 */

/**
 * Add guidelines in the vertical direction. (default: [])
 * @name Moveable.Snappable#verticalGuidelines
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.verticalGuidelines = [100, 200, 500];
 */
/**
 * Add guidelines for the element. (default: [])
 * @name Moveable.Snappable#elementGuidelines
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.elementGuidelines = [
 *   document.querySelector(".element"),
 * ];
 */
/**
 * You can set up boundaries.
 * @name Moveable.Snappable#bounds
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @default null
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.bounds = { left: 0, right: 1000, top: 0, bottom: 1000};
 */
/**
 * You can set up inner boundaries.
 * @name Moveable.Snappable#innerBounds
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @default null
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.innerBounds = { left: 500, top: 500, width: 100, height: 100};
 */
/**
 * snap distance digits (default: 0)
 * @name Moveable.Snappable#snapDigit
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapDigit = 0
 */

/**
 * If width size is greater than 0, you can vertical snap to the grid. (default: 0)
 * @name Moveable.Snappable#snapGridWidth
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapGridWidth = 5;
 */

/**
 * If height size is greater than 0, you can horizontal snap to the grid. (default: 0)
 * @name Moveable.Snappable#snapGridHeight
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapGridHeight = 5;
 */
/**
 * Whether to show snap distance (default: true)
 * @name Moveable.Snappable#isDisplaySnapDigit
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.isDisplaySnapDigit = true;
 */

/**
 * Whether to show element inner snap distance (default: false)
 * @name Moveable.Snappable#isDisplayInnerSnapDigit
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.isDisplayInnerSnapDigit = true;
 */


/**
 * You can set the text format of the distance shown in the guidelines. (default: self)
 * @name Moveable.Snappable#snapDistFormat
 * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Snappable.html#.SnappableOptions}
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  snappable: true,
 *  snapDistFormat: (v, type) => v,
 * });
 * moveable.snapDistFormat = (v, type) => `${v}px`;
 */

/**
 * When you drag or dragControl, the `snap` event is called.
 * @memberof Moveable.Snappable
 * @event snap
 * @param {Moveable.Snappable.OnSnap} - Parameters for the `snap` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     snappable: true
 * });
 * moveable.on("snap", e => {
 *     console.log("onSnap", e);
 * });
 */
