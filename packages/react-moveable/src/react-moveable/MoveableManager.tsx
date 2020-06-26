import * as React from "react";
import { MOVEABLE_CSS, PREFIX } from "./consts";
import {
    prefix, getLineStyle,
    getTargetInfo,
    unset,
    createIdentityMatrix3,
    isInside,
    getAbsolutePosesByState,
    getRect,
    filterAbles,
    equals,
    resetClientRect,
    throttle,
    flat,
    groupByMap,
    caculatePadding,
} from "./utils";
import styled from "react-css-styled";
import Dragger from "@daybrush/drag";
import { ref, prefixCSS } from "framework-utils";
import { MoveableManagerProps, MoveableManagerState, Able, RectInfo, Requester, PaddingBox, HitRect } from "./types";
import { triggerAble, getTargetAbleDragger, getAbleDragger } from "./getAbleDragger";
import { getRad, plus } from "./matrix";
import { IObject } from "@daybrush/utils";
import { ABLE_CSS } from "./ables/consts";

const ControlBoxElement = styled("div", prefixCSS(PREFIX, MOVEABLE_CSS + ABLE_CSS));

function renderLine(direction: string, pos1: number[], pos2: number[], index: number) {
    const rad = getRad(pos1, pos2);
    const rotation = direction ? (throttle(rad / Math.PI * 180, 15)) % 180 : -1;

    return <div key={`line${index}`} className={prefix("line", "direction", direction)}
        data-rotation={rotation}
        data-line-index={index}
        data-direction={direction} style={getLineStyle(pos1, pos2, rad)}></div>;
}
export default class MoveableManager<T = {}, U = {}>
    extends React.PureComponent<MoveableManagerProps<T>, MoveableManagerState<U>> {
    public static defaultProps: Required<MoveableManagerProps> = {
        target: null,
        dragTarget: null,
        container: null,
        rootContainer: null,
        origin: true,
        edge: false,
        parentMoveable: null,
        parentPosition: null,
        ables: [],
        pinchThreshold: 20,
        dragArea: false,
        transformOrigin: "",
        className: "",
        zoom: 1,
        triggerAblesSimultaneously: false,
        padding: {},
        pinchOutside: true,
        checkInput: false,
        groupable: false,
    };
    public state: MoveableManagerState<U> = {
        container: null,
        target: null,
        beforeMatrix: createIdentityMatrix3(),
        matrix: createIdentityMatrix3(),
        targetMatrix: createIdentityMatrix3(),
        offsetMatrix: createIdentityMatrix3(),
        targetTransform: "",
        is3d: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        transformOrigin: [0, 0],
        direction: 1,
        beforeDirection: 1,
        beforeOrigin: [0, 0],
        origin: [0, 0],
        pos1: [0, 0],
        pos2: [0, 0],
        pos3: [0, 0],
        pos4: [0, 0],
        renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]],
        targetClientRect: resetClientRect(),
        containerClientRect: resetClientRect(),
        moveableClientRect: resetClientRect(),
        rotation: 0,
    } as any;
    public targetAbles: Able[] = [];
    public controlAbles: Able[] = [];
    public controlBox!: typeof ControlBoxElement extends new (...args: any[]) => infer K ? K : never;
    public areaElement!: HTMLElement;
    public targetDragger!: Dragger;
    public controlDragger!: Dragger;
    public rotation: number = 0;
    public scale: number[] = [1, 1];
    public isUnmounted = false;

    public render() {
        const props = this.props;
        const state = this.state;
        const { edge, parentPosition, className, target: propsTarget, zoom } = props;

        this.checkUpdate();
        this.updateRenderPoses();

        const { left: parentLeft, top: parentTop } = parentPosition! || { left: 0, top: 0 };
        const { left, top, target: stateTarget, direction, renderPoses } = state;
        const groupTargets = (props as any).targets;
        const isDisplay = ((groupTargets && groupTargets.length) || propsTarget) && stateTarget;
        const ableAttributes: IObject<boolean> = {};

        this.getEnabledAbles().forEach(able => {
            ableAttributes[`data-able-${able.name}`] = true;
        });
        return (
            <ControlBoxElement
                ref={ref(this, "controlBox")}
                className={`${prefix("control-box", direction === -1 ? "reverse" : "")} ${className}`}
                {...ableAttributes}
                style={{
                    "position": "absolute",
                    "display": isDisplay ? "block" : "none",
                    "transform": `translate(${left - parentLeft}px, ${top - parentTop}px) translateZ(50px)`,
                    "--zoom": zoom,
                    "--zoompx": `${zoom}px`,
                }}>
                {this.renderAbles()}
                {renderLine(edge ? "n" : "", renderPoses[0], renderPoses[1], 0)}
                {renderLine(edge ? "e" : "", renderPoses[1], renderPoses[3], 1)}
                {renderLine(edge ? "w" : "", renderPoses[0], renderPoses[2], 2)}
                {renderLine(edge ? "s" : "", renderPoses[2], renderPoses[3], 3)}
            </ControlBoxElement>
        );
    }
    public componentDidMount() {
        this.controlBox.getElement();
        const props = this.props;
        const { parentMoveable, container } = props;

        this.updateEvent(props);
        if (!container && !parentMoveable) {
            this.updateRect("End", false, true);
        }
        this.updateCheckInput();
    }
    public componentDidUpdate(prevProps: MoveableManagerProps<T>) {
        this.updateEvent(prevProps);
        this.updateCheckInput();
    }
    public componentWillUnmount() {
        this.isUnmounted = true;
        unset(this, "targetDragger");
        unset(this, "controlDragger");
    }
    public getContainer(): HTMLElement | SVGElement {
        const { parentMoveable, container } = this.props;

        return container!
            || (parentMoveable && parentMoveable.getContainer())
            || this.controlBox.getElement().parentElement!;
    }
    public isMoveableElement(target: HTMLElement | SVGElement) {
        return target && ((target.getAttribute("class") || "").indexOf(PREFIX) > -1);
    }
    public dragStart(e: MouseEvent | TouchEvent) {
        if (this.targetDragger) {
            this.targetDragger.onDragStart(e);
        }
        return this;
    }
    public hitTest(el: Element | HitRect): number {
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
        } = this.state.targetClientRect;
        const {
            left,
            top,
            width,
            height,
        } = rect;
        const right = left + width;
        const bottom = top + height;
        const rectRight = rectLeft + rectWidth;
        const rectBottom = rectTop + rectHeight;
        const testLeft = Math.max(rectLeft, left);
        const testRight = Math.min(rectRight, right);
        const testTop = Math.max(rectTop, top);
        const testBottom = Math.min(rectBottom, bottom);

        if (testRight < testLeft || testBottom < testTop) {
            return 0;
        }

        const rectSize = (Math.min(rectRight, right) - Math.max(left, rectLeft))
        * (Math.min(rectBottom, bottom) - Math.max(rectTop, top));

        return Math.min(100, (testRight - testLeft) * (testBottom - testTop) / rectSize * 100);
    }
    public isInside(clientX: number, clientY: number) {
        const { pos1, pos2, pos3, pos4, target, targetClientRect } = this.state;

        if (!target) {
            return false;
        }
        const { left, top } = targetClientRect;
        const pos = [clientX - left, clientY - top];

        return isInside(pos, pos1, pos2, pos3, pos4);
    }
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
    public updateEvent(prevProps: MoveableManagerProps<T>) {
        const controlBoxElement = this.controlBox.getElement();
        const hasTargetAble = this.targetAbles.length;
        const hasControlAble = this.controlAbles.length;
        const props = this.props;
        const target = props.dragTarget || props.target;
        const prevTarget = prevProps.dragTarget || prevProps.target;
        const dragArea = props.dragArea;
        const prevDragArea = prevProps.dragArea;
        const isTargetChanged = !dragArea && prevTarget !== target;
        const isUnset = (!hasTargetAble && this.targetDragger)
            || isTargetChanged
            || prevDragArea !== dragArea;

        if (isUnset) {
            unset(this, "targetDragger");
            this.updateState({ dragger: null });
        }
        if (!hasControlAble) {
            unset(this, "controlDragger");
        }

        if (target && hasTargetAble && !this.targetDragger) {
            this.targetDragger = getTargetAbleDragger(this, target!, "");
        }
        if (!this.controlDragger && hasControlAble) {
            this.controlDragger = getAbleDragger(this, controlBoxElement, "controlAbles", "Control");
        }
        if (isUnset) {
            this.unsetAbles();
        }
    }
    public isDragging() {
        return (this.targetDragger ? this.targetDragger.isFlag() : false)
        || (this.controlDragger ? this.controlDragger.isFlag() : false);
    }
    public updateTarget(type?: "Start" | "" | "End") {
        this.updateRect(type, true);
    }
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
            rotation: (this.rotation || 0),
        };
    }
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
    public updateRenderPoses() {
        const state = this.state;
        const props = this.props;
        const {
            beforeOrigin, transformOrigin,
            matrix, is3d, pos1, pos2, pos3, pos4, left: stateLeft, top: stateTop } = state;
        const {
            left = 0,
            top = 0,
            bottom = 0,
            right = 0,
        } = (props.padding || {}) as PaddingBox;
        const n = is3d ? 4 : 3;
        const absoluteOrigin = (props as any).groupable ? beforeOrigin : plus(beforeOrigin, [stateLeft, stateTop]);

        state.renderPoses = [
            plus(pos1, caculatePadding(matrix, [-left, -top], transformOrigin, absoluteOrigin, n)),
            plus(pos2, caculatePadding(matrix, [right, -top], transformOrigin, absoluteOrigin, n)),
            plus(pos3, caculatePadding(matrix, [-left, bottom], transformOrigin, absoluteOrigin, n)),
            plus(pos4, caculatePadding(matrix, [right, bottom], transformOrigin, absoluteOrigin, n)),
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
        const enabledAbles = ables!.filter(able => able && props[able.name]);

        const dragStart = `drag${eventAffix}Start` as "dragStart";
        const pinchStart = `pinch${eventAffix}Start` as "pinchStart";
        const dragControlStart = `drag${eventAffix}ControlStart` as "dragControlStart";

        const targetAbles = filterAbles(enabledAbles, [dragStart, pinchStart], triggerAblesSimultaneously);
        const controlAbles = filterAbles(enabledAbles, [dragControlStart], triggerAblesSimultaneously);

        this.targetAbles = targetAbles;
        this.controlAbles = controlAbles;
    }
    protected updateState(nextState: any, isSetState?: boolean) {
        if (isSetState) {
            this.setState(nextState);
        } else {
            const state = this.state as any;

            for (const name in nextState) {
                state[name] = nextState[name];
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
        this.targetDragger && (this.targetDragger.options.checkInput = this.props.checkInput);
    }
}
