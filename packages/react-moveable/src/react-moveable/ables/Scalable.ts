import {
    getDirection, triggerEvent, multiply2,
    fillParams, fillEndParams, getAbsolutePosesByState, catchEvent, getOffsetSizeDist, getDirectionCondition,
} from "../utils";
import { MIN_SCALE } from "../consts";
import {
    setDragStart, resolveTransformEvent,
    convertTransformFormat,
    getScaleDist,
    fillTransformStartEvent,
    fillTransformEvent,
    getAbsolutePosition,
    setDefaultTransformIndex,
    getPosByDirection,
} from "../gesto/GestoUtils";
import { getRenderDirections } from "../renderDirections";
import {
    ScalableProps, OnScaleGroup, OnScaleGroupEnd,
    OnScaleGroupStart, DraggableProps, OnDragStart,
    SnappableState, GroupableProps, OnScaleStart,
    OnScale, OnScaleEnd, MoveableManagerInterface, MoveableGroupInterface,
    OnBeforeScaleGroup,
    OnBeforeScale,
} from "../types";
import {
    fillChildEvents,
    triggerChildAbles,
} from "../groupUtils";
import Draggable from "./Draggable";
import { calculate, createRotateMatrix, plus, minus } from "@scena/matrix";
import CustomGesto from "../gesto/CustomGesto";
import { checkSnapScale } from "./Snappable";
import {
    isArray, IObject, getDist,
    throttle,
} from "@daybrush/utils";

const directionCondition = getDirectionCondition("scalable");

/**
 * @namespace Scalable
 * @memberof Moveable
 * @description Scalable indicates whether the target's x and y can be scale of transform.
 */
