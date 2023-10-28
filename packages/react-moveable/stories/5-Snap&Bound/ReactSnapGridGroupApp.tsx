import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {

    return (
        <div className="root">
            <div className="container" style={{
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target target1" style={{
                    top: "100px",
                    left: "100px",
                }}>Target1</div>
                <div className="target target2" style={{
                    top: "150px",
                    left: "150px",
                }}>Target2</div>
                <div className="target target3" style={{
                    top: "200px",
                    left: "200px",
                }}>Target3</div>
                <Moveable
                    target={".target"}
                    draggable={props.draggable}
                    throttleDrag={props.throttleDrag}
                    edgeDraggable={props.edgeDraggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}

                    resizable={props.resizable}
                    keepRatio={props.keepRatio}
                    edge={props.edge}

                    snappable={true}
                    snapGridWidth={50}
                    snapGridHeight={50}
                    snapThreshold={50}
                    snapGridAll={true}
                    isDisplayGridGuidelines={true}
                    onRenderGroup={e => {
                        e.events.forEach(ev => {
                            ev.target.style.cssText += ev.cssText;
                        });

                    }}
                />
            </div>
        </div>
    );
}
