import React from "react";
import Moveable from "@/react-moveable";


export default function App() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div
            className="root"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "700.2px",
                height: "700.2px",
            }}
        >
            <div
                ref={containerRef}
                className="container2"
                style={{
                    width: "299px",
                    height: "299px",
                    outline: "10px solid #ccc",
                }}
            >
                <div
                    className="target2"
                    ref={targetRef}
                    style={{
                        width: "100px",
                        height: "100px",
                    }}
                >
                    Target
                </div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={true}
                    edgeDraggable={false}
                    startDragRotate={0}
                    throttleDragRotate={0}
                    keepRatio={false}
                    throttleScale={0}
                    snappable={true}
                    snapDirections={{
                        top: true,
                        left: true,
                        bottom: true,
                        right: true,
                        center: true,
                        middle: true,
                    }}
                    elementSnapDirections={{
                        middle: true,
                        center: true,
                        top: true,
                        left: true,
                        bottom: true,
                        right: true,
                    }}
                    snapThreshold={5}
                    elementGuidelines={[containerRef]}
                    onDrag={(e) => {
                        e.target.style.transform = e.transform;
                        targetRef.current!.innerText = e.transform;
                    }}
                    onScale={(e) => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
}
