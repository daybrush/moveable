import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<SVGSVGElement>(null);

    return (
        <div className="root" style={{
            paddingLeft: "100px",
            paddingTop: "100px",
        }}>
            <div className="container" style={{
                transformOrigin: "0 0",
                transform: `scale(${props.containerScale})`,
            }}>
                <svg viewBox="0 0 200 200" ref={targetRef} style={{
                    position: "relative",
                    left: "200px",
                    top: "200px",
                    border: "1px solid black",
                    width: "200px",
                    height: "200px",
                }}>
                    <path d="M 0 0 L 200 0 L 200 200 z" style={{
                        fill: "white",
                        stroke: "red",
                        strokeWidth: 2,
                    }} />
                </svg>
                <Moveable
                    target={targetRef}
                    draggable={true}
                    rotatable={true}
                    scalable={true}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                ></Moveable>
            </div>
        </div>
    );
}
