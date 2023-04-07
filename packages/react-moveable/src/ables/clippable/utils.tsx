import { splitBracket, splitComma, convertUnitSize, splitSpace, splitUnit } from "@daybrush/utils";
import { minus } from "@scena/matrix";
import { convertCSSSize } from "../../utils";
import { getRadiusStyles, getRadiusValues } from "../roundable/borderRadius";
import { MoveableManagerInterface, ClippableProps, ControlPose } from "../../types";
import { getMinMaxs } from "overlap-area";
import { getCachedStyle } from "../../store/Store";


export const CLIP_DIRECTIONS = [
    [0, -1, "n"],
    [1, 0, "e"],
] as const;

export const CLIP_RECT_DIRECTIONS = [
    [-1, -1, "nw"],
    [0, -1, "n"],
    [1, -1, "ne"],
    [1, 0, "e"],
    [1, 1, "se"],
    [0, 1, "s"],
    [-1, 1, "sw"],
    [-1, 0, "w"],
] as const;

// 1 2 5 6 0 3 4 7
// 0 1 2 3 4 5 6 7

export function getClipStyles(
    moveable: MoveableManagerInterface<ClippableProps>,
    clipPath: ReturnType<typeof getClipPath>,
    poses: number[][],
) {
    const {
        clipRelative,
    } = moveable.props;
    const {
        width,
        height,
    } = moveable.state;
    const {
        type: clipType,
        poses: clipPoses,
    } = clipPath!;

    const isRect = clipType === "rect";
    const isCircle = clipType === "circle";
    if (clipType === "polygon") {
        return poses.map(pos => `${convertCSSSize(pos[0], width, clipRelative)} ${convertCSSSize(pos[1], height, clipRelative)}`);
    } else if (isRect || clipType === "inset") {
        const top = poses[1][1];
        const right = poses[3][0];
        const left = poses[7][0];
        const bottom = poses[5][1];

        if (isRect) {
            return [
                top,
                right,
                bottom,
                left,
            ].map(pos => `${pos}px`);
        }
        const clipStyles
            = [top, width - right, height - bottom, left]
                .map((pos, i) => convertCSSSize(pos, i % 2 ? width : height, clipRelative));

        if (poses.length > 8) {
            const [subWidth, subHeight] = minus(poses[4], poses[0]);

            clipStyles.push("round", ...getRadiusStyles(
                clipPoses.slice(8).map((info, i) => {
                    return {
                        ...info,
                        pos: poses[i],
                    };
                }),
                clipRelative!,
                subWidth,
                subHeight,
                left, top, right, bottom,
            ).styles);
        }
        return clipStyles;
    } else if (isCircle || clipType === "ellipse") {
        const center = poses[0];
        const ry = convertCSSSize(
            Math.abs(poses[1][1] - center[1]),
            isCircle ? Math.sqrt((width * width + height * height) / 2) : height,
            clipRelative,
        );

        const clipStyles = isCircle ? [ry]
            : [convertCSSSize(Math.abs(poses[2][0] - center[0]), width, clipRelative), ry];

        clipStyles.push(
            "at", convertCSSSize(center[0], width, clipRelative),
            convertCSSSize(center[1], height, clipRelative));

        return clipStyles;
    }
}

export function getRectPoses(top: number, right: number, bottom: number, left: number): ControlPose[] {
    const xs = [left, (left + right) / 2, right];
    const ys = [top, (top + bottom) / 2, bottom];

    return CLIP_RECT_DIRECTIONS.map(([dirx, diry, dir]) => {
        const x = xs[dirx + 1];
        const y = ys[diry + 1];
        return {
            vertical: Math.abs(diry),
            horizontal: Math.abs(dirx),
            direction: dir,
            pos: [x, y],
        };
    });
}

export function getControlSize(
    controlPoses: ControlPose[],
) {
    const xRange = [Infinity, -Infinity];
    const yRange = [Infinity, -Infinity];

    controlPoses.forEach(({ pos }) => {
        xRange[0] = Math.min(xRange[0], pos[0]);
        xRange[1] = Math.max(xRange[1], pos[0]);
        yRange[0] = Math.min(yRange[0], pos[1]);
        yRange[1] = Math.max(yRange[1], pos[1]);
    });

    return [
        Math.abs(xRange[1] - xRange[0]),
        Math.abs(yRange[1] - yRange[0]),
    ];
}


