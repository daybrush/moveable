import * as React from "react";
import {
    DraggableProps, makeMoveable, ResizableProps,
    RotatableProps, Rotatable, Draggable, Resizable,
} from "@/react-moveable";
import MoveableHelper from "moveable-helper";


const Moveable = makeMoveable<DraggableProps & ResizableProps & RotatableProps>([
    Draggable,
    Resizable,
    Rotatable,
]);

export default function App() {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    });
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <p>Use only Draggable, Resizable, Rotatable (30% size reduction)</p>
        <div className="target" ref={targetRef}>Target</div>
        <Moveable
            target={targetRef}
            draggable={true}
            resizable={true}
            rotatable={true}
            onDragStart={helper.onDragStart}
            onDrag={helper.onDrag}
            onResizeStart={helper.onResizeStart}
            onResize={helper.onResize}
            onRotateStart={helper.onRotateStart}
            onRotate={helper.onRotate}
        />
    </div>;
}
