import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const moveableRef = React.useRef<Moveable>(null);

    return <div className="container">
        <button onClick={() => {
            moveableRef.current!.updateRect();
        }}>Resize</button>
        <div className="target target1">Target1</div>
        <div className="target target2" style={{
            minWidth: "50px",
            minHeight: "50px",
        }}>Target2</div>
        <div className="target target3">Target3</div>
        <Moveable
            ref={moveableRef}
            target={".target"}
            hideChildMoveableDefaultLines={props.hideChildMoveableDefaultLines}
            draggable={props.draggable}
            throttleDrag={props.throttleDrag}
            edgeDraggable={props.edgeDraggable}
            startDragRotate={props.startDragRotate}
            throttleDragRotate={props.throttleDragRotate}
            resizable={props.resizable}
            keepRatio={props.keepRatio}
            throttleResize={props.throttleResize}
            renderDirections={props.renderDirections}
            rotatable={props.rotatable}
            throttleRotate={props.throttleRotate}
            rotationPosition={props.rotationPosition}
            onDragGroup={({ events }) => {
                events.forEach(ev => {
                    ev.target.style.left = `${ev.left}px`;
                    ev.target.style.top = `${ev.top}px`;
                });
            }}
            onResizeGroupStart={({ setMin, setMax }) => {
                setMin([props.minWidth, props.minHeight]);
                setMax([props.maxWidth, props.maxHeight]);
            }}
            onResizeGroup={({ events }) => {
                events.forEach(ev => {
                    ev.target.style.width = `${ev.width}px`;
                    ev.target.style.height = `${ev.height}px`;
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
