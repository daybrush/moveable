import Pinchable from "./Pinchable";
import Rotatable from "./Rotatable";
import Draggable from "./Draggable";
import Resizable from "./Resizable";
import Scalable from "./Scalable";
import Warpable from "./Warpable";
import Snappable from "./Snappable";
import { Able } from "../types";
import DragArea from "./DragArea";
import Origin from "./Origin";
import Scrollable from "./Scrollable";

export const MOVEABLE_ABLES: Able[] = [
    Snappable, Pinchable, Draggable, Rotatable, Resizable, Scalable, Warpable, Scrollable, DragArea,  Origin,
];
