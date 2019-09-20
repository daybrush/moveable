import Pinchable from "./Pinchable";
import Rotatable from "./Rotatable";
import Draggable from "./Draggable";
import Resizable from "./Resizable";
import Scalable from "./Scalable";
import Warpable from "./Warpable";
import Snappable from "./Snappable";
import { Able } from "../types";

export const MOVEABLE_ABLES: Able[] = [
    Snappable, Pinchable, Draggable, Rotatable, Resizable, Scalable, Warpable,
];
