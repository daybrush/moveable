import * as React from "react";
import { MOVEABLE_CSS, PREFIX } from "./consts";
import {
    prefix, getLineStyle,
    getTargetInfo,
    unset,
    createIdentityMatrix3,
    isInside,
} from "./utils";
import styler from "react-css-styler";
import Dragger from "@daybrush/drag";
import { ref } from "framework-utils";
import { MoveableManagerProps, MoveableManagerState, Able } from "./types";
import Origin from "./ables/Origin";
import { getAbleDragger } from "./getAbleDragger";
import { IObject } from "@daybrush/utils";
import DragArea from "./ables/DragArea";
import CustomDragger from "./CustomDragger";

const ControlBoxElement = styler("div", MOVEABLE_CSS);

function renderLine(direction: string, pos1: number[], pos2: number[]) {
    return <div className={prefix("line", "direction", direction)}
        data-direction={direction} style={getLineStyle(pos1, pos2)}></div>;
}
export default class MoveableManager<T = {}, U = {}>
    extends React.PureComponent<MoveableManagerProps<T>, MoveableManagerState<U>> {
    public static defaultProps: Required<MoveableManagerProps> = {
        target: null,
        container: null,
        origin: true,
        keepRatio: false,
        edge: false,
        parentMoveable: null,
        parentPosition: null,
        ables: [],
        pinchThreshold: 20,
        dragArea: false,
        transformOrigin: "",
    };
    public state: MoveableManagerState<U> = {
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
    } as any;
    public targetAbles: Array<Able<T>> = [];
    public controlAbles: Array<Able<T>> = [];
    public controlBox!: typeof ControlBoxElement extends new (...args: any[]) => infer K ? K : never;
    public areaElement!: HTMLElement;
    public targetDragger!: Dragger;
    public controlDragger!: Dragger;
    public customDragger!: CustomDragger;

    public render() {
        this.checkUpdate();

        const { edge, parentPosition } = this.props;
        const { left: parentLeft, top: parentTop } = parentPosition! || { left: 0, top: 0 };
        const { left, top, pos1, pos2, pos3, pos4, target, direction } = this.state;

        return (
            <ControlBoxElement
                ref={ref(this, "controlBox")}
                className={prefix("control-box", direction === -1 ? "reverse" : "")} style={{
                    position: "absolute",
                    display: target ? "block" : "none",
                    transform: `translate(${left - parentLeft}px, ${top - parentTop}px) translateZ(50px)`,
                }}>
                {this.renderAbles()}
                {renderLine(edge ? "n" : "", pos1, pos2)}
                {renderLine(edge ? "e" : "", pos2, pos4)}
                {renderLine(edge ? "w" : "", pos1, pos3)}
                {renderLine(edge ? "s" : "", pos3, pos4)}
            </ControlBoxElement>
        );
    }
    public componentDidMount() {
        this.controlBox.getElement();
        this.updateEvent(this.props);
    }
    public componentDidUpdate(prevProps: MoveableManagerProps<T>, prevState: MoveableManagerState<U>) {
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
            || this.controlBox.getElement().offsetParent as HTMLElement;
    }
    public isMoveableElement(target: HTMLElement) {
        return target && ((target.getAttribute("class") || "").indexOf(PREFIX) > -1);
    }
    public dragStart(e: MouseEvent | TouchEvent) {
        this.targetDragger.onDragStart(e);
    }
    public isInside(clientX: number, clientY: number) {
        const { pos1, pos2, pos3, pos4, target } = this.state;

        if (!target) {
            return false;
        }
        const { left, top } = target.getBoundingClientRect();
        const pos = [clientX - left, clientY - top];

        return isInside(pos, pos1, pos2, pos4, pos3);
    }
    public updateRect(type?: "Start" | "" | "End", isTarget?: boolean, isSetState: boolean = true) {
        const parentMoveable = this.props.parentMoveable;
        const state = this.state;
        const target = (state.target || this.props.target) as HTMLElement | SVGElement;

        this.updateState(
            getTargetInfo(target, this.getContainer(), isTarget ? state : undefined),
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
    public checkUpdate() {
        const props = this.props;
        const { target, parentMoveable } = props;
        const stateTarget = this.state.target;

        if (!stateTarget && !target) {
            return;
        }
        this.updateAbles();

        const isTargetChanged = stateTarget !== target;

        if (!isTargetChanged) {
            return;
        }

        this.updateState({ target });
        if (!parentMoveable) {
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
        let controlAbleOnly: boolean = false;

        const dragStart = `drag${eventAffix}Start` as "dragStart";
        const pinchStart = `pinch${eventAffix}Start` as "pinchStart";
        const dragControlStart = `drag${eventAffix}ControlStart` as "dragControlStart";

        const targetAbles = enabledAbles.filter(able => able[dragStart] || able[pinchStart]);
        const controlAbles = enabledAbles.filter(e => {
            const dragControlOnly = e.dragControlOnly;

            if (!e[dragControlStart] || (dragControlOnly && controlAbleOnly)) {
                return false;
            }
            if (dragControlOnly) {
                controlAbleOnly = true;
            }
            return true;
        });

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
        const ables: Able[] = [...this.targetAbles, ...this.controlAbles, Origin, DragArea];

        const enabledAbles: IObject<any> = {};
        return ables.map(able => {

            if (enabledAbles[able.name] || !able.render) {
                return undefined;
            }
            enabledAbles[able.name] = true;

            return able.render(this, React);
        });
    }
}
