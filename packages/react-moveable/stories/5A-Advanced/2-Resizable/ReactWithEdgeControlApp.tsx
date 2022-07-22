import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="target">Target1</div>
        <Moveable
            target={".target"}
            keepRatio={true}
            triggerAblesSimultaneously={true}
            resizable={{
                edge: ["e", "w"],
                renderDirections: ["e", "w"],
            }}
            scalable={{
                edge: [],
                renderDirections: ["nw", "ne", "se", "sw"],
            }}
            draggable={true}
            edgeDraggable={["n", "s"]}
            onDrag={e => {
                e.target.style.cssText += `transform: ${e.transform}`;
            }}
            onResize={e => {
                e.target.style.cssText += `width: ${e.boundingWidth}px;`
                    + `height: ${e.boundingHeight}px;`
                    + `transform: ${e.drag.transform}`;
            }}
            onScale={e => {
                e.target.style.cssText += `transform: ${e.drag.transform}`;
            }}
        />
    </div>;
}
