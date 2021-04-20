import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const [translate, setTranslate]  = React.useState([0, 0]);
    const targetRef = React.useRef<SVGPathElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

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
                    <path d="M 0 0 L 200 0 L 200 200 z" ref={targetRef} style={{
                        fill: "white",
                        stroke: "red",
                        strokeWidth: 2,
                    }} />
                </svg>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={props.draggable}
                    throttleDrag={props.throttleDrag}
                    edgeDraggable={props.edgeDraggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}
                    onDragStart={e => {
                        e.set(translate);
                    }}
                    onDrag={e => {
                        e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
                    }}
                    onDragEnd={e => {
                        const lastEvent = e.lastEvent;
                        lastEvent && setTranslate(lastEvent.beforeTranslate);
                    }}
                />
            </div>
        </div>
    );
}
