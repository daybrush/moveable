import * as React from "react";
import { MoveableProps, Able, MoveableInterface, RectInfo, AbleRequestParam, Requester, HitRect } from "./types";
import MoveableManager from "./MoveableManager";
import { MOVEABLE_ABLES } from "./ables/consts";
import MoveableGroup from "./MoveableGroup";
import { ref } from "framework-utils";
import { isArray } from "@daybrush/utils";
import Groupable from "./ables/Groupable";

export default class Moveable<T = {}> extends React.PureComponent<MoveableProps & T> implements MoveableInterface {
    public moveable!: MoveableManager<MoveableProps> | MoveableGroup;
    public render() {
        const props = this.props;
        const ables: Able[] = props.ables as Able[] || [];
        const target = this.props.target || this.props.targets;
        const isArr = isArray(target);
        const isGroup = isArr && (target as any[]).length > 1;

        if (isGroup) {
            const nextProps = {
                ...this.props,
                target: null,
                targets: target as any[],
                ables: [...MOVEABLE_ABLES, Groupable, ...ables],
            };
            return <MoveableGroup key="group" ref={ref(this, "moveable")}
                {...nextProps} />;
        } else {
            const moveableTarget = isArr ? (target as any[])[0] : target;

            return <MoveableManager<MoveableProps> key="single" ref={ref(this, "moveable")}
                {...{ ...this.props, target: moveableTarget, ables: [...MOVEABLE_ABLES, ...ables] }} />;
        }
    }
    /**
     * Check if the target is an element included in the moveable.
     * @method Moveable#isMoveableElement
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
    public isMoveableElement(target: HTMLElement | SVGElement): boolean {
        return this.moveable.isMoveableElement(target);
    }
    /**
     * You can drag start the Moveable through the external `MouseEvent`or `TouchEvent`. (Angular: ngDragStart)
     * @method Moveable#dragStart
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
        this.moveable.dragStart(e);
    }

    /**
     * Whether the coordinates are inside Moveable
     * @method Moveable#isInside
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
        return this.moveable.isInside(clientX, clientY);
    }
    /**
     * Hit test an element or rect on a moveable target.
     * @method Moveable#hitTest
     * @param - element or rect to test
     * @return - Get hit test rate (rate > 0 is hitted)
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * document.body.addEventListener("mousedown", e => {
     *     if (moveable.hitTest(e.target) > 0) {
     *          console.log("hiited");
     *     }
     * });
     */
    public hitTest(el: Element | HitRect): number {
        return this.moveable.hitTest(el);
    }
    /**
     * If the width, height, left, and top of all elements change, update the shape of the moveable.
     * @method Moveable#updateRect
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * window.addEventListener("resize", e => {
     *     moveable.updateRect();
     * });
     */
    public updateRect(): void {
        this.moveable.updateRect();
    }

    /**
     * If the width, height, left, and top of the only target change, update the shape of the moveable.
     * @method Moveable#updateTarget
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.updateTarget();
     */
    public updateTarget(): void {
        this.moveable.updateTarget();
    }
    /**
     * Check if the moveable state is being dragged.
     * @method Moveable#isDragging
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * // false
     * console.log(moveable.isDragging());
     *
     * moveable.on("drag", () => {
     *   // true
     *   console.log(moveable.isDragging());
     * });
     */
    public isDragging(): boolean {
        return this.moveable.isDragging();
    }
    /**
     * You can get the vertex information, position and offset size information of the target based on the container.
     * @method Moveable#getRect
     * @return - The Rect Info
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * const rectInfo = moveable.getRect();
     */
    public getRect(): RectInfo {
        return this.moveable.getRect();
    }

    /**
     * Request able through a method rather than an event.
     * At the moment of execution, requestStart is executed,
     * and then request and requestEnd can be executed through Requester.
     * @method Moveable#request
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Draggable.html#request|Draggable Requester}
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Resizable.html#request|Resizable Requester}
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Scalable.html#request|Scalable Requester}
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Rotatable.html#request|Rotatable Requester}
     * @param - ableName
     * @param - request to be able params. If isInstant is true, request and requestEnd are executed immediately.
     * @return - Able Requester. If there is no request in able, nothing will work.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * // Instantly Request (requestStart - request - requestEnd)
     * moveable.request("draggable", { deltaX: 10, deltaY: 10, isInstant: true });
     *
     * // Start move
     * const requester = moveable.request("draggable");
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.requestEnd();
     */
    public request(ableName: string, params?: AbleRequestParam): Requester {
        return this.moveable.request(ableName, params);
    }
    /**
     * Remove the Moveable object and the events.
     * @method Moveable#destroy
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.destroy();
     */
    public destroy(): void {
        this.moveable.componentWillUnmount();
    }
}
