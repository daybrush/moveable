import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root" style={{
            height: "1000px",
        }}>
            <div className="container" style={{
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target" ref={targetRef} style={{
                    position: "fixed",
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={props.draggable}
                    throttleDrag={props.throttleDrag}
                    edgeDraggable={props.edgeDraggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}
                    snappable={props.snappable}
                    bounds={props.bounds}
                    onBeforeRenderStart={e => {
                        e.setTransform(e.target.style.transform);
                    }}
                    onDrag={e => {
                        console.log(e.transform);
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
