import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root" style={{
            position: "relative",
            border: "1px solid black",
        }}>
            <div className="container" style={{
                position: "relative",
                top: "50px",
                left: "50px",
                border: "1px solid red",
                width: "500px",
                height: "500px",
            }}>
                <div className="target" ref={targetRef} style={{
                    width: "200px",
                    height: "150px",
                    transform: "scale(1.5, 1)",
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
                    snapCenter={props.snapCenter}
                    snapHorizontal={props.snapHorizontal}
                    snapVertical={props.snapVertical}
                    snapThreshold={props.snapThreshold}
                    verticalGuidelines={props.verticalGuidelines}
                    horizontalGuidelines={props.horizontalGuidelines}
                    snapContainer={".root"}
                    bounds={props.bounds}
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
