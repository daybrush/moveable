import * as React from "react";
import {
    DraggableProps, makeMoveable, ResizableProps,
    RotatableProps, Rotatable, Draggable, Resizable,
} from "@/react-moveable";


const Moveable = makeMoveable<DraggableProps & ResizableProps & RotatableProps>([
    Draggable,
    Resizable,
    Rotatable,
]);

export default function App() {
    const targetRef = React.useRef<HTMLDivElement>(null);
    return <div className="container">
        <p>Use only Draggable, Resizable, Rotatable (30% size reduction)</p>
        <div className="target" ref={targetRef}>Target</div>
        <Moveable
            target={targetRef}
            draggable={true}
            resizable={true}
            rotatable={true}
            onRender={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
