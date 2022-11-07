import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef} style={{
                    top: "50px",
                    left: "50px",
                    width: "200px",
                    height: "200px",
                }}>Target</div>
                <Moveable
                    target={targetRef}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    clippable={true}
                    dragWithClip={true}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
