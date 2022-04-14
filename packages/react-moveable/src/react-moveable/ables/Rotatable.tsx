import {
    prefix, triggerEvent, fillParams,
    calculatePosition, fillEndParams, getRotationRad, getRefTargets, catchEvent,
} from "../utils";
import {
    IObject, hasClass, getRad,
    throttle,
} from "@daybrush/utils";
import {
    RotatableProps, OnRotateGroup, OnRotateGroupEnd,
    Renderer, OnRotateGroupStart, OnRotateStart, OnRotate,
    OnRotateEnd, MoveableClientRect, SnappableProps,
    SnappableState, MoveableManagerInterface, MoveableGroupInterface, DraggableProps,
    OnBeforeRotate,
    OnDragStart,
    OnBeforeRotateGroup,
} from "../types";
import { triggerChildAbles } from "../groupUtils";
import Draggable from "./Draggable";
import { minus, plus, rotate as rotateMatrix } from "@scena/matrix";
import CustomGesto from "../gesto/CustomGesto";
import { checkSnapRotate } from "./Snappable";
import {
    fillTransformStartEvent,
    convertTransformFormat, getRotateDist,
    getOriginDirection,
    getDirectionOffset,
    fillTransformEvent,
    setDefaultTransformIndex,
    resolveTransformEvent,
    getTransformDirection,
} from "../gesto/GestoUtils";
import { renderDirectionControls } from "../renderDirections";

/**
 * @namespace Rotatable
 * @memberof Moveable
 * @description Rotatable indicates whether the target can be rotated.
 */

