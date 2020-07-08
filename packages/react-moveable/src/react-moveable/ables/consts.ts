import Pinchable from "./Pinchable";
import Rotatable from "./Rotatable";
import Draggable from "./Draggable";
import Resizable from "./Resizable";
import Scalable from "./Scalable";
import Warpable from "./Warpable";
import Snappable from "./Snappable";
import DragArea from "./DragArea";
import Origin from "./Origin";
import Scrollable from "./Scrollable";
import Default from "./Default";
import Padding from "./Padding";
import Clippable from "./Clippable";
import OriginDraggable from "./OriginDraggable";
import Roundable from "./Roundable";
import { Able, UnionToIntersection } from "../types";
import { IObject } from "@daybrush/utils";
import { invert } from "./utils";
import Groupable from "./Groupable";

export const MOVEABLE_ABLES = [
    Default, Snappable, Pinchable, Draggable, Rotatable,
    Resizable, Scalable, Warpable, Scrollable, DragArea, Padding, Origin, OriginDraggable,
    Clippable, Roundable, Groupable,
] as const;

export const MOVEABLE_EVENTS_PROPS_MAP = MOVEABLE_ABLES.reduce((current, able) => {
    return {...current, ...able.events};
}, {}) as UnionToIntersection<typeof MOVEABLE_ABLES[number]["events"]>;
export const MOVEABLE_PROPS_MAP = MOVEABLE_ABLES.reduce((current, able) => {
    return {...current, ...able.props};
}, {}) as UnionToIntersection<typeof MOVEABLE_ABLES[number]["props"]>;

export const MOVEABLE_EVENTS_MAP = invert(MOVEABLE_EVENTS_PROPS_MAP);
export const MOVEABLE_EVENTS: string[] = Object.keys(MOVEABLE_EVENTS_MAP);
export const MOVEABLE_PROPS: string[] = Object.keys(MOVEABLE_PROPS_MAP);

const cssMap: IObject<boolean> = {};

console.log(MOVEABLE_PROPS, MOVEABLE_PROPS_MAP, MOVEABLE_EVENTS_MAP, MOVEABLE_EVENTS);

MOVEABLE_ABLES.forEach(({ css }: Able) => {
    if (!css) {
        return;
    }
    css.forEach(text => {
        cssMap[text] = true;
    });
});

export const ABLE_CSS = Object.keys(cssMap).join("\n");
