import EgComponent from "@egjs/component";
import { ref, Properties } from "framework-utils";
import { h, render } from "preact";
import InnerMoveable from "./InnerMoveable";
import { MoveableOptions, MoveableGetterSetter } from "./types";
import {
    OnDragStart, OnDrag, OnResize, OnResizeStart,
    OnResizeEnd, OnScaleStart, OnScaleEnd, OnRotateStart,
    OnRotateEnd, OnDragEnd, OnRotate, OnScale,
    OnWarpStart, OnWarpEnd, OnWarp, OnPinchStart,
    OnPinch, OnPinchEnd, OnDragGroup, OnDragGroupStart,
    OnDragGroupEnd, OnResizeGroup, OnResizeGroupStart,
    OnResizeGroupEnd, OnScaleGroup, OnScaleGroupEnd,
    OnRotateGroup, OnRotateGroupStart, OnRotateGroupEnd,
    OnPinchGroup, OnPinchGroupStart, OnPinchGroupEnd, OnScaleGroupStart, OnClickGroup,
} from "react-moveable/declaration/types";
import { PROPERTIES, EVENTS } from "./consts";
import { camelize, isArray } from "@daybrush/utils";

/**
 * Moveable is Draggable! Resizable! Scalable! Rotatable!
 * @sort 1
 * @extends eg.Component
 */
@Properties(PROPERTIES, (prototype, property) => {
    Object.defineProperty(prototype, property, {
        get() {
            return this.getMoveable().props[property];
        },
        set(value) {
            this.innerMoveable.setState({
                [property]: value,
            });
        },
        enumerable: true,
        configurable: true,
    });
})
class Moveable extends EgComponent {
    private innerMoveable!: InnerMoveable;

    /**
     *
     */
    constructor(parentElement: HTMLElement | SVGElement, options: MoveableOptions = {}) {
        super();
        const element = document.createElement("div");
        const nextOptions = { container: parentElement, ...options };

        const events: any = {};

        EVENTS.forEach(name => {
            events[camelize(`on ${name}`)] = (e: any) => this.trigger(name, e);
        });

        render(
            <InnerMoveable
                ref={ref(this, "innerMoveable")}
                {...nextOptions}
                {...events}
            />,
            element,
        );
        parentElement.appendChild(element.children[0]);

        const target = nextOptions.target!;
        if (isArray(target) && target.length > 1) {
            this.updateRect();
        }
    }
    /**
     * Check if the target is an element included in the moveable.
     * @param - the target
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * window.addEventListener("click", e => {
     *     if (!moveable.isMoveableElement(e.target)) {
     *         moveable.target = e.target;
     *     }
     * });
     */
    public isMoveableElement(target: HTMLElement | SVGElement) {
        return this.getMoveable().isMoveableElement(target);
    }
    /**
     * If the width, height, left, and top of all elements change, update the shape of the moveable.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * window.addEventListener("resize", e => {
     *     moveable.updateRect();
     * });
     */
    public updateRect() {
        this.getMoveable().updateRect();
    }
    /**
     * You can move the Moveable through the external `MouseEvent`or `TouchEvent`.
     * @param - external `MouseEvent`or `TouchEvent`
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * document.body.addEventListener("mousedown", e => {
     *     if (!moveable.isMoveableElement(e.target)) {
     *          moveable.dragStart(e);
     *     }
     * });
     */
    public dragStart(e: MouseEvent | TouchEvent): void {
        this.getMoveable().dragStart(e);
    }

    /**
     * Whether the coordinates are inside Moveable
     * @param - x coordinate
     * @param - y coordinate
     * @return - True if the coordinate is in moveable or false
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * document.body.addEventListener("mousedown", e => {
     *     if (moveable.isInside(e.clientX, e.clientY)) {
     *          console.log("inside");
     *     }
     * });
     */
    public isInside(clientX: number, clientY: number): boolean {
        return this.getMoveable().isInside(clientX, clientY);
    }

