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

const ControlBoxElement = styler("div", MOVEABLE_CSS);

export default class MoveableManager<T = {}>
    extends React.PureComponent<MoveableManagerProps<T>, MoveableManagerState<T>> {
    public static defaultProps: Required<MoveableManagerProps> = {
        target: null,
        container: null,
        origin: true,
        keepRatio: true,
        parentMoveable: null,
        parentPosition: null,
        ables: [],
    };
    public state: MoveableManagerState<T> = {
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
        rotationRad: 0,
        rotationPos: [0, 0],
        beforeOrigin: [0, 0],
        origin: [0, 0],
        pos1: [0, 0],
        pos2: [0, 0],
        pos3: [0, 0],
        pos4: [0, 0],
        targetAbles: [],
        controlAbles: [],
    };
    private controlBox!: typeof ControlBoxElement extends new (...args: any[]) => infer U ? U : never;
    private controlBoxElement!: HTMLElement;
    private targetDragger!: Dragger;
    private controlDragger!: Dragger;

    public isMoveableElement(target: HTMLElement) {
        return target && ((target.getAttribute("class") || "").indexOf(PREFIX) > -1);
    }
    public render() {
        this.update(false);

        const { left: parentLeft, top: parentTop } = this.props.parentPosition! || { left: 0, top: 0 };
        const { left, top, pos1, pos2, pos3, pos4, target, direction } = this.state;

        return (
            <ControlBoxElement
                ref={ref(this, "controlBox")}
                className={prefix("control-box", direction === -1 ? "reverse" : "")} style={{
                    position: "absolute",
                    display: target ? "block" : "none",
                    transform: `translate(${left - parentLeft}px, ${top - parentTop}px) translateZ(50px)`,
                }}>
                <div className={prefix("line")} style={getLineStyle(pos1, pos2)}></div>
                <div className={prefix("line")} style={getLineStyle(pos2, pos4)}></div>
                <div className={prefix("line")} style={getLineStyle(pos1, pos3)}></div>
                <div className={prefix("line")} style={getLineStyle(pos3, pos4)}></div>
                {this.renderAbles()}
            </ControlBoxElement>
        );
    }
    public componentDidMount() {
        this.controlBox.getElement();
        this.update(true);
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

        return isInside(pos, pos1, pos2, pos3, pos4);
    }
    public updateRect(isTarget?: boolean, isSetState: boolean = true) {
        const { target, parentMoveable } = this.props;

        this.updateState(
            getTargetInfo(target, this.getContainer(), isTarget ? this.state : undefined),
            parentMoveable ? false : isSetState,
        );
    }
    public updateTarget() {
        this.updateRect(true);
    }
    public update(isSetState?: boolean) {
        const props = this.props;
        const { target, ables, parentMoveable } = props;
        const stateTarget = this.state.target;
        const controlBox = this.controlBox;

        if (!controlBox || (!stateTarget && !target)) {
            return;
        }
        const controlBoxElement = controlBox.getElement();
        const enabledAbles = ables!.filter(able => props[able.name]);
        let controlAbleOnly: boolean = false;
        const targetAbles = enabledAbles.filter(able => able.dragStart);
        const controlAbles = enabledAbles.filter(({ dragControlStart, dragControlOnly }) => {
            if (!dragControlStart || (dragControlOnly && controlAbleOnly)) {
                return false;
            }
            if (dragControlOnly) {
                controlAbleOnly = true;
            }
            return true;
        });
        const hasTargetAble = targetAbles.length;
        const hasControlAble = controlAbles.length;
        const isTargetChanged = stateTarget !== target;

        if (!hasTargetAble || isTargetChanged) {
            unset(this, "targetDragger");
        }
        if (!hasControlAble) {
            unset(this, "controlDragger");
        }
        this.updateState({
            targetAbles,
            controlAbles,
        });

        if (target && ((!this.targetDragger && hasTargetAble) || isTargetChanged)) {
            this.targetDragger = getAbleDragger(this, target!, "targetAbles", "");
        }
        if (!this.controlDragger && hasControlAble) {
            this.controlDragger = getAbleDragger(this, controlBoxElement, "controlAbles", "Control");
        }
        if (isTargetChanged && !parentMoveable) {
            this.updateRect(false, isSetState);
        }
        return isTargetChanged;
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
    private renderAbles() {
        const ables = [...this.props.ables!, Origin as Able<T>];

        return ables.map(({ render }) => render && render(this));
    }
}
