import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <svg viewBox="0 0 200 200" style={{
            border: "1px solid black",
            width: "200px",
            height: "200px",
        }}>
            <svg viewBox="0 0 200 200" style={{
                border: "1px solid black",
                width: "200px",
                height: "200px",
            }}>
                <path d="M 0 0 L 200 0 L 200 200 z"
                    className="svg"
                    style={{
                        fill: "white",
                        stroke: "red",
                        strokeWidth: 2,
                    }} />
            </svg>
        </svg>
        <Moveable
            target={".svg"}
            draggable={true}
            preventClickDefault={true}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
        />
    </div>;
}