    /**
     * If the width, height, left, and top of the only target change, update the shape of the moveable.
     * @param - the values of x and y to move moveable.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.updateTarget();
     */
    public updateTarget(): void {
        this.getMoveable().updateTarget();
    }
    /**
     * Remove the Moveable object and the events.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.destroy();
     */
    public destroy() {
        const el = this.getMoveable().base;

        el.remove ? el.remove() : el.parentElement.removeChild(el);
        this.off();
        this.getMoveable().destroy();
        this.innerMoveable = null;
    }
    private getMoveable() {
        return this.innerMoveable.preactMoveable;
    }
}
/**
 * Whether or not the origin controlbox will be visible or not
 * @name Moveable#origin
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.origin = true;
 */
/**
 * The target to indicate Moveable Control Box.
 * @name Moveable#target
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 * moveable.target = document.querySelector(".target");
 */
/**
 * Whether or not target can be dragged.
 * @name Moveable#draggable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.draggable = true;
 */
/**
 * Whether or not target can be resized.
 * @name Moveable#resizable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.resizable = true;
 */
/**
 * Whether or not target can scaled.
 * @name Moveable#scalable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.scalable = true;
 */
/**
 * Whether or not target can be rotated.
 * @name Moveable#rotatable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.rotatable = true;
 */
/**
 * Whether or not target can be warped.
 * @name Moveable#warpable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.warpable = true;
 */
/**
 * Whether or not target can be pinched with draggable, resizable, scalable, rotatable
 * @name Moveable#pinchable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.pinchable = true;
 */
/**
 * When resize or scale, keeps a ratio of the width, height.
 * @name Moveable#keepRatio
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.keepRatio = true;
 */
/**
 * Resize, Scale Events at edges
 * @name Moveable#edge
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 * moveable.edge = true;
 */
/**
 * throttle of x, y when drag.
 * @name Moveable#throttleDrag
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleDrag = 1;
 */
/**
 * throttle of width, height when resize.
 * @name Moveable#throttleResize
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleResize = 1;
 */
/**
 * throttle of scaleX, scaleY when scale.
 * @name Moveable#throttleScale
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleScale = 0.1;
 */
/**
 * throttle of angle(degree) when rotate.
 * @name Moveable#throttleRotate
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleRotate = 1;
 */

 /**
 * Whether or not target can be snapped to the guideline. (default: false)
 * @name Moveable#snappable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snappable = true;
 */
/**
 * When you drag, make the snap in the center of the target. (default: false)
 * @name Moveable#snapCenter
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapCenter = true;
 */

/**
 * Distance value that can snap to guidelines. (default: 5)
 * @name Moveable#snapThreshold
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.snapThreshold = 5;
 */

/**
 * Add guidelines in the horizontal direction. (default: [])
 * @name Moveable#horizontalGuidlines
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.horizontalGuidlines = [100, 200, 500];
 */

/**
 * Add guidelines in the vertical direction. (default: [])
 * @name Moveable#
 * moveable.verticalGuidlines
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.verticalGuidlines = [100, 200, 500];
 */
/**
 * Add guidelines for the element. (default: [])
 * @name Moveable#elementGuidelines
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.elementGuidelines = [
 *   document.querySelector(".element"),
 * ];
 */
/**
 * You can set up boundaries. (default: [])
 * @name Moveable#bounds
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.bounds = { left: 0, right: 1000, top: 0, bottom: 1000};
 */
/**
 * Add an event to the moveable area instead of the target for stopPropagation. (default: false)
 * @name Moveable#dragArea
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *  dragArea: false,
 * });
 */
/**
 * You can specify the position of the rotation. (default: "top")
 * @name Moveable#rotationPosition
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
 * When the drag starts, the dragStart event is called.
 * @memberof Moveable
 * @event dragStart
 * @param {Moveable.OnDragStart} - Parameters for the dragStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { draggable: true });
 * moveable.on("dragStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When dragging, the drag event is called.
 * @memberof Moveable
 * @event drag
 * @param {Moveable.OnDrag} - Parameters for the drag event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { draggable: true });
 * moveable.on("drag", ({ target, transform }) => {
 *     target.style.transform = transform;
 * });
 */
/**
 * When the drag finishes, the dragEnd event is called.
 * @memberof Moveable
 * @event dragEnd
 * @param {Moveable.OnDragEnd} - Parameters for the dragEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { draggable: true });
 * moveable.on("dragEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
/**
 * When the resize starts, the resizeStart event is called.
 * @memberof Moveable
 * @event resizeStart
 * @param {Moveable.OnResizeStart} - Parameters for the resizeStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("resizeStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When resizing, the resize event is called.
 * @memberof Moveable
 * @event resize
 * @param {Moveable.OnResize} - Parameters for the resize event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("resize", ({ target, width, height }) => {
 *     target.style.width = `${e.width}px`;
 *     target.style.height = `${e.height}px`;
 * });
 */
