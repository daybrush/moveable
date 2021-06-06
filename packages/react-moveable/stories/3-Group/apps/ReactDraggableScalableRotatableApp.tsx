import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return <div className="container">
        <div className="target target1">Target1</div>
        <div className="target target2">Target2</div>
        <div className="target target3">Target3</div>
        <Moveable
            target={".target"}
            draggable={props.draggable}
            throttleDrag={props.throttleDrag}
            edgeDraggable={props.edgeDraggable}
            startDragRotate={props.startDragRotate}
            throttleDragRotate={props.throttleDragRotate}
            scalable={props.scalable}
            keepRatio={props.keepRatio}
            throttleScale={props.throttleScale}
            renderDirections={props.renderDirections}
            rotatable={props.rotatable}
            throttleRotate={props.throttleRotate}
            rotationPosition={props.rotationPosition}
            onDragGroup={({ events }) => {
                events.forEach(ev => {
                    ev.target.style.transform = ev.transform;
                });
            }}
            onScaleGroup={({ events }) => {
                events.forEach(ev => {
                    ev.target.style.transform = ev.drag.transform;
                });
            }}
            onRotateGroup={({ events }) => {
                events.forEach(ev => {
                    ev.target.style.transform = ev.drag.transform;
                });
            }}
        />
    </div>;
}
