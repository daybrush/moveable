import EgComponent from "@egjs/component";
import { ref, Properties } from "framework-utils";
import * as React from "react";
import { render } from "react-dom";
import InnerMoveable from "./InnerMoveable";
import { MoveableOptions, MoveableGetterSetter, MoveableEvents } from "./types";
import {
    MoveableInterface,
    RectInfo,
} from "react-moveable/declaration/types";
import { PROPERTIES, EVENTS, METHODS } from "./consts";
import { camelize, isArray } from "@daybrush/utils";

/**
 * Moveable is Draggable! Resizable! Scalable! Rotatable!
 * @sort 1
 * @extends eg.Component
 */
@Properties(METHODS, (prototype, property) => {
    if (prototype[property]) {
        return;
    }
    prototype[property] = function(...args) {
        const self = this.getMoveable();

        if (!self || !self[property]) {
            return;
        }
        return self[property](...args);
    };
})
@Properties(PROPERTIES, (prototype, property) => {
    Object.defineProperty(prototype, property, {
        get() {
            return this.getMoveable().props[property];
        },
        set(value) {
            this.setState({
                [property]: value,
            });
        },
        enumerable: true,
        configurable: true,
    });
})
class Moveable extends EgComponent {
    private innerMoveable!: InnerMoveable;
    private tempElement = document.createElement("div");

    /**
     *
     */
    constructor(parentElement: HTMLElement | SVGElement, options: MoveableOptions = {}) {
        super();
        const nextOptions = { container: parentElement, ...options };

        const events: any = {};

        EVENTS.forEach(name => {
            events[camelize(`on ${name}`)] = (e: any) => this.trigger(name, e);
        });

        render(
            <InnerMoveable
                ref={ref(this, "innerMoveable")}
                parentElement={parentElement}
                {...nextOptions}
                {...events}
            />,
            this.tempElement,
        );
        const target = nextOptions.target!;
        if (isArray(target) && target.length > 1) {
            this.updateRect();
        }
    }
    public setState(state: Partial<MoveableOptions>, callback?: () => any) {
        this.innerMoveable.setState(state, callback);
    }
    public destroy() {
        render(null, this.tempElement);
        this.off();
        this.tempElement = null;
        this.innerMoveable = null;
    }
    private getMoveable() {
        return this.innerMoveable.moveable;
    }
}

/**
 * Whether or not the origin controlbox will be visible or not (default: true)
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
 * Whether or not target can be dragged. (default: false)
 * @name Moveable#draggable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.draggable = true;
 */
/**
 * Whether or not target can be resized. (default: false)
 * @name Moveable#resizable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.resizable = true;
 */
/**
 * Whether or not target can scaled. (default: false)
 * @name Moveable#scalable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.scalable = true;
 */
/**
 * Whether or not target can be rotated. (default: false)
 * @name Moveable#rotatable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.rotatable = true;
 */
/**
 * Whether or not target can be warped. (default: false)
 * @name Moveable#warpable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.warpable = true;
 */
/**
 * Whether or not target can be pinched with draggable, resizable, scalable, rotatable (default: false)
 * @name Moveable#pinchable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.pinchable = true;
 */
/**
 * When resize or scale, keeps a ratio of the width, height. (default: false)
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
 * throttle of angle of x, y when drag.
 * @name Moveable#throttleDragRotate
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 *
 * moveable.throttleDragRotate = 45;
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
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 * });
 *
 * moveable.snapCenter = true;
 */

/**
 * When you drag, make the snap in the vertical guidelines. (default: true)
 * @name Moveable#snapVertical
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   snapVertical: true,
 *   snapHorizontal: true,
 *   snapElement: true,
 * });
 *
 * moveable.snapVertical = false;
 */
 /**
 * When you drag, make the snap in the horizontal guidelines. (default: true)
 * @name Moveable#snapHorizontal
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   snapVertical: true,
 *   snapHorizontal: true,
 *   snapElement: true,
 * });
 *
 * moveable.snapHorizontal = false;
 */
/**
 * When you drag, make the snap in the element guidelines. (default: true)
 * @name Moveable#snapElement
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   snappable: true,
 *   snapVertical: true,
 *   snapHorizontal: true,
 *   snapElement: true,
 * });
 *
 * moveable.snapElement = false;
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
 * @name Moveable#verticalGuidlines
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
 * You can specify the className of the moveable controlbox. (default: "")
 * @name Moveable#className
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   className: "",
 * });
 *
 * moveable.className = "moveable1";
 */
/**
 * Set directions to show the control box. (default: ["n", "nw", "ne", "s", "se", "sw", "e", "w"])
 * @name Moveable#renderDirections
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   renderDirections: ["n", "nw", "ne", "s", "se", "sw", "e", "w"],
 * });
 *
 * moveable.renderDirections = ["nw", "ne", "sw", "se"];
 */

 /**
 * Set target's base direciton using top, left, right, bottom
 * (top: -1, left: -1, right: 1, bottom: 1) (default: [-1, -1])
 * @name Moveable#baseDirection
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   baseDirection: [-1, -1]
 * });
 *
 * moveable.baseDirection = [-1, -1];
 */

 /**
 * Sets the initial rotation of the group. (default 0)
 * @name Moveable#defaultGroupRotate
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   target: [].slice.call(document.querySelectorAll(".target")),
 *   defaultGroupRotate: 0,
 * });
 *
 * moveable.defaultGroupRotate = 40;
 */

