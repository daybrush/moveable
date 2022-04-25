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
                    border: "1px solid black",
                    width: "200px",
                    height: "200px",
                }}>
                    <g
                        transform="translate(10, 0) translate(10, 0)"
                        style={{
                            // transform: "translate(0px, 0px)",
                        }}
                    >
                        <path d="M 0 0 L 200 0 L 200 200 z" ref={targetRef} style={{
                            fill: "white",
                            stroke: "red",
                            strokeWidth: 2,
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