/**
 * When the resize finishes, the resizeEnd event is called.
 * @memberof Moveable
 * @event resizeEnd
 * @param {Moveable.OnResizeEnd} - Parameters for the resizeEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { resizable: true });
 * moveable.on("resizeEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
/**
 * When the scale starts, the scaleStart event is called.
 * @memberof Moveable
 * @event scaleStart
 * @param {Moveable.OnScaleStart} - Parameters for the scaleStart event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("scaleStart", ({ target }) => {
 *     console.log(target);
 * });
 */
/**
 * When scaling, the scale event is called.
 * @memberof Moveable
 * @event scale
 * @param {Moveable.OnScale} - Parameters for the scale event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("scale", ({ target, transform, dist }) => {
 *     target.style.transform = transform;
 * });
 */
/**
 * When the scale finishes, the scaleEnd event is called.
 * @memberof Moveable
 * @event scaleEnd
 * @param {Moveable.OnScaleEnd} - Parameters for the scaleEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { scalable: true });
 * moveable.on("scaleEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
/**
 * When the rotate starts, the rotateStart event is called.
 * @memberof Moveable
 * @event rotateStart
 * @param {Moveable.OnRotateStart} - Parameters for the rotateStart event
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
 * @memberof Moveable
 * @event rotate
 * @param {Moveable.OnRotate} - Parameters for the rotate event
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
 * @memberof Moveable
 * @event rotateEnd
 * @param {Moveable.OnRotateEnd} - Parameters for the rotateEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { rotatable: true });
 * moveable.on("rotateEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */

/**
* When the warp starts, the warpStart event is called.
* @memberof Moveable
* @event warpStart
* @param {Moveable.OnWarpStart} - Parameters for the warpStart event
* @example
* import Moveable from "moveable";
*
* const moveable = new Moveable(document.body, { warpable: true });
* moveable.on("warpStart", ({ target }) => {
*     console.log(target);
* });
*/
/**
 * When warping, the warp event is called.
 * @memberof Moveable
 * @event warp
 * @param {Moveable.OnWarp} - Parameters for the warp event
 * @example
 * import Moveable from "moveable";
 * let matrix = [
 *  1, 0, 0, 0,
 *  0, 1, 0, 0,
 *  0, 0, 1, 0,
 *  0, 0, 0, 1,
 * ];
 * const moveable = new Moveable(document.body, { warpable: true });
 * moveable.on("warp", ({ target, transform, delta, multiply }) => {
 *    // target.style.transform = transform;
 *    matrix = multiply(matrix, delta);
 *    target.style.transform = `matrix3d(${matrix.join(",")})`;
 * });
 */
/**
 * When the warp finishes, the warpEnd event is called.
 * @memberof Moveable
 * @event warpEnd
 * @param {Moveable.OnWarpEnd} - Parameters for the warpEnd event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, { warpable: true });
 * moveable.on("warpEnd", ({ target, isDrag }) => {
 *     console.log(target, isDrag);
 * });
 */
/**
 * When the pinch starts, the pinchStart event is called with part of scaleStart, rotateStart, resizeStart
 * @memberof Moveable
 * @event pinchStart
 * @param {Moveable.OnPinchStart} - Parameters for the pinchStart event
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
 * @memberof Moveable
 * @event pinch
 * @param {Moveable.OnPinch} - Parameters for the pinch event
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
 * @memberof Moveable
 * @event pinchEnd
 * @param {Moveable.OnPinchEnd} - Parameters for the pinchEnd event
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
 * When the group drag starts, the `dragGroupStart` event is called.
 * @memberof Moveable
 * @event dragGroupStart
 * @param {Moveable.OnDragGroupStart} - Parameters for the `dragGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     draggable: true
 * });
 * moveable.on("dragGroupStart", ({ targets }) => {
 *     console.log("onDragGroupStart", targets);
 * });
 */

 /**
 * When the group drag, the `dragGroup` event is called.
 * @memberof Moveable
 * @event dragGroup
 * @param {Moveable.onDragGroup} - Parameters for the `dragGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     draggable: true
 * });
 * moveable.on("dragGroup", ({ targets, events }) => {
 *     console.log("onDragGroup", targets);
 *     events.forEach(ev => {
 *          // drag event
 *          console.log("onDrag left, top", ev.left, ev.top);
 *          // ev.target!.style.left = `${ev.left}px`;
 *          // ev.target!.style.top = `${ev.top}px`;
 *          console.log("onDrag translate", ev.dist);
 *          ev.target!.style.transform = ev.transform;)
 *     });
 * });
 */

