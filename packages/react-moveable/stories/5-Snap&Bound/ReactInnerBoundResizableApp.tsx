import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="root">
            <div className="container" style={{
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target">Target</div>
                <Moveable
                    target={".target"}
                    draggable={true}
                    resizable={true}
                    edge={props.edge}
                    keepRatio={props.keepRatio}
                    snappable={true}
                    innerBounds={props.innerBounds}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onResize={e => {
                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
}
