import * as React from "react";
import Moveable, { ResizableRequestParam } from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const moveableRef = React.useRef<Moveable>(null);

    return <div className="root">
        <button onClick={() => {
            moveableRef.current!.request<ResizableRequestParam>("resizable", {
                deltaHeight: 12,
            }, true);
        }}>request</button>
        <div className="input"></div>
        <div className="container">
            <div className="target" style={{
                width: "381.609px",
                height: "119.416px",
                color: "black",
                marginTop: "20px",
                marginLeft: "20px",
                border: "none",
            }}>Target1</div>
            <Moveable
                ref={moveableRef}
                target={".target"}
                resizable={true}
                onResize={(e) => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    const input = document.querySelector(".input")!;

                    input.innerHTML = JSON.stringify({ dist: e.dist, width: e.width, height: e.height });
                }}
            />
        </div>
    </div>;
}