/**
 * When the group drag finishes, the `dragGroupEnd` event is called.
 * @memberof Moveable
 * @event dragGroupEnd
 * @param {Moveable.OnDragGroupEnd} - Parameters for the `dragGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     draggable: true
 * });
 * moveable.on("dragGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onDragGroupEnd", targets, isDrag);
 * });
 */

 /**
 * When the group resize starts, the `resizeGroupStart` event is called.
 * @memberof Moveable
 * @event resizeGroupStart
 * @param {Moveable.OnResizeGroupStart} - Parameters for the `resizeGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     resizable: true
 * });
 * moveable.on("resizeGroupStart", ({ targets }) => {
 *     console.log("onResizeGroupStart", targets);
 * });
 */

 /**
 * When the group resize, the `resizeGroup` event is called.
 * @memberof Moveable
 * @event resizeGroup
 * @param {Moveable.onResizeGroup} - Parameters for the `resizeGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     resizable: true
 * });
 * moveable.on("resizeGroup", ({ targets, events }) => {
 *     console.log("onResizeGroup", targets);
 *     events.forEach(ev => {
 *         const offset = [
 *             direction[0] < 0 ? -ev.delta[0] : 0,
 *             direction[1] < 0 ? -ev.delta[1] : 0,
 *         ];
 *         // ev.drag is a drag event that occurs when the group resize.
 *         const left = offset[0] + ev.drag.beforeDist[0];
 *         const top = offset[1] + ev.drag.beforeDist[1];
 *         const width = ev.width;
 *         const top = ev.top;
 *     });
 * });
 */

/**
 * When the group resize finishes, the `resizeGroupEnd` event is called.
 * @memberof Moveable
 * @event resizeGroupEnd
 * @param {Moveable.OnResizeGroupEnd} - Parameters for the `resizeGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 *     resizable: true
 * });
 * moveable.on("resizeGroupEnd", ({ targets, isDrag }) => {
 *     console.log("onResizeGroupEnd", targets, isDrag);
 * });
 */

 /**
 * When the group scale starts, the `scaleGroupStart` event is called.
 * @memberof Moveable
 * @event scaleGroupStart
 * @param {Moveable.OnScaleGroupStart} - Parameters for the `scaleGroupStart` event
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
 * @memberof Moveable
 * @event scaleGroup
 * @param {Moveable.OnScaleGroup} - Parameters for the `scaleGroup` event
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
 * @memberof Moveable
 * @event scaleGroupEnd
 * @param {Moveable.OnScaleGroupEnd} - Parameters for the `scaleGroupEnd` event
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

/**
 * When the group rotate starts, the `rotateGroupStart` event is called.
 * @memberof Moveable
 * @event rotateGroupStart
 * @param {Moveable.OnRotateGroupStart} - Parameters for the `rotateGroupStart` event
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
 * @memberof Moveable
 * @event rotateGroup
 * @param {Moveable.OnRotateGroup} - Parameters for the `rotateGroup` event
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
 * @memberof Moveable
 * @event rotateGroupEnd
 * @param {Moveable.OnRotateGroupEnd} - Parameters for the `rotateGroupEnd` event
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

/**
 * When the group pinch starts, the `pinchGroupStart` event is called.
 * @memberof Moveable
 * @event pinchGroupStart
 * @param {Moveable.OnPinchGroupStart} - Parameters for the `pinchGroupStart` event
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
 * @memberof Moveable
 * @event pinchGroup
 * @param {Moveable.OnPinchGroup} - Parameters for the `pinchGroup` event
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
 * @memberof Moveable
 * @event pinchGroupEnd
 * @param {Moveable.OnPinchGroupEnd} - Parameters for the `pinchGroupEnd` event
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

 /**
 * When you click on the element inside the group, the `clickGroup` event is called.
 * @memberof Moveable
 * @event clickGroup
 * @param {Moveable.OnClickGroup} - Parameters for the `clickGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 * });
 * moveable.on("clickGroup", ({ target, hasTarget, containsTarget, targetIndex }) => {
 *     // If you click on an element other than the target and not included in the target, index is -1.
 *     console.log("onClickGroup", target, hasTarget, containsTarget, targetIndex);
 * });
 */