export default {
    name: "scalable",
    ableGroup: "size",
    canPinch: true,
    props: {
        scalable: Boolean,
        throttleScale: Number,
        renderDirections: String,
        keepRatio: Boolean,
        edge: Boolean,
    } as const,
    events: {
        onScaleStart: "scaleStart",
        onBeforeScale: "beforeScale",
        onScale: "scale",
        onScaleEnd: "scaleEnd",
        onScaleGroupStart: "scaleGroupStart",
        onBeforeScaleGroup: "beforeScaleGroup",
        onScaleGroup: "scaleGroup",
        onScaleGroupEnd: "scaleGroupEnd",
    } as const,
    render: getRenderDirections("scalable"),
    dragControlCondition: directionCondition,
    dragControlStart(
        moveable: MoveableManagerInterface<ScalableProps & DraggableProps, SnappableState>,
        e: any) {
        const { datas, isPinch, inputEvent, parentDirection } = e;
        const direction = parentDirection || (isPinch ? [0, 0] : getDirection(inputEvent.target));
        const {
            width,
            height,
            targetTransform,
            target,
            pos1,
            pos2,
            pos4,
        } = moveable.state;

        if (!direction || !target) {
            return false;
        }
        if (!isPinch) {
            setDragStart(moveable, e);
        }
        datas.datas = {};
        datas.transform = targetTransform;
        datas.prevDist = [1, 1];
        datas.direction = direction;
        datas.startOffsetWidth = width;
        datas.startOffsetHeight = height;
        datas.startValue = [1, 1];

        const scaleWidth = getDist(pos1, pos2);
        const scaleHeight = getDist(pos2, pos4);
        const isWidth = (!direction[0] && !direction[1]) || direction[0] || !direction[1];


        datas.scaleWidth = scaleWidth;
        datas.scaleHeight = scaleHeight;
        datas.scaleXRatio = scaleWidth / width;
        datas.scaleYRatio = scaleHeight / height;

        setDefaultTransformIndex(e, "scale");



        datas.isWidth = isWidth;


        function setRatio(ratio: number) {
            datas.ratio = ratio && isFinite(ratio) ? ratio : 0;
        }

        datas.startPositions = getAbsolutePosesByState(moveable.state);
        function setFixedDirection(fixedDirection: number[]) {
            datas.fixedDirection = fixedDirection;
            datas.fixedPosition = getPosByDirection(datas.startPositions, fixedDirection);
        }


        datas.setFixedDirection = setFixedDirection;
        setRatio(getDist(pos1, pos2) / getDist(pos2, pos4));
        setFixedDirection([-direction[0], -direction[1]]);

        const params = fillParams<OnScaleStart>(moveable, e, {
            direction,
            set: (scale: number[]) => {
                datas.startValue = scale;
            },
            setRatio,
            setFixedDirection,
            ...fillTransformStartEvent(e),
            dragStart: Draggable.dragStart(
                moveable,
                new CustomGesto().dragStart([0, 0], e),
            ) as OnDragStart,
        });
        const result = triggerEvent(moveable, "onScaleStart", params);

        datas.startFixedDirection = datas.fixedDirection;

        if (result !== false) {
            datas.isScale = true;
            moveable.state.snapRenderInfo = {
                request: e.isRequest,
                direction,
            };

        }
        return datas.isScale ? params : false;
    },
    dragControl(
        moveable: MoveableManagerInterface<ScalableProps & DraggableProps & GroupableProps, SnappableState>,
        e: any) {
        resolveTransformEvent(e, "scale");
        const {
            datas,
            parentKeepRatio,
            parentFlag, isPinch,
            dragClient,
            isRequest,
        } = e;
        const {
            prevDist,
            direction,
            startOffsetWidth,
            startOffsetHeight,
            isScale,
            startValue,
            isWidth,
            ratio,
        } = datas;

        if (!isScale) {
            return false;
        }

        const props = moveable.props;
        const {
            throttleScale,
            parentMoveable,
        } = props;
        let sizeDirection = direction;

        if (!direction[0] && !direction[1]) {
            sizeDirection = [1, 1];
        }
        const keepRatio = (ratio && (parentKeepRatio != null ? parentKeepRatio : props.keepRatio)) || false;
        const state = moveable.state;

        function getNextScale() {
            const {
                distWidth,
                distHeight,
            } = getOffsetSizeDist(sizeDirection, keepRatio, datas, e);


            let scaleX = (startOffsetWidth + distWidth) / startOffsetWidth;
            let scaleY = (startOffsetHeight + distHeight) / startOffsetHeight;

            scaleX = sizeDirection[0] || keepRatio ? scaleX * startValue[0] : startValue[0];
            scaleY = sizeDirection[1] || keepRatio ? scaleY * startValue[1] : startValue[1];

            if (scaleX === 0) {
                scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
            }
            if (scaleY === 0) {
                scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
            }
            return [scaleX, scaleY];
        }


        let scale = getNextScale();

        if (!isPinch && moveable.props.groupable) {
            const snapRenderInfo = state.snapRenderInfo || {};
            const stateDirection = snapRenderInfo.direction;

            if (isArray(stateDirection) && (stateDirection[0] || stateDirection[1])) {
                state.snapRenderInfo = { direction, request: e.isRequest };
            }
        }

        triggerEvent(moveable, "onBeforeScale", fillParams<OnBeforeScale>(moveable, e, {
            scale,
            setFixedDirection(nextFixedDirection: number[]) {
                datas.setFixedDirection(nextFixedDirection);

                scale = getNextScale();

                return scale;
            },
            startFixedDirection: datas.startFixedDirection,
            setScale(nextScale: number[]) {
                scale = nextScale;
            },
        }, true));

        const dist = [scale[0] / startValue[0], scale[1] / startValue[1]];
        let fixedPosition = dragClient;
        let snapDist = [0, 0];


        if (!dragClient) {
            if (!parentFlag && isPinch) {
                fixedPosition = getAbsolutePosition(moveable, [0, 0]);
            } else {
                fixedPosition = datas.fixedPosition;
            }
        }
        if (!isPinch) {
            snapDist = checkSnapScale(
                moveable,
                dist,
                direction,
                isRequest,
                datas,
            );
        }

        if (keepRatio) {
            if (sizeDirection[0] && sizeDirection[1] && snapDist[0] && snapDist[1]) {
                if (Math.abs(snapDist[0] * startOffsetWidth) > Math.abs(snapDist[1] * startOffsetHeight)) {
                    snapDist[1] = 0;
                } else {
                    snapDist[0] = 0;
                }
            }

            const isNoSnap = !snapDist[0] && !snapDist[1];

            if (isNoSnap) {
                if (isWidth) {
                    dist[0] = throttle(dist[0] * startValue[0], throttleScale!) / startValue[0];
                } else {
                    dist[1] = throttle(dist[1] * startValue[1], throttleScale!) / startValue[1];
                }
            }
            if (
                (sizeDirection[0] && !sizeDirection[1])
                || (snapDist[0] && !snapDist[1])
                || (isNoSnap && isWidth)
            ) {
                dist[0] += snapDist[0];
                const snapHeight = startOffsetWidth * dist[0] * startValue[0] / ratio;

                dist[1] = snapHeight / startOffsetHeight / startValue[1];
            } else if (
                (!sizeDirection[0] && sizeDirection[1])
                || (!snapDist[0] && snapDist[1])
                || (isNoSnap && !isWidth)
            ) {
                dist[1] += snapDist[1];
                const snapWidth = startOffsetHeight * dist[1] * startValue[1] * ratio;

                dist[0] = snapWidth / startOffsetWidth / startValue[0];
            }
        } else {
            dist[0] += snapDist[0];
            dist[1] += snapDist[1];
            if (!snapDist[0]) {
                dist[0] = throttle(dist[0] * startValue[0], throttleScale!) / startValue[0];
            }
            if (!snapDist[1]) {
                dist[1] = throttle(dist[1] * startValue[1], throttleScale!) / startValue[1];
            }
        }

        if (dist[0] === 0) {
            dist[0] = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }
        if (dist[1] === 0) {
            dist[1] = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }
        const delta = [dist[0] / prevDist[0], dist[1] / prevDist[1]];
        scale = multiply2(dist, startValue);

        const inverseDist = getScaleDist(moveable, dist, datas.fixedDirection, fixedPosition, datas);
        const inverseDelta = minus(inverseDist, datas.prevInverseDist || [0, 0]);

        datas.prevDist = dist;
        datas.prevInverseDist = inverseDist;
        if (
            scale[0] === prevDist[0] && scale[1] === prevDist[1]
            && inverseDelta.every(num => !num)
            && !parentMoveable
        ) {
            return false;
        }


        const nextTransform = convertTransformFormat(
            datas, `scale(${scale.join(", ")})`, `scale(${dist.join(", ")})`);
        const params = fillParams<OnScale>(moveable, e, {
            offsetWidth: startOffsetWidth,
            offsetHeight: startOffsetHeight,
            direction,

            scale,
            dist,
            delta,

            isPinch: !!isPinch,
            ...fillTransformEvent(
                moveable,
                nextTransform,
                inverseDelta,
                isPinch,
                e,
            ),
        });
        triggerEvent(moveable, "onScale", params);

        return params;
    },
    dragControlEnd(moveable: MoveableManagerInterface<ScalableProps>, e: any) {
        const { datas } = e;
        if (!datas.isScale) {
            return false;
        }

        datas.isScale = false;

        const scaleEndParam = fillEndParams<OnScaleEnd>(moveable, e, {});
        triggerEvent(moveable, "onScaleEnd", scaleEndParam);
        return scaleEndParam;
    },
    dragGroupControlCondition: directionCondition,
    dragGroupControlStart(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { datas } = e;

        const params = this.dragControlStart(moveable, e);

        if (!params) {
            return false;
        }
        const originalEvents = fillChildEvents(moveable, "resizable", e);

        function setDist(child: MoveableManagerInterface, ev: any) {
            const fixedDirection = datas.fixedDirection;
            const fixedPosition = datas.fixedPosition;
            const startPositions = ev.datas.startPositions || getAbsolutePosesByState(child.state);
            const pos = getPosByDirection(startPositions, fixedDirection);
            const [originalX, originalY] = calculate(
                createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3),
                [pos[0] - fixedPosition[0], pos[1] - fixedPosition[1], 1],
                3,
            );
            ev.datas.originalX = originalX;
            ev.datas.originalY = originalY;

            return ev;
        }

        datas.moveableScale = moveable.scale;

        const events = triggerChildAbles(
            moveable,
            this,
            "dragControlStart",
            e,
            (child, ev) => {
                return setDist(child, ev);
            },
        );

        const setFixedDirection = (fixedDirection: number[]) => {
            params.setFixedDirection(fixedDirection);
            events.forEach((ev, i) => {
                ev.setFixedDirection(fixedDirection);
                setDist(ev.moveable, originalEvents[i]);
            });
        };

        datas.setFixedDirection = setFixedDirection;
        const nextParams: OnScaleGroupStart = {
            ...params,
            targets: moveable.props.targets!,
            events,
            setFixedDirection,
        };
        const result = triggerEvent(moveable, "onScaleGroupStart", nextParams);

        datas.isScale = result !== false;
        return datas.isScale ? nextParams : false;
    },
    dragGroupControl(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { datas } = e;
        if (!datas.isScale) {
            return;
        }

        catchEvent(moveable, "onBeforeScale", parentEvent => {
            triggerEvent(moveable, "onBeforeScaleGroup", fillParams<OnBeforeScaleGroup>(moveable, e, {
                ...parentEvent,
                targets: moveable.props.targets!,
            }, true));
        });

        const params = this.dragControl(moveable, e);
        if (!params) {
            return;
        }

        const moveableScale = datas.moveableScale;
        moveable.scale = [
            params.scale[0] * moveableScale[0],
            params.scale[1] * moveableScale[1],
        ];
        const keepRatio = moveable.props.keepRatio;
        const { dist, scale } = params;

        const fixedPosition = datas.fixedPosition;

        const events = triggerChildAbles(
            moveable,
            this,
            "dragControl",
            e,
            (_, ev) => {
                const [clientX, clientY] = calculate(
                    createRotateMatrix(moveable.rotation / 180 * Math.PI, 3),
                    [
                        ev.datas.originalX * dist[0],
                        ev.datas.originalY * dist[1],
                        1,
                    ],
                    3,
                );

                return {
                    ...ev,
                    parentDist: null,
                    parentScale: scale,
                    parentKeepRatio: keepRatio,
                    dragClient: plus(fixedPosition, [clientX, clientY]),
                };
            },
        );
        const nextParams: OnScaleGroup = {
            targets: moveable.props.targets!,
            events,
            ...params,
        };

        triggerEvent(moveable, "onScaleGroup", nextParams);
        return nextParams;
    },
    dragGroupControlEnd(moveable: MoveableGroupInterface<any, any>, e: any) {
        const { isDrag, datas } = e;

        if (!datas.isScale) {
            return;
        }
        this.dragControlEnd(moveable, e);
        const events = triggerChildAbles(moveable, this, "dragControlEnd", e);

        const nextParams = fillEndParams<OnScaleGroupEnd>(moveable, e, {
            targets: moveable.props.targets!,
            events,
        });

        triggerEvent(moveable, "onScaleGroupEnd", nextParams);
        return isDrag;
    },
    /**
     * @method Moveable.Scalable#request
     * @param {Moveable.Scalable.ScalableRequestParam} e - the Scalable's request parameter
     * @return {Moveable.Requester} Moveable Requester
     * @example

     * // Instantly Request (requestStart - request - requestEnd)
     * moveable.request("scalable", { deltaWidth: 10, deltaHeight: 10 }, true);
     *
     * // requestStart
     * const requester = moveable.request("scalable");
     *
     * // request
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     * requester.request({ deltaWidth: 10, deltaHeight: 10 });
     *
     * // requestEnd
     * requester.requestEnd();
     */
    request() {
        const datas = {};
        let distWidth = 0;
        let distHeight = 0;

        return {
            isControl: true,
            requestStart(e: IObject<any>) {
                return { datas, parentDirection: e.direction || [1, 1] };
            },
            request(e: IObject<any>) {
                distWidth += e.deltaWidth;
                distHeight += e.deltaHeight;

                return { datas, parentDist: [distWidth, distHeight], parentKeepRatio: e.keepRatio };
            },
            requestEnd() {
                return { datas, isDrag: true };
            },
        };
    },
};

