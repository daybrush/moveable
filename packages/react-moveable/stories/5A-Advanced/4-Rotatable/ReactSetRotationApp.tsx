import * as React from "react";
import Moveable from "@/react-moveable";
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
                    onBeforeRotate={e => {
                        e.setRotation(throttle(e.rotation, 45));
                    }}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;

                    }}
                />
                <Moveable
                    target={".target.group"}
                    draggable={true}
                    rotatable={true}
                    onBeforeRotateGroup={e => {
                        e.setRotation(throttle(e.rotation, 45));
                    }}
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
