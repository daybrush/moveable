import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="container">
            <button onClick={() => {
                moveableRef.current!.request("draggable", {
                    isInstant: true,
                    deltaX: 0,
                    deltaY: 0,
                });
            }}>Request</button>
            <div className="target">Target</div>

            <Moveable
                ref={moveableRef}
                target={".target"}
                draggable={true}
                rotatable={true}
                resizable={true}
                snappable={true}
                bounds={{
                    left: 200,
                    top: 0,
                }}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
            />
        </div>
    );
}
