import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const [target, setTarget] = React.useState<HTMLDivElement | null>(null);

    return <div>
        <div style={{
            position: "relative", margin: "150px 200px", width: 500, height: 340,
            transform: "rotate(25deg)", border: "6px solid blue",
        }}>
            <div style={{
                position: "fixed", left: 80, top: 60, width: 280, height: 180,
                border: "4px solid green",
            }}>
                <div ref={setTarget} className="nested-fixed-target" style={{
                    position: "absolute", left: 60, top: 45, width: 130, height: 80,
                    background: "orange",
                }}>
                    {(["nw", "ne", "sw", "se"] as const).map(direction =>
                        <i key={direction} data-corner={direction} style={{
                            position: "absolute", width: 0, height: 0,
                            left: direction.includes("w") ? 0 : "100%",
                            top: direction.includes("n") ? 0 : "100%",
                            pointerEvents: "none",
                        }} />
                    )}
                </div>
            </div>
        </div>
        <Moveable target={target} draggable resizable
            onDrag={e => { e.target.style.transform = e.transform; }}
            onResize={e => {
                e.target.style.width = `${e.width}px`;
                e.target.style.height = `${e.height}px`;
                e.target.style.transform = e.drag.transform;
            }}
        />
    </div>;
}