/**
 * Whether or not target can scaled.
 *
 * @name Moveable.Scalable#scalable
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.scalable = true;
 */

/**
 * throttle of scaleX, scaleY when scale.
 * @name Moveable.Scalable#throttleScale
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleScale = 0.1;
 */
/**
 * Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
 * @name Moveable.Scalable#renderDirections
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     scalable: true,
 *   renderDirections: ["n", "nw", "ne", "s", "se", "sw", "e", "w"],
 * });
 *
 * moveable.renderDirections = ["nw", "ne", "sw", "se"];
 */
/**
 * When resize or scale, keeps a ratio of the width, height. (default: false)
 * @name Moveable.Scalable#keepRatio
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     scalable: true,
 * });
 *
 * moveable.keepRatio = true;
 */
/**
 * When the scale starts, the scaleStart event is called.
 * @memberof Moveable.Scalable
 * @event scaleStart
 * @param {Moveable.Scalable.OnScaleStart} - Parameters for the scaleStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("scaleStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When scaling, `beforeScale` is called before `scale` occurs. In `beforeScale`, you can get and set the pre-value before scaling.
 * @memberof Moveable.Scalable
 * @event beforeScale
 * @param {Moveable.Scalable.OnBeforeScale} - Parameters for the `beforeScale` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("beforeScale", ({ setFixedDirection }) => {
 *     if (shiftKey) {
 *        setFixedDirection([0, 0]);
 *     }
 * });
 * moveable.on("scale", ({ target, transform, dist }) => {
 *     target.style.transform = transform;
 * });
 */

