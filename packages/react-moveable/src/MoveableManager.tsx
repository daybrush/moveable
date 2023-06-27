import * as React from "react";
import { createElement } from "react";
import { PREFIX } from "./consts";
import {
    prefix,
    unsetGesto,
    getAbsolutePosesByState,
    getRect,
    filterAbles,
    equals,
    flat,
    groupByMap,
    calculatePadding,
    getAbsoluteRotation,
    defaultSync,
    getRefTarget,
    groupBy,
    unsetAbles,
    getPaddingBox,
} from "./utils";
import Gesto from "gesto";
import { ref } from "framework-utils";
import {
    MoveableManagerProps, MoveableManagerState, Able,
    RectInfo, Requester, HitRect, MoveableManagerInterface,
    MoveableDefaultOptions,
    GroupableProps,
    MoveableRefType,
} from "./types";
import { triggerAble, getTargetAbleGesto, getAbleGesto, checkMoveableTarget } from "./gesto/getAbleGesto";
import { createOriginMatrix, multiplies, plus } from "@scena/matrix";
import {
    addClass, cancelAnimationFrame, find,
    getKeys, getWindow, IObject, isNode, removeClass, requestAnimationFrame,
} from "@daybrush/utils";
import { renderLine } from "./renderDirections";
import { fitPoints, getAreaSize, getOverlapSize, isInside } from "overlap-area";
import EventManager from "./EventManager";
import { styled } from "react-css-styled";
import EventEmitter from "@scena/event-emitter";
import { getMoveableTargetInfo } from "./utils/getMoveableTargetInfo";
import { VIEW_DRAGGING } from "./classNames";
import { diff } from "@egjs/list-differ";
import { getPersistState } from "./utils/persist";
import { setStoreCache } from "./store/Store";

