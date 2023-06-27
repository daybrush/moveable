import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef}>Target</div>
                <Moveable
                    target={targetRef}
                    originDraggable={true}
                    draggable={true}
                    rotatable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onDragOrigin={e => {
                        e.target.style.transformOrigin = e.transformOrigin;
                        e.target.style.transform = e.drag.transform;
                    }}
                    onRotate={e => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
}
