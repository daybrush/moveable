import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const spanRef = React.useRef<HTMLSpanElement>(null);

    return <div className="container">
        <span ref={spanRef}>Position</span>
        <div className="preview" style={{
            position: "relative",
            width: "800px",
            height: "800px",
            // transform: "scale(0.67123)",
            transformOrigin: "top left",
            background: "#eee",
        }}>
            <div className="target" style={{
                top: "0px",
                left: "0px",
                transform: "translate(150px, 100px)",
            }}>Target</div>
        </div>
        <Moveable
            target={".target"}
            draggable={true}
            snappable={true}
            snapContainer=".preview"
            bounds={{
                left: 0,
                top: 0,
            }}
            onDrag={e => {
                e.target.style.transform = e.transform;

                spanRef.current!.innerHTML = `${e.translate[0]} x ${e.translate[1]}`;
            }}
        />
    </div>;
}
