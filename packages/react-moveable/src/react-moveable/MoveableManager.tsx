import * as React from "react";
import { PREFIX } from "./consts";
import {
    prefix,
    getTargetInfo,
    unset,
    getAbsolutePosesByState,
    getRect,
    filterAbles,
    equals,
    flat,
    groupByMap,
    calculatePadding,
} from "./utils";
import Gesto from "gesto";
import { ref } from "framework-utils";
import { MoveableManagerProps, MoveableManagerState, Able, RectInfo, Requester, PaddingBox, HitRect, MoveableManagerInterface } from "./types";
import { triggerAble, getTargetAbleGesto, getAbleGesto } from "./gesto/getAbleGesto";
import { plus } from "@scena/matrix";
import { getKeys, getRad, IObject } from "@daybrush/utils";
import { renderLine } from "./renderDirection";
import { fitPoints, getAreaSize, getOverlapSize, isInside } from "overlap-area";
import EventManager from "./EventManager";

export default class MoveableManager<T = {}>
    extends React.PureComponent<MoveableManagerProps<T>, MoveableManagerState> {
    public static defaultProps: Required<MoveableManagerProps> = {
        target: null,
        dragTarget: null,
        container: null,
        rootContainer: null,
        origin: true,
        edge: false,
        parentMoveable: null,
        wrapperMoveable: null,
        parentPosition: null,
        ables: [],
        pinchThreshold: 20,
        dragArea: false,
        passDragArea: false,
        transformOrigin: "",
        className: "",
        zoom: 1,
        triggerAblesSimultaneously: false,
        padding: {},
        pinchOutside: true,
        checkInput: false,
        groupable: false,
        cspNonce: "",
        translateZ: 50,
        cssStyled: null,
        props: {},
    };
    public state: MoveableManagerState = {
        container: null,
        target: null,
        gesto: null,
        renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]],
        ...getTargetInfo(null),
    };
    public enabledAbles: Able[] = [];
    public targetAbles: Able[] = [];
    public controlAbles: Able[] = [];
    public controlBox!: { getElement(): HTMLElement };
    public areaElement!: HTMLElement;
    public targetGesto!: Gesto;
    public controlGesto!: Gesto;
    public rotation: number = 0;
    public scale: number[] = [1, 1];
    public isUnmounted = false;
    public events: Record<string, EventManager | null>  = {
        "mouseEnter": null,
        "mouseLeave": null,
    };

    public render() {
        const props = this.props;
        const state = this.state;
        const {
            edge, parentPosition, className,
            target: propsTarget,
            zoom, cspNonce,
            translateZ,
            cssStyled: ControlBoxElement,
        } = props;

        this.checkUpdate();
        this.updateRenderPoses();

        const { left: parentLeft, top: parentTop } = parentPosition! || { left: 0, top: 0 };
        const { left, top, target: stateTarget, direction, renderPoses } = state;
        const groupTargets = (props as any).targets;
        const isDisplay = ((groupTargets && groupTargets.length) || propsTarget) && stateTarget;
        const isDragging = this.isDragging();
        const ableAttributes: IObject<boolean> = {};
        const Renderer = { createElement: React.createElement };
        this.getEnabledAbles().forEach(able => {
            ableAttributes[`data-able-${able.name.toLowerCase()}`] = true;
        });
        return (
            <ControlBoxElement
                cspNonce={cspNonce}
                ref={ref(this, "controlBox")}
                className={`${prefix("control-box", direction === -1
                    ? "reverse" : "", isDragging ? "dragging" : "")} ${className}`}
                {...ableAttributes}
                style={{
                    "position": "absolute",
                    "display": isDisplay ? "block" : "none",
                    "transform": `translate(${left - parentLeft}px, ${top - parentTop}px) translateZ(${translateZ}px)`,
                    "--zoom": zoom,
                    "--zoompx": `${zoom}px`,
                }}>
                {this.renderAbles()}
                {renderLine(Renderer, edge ? "n" : "", renderPoses[0], renderPoses[1], zoom!, 0)}
                {renderLine(Renderer, edge ? "e" : "", renderPoses[1], renderPoses[3], zoom!, 1)}
                {renderLine(Renderer, edge ? "w" : "", renderPoses[0], renderPoses[2], zoom!, 2)}
                {renderLine(Renderer, edge ? "s" : "", renderPoses[2], renderPoses[3], zoom!, 3)}
            </ControlBoxElement>
        );
    }
    public componentDidMount() {
        this.controlBox.getElement();
        const props = this.props;
        const { parentMoveable, container, wrapperMoveable } = props;

        this.updateEvent(props);
        this.updateNativeEvents(props);
        if (!container && !parentMoveable && !wrapperMoveable) {
            this.updateRect("", false, true);
        }
        this.updateCheckInput();
    }
    public componentDidUpdate(prevProps: MoveableManagerProps) {
        this.updateNativeEvents(prevProps);
        this.updateEvent(prevProps);
        this.updateCheckInput();
    }
    public componentWillUnmount() {
        this.isUnmounted = true;
        unset(this, "targetGesto");
        unset(this, "controlGesto");

        const events = this.events;
        for (const name in events) {
            const manager = events[name];
            manager && manager.destroy();
        }
    }
    public getContainer(): HTMLElement | SVGElement {
        const { parentMoveable, wrapperMoveable, container } = this.props;

        return container!
            || (wrapperMoveable && wrapperMoveable.getContainer())
            || (parentMoveable && parentMoveable.getContainer())
            || this.controlBox.getElement().parentElement!;
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
    public isMoveableElement(target: Element) {
        return target && ((target.getAttribute("class") || "").indexOf(PREFIX) > -1);
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
    public dragStart(e: MouseEvent | TouchEvent) {
        if (this.targetGesto) {
            this.targetGesto.triggerDragStart(e);
        }
        return this;
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
        const { target, pos1, pos2, pos3, pos4, targetClientRect } = this.state;

        if (!target) {
            return 0;
        }
        let rect: Required<HitRect>;

        if (el instanceof Element) {
            const clientRect = el.getBoundingClientRect();

            rect = {
                left: clientRect.left,
                top: clientRect.top,
                width: clientRect.width,
                height: clientRect.height,
            };
        } else {
            rect = { width: 0, height: 0, ...el };
        }

        const {
            left: rectLeft,
            top: rectTop,
            width: rectWidth,
            height: rectHeight,
        } = rect;
        const points = fitPoints([pos1, pos2, pos4, pos3], targetClientRect);
        const size = getOverlapSize(points, [
            [rectLeft, rectTop],
            [rectLeft + rectWidth, rectTop],
            [rectLeft + rectWidth, rectTop + rectHeight],
            [rectLeft, rectTop + rectHeight],
        ]);
        const totalSize = getAreaSize(points);

        if (!size || !totalSize) {
            return 0;
        }

        return Math.min(100, size / totalSize * 100);
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
    public isInside(clientX: number, clientY: number) {
        const { target, pos1, pos2, pos3, pos4, targetClientRect } = this.state;

        if (!target) {
            return false;
        }
        return isInside([clientX, clientY], fitPoints([pos1, pos2, pos4, pos3], targetClientRect));
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
    public updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState: boolean = true) {
        const props = this.props;
        const parentMoveable = props.parentMoveable;
        const state = this.state;
        const target = (state.target || this.props.target) as HTMLElement | SVGElement;
        const container = this.getContainer();
        const rootContainer = parentMoveable
            ? parentMoveable.props.rootContainer
            : props.rootContainer;
        this.updateState(
            getTargetInfo(this.controlBox && this.controlBox.getElement(),
                target, container, container,
                rootContainer || container, isTarget ? state : undefined),
            parentMoveable ? false : isSetState,
        );
    }
    public isTargetChanged(prevProps: MoveableManagerProps, useDragArea?: boolean) {
        const props = this.props;
        const target = props.dragTarget || props.target;
        const prevTarget = prevProps.dragTarget || prevProps.target;
        const dragArea = props.dragArea;
        const prevDragArea = prevProps.dragArea;
        const isTargetChanged = !dragArea && prevTarget !== target;

        return isTargetChanged || ((useDragArea || dragArea) && prevDragArea !== dragArea);
    }
    public updateNativeEvents(prevProps: MoveableManagerProps) {
        const props = this.props;
        const target = props.dragArea ? this.areaElement : this.state.target;
        const events = this.events;
        const eventKeys = getKeys(events);

        if (this.isTargetChanged(prevProps)) {
            for (const eventName in events) {
                const manager = events[eventName];
                manager && manager.destroy();
                events[eventName] = null;
            }
        }
        if (!target) {
            return;
        }
        const enabledAbles = this.enabledAbles;
        eventKeys.forEach(eventName => {
            const ables = filterAbles(enabledAbles, [eventName] as any);
            const hasAbles = ables.length > 0;
            let manager = events[eventName];

            if (!hasAbles) {
                if (manager) {
                    manager.destroy();
                    events[eventName] = null;
                }
                return;
            }
            if (!manager) {
                manager = new EventManager(target, this, eventName);
                events[eventName] = manager;
            }
            manager.setAbles(ables);
        });
    }
    public updateEvent(prevProps: MoveableManagerProps) {
        const controlBoxElement = this.controlBox.getElement();
        const hasTargetAble = this.targetAbles.length;
        const hasControlAble = this.controlAbles.length;
        const props = this.props;
        const target = props.dragTarget || props.target;
        const isTargetChanged = this.isTargetChanged(prevProps, true);
        const isUnset = (!hasTargetAble && this.targetGesto) || isTargetChanged;

        if (isUnset) {
            unset(this, "targetGesto");
            this.updateState({ gesto: null });
        }
        if (!hasControlAble) {
            unset(this, "controlGesto");
        }

        if (target && hasTargetAble && !this.targetGesto) {
            this.targetGesto = getTargetAbleGesto(this, target!, "");
        }
        if (!this.controlGesto && hasControlAble) {
            this.controlGesto = getAbleGesto(this, controlBoxElement, "controlAbles", "Control");
        }
        if (isUnset) {
            this.unsetAbles();
        }
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
    public isDragging() {
        return (this.targetGesto ? this.targetGesto.isFlag() : false)
            || (this.controlGesto ? this.controlGesto.isFlag() : false);
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
    public updateTarget(type?: "Start" | "" | "End") {
        this.updateRect(type, true);
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
        const state = this.state;
        const poses = getAbsolutePosesByState(this.state);
        const [pos1, pos2, pos3, pos4] = poses;
        const rect = getRect(poses);
        const {
            width: offsetWidth,
            height: offsetHeight,
        } = state;
        const {
            width,
            height,
            left,
            top,
        } = rect;
        const statePos = [state.left, state.top];
        const origin = plus(statePos, state.origin);
        const beforeOrigin = plus(statePos, state.beforeOrigin);
        const transformOrigin = state.transformOrigin;

        return {
            width,
            height,
            left,
            top,
            pos1,
            pos2,
            pos3,
            pos4,
            offsetWidth,
            offsetHeight,
            beforeOrigin,
            origin,
            transformOrigin,
            rotation: this.getRotation(),
        };
    }
    /**
     * Get a manager that manages the moveable's state and props.
     * @method Moveable#getManager
     * @return - The Rect Info
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * const manager = moveable.getManager(); // real moveable class instance
     */
    public getManager(): MoveableManagerInterface<any, any> {
        return this as any;
    }
    public getRotation() {
        const {
            pos1,
            pos2,
            direction,
        } = this.state;

        let deg = getRad(pos1, pos2) / Math.PI * 180;

        deg = direction >= 0 ? deg : 180 - deg;
        deg = deg >= 0 ? deg : 360 + deg;

        return deg;
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
     * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.OriginDraggable.html#request|OriginDraggable Requester}
     * @param - ableName
     * @param - request to be able params.
     * @param - If isInstant is true, request and requestEnd are executed immediately.
     * @return - Able Requester. If there is no request in able, nothing will work.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * // Instantly Request (requestStart - request - requestEnd)
     * moveable.request("draggable", { deltaX: 10, deltaY: 10 }, true);
     *
     * // Start move
     * const requester = moveable.request("draggable");
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.request({ deltaX: 10, deltaY: 10 });
     * requester.requestEnd();
     */
    public request(ableName: string, param: IObject<any> = {}, isInstant?: boolean): Requester {
        const { ables, groupable } = this.props as any;
        const requsetAble: Able = ables!.filter((able: Able) => able.name === ableName)[0];

        if (this.isDragging() || !requsetAble || !requsetAble.request) {
            return {
                request() {
                    return this;
                },
                requestEnd() {
                    return this;
                },
            };
        }
        const self = this;
        const ableRequester = requsetAble.request(this);

        const requestInstant = isInstant || param.isInstant;
        const ableType = ableRequester.isControl ? "controlAbles" : "targetAbles";
        const eventAffix = `${(groupable ? "Group" : "")}${ableRequester.isControl ? "Control" : ""}`;

        const requester = {
            request(ableParam: IObject<any>) {
                triggerAble(self, ableType, "drag", eventAffix, "", {
                    ...ableRequester.request(ableParam),
                    requestAble: ableName,
                    isRequest: true,
                }, requestInstant);
                return this;
            },
            requestEnd() {
                triggerAble(self, ableType, "drag", eventAffix, "End", {
                    ...ableRequester.requestEnd(),
                    requestAble: ableName,
                    isRequest: true,
                }, requestInstant);
                return this;
            },
        };

        triggerAble(self, ableType, "drag", eventAffix, "Start", {
            ...ableRequester.requestStart(param),
            requestAble: ableName,
            isRequest: true,
        }, requestInstant);

        return requestInstant ? requester.request(param).requestEnd() : requester;
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
        this.componentWillUnmount();
    }
    public updateRenderPoses() {
        const state = this.state;
        const props = this.props;
        const {
            beforeOrigin, transformOrigin,
            allMatrix, is3d, pos1, pos2, pos3, pos4,
            left: stateLeft, top: stateTop,
        } = state;
        const {
            left = 0,
            top = 0,
            bottom = 0,
            right = 0,
        } = (props.padding || {}) as PaddingBox;
        const n = is3d ? 4 : 3;
        const absoluteOrigin = (props as any).groupable ? beforeOrigin : plus(beforeOrigin, [stateLeft, stateTop]);

        state.renderPoses = [
            plus(pos1, calculatePadding(allMatrix, [-left, -top], transformOrigin, absoluteOrigin, n)),
            plus(pos2, calculatePadding(allMatrix, [right, -top], transformOrigin, absoluteOrigin, n)),
            plus(pos3, calculatePadding(allMatrix, [-left, bottom], transformOrigin, absoluteOrigin, n)),
            plus(pos4, calculatePadding(allMatrix, [right, bottom], transformOrigin, absoluteOrigin, n)),
        ];
    }
    public checkUpdate() {
        const { target, container, parentMoveable } = this.props;
        const {
            target: stateTarget,
            container: stateContainer,
        } = this.state;

        if (!stateTarget && !target) {
            return;
        }
        this.updateAbles();

        const isChanged = !equals(stateTarget, target) || !equals(stateContainer, container);

        if (!isChanged) {
            return;
        }

        this.updateState({ target, container });

        if (!parentMoveable && (container || this.controlBox)) {
            this.updateRect("End", false, false);
        }
    }
    public triggerEvent(name: string, e: any): any {
        const callback = (this.props as any)[name];

        return callback && callback(e);
    }
    protected unsetAbles() {
        if (this.targetAbles.filter(able => {
            if (able.unset) {
                able.unset(this);
                return true;
            }
            return false;
        }).length) {
            this.forceUpdate();
        }
    }
    protected updateAbles(
        ables: Able[] = this.props.ables!,
        eventAffix: string = "",
    ) {
        const props = this.props as any;
        const triggerAblesSimultaneously = props.triggerAblesSimultaneously;
        const enabledAbles = ables!.filter(able => able && (able.always || props[able.name]));

        const dragStart = `drag${eventAffix}Start` as "dragStart";
        const pinchStart = `pinch${eventAffix}Start` as "pinchStart";
        const dragControlStart = `drag${eventAffix}ControlStart` as "dragControlStart";

        const targetAbles = filterAbles(enabledAbles, [dragStart, pinchStart], triggerAblesSimultaneously);
        const controlAbles = filterAbles(enabledAbles, [dragControlStart], triggerAblesSimultaneously);

        this.enabledAbles = enabledAbles;
        this.targetAbles = targetAbles;
        this.controlAbles = controlAbles;
    }
    protected updateState(nextState: any, isSetState?: boolean) {
        if (isSetState) {
            this.setState(nextState);
        } else {
            const state = this.state;

            for (const name in nextState) {
                (state as any)[name] = nextState[name];
            }
        }
    }
    protected getEnabledAbles() {
        const props = this.props as any;
        const ables: Able[] = props.ables!;
        return ables.filter(able => able && props[able.name]);
    }
    protected renderAbles() {
        const props = this.props as any;
        const triggerAblesSimultaneously = props.triggerAblesSimultaneously;
        const Renderer = { createElement: React.createElement };

        return groupByMap(flat<any>(
            filterAbles(this.getEnabledAbles(), ["render"], triggerAblesSimultaneously).map(({ render }) => {
                return render!(this, Renderer) || [];
            })).filter(el => el), ({ key }) => key).map(group => group[0]);
    }
    protected updateCheckInput() {
        this.targetGesto && (this.targetGesto.options.checkInput = this.props.checkInput);
    }
}

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
 * Zooms in the elements of a moveable. (default: 1)
 * @name Moveable#zoom
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 * moveable.zoom = 2;
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
 * The target(s) to drag Moveable target(s) (default: target)
 * @name Moveable#dragTarget
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 * moveable.target = document.querySelector(".target");
 * moveable.dragTarget = document.querySelector(".dragTarget");
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
