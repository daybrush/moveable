import * as React from "react";
import Moveable from "../../../src/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="target">Target</div>
            <Moveable
                target={".target"}
                rotatable={true}
                onRotateStart={e => {
                    e.setFixedDirection([-0.5, -0.5]);
                }}
                onRotate={e => {
                    e.target.style.transform = e.drag.transform;
                }}
            />
        </div>
    );
}
