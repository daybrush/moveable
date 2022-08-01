import {
    Renderer, ClippableProps, OnClip,
    ClippableState, OnClipEnd, OnClipStart,
    ControlPose, MoveableManagerInterface, DraggableProps,
} from "../types";
import { splitBracket, splitComma, splitUnit, splitSpace, convertUnitSize, getRad } from "@daybrush/utils";
import {
    prefix, calculatePosition, getDiagonalSize,
    fillParams, triggerEvent,
    makeMatrixCSS, getRect, fillEndParams,
    convertCSSSize,
    getComputedStyle,
    getSizeDistByDist,
    getProps,
} from "../utils";
import { plus, minus, multiply } from "@scena/matrix";
import { getDragDist, calculatePointerDist, setDragStart } from "../gesto/GestoUtils";
import {
    getRadiusValues,
    HORIZONTAL_RADIUS_ORDER, VERTICAL_RADIUS_ORDER, getRadiusStyles, addRadiusPos, removeRadiusPos,
} from "./roundable/borderRadius";
import { renderLine } from "../renderDirections";
import { checkSnapBoundPriority } from "./snappable/snap";
import { checkSnapBounds } from "./snappable/snapBounds";
import { getDefaultGuidelines } from "./snappable/getTotalGuidelines";


const CLIP_DIRECTIONS = [
    [0, -1, "n"],
    [1, 0, "e"],
] as const;
const CLIP_RECT_DIRECTIONS = [
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

function getClipStyles(
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
                poses.slice(8),
                clipPoses.slice(8),
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

function getRectPoses(top: number, right: number, bottom: number, left: number): ControlPose[] {
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

export function moveControlPos(
    controlPoses: ControlPose[],
    index: number,
    dist: number[],
    isRect?: boolean,
    keepRatio?: boolean,
) {
    const { direction, sub } = controlPoses[index];
    const dists = controlPoses.map(() => [0, 0]);
    const directions = direction ? direction.split("") : [];

    if (isRect && index < 8) {
        const verticalDirections = directions.filter(dir => dir === "w" || dir === "e");
        const horizontalDirections = directions.filter(dir => dir === "n" || dir === "s");

        const verticalDirection = verticalDirections[0];
        const horizontalDirection = horizontalDirections[0];

        dists[index] = dist;
        const [width, height] = getControlSize(controlPoses);
        const ratio = width && height ? width / height : 0;

        if (ratio && keepRatio) {
            // 0 1 2
            // 7   3
            // 6 5 4

            const fixedIndex = (index + 4) % 8;
            const fixedPosition = controlPoses[fixedIndex].pos;
            const sizeDirection = [0, 0];

            if (direction!.indexOf("w") > -1) {
                sizeDirection[0] = -1;
            } else if (direction!.indexOf("e") > -1) {
                sizeDirection[0] = 1;
            }
            if (direction!.indexOf("n") > -1) {
                sizeDirection[1] = -1;
            } else if (direction!.indexOf("s") > -1) {
                sizeDirection[1] = 1;
            }


            const nextDist = getSizeDistByDist(
                [width, height],
                dist,
                ratio,
                sizeDirection,
                true,
            );
            const nextWidth = width + nextDist[0];
            const nextHeight = height + nextDist[1];
            let top = fixedPosition[1];
            let bottom = fixedPosition[1];
            let left = fixedPosition[0];
            let right = fixedPosition[0];

            if (sizeDirection[0] === -1) {
                left = right - nextWidth;
            } else if (sizeDirection[0] === 1) {
                right = left + nextWidth;
            } else {
                left = left - nextWidth / 2;
                right = right + nextWidth / 2;
            }
            if (sizeDirection[1] === -1) {
                top = bottom - nextHeight;
            } else if (sizeDirection[1] === 1) {
                bottom = top + nextHeight;
            } else {
                top = bottom - nextHeight / 2;
                bottom = top + nextHeight;
            }

            const nextControlPoses = getRectPoses(top, right, bottom, left);

            controlPoses.forEach((controlPose, i) => {
                dists[i][0] = nextControlPoses[i].pos[0] - controlPose.pos[0];
                dists[i][1] = nextControlPoses[i].pos[1] - controlPose.pos[1];
            });
        } else {
            controlPoses.forEach((controlPose, i) => {
                const {
                    direction: controlDir,
                } = controlPose;

                if (!controlDir) {
                    return;
                }
                if (controlDir.indexOf(verticalDirection) > -1) {
                    dists[i][0] = dist[0];
                }
                if (controlDir.indexOf(horizontalDirection) > -1) {
                    dists[i][1] = dist[1];
                }
            });
            if (verticalDirection) {
                dists[1][0] = dist[0] / 2;
                dists[5][0] = dist[0] / 2;
            }
            if (horizontalDirection) {
                dists[3][1] = dist[1] / 2;
                dists[7][1] = dist[1] / 2;
            }
        }
    } else if (direction && !sub) {
        directions.forEach(dir => {
            const isVertical = dir === "n" || dir === "s";

            controlPoses.forEach((controlPose, i) => {
                const {
                    direction: dirDir,
                    horizontal: dirHorizontal,
                    vertical: dirVertical,
                } = controlPose;

                if (!dirDir || dirDir.indexOf(dir) === -1) {
                    return;
                }
                dists[i] = [
                    isVertical || !dirHorizontal ? 0 : dist[0],
                    !isVertical || !dirVertical ? 0 : dist[1],
                ];
            });
        });
    } else {
        dists[index] = dist;
    }

    return dists;
}
function getClipPath(
    target: HTMLElement | SVGElement,
    width: number,
    height: number,
    defaultClip?: string,
    customClip?: string,
) {
    let clipText: string | undefined = customClip;

    if (!clipText) {
        const style = getComputedStyle(target!);
        const clipPath = style.clipPath!;

        clipText = clipPath !== "none" ? clipPath : style.clip!;
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

        return {
            type: clipPrefix,
            clipText,
            poses,
            splitter,
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
function addClipPath(moveable: MoveableManagerInterface<ClippableProps>, e: any) {
    const [distX, distY] = calculatePointerDist(moveable, e);
    const { clipPath, clipIndex } = e.datas;
    const {
        type: clipType,
        poses: clipPoses,
        splitter,
    } = (clipPath as ReturnType<typeof getClipPath>)!;
    const poses = clipPoses.map(pos => pos.pos);
    if (clipType === "polygon") {
        poses.splice(clipIndex, 0, [distX, distY]);
    } else if (clipType === "inset") {
        const horizontalIndex = HORIZONTAL_RADIUS_ORDER.indexOf(clipIndex);
        const verticalIndex = VERTICAL_RADIUS_ORDER.indexOf(clipIndex);
        const length = clipPoses.length;

        addRadiusPos(
            clipPoses,
            poses,
            8,
            horizontalIndex,
            verticalIndex,
            distX,
            distY,
            poses[4][0],
            poses[4][1],
            poses[0][0],
            poses[0][1],
        );

        if (length === clipPoses.length) {
            return;
        }
    } else {
        return;
    }
    const clipStyles = getClipStyles(moveable, clipPath, poses)!;
    triggerEvent(moveable, "onClip", fillParams<OnClip>(moveable, e, {
        clipEventType: "added",
        clipType,
        poses,
        clipStyles,
        clipStyle: `${clipType}(${clipStyles.join(splitter)})`,
        distX: 0,
        distY: 0,
    }));
}
function removeClipPath(moveable: MoveableManagerInterface<ClippableProps>, e: any) {
    const { clipPath, clipIndex } = e.datas;
    const {
        type: clipType,
        poses: clipPoses,
        splitter,
    } = (clipPath as ReturnType<typeof getClipPath>)!;
    const poses = clipPoses.map(pos => pos.pos);
    const length = poses.length;
    if (clipType === "polygon") {
        clipPoses.splice(clipIndex, 1);
        poses.splice(clipIndex, 1);
    } else if (clipType === "inset") {
        if (clipIndex < 8) {
            return;
        }
        removeRadiusPos(clipPoses, poses, clipIndex, 8, length);

        if (length === clipPoses.length) {
            return;
        }
    } else {
        return;
    }
    const clipStyles = getClipStyles(moveable, clipPath, poses)!;
    triggerEvent(moveable, "onClip", fillParams<OnClip>(moveable, e, {
        clipEventType: "removed",
        clipType,
        poses,
        clipStyles,
        clipStyle: `${clipType}(${clipStyles.join(splitter)})`,
        distX: 0,
        distY: 0,
    }));
}
/**
 * @namespace Moveable.Clippable
 * @description Whether to clip the target.
 */

export default {
    name: "clippable",
    props: {
        clippable: Boolean,
        defaultClipPath: String,
        customClipPath: String,
        keepRatio: Boolean,
        clipRelative: Boolean,
        clipArea: Boolean,
        dragWithClip: Boolean,
        clipTargetBounds: Boolean,
        clipVerticalGuidelines: Array,
        clipHorizontalGuidelines: Array,
        clipSnapThreshold: Boolean,
    } as const,
    events: {
        onClipStart: "clipStart",
        onClip: "clip",
        onClipEnd: "clipEnd",
    } as const,
    css: [
        `.control.clip-control {
    background: #6d6;
    cursor: pointer;
}
.control.clip-control.clip-radius {
    background: #d66;
}
.line.clip-line {
    background: #6e6;
    cursor: move;
    z-index: 1;
}
.clip-area {
    position: absolute;
    top: 0;
    left: 0;
}
.clip-ellipse {
    position: absolute;
    cursor: move;
    border: 1px solid #6d6;
    border: var(--zoompx) solid #6d6;
    border-radius: 50%;
    transform-origin: 0px 0px;
}`,
        `:host {
    --bounds-color: #d66;
}`,
        `.guideline {
    pointer-events: none;
    z-index: 2;
}`,
        `.line.guideline.bounds {
    background: #d66;
    background: var(--bounds-color);
}`,
    ],
    render(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, React: Renderer): any[] {
        const {
            customClipPath,
            defaultClipPath,
            clipArea, zoom,
        } = moveable.props;
        const {
            target, width, height, allMatrix, is3d, left, top,
            pos1, pos2, pos3, pos4,
            clipPathState,
            snapBoundInfos,
            rotation: rotationRad,
        } = moveable.state;

        if (!target) {
            return [];
        }

        const clipPath = getClipPath(
            target, width, height, defaultClipPath || "inset", clipPathState || customClipPath);

        if (!clipPath) {
            return [];
        }
        const n = is3d ? 4 : 3;
        const type = clipPath.type;
        const clipPoses = clipPath.poses;
        const poses = clipPoses.map(pos => {
            // return [x, y];
            const calculatedPos = calculatePosition(allMatrix, pos.pos, n);

            return [
                calculatedPos[0] - left,
                calculatedPos[1] - top,
            ];
        });

        let controls: any[] = [];
        let lines: any[] = [];

        const isRect = type === "rect";
        const isInset = type === "inset";
        const isPolygon = type === "polygon";

        if (isRect || isInset || isPolygon) {
            const linePoses = isInset ? poses.slice(0, 8) : poses;

            lines = linePoses.map((to, i) => {
                const from = i === 0 ? linePoses[linePoses.length - 1] : linePoses[i - 1];

                const rad = getRad(from, to);
                const dist = getDiagonalSize(from, to);
                return <div key={`clipLine${i}`} className={prefix("line", "clip-line", "snap-control")}
                    data-clip-index={i}
                    style={{
                        width: `${dist}px`,
                        transform: `translate(${from[0]}px, ${from[1]}px) rotate(${rad}rad) scaleY(${zoom})`,
                    }}></div>;
            });
        }
        controls = poses.map((pos, i) => {
            return <div key={`clipControl${i}`}
                className={prefix("control", "clip-control", "snap-control")}
                data-clip-index={i}
                style={{
                    transform: `translate(${pos[0]}px, ${pos[1]}px) rotate(${rotationRad}rad) scale(${zoom})`,
                }}></div>;
        });

        if (isInset) {
            controls.push(...poses.slice(8).map((pos, i) => {
                return <div key={`clipRadiusControl${i}`}
                    className={prefix("control", "clip-control", "clip-radius", "snap-control")}
                    data-clip-index={8 + i}
                    style={{
                        transform: `translate(${pos[0]}px, ${pos[1]}px) rotate(${rotationRad}rad) scale(${zoom})`,
                    }}></div>;
            }));
        }
        if (type === "circle" || type === "ellipse") {
            const {
                left: clipLeft,
                top: clipTop,
                radiusX,
                radiusY,
            } = clipPath;

            const [distLeft, distTop] = minus(
                calculatePosition(allMatrix, [clipLeft!, clipTop!], n),
                calculatePosition(allMatrix, [0, 0], n),
            );
            let ellipseClipPath = "none";

            if (!clipArea) {
                const piece = Math.max(10, radiusX! / 5, radiusY! / 5);
                const areaPoses: number[][] = [];

                for (let i = 0; i <= piece; ++i) {
                    const rad = Math.PI * 2 / piece * i;
                    areaPoses.push([
                        radiusX! + (radiusX! - zoom!) * Math.cos(rad),
                        radiusY! + (radiusY! - zoom!) * Math.sin(rad),
                    ]);
                }
                areaPoses.push([radiusX!, -2]);
                areaPoses.push([-2, -2]);
                areaPoses.push([-2, radiusY! * 2 + 2]);
                areaPoses.push([radiusX! * 2 + 2, radiusY! * 2 + 2]);
                areaPoses.push([radiusX! * 2 + 2, -2]);
                areaPoses.push([radiusX!, -2]);

                ellipseClipPath = `polygon(${areaPoses.map(pos => `${pos[0]}px ${pos[1]}px`).join(", ")})`;
            }
            controls.push(<div key="clipEllipse" className={prefix("clip-ellipse", "snap-control")} style={{
                width: `${radiusX! * 2}px`,
                height: `${radiusY! * 2}px`,
                clipPath: ellipseClipPath,
                transform: `translate(${-left + distLeft}px, ${-top + distTop}px) ${makeMatrixCSS(allMatrix)}`,
            }}></div>);
        }
        if (clipArea) {
            const {
                width: allWidth,
                height: allHeight,
                left: allLeft,
                top: allTop,
            } = getRect([pos1, pos2, pos3, pos4, ...poses]);
            if (isPolygon || isRect || isInset) {
                const areaPoses = isInset ? poses.slice(0, 8) : poses;
                controls.push(<div key="clipArea" className={prefix("clip-area", "snap-control")} style={{
                    width: `${allWidth}px`,
                    height: `${allHeight}px`,
                    transform: `translate(${allLeft}px, ${allTop}px)`,
                    clipPath: `polygon(${areaPoses.map(pos => `${pos[0] - allLeft}px ${pos[1] - allTop}px`).join(", ")})`,
                }}></div>);
            }
        }
        if (snapBoundInfos) {
            (["vertical", "horizontal"] as const).forEach(directionType => {
                const info = snapBoundInfos[directionType];
                const isHorizontal = directionType === "horizontal";

                if (info.isSnap) {
                    lines.push(...info.snap.posInfos.map(({ pos }, i) => {
                        const snapPos1 = minus(calculatePosition(
                            allMatrix, isHorizontal ? [0, pos] : [pos, 0], n), [left, top]);
                        const snapPos2 = minus(calculatePosition(
                            allMatrix, isHorizontal ? [width, pos] : [pos, height], n), [left, top]);

                        return renderLine(
                            React, "", snapPos1, snapPos2, zoom!,
                            `clip${directionType}snap${i}`, "guideline");
                    }));
                }
                if (info.isBound) {
                    lines.push(...info.bounds.map(({ pos }, i) => {
                        const snapPos1 = minus(calculatePosition(
                            allMatrix, isHorizontal ? [0, pos] : [pos, 0], n), [left, top]);
                        const snapPos2 = minus(calculatePosition(
                            allMatrix, isHorizontal ? [width, pos] : [pos, height], n), [left, top]);

                        return renderLine(
                            React, "", snapPos1, snapPos2, zoom!,
                            `clip${directionType}bounds${i}`, "guideline", "bounds", "bold");
                    }));
                }
            });
        }
        return [
            ...controls,
            ...lines,
        ];
    },
    dragControlCondition(moveable: any, e: any) {
        return e.inputEvent && (e.inputEvent.target.getAttribute("class") || "").indexOf("clip") > -1;
    },
    dragStart(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any) {
        const props = moveable.props;
        const {
            dragWithClip = true,
        } = props;

        if (dragWithClip) {
            return false;
        }

        return this.dragControlStart(moveable, e);
    },
    drag(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any) {
        return this.dragControl(moveable, {...e, isDragTarget: true });
    },
    dragEnd(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any) {
        return this.dragControlEnd(moveable, e);
    },
    dragControlStart(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any) {
        const state = moveable.state;
        const { defaultClipPath, customClipPath } = moveable.props;
        const { target, width, height } = state;
        const inputTarget = e.inputEvent ? e.inputEvent.target : null;
        const className = (inputTarget && inputTarget.getAttribute("class")) || "";
        const datas = e.datas;
        const clipPath = getClipPath(target!, width, height, defaultClipPath || "inset", customClipPath);

        if (!clipPath) {
            return false;
        }
        const { clipText, type, poses } = clipPath;
        const result = triggerEvent(moveable, "onClipStart", fillParams<OnClipStart>(moveable, e, {
            clipType: type,
            clipStyle: clipText,
            poses: poses.map(pos => pos.pos),
        }));

        if (result === false) {
            datas.isClipStart = false;
            return false;
        }
        datas.isControl = className && className.indexOf("clip-control") > -1;
        datas.isLine = className.indexOf("clip-line") > -1;
        datas.isArea = className.indexOf("clip-area") > -1 || className.indexOf("clip-ellipse") > -1;
        datas.clipIndex = inputTarget ? parseInt(inputTarget.getAttribute("data-clip-index"), 10) : -1;
        datas.clipPath = clipPath;
        datas.isClipStart = true;
        state.clipPathState = clipText;
        setDragStart(moveable, e);

        return true;
    },
    dragControl(moveable: MoveableManagerInterface<ClippableProps & DraggableProps, ClippableState>, e: any) {
        const { datas, originalDatas, isDragTarget } = e;

        if (!datas.isClipStart) {
            return false;
        }
        const { isControl, isLine, isArea, clipIndex, clipPath } = datas as {
            clipPath: ReturnType<typeof getClipPath>,
            [key: string]: any,
        };
        if (!clipPath) {
            return false;
        }
        const props = getProps(moveable.props, "clippable");

        const { keepRatio } = props;
        let distX = 0;
        let distY = 0;

        const originalDraggable = originalDatas.draggable;
        const originalDist = getDragDist(e);

        if (isDragTarget && originalDraggable) {
            [distX, distY] = originalDraggable.prevBeforeDist;
        } else {
            [distX, distY] = originalDist;
        }

        const firstDist = [distX, distY];

        const state = moveable.state;
        const { width, height } = state;
        const isDragWithTarget = !isArea && !isControl && !isLine;
        const {
            type: clipType,
            poses: clipPoses,
            splitter,
        } = clipPath;
        const poses = clipPoses.map(pos => pos.pos);

        if (isDragWithTarget) {
            distX = -distX;
            distY = -distY;
        }
        const isAll = !isControl || clipPoses[clipIndex].direction === "nesw";
        const isRect = clipType === "inset" || clipType === "rect";
        let dists = clipPoses.map(() => [0, 0]);

        if (isControl && !isAll) {
            const { horizontal, vertical } = clipPoses[clipIndex];
            const dist = [
                distX * Math.abs(horizontal),
                distY * Math.abs(vertical),
            ];
            dists = moveControlPos(clipPoses, clipIndex, dist, isRect, keepRatio);
        } else if (isAll) {
            dists = poses.map(() => [distX, distY]);
        }
        const nextPoses: number[][] = poses.map((pos, i) => plus(pos, dists[i]));
        const guidePoses = [...nextPoses];

        state.snapBoundInfos = null;
        const isCircle = clipPath.type === "circle";
        const isEllipse = clipPath.type === "ellipse";

        if (isCircle || isEllipse) {
            const guideRect = getRect(nextPoses);
            const ry = Math.abs(guideRect.bottom - guideRect.top);
            const rx = Math.abs(isEllipse ? guideRect.right - guideRect.left : ry);
            const bottom = nextPoses[0][1] + ry;
            const left = nextPoses[0][0] - rx;
            const right = nextPoses[0][0] + rx;

            // right
            if (isCircle) {
                guidePoses.push([right, guideRect.bottom]);
                dists.push([1, 0]);
            }
            // bottom
            guidePoses.push([guideRect.left, bottom]);
            dists.push([0, 1]);
            // left
            guidePoses.push([left, guideRect.bottom]);
            dists.push([1, 0]);
        }

        const guidelines = getDefaultGuidelines(
            (props.clipHorizontalGuidelines || []).map(v => convertUnitSize(`${v}`, height)),
            (props.clipVerticalGuidelines || []).map(v => convertUnitSize(`${v}`, width)),
            width!, height!,
        );
        let guideXPoses: number[] = [];
        let guideYPoses: number[] = [];

        if (isCircle || isEllipse) {
            guideXPoses = [guidePoses[4][0], guidePoses[2][0]];
            guideYPoses = [guidePoses[1][1], guidePoses[3][1]];
        } else if (isRect) {
            const rectPoses = [guidePoses[0], guidePoses[2], guidePoses[4], guidePoses[6]];
            const rectDists = [dists[0], dists[2], dists[4], dists[6]];

            guideXPoses = rectPoses.filter((_, i) => rectDists[i][0]).map(pos => pos[0]);
            guideYPoses = rectPoses.filter((_, i) => rectDists[i][1]).map(pos => pos[1]);
        } else {
            guideXPoses = guidePoses.filter((_, i) => dists[i][0]).map(pos => pos[0]);
            guideYPoses = guidePoses.filter((_, i) => dists[i][1]).map(pos => pos[1]);
        }
        const boundDelta = [0, 0];
        const {
            horizontal: horizontalSnapInfo,
            vertical: verticalSnapInfo,
        } = checkSnapBounds(
            guidelines,
            props.clipTargetBounds && { left: 0, top: 0, right: width, bottom: height },
            guideXPoses,
            guideYPoses,
            5,
        );
        let snapOffsetY = horizontalSnapInfo.offset;
        let snapOffsetX = verticalSnapInfo.offset;

        if (horizontalSnapInfo.isBound) {
            boundDelta[1] += snapOffsetY;
        }
        if (verticalSnapInfo.isBound) {
            boundDelta[0] += snapOffsetX;
        }
        if ((isEllipse || isCircle) && dists[0][0] === 0 && dists[0][1] === 0) {
            const guideRect = getRect(nextPoses);
            let cy = guideRect.bottom - guideRect.top;
            let cx = isEllipse ? guideRect.right - guideRect.left : cy;


            const distSnapX = verticalSnapInfo.isBound
                ? Math.abs(snapOffsetX)
                : (verticalSnapInfo.snapIndex === 0 ? -snapOffsetX : snapOffsetX);
            const distSnapY = horizontalSnapInfo.isBound
                ? Math.abs(snapOffsetY)
                : (horizontalSnapInfo.snapIndex === 0 ? -snapOffsetY : snapOffsetY);
            cx -= distSnapX;
            cy -= distSnapY;

            if (isCircle) {
                cy = checkSnapBoundPriority(verticalSnapInfo, horizontalSnapInfo) > 0 ? cy : cx;
                cx = cy;
            }
            const center = guidePoses[0];

            guidePoses[1][1] = center[1] - cy;
            guidePoses[2][0] = center[0] + cx;
            guidePoses[3][1] = center[1] + cy;
            guidePoses[4][0] = center[0] - cx;
        } else if (isRect && keepRatio && isControl) {
            const [width, height] = getControlSize(clipPoses);
            const ratio = width && height ? width / height : 0;
            const clipPose = clipPoses[clipIndex];
            const direction = clipPose.direction! || "";
            let top = guidePoses[1][1];
            let bottom = guidePoses[5][1];
            let left = guidePoses[7][0];
            let right = guidePoses[3][0];


            if (snapOffsetY <= snapOffsetX) {
                snapOffsetY = snapOffsetX / ratio;
            } else {
                snapOffsetX = snapOffsetY * ratio;
            }
            if (direction!.indexOf("w") > -1) {
                left -= snapOffsetX;
            } else if (direction!.indexOf("e") > -1) {
                right -= snapOffsetX;
            } else {
                left += snapOffsetX / 2;
                right -= snapOffsetX / 2;
            }
            if (direction!.indexOf("n") > -1) {
                top -= snapOffsetY;
            } else if (direction!.indexOf("s") > -1) {
                bottom -= snapOffsetY;
            } else {
                top += snapOffsetY / 2;
                bottom -= snapOffsetY / 2;
            }

            const nextControlPoses = getRectPoses(top, right, bottom, left);

            guidePoses.forEach((pos, i) => {
                [pos[0], pos[1]] = nextControlPoses[i].pos;
            });
        } else {
            guidePoses.forEach((pos, j) => {
                const dist = dists[j];

                if (dist[0]) {
                    pos[0] -= snapOffsetX;
                }
                if (dist[1]) {
                    pos[1] -= snapOffsetY;
                }
            });
        }
        const nextClipStyles = getClipStyles(moveable, clipPath, nextPoses)!;
        const clipStyle = `${clipType}(${nextClipStyles.join(splitter)})`;

        state.clipPathState = clipStyle;

        if (isCircle || isEllipse) {
            guideXPoses = [guidePoses[4][0], guidePoses[2][0]];
            guideYPoses = [guidePoses[1][1], guidePoses[3][1]];
        } else if (isRect) {
            const rectPoses = [guidePoses[0], guidePoses[2], guidePoses[4], guidePoses[6]];

            guideXPoses = rectPoses.map(pos => pos[0]);
            guideYPoses = rectPoses.map(pos => pos[1]);
        } else {
            guideXPoses = guidePoses.map(pos => pos[0]);
            guideYPoses = guidePoses.map(pos => pos[1]);
        }
        state.snapBoundInfos = checkSnapBounds(
            guidelines,
            props.clipTargetBounds && { left: 0, top: 0, right: width, bottom: height },
            guideXPoses,
            guideYPoses,
            1,
        );

        if (originalDraggable) {
            const {
                is3d,
                allMatrix,
            } = state;
            const n = is3d ? 4 : 3;

            let dragDist = boundDelta;

            if (isDragTarget) {
                dragDist = [
                    firstDist[0] + boundDelta[0] - originalDist[0],
                    firstDist[1] + boundDelta[1] - originalDist[1],
                ];
            }
            originalDraggable.deltaOffset = multiply(allMatrix, [dragDist[0], dragDist[1], 0, 0], n);
        }
        triggerEvent(moveable, "onClip", fillParams<OnClip>(moveable, e, {
            clipEventType: "changed",
            clipType,
            poses: nextPoses,
            clipStyle,
            clipStyles: nextClipStyles,
            distX,
            distY,
        }));

        return true;
    },
    dragControlEnd(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any) {
        this.unset(moveable);
        const { isDrag, datas, isDouble } = e;
        const { isLine, isClipStart, isControl } = datas;

        if (!isClipStart) {
            return false;
        }
        triggerEvent(moveable, "onClipEnd", fillEndParams<OnClipEnd>(moveable, e, {}));
        if (isDouble) {
            if (isControl) {
                removeClipPath(moveable, e);
            } else if (isLine) {
                // add
                addClipPath(moveable, e);
            }
        }
        return isDouble || isDrag;
    },
    unset(moveable: MoveableManagerInterface<ClippableProps, ClippableState>) {
        moveable.state.clipPathState = "";
        moveable.state.snapBoundInfos = null;
    },
};

/**
 * Whether to clip the target. (default: false)
 * @name Moveable.Clippable#clippable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 *  If clippath is not set, the default value can be set. (defaultClipPath < style < customClipPath < dragging clipPath)
 * @name Moveable.Clippable#defaultClipPath
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */

/**
 * % Can be used instead of the absolute px (`rect` not possible) (default: false)
 * @name Moveable.Clippable#clipRelative
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */

/**
 * You can force the custom clipPath. (defaultClipPath < style < customClipPath < dragging clipPath)
 * @name Moveable.Clippable#customClipPath
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */

/**
 * When dragging the target, the clip also moves. (default: true)
 * @name Moveable.Clippable#dragWithClip
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */

/**
 * You can drag the clip by setting clipArea.
 * @name Moveable.Clippable#clipArea
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */

/**
* Whether the clip is bound to the target.
* @name Moveable.Clippable#clipTargetBounds
* @default false
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     clippable: true,
*     defaultClipPath: "inset",
*     customClipPath: "",
*     clipRelative: false,
*     clipArea: false,
*     dragWithClip: true,
*     clipTargetBounds: true,
* });
* moveable.on("clipStart", e => {
*     console.log(e);
* }).on("clip", e => {
*     if (e.clipType === "rect") {
*         e.target.style.clip = e.clipStyle;
*     } else {
*         e.target.style.clipPath = e.clipStyle;
*     }
* }).on("clipEnd", e => {
*     console.log(e);
* });
*/

/**
 * Add clip guidelines in the vertical direction.
 * @name Moveable.Clippable#clipVerticalGuidelines
 * @default 0
 * @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     clippable: true,
*     defaultClipPath: "inset",
*     customClipPath: "",
*     clipRelative: false,
*     clipArea: false,
*     dragWithClip: true,
*     clipVerticalGuidelines: [0, 100, 200],
*     clipHorizontalGuidelines: [0, 100, 200],
*     clipSnapThreshold: 5,
* });
*/

/**
* Add clip guidelines in the horizontal direction.
* @name Moveable.Clippable#clipHorizontalGuidelines
* @default []
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     clippable: true,
*     defaultClipPath: "inset",
*     customClipPath: "",
*     clipRelative: false,
*     clipArea: false,
*     dragWithClip: true,
*     clipVerticalGuidelines: [0, 100, 200],
*     clipHorizontalGuidelines: [0, 100, 200],
*     clipSnapThreshold: 5,
* });
*/
/**
* istance value that can snap to clip guidelines.
* @name Moveable.Clippable#clipSnapThreshold
* @default 5
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     clippable: true,
*     defaultClipPath: "inset",
*     customClipPath: "",
*     clipRelative: false,
*     clipArea: false,
*     dragWithClip: true,
*     clipVerticalGuidelines: [0, 100, 200],
*     clipHorizontalGuidelines: [0, 100, 200],
*     clipSnapThreshold: 5,
* });
*/
/**
 * When drag start the clip area or controls, the `clipStart` event is called.
 * @memberof Moveable.Clippable
 * @event clipStart
 * @param {Moveable.Clippable.OnClipStart} - Parameters for the `clipStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag the clip area or controls, the `clip` event is called.
 * @memberof Moveable.Clippable
 * @event clip
 * @param {Moveable.Clippable.OnClip} - Parameters for the `clip` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag end the clip area or controls, the `clipEnd` event is called.
 * @memberof Moveable.Clippable
 * @event clipEnd
 * @param {Moveable.Clippable.OnClipEnd} - Parameters for the `clipEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     clippable: true,
 *     defaultClipPath: "inset",
 *     customClipPath: "",
 *     clipRelative: false,
 *     clipArea: false,
 *     dragWithClip: true,
 * });
 * moveable.on("clipStart", e => {
 *     console.log(e);
 * }).on("clip", e => {
 *     if (e.clipType === "rect") {
 *         e.target.style.clip = e.clipStyle;
 *     } else {
 *         e.target.style.clipPath = e.clipStyle;
 *     }
 * }).on("clipEnd", e => {
 *     console.log(e);
 * });
 */
