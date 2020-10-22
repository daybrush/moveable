import {
    prefix, triggerEvent,
    fillParams, fillEndParams, caculatePosition, moveControlPos
} from "../utils";
import {
    Renderer, RoundableProps, OnRoundStart, RoundableState, OnRound, ControlPose, OnRoundEnd, MoveableManagerInterface,
} from "../types";
import { splitSpace } from "@daybrush/utils";
import { setDragStart, getDragDist, caculatePointerDist } from "../gesto/GestoUtils";
import { minus, plus } from "../matrix";
import {
    getRadiusValues, getRadiusStyles, removeRadiusPos,
    addRadiusPos, splitRadiusPoses,
} from "./roundable/borderRadius";

function addBorderRadius(
    controlPoses: ControlPose[],
    poses: number[][],
    lineIndex: number,
    distX: number,
    distY: number,
    width: number,
    height: number,
) {
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

    addRadiusPos(
        controlPoses, poses, 0,
        horizontalIndex, verticalIndex,
        distX, distY, width, height,
    );
}
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
    moveable: MoveableManagerInterface<RoundableProps, RoundableState>,
    e: any,
    dist: number[],
    delta: number[],
    controlPoses: ControlPose[],
    nextPoses: number[][],
) {
    const state = moveable.state;
    const {
        width,
        height,
    } = state;
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

    state.borderRadiusState = borderRadius;
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

/**
 * @namespace Moveable.Roundable
 * @description Whether to show and drag or double click border-radius
 */

export default {
    name: "roundable",
    props: {
        roundable: Boolean,
        roundRelative: Boolean,
    } as const,
    events: {
        onRoundStart: "roundStart",
        onRound: "round",
        onRoundEnd: "roundEnd",
    } as const,
    css: [
        `.control.border-radius {
    background: #d66;
    cursor: pointer;
}`,
        `:host[data-able-roundable] .line.direction {
    cursor: pointer;
}`,
    ],
    render(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, React: Renderer): any {
        const {
            target,
            width,
            height,
            allMatrix,
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
            const pos = minus(caculatePosition(allMatrix, v.pos, n), [left, top]);

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
        const className = (e.inputEvent.target.getAttribute("class") || "");

        return className.indexOf("border-radius") > -1
            || (className.indexOf("moveable-line") > -1 && className.indexOf("moveable-direction") > -1);
    },
    dragControlStart(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, e: any) {
        const { inputEvent, datas, } = e;
        const inputTarget = inputEvent.target;
        const className = (inputTarget.getAttribute("class") || "");
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

        const {
            roundRelative,
        } = moveable.props;
        const state = moveable.state;
        const {
            target,
            width,
            height,
        } = state;

        datas.isRound = true;
        datas.prevDist = [0, 0];
        const controlPoses = getBorderRadius(target!, width, height) || [];

        datas.controlPoses = controlPoses;

        state.borderRadiusState = getRadiusStyles(
            controlPoses.map(pos => pos.pos), controlPoses, roundRelative!, width, height).styles.join(" ");
        return true;
    },
    dragControl(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, e: any) {
        const { datas } = e;

        if (!datas.isRound || !datas.isControl || !datas.controlPoses.length) {
            return false;
        }
        const index = datas.controlIndex as number;
        const controlPoses = datas.controlPoses as ControlPose[];
        const [distX, distY] = getDragDist(e);
        const dist = [distX, distY];
        const delta = minus(dist, datas.prevDist);

        const dists = moveControlPos(controlPoses, index, dist);
        const nextPoses = controlPoses.map((pos, i) => plus(pos.pos, dists[i]));

        datas.prevDist = [distX, distY];

        triggerRoundEvent(
            moveable,
            e,
            dist,
            delta,
            controlPoses,
            nextPoses,
        );
        return true;
    },
    dragControlEnd(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, e: any) {
        const state = moveable.state;

        state.borderRadiusState = "";
        const { datas, isDouble } = e;
        if (!datas.isRound) {
            return false;
        }
        const {
            width,
            height,
        } = state;
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
                const [distX, distY] = caculatePointerDist(moveable, e);

                addBorderRadius(controlPoses, poses, lineIndex, distX, distY, width, height);
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
        state.borderRadiusState = "";
        return true;
    },
    unset(moveable: MoveableManagerInterface<RoundableProps, RoundableState>) {
        moveable.state.borderRadiusState = "";
    },
};
/**
 * Whether to show and drag or double click border-radius, (default: false)
 * @name Moveable.Roundable#roundable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * % Can be used instead of the absolute px
 * @name Moveable.Roundable#roundRelative
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */

/**
 * When drag start the clip area or controls, the `roundStart` event is called.
 * @memberof Moveable.Roundable
 * @event roundStart
 * @param {Moveable.Roundable.OnRoundStart} - Parameters for the `roundStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag or double click the border area or controls, the `round` event is called.
 * @memberof Moveable.Roundable
 * @event round
 * @param {Moveable.Roundable.OnRound} - Parameters for the `round` event
 * @example
  * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */
/**
 * When drag end the border area or controls, the `roundEnd` event is called.
 * @memberof Moveable.Roundable
 * @event roundEnd
 * @param {Moveable.Roundable.onRoundEnd} - Parameters for the `roundEnd` event
 * @example
  * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 * });
 * moveable.on("roundStart", e => {
 *     console.log(e);
 * }).on("round", e => {
 *     e.target.style.borderRadius = e.borderRadius;
 * }).on("roundEnd", e => {
 *     console.log(e);
 * });
 */
