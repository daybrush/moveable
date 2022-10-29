import * as React from "react";
import Moveable from "@/react-moveable";
import "./snap.css";
export default function App(props: Record<string, any>) {
    return (
        <div className="root" style={{
            position: "relative",
            border: "1px solid black",
        }}>
            <Moveable
                target={".target"}
                draggable={true}
                snappable={true}
                elementGuidelines={[document.getElementById("box1")]}
                verticalGuidelines={[0, 100, 200, 300, 400]}
                snapContainer={".snapGrid"}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                }}
            />
            <div className="container">
                <div className="snapGrid">
                    <div className="target" style={{
                        width: "200px",
                        height: "150px",
                        transform: "translate(0px, 0px) scale(1.5, 1)",
                    }}>Target</div>
                </div>
                <div className="snapGrid"></div>
            </div>
        </div>
    );
}
