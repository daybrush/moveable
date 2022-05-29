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
                    clippable={true}
                    dragWithClip={false}
                    clipTargetBounds={true}
                    snappable={true}

                    horizontalGuidelines={[0, 100, 200, 300]}
                    // verticalGuidelines={[0, 100, 200, 300]}
                    snapThreshold={5}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onResize={e => {
                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                    onClip={e => {
                        e.target.style.clipPath = e.clipStyle;
                    }} />
            </div>
        </div>
    );
}
