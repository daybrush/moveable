import EgComponent from "@egjs/component";
import { ref } from "framework-utils";
import { h, render } from "preact";
import InnerMoveable from "./InnerMoveable";
import { MoveableOptions } from "./types";
import {
    OnDragStart, OnDrag, OnResize, OnResizeStart,
    OnResizeEnd, OnScaleStart, OnScaleEnd, OnRotateStart,
    OnRotateEnd, OnDragEnd, OnRotate, OnScale, OnWarpStart, OnWarpEnd, OnWarp,
} from "react-moveable/declaration/types";

/**
 * Moveable is Draggable! Resizable! Scalable! Rotatable!
 * @sort 1
 * @extends eg.Component
 */
class Moveable extends EgComponent {
    private innerMoveable!: any;

    /**
     *
     */
    constructor(parentElement: HTMLElement | SVGElement, options: MoveableOptions = {}) {
        super();
        const element = document.createElement("div");

        render(
            <InnerMoveable
                ref={ref(this, "innerMoveable")}
                {...options}
                onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onDragEnd={this.onDragEnd}
                onResizeStart={this.onResizeStart}
                onResize={this.onResize}
                onResizeEnd={this.onResizeEnd}
                onScaleStart={this.onScaleStart}
                onScale={this.onScale}
                onScaleEnd={this.onScaleEnd}
                onRotateStart={this.onRotateStart}
                onRotate={this.onRotate}
                onRotateEnd={this.onRotateEnd}
                onWarpStart={this.onWarpStart}
                onWarp={this.onWarp}
                onWarpEnd={this.onWarpEnd}
            />,
            element,
        );
        parentElement.appendChild(element.children[0]);
    }
    /**
     * Whether or not the origin controlbox will be visible or not
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.origin = true;
     */
    get origin() {
        return this.getMoveableProps().origin;
    }
    set origin(origin: boolean) {
        this.innerMoveable.setState({
            origin,
        });
    }
    /**
     * The target to indicate Moveable Control Box.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     * moveable.target = document.querySelector(".target");
     */
    get target(): HTMLElement | SVGElement {
        return this.getMoveableProps().target;
    }
    set target(target: HTMLElement | SVGElement) {
        if (target !== this.target) {
            this.innerMoveable.setState({
                target,
            });
        } else {
            this.updateRect();
        }
    }
    /**
     * Whether or not target can be dragged.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.draggable = true;
     */
    get draggable(): boolean {
        return this.getMoveableProps().draggable || false;
    }
    set draggable(draggable: boolean) {
        this.innerMoveable.setState({
            draggable,
        });
    }
    /**
     * Whether or not target can be resized.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.resizable = true;
     */
    get resizable(): boolean {
        return this.getMoveableProps().resizable;
    }
    set resizable(resizable: boolean) {
        this.innerMoveable.setState({
            resizable,
        });
    }
    /**
     * Whether or not target can scaled.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.scalable = true;
     */
    get scalable(): boolean {
        return this.getMoveableProps().scalable;
    }
    set scalable(scalable: boolean) {
        this.innerMoveable.setState({
            scalable,
        });
    }
    /**
     * Whether or not target can be rotated.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.rotatable = true;
     */
    get rotatable(): boolean {
        return this.getMoveableProps().rotatable;
    }
    set rotatable(rotatable: boolean) {
        this.innerMoveable.setState({
            rotatable,
        });
    }
    /**
     * Whether or not target can be warped.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.warpable = true;
     */
    get warpable(): boolean {
        return this.getMoveableProps().warpable;
    }
    set warpable(warpable: boolean) {
        this.innerMoveable.setState({
            warpable,
        });
    }
    /**
     * When resize or scale, keeps a ratio of the width, height.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.keepRatio = true;
     */
    get keepRatio(): boolean {
        return this.getMoveable().keepRatio;
    }
    set keepRatio(keepRatio: boolean) {
        this.innerMoveable.setState({
            keepRatio,
        });
    }
    /**
     * throttle of x, y when drag.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.throttleDrag = 1;
     */
    get throttleDrag(): number {
        return this.getMoveable().throttleDrag;
    }
    set throttleDrag(throttleDrag: number) {
        this.innerMoveable.setState({
            throttleDrag,
        });
    }
    /**
     * throttle of width, height when resize.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.throttleResize = 1;
     */
    get throttleResize(): number {
        return this.getMoveable().throttleResize;
    }
    set throttleResize(throttleResize: number) {
        this.innerMoveable.setState({
            throttleResize,
        });
    }
    /**
     * throttle of scaleX, scaleY when scale.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.throttleScale = 0.1;
     */
    get throttleScale(): number {
        return this.getMoveable().throttleScale;
    }
    set throttleScale(throttleScale: number) {
        this.innerMoveable.setState({
            throttleScale,
        });
    }
    /**
     * hrottle of angle(degree) when rotate.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.throttleRotate = 1;
     */
    get throttleRotate(): number {
        return this.getMoveable().throttleRotate;
    }
    set throttleRotate(throttleRotate: number) {
        this.innerMoveable.setState({
            throttleRotate,
        });
    }
    /**
     * Move the moveable as much as the `pos`.
     * @param - the values of x and y to move moveable.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.move([0, -10]);
     */
    public move(pos: number[]) {
        this.getMoveable().move(pos);
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
    private getMoveable() {
        return this.innerMoveable.preactMoveable;
    }
    private getMoveableProps() {
        return this.getMoveable().props;
    }
    private onDragStart = (e: OnDragStart) => {
        this.trigger("dragStart", e);
    }
    private onDrag = (e: OnDrag) => {
        this.trigger("drag", e);
    }
    private onDragEnd = (e: OnDragEnd) => {
        this.trigger("dragEnd", e);
    }
    private onResizeStart = (e: OnResizeStart) => {
        this.trigger("resizeStart", e);
    }
    private onResize = (e: OnResize) => {
        this.trigger("resize", e);
    }
    private onResizeEnd = (e: OnResizeEnd) => {
        this.trigger("resizeEnd", e);
    }
    private onScaleStart = (e: OnScaleStart) => {
        this.trigger("scaleStart", e);
    }
    private onScale = (e: OnScale) => {
        this.trigger("scale", e);
    }
    private onScaleEnd = (e: OnScaleEnd) => {
        this.trigger("scaleEnd", e);
    }
    private onRotateStart = (e: OnRotateStart) => {
        this.trigger("rotateStart", e);
    }
    private onRotate = (e: OnRotate) => {
        this.trigger("rotate", e);
    }
    private onRotateEnd = (e: OnRotateEnd) => {
        this.trigger("rotateEnd", e);
    }
    private onWarpStart = (e: OnWarpStart) => {
        this.trigger("warpStart", e);
    }
    private onWarp = (e: OnWarp) => {
        this.trigger("warp", e);
    }
    private onWarpEnd = (e: OnWarpEnd) => {
        this.trigger("warpEnd", e);
    }
}

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
export default Moveable;

declare interface Moveable {
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
    on(eventName: string, handlerToAttach: (event: { [key: string]: any }) => any): this;
    on(events: { [key: string]: (event: { [key: string]: any }) => any }): this;
}
