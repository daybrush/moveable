import Pinchable from "./Pinchable";
import Rotatable from "./Rotatable";
import Draggable from "./Draggable";
import Resizable from "./Resizable";
import Scalable from "./Scalable";
import Warpable from "./Warpable";
import { Able } from "../types";
import Snappable from "./Snappable";

export const MOVEABLE_ABLES: Able[] = [Snappable, Pinchable, Draggable, Rotatable, Resizable, Scalable, Warpable];
