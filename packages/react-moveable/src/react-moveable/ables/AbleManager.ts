import { IObject } from "@daybrush/utils";
import * as GestoTypes from "gesto";
import CustomGesto, { setCustomDrag } from "../gesto/CustomGesto";
import { fillTransformStartEvent } from "../gesto/GestoUtils";
import { fillChildEvents } from "../groupUtils";
import { Able, AbleRequester, ExcludeKeys, MoveableGroupInterface, MoveableManagerInterface, Renderer } from "../types";


type ExcludeParams<T> = ExcludeKeys<T, "moveable" | "target" | "clientX" | "clientY" | "inputEvent" | "datas" | "currentTarget">;
type ExcludeEndParams<T> = ExcludeKeys<ExcludeParams<T>, "lastEvent" | "isDrag" | "isDouble">;
type ExcludeGroupEndParams<T> = ExcludeKeys<ExcludeEndParams<T>, "targets">;
type DefaultProps<Name extends string, AbleObject extends Partial<Able<any, any>>> = AbleObject extends { props: {} }
    ? AbleObject["props"]
    : { readonly [key in Name]: BooleanConstructor; };

export function makeAble<
    Name extends string,
    AbleObject extends Partial<Able<any, any>>,
    Props extends DefaultProps<Name, AbleObject>,
>(name: Name, able: AbleObject) {
    return {
        events: {} as const,
        props: {
            [name]: Boolean,
        } as Props,
        ...able,
        name,
    } as const;
}


/**
 * @memberof Moveable
 * @description You can make Able that can work in Moveable.
 * In Able, you can manage drag events, props, state, fire event props, and render elements.
 * @example
 * import { Able, Renderer } from "react-moveable";
 * interface OnEvent1 {
 *     prop1: number;
 * }
 * interface CustomProps {
 *    type1: string;
 *    onEvent1: OnEvent1;
 * }
 * class CustomAble extends Able<CustomProps> {
 *    static ableName = "customAble" as const;
 *    static props = {
 *        type1: StringConstructor,
 *    } as const;
 *    static events = {
 *        onEvent1: "event1",
 *    } as const;
 *    public render(React: Renderer) {
 *        return React.createElement("div", {
 *            key: "moveable-custom-div",
 *            className: "moveable-custom-div",
 *        });
 *    }
 * }
 */
class AbleManager<Props = {}, State = {}> {
    /**
     * Unique name of the able
     */
    static ableName = "";
    /**
     * Key (prop name), value (name without `on` prefix) pairs of events that occur in the able
     */
    static events = {} as const;
    /**
     * Key (prop name), value (Contructor) pair of props used in the able
     */
    static props = {} as const;
    static ableGroup = "";
    static canPinch = false;
    static css = [];

    private _ables: Array<AbleManager<Props, State>> = [];
    private _moveable: MoveableManagerInterface<Props, State>;

