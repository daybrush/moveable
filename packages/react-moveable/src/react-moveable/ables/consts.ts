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

export const MOVEABLE_ABLES = [
    Default, Snappable, Pinchable, Draggable, Rotatable, Resizable, Scalable, Warpable, Scrollable, DragArea, Origin,
] as const;
