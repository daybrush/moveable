import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {

    return (
        <div className="root">
            <div className="container">
                <div className="target" style={{
                    position: "relative",
                    top: "50px",
                    left: "50px",
                    width: "200px",
                    height: "200px",
                }}>Target</div>
                <Moveable
                    target=".target"
                    draggable={true}
                    resizable={{
                        keepRatio: true,
                    }}
                    clippable={{
                        keepRatio: false,
                    }}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onResize={e => {
                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                    onClip={e => {
                        e.target.style.clipPath = e.clipStyle;
                    }} />
            </div>
        </div>
    );
}
