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
} from "./utils";
import styled from "react-css-styled";
import Dragger from "@daybrush/drag";
import { ref } from "framework-utils";
import { MoveableManagerProps, MoveableManagerState, Able, RectInfo } from "./types";
import { getAbleDragger } from "./getAbleDragger";
import CustomDragger from "./CustomDragger";
import { getRad } from "@moveable/matrix";

const ControlBoxElement = styled("div", MOVEABLE_CSS);

function renderLine(direction: string, pos1: number[], pos2: number[], index: number) {
    const rad = getRad(pos1, pos2);
    const rotation = direction ? (throttle(rad / Math.PI * 180, 15)) % 180 : -1;

    return <div key={`line${index}`} className={prefix("line", "direction", direction)}
        data-rotation={rotation}
        data-direction={direction} style={getLineStyle(pos1, pos2, rad)}></div>;
}
export default class MoveableManager<T = {}, U = {}>
    extends React.PureComponent<MoveableManagerProps<T>, MoveableManagerState<U>> {
    public static defaultProps: Required<MoveableManagerProps> = {
        target: null,
        container: null,
        origin: true,
        edge: false,
        parentMoveable: null,
        parentPosition: null,
        ables: [],
        pinchThreshold: 20,
        dragArea: false,
        transformOrigin: "",
        className: "",
    };
    public state: MoveableManagerState<U> = {
        conatainer: null,
        target: null,
        beforeMatrix: createIdentityMatrix3(),
        matrix: createIdentityMatrix3(),
        targetMatrix: createIdentityMatrix3(),
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
        targetClientRect: resetClientRect(),
        containerClientRect: resetClientRect(),
        rotation: 0,
    } as any;
    public targetAbles: Array<Able<T>> = [];
    public controlAbles: Array<Able<T>> = [];
    public controlBox!: typeof ControlBoxElement extends new (...args: any[]) => infer K ? K : never;
    public areaElement!: HTMLElement;
    public targetDragger!: Dragger;
    public controlDragger!: Dragger;
    public customDragger!: CustomDragger;

    public render() {
        const props = this.props;
        const { edge, parentPosition, className, target: propsTarget } = this.props;

        this.checkUpdate();

        const { left: parentLeft, top: parentTop } = parentPosition! || { left: 0, top: 0 };
        const { left, top, pos1, pos2, pos3, pos4, target: stateTarget, direction } = this.state;
        const groupTargets = (props as any).targets;
        const isDisplay = ((groupTargets && groupTargets.length) || propsTarget) && stateTarget;
        return (
            <ControlBoxElement
                ref={ref(this, "controlBox")}
                className={`${prefix("control-box", direction === -1 ? "reverse" : "")} ${className}`} style={{
                    position: "absolute",
                    display: isDisplay ? "block" : "none",
                    transform: `translate(${left - parentLeft}px, ${top - parentTop}px) translateZ(50px)`,
                }}>
                {this.renderAbles()}
                {renderLine(edge ? "n" : "", pos1, pos2, 0)}
                {renderLine(edge ? "e" : "", pos2, pos4, 1)}
                {renderLine(edge ? "w" : "", pos1, pos3, 2)}
                {renderLine(edge ? "s" : "", pos3, pos4, 3)}
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
    }
    public componentDidUpdate(prevProps: MoveableManagerProps<T>) {
        this.updateEvent(prevProps);
    }
    public componentWillUnmount() {
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
    }
    public isInside(clientX: number, clientY: number) {
        const { pos1, pos2, pos3, pos4, target, targetClientRect } = this.state;

        if (!target) {
            return false;
        }
        const { left, top } = targetClientRect;
        const pos = [clientX - left, clientY - top];

        return isInside(pos, pos1, pos2, pos4, pos3);
    }
    public updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState: boolean = true) {
        const parentMoveable = this.props.parentMoveable;
        const state = this.state;
        const target = (state.target || this.props.target) as HTMLElement | SVGElement;
        const container = this.getContainer();
        this.updateState(
            getTargetInfo(target, container, container, isTarget ? state : undefined),
            parentMoveable ? false : isSetState,
        );
    }
    public updateEvent(prevProps: MoveableManagerProps<T>) {
        const controlBoxElement = this.controlBox.getElement();
        const hasTargetAble = this.targetAbles.length;
        const hasControlAble = this.controlAbles.length;
        const target = this.props.target;
        const prevTarget = prevProps.target;
        const dragArea = this.props.dragArea;
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
            if (dragArea) {
                this.targetDragger = getAbleDragger(this, this.areaElement!, "targetAbles", "");
            } else {
                this.targetDragger = getAbleDragger(this, target!, "targetAbles", "");
            }
        }
        if (!this.controlDragger && hasControlAble) {
            this.controlDragger = getAbleDragger(this, controlBoxElement, "controlAbles", "Control");
        }
        if (isUnset) {
            this.unsetAbles();
        }
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
        };
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

        const enabledAbles = ables!.filter(able => able && props[able.name]);

        const dragStart = `drag${eventAffix}Start` as "dragStart";
        const pinchStart = `pinch${eventAffix}Start` as "pinchStart";
        const dragControlStart = `drag${eventAffix}ControlStart` as "dragControlStart";

        const targetAbles = filterAbles(enabledAbles, [dragStart, pinchStart]);
        const controlAbles = filterAbles(enabledAbles, [dragControlStart]);

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
    protected renderAbles() {
        const props = this.props as any;
        const ables: Able[] = props.ables!;
        const enabledAbles = ables.filter(able => able && props[able.name]);
        const Renderer = { createElement: React.createElement };

        return filterAbles(enabledAbles, ["render"]).map(({ render }) => {
            return render!(this, Renderer);
        }).reduce((prev, cur) => {
            return prev.concat(cur);
        }, []);
    }
}
