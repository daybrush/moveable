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
                    target={"path"}
                    draggable={true}
                    rotatable={true}
                    scalable={true}
                    svgOrigin="50% 50%"
                    // onRotateStart={e => {
                    //     e.setFixedDirection([0, 0]);
                    // }}
                    // onScaleStart={e => {
                    //     e.setFixedDirection([0, 0]);
                    // }}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
