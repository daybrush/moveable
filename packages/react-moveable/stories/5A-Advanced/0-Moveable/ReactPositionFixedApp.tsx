import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container" style={{
                height: "400px",
                border: "10px solid black",
                transform: "translate(40px, 40px)",
            }}>
                <div className="target" style={{
                    position: "fixed",
                    width: "200px",
                    height: "100px",
                    top: "50px",
                    left: "50px",
                }}>Fixed Target</div>
                <Moveable
                    target={".target"}
                    // rootContainer={document.body}
                    resizable={true}
                    draggable={true}
                    rotatable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onResize={e => {
                        e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                    onRotate={e => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
}
