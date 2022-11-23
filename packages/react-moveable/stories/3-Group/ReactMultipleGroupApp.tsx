import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const moveableRef = React.useRef<Moveable>(null);
    return (<div className="container">
        <button onClick={() => {
            moveableRef.current!.updateRect();
        }}>Resize</button>
        <div className="target target1"  style={{
            transform: "rotate(30deg)",
        }}>Target1</div>
        <div className="target target2">Target2</div>
        <div className="target target3" style={{
            transform: "rotate(30deg)",
        }}>Target3</div>
        <Moveable
            ref={moveableRef}
            target={[[".target1, .target2"], ".target3"]}
            draggable={true}
            rotatable={true}
            scalable={true}
            onRenderGroup={e => {
                e.events.forEach(ev => {
                    ev.target.style.transform = ev.transform;
                });
            }}
        />
    </div>);
}
