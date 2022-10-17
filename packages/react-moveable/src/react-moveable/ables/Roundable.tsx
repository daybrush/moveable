import {
    prefix, triggerEvent,
    fillParams, fillEndParams, calculatePosition,
    getComputedStyle,
    fillCSSObject,
} from "../utils";
import {
    Renderer, RoundableProps, OnRoundStart,
    RoundableState, OnRound, ControlPose, OnRoundEnd,
    MoveableManagerInterface,
} from "../types";
import { splitSpace } from "@daybrush/utils";
import { setDragStart, getDragDist, calculatePointerDist } from "../gesto/GestoUtils";
import { minus, plus } from "@scena/matrix";
import {
    getRadiusValues,
    getRadiusStyles,
    splitRadiusPoses,
} from "./roundable/borderRadius";


function addBorderRadiusByLine(
    controlPoses: ControlPose[],
    lineIndex: number,
    distX: number,
    distY: number,
) {
    // lineIndex
    // 0 top
    // 1 right
    // 2 bottom
    // 3 left

    const horizontalsLength = controlPoses.filter(({ virtual, horizontal }) => horizontal && !virtual).length;
    const verticalsLength = controlPoses.filter(({ virtual, vertical }) => vertical && !virtual).length;
    let controlIndex = -1;

    //top
    if (lineIndex === 0) {
        if (horizontalsLength === 0) {
            controlIndex = 0;
        } else if (horizontalsLength === 1) {
            controlIndex = 1;
        }
    }
    // bottom
    if (lineIndex === 2) {
        if (horizontalsLength <= 2) {
            controlIndex = 2;
        } else if (horizontalsLength <= 3) {
            controlIndex = 3;
        }
    }
    // left
    if (lineIndex === 3) {
        if (verticalsLength === 0) {
            controlIndex = 4;
        } else if (verticalsLength < 4) {
            controlIndex = 7;
        }
    }

    // right
    if (lineIndex === 1) {
        if (verticalsLength <= 1) {
            controlIndex = 5;
        } else if (verticalsLength <= 2) {
            controlIndex = 6;
        }
    }
    if (controlIndex === -1 || !controlPoses[controlIndex].virtual) {
        return;
    }
    const controlPoseInfo = controlPoses[controlIndex];

    addBorderRadius(controlPoses, controlIndex);

    if (controlIndex < 4) {
        controlPoseInfo.pos[0] = distX;
    } else {
        controlPoseInfo.pos[1] = distY;
    }
}
function addBorderRadius(
    controlPoses: ControlPose[],
    index: number,
) {
    if (index < 4) {
        controlPoses.slice(0, index + 1).forEach(info => {
            info.virtual = false;
        });
    } else {
        if (controlPoses[0].virtual) {
            controlPoses[0].virtual = false;
        }
        controlPoses.slice(4, index + 1).forEach(info => {
            info.virtual = false;
        });
    }
}
function removeBorderRadius(
    controlPoses: ControlPose[],
    index: number,
) {
    if (index < 4) {
        controlPoses.slice(index, 4).forEach(info => {
            info.virtual = true;
        });
    } else {
        controlPoses.slice(index).forEach(info => {
            info.virtual = true;
        });
    }
}
function getBorderRadius(
    target: HTMLElement | SVGElement,
    width: number,
    height: number,
    minCounts: number[] = [0, 0],
    state?: string,
    full?: boolean,
) {
    let borderRadius: string;
    let values: string[] = [];

    if (!state) {
        const style = getComputedStyle(target);

        borderRadius = (style && style.borderRadius) || "";
    } else {
        borderRadius = state;
    }
    if (!borderRadius || (!state && borderRadius === "0px")) {
        values = [];
    } else {
        values = splitSpace(borderRadius);
    }

    return getRadiusValues(values, width, height, 0, 0, minCounts, full);
}

