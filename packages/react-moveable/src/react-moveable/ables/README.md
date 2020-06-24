## Able Interface

```ts
interface Able {
    name: string;
    props: IObject<any>;
    ableGroup?: string;
    updateRect?: boolean;
    canPinch?: boolean;
    unset?: (moveable: any) => any;
    render?: (moveable: any, renderer: Renderer) => any;

    dragStart?: (moveable: any, e: DraggerTypes.OnDragStart) => any;
    drag?: (moveable: any, e: DraggerTypes.OnDrag) => any;
    dragEnd?: (moveable: any, e: DraggerTypes.OnDragEnd) => any;

    pinchStart?: (moveable: any, e: DraggerTypes.OnPinchStart) => any;
    pinch?: (moveable: any, e: DraggerTypes.OnPinch) => any;
    pinchEnd?: (moveable: any, e: DraggerTypes.OnPinchEnd) => any;

    dragControlCondition?: (target: SVGElement | HTMLElement) => boolean;
    dragControlStart?: (moveable: any, e: DraggerTypes.OnDragStart) => any;
    dragControl?: (moveable: any, e: DraggerTypes.OnDrag) => any;
    dragControlEnd?: (moveable: any, e: DraggerTypes.OnDragEnd) => any;

    dragGroupCondition?: (e: any) => boolean;
    dragGroupStart?: (moveable: any, e: DraggerTypes.OnDragStart) => any;
    dragGroup?: (moveable: any, e: DraggerTypes.OnDrag) => any;
    dragGroupEnd?: (moveable: any, e: DraggerTypes.OnDragEnd) => any;

    pinchGroupStart?: (moveable: any, e: DraggerTypes.OnPinchStart) => any;
    pinchGroup?: (moveable: any, e: DraggerTypes.OnPinch) => any;
    pinchGroupEnd?: (moveable: any, e: DraggerTypes.OnPinchEnd) => any;

    dragGroupControlCondition?: (e: any) => boolean;
    dragGroupControlStart?: (moveable: any, e: DraggerTypes.OnDragStart) => any;
    dragGroupControl?: (moveable: any, e: DraggerTypes.OnDragStart) => any;
    dragGroupControlEnd?: (moveable: any, e: DraggerTypes.OnDragEnd) => any;

    request?: (moveable: any) => AbleRequester;
}

```


## Example

```ts
import { Renderer } from "../types";

export default {
    name: "draggable",
    props: {
        draggable: Boolean,
    },
    render(moveable: MoveableManager, React: Renderer) {
        return <div></div>;
    },
}
```