export function getClipPath(
    target: HTMLElement | SVGElement | undefined | null,
    width: number,
    height: number,
    defaultClip?: string,
    customClip?: string,
) {
    if (!target) {
        return;
    }
    let clipText: string | undefined = customClip;

    if (!clipText) {
        const getStyle = getCachedStyle(target!);
        const clipPath = getStyle("clipPath");

        clipText = clipPath !== "none" ? clipPath : getStyle("clip");
    }
    if (!clipText || clipText === "none" || clipText === "auto") {
        clipText = defaultClip;

        if (!clipText) {
            return;
        }
    }
    const {
        prefix: clipPrefix = clipText,
        value = "",
    } = splitBracket(clipText);
    const isCircle = clipPrefix === "circle";
    let splitter = " ";

    if (clipPrefix === "polygon") {
        const values = splitComma(value! || `0% 0%, 100% 0%, 100% 100%, 0% 100%`);
        splitter = ",";

        const poses: ControlPose[] = values.map(pos => {
            const [xPos, yPos] = pos.split(" ");

            return {
                vertical: 1,
                horizontal: 1,
                pos: [
                    convertUnitSize(xPos, width),
                    convertUnitSize(yPos, height),
                ],
            };
        });
        const minMaxs = getMinMaxs(poses.map(pos => pos.pos));

        return {
            type: clipPrefix,
            clipText,
            poses,
            splitter,
            left: minMaxs.minX,
            right: minMaxs.maxX,
            top: minMaxs.minY,
            bottom: minMaxs.maxY,
        } as const;
    } else if (isCircle || clipPrefix === "ellipse") {
        let xPos = "";
        let yPos = "";
        let radiusX = 0;
        let radiusY = 0;
        const values = splitSpace(value!);

        if (isCircle) {
            let radius = "";
            [radius = "50%", , xPos = "50%", yPos = "50%"] = values;

            radiusX = convertUnitSize(radius, Math.sqrt((width * width + height * height) / 2));
            radiusY = radiusX;
        } else {
            let xRadius = "";
            let yRadius = "";
            [xRadius = "50%", yRadius = "50%", , xPos = "50%", yPos = "50%"] = values;

            radiusX = convertUnitSize(xRadius, width);
            radiusY = convertUnitSize(yRadius, height);
        }
        const centerPos = [
            convertUnitSize(xPos, width),
            convertUnitSize(yPos, height),
        ];
        const poses: ControlPose[] = [
            {
                vertical: 1,
                horizontal: 1,
                pos: centerPos,
                direction: "nesw",
            },
            ...CLIP_DIRECTIONS.slice(0, isCircle ? 1 : 2).map(dir => ({
                vertical: Math.abs(dir[1]),
                horizontal: dir[0],
                direction: dir[2],
                sub: true,
                pos: [
                    centerPos[0] + dir[0] * radiusX,
                    centerPos[1] + dir[1] * radiusY,
                ],
            })),
        ];
        return {
            type: clipPrefix as "circle" | "ellipse",
            clipText,
            radiusX,
            radiusY,
            left: centerPos[0] - radiusX,
            top: centerPos[1] - radiusY,
            right: centerPos[0] + radiusX,
            bottom: centerPos[1] + radiusY,
            poses,
            splitter,
        } as const;
    } else if (clipPrefix === "inset") {
        const values = splitSpace(value! || "0 0 0 0");
        const roundIndex = values.indexOf("round");

        const rectLength = (roundIndex > -1 ? values.slice(0, roundIndex) : values).length;
        const radiusValues = values.slice(rectLength + 1);
        const [
            topValue,
            rightValue = topValue,
            bottomValue = topValue,
            leftValue = rightValue,
        ] = values.slice(0, rectLength);
        const [top, bottom] = [topValue, bottomValue].map(pos => convertUnitSize(pos, height));
        const [left, right] = [leftValue, rightValue].map(pos => convertUnitSize(pos, width));
        const nextRight = width - right;
        const nextBottom = height - bottom;
        const radiusPoses = getRadiusValues(
            radiusValues,
            nextRight - left,
            nextBottom - top,
            left,
            top,
        );
        const poses: ControlPose[] = [
            ...getRectPoses(top, nextRight, nextBottom, left),
            ...radiusPoses,
        ];

        return {
            type: "inset",
            clipText,
            poses,
            top,
            left,
            right: nextRight,
            bottom: nextBottom,
            radius: radiusValues,
            splitter,
        } as const;
    } else if (clipPrefix === "rect") {
        // top right bottom left
        const values = splitComma(value! || `0px, ${width}px, ${height}px, 0px`);

        splitter = ",";
        const [top, right, bottom, left] = values.map(pos => {
            const { value: posValue } = splitUnit(pos);

            return posValue;
        });
        const poses = getRectPoses(top, right, bottom, left);

        return {
            type: "rect",
            clipText,
            poses,
            top,
            right,
            bottom,
            left,
            values,
            splitter,
        } as const;
    }
    return;
}