function triggerRoundEvent(
    moveable: MoveableManagerInterface<RoundableProps, RoundableState>,
    e: any,
    dist: number[],
    delta: number[],
    nextPoses: ControlPose[],
) {
    const state = moveable.state;
    const {
        width,
        height,
    } = state;
    const {
        raws,
        styles,
        radiusPoses,
    } = getRadiusStyles(
        nextPoses,
        moveable.props.roundRelative!,
        width,
        height,
    );
    const {
        horizontals,
        verticals,
    } = splitRadiusPoses(radiusPoses, raws);
    const borderRadius = styles.join(" ");

    state.borderRadiusState = borderRadius;
    triggerEvent(moveable, "onRound", fillParams<OnRound>(moveable, e, {
        horizontals,
        verticals,
        borderRadius,
        width,
        height,
        delta,
        dist,
        ...fillCSSObject({
            borderRadius,
        }, e),
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
        minRoundControls: Array,
        maxRoundControls: Array,
        roundClickable: Boolean,
        roundPadding: Number,
        isDisplayShadowRoundControls: Boolean,
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
    z-index: 3;
}`,
        `.control.border-radius.vertical {
    background: #d6d;
    z-index: 2;
}`,
        `.control.border-radius.virtual {
    opacity: 0.5;
    z-index: 1;
}`,
        `:host.round-line-clickable .line.direction {
    cursor: pointer;
}`,
    ],
    className(moveable: MoveableManagerInterface<RoundableProps, RoundableState>) {
        const roundClickable = moveable.props.roundClickable;

        return roundClickable === true || roundClickable === "line" ? prefix("round-line-clickable") : "";
    },
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
        } = moveable.getState();
        const {
            minRoundControls = [0, 0],
            maxRoundControls = [4, 4],
            zoom,
            roundPadding = 0,
            isDisplayShadowRoundControls,
        } = moveable.props;

        if (!target) {
            return null;
        }

        const n = is3d ? 4 : 3;
        const radiusValues = getBorderRadius(
            target, width, height,
            minRoundControls,
            borderRadiusState,
            true,
        );

        if (!radiusValues) {
            return null;
        }
        let verticalCount = 0;
        let horizontalCount = 0;

        return radiusValues.map((v, i) => {
            const horizontal = v.horizontal;
            const vertical = v.vertical;
            const direction = v.direction || "";
            const originalPos = [...v.pos];

            horizontalCount += Math.abs(horizontal);
            verticalCount += Math.abs(vertical);


            if (horizontal && direction.indexOf("n") > -1) {
                originalPos[1] -= roundPadding;
            }
            if (vertical && direction.indexOf("w") > -1) {
                originalPos[0] -= roundPadding;
            }
            if (horizontal && direction.indexOf("s") > -1) {
                originalPos[1] += roundPadding;
            }
            if (vertical && direction.indexOf("e") > -1) {
                originalPos[0] += roundPadding;
            }

            const pos = minus(calculatePosition(allMatrix, originalPos, n), [left, top]);
            const isDisplay = v.vertical
                ? verticalCount <= maxRoundControls[1] && (isDisplayShadowRoundControls || !v.virtual)
                : horizontalCount <= maxRoundControls[0] && (isDisplayShadowRoundControls || !v.virtual);

            return <div key={`borderRadiusControl${i}`}
                className={prefix(
                    "control", "border-radius",
                    v.vertical ? "vertical" : "",
                    v.virtual ? "virtual" : "",
                )}
                data-radius-index={i}
                style={{
                    display: isDisplay ? "block" : "none",
                    transform: `translate(${pos[0]}px, ${pos[1]}px) scale(${zoom})`,
                }}></div>;
        });
    },
    dragControlCondition(moveable: any, e: any) {
        if (!e.inputEvent || e.isRequest) {
            return false;
        }
        const className = (e.inputEvent.target.getAttribute("class") || "");

        return className.indexOf("border-radius") > -1
            || (className.indexOf("moveable-line") > -1 && className.indexOf("moveable-direction") > -1);
    },
    dragControlStart(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, e: any) {
        const { inputEvent, datas } = e;
        const inputTarget = inputEvent.target;
        const className = (inputTarget.getAttribute("class") || "");
        const isControl = className.indexOf("border-radius") > -1;
        const isLine = className.indexOf("moveable-line") > -1 && className.indexOf("moveable-direction") > -1;
        const controlIndex = isControl ? parseInt(inputTarget.getAttribute("data-radius-index"), 10) : -1;
        let lineIndex = -1;

        if (isLine) {
            const indexAttr = inputTarget.getAttribute("data-line-key")! || "";

            if (indexAttr) {
                lineIndex = parseInt(indexAttr.replace(/render-line-/g, ""), 10);

                if (isNaN(lineIndex)) {
                    lineIndex = -1;
                }
            }
        }

        if (!isControl && !isLine) {
            return false;
        }

        const result = triggerEvent(
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
            minRoundControls = [0, 0],
        } = moveable.props;
        const state = moveable.state;
        const {
            target,
            width,
            height,
        } = state;

        datas.isRound = true;
        datas.prevDist = [0, 0];
        const controlPoses = getBorderRadius(
            target!,
            width,
            height,
            minRoundControls,
            "",
            true,
        ) || [];

        datas.controlPoses = controlPoses;

        state.borderRadiusState = getRadiusStyles(
            controlPoses,
            roundRelative!,
            width,
            height,
        ).styles.join(" ");
        return true;
    },
    dragControl(moveable: MoveableManagerInterface<RoundableProps, RoundableState>, e: any) {
        const { datas } = e;
        const controlPoses = datas.controlPoses as ControlPose[];

        if (!datas.isRound || !datas.isControl || !controlPoses.length) {
            return false;
        }
        const index = datas.controlIndex as number;

        const [distX, distY] = getDragDist(e);
        const dist = [distX, distY];
        const delta = minus(dist, datas.prevDist);
        const {
            maxRoundControls = [4, 4],
        } = moveable.props;
        const { width, height } = moveable.state;
        const selectedControlPose = controlPoses[index];

        const selectedVertical = selectedControlPose.vertical;
        const selectedHorizontal = selectedControlPose.horizontal;

        // 0: [0, 1, 2, 3] maxCount === 1
        // 0: [0, 2] maxCount === 2
        // 1: [1, 3] maxCount === 2

        // 0: [0] maxCount === 3
        // 1: [1, 3] maxCount === 3

        const dists = controlPoses.map(pose => {
            const { horizontal, vertical } = pose;
            const poseDist = [
                horizontal * selectedHorizontal * dist[0],
                vertical * selectedVertical * dist[1],
            ];
            if (horizontal) {
                if (maxRoundControls[0] === 1) {
                    return poseDist;
                } else if (maxRoundControls[0] < 4 && horizontal !== selectedHorizontal) {
                    return poseDist;
                }
            } else if (maxRoundControls[1] === 0) {
                poseDist[1] = vertical * selectedHorizontal * dist[0] / width * height;

                return poseDist;
            } else if (selectedVertical) {
                if (maxRoundControls[1] === 1) {
                    return poseDist;
                } else if (maxRoundControls[1] < 4 && vertical !== selectedVertical) {
                    return poseDist;
                }
            }
            return [0, 0];
        });

        dists[index] = dist;
        const nextPoses = controlPoses.map((info, i) => {
            return {
                ...info,
                pos: plus(info.pos, dists[i]),
            };
        });

        if (index < 4) {
            nextPoses.slice(0, index + 1).forEach(info => {
                info.virtual = false;
            });
        } else {
            nextPoses.slice(4, index + 1).forEach(info => {
                info.virtual = false;
            });
        }

        datas.prevDist = [distX, distY];

        triggerRoundEvent(
            moveable,
            e,
            dist,
            delta,
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
            isControl,
            controlIndex,
            isLine,
            lineIndex,
        } = datas;
        const controlPoses = datas.controlPoses as ControlPose[];
        const length = controlPoses.filter(({ virtual }) => virtual).length;
        const {
            roundClickable = true,
        } = moveable.props;

        if (isDouble && roundClickable) {
            if (isControl && (roundClickable === true || roundClickable === "control")) {
                removeBorderRadius(controlPoses, controlIndex);
            } else if (isLine && (roundClickable === true || roundClickable === "line")) {
                const [distX, distY] = calculatePointerDist(moveable, e);

                addBorderRadiusByLine(controlPoses, lineIndex, distX, distY);
            }

            if (length !== controlPoses.filter(({ virtual }) => virtual).length) {
                triggerRoundEvent(
                    moveable,
                    e,
                    [0, 0],
                    [0, 0],
                    controlPoses,
                );
            }
        }
        triggerEvent(moveable, "onRoundEnd",
            fillEndParams<OnRoundEnd>(moveable, e, {}));
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
 * Minimum number of round controls. It moves in proportion by control. [horizontal, vertical] (default: [0, 0])
 * @name Moveable.Roundable#minRoundControls
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 *     minRoundControls: [0, 0],
 * });
 * moveable.minRoundControls = [1, 0];
 */
/**
 * Maximum number of round controls. It moves in proportion by control. [horizontal, vertical] (default: [4, 4])
 * @name Moveable.Roundable#maxRoundControls
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 *     maxRoundControls: [4, 4],
 * });
 * moveable.maxRoundControls = [1, 0];
 */
/**
 * Whether you can add/delete round controls by double-clicking a line or control.
 * @name Moveable.Roundable#roundClickable
 * @default true
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundRelative: false,
 *     roundClickable: true,
 * });
 * moveable.roundClickable = false;
 */

/**
 * Whether to show a round control that does not actually exist as a shadow
 * @name Moveable.Roundable#isDisplayShadowRoundControls
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     isDisplayShadowRoundControls: false,
 * });
 * moveable.isDisplayShadowRoundControls = true;
 */


/**
 * The padding value of the position of the round control
 * @name Moveable.Roundable#roundPadding
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     roundable: true,
 *     roundPadding: 0,
 * });
 * moveable.roundPadding = 15;
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