    /**
     * @param moveable
     */
    constructor(moveable: MoveableManagerInterface<Props, State>) {
        this._moveable = moveable;
    }
    /**
     * Returns a moveable with the type of the group interface.
     */
    public get moveableGroup() {
        return this._moveable as MoveableGroupInterface<Props, State>;
    }
    /**
     * Returns a moveable with the type of the base interface.
     */
    public get moveable() {
        return this._moveable as MoveableManagerInterface<Props, State>;
    }
    /**
     * Unique name of the able
     */
    public get name() {
        return (this.constructor as typeof AbleManager).ableName;
    }
    /**
     * Trigger event.
     * @param - prop name to trigger the event
     * @param - params of the event
     * @param - Whether to trigger non-group events on a MoveableGroup
     */
    public triggerEvent<T extends Props, U extends keyof T>(
        name: U & string,
        params: T[U] extends ((e: infer P) => any) | undefined ? P : IObject<any>,
        isManager?: boolean,
    ): any {
        return this.moveable.triggerEvent(name, params as any, isManager);
    }
    /**
     * Trigger the children's events on the Group event.
     * @param - Drag type to trigger
     * @param - The delta value of how much dragged. If it is a start event, the client value
     * @param - event parameter
     */
    public triggerChildEvents(
        type: "dragStart" | "drag" | "dragEnd" | "dragControlStart" | "dragControl" | "dragControlEnd",
        delta: number[],
        e: any,
    ) {
        const moveable = this.moveableGroup;
        const isStart = !!type.match(/Start$/g);
        const isEnd = !!type.match(/End$/g);
        const isPinch = e.isPinch;
        const datas = e.datas;
        const ableName = this.name;
        const events = fillChildEvents(moveable, ableName, e);

        const moveables = moveable.moveables;

        if (isStart) {
            const Contructor = this.constructor as typeof AbleManager;
            this._ables = moveables.map(moveable => {
                return new Contructor<Props, State>(moveable as any);
            });
        }
        const ables = this._ables;
        const childs = events.map((ev, i) => {
            const childMoveable = moveables[i];
            let childEvent: any = ev;

            if (isStart) {
                childEvent = new CustomGesto().dragStart(delta, ev);
            } else {
                if (!childMoveable.state.gesto) {
                    childMoveable.state.gesto = datas.childGestos[i];
                }
                childEvent = setCustomDrag(ev, childMoveable.state, delta, isPinch, false);
            }
            const result = ables[i][type]!({ ...childEvent, parentFlag: true });

            if (isEnd) {
                childMoveable.state.gesto = null;
            }
            return result;
        });
        if (isStart) {
            datas.childGestos = moveables.map(child => child.state.gesto);
        }
        return childs;
    }
    /**
     * Fill in the default parameters of the event to be triggered.
     * @example
     * const result = this.fillParams(e, {
     *    a: 1,
     * });
     * // result.a
     * // result.target
     * // result.clientX
     * // result.clientY
     * // result.inputEvent
     * // result.moveable
     * // result.datas
     */
    public fillParams<Event>(e: any, params: ExcludeParams<Event>): Event {
        const moveable = this.moveable;
        const datas = e.datas;

        if (!datas.datas) {
            datas.datas = {};
        }
        const nextParams = {
            ...params,
            target: moveable.state.target,
            clientX: e.clientX,
            clientY: e.clientY,
            inputEvent: e.inputEvent,
            currentTarget: moveable,
            moveable,
            datas: datas.datas,
        } as any;

        if (datas.isStartEvent) {
            datas.lastEvent = nextParams;
        } else {
            datas.isStartEvent = true;
        }
        return nextParams;
    }
    /**
     *
     */
    public fillTransformStartParams<Event>(e: any, params: ExcludeParams<Event>): Event {
        return this.fillParams<Event>(e, {
            ...params,
            ...fillTransformStartEvent(e),
        });
    }
    /**
     * Fill in the default parameters of the end event to be triggered.
     * @example
     * const result = this.fillEndParams(e, {
     *    a: 1,
     * });
     * // result.a
     * // result.lastEvent
     * // result.isDrag
     * // result.isDouble
     *
     * // result.target
     * // result.clientX
     * // result.clientY
     * // result.inputEvent
     * // result.moveable
     * // result.datas
     */
    public fillEndParams<Event>(e: any, params: ExcludeEndParams<Event> & { isDrag?: boolean }): Event {
        const moveable = this.moveable;
        const datas = e.datas;
        const isDrag = "isDrag" in params ? params.isDrag : e.isDrag;

        if (!datas.datas) {
            datas.datas = {};
        }

        return {
            isDrag,
            ...params,
            moveable,
            target: moveable.state.target,
            clientX: e.clientX,
            clientY: e.clientY,
            inputEvent: e.inputEvent,
            currentTarget: moveable,
            lastEvent: datas.lastEvent,
            isDouble: e.isDouble,
            datas: datas.datas,
        } as any;
    }
    /**
     * Fill in the default parameters of the end event to be triggered for group event.
     * @example
     * const result = this.fillGroupEndParams(e, {
     *    a: 1,
     * });
     * // result.a
     *
     * // result.targets
     *
     * // result.lastEvent
     * // result.isDrag
     * // result.isDouble
     *
     * // result.target
     * // result.clientX
     * // result.clientY
     * // result.inputEvent
     * // result.moveable
     * // result.datas
     */
    public fillGroupEndParams<Event>(e: any, params: ExcludeGroupEndParams<Event> & { isDrag?: boolean }): Event {
        return {
            ...this.fillEndParams(e, params) as any,
            targets: this.moveableGroup.props.targets,
        };
    }
}

interface AbleManager<Props = {}, State = {}> {
    // Fired when the event is cleared
    unset?(): any;
    // Renders the React DOM structure for the able.
    render?(renderer: Renderer): any;

    // Operates when a drag event occurs for the single target.
    dragStart?(e: GestoTypes.OnDragStart): any;
    drag?(e: GestoTypes.OnDrag): any;
    dragEnd?(e: GestoTypes.OnDragEnd): any;

    // Operates when a pinch event occurs for the single target.
    pinchStart?(e: GestoTypes.OnPinchStart): any;
    pinch?(e: GestoTypes.OnPinch): any;
    pinchEnd?(e: GestoTypes.OnPinchEnd): any;

    // Condition that occurs dragControl
    dragControlCondition?(e: any): boolean;
    // Operates when a drag event occurs for the moveable control and single target.
    dragControlStart?(e: GestoTypes.OnDragStart): any;
    dragControl?(e: GestoTypes.OnDrag): any;
    dragControlEnd?(e: GestoTypes.OnDragEnd): any;

    // Condition that occurs dragGroup
    dragGroupCondition?(e: any): boolean;
    // Operates when a drag event occurs for the multi target.
    dragGroupStart?(e: GestoTypes.OnDragStart): any;
    dragGroup?(e: GestoTypes.OnDrag): any;
    dragGroupEnd?(e: GestoTypes.OnDragEnd): any;

    // Operates when a pinch event occurs for the multi target.
    pinchGroupStart?(e: GestoTypes.OnPinchStart): any;
    pinchGroup?(e: GestoTypes.OnPinch): any;
    pinchGroupEnd?(e: GestoTypes.OnPinchEnd): any;

    // Condition that occurs dragGroupControl
    dragGroupControlCondition?(e: any): boolean;

    // Operates when a drag event occurs for the moveable control and multi target.
    dragGroupControlStart?(e: GestoTypes.OnDragStart): any;
    dragGroupControl?(e: GestoTypes.OnDragStart): any;
    dragGroupControlEnd?(e: GestoTypes.OnDragEnd): any;

    // mouse enter event
    mouseEnter?(e: any): any;
    // mouse leave event
    mouseLeave?(e: any): any;

    // Execute the operation of able for external request
    request?(): AbleRequester;
}

export { AbleManager };
