import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <p>Pinch the target with two fingers on a touch-capable device.</p>
                <p>Drag, Scale and Rotate are possible.</p>
                <div className="target">Target</div>
                <Moveable
                    target={".target"}
                    draggable={true}
                    scalable={true}
                    rotatable={true}
                    pinchable={true}
                    pinchOutside={true}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
