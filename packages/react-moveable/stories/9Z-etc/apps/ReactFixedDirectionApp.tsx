import * as React from "react";
import keycon from "keycon";
import Moveable from "../../../src/react-moveable";
import { throttle } from "@daybrush/utils";


keycon.setGlobal();

export default function App() {
    return (
        <div className="root">
            <div className="container" style={{
                height: "400px",
                border: "1px solid black",
            }}>
                <div className="target resizable" style={{
                    position: "absolute",
                    width: "200px",
                    height: "100px",
                    top: "50px",
                }}>Resizable Target</div>
                <div className="target scalable" style={{
                    position: "absolute",
                    width: "200px",
                    height: "100px",
                    top: "150px",
                    left: "350px",
                }}>Scalable Target</div>
                <Moveable
                    target={".target.resizable"}
                    resizable={true}
                    keepRatio={true}
                    draggable={true}
                    rotatable={true}
                    bounds={{left: 0, top: 0, bottom: 0, right: 0, position: "css" }}
                    onResizeStart={e => {
                        e.setFixedDirection([0, 0]);
                    }}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onBeforeResize={e => {
                        if (keycon.global.shiftKey) {
                            e.setFixedDirection([-1, -1]);
                        } else {
                            e.setFixedDirection([0, 0]);
                        }
                    }}
                    onResize={e => {
                        e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                    onBeforeRotate={e => {
                        e.setRotation(throttle(e.rotation, 45));
                    }}
                    onRotate={e => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
                <Moveable
                    target={".target.scalable"}
                    scalable={true}
                    keepRatio={true}
                    draggable={true}
                    snappable={true}
                    bounds={{left: 0, top: 0, bottom: 0, right: 0, position: "css" }}
                    onScaleStart={e => {
                        e.setFixedDirection([0, 0]);
                    }}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onBeforeScale={e => {
                        if (keycon.global.shiftKey) {
                            e.setFixedDirection([-1, -1]);
                        } else {
                            e.setFixedDirection([0, 0]);
                        }
                    }}
                    onScale={e => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
};
