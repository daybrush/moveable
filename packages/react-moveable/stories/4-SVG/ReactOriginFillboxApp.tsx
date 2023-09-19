import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="root">
            <div
                className="container"
                style={{
                    transformOrigin: "0 0",
                    transform: `scale(${props.containerScale})`,
                }}
            >
                <svg
                    viewBox="0 0 500 500"
                    style={{
                        border: "1px solid black",
                        width: "500px",
                        height: "500px",
                    }}
                >
                    <rect
                        id="rect-1"
                        x="100"
                        y="100"
                        width="50"
                        height="50"
                        style={{
                            fill: "red",
                            transformBox: "fill-box",
                        }}
                        transform="rotate(45)"
                        {...{ "transform-origin": "50% 50%" }}
                    />
                </svg>
                <Moveable
                    target={"#rect-1"}
                    draggable={true}
                    rotatable={true}
                    scalable={true}
                    svgOrigin="50% 50%"
                    onRender={(e) => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
                <Moveable
                    target={"#rect-2"}
                    draggable={true}
                    rotatable={true}
                    scalable={true}
                    svgOrigin="50% 50%"
                    onRender={(e) => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
