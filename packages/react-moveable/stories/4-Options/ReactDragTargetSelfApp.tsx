import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="drag-area" style={{
            width: "100px",
            height: "100px",
        }}>Drag</div>
        <div className="target"></div>
        <Moveable
            target={".target"}
            draggable={true}
            scalable={true}
            rotatable={true}
            dragTarget={".drag-area"}
            dragTargetSelf={true}
            onRender={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
