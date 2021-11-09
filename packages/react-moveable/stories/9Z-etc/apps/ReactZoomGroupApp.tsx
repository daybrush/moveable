import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="root">
            <div className="container" style={{
                position: "relative",
                transformOrigin: "0 0",
                transform: `scale(${props.containerScale})`,
            }}>
                <div style={{
                    position: "relative",
                    transform: "translate3d(0px, 0px, 100px)",
                }}>
                    <div className="target target1">Target1</div>
                    <div className="target target2">Target2</div>
                    <div className="target target3">Target3</div>
                </div>
                <Moveable
                    target={".target"}
                    draggable={props.draggable}
                    throttleDrag={props.throttleDrag}
                    edgeDraggable={props.edgeDraggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}
                    onDragGroup={e => {
                        e.events.forEach(ev => {
                            // console.log(ev.left, ev.top, ev.transform);
                            ev.target.style.transform = ev.transform;
                            // ev.target.style.left = `${ev.left}px`;
                            // ev.target.style.top = `${ev.top}px`;
                        });
                    }}
                ></Moveable>
            </div>
        </div>
    );
}
