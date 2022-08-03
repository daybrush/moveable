import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <button onClick={() => {
                    const width = 50 + Math.floor(50 * Math.random());
                    const height = 50 + Math.floor(50 * Math.random());

                    document.querySelectorAll<HTMLElement>(".target")[Math.floor(Math.random() * 3)].style.cssText
                        += `width: ${width}px;height: ${height}px`;
                }}>Random Resize</button>
                <div className="target target1">Target1</div>
                <div className="target target2">Target2</div>
                <div className="target target3">Target3</div>
                <Moveable
                    target={".target"}
                    individualGroupable={true}
                    draggable={true}
                    rotatable={true}
                    resizable={true}
                    useResizeObserver={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onResize={e => {
                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
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
