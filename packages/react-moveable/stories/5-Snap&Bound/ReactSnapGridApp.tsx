import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container" style={{
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target" ref={targetRef} style={{
                    width: "200px",
                    height: "150px",
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={props.draggable}
                    throttleDrag={props.throttleDrag}
                    edgeDraggable={props.edgeDraggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}
                    scalable={props.scalable}
                    keepRatio={props.keepRatio}
                    throttleScale={props.throttleScale}
                    snappable={props.snappable}
                    snapGridWidth={props.snapGridWidth}
                    snapGridHeight={props.snapGridHeight}
                    onBeforeRenderStart={e => {
                        e.setTransform(e.target.style.transform);
                    }}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onScale={e => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
}
