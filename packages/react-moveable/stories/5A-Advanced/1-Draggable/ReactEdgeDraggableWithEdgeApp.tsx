import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="target">Target</div>
            <Moveable
                target={".target"}
                draggable={true}
                resizable={true}
                edgeDraggable={true}
                edge={["w", "e"]}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                }}
                onResize={e => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = e.drag.transform;
                }}
            />
        </div>
    );
}
