import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <button onClick={() => {
                    const left = 50 + Math.floor(50 * Math.random());
                    const top = 50 + Math.floor(50 * Math.random());

                    document.querySelector<HTMLElement>(".target")!.style.cssText
                        += `left: ${left}px;top: ${top}px`;
                }}>Random Position</button>
                <p>Changes in css position due to className or attribute selector are not detected.</p>
                <p>Use with `useResizeObserver`.</p>
                <div className="target">Target1</div>
                <Moveable
                    target={".target"}
                    draggable={true}
                    rotatable={true}
                    resizable={true}
                    useResizeObserver={true}
                    useMutationObserver={true}
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