interface Moveable extends MoveableGetterSetter {
    on(eventName: "drag", handlerToAttach: (event: OnDrag) => any): this;
    on(eventName: "dragStart", handlerToAttach: (event: OnDragStart) => any): this;
    on(eventName: "dragEnd", handlerToAttach: (event: OnDragEnd) => any): this;

    on(eventName: "resize", handlerToAttach: (event: OnResize) => any): this;
    on(eventName: "resizeStart", handlerToAttach: (event: OnResizeStart) => any): this;
    on(eventName: "resizeEnd", handlerToAttach: (event: OnResizeEnd) => any): this;

    on(eventName: "scale", handlerToAttach: (event: OnScale) => any): this;
    on(eventName: "scaleStart", handlerToAttach: (event: OnScaleStart) => any): this;
    on(eventName: "scaleEnd", handlerToAttach: (event: OnScaleEnd) => any): this;

    on(eventName: "rotate", handlerToAttach: (event: OnRotate) => any): this;
    on(eventName: "rotateStart", handlerToAttach: (event: OnRotateStart) => any): this;
    on(eventName: "rotateEnd", handlerToAttach: (event: OnRotateEnd) => any): this;

    on(eventName: "warp", handlerToAttach: (event: OnWarp) => any): this;
    on(eventName: "warpStart", handlerToAttach: (event: OnWarpStart) => any): this;
    on(eventName: "warpEnd", handlerToAttach: (event: OnWarpEnd) => any): this;

    on(eventName: "pinch", handlerToAttach: (event: OnPinch) => any): this;
    on(eventName: "pinchStart", handlerToAttach: (event: OnPinchStart) => any): this;
    on(eventName: "pinchEnd", handlerToAttach: (event: OnPinchEnd) => any): this;

    on(eventName: "dragGroup", handlerToAttach: (event: OnDragGroup) => any): this;
    on(eventName: "dragGroupStart", handlerToAttach: (event: OnDragGroupStart) => any): this;
    on(eventName: "dragGroupEnd", handlerToAttach: (event: OnDragGroupEnd) => any): this;

    on(eventName: "resizeGroup", handlerToAttach: (event: OnResizeGroup) => any): this;
    on(eventName: "resizeGroupStart", handlerToAttach: (event: OnResizeGroupStart) => any): this;
    on(eventName: "resizeGroupEnd", handlerToAttach: (event: OnResizeGroupEnd) => any): this;

    on(eventName: "scaleGroup", handlerToAttach: (event: OnScaleGroup) => any): this;
    on(eventName: "scaleGroupStart", handlerToAttach: (event: OnScaleGroupStart) => any): this;
    on(eventName: "scaleGroupEnd", handlerToAttach: (event: OnScaleGroupEnd) => any): this;

    on(eventName: "rotateGroup", handlerToAttach: (event: OnRotateGroup) => any): this;
    on(eventName: "rotateGroupStart", handlerToAttach: (event: OnRotateGroupStart) => any): this;
    on(eventName: "rotateGroupEnd", handlerToAttach: (event: OnRotateGroupEnd) => any): this;

    on(eventName: "pinchGroup", handlerToAttach: (event: OnPinchGroup) => any): this;
    on(eventName: "pinchGroupStart", handlerToAttach: (event: OnPinchGroupStart) => any): this;
    on(eventName: "pinchGroupEnd", handlerToAttach: (event: OnPinchGroupEnd) => any): this;

    on(eventName: "clickGroup", handlerToAttach: (event: OnClickGroup) => any): this;

    on(eventName: string, handlerToAttach: (event: { [key: string]: any }) => any): this;
    on(events: { [key: string]: (event: { [key: string]: any }) => any }): this;
}

export default Moveable;
