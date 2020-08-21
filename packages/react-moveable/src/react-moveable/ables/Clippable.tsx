import {
    Renderer, ClippableProps, OnClip,
    ClippableState, OnClipEnd, OnClipStart,
    ControlPose, MoveableManagerInterface
} from "../types";
import { splitBracket, splitComma, splitUnit, splitSpace, convertUnitSize } from "@daybrush/utils";
import {
    prefix, caculatePosition, getDiagonalSize,
    fillParams, triggerEvent,
    makeMatrixCSS, getRect, fillEndParams,
    convertCSSSize, moveControlPos
} from "../utils";
import { getRad, plus, minus } from "../matrix";
import { setDragStart, getDragDist, caculatePointerDist } from "../DraggerUtils";
import {
    getRadiusValues,
    HORIZONTAL_RADIUS_ORDER, VERTICAL_RADIUS_ORDER, getRadiusStyles, addRadiusPos, removeRadiusPos
} from "./roundable/borderRadius";

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
        return poses.map(pos => `${
            convertCSSSize(pos[0], width, clipRelative)
            } ${
            convertCSSSize(pos[1], height, clipRelative)
            }`);
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
        let xPos: string = "";
        let yPos: string = "";
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
        const [top, right, bottom, left] = values.map((pos, i) => {
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
    const [distX, distY] = caculatePointerDist(moveable, e);
    const { clipPath, index } = e.datas;
    const {
        type: clipType,
        poses: clipPoses,
        splitter,
    } = (clipPath as ReturnType<typeof getClipPath>)!;
    const poses = clipPoses.map(pos => pos.pos);
    if (clipType === "polygon") {
        poses.splice(index, 0, [distX, distY]);
    } else if (clipType === "inset") {
        const horizontalIndex = HORIZONTAL_RADIUS_ORDER.indexOf(index);
        const verticalIndex = VERTICAL_RADIUS_ORDER.indexOf(index);
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
    const { clipPath, index } = e.datas;
    const {
        type: clipType,
        poses: clipPoses,
        splitter,
    } = (clipPath as ReturnType<typeof getClipPath>)!;
    const poses = clipPoses.map(pos => pos.pos);
    const length = poses.length;
    if (clipType === "polygon") {
        clipPoses.splice(index, 1);
        poses.splice(index, 1);
    } else if (clipType === "inset") {
        if (index < 8) {
            return;
        }
        removeRadiusPos(clipPoses, poses, index, 8, length);

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
        clipRelative: Boolean,
        clipArea: Boolean,
        dragWithClip: Boolean,
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
    ],
    render(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, React: Renderer): any[] {
        const {
            customClipPath, defaultClipPath,
            clipArea, zoom,
        } = moveable.props;
        const {
            target, width, height, matrix, is3d, left, top,
            pos1, pos2, pos3, pos4,
            clipPathState,
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
            const caculatedPos = caculatePosition(matrix, pos.pos, n);

            return [
                caculatedPos[0] - left,
                caculatedPos[1] - top,
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
                return <div key={`clipLine${i}`} className={prefix("line", "clip-line")}
                    data-clip-index={i}
                    style={{
                        width: `${dist}px`,
                        transform: `translate(${from[0]}px, ${from[1]}px) rotate(${rad}rad)`,
                    }}></div>;
            });
        }
        controls = poses.map((pos, i) => {
            return <div key={`clipControl${i}`}
                className={prefix("control", "clip-control")}
                data-clip-index={i}
                style={{
                    transform: `translate(${pos[0]}px, ${pos[1]}px)`,
                }}></div>;
        });

        if (isInset) {
            controls.push(...poses.slice(8).map((pos, i) => {
                return <div key={`clipRadiusControl${i}`}
                    className={prefix("control", "clip-control", "clip-radius")}
                    data-clip-index={8 + i}
                    style={{
                        transform: `translate(${pos[0]}px, ${pos[1]}px)`,
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
                caculatePosition(matrix, [clipLeft!, clipTop!], n),
                caculatePosition(matrix, [0, 0], n),
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
            controls.push(<div key="clipEllipse" className={prefix("clip-ellipse")} style={{
                width: `${radiusX! * 2}px`,
                height: `${radiusY! * 2}px`,
                clipPath: ellipseClipPath,
                transform: `translate(${-left + distLeft}px, ${-top + distTop}px) ${makeMatrixCSS(matrix)}`,
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
                controls.push(<div key="clipArea" className={prefix("clip-area")} style={{
                    width: `${allWidth}px`,
                    height: `${allHeight}px`,
                    transform: `translate(${allLeft}px, ${allTop}px)`,
                    clipPath: `polygon(${
                        areaPoses.map(pos => `${pos[0] - allLeft}px ${pos[1] - allTop}px`).join(", ")
                        })`,
                }}></div>);
            }
        }
        return [
            ...controls,
            ...lines,
        ];
    },
    dragControlCondition(e: any) {
        return e.inputEvent && (e.inputEvent.target.className || "").indexOf("clip") > -1;
    },
    dragStart(moveable: MoveableManagerInterface<ClippableProps>, e: any) {
        const props = moveable.props;
        const {
            dragWithClip = true,
        } = props;

        if (dragWithClip) {
            return false;
        }

        return this.dragControlStart(moveable, e);
    },
    drag(moveable: MoveableManagerInterface<ClippableProps>, e: any) {
        return this.dragControl(moveable, e);
    },
    dragEnd(moveable: MoveableManagerInterface<ClippableProps>, e: any) {
        return this.dragControlEnd(moveable, e);
    },
    dragControlStart(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any) {
        const state = moveable.state;
        const { defaultClipPath, customClipPath } = moveable.props;
        const { target, width, height } = state;
        const inputTarget = e.inputEvent ? e.inputEvent.target : null;
        const className = inputTarget ? inputTarget.className : "";
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
        datas.isControl = className.indexOf("clip-control") > -1;
        datas.isLine = className.indexOf("clip-line") > -1;
        datas.isArea = className.indexOf("clip-area") > -1 || className.indexOf("clip-ellipse") > -1;
        datas.index = inputTarget ? parseInt(inputTarget.getAttribute("data-clip-index"), 10) : -1;
        datas.clipPath = clipPath;
        datas.isClipStart = true;
        state.clipPathState = clipText;
        setDragStart(moveable, e);

        return true;
    },
    dragControl(moveable: MoveableManagerInterface<ClippableProps, ClippableState>, e: any) {
        const { datas, originalDatas } = e;

        if (!datas.isClipStart) {
            return false;
        }
        const draggableData = (originalDatas && originalDatas.draggable) || {};
        const { isControl, isLine, isArea, index, clipPath } = datas as {
            clipPath: ReturnType<typeof getClipPath>,
            [key: string]: any,
        };
        if (!clipPath) {
            return false;
        }
        let [distX, distY] = draggableData.isDrag ? draggableData.prevDist : getDragDist(e);
        const state = moveable.state;
        const isDragWithTarget = !isArea && !isControl && !isLine;
        const {
            type: clipType,
            poses: clipPoses,
            splitter,
        } = clipPath;
        const poses = clipPoses.map(pos => pos.pos);
        const nextPoses: number[][] = poses.map(pos => pos.slice());

        if (isDragWithTarget) {
            distX = -distX;
            distY = -distY;
        }
        const isAll = !isControl || clipPoses[index].direction === "nesw";

        if (isControl && !isAll) {
            moveControlPos(clipPoses, nextPoses, index, distX, distY);
        }
        if (isAll) {
            poses.forEach((pos, i) => {
                nextPoses[i] = plus(pos, [distX, distY]);
            });
        }
        // const indexes: number[] = [];
        // const clipStyles = getClipStyles(clipPath, width, height, clipPoses.map(pos => pos.pos))!;
        const nextClipStyles = getClipStyles(moveable, clipPath, nextPoses)!;
        const clipStyle = `${clipType}(${nextClipStyles.join(splitter)})`;

        state.clipPathState = clipStyle;
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
        moveable.state.clipPathState = "";
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
 * You can drag the clip by setting clipArea. (default: false)
 * @name Moveable.Clippable#clipArea
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
