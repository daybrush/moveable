import { convertCSSSize } from "../../utils";
import { ControlPose } from "../../types";
import { convertUnitSize } from "@daybrush/utils";

const RADIUS_DIRECTIONS = ["nw", "ne", "se", "sw"] as const;

function caculateRatio(values: number[], size: number) {
    const sumSize = values[0] + values[1];
    const sumRatio = sumSize > size ? size / sumSize : 1;

    values[0] *= sumRatio;
    values[1] = size - values[1] * sumRatio;

    return values;
}
export const HORIZONTAL_RADIUS_ORDER = [1, 2, 5, 6];
export const VERTICAL_RADIUS_ORDER = [0, 3, 4, 7];
export const HORIZONTAL_RADIUS_DIRECTIONS = [1, -1, -1, 1] as const;
export const VERTICAL_RADIUS_DIRECTIONS = [1, 1, -1, -1] as const;

export function getRadiusStyles(
    poses: number[][], controlPoses: ControlPose[],
    isRelative: boolean,
    width: number,
    height: number,
    left: number = 0,
    top: number = 0,
    right: number = width,
    bottom: number = height,
) {
    const clipStyles: string[] = [];
    let isVertical = false;

    const raws = poses.map((pos, i) => {
        const { horizontal, vertical } = controlPoses[i];
        if (vertical && !isVertical) {
            isVertical = true;
            clipStyles.push("/");
        }

        if (isVertical) {
            const rawPos = Math.max(0, vertical === 1 ? pos[1] - top : bottom - pos[1]);
            clipStyles.push(convertCSSSize(rawPos, height, isRelative));

            return rawPos;
        } else {
            const rawPos = Math.max(0, horizontal === 1 ? pos[0] - left : right - pos[0]);
            clipStyles.push(convertCSSSize(rawPos, width, isRelative));

            return rawPos;
        }
    });

    return {
        styles: clipStyles,
        raws,
    };
}
export function getRadiusRange(controlPoses: ControlPose[]) {
    // [start, length]
    const horizontalRange = [0, 0];
    const verticalRange = [0, 0];
    const length =  controlPoses.length;

    for (let i = 0; i < length; ++i) {
        const clipPose = controlPoses[i];

        if (!clipPose.sub) {
            continue;
        }
        if (clipPose.horizontal) {
            if (horizontalRange[1] === 0) {
                horizontalRange[0] = i;
            }
            horizontalRange[1] = i - horizontalRange[0] + 1;
            verticalRange[0] = i + 1;
        }
        if (clipPose.vertical) {
            if (verticalRange[1] === 0) {
                verticalRange[0] = i;
            }
            verticalRange[1] = i - verticalRange[0] + 1;
        }
    }

    return {
        horizontalRange,
        verticalRange,
    };
}
export function getRadiusValues(
    values: string[],
    width: number,
    height: number,
    left: number,
    top: number,
    minCounts: number[] = [0, 0],
): ControlPose[] {
    const splitIndex = values.indexOf("/");
    const splitLength = (splitIndex > -1 ? values.slice(0, splitIndex) : values).length;
    const horizontalValues = values.slice(0, splitLength);
    const verticalValues = values.slice(splitLength + 1);
    const [
        nwValue = "0px",
        neValue = nwValue,
        seValue = nwValue,
        swValue = neValue,
    ] = horizontalValues;
    const [
        wnValue = nwValue,
        enValue = wnValue,
        esValue = wnValue,
        wsValue = enValue,
    ] = verticalValues;

    const horizontalRawPoses = [nwValue, neValue, seValue, swValue].map(pos => convertUnitSize(pos, width));
    const verticalRawPoses = [wnValue, enValue, esValue, wsValue].map(pos => convertUnitSize(pos, height));
    const horizontalPoses = horizontalRawPoses.slice();
    const verticalPoses = verticalRawPoses.slice();

    [horizontalPoses[0], horizontalPoses[1]] = caculateRatio([horizontalPoses[0], horizontalPoses[1]], width);
    [horizontalPoses[3], horizontalPoses[2]] = caculateRatio([horizontalPoses[3], horizontalPoses[2]], width);
    [verticalPoses[0], verticalPoses[3]] = caculateRatio([verticalPoses[0], verticalPoses[3]], height);
    [verticalPoses[1], verticalPoses[2]] = caculateRatio([verticalPoses[1], verticalPoses[2]], height);

    const nextHorizontalPoses
        = horizontalPoses.slice(0, Math.max(minCounts[0], horizontalValues.length));
    const nextVerticalPoses
        = verticalPoses.slice(0, Math.max(minCounts[1], verticalValues.length));
    return [
        ...nextHorizontalPoses.map((pos, i) => {
            const direction = RADIUS_DIRECTIONS[i];

            return {
                horizontal: HORIZONTAL_RADIUS_DIRECTIONS[i],
                vertical: 0,
                pos: [left + pos, top + (VERTICAL_RADIUS_DIRECTIONS[i] === -1 ? height : 0)],
                sub: true,
                raw: horizontalRawPoses[i],
                direction,
            };
        }),
        ...nextVerticalPoses.map((pos, i) => {
            const direction = RADIUS_DIRECTIONS[i];

            return {
                horizontal: 0,
                vertical: VERTICAL_RADIUS_DIRECTIONS[i],
                pos: [left + (HORIZONTAL_RADIUS_DIRECTIONS[i] === -1 ? width : 0), top + pos],
                sub: true,
                raw: verticalRawPoses[i],
                direction,
            };
        }),
    ];
}
export function removeRadiusPos(
    controlPoses: ControlPose[],
    poses: number[][],
    index: number,
    startIndex: number,
    length: number = poses.length,
) {
    const {
        horizontalRange,
        verticalRange,
    } = getRadiusRange(controlPoses.slice(startIndex));
    const radiuslIndex = index - startIndex;
    let deleteCount = 0;

    if (radiuslIndex === 0) {
        deleteCount = length;
    } else if (radiuslIndex > 0 && radiuslIndex < horizontalRange[1]) {
        deleteCount = horizontalRange[1] - radiuslIndex;
    } else if (radiuslIndex >= verticalRange[0]) {
        deleteCount = verticalRange[0] + verticalRange[1] - radiuslIndex;
    } else {
        return;
    }
    controlPoses.splice(index, deleteCount);
    poses.splice(index, deleteCount);
}
export function addRadiusPos(
    controlPoses: ControlPose[],
    poses: number[][],
    startIndex: number,
    horizontalIndex: number,
    verticalIndex: number,
    distX: number,
    distY: number,
    right: number,
    bottom: number,
    left: number = 0,
    top: number = 0,
) {
    const {
        horizontalRange,
        verticalRange,
    } = getRadiusRange(controlPoses.slice(startIndex));
    if (horizontalIndex > -1) {
        const radiusX = HORIZONTAL_RADIUS_DIRECTIONS[horizontalIndex] === 1
            ? distX - left
            : right - distX;
        for (let i = horizontalRange[1]; i <= horizontalIndex; ++i) {
            const y = VERTICAL_RADIUS_DIRECTIONS[i] === 1 ? top : bottom;
            let x = 0;
            if (horizontalIndex === i) {
                x = distX;
            } else if (i === 0) {
                x = left + radiusX;
            } else if (HORIZONTAL_RADIUS_DIRECTIONS[i] === -1) {
                x = right - (poses[startIndex][0] - left);
            }
            controlPoses.splice(startIndex + i, 0, {
                horizontal: HORIZONTAL_RADIUS_DIRECTIONS[i],
                vertical: 0,
                pos: [x, y],
            });
            poses.splice(startIndex + i, 0, [x, y]);

            if (i === 0) {
                break;
            }
        }
    } else if (verticalIndex > - 1) {
        const radiusY = VERTICAL_RADIUS_DIRECTIONS[verticalIndex] === 1
            ? distY - top
            : bottom - distY;
        if (horizontalRange[1] === 0 && verticalRange[1] === 0) {
            const pos = [
                left + radiusY,
                top,
            ];
            controlPoses.push({
                horizontal: HORIZONTAL_RADIUS_DIRECTIONS[0],
                vertical: 0,
                pos,
            });
            poses.push(pos);
        }

        const startVerticalIndex = verticalRange[0];
        for (let i = verticalRange[1]; i <= verticalIndex; ++i) {
            const x = HORIZONTAL_RADIUS_DIRECTIONS[i] === 1 ? left : right;
            let y = 0;
            if (verticalIndex === i) {
                y = distY;
            } else if (i === 0) {
                y = top + radiusY;
            } else if (VERTICAL_RADIUS_DIRECTIONS[i] === 1) {
                y = poses[startIndex + startVerticalIndex][1];
            } else if (VERTICAL_RADIUS_DIRECTIONS[i] === -1) {
                y = bottom - (poses[startIndex + startVerticalIndex][1] - top);
            }
            controlPoses.push({
                horizontal: 0,
                vertical: VERTICAL_RADIUS_DIRECTIONS[i],
                pos: [x, y],
            });
            poses.push([x, y]);
            if (i === 0) {
                break;
            }
        }
    }
}
export function splitRadiusPoses(
    controlPoses: ControlPose[],
    raws: number[] = controlPoses.map(pos => pos.raw!),
) {
    const horizontals = controlPoses
    .map((pos , i) => pos.horizontal ? raws[i] : null).filter(pos => pos != null) as number[];
    const verticals = controlPoses
        .map((pos , i) => pos.vertical ? raws[i] : null).filter(pos => pos != null) as number[];

    return {
        horizontals,
        verticals,
    };
}