/**
 * When scaling, the `scale` event is called.
 * @memberof Moveable.Scalable
 * @event scale
 * @param {Moveable.Scalable.OnScale} - Parameters for the `scale` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("scale", ({ target, transform, dist }) => {
 *     target.style.transform = transform;
 * });
 */
/**
 * When the scale finishes, the `scaleEnd` event is called.
 * @memberof Moveable.Scalable
 * @event scaleEnd
 * @param {Moveable.Scalable.OnScaleEnd} - Parameters for the `scaleEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("scaleEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */

/**
* When the group scale starts, the `scaleGroupStart` event is called.
* @memberof Moveable.Scalable
* @event scaleGroupStart
* @param {Moveable.Scalable.OnScaleGroupStart} - Parameters for the `scaleGroupStart` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     scalable: true
* });
* moveable.on("scaleGroupStart", ({ targets }) => {
*     console.log("onScaleGroupStart", targets);
* });
*/

/**
* When the group scale, the `scaleGroup` event is called.
* @memberof Moveable.Scalable
* @event scaleGroup
* @param {Moveable.Scalable.OnScaleGroup} - Parameters for the `scaleGroup` event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, {
*     target: [].slice.call(document.querySelectorAll(".target")),
*     scalable: true
* });
* moveable.on("scaleGroup", ({ targets, events }) => {
*     console.log("onScaleGroup", targets);
*     events.forEach(ev => {
*         const target = ev.target;
*         // ev.drag is a drag event that occurs when the group scale.
*         const left = ev.drag.beforeDist[0];
*         const top = ev.drag.beforeDist[1];
*         const scaleX = ev.scale[0];
*         const scaleY = ev.scale[1];
*     });
* });
*/

/**
 * When the group scale finishes, the `scaleGroupEnd` event is called.
 * @memberof Moveable.Scalable
 * @event scaleGroupEnd
 * @param {Moveable.Scalable.OnScaleGroupEnd} - Parameters for the `scaleGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     scalable: true
 * });
 * moveable.on("scaleGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onScaleGroupEnd", targets, isDrag);
 * });
 */
