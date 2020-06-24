import MoveableManager from "../MoveableManager";
import {
    prefix, triggerEvent,
    fillParams, fillEndParams, caculatePosition, moveControlPos, caculatePointerDist
} from "../utils";
import {
    Renderer, RoundableProps, OnRoundStart, RoundableState, OnRound, ControlPose, OnRoundEnd,
} from "../types";
import { splitSpace } from "@daybrush/utils";
import { setDragStart, getDragDist } from "../DraggerUtils";
import { minus } from "../matrix";
import {
    getRadiusValues, getRadiusStyles, removeRadiusPos,
    addRadiusPos, splitRadiusPoses
} from "./roundable/borderRadius";

function getBorderRadius(
    target: HTMLElement | SVGElement, width: number, height: number, state?: string,
) {
    let borderRadius: string;

    if (!state) {
        const style = window.getComputedStyle(target);

        if (!style) {
            return null;
        }
        borderRadius = style.borderRadius || "";
    } else {
        borderRadius = state;
    }
    if (!borderRadius || (!state && borderRadius === "0px")) {
        return null;
    }
    const values = splitSpace(borderRadius);

    return getRadiusValues(values, width, height, 0, 0);
}

function triggerRoundEvent(
    moveable: MoveableManager<RoundableProps>,
    e: any,
    dist: number[],
    delta: number[],
    controlPoses: ControlPose[],
    nextPoses: number[][],
) {
    const {
        width,
        height,
    } = moveable.state;
    const {
        raws,
        styles,
    } = getRadiusStyles(
        nextPoses,
        controlPoses,
        moveable.props.roundRelative!,
        width,
        height,
    );
    const {
        horizontals,
        verticals,
    } = splitRadiusPoses(controlPoses, raws);
    const borderRadius = styles.join(" ");

    triggerEvent<RoundableProps>(moveable, "onRound", fillParams<OnRound>(moveable, e, {
        horizontals,
        verticals,
        borderRadius,
        width,
        height,
        delta,
        dist,
    }));
}
export default {
    name: "roundable",
    props: {
        roundable: Boolean,
        roundRelative: Boolean,
    },
    css: [
        `.control.border-radius {
    background: #d66;
    cursor: pointer;
}`,
        `:host[data-able-roundable] .line.direction {
    cursor: pointer;
}`,
    ],
    render(moveable: MoveableManager<RoundableProps, RoundableState>, React: Renderer): any {
        const {
            target,
            width,
            height,
            matrix,
            is3d,
            left,
            top,
            borderRadiusState,
        } = moveable.state;

        if (!target) {
            return null;
        }

        const n = is3d ? 4 : 3;
        const radiusValues = getBorderRadius(target, width, height, borderRadiusState);

        if (!radiusValues) {
            return null;
        }
        return radiusValues.map((v, i) => {
            const pos = minus(caculatePosition(matrix, v.pos, n), [left, top]);

            return <div key={`borderRadiusControl${i}`}
                className={prefix("control", "border-radius")}
                data-radius-index={i}
                style={{
                    transform: `translate(${pos[0]}px, ${pos[1]}px)`,
                }}></div>;
        });
    },
    dragControlCondition(e: any) {
        if (!e.inputEvent || e.isRequest) {
            return false;
        }
        const className = (e.inputEvent.target.className || "");

        return className.indexOf("border-radius") > -1
            || (className.indexOf("moveable-line") > -1 && className.indexOf("moveable-direction") > -1);
    },
    dragControlStart(moveable: MoveableManager<RoundableProps>, e: any) {
        const { inputEvent, datas, } = e;
        const inputTarget = inputEvent.target;
        const className = (inputTarget.className || "");
        const isControl = className.indexOf("border-radius") > -1;
        const isLine = className.indexOf("moveable-line") > -1 && className.indexOf("moveable-direction") > -1;
        const controlIndex = isControl ? parseInt(inputTarget.getAttribute("data-radius-index"), 10) : -1;
        const lineIndex = isLine ? parseInt(inputTarget.getAttribute("data-line-index"), 10) : -1;

        if (!isControl && !isLine) {
            return false;
        }

        const result = triggerEvent<RoundableProps>(
            moveable, "onRoundStart", fillParams<OnRoundStart>(moveable, e, {}));

        if (result === false) {
            return false;
        }

        datas.lineIndex = lineIndex;
        datas.controlIndex = controlIndex;
        datas.isControl = isControl;
        datas.isLine = isLine;

        setDragStart(moveable, e);

        const state = moveable.state;
        const {
            target,
            width,
            height,
        } = state;

        datas.isRound = true;
        datas.prevDist = [0, 0];
        datas.controlPoses = getBorderRadius(target!, width, height) || [];

        console.log(datas.controlPoses);

        return true;
    },
    dragControl(moveable: MoveableManager<RoundableProps, RoundableState>, e: any) {
        const { datas } = e;
        if (!datas.isRound || !datas.isControl || !datas.controlPoses.length) {
            return false;
        }
        const index = datas.controlIndex as number;
        const controlPoses = datas.controlPoses as ControlPose[];
        const nextPoses = controlPoses.map(pos => pos.pos.slice());
        const [distX, distY] = getDragDist(e);
        const dist = [distX, distY];
        const delta = minus(dist, datas.prevDist);

        moveControlPos(controlPoses, nextPoses, index, distX, distY);

        datas.prevDist = [distX, distY];

        triggerRoundEvent(
            moveable,
            e,
            dist,
            delta,
            controlPoses,
            nextPoses,
        );
    },
    dragControlEnd(moveable: MoveableManager<RoundableProps, RoundableState>, e: any) {
        const { datas, isDouble } = e;
        if (!datas.isRound) {
            return false;
        }
        const {
            width,
            height,
        } = moveable.state;
        const {
            isControl,
            controlIndex,
            isLine,
            lineIndex,
        } = datas;
        const controlPoses = datas.controlPoses as ControlPose[];
        const poses = controlPoses.map(pos => pos.pos);
        const length = poses.length;

        if (isDouble) {
            if (isControl) {
                removeRadiusPos(controlPoses, poses, controlIndex, 0);
            } else if (isLine) {
                const {
                    horizontals,
                    verticals,
                } = splitRadiusPoses(controlPoses);
                const horizontalsLength = horizontals.length;
                const verticalsLength = verticals.length;
                // lineIndex
                // 0 top
                // 1 right
                // 2 left
                // 3 bottom

                // 0 top - left
                // 1 top - right
                // 2 bottom - right
                // 3 bottom - left
                // 0 left - top
                // 1 right - top
                // 2 right - bottom
                // 3 left - bottom
                let horizontalIndex = -1;
                let verticalIndex = -1;

                if (lineIndex === 0) {
                    if (horizontalsLength === 0) {
                        horizontalIndex = 0;
                    } else if (horizontalsLength === 1) {
                        horizontalIndex = 1;
                    }
                } else if (lineIndex === 3) {
                    if (horizontalsLength <= 2) {
                        horizontalIndex = 2;
                    } else if (horizontalsLength <= 3) {
                        horizontalIndex = 3;
                    }
                }
                if (lineIndex === 2) {
                    if (verticalsLength === 0) {
                        verticalIndex = 0;
                    } else if (verticalsLength < 4) {
                        verticalIndex = 3;
                    }
                } else if (lineIndex === 1) {
                    if (verticalsLength <= 1) {
                        verticalIndex = 1;
                    } else if (verticalsLength <= 2) {
                        verticalIndex = 2;
                    }
                }
                const [distX, distY] = caculatePointerDist(moveable, e);

                addRadiusPos(
                    controlPoses, poses, 0,
                    horizontalIndex, verticalIndex,
                    distX, distY, width, height,
                );
            }
            if (length !== controlPoses.length) {
                triggerRoundEvent(
                    moveable,
                    e,
                    [0, 0],
                    [0, 0],
                    controlPoses,
                    poses,
                );
            }
            triggerEvent<RoundableProps>(moveable, "onRoundEnd",
                fillEndParams<OnRoundEnd>(moveable, e, {}));
        }
        return true;
    },
};
