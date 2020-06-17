import MoveableManager from "../MoveableManager";
import { Renderer, ClippableProps, OnClip, ClippableState, OnClipEnd, OnClipStart, ClipPose } from "../types";
import { splitBracket, splitComma, splitUnit, splitSpace } from "@daybrush/utils";
import {
    prefix, caculatePosition, getDiagonalSize,
    fillParams, triggerEvent, caculateInversePosition, makeMatrixCSS, getRect, fillEndParams, getUnitSize
} from "../utils";
import { getRad, plus, minus } from "../matrix";
import { setDragStart, getDragDist } from "../DraggerUtils";
import {
    getRadiusValues, getRadiusRange, HORIZONTAL_RADIUS_DIRECTIONS,
    HORIZONTAL_RADIUS_ORDER, VERTICAL_RADIUS_ORDER, VERTICAL_RADIUS_DIRECTIONS
} from "./cornerable/borderRadius";

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
    clipPath: ReturnType<typeof getClipPath>,
    width: number, height: number, poses: number[][],
) {
    const {
        type: clipType,
        poses: clipPoses,
    } = clipPath!;
    if (clipType === "polygon") {
        return poses.map(pos => `${pos[0]}px ${pos[1]}px`);
    } else if (clipType === "rect" || clipType === "inset") {
        const top = poses[1][1];
        const right = poses[3][0];
        const left = poses[7][0];
        const bottom = poses[5][1];
        const clipStyles = [top, width - right, height - bottom, left].map(pos => `${pos}px`);

        if (poses.length > 8) {
            let isVertical = false;
            clipStyles.push("round");
            poses.slice(8).forEach((pos, i) => {
                const { horizontal, vertical } = clipPoses[8 + i];
                if (vertical && !isVertical) {
                    isVertical = true;
                    clipStyles.push("/");
                }
                if (isVertical) {
                    clipStyles.push(`${Math.max(0, vertical === 1 ? pos[1] - top : bottom - pos[1])}px`);
                } else {
                    clipStyles.push(`${Math.max(0, horizontal === 1 ? pos[0] - left : right - pos[0])}px`);
                }
            });
        }
        return clipStyles;
    }
}
function getRectPoses(top: number, right: number, bottom: number, left: number): ClipPose[] {
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
    customClip?: string,
) {
    let clipText: string | undefined = customClip;

    if (!clipText) {
        const style = getComputedStyle(target!);
        const clipPath = style.clipPath!;

        clipText = clipPath !== "none" ? clipPath : style.clip!;
    }
    if (!clipText || clipText === "none" || clipText === "auto") {
        return;
    }
    const { prefix: clipPrefix, value } = splitBracket(clipText);
    let splitter = " ";
    if (clipPrefix === "polygon") {
        const values = splitComma(value!);
        splitter = ",";

        const poses: ClipPose[] = values.map((pos, i) => {
            const [xPos, yPos] = pos.split(" ");

            return {
                vertical: 1,
                horizontal: 1,
                pos: [
                    getUnitSize(xPos, width),
                    getUnitSize(yPos, height),
                ],
            };
        });

        return {
            type: clipPrefix,
            clipText,
            poses,
            splitter,
        } as const;
    } else if (clipPrefix === "circle" || clipPrefix === "ellipse") {
        let xPos: string = "";
        let yPos: string = "";
        let radiusX = 0;
        let radiusY = 0;
        const values = splitSpace(value!);

        if (clipPrefix === "circle") {
            let radius = "";
            [radius, , xPos, yPos] = values;

            radiusX = getUnitSize(radius, Math.sqrt((width * width + height * height) / 2));
            radiusY = radiusX;
        } else {
            let xRadius = "";
            let yRadius = "";
            [xRadius, yRadius, , xPos, yPos] = values;

            radiusX = getUnitSize(xRadius, width);
            radiusY = getUnitSize(yRadius, height);
        }
        const centerPos = [
            getUnitSize(xPos, width),
            getUnitSize(yPos, height),
        ];
        const poses: ClipPose[] = [
            {
                vertical: 1,
                horizontal: 1,
                pos: centerPos,
                direction: "nesw",
            },
            ...CLIP_DIRECTIONS.map(dir => ({
                vertical: Math.abs(dir[1]),
                horizontal: dir[0],
                direction: dir[2],
                pos: [
                    centerPos[0] + dir[0] * radiusX,
                    centerPos[1] + dir[1] * radiusY,
                ],
            })),
        ];
        return {
            type: clipPrefix,
            clipText,
            radiusX,
            radiusY,
            left: centerPos[0] - radiusX,
            top: centerPos[1] - radiusY,
            poses,
            splitter,
        } as const;
    } else if (clipPrefix === "inset") {
        const values = splitSpace(value!);
        const roundIndex = values.indexOf("round");

        const rectLength = (roundIndex > -1 ? values.slice(0, roundIndex) : values).length;
        const radiusValues = values.slice(rectLength + 1);
        const [
            topValue,
            rightValue = topValue,
            bottomValue = topValue,
            leftValue = rightValue,
        ] = values;
        const [top, bottom] = [topValue, bottomValue].map(pos => getUnitSize(pos, height));
        const [left, right] = [leftValue, rightValue].map(pos => getUnitSize(pos, width));
        const nextRight = width - right;
        const nextBottom = height - bottom;
        const radiusPoses = getRadiusValues(
            radiusValues,
            nextRight - left,
            nextBottom - top,
            left,
            top,
        );
        const poses: ClipPose[] = [
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
        const values = splitComma(value!);
        splitter = ",";
        const [top, right, bottom, left] = splitComma(value!).map((pos, i) => {
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
function addClipPath(moveable: MoveableManager<ClippableProps>, e: any) {
    const { clientX, clientY, datas } = e;
    const {
        moveableClientRect,
        rootMatrix,
        is3d,
        pos1,
        width,
        height,
    } = moveable.state;
    const { left, top } = moveableClientRect;
    const n = is3d ? 4 : 3;
    const [posX, posY] = minus(caculateInversePosition(rootMatrix, [clientX - left, clientY - top], n), pos1);
    const [distX, distY] = getDragDist({ datas, distX: posX, distY: posY });
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
        const {
            horizontalRange,
            verticalRange,
        } = getRadiusRange(clipPoses.slice(8));
        const horizontalIndex = HORIZONTAL_RADIUS_ORDER.indexOf(index);
        const verticalIndex = VERTICAL_RADIUS_ORDER.indexOf(index);
        if (horizontalIndex > -1) {
            const radiusX = HORIZONTAL_RADIUS_DIRECTIONS[horizontalIndex] === 1
                ? distX - poses[0][0]
                : poses[2][0] - distX;
            for (let i = horizontalRange[1]; i <= horizontalIndex; ++i) {
                const y = VERTICAL_RADIUS_DIRECTIONS[i] === 1 ? poses[0][1] : poses[4][1];
                let x = 0;
                if (horizontalIndex === i) {
                    x = distX;
                } else if (i === 0) {
                    x = poses[0][0] + radiusX;
                } else if (HORIZONTAL_RADIUS_DIRECTIONS[i] === -1) {
                    x = poses[2][0] - (poses[8][0] - poses[0][0]);
                }
                clipPoses.splice(8 + i, 0, {
                    horizontal: HORIZONTAL_RADIUS_DIRECTIONS[i],
                    vertical: 0,
                    pos: [x, y],
                });
                poses.splice(8 + i, 0, [x, y]);

                if (i === 0) {
                    break;
                }
            }
        } else if (verticalIndex > - 1) {
            const radiusY = VERTICAL_RADIUS_DIRECTIONS[verticalIndex] === 1
                ? distY - poses[0][1]
                : poses[4][1] - distY;
            if (horizontalRange[1] === 0 && verticalRange[1] === 0) {
                const pos = [
                    poses[0][0] + radiusY,
                    poses[0][1],
                ];
                clipPoses.push({
                    horizontal: HORIZONTAL_RADIUS_DIRECTIONS[0],
                    vertical: 0,
                    pos,
                });
                poses.push(pos);
            }

            const startVerticalIndex = verticalRange[0];
            for (let i = verticalRange[1]; i <= verticalIndex; ++i) {
                const x = HORIZONTAL_RADIUS_DIRECTIONS[i] === 1 ? poses[0][0] : poses[2][0];
                let y = 0;
                if (verticalIndex === i) {
                    y = distY;
                } else if (i === 0) {
                    y = poses[0][1] + radiusY;
                } else if (VERTICAL_RADIUS_DIRECTIONS[i] === 1) {
                    y = poses[8 + startVerticalIndex][1];
                } else if (VERTICAL_RADIUS_DIRECTIONS[i] === -1) {
                    y = poses[4][1] - (poses[8 + startVerticalIndex][1] - poses[0][1]);
                }
                clipPoses.push({
                    horizontal: 0,
                    vertical: VERTICAL_RADIUS_DIRECTIONS[i],
                    pos: [x, y],
                });
                poses.push([x, y]);
                if (i === 0) {
                    break;
                }
            }
        } else {
            return;
        }
    } else {
        return;
    }
    const clipStyles = getClipStyles(clipPath, width, height, poses)!;
    triggerEvent<OnClip>(moveable, "onClip", fillParams<OnClip>(moveable, e, {
        clipEventType: "added",
        clipType,
        poses,
        clipStyles,
        clipStyle: `${clipType}(${clipStyles.join(splitter)})`,
        distX: 0,
        distY: 0,
    }));
}
function removeClipPath(moveable: MoveableManager<ClippableProps>, e: any) {
    const { clipPath, index } = e.datas;
    const {
        width,
        height,
    } = moveable.state;
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
        const {
            horizontalRange,
            verticalRange,
        } = getRadiusRange(clipPoses.slice(8));
        const radiuslIndex = index - 8;
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
        clipPoses.splice(index, deleteCount);
        poses.splice(index, deleteCount);
    } else {
        return;
    }
    const clipStyles = getClipStyles(clipPath, width, height, poses)!;
    triggerEvent<OnClip>(moveable, "onClip", fillParams<OnClip>(moveable, e, {
        clipEventType: "removed",
        clipType,
        poses,
        clipStyles,
        clipStyle: `${clipType}(${clipStyles.join(splitter)})`,
        distX: 0,
        distY: 0,
    }));
}
export default {
    name: "clippable",
    props: {
        defaultClipPath: String,
        clipRelative: Boolean,
        clippable: Boolean,
        clipArea: Boolean,
        dragWithClip: Boolean,
    },
    render(moveable: MoveableManager<ClippableProps, ClippableState>, React: Renderer) {
        const { defaultClipPath, clipArea, zoom } = moveable.props;
        const {
            target, width, height, matrix, is3d, left, top,
            pos1, pos2, pos3, pos4,
            clipPathState,
        } = moveable.state;

        if (!target) {
            return [];
        }

        const clipPath = getClipPath(target, width, height, clipPathState || defaultClipPath);

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

        const isInset = type === "inset";

        if (type === "rect" || isInset || type === "polygon") {
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

            if (clipArea) {
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
            if (type === "polygon" || type === "rect" || isInset) {
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
    dragStart(moveable: MoveableManager<ClippableProps>, e: any) {
        const props = moveable.props;
        const {
            dragWithClip = true,
        } = props;

        if (dragWithClip == null) {
            return false;
        }

        return this.dragControlStart(moveable, e);
    },
    drag(moveable: MoveableManager<ClippableProps>, e: any) {
        return this.dragControl(moveable, e);
    },
    dragEnd(moveable: MoveableManager<ClippableProps>, e: any) {
        return this.dragControlEnd(moveable, e);
    },
    dragControlStart(moveable: MoveableManager<ClippableProps, ClippableState>, e: any) {
        const state = moveable.state;
        const { defaultClipPath } = moveable.props;
        const { target, width, height } = state;
        const inputTarget = e.inputEvent ? e.inputEvent.target : null;
        const className = inputTarget ? inputTarget.className : "";
        const datas = e.datas;
        const clipPath = getClipPath(target!, width, height, defaultClipPath);

        if (!clipPath) {
            return false;
        }
        const { clipText, type, poses } = clipPath;
        const result = triggerEvent<ClippableProps>(moveable, "onClipStart", fillParams<OnClipStart>(moveable, e, {
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
    dragControl(moveable: MoveableManager<ClippableProps, ClippableState>, e: any) {
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
        const { width, height } = state;
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
        let isAll = !isControl;

        if (isControl) {
            const { direction, pos, horizontal, vertical, sub } = clipPoses[index];
            const dist = [
                distX * Math.abs(horizontal),
                distY * Math.abs(vertical),
            ];

            if (direction === "nesw") {
                isAll = true;
            } else if (direction && !sub) {
                direction.split("").forEach(dir => {
                    const isVertical = dir === "n" || dir === "s";

                    poses.forEach((dirPos, i) => {
                        const {
                            direction: dirDir,
                            horizontal: dirHorizontal,
                            vertical: dirVertical,
                        } = clipPoses[i];

                        if (!dirDir || dirDir.indexOf(dir) === -1) {
                            return;
                        }
                        nextPoses[i] = plus(dirPos, [
                            isVertical || !dirHorizontal ? 0 : dist[0],
                            !isVertical || !dirVertical ? 0 : dist[1],
                        ]);
                    });
                });
            } else {
                nextPoses[index] = plus(pos, dist);
            }
        }
        if (isAll) {
            poses.forEach((pos, i) => {
                nextPoses[i] = plus(pos, [distX, distY]);
            });
        }
        // const indexes: number[] = [];
        // const clipStyles = getClipStyles(clipPath, width, height, clipPoses.map(pos => pos.pos))!;
        const nextClipStyles = getClipStyles(clipPath, width, height, nextPoses)!;
        const clipStyle = `${clipType}(${nextClipStyles.join(splitter)})`;

        state.clipPathState = clipStyle;
        triggerEvent<OnClip>(moveable, "onClip", fillParams<OnClip>(moveable, e, {
            clipEventType: "changed",
            clipType,
            poses: nextPoses,
            clipStyle,
            clipStyles: nextClipStyles,
            distX,
            distY,
        }));
    },
    dragControlEnd(moveable: MoveableManager<ClippableProps, ClippableState>, e: any) {
        moveable.state.clipPathState = "";
        const { isDrag, datas, isDouble } = e;
        const { isLine, isClipStart, isControl } = datas;

        if (!isClipStart) {
            return false;
        }
        triggerEvent<ClippableProps>(moveable, "onClipEnd", fillEndParams<OnClipEnd>(moveable, e, {}));
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
    unset(moveable: MoveableManager<ClippableProps, ClippableState>) {
        moveable.state.clipPathState = "";
    },
};