/**
 * Whether or not target can be scrolled to the scroll container (default: false)
 * @name Moveable#scrollable
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   scrollable: true,
 *   scrollContainer: document.body,
 *   scrollThreshold: 0,
 *   getScrollPosition: ({ scrollContainer }) => ([scrollContainer.scrollLeft, scrollContainer.scrollTop]),
 * });
 *
 * moveable.scrollable = true;
 */

/**
 * The container to which scroll is applied (default: container)
 * @name Moveable#scrollContainer
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   scrollable: true,
 *   scrollContainer: document.body,
 *   scrollThreshold: 0,
 *   getScrollPosition: ({ scrollContainer }) => ([scrollContainer.scrollLeft, scrollContainer.scrollTop]),
 * });
 */
/**
 * Expand the range of the scroll check area. (default: 0)
 * @name Moveable#scrollThreshold
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   scrollable: true,
 *   scrollContainer: document.body,
 *   scrollThreshold: 0,
 *   getScrollPosition: ({ scrollContainer }) => ([scrollContainer.scrollLeft, scrollContainer.scrollTop]),
 * });
 */

/**
 * Sets a function to get the scroll position. (default: Function)
 * @name Moveable#getScrollPosition
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *   scrollable: true,
 *   scrollContainer: document.body,
 *   scrollThreshold: 0,
 *   getScrollPosition: ({ scrollContainer }) => ([scrollContainer.scrollLeft, scrollContainer.scrollTop]),
 * });
 *
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
 * When you click on the element, the `click` event is called.
 * @memberof Moveable
 * @event click
 * @param {Moveable.OnClick} - Parameters for the `click` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: document.querySelector(".target"),
 * });
 * moveable.on("click", ({ hasTarget, containsTarget, targetIndex }) => {
 *     // If you click on an element other than the target and not included in the target, index is -1.
 *     console.log("onClickGroup", target, hasTarget, containsTarget, targetIndex);
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
 * moveable.on("clickGroup", ({ inputTarget, isTarget, containsTarget, targetIndex }) => {
 *     // If you click on an element other than the target and not included in the target, index is -1.
 *     console.log("onClickGroup", inputTarget, isTarget, containsTarget, targetIndex);
 * });
 */

/**
 * `renderStart` event occurs at the first start of all events.
 * @memberof Moveable
 * @event renderStart
 * @param {Moveable.OnRenderStart} - Parameters for the `renderStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: document.querySelector(".target"),
 * });
 * moveable.on("renderStart", ({ target }) => {
 *     console.log("onRenderStart", target);
 * });
 */

/**
 * `render` event occurs before the target is drawn on the screen.
 * @memberof Moveable
 * @event render
 * @param {Moveable.OnRender} - Parameters for the `render` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: document.querySelector(".target"),
 * });
 * moveable.on("render", ({ target }) => {
 *     console.log("onRender", target);
 * });
 */

/**
 * `renderEnd` event occurs at the end of all events.
 * @memberof Moveable
 * @event renderEnd
 * @param {Moveable.OnRenderEnd} - Parameters for the `renderEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: document.querySelector(".target"),
 * });
 * moveable.on("renderEnd", ({ target }) => {
 *     console.log("onRenderEnd", target);
 * });
 */

/**
 * `renderGroupStart` event occurs at the first start of all events in group.
 * @memberof Moveable
 * @event renderGroupStart
 * @param {Moveable.OnRenderGroupStart} - Parameters for the `renderGroupStart` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 * });
 * moveable.on("renderGroupStart", ({ targets }) => {
 *     console.log("onRenderGroupStart", targets);
 * });
 */

/**
 * `renderGroup` event occurs before the target is drawn on the screen in group.
 * @memberof Moveable
 * @event renderGroup
 * @param {Moveable.OnRenderGroup} - Parameters for the `renderGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 * });
 * moveable.on("renderGroup", ({ targets }) => {
 *     console.log("onRenderGroup", targets);
 * });
 */

/**
 * `renderGroupEnd` event occurs at the end of all events in group.
 * @memberof Moveable
 * @event renderGroupEnd
 * @param {Moveable.OnRenderGroupEnd} - Parameters for the `renderGroupEnd` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 * });
 * moveable.on("renderGroupEnd", ({ targets }) => {
 *     console.log("onRenderGroupEnd", targets);
 * });
 */

/**
 * When the drag cursor leaves the scrollContainer, the `scroll` event occur to scroll.
 * @memberof Moveable
 * @event scroll
 * @param {Moveable.OnScroll} - Parameters for the `scroll` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: document.querySelector(".target"),
 * });
 * moveable.on("scroll", ({ scrollContainer, direction }) => {
 *   scrollContainer.scrollLeft += direction[0] * 10;
 *   scrollContainer.scrollTop += direction[1] * 10;
 * });
 */

/**
 * When the drag cursor leaves the scrollContainer, the `scrollGroup` event occur to scroll in group.
 * @memberof Moveable
 * @event scrollGroup
 * @param {Moveable.OnScrollGroup} - Parameters for the `scrollGroup` event
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body, {
 *     target: [].slice.call(document.querySelectorAll(".target")),
 * });
 * moveable.on("scroll", ({ scrollContainer, direction }) => {
 *   scrollContainer.scrollLeft += direction[0] * 10;
 *   scrollContainer.scrollTop += direction[1] * 10;
 * });
 */

interface Moveable extends MoveableGetterSetter, MoveableInterface {
    on<T extends keyof MoveableEvents>(eventName: T, handlerToAttach: (event: MoveableEvents[T]) => any): this;
    on(eventName: string, handlerToAttach: (event: { [key: string]: any }) => any): this;
    on(events: { [key: string]: (event: { [key: string]: any }) => any }): this;
}

export default Moveable;
