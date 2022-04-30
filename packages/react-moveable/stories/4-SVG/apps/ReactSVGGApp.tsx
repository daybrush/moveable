import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<SVGPathElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

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
                    <g
                        style={{
                            transform: "translate(10px, 10px) rotate(20deg)",
                        }}
                    >
                        <path d="M 0 0 L 200 0 L 200 200 z" ref={targetRef} style={{
                            fill: "white",
                            stroke: "red",
                            strokeWidth: 2,
                            transform: "translate(10px, 10px) rotate(20deg)",
                        }} />
                    </g>
                </svg>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
