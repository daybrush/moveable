import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container" style={{
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target" style={{
                    width: "280px",
                    height: "230px",
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={".target"}
                    draggable={props.draggable}
                    throttleDrag={props.throttleDrag}
                    edgeDraggable={props.edgeDraggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}
                    rotatable={props.rotatable}
                    snappable={props.snappable}
                    bounds={props.bounds}
                    edge={props.edge}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onRotate={e => {
                        e.target.style.transform = e.afterTransform;
                    }}
                    onBound={e => {
                        console.log(e);
                    }}
                />
            </div>
        </div>
    );
}
