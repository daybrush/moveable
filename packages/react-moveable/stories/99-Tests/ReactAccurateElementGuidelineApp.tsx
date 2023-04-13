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
                width: "700px",
                height: "700px",
            }}
        >
            <div
                ref={containerRef}
                className="container2"
                style={{
                    // position: "relative",
                    width: "499px",
                    height: "499px",
                    outline: "1px solid #ccc",
                }}
            >
                <div
                    className="target2"
                    ref={targetRef}
                    style={{
                        width: "200px",
                        height: "200px",
                    }}
                >
                    Target
                </div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={true}
                    scalable={true}
                    edgeDraggable={false}
                    startDragRotate={0}
                    throttleDragRotate={0}
                    keepRatio={false}
                    throttleScale={0}
                    snappable={true}
                    // snapDirections={{
                    //     top: true,
                    //     left: true,
                    //     // bottom: true,
                    //     // right: true,
                    //     // center: true,
                    //     // middle: true,
                    // }}
                    // elementSnapDirections={{
                    //     // middle: true,
                    //     // center: true,
                    //     top: true,
                    //     left: true,
                    //     // bottom: true,
                    //     // right: true,
                    // }}
                    // snapThreshold={10}
                    elementGuidelines={[containerRef]}
                    horizontalGuidelines={[150]}
                    verticalGuidelines={[220]}
                    onDrag={(e) => {
                        e.target.style.cssText += e.cssText;
                        targetRef.current!.innerText = e.transform;
                    }}
                    onScale={(e) => {
                        e.target.style.cssText += e.cssText;
                        targetRef.current!.innerText = e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
