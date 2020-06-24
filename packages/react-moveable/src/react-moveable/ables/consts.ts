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
import { Able } from "../types";
import { IObject } from "@daybrush/utils";

export const MOVEABLE_ABLES = [
    Default, Snappable, Pinchable, Draggable, Rotatable,
    Resizable, Scalable, Warpable, Scrollable, DragArea, Padding, Origin, OriginDraggable,
    Clippable,
    Roundable,
] as Able[];

const cssMap: IObject<boolean> = {};

MOVEABLE_ABLES.forEach(({ css }) => {
    if (!css) {
        return;
    }
    css.forEach(text => {
        cssMap[text] = true;
    });
});

export const ABLE_CSS = Object.keys(cssMap).join("\n");