export default class MoveableManager<T = {}>
    extends React.PureComponent<MoveableManagerProps<T>, MoveableManagerState> {
    public static defaultProps: Required<MoveableManagerProps> = {
        target: null,
        dragTarget: null,
        container: null,
        rootContainer: null,
        origin: true,
        parentMoveable: null,
        wrapperMoveable: null,
        isWrapperMounted: false,
        parentPosition: null,
        warpSelf: false,
        svgOrigin: "",
        dragContainer: null,
        useResizeObserver: false,
        useMutationObserver: false,
        preventDefault: true,
        linePadding: 0,
        controlPadding: 0,
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
        dragFocusedInput: false,
        groupable: false,
        hideDefaultLines: false,
        cspNonce: "",
        translateZ: 0,
        cssStyled: null,
        customStyledMap: {},
        props: {},
        stopPropagation: false,
        preventClickDefault: false,
        preventClickEventOnDrag: true,
        flushSync: defaultSync,
        firstRenderState: null,
        persistData: null,
        viewContainer: null,
        requestStyles: [],
        useAccuratePosition: false,
    };
    public state: MoveableManagerState = {
        container: null,
        gestos: {},
        renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]],
        disableNativeEvent: false,
        posDelta: [0, 0],
        ...getMoveableTargetInfo(null),
    };
    public renderState: Record<string, any> = {};
    public enabledAbles: Able[] = [];
    public targetAbles: Able[] = [];
    public controlAbles: Able[] = [];
    public controlBox!: HTMLElement;
    public areaElement!: HTMLElement;
    public targetGesto!: Gesto;
    public controlGesto!: Gesto;
    public rotation = 0;
    public scale: number[] = [1, 1];
    public isMoveableMounted = false;
    public isUnmounted = false;

    public events: Record<string, EventManager | null> = {
        "mouseEnter": null,
        "mouseLeave": null,
    };

    protected _emitter: EventEmitter = new EventEmitter();
    protected _prevOriginalDragTarget: MoveableRefType | null = null;
    protected _originalDragTarget: MoveableRefType | null = null;
    protected _prevDragTarget: HTMLElement | SVGElement | null | undefined = null;
    protected _dragTarget: HTMLElement | SVGElement | null | undefined = null;

    protected _prevDragArea = false;
    protected _isPropTargetChanged = false;
    protected _hasFirstTarget = false;

    private _reiszeObserver: ResizeObserver | null = null;
    private _observerId = 0;
    private _mutationObserver: MutationObserver | null = null;
    public _rootContainer: HTMLElement | null | undefined = null;
    private _viewContainer: HTMLElement | null | undefined = null;
    private _viewClassNames: string[] = [];
    private _store: Record<string, any> = {};

    public render() {
        const props = this.props;
        const state = this.getState();
        const {
            parentPosition,
            className,
            target: propsTarget,
            zoom, cspNonce,
            translateZ,
            cssStyled: ControlBoxElement,
            groupable,
            linePadding,
            controlPadding,
        } = props;

        this._checkUpdateRootContainer();
        this.checkUpdate();
        this.updateRenderPoses();

        const [parentLeft, parentTop] = parentPosition as number[] || [0, 0];
        const {
            left,
            top,
            target: stateTarget,
            direction,
            hasFixed,
            offsetDelta,
        } = state;
        const groupTargets = (props as any).targets;
        const isDragging = this.isDragging();
        const ableAttributes: IObject<boolean> = {};
        this.getEnabledAbles().forEach(able => {
            ableAttributes[`data-able-${able.name.toLowerCase()}`] = true;
        });
        const ableClassName = this._getAbleClassName();
        const isDisplay
            = (groupTargets && groupTargets.length && (stateTarget || groupable))
            || propsTarget
            || (!this._hasFirstTarget && this.state.isPersisted);
        const isVisible = this.controlBox || this.props.firstRenderState || this.props.persistData;
        const translate = [left - parentLeft, top - parentTop];

        if (!groupable && props.useAccuratePosition) {
            translate[0] += offsetDelta[0];
            translate[1] += offsetDelta[1];
        }
        const style: Record<string, any> = {
            "position": hasFixed ? "fixed" : "absolute",
            "display": isDisplay ? "block" : "none",
            "visibility": isVisible ? "visible" : "hidden",
            "transform": `translate3d(${translate[0]}px, ${translate[1]}px, ${translateZ})`,
            "--zoom": zoom,
            "--zoompx": `${zoom}px`,
        };
        if (linePadding) {
            style["--moveable-line-padding"] = linePadding;
        }
        if (controlPadding) {
            style["--moveable-control-padding"] = controlPadding;
        }
        return (
            <ControlBoxElement
                cspNonce={cspNonce}
                ref={ref(this, "controlBox")}
                className={`${prefix("control-box", direction === -1 ? "reverse" : "", isDragging ? "dragging" : "")} ${ableClassName} ${className}`}
                {...ableAttributes}
                onClick={this._onPreventClick}
                style={style}>
                {this.renderAbles()}
                {this._renderLines()}
            </ControlBoxElement>
        );
    }
    public componentDidMount() {
        this.isMoveableMounted = true;
        this.isUnmounted = false;
        const props = this.props;
        const { parentMoveable, container } = props;


        this._checkUpdateRootContainer();
        this._checkUpdateViewContainer();
        this._updateTargets();
        this._updateNativeEvents();
        this._updateEvents();
        this.updateCheckInput();
        this._updateObserver(this.props);

        if (!container && !parentMoveable && !this.state.isPersisted) {
            this.updateRect("", false, false);
            this.forceUpdate();
        }
    }
    public componentDidUpdate(prevProps: any) {
        this._checkUpdateRootContainer();
        this._checkUpdateViewContainer();
        this._updateNativeEvents();
        this._updateTargets();
        this._updateEvents();
        this.updateCheckInput();
        this._updateObserver(prevProps);
    }
    public componentWillUnmount() {
        this.isMoveableMounted = false;
        this.isUnmounted = true;
        this._emitter.off();
        this._reiszeObserver?.disconnect();
        this._mutationObserver?.disconnect();

        const viewContainer = this._viewContainer;

        if (viewContainer) {
            this._changeAbleViewClassNames([]);
        }
        unsetGesto(this, false);
        unsetGesto(this, true);

        const events = this.events;
        for (const name in events) {
            const manager = events[name];
            manager && manager.destroy();
        }
    }
    public getTargets(): Array<HTMLElement | SVGElement> {
        const target = this.props.target;
        return target ? [target] : [];
    }
    /**
     * Get the able used in MoveableManager.
     * @method Moveable#getAble
     * @param - able name
     */
    public getAble<T extends Able>(ableName: string): T | undefined {
        const ables: Able[] = this.props.ables || [];

        return find(ables, able => able.name === ableName) as T;
    }
    public getContainer(): HTMLElement | SVGElement {
        const { parentMoveable, wrapperMoveable, container } = this.props;

        return container!
            || (wrapperMoveable && wrapperMoveable.getContainer())
            || (parentMoveable && parentMoveable.getContainer())
            || this.controlBox.parentElement!;
    }
    public getControlBoxElement(): HTMLElement {
        return this.controlBox;
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
        return target && (target.getAttribute?.("class") || "").indexOf(PREFIX) > -1;
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
        const targetGesto = this.targetGesto;
        const controlGesto = this.controlGesto;

        if (targetGesto && checkMoveableTarget(this)({ inputEvent: e })) {
            if (!targetGesto.isFlag()) {
                targetGesto.triggerDragStart(e);
            }
        } else if (controlGesto && this.isMoveableElement(e.target as Element)) {
            if (!controlGesto.isFlag()) {
                controlGesto.triggerDragStart(e);
            }
        }
        return this;
    }
    /**
     * Hit test an element or rect on a moveable target.
     * (100% = 100)
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

        if (isNode(el)) {
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
        const isSingle = !props.parentPosition && !props.wrapperMoveable;

        if (isSingle) {
            setStoreCache(true);
        }
        const parentMoveable = props.parentMoveable;
        const state = this.state;
        const target = (state.target || props.target) as HTMLElement | SVGElement;
        const container = this.getContainer();
        const rootContainer = parentMoveable
            ? (parentMoveable as any)._rootContainer
            : this._rootContainer;
        const nextState = getMoveableTargetInfo(
            this.controlBox,
            target,
            container,
            container,
            rootContainer || container,
            this._getRequestStyles(),
        );

        if (!target && this._hasFirstTarget && props.persistData) {
            const persistState = getPersistState(props.persistData);

            for (const name in persistState) {
                (nextState as any)[name] = (persistState as any)[name];
            }
        }

        if (isSingle) {
            setStoreCache();
        }
        this.updateState(
            nextState,
            parentMoveable ? false : isSetState,
        );
    }
    /**
     * Check if the moveable state is being dragged.
     * @method Moveable#isDragging
     * @param - If you want to check if able is dragging, specify ableName.
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
    public isDragging(ableName?: string) {
        const targetGesto = this.targetGesto;
        const controlGesto = this.controlGesto;

        if (targetGesto?.isFlag()) {
            if (!ableName) {
                return true;
            }
            const data = targetGesto.getEventData();

            return !!data[ableName]?.isEventStart;
        }
        if (controlGesto?.isFlag()) {
            if (!ableName) {
                return true;
            }
            const data = controlGesto.getEventData();

            return !!data[ableName]?.isEventStart;
        }
        return false;
    }
    /**
     * If the width, height, left, and top of the only target change, update the shape of the moveable.
     * Use `.updateRect()` method
     * @method Moveable#updateTarget
     * @deprecated
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
    /**
     * You can stop the dragging currently in progress through a method from outside.
     * @method Moveable#stopDrag
     * @return - The Rect Info
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.stopDrag();
     */
    public stopDrag(type?: "target" | "control"): void {
        if (!type || type === "target") {
            const gesto = this.targetGesto;

            if (gesto?.isIdle() === false) {
                unsetAbles(this, false);
            }
            gesto?.stop();
        }
        if (!type || type === "control") {
            const gesto = this.controlGesto;

            if (gesto?.isIdle() === false) {
                unsetAbles(this, true);
            }
            gesto?.stop();
        }
    }
    public getRotation() {
        const {
            pos1,
            pos2,
            direction,
        } = this.state;

        return getAbsoluteRotation(pos1, pos2, direction);
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
                triggerAble(self, ableType, ["drag"], eventAffix, "", {
                    ...ableRequester.request(ableParam),
                    requestAble: ableName,
                    isRequest: true,
                }, requestInstant);
                return this;
            },
            requestEnd() {
                triggerAble(self, ableType, ["drag"], eventAffix, "End", {
                    ...ableRequester.requestEnd(),
                    requestAble: ableName,
                    isRequest: true,
                }, requestInstant);
                return this;
            },
        };

        triggerAble(self, ableType, ["drag"], eventAffix, "Start", {
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
        const state = this.getState();
        const props = this.props;
        const padding = props.padding;
        const {
            originalBeforeOrigin,
            transformOrigin,
            allMatrix, is3d,
            pos1, pos2, pos3, pos4,
            left: stateLeft,
            top: stateTop,
            isPersisted,
        } = state;

        if (!padding) {
            state.renderPoses = [
                pos1,
                pos2,
                pos3,
                pos4,
            ];
            return;
        }
        const {
            left,
            top,
            bottom,
            right,
        } = getPaddingBox(padding);
        const n = is3d ? 4 : 3;

        // const clipPathInfo = getClipPath(
        //     props.target,
        //     offsetWidth,
        //     offsetHeight,
        // );

        // if (clipPathInfo) {
        //     left -= Math.max(0, clipPathInfo.left);
        //     top -= Math.max(0, clipPathInfo.top);
        //     bottom -= Math.max(0, offsetHeight - clipPathInfo.bottom);
        //     right -= Math.max(0, offsetWidth - clipPathInfo.right);
        // }

        let absoluteOrigin: number[] = [];

        if (isPersisted) {
            absoluteOrigin = transformOrigin;
        } else if (this.controlBox && props.groupable) {
            absoluteOrigin = originalBeforeOrigin;
        } else {
            absoluteOrigin = plus(originalBeforeOrigin, [stateLeft, stateTop]);
        }

        const nextMatrix = multiplies(
            n,
            createOriginMatrix(absoluteOrigin.map(v => -v), n),
            allMatrix,
            createOriginMatrix(transformOrigin, n),
        );

        state.renderPoses = [
            calculatePadding(nextMatrix, pos1, [-left, -top], n),
            calculatePadding(nextMatrix, pos2, [right, -top], n),
            calculatePadding(nextMatrix, pos3, [-left, bottom], n),
            calculatePadding(nextMatrix, pos4, [right, bottom], n),
        ];
    }
    public checkUpdate() {
        this._isPropTargetChanged = false;
        const { target, container, parentMoveable } = this.props;
        const {
            target: stateTarget,
            container: stateContainer,
        } = this.state;

        if (!stateTarget && !target) {
            return;
        }
        this.updateAbles();

        const isTargetChanged = !equals(stateTarget, target);
        const isChanged = isTargetChanged || !equals(stateContainer, container);

        if (!isChanged) {
            return;
        }
        const moveableContainer = container || this.controlBox;

        if (moveableContainer) {
            this.unsetAbles();
        }
        this.updateState({ target, container });

        if (!parentMoveable && moveableContainer) {
            this.updateRect("End", false, false);
        }
        this._isPropTargetChanged = isTargetChanged;
    }
    public waitToChangeTarget(): Promise<void> {
        return new Promise(() => { });
    }
    public triggerEvent(name: string, e: any): any {
        this._emitter.trigger(name, e);
        const callback = (this.props as any)[name];

        return callback && callback(e);
    }
    public useCSS(tag: string, css: string) {
        const customStyleMap = this.props.customStyledMap as Record<string, any>;

        const key = tag + css;

        if (!customStyleMap[key]) {
            customStyleMap[key] = styled(tag, css);
        }
        return customStyleMap[key];
    }
    public checkUpdateRect = () => {
        if (this.isDragging()) {
            return;
        }
        const parentMoveable = this.props.parentMoveable;

        if (parentMoveable) {
            (parentMoveable as any).checkUpdateRect();
            return;
        }
        cancelAnimationFrame(this._observerId);
        this._observerId = requestAnimationFrame(() => {
            if (this.isDragging()) {
                return;
            }
            this.updateRect();
        });
    }
    public getState(): MoveableManagerState {
        const props = this.props;
        if (props.target || (props as any).targets?.length) {
            this._hasFirstTarget = true;
        }
        const hasControlBox = this.controlBox;
        const persistData = props.persistData;
        const firstRenderState = props.firstRenderState;

        if (firstRenderState && !hasControlBox) {
            return firstRenderState;
        }
        if (!this._hasFirstTarget && persistData) {
            const persistState = getPersistState(persistData);

            if (persistState) {
                this.updateState(persistState, false);
                return this.state;
            }
        }
        (this.state as any).isPersisted = false;
        return this.state;
    }
    public updateSelectors() { }
    protected unsetAbles() {
        this.targetAbles.forEach(able => {
            if (able.unset) {
                able.unset(this);
            }
        });
    }
    protected updateAbles(
        ables: Able[] = this.props.ables!,
        eventAffix: string = "",
    ) {
        const props = this.props as any;
        const triggerAblesSimultaneously = props.triggerAblesSimultaneously;
        const enabledAbles = this.getEnabledAbles(ables);

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
            if (this.isUnmounted) {
                return;
            }
            this.setState(nextState);
        } else {
            const state = this.state;

            for (const name in nextState) {
                (state as any)[name] = nextState[name];
            }
        }
    }
    protected getEnabledAbles(ables: Able[] = this.props.ables!) {
        const props = this.props as any;

        return ables.filter(able => able && (
            (able.always && props[able.name] !== false)
            || props[able.name]));
    }
    protected renderAbles() {
        const props = this.props as any;
        const triggerAblesSimultaneously = props.triggerAblesSimultaneously;
        const Renderer = {
            createElement,
        };

        this.renderState = {};

        return groupByMap(flat<any>(
            filterAbles(this.getEnabledAbles(), ["render"], triggerAblesSimultaneously).map(({ render }) => {
                return render!(this, Renderer) || [];
            })).filter(el => el), ({ key }) => key).map(group => group[0]);
    }
    protected updateCheckInput() {
        this.targetGesto && (this.targetGesto.options.checkInput = this.props.checkInput);
    }
    protected _getRequestStyles() {
        const styleNames = this.getEnabledAbles().reduce((names, able) => {
            const ableStyleNames = (able.requestStyle?.() ?? []) as Array<keyof CSSStyleDeclaration>;

            return [...names, ...ableStyleNames];
        }, [...(this.props.requestStyles || [])] as Array<keyof CSSStyleDeclaration>);


        return styleNames;
    }
    protected _updateObserver(prevProps: MoveableDefaultOptions) {
        this._updateResizeObserver(prevProps);
        this._updateMutationObserver(prevProps);
    }
    protected _updateEvents() {
        const controlBoxElement = this.controlBox;
        const hasTargetAble = this.targetAbles.length;
        const hasControlAble = this.controlAbles.length;
        const target = this._dragTarget;
        const isUnset = (!hasTargetAble && this.targetGesto)
            || this._isTargetChanged(true);

        if (isUnset) {
            unsetGesto(this, false);
            this.updateState({ gestos: {} });
        }
        if (!hasControlAble) {
            unsetGesto(this, true);
        }

        if (target && hasTargetAble && !this.targetGesto) {
            this.targetGesto = getTargetAbleGesto(this, target!, "");
        }
        if (!this.controlGesto && hasControlAble) {
            this.controlGesto = getAbleGesto(this, controlBoxElement, "controlAbles", "Control");
        }
    }
    protected _updateTargets() {
        const props = this.props;

        this._prevDragTarget = this._dragTarget;
        this._prevOriginalDragTarget = this._originalDragTarget;

        this._originalDragTarget = props.dragTarget || props.target;
        this._dragTarget = getRefTarget(this._originalDragTarget, true);
        this._prevDragArea = props.dragArea!;
    }
    private _renderLines() {
        const props = this.props;
        const {
            zoom,
            hideDefaultLines,
            hideChildMoveableDefaultLines,
            parentMoveable,
        } = props as MoveableManagerProps<GroupableProps>;

        if (hideDefaultLines || (parentMoveable && hideChildMoveableDefaultLines)) {
            return [];
        }
        const renderPoses = this.getState().renderPoses;
        const Renderer = {
            createElement,
        };

        return [
            [0, 1],
            [1, 3],
            [3, 2],
            [2, 0],
        ].map(([from, to], i) => {
            return renderLine(Renderer, "", renderPoses[from], renderPoses[to], zoom!, `render-line-${i}`);
        });
    }
    private _onPreventClick = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        // removeEvent(window, "click", this._onPreventClick, true);
    }
    private _isTargetChanged(useDragArea?: boolean) {
        const props = this.props;
        const nextTarget = props.dragTarget || props.target;
        const prevTarget = this._prevOriginalDragTarget;
        const prevDragArea = this._prevDragArea;
        const dragArea = props.dragArea;

        // check target without dragArea
        const isDragTargetChanged = !dragArea && prevTarget !== nextTarget;
        const isDragAreaChanged = (useDragArea || dragArea) && prevDragArea !== dragArea;

        return isDragTargetChanged || isDragAreaChanged;
    }
    private _updateNativeEvents() {
        const props = this.props;
        const target = props.dragArea ? this.areaElement : this.state.target;
        const events = this.events;
        const eventKeys = getKeys(events);

        if (this._isTargetChanged()) {
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
    private _checkUpdateRootContainer() {
        const rootContainer = this.props.rootContainer;

        if (!this._rootContainer && rootContainer) {
            this._rootContainer = getRefTarget(rootContainer, true);
        }
    }
    private _checkUpdateViewContainer() {
        const viewContainerOption = this.props.viewContainer;

        if (!this._viewContainer && viewContainerOption) {
            this._viewContainer = getRefTarget(viewContainerOption, true);
        }
        const viewContainer = this._viewContainer;

        if (viewContainer) {
            this._changeAbleViewClassNames([
                ...this._getAbleViewClassNames(),
                this.isDragging() ? VIEW_DRAGGING : "",
            ]);
        }
    }
    private _changeAbleViewClassNames(classNames: string[]) {
        const viewContainer = this._viewContainer!;
        const nextClassNames = groupBy(
            classNames.filter(Boolean),
            el => el,
        ).map(([className]) => className);
        const prevClassNames = this._viewClassNames;

        const {
            removed,
            added,
        } = diff(prevClassNames, nextClassNames);

        removed.forEach(index => {
            removeClass(viewContainer, prevClassNames[index]);
        });
        added.forEach(index => {
            addClass(viewContainer, nextClassNames[index]);
        });

        this._viewClassNames = nextClassNames;

    }
    private _getAbleViewClassNames() {
        return (this.getEnabledAbles().map(able => {
            return (able.viewClassName?.(this) || "");
        }).join(" ") + ` ${this._getAbleClassName("-view")}`).split(/\s+/g);
    }
    private _getAbleClassName(classPrefix = "") {
        const ables = this.getEnabledAbles();

        const targetGesto = this.targetGesto;
        const controlGesto = this.controlGesto;
        const targetGestoData: Record<string, any> = targetGesto?.isFlag()
            ? targetGesto.getEventData() : {};
        const controlGestoData: Record<string, any> = controlGesto?.isFlag()
            ? controlGesto.getEventData() : {};

        return ables.map(able => {
            const name = able.name;
            let className = able.className?.(this) || "";

            if (
                targetGestoData[name]?.isEventStart
                || controlGestoData[name]?.isEventStart
            ) {
                className += ` ${prefix(`${name}${classPrefix}-dragging`)}`;
            }
            return className.trim();
        }).filter(Boolean).join(" ");
    }
    private _updateResizeObserver(prevProps: MoveableDefaultOptions) {
        const props = this.props;
        const target = props.target;
        const win = getWindow(this.getControlBoxElement());

        if (!win.ResizeObserver || !target || !props.useResizeObserver) {
            this._reiszeObserver?.disconnect();
            return;
        }

        if (prevProps.target === target && this._reiszeObserver) {
            return;
        }

        const observer = new win.ResizeObserver(this.checkUpdateRect);

        observer.observe(target!, {
            box: "border-box",
        });
        this._reiszeObserver = observer;
    }
    private _updateMutationObserver(prevProps: MoveableDefaultOptions) {
        const props = this.props;
        const target = props.target;
        const win = getWindow(this.getControlBoxElement());

        if (!win.MutationObserver || !target || !props.useMutationObserver) {
            this._mutationObserver?.disconnect();
            return;
        }

        if (prevProps.target === target && this._mutationObserver) {
            return;
        }

        const observer = new win.MutationObserver(records => {
            for (const mutation of records) {
                if (mutation.type === "attributes" && mutation.attributeName === "style") {
                    this.checkUpdateRect();
                }
            }
        });

        observer.observe(target!, {
            attributes: true,
        });
        this._mutationObserver = observer;
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
 * Zooms in the elements of a moveable.
 * @name Moveable#zoom
 * @default 1
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 * moveable.zoom = 2;
 */

/**
 * Whether the target size is detected and updated whenever it changes.
 * @name Moveable#useResizeObserver
 * @default false
 * @example
 * import Moveable from "moveable";
 *
 * const moveable = new Moveable(document.body);
 * moveable.useResizeObserver = true;
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
 * You can specify the className of the moveable controlbox.
 * @name Moveable#className
 * @default ""
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
 * The target(s) to drag Moveable target(s)
 * @name Moveable#dragTarget
 * @default target
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
