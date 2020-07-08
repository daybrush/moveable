import { triggerEvent, fillParams, fillEndParams } from "../utils";
import {
    PinchableProps, Able, SnappableState,
    OnPinchStart, OnPinch, OnPinchEnd, MoveableManagerInterface, MoveableGroupInterface,
} from "../types";

/**
 * @namespace Moveable.Pinchable
 * @description Whether or not target can be pinched with draggable, resizable, scalable, rotatable (default: false)
 */
export default {
    name: "pinchable",
    updateRect: true,
    props: {
        pinchable: Boolean,
    } as const,
    events: {
        onPinchStart: "pinchStart",
        onPinch: "pinch",
        onPinchEnd: "pinchEnd",
        onPinchGroupStart: "pinchStart",
        onPinchGroup: "pinch",
        onPinchGroupEnd: "pinchEnd",
    } as const,
    pinchStart(
        moveable: MoveableManagerInterface<PinchableProps, SnappableState>,
        e: any,
    ) {
        const { datas, targets, angle } = e;
        const { pinchable, ables } = moveable.props;

        if (!pinchable) {
            return false;
        }
        const eventName = `onPinch${targets ? "Group" : ""}Start` as "onPinchStart";
        const controlEventName = `drag${targets ? "Group" : ""}ControlStart` as "dragControlStart";

        const pinchAbles = (pinchable === true ? moveable.controlAbles : ables!.filter(able => {
            return pinchable.indexOf(able.name as any) > -1;
        })).filter(able => able.canPinch && able[controlEventName]);

        const params = fillParams<OnPinchStart>(moveable, e, {}) as any;

        if (targets) {
            params.targets = targets;
        }
        const result = triggerEvent(moveable, eventName, params);

        datas.isPinch = result !== false;
        datas.ables = pinchAbles;

        const isPinch = datas.isPinch;

        if (!isPinch) {
            return false;
        }
        pinchAbles.forEach(able => {
            datas[able.name + "Datas"] = {};

            if (!able[controlEventName]) {
                return;
            }
            const ableEvent: any = {
                ...e,
                datas: datas[able.name + "Datas"],
                parentRotate: angle,
                isPinch: true,
            };
            able[controlEventName]!(moveable, ableEvent);
        });

        moveable.state.snapRenderInfo = {
            request: e.isRequest,
            direction: [0, 0],
        };
        return isPinch;
    },
    pinch(
        moveable: MoveableManagerInterface<PinchableProps>,
        e: any,
    ) {
        const {
            datas, scale: pinchScale, distance,
            inputEvent, targets,
            angle,
        } = e;
        if (!datas.isPinch) {
            return;
        }
        const parentDistance = distance * (1 - 1 / pinchScale);
        const params = fillParams<OnPinch>(moveable, e, {}) as any;

        if (targets) {
            params.targets = targets;
        }
        const eventName = `onPinch${targets ? "Group" : ""}` as "onPinch";
        triggerEvent(moveable, eventName, params);

        const ables: Able[] = datas.ables;
        const controlEventName = `drag${targets ? "Group" : ""}Control` as "dragControl";

        ables.forEach(able => {
            if (!able[controlEventName]) {
                return;
            }
            able[controlEventName]!(moveable, {
                ...e,
                datas: datas[able.name + "Datas"],
                inputEvent,
                parentDistance,
                parentRotate: angle,
                isPinch: true,
            } as any);
        });
        return params;
    },
    pinchEnd(
        moveable: MoveableManagerInterface<PinchableProps>,
        e: any,
    ) {
        const { datas, isPinch, inputEvent, targets } = e;
        if (!datas.isPinch) {
            return;
        }
        const eventName = `onPinch${targets ? "Group" : ""}End` as "onPinchEnd";

        const params = fillEndParams<OnPinchEnd>(moveable, e, { isDrag: isPinch }) as any;

        if (targets) {
            params.targets = targets;
        }
        triggerEvent(moveable, eventName, params);
        const ables: Able[] = datas.ables;
        const controlEventName = `drag${targets ? "Group" : ""}ControlEnd` as "dragControlEnd";

        ables.forEach(able => {
            if (!able[controlEventName]) {
                return;
            }
            able[controlEventName]!(moveable, {
                ...e,
                isDrag: isPinch,
                datas: datas[able.name + "Datas"],
                inputEvent,
                isPinch: true,
            } as any);
        });
        return isPinch;
    },
    pinchGroupStart(moveable: MoveableGroupInterface<any, any>, e: any) {
        return this.pinchStart(moveable, { ...e, targets: moveable.props.targets });
    },
    pinchGroup(moveable: MoveableGroupInterface, e: any) {
        return this.pinch(moveable, { ...e, targets: moveable.props.targets });
    },
    pinchGroupEnd(moveable: MoveableGroupInterface, e: any) {
        return this.pinchEnd(moveable, { ...e, targets: moveable.props.targets });
    },
};

/**
 * Whether or not target can be pinched with draggable, resizable, scalable, rotatable (default: false)
 * @name Moveable.Pinchable#pinchable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.pinchable = true;
 */

/**
 * When the pinch starts, the pinchStart event is called with part of scaleStart, rotateStart, resizeStart
 * @memberof Moveable.Pinchable
 * @event pinchStart
 * @param {Moveable.Pinchable.OnPinchStart} - Parameters for the pinchStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     rotatable: true,
 *     scalable: true,
 *     pinchable: true, // ["rotatable", "scalable"]
 * });
 * moveable.on("pinchStart", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("rotateStart", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("scaleStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When pinching, the pinch event is called with part of scale, rotate, resize
 * @memberof Moveable.Pinchable
 * @event pinch
 * @param {Moveable.Pinchable.OnPinch} - Parameters for the pinch event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     rotatable: true,
 *     scalable: true,
 *     pinchable: true, // ["rotatable", "scalable"]
 * });
 * moveable.on("pinch", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("rotate", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("scale", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When the pinch finishes, the pinchEnd event is called.
 * @memberof Moveable.Pinchable
 * @event pinchEnd
 * @param {Moveable.Pinchable.OnPinchEnd} - Parameters for the pinchEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     rotatable: true,
 *     scalable: true,
 *     pinchable: true, // ["rotatable", "scalable"]
 * });
 * moveable.on("pinchEnd", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("rotateEnd", ({ target }) => {
 *     console.log(target);
 * });
 * moveable.on("scaleEnd", ({ target }) => {
 *     console.log(target);
 * });
 */

/**
 * When the group pinch starts, the `pinchGroupStart` event is called.
 * @memberof Moveable.Pinchable
 * @event pinchGroupStart
 * @param {Moveable.Pinchable.OnPinchGroupStart} - Parameters for the `pinchGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     pinchable: true
 * });
 * moveable.on("pinchGroupStart", ({ targets }) => {
 *     console.log("onPinchGroupStart", targets);
 * });
 */

/**
 * When the group pinch, the `pinchGroup` event is called.
 * @memberof Moveable.Pinchable
 * @event pinchGroup
 * @param {Moveable.Pinchable.OnPinchGroup} - Parameters for the `pinchGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     pinchable: true
 * });
 * moveable.on("pinchGroup", ({ targets, events }) => {
 *     console.log("onPinchGroup", targets);
 * });
 */

/**
 * When the group pinch finishes, the `pinchGroupEnd` event is called.
 * @memberof Moveable.Pinchable
 * @event pinchGroupEnd
 * @param {Moveable.Pinchable.OnPinchGroupEnd} - Parameters for the `pinchGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     pinchable: true
 * });
 * moveable.on("pinchGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onPinchGroupEnd", targets, isDrag);
 * });
 */