function setRotateStartInfo(
    moveable: MoveableManagerInterface<any, any>,
    datas: IObject<any>, clientX: number, clientY: number, origin: number[], rect: MoveableClientRect) {

    const n = moveable.state.is3d ? 4 : 3;
    const nextOrigin = calculatePosition(moveable.state.rootMatrix, origin, n);
    const startAbsoluteOrigin = plus([rect.left, rect.top], nextOrigin);

    datas.startAbsoluteOrigin = startAbsoluteOrigin;
    datas.prevDeg = getRad(startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180;
    datas.defaultDeg = datas.prevDeg;
    datas.prevSnapDeg = 0;
    datas.loop = 0;
}

function getAbsoluteDist(
    deg: number,
    direction: number,
    datas: IObject<any>,
) {
    const {
        defaultDeg,
        prevDeg,
    } = datas;


    let normalizedPrevDeg = prevDeg % 360;
    let loop = Math.floor(prevDeg / 360);

    if (normalizedPrevDeg < 0) {
        normalizedPrevDeg += 360;
    }

    if (normalizedPrevDeg > deg && normalizedPrevDeg > 270 && deg < 90) {
        // 360 => 0
        ++loop;
    } else if (normalizedPrevDeg < deg && normalizedPrevDeg < 90 && deg > 270) {
        // 0 => 360
        --loop;
    }
    const dist = direction * (loop * 360 + deg - defaultDeg);

    datas.prevDeg = defaultDeg + dist;

    return dist;
}
function getAbsoluteDistByClient(
    clientX: number, clientY: number,
    direction: number,
    datas: IObject<any>,
) {
    return getAbsoluteDist(

        getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180,
        direction,
        datas,
    );
}
function getRotateInfo(
    moveable: MoveableManagerInterface<any, any>,
    moveableRect: any,
    datas: IObject<any>,
    dist: number,
    startValue: number,
    isSnap?: boolean,
) {
    const {
        throttleRotate = 0,
    } = moveable.props;
    let nextDist = dist;

    const prevSnapDeg = datas.prevSnapDeg;



    if (isSnap) {
        nextDist = checkSnapRotate(moveable, moveableRect, datas.origin, nextDist);
    }

    const snapRotation = throttle(startValue + nextDist, throttleRotate);
    const snapDeg = snapRotation - startValue;

    datas.prevSnapDeg = snapDeg;

    return [snapDeg - prevSnapDeg, nextDist, snapRotation];


}

export function getReversePositionX(dir: string) {
    if (dir === "left") {
        return "right";
    } else if (dir === "right") {
        return "left";
    }
    return dir;
}
export function getReversePositionY(dir: string) {
    if (dir === "top") {
        return "bottom";
    } else if (dir === "bottom") {
        return "top";
    }
    return dir;
}
export function getRotationPositions(
    rotationPosition: RotatableProps["rotationPosition"],
    [pos1, pos2, pos3, pos4]: number[][],
    direction: number,
) {
    if (rotationPosition === "none") {
        return;
    }
    const [dir1, dir2] = (rotationPosition || "top").split("-");
    let radPoses = [pos1, pos2];

    // if (scale[0] < 0) {
    //     dir1 = getReversePositionX(dir1);
    //     dir2 = getReversePositionX(dir2);
    // }
    // if (scale[1] < 0) {
    //     dir1 = getReversePositionY(dir1);
    //     dir2 = getReversePositionY(dir2);
    // }
    if (dir1 === "left") {
        radPoses = [pos3, pos1];
    } else if (dir1 === "right") {
        radPoses = [pos2, pos4];
    } else if (dir1 === "bottom") {
        radPoses = [pos4, pos3];
    }
    let pos = [
        (radPoses[0][0] + radPoses[1][0]) / 2,
        (radPoses[0][1] + radPoses[1][1]) / 2,
    ];
    const rad = getRotationRad(radPoses, direction);
    if (dir2) {
        const isStart = dir2 === "top" || dir2 === "left";
        const isReverse = dir1 === "bottom" || dir1 === "left";

        pos = radPoses[(isStart && !isReverse) || (!isStart && isReverse) ? 0 : 1];
    }
    return [pos, rad] as const;
}

export function dragControlCondition(moveable: MoveableManagerInterface<RotatableProps>, e: any) {
    if (e.isRequest) {
        return e.requestAble === "rotatable";
    }
    const target = e.inputEvent.target as HTMLElement;
    if (hasClass(target, prefix("rotation-control"))) {
        return true;
    }
    const rotationTarget = moveable.props.rotationTarget;

    if (rotationTarget) {
        return getRefTargets(rotationTarget, true).some(element => {
            if (!element) {
                return false;
            }
            return target === element || target.contains(element);
        });
    }
    return false;
}

export default {
    name: "rotatable",
    canPinch: true,
    props: {
        rotatable: Boolean,
        rotationPosition: String,
        throttleRotate: Number,
        renderDirections: Object,
        rotationTarget: Object,
    } as const,
    events: {
        onRotateStart: "rotateStart",
        onBeforeRotate: "beforeRotate",
        onRotate: "rotate",
        onRotateEnd: "rotateEnd",
        onRotateGroupStart: "rotateGroupStart",
        onBeforeRotateGroup: "beforeRotateGroup",
        onRotateGroup: "rotateGroup",
        onRotateGroupEnd: "rotateGroupEnd",
    } as const,
    css: [
        `.rotation {
            position: absolute;
            height: 40px;
            width: 1px;
            transform-origin: 50% 100%;
            height: calc(40px * var(--zoom));
            top: auto;
            left: 0;
            bottom: 100%;
            will-change: transform;
        }
        .rotation .rotation-line {
            display: block;
            width: 100%;
            height: 100%;
            transform-origin: 50% 50%;
        }
        .rotation .rotation-control {
            border-color: #4af;
            border-color: var(--moveable-color);
            background:#fff;
            cursor: alias;
        }`,
    ],
    render(moveable: MoveableManagerInterface<RotatableProps>, React: Renderer): any {
        const {
            rotatable,
            rotationPosition,
            zoom,
            renderDirections,
        } = moveable.props;
        const {
            renderPoses,
            direction,
        } = moveable.state;
        if (!rotatable) {
            return null;
        }
        const positions = getRotationPositions(rotationPosition!, renderPoses, direction);

        const jsxs = [];

        if (positions) {
            const [pos, rad] = positions;
            jsxs.push(
                <div key="rotation" className={prefix("rotation")} style={{
                    // tslint:disable-next-line: max-line-length
                    transform: `translate(-50%) translate(${pos[0]}px, ${pos[1]}px) rotate(${rad}rad)`,
                }}>
                    <div className={prefix("line rotation-line")} style={{
                        transform: `scaleX(${zoom})`,
                    }}></div>
                    <div className={prefix("control rotation-control")} style={{
                        transform: `translate(0.5px) scale(${zoom})`,
                    }}></div>
                </div>
            );
        }
        if (renderDirections) {
            jsxs.push(...renderDirectionControls(moveable, [], React));
        }


        return jsxs;
    },
    dragControlCondition,
    dragControlStart(
        moveable: MoveableManagerInterface<RotatableProps & SnappableProps & DraggableProps, SnappableState>,
        e: any) {
        const {
            datas,
            clientX, clientY,
            parentRotate, parentFlag, isPinch,
            isRequest,
        } = e;
        const {
            target, left, top, origin, beforeOrigin,
            direction, beforeDirection, targetTransform,
            moveableClientRect,
        } = moveable.state;

        if (!isRequest && !target) {
            return false;
        }

        const rect = moveable.getRect();
        datas.rect = rect;
        datas.transform = targetTransform;
        datas.left = left;
        datas.top = top;
        datas.fixedPosition = getDirectionOffset(moveable, getOriginDirection(moveable));

        if (isRequest || isPinch || parentFlag) {
            const externalRotate = parentRotate || 0;

            datas.beforeInfo = {
                origin: rect.beforeOrigin,
                prevDeg: externalRotate,
                defaultDeg: externalRotate,
                prevSnapDeg: 0,
            };
            datas.afterInfo = {
                ...datas.beforeInfo,
                origin: rect.origin,
            };
            datas.absoluteInfo = {
                ...datas.beforeInfo,
                origin: rect.origin,
                startValue: externalRotate,
            };
        } else {
            datas.beforeInfo = { origin: rect.beforeOrigin };
            datas.afterInfo = { origin: rect.origin };
            datas.absoluteInfo = {
                origin: rect.origin,
                startValue: rect.rotation,
            };

            setRotateStartInfo(moveable, datas.beforeInfo, clientX, clientY, beforeOrigin, moveableClientRect);
            setRotateStartInfo(moveable, datas.afterInfo, clientX, clientY, origin, moveableClientRect);
            setRotateStartInfo(moveable, datas.absoluteInfo, clientX, clientY, origin, moveableClientRect);
        }

        datas.direction = direction;
        datas.beforeDirection = beforeDirection;
        datas.startValue = 0;
        datas.datas = {};

        setDefaultTransformIndex(e, "rotate");

        const params = fillParams<OnRotateStart>(moveable, e, {
            set: (rotatation: number) => {
                datas.startValue = rotatation * Math.PI / 180;
            },
            ...fillTransformStartEvent(e),
            dragStart: Draggable.dragStart(
                moveable,
                new CustomGesto().dragStart([0, 0], e),
            ) as OnDragStart | false,
        });
        const result = triggerEvent(moveable, "onRotateStart", params);
        datas.isRotate = result !== false;
        moveable.state.snapRenderInfo = {
            request: e.isRequest,
        };

        return datas.isRotate ? params : false;
    },
    dragControl(
        moveable: MoveableManagerInterface<RotatableProps & DraggableProps>,
        e: any,
    ) {
        const { datas, clientX, clientY, parentRotate, parentFlag, isPinch, groupDelta } = e;
        const {
            beforeDirection,
            beforeInfo,
            afterInfo,
            absoluteInfo,
            isRotate,
            startValue,
            rect,
        } = datas;

        if (!isRotate) {
            return;
        }

        resolveTransformEvent(e, "rotate");

        const targetDirection = getTransformDirection(e);
        const direction = beforeDirection * targetDirection;
        const {
            parentMoveable,
        } = moveable.props;


        let beforeDelta = 0;
        let beforeDist: number;
        let beforeRotation: number;

        let delta = 0;
        let dist: number;
        let rotation: number;

        let absoluteDelta = 0;
        let absoluteDist: number;
        let absoluteRotation: number;

        const startRotation = 180 / Math.PI * startValue;
        const absoluteStartRotation = absoluteInfo.startValue;
        let isSnap = false;

        if (!parentFlag && "parentDist" in e) {
            const parentDist = e.parentDist;

            beforeDist = parentDist;
            dist = parentDist;
            absoluteDist = parentDist;

        } else if (isPinch || parentFlag) {
            beforeDist = getAbsoluteDist(parentRotate, beforeDirection, beforeInfo);
            dist = getAbsoluteDist(parentRotate, direction, afterInfo);
            absoluteDist = getAbsoluteDist(parentRotate, direction, absoluteInfo);
        } else {
            beforeDist = getAbsoluteDistByClient(clientX, clientY, beforeDirection, beforeInfo);
            dist = getAbsoluteDistByClient(clientX, clientY, direction, afterInfo);
            absoluteDist = getAbsoluteDistByClient(clientX, clientY, direction, absoluteInfo);
            isSnap = true;
        }
        beforeRotation = startRotation + beforeDist;
        rotation = startRotation + dist;
        absoluteRotation = absoluteStartRotation + absoluteDist;


        triggerEvent(moveable, "onBeforeRotate", fillParams<OnBeforeRotate>(moveable, e, {
            beforeRotation,
            rotation,
            absoluteRotation,
            setRotation(nextRotation: number) {
                dist = nextRotation - startRotation;
                beforeDist = dist;
                absoluteDist = dist;
            },
        }));
        [
            beforeDelta,
            beforeDist,
            beforeRotation,
        ] = getRotateInfo(moveable, rect, beforeInfo, beforeDist, startRotation, isSnap);

        [
            delta,
            dist,
            rotation,
        ] = getRotateInfo(moveable, rect, afterInfo, dist, startRotation, isSnap);

        [
            absoluteDelta,
            absoluteDist,
            absoluteRotation,
        ] = getRotateInfo(moveable, rect, absoluteInfo, absoluteDist, absoluteStartRotation, isSnap);

        if (!absoluteDelta && !delta && !beforeDelta && !parentMoveable) {
            return;
        }

        const nextTransform = convertTransformFormat(
            datas, `rotate(${rotation}deg)`, `rotate(${dist}deg)`,
        );

        const inverseDist = getRotateDist(moveable, dist, datas.fixedPosition, datas);
        const inverseDelta = minus(
            plus(groupDelta || [0, 0], inverseDist),
            datas.prevInverseDist || [0, 0],
        );
        datas.prevInverseDist = inverseDist;

        datas.requestValue = null;

        const params = fillParams<OnRotate>(moveable, e, {
            delta,
            dist,
            rotate: rotation,
            rotation,

            beforeDist,
            beforeDelta,
            beforeRotate: beforeRotation,
            beforeRotation,

            absoluteDist,
            absoluteDelta,
            absoluteRotate: absoluteRotation,
            absoluteRotation,

            isPinch: !!isPinch,
            // setValue(pos: number) {
            //     datas.requestValue = pos;
            // },
            ...fillTransformEvent(
                moveable,
                nextTransform,
                inverseDelta,
                isPinch,
                e,
            ),
        });
        triggerEvent(moveable, "onRotate", params);

        return params;
    },
    dragControlAfter(moveable: MoveableManagerInterface<RotatableProps>, e: any) {
        const requestValue = e.datas.requestValue;

        if (requestValue != null) {
            // return this.dragControl(moveable, {...e, parentDist: });
        }
    },
    dragControlEnd(moveable: MoveableManagerInterface<RotatableProps>, e: any) {
        const { datas } = e;

        if (!datas.isRotate) {
            return;
        }
        datas.isRotate = false;

        const params = fillEndParams<OnRotateEnd>(moveable, e, {});

        triggerEvent(moveable, "onRotateEnd", params);
        return params;
    },
    dragGroupControlCondition: dragControlCondition,
    dragGroupControlStart(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { datas } = e;
        const {
            left: parentLeft,
            top: parentTop,
            beforeOrigin: parentBeforeOrigin,
        } = moveable.state;

        const params = this.dragControlStart(moveable, e);

        if (!params) {
            return false;
        }

        params.set(datas.beforeDirection * moveable.rotation);

        const events = triggerChildAbles(
            moveable,
            this,
            "dragControlStart",
            e,
            (child, ev) => {
                const { left, top, beforeOrigin } = child.state;
                const childClient = plus(
                    minus([left, top], [parentLeft, parentTop]),
                    minus(beforeOrigin, parentBeforeOrigin),
                );

                ev.datas.groupClient = childClient;
                return { ...ev, parentRotate: 0 };
            },
        );

        const nextParams: OnRotateGroupStart = {
            ...params,
            targets: moveable.props.targets!,
            events,
        };
        const result = triggerEvent(moveable, "onRotateGroupStart", nextParams);

        datas.isRotate = result !== false;

        return datas.isRotate ? params : false;
    },
    dragGroupControl(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { datas } = e;

        if (!datas.isRotate) {
            return;
        }

        catchEvent(moveable, "onBeforeRotate", parentEvent => {
            triggerEvent(moveable, "onBeforeRotateGroup", fillParams<OnBeforeRotateGroup>(moveable, e, {
                ...parentEvent,
                targets: moveable.props.targets!,
            }));
        });
        const params = this.dragControl(moveable, e);

        if (!params) {
            return;
        }
        const direction = datas.beforeDirection;
        const parentRotate = params.beforeDist;
        const deg = params.beforeDelta;
        const rad = deg / 180 * Math.PI;

        const events = triggerChildAbles(
            moveable,
            this,
            "dragControl",
            e,
            (_, ev) => {
                const [prevX, prevY] = ev.datas.groupClient;
                const [clientX, clientY] = rotateMatrix([prevX, prevY], rad * direction);
                const delta = [clientX - prevX, clientY - prevY];

                ev.datas.groupClient = [clientX, clientY];
                return { ...ev, parentRotate, groupDelta: delta };
            },
        );
        moveable.rotation = direction * params.beforeRotation;

        const nextParams: OnRotateGroup = {
            targets: moveable.props.targets!,
            events,
            set(rotation: number) {
                moveable.rotation = rotation;
            },
            setGroupRotation(rotation: number) {
                moveable.rotation = rotation;
            },
            ...params,
        };

        triggerEvent(moveable, "onRotateGroup", nextParams);
        return nextParams;
    },
    dragGroupControlEnd(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { isDrag, datas } = e;

        if (!datas.isRotate) {
            return;
        }

        this.dragControlEnd(moveable, e);
        const events = triggerChildAbles(moveable, this, "dragControlEnd", e);

        const nextParams = fillEndParams<OnRotateGroupEnd>(moveable, e, {
            targets: moveable.props.targets!,
            events,
        });

        triggerEvent(moveable, "onRotateGroupEnd", nextParams);
        return isDrag;
    },
    /**
     * @method Moveable.Rotatable#request
     * @param {object} [e] - the Resizable's request parameter
     * @param {number} [e.deltaRotate=0] -  delta number of rotation
     * @param {number} [e.rotate=0] - absolute number of moveable's rotation
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * moveable.request("rotatable", { deltaRotate: 10 }, true);
     *
     * * moveable.request("rotatable", { rotate: 10 }, true);
     *
     * // requestStart
     * const requester = moveable.request("rotatable");
     *
     * // request
     * requester.request({ deltaRotate: 10 });
     * requester.request({ deltaRotate: 10 });
     * requester.request({ deltaRotate: 10 });
     *
     * requester.request({ rotate: 10 });
     * requester.request({ rotate: 20 });
     * requester.request({ rotate: 30 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request(moveable: MoveableManagerInterface<RotatableProps>) {
        const datas = {};
        let distRotate = 0;

        const startRotation = moveable.getRotation();
        return {
            isControl: true,
            requestStart() {
                return { datas };
            },
            request(e: IObject<any>) {
                if ("deltaRotate" in e) {
                    distRotate += e.deltaRotate;
                } else if ("rotate" in e) {
                    distRotate = e.rotate - startRotation;
                }

                return { datas, parentDist: distRotate };
            },
            requestEnd() {
                return { datas, isDrag: true };
            },
        };
    },
};
/**
 * Whether or not target can be rotated. (default: false)
 * @name Moveable.Rotatable#rotatable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.rotatable = true;
 */
/**
 * You can specify the position of the rotation. (default: "top")
 * @name Moveable.Rotatable#rotationPosition
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   rotationPosition: "top",
 * });
 *
 * moveable.rotationPosition = "bottom"
 */

/**
 * throttle of angle(degree) when rotate.
 * @name Moveable.Rotatable#throttleRotate
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleRotate = 1;
 */

/**
 * When the rotate starts, the rotateStart event is called.
 * @memberof Moveable.Rotatable
 * @event rotateStart
 * @param {Moveable.Rotatable.OnRotateStart} - Parameters for the rotateStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { rotatable: true });
 * moveable.on("rotateStart", ({ target }) => {
 *     console.log(target);
 * });
 */

/**
* When rotating, the rotate event is called.
* @memberof Moveable.Rotatable
* @event rotate
* @param {Moveable.Rotatable.OnRotate} - Parameters for the rotate event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, { rotatable: true });
* moveable.on("rotate", ({ target, transform, dist }) => {
*     target.style.transform = transform;
* });
*/
/**
 * When the rotate finishes, the rotateEnd event is called.
 * @memberof Moveable.Rotatable
 * @event rotateEnd
 * @param {Moveable.Rotatable.OnRotateEnd} - Parameters for the rotateEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { rotatable: true });
 * moveable.on("rotateEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */

/**
 * When the group rotate starts, the `rotateGroupStart` event is called.
 * @memberof Moveable.Rotatable
 * @event rotateGroupStart
 * @param {Moveable.Rotatable.OnRotateGroupStart} - Parameters for the `rotateGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     rotatable: true
 * });
 * moveable.on("rotateGroupStart", ({ targets }) => {
 *     console.log("onRotateGroupStart", targets);
 * });
 */

/**
* When the group rotate, the `rotateGroup` event is called.
* @memberof Moveable.Rotatable
* @event rotateGroup
* @param {Moveable.Rotatable.OnRotateGroup} - Parameters for the `rotateGroup` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     rotatable: true
* });
* moveable.on("rotateGroup", ({ targets, events }) => {
*     console.log("onRotateGroup", targets);
*     events.forEach(ev => {
*         const target = ev.target;
*         // ev.drag is a drag event that occurs when the group rotate.
*         const left = ev.drag.beforeDist[0];
*         const top = ev.drag.beforeDist[1];
*         const deg = ev.beforeDist;
*     });
* });
*/

/**
 * When the group rotate finishes, the `rotateGroupEnd` event is called.
 * @memberof Moveable.Rotatable
 * @event rotateGroupEnd
 * @param {Moveable.Rotatable.OnRotateGroupEnd} - Parameters for the `rotateGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     rotatable: true
 * });
 * moveable.on("rotateGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onRotateGroupEnd", targets, isDrag);
 * });
 */
