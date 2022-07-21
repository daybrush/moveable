import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container" style={{
    }}>
        <div className="preview" style={{
            position: "relative",
            width: "800px",
            height: "800px",
            transform: "scale(3.67123)",
            transformOrigin: "20% 20%",
            background: "#eee",
        }}>
            <div className="target target1" style={{
                top: "0px",
                left: "0px",
                width: "142.1232px",
                transform: "translate(150px, 100px)",
            }}>Target1</div>
            <div className="target target2" style={{
                top: "0px",
                left: "100px",
                width: "142.1232px",
                transform: "translate(150px, 100px)",
            }}>Target2</div>
        </div>
        <Moveable
            target={".target"}
            draggable={true}
            snappable={true}
            snapDirections={{
                "top": true,
                "left": true,
                "bottom": true,
                "right": true,
                "center": true,
                "middle": true,
            }}
            elementSnapDirections={{
                "top": true, "left": true,
                "bottom": true, "right": true,
                "center": true, "middle": true,
            }}
            individualGroupable={true}
            snapGap={true}
            elementGuidelines={[".target1"]}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
        />
    </div>;
}
