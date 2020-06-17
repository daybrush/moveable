import { getUnitSize } from "../../utils";
import { ClipPose } from "../../types";

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

export function getRadiusRange(clipPoses: ClipPose[]) {
    // [start, length]
    const horizontalRange = [0, 0];
    const verticalRange = [0, 0];
    const length =  clipPoses.length;

    for (let i = 0; i < length; ++i) {
        const clipPose = clipPoses[i];

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
): ClipPose[] {
    const splitIndex = values.indexOf("/");
    const splitLength = (splitIndex > -1 ? values.slice(0, splitIndex) : values).length;
    const horizontalValues = values.slice(0, splitLength);
    const verticalValues = values.slice(splitLength + 1);
    const [
        nwValue = "0",
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

    const horizontalPoses = [nwValue, neValue, seValue, swValue].map(pos => getUnitSize(pos, width));
    const verticalPoses = [wnValue, enValue, esValue, wsValue].map(pos => getUnitSize(pos, height));

    [horizontalPoses[0], horizontalPoses[1]] = caculateRatio([horizontalPoses[0], horizontalPoses[1]], width);
    [horizontalPoses[3], horizontalPoses[2]] = caculateRatio([horizontalPoses[3], horizontalPoses[2]], width);
    [verticalPoses[0], verticalPoses[3]] = caculateRatio([verticalPoses[0], verticalPoses[3]], height);
    [verticalPoses[1], verticalPoses[2]] = caculateRatio([verticalPoses[1], verticalPoses[2]], height);

    const nextHorizontalPoses = horizontalPoses.slice(0, horizontalValues.length);
    const nextVerticalPoses = verticalPoses.slice(0, verticalValues.length);
    return [
        ...nextHorizontalPoses.map((pos, i) => {
            const direction = RADIUS_DIRECTIONS[i];

            return {
                horizontal: HORIZONTAL_RADIUS_DIRECTIONS[i],
                vertical: 0,
                pos: [left + pos, top + (VERTICAL_RADIUS_DIRECTIONS[i] === -1 ? height : 0)],
                sub: true,
                raw: pos,
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
                direction,
            };
        }),
    ];
}
