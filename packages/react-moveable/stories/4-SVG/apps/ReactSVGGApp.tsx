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
                        transform="translate(10, 10) rotate(0)"
                        x="50"
                        y="50"
                        style={{
                            // transform: "translate(10px, 10px) rotate(20deg)",
                        }}
                    >
                        <path d="M 50 50 L 250 50 L 250 250 z" ref={targetRef} style={{
                            transform: "translate(30px, 30px) rotate(20deg)",
                            fill: "white",
                            stroke: "red",
                            strokeWidth: 2,
                            // transform: "translate(10px, 10px) rotate(20deg)",
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
