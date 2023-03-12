import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef} style={{
                    transform: "translate(0px, 0px) rotate(0deg) scale(1, 1)",
                }}>Target</div>
                <Moveable
                    target={targetRef}
                    draggable={props.draggable}
                    throttleDrag={props.throttleDrag}
                    edgeDraggable={props.edgeDraggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}
                    scalable={true}
                    keepRatio={props.keepRatio}
                    throttleScale={props.throttleScale}
                    renderDirections={props.renderDirections}
                    rotatable={props.rotatable}
                    throttleRotate={props.throttleRotate}
                    rotationPosition={props.rotationPosition}
                    originDraggable={props.originDraggable}
                    originRelative={props.originRelative}
                    onDragOrigin={e => {
                        e.target.style.transformOrigin = e.transformOrigin;
                    }}
                    onRender={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
