import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="root">
            <div className="container">
                <div className="target target1" style={{
                    transform: "translate(0px, 0px) rotate(0deg) scale(1, 1)",
                }}>Target1</div>
                <div className="target target2" style={{
                    transform: "translate(0px, 0px) rotate(0deg) scale(1, 1)",
                }}>Target2</div>
                <div className="target target3" style={{
                    transform: "translate(0px, 0px) rotate(0deg) scale(1, 1)",
                }}>Target3</div>
                <Moveable
                    target={".target"}
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
                    onRenderGroup={e => {
                        e.events.forEach(ev => {
                            ev.target.style.transform = ev.transform;
                        });
                    }}
                />
            </div>
        </div>
    );
}
