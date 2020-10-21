## Able Interface

```ts
export interface Able<Props extends IObject<any> = IObject<any>, Events extends IObject<any> = IObject<any>> {
    name: string;
    props: { [key in keyof Props]: any };
    events: { [key in keyof Events]: string };
    // Whether to always include in able. It is recommended to use always in frameworks other than react
    always?: boolean;
    ableGroup?: string;
    updateRect?: boolean;
    canPinch?: boolean;
    css?: string[];
    // Fired when the event is cleared
    unset?: (moveable: any) => any;
    // Renders the React DOM structure for the able.
    render?: (moveable: any, renderer: Renderer) => any;

    // Operates when a drag event occurs for the single target.
    dragStart?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    drag?: (moveable: any, e: GestoTypes.OnDrag) => any;
    dragEnd?: (moveable: any, e: GestoTypes.OnDragEnd) => any;

    // Operates when a pinch event occurs for the single target.
    pinchStart?: (moveable: any, e: GestoTypes.OnPinchStart) => any;
    pinch?: (moveable: any, e: GestoTypes.OnPinch) => any;
    pinchEnd?: (moveable: any, e: GestoTypes.OnPinchEnd) => any;

    // Condition that occurs dragControl
    dragControlCondition?: (target: SVGElement | HTMLElement) => boolean;
    // Operates when a drag event occurs for the moveable control and single target.
    dragControlStart?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    dragControl?: (moveable: any, e: GestoTypes.OnDrag) => any;
    dragControlEnd?: (moveable: any, e: GestoTypes.OnDragEnd) => any;

    // Condition that occurs dragGroup
    dragGroupCondition?: (e: any) => boolean;
    // Operates when a drag event occurs for the multi target.
    dragGroupStart?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    dragGroup?: (moveable: any, e: GestoTypes.OnDrag) => any;
    dragGroupEnd?: (moveable: any, e: GestoTypes.OnDragEnd) => any;

    // Operates when a pinch event occurs for the multi target.
    pinchGroupStart?: (moveable: any, e: GestoTypes.OnPinchStart) => any;
    pinchGroup?: (moveable: any, e: GestoTypes.OnPinch) => any;
    pinchGroupEnd?: (moveable: any, e: GestoTypes.OnPinchEnd) => any;

    // Condition that occurs dragGroupControl
    dragGroupControlCondition?: (e: any) => boolean;
    // Operates when a drag event occurs for the moveable control and multi target.
    dragGroupControlStart?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    dragGroupControl?: (moveable: any, e: GestoTypes.OnDragStart) => any;
    dragGroupControlEnd?: (moveable: any, e: GestoTypes.OnDragEnd) => any;

    // Execute the operation of able for external request
    request?: (moveable: any) => AbleRequester;
}

```


## Example

```ts
import { Renderer } from "../types";

const CustomAble = {
    name: "customAble",
    always: true,
    props: {
        draggable: Boolean,
    },
    events: {},
    render(moveable: MoveableManager, React: Renderer) {
        return <div></div>;
    },
}

<Moveable ables={[CustomAble]}>
```
