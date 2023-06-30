import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="root">
            <div className="container" style={{
                transformOrigin: "0 0",
                transform: `scale(${props.containerScale})`,
            }}>
                <svg viewBox="0 0 200 200" style={{
                    position: "relative",
                    border: "1px solid black",
                    width: "200px",
                    height: "200px",
                    top: "100px",
                    left: "100px",
                }}>
                    <g className="g">
                        <path d="M 0 0 L 200 0 L 200 200 z" style={{
                            fill: "white",
                            stroke: "red",
                            strokeWidth: 2,
                            transform: "translate(50px, 50px)",
                        }} />
                    </g>
                </svg>
                <Moveable
                    target={".g"}
                    draggable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
