import * as React from "react";
import Moveable from "../../../src/react-moveable";
import { throttle } from "@daybrush/utils";


export default function App() {
    return (
        <div className="root">
            <div className="container" style={{
                height: "400px",
                border: "1px solid black",
            }}>
                <div className="target target1 group">Target1</div>
                <div className="target target2 group">Target2</div>
                <div className="target target3 group">Target3</div>
                <div className="target rotatable" style={{
                    position: "absolute",
                    width: "200px",
                    height: "100px",
                    top: "50px",
                }}>Single Target</div>
                <Moveable
                    target={".target.rotatable"}
                    resizable={true}
                    draggable={true}
                    rotatable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onBeforeRotate={e => {
                        e.setRotation(throttle(e.rotation, 45));
                    }}
                    onResize={e => {
                        e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                    onRotate={e => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
                <Moveable
                    target={".target.group"}
                    draggable={true}
                    rotatable={true}
                    onDragGroup={e => {
                        e.events.forEach(ev => {
                            ev.target.style.transform = ev.transform;
                        });
                    }}
                    onBeforeRotateGroup={e => {
                        e.setRotation(throttle(e.rotation, 45));
                    }}
                    onRotateGroup={e => {
                        e.events.forEach(ev => {
                            ev.target.style.transform = ev.drag.transform;
                        });
                    }}
                />
            </div>
        </div>
    );
}
