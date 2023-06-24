import * as React from "react";
import Moveable, { DraggableRequestParam } from "@/react-moveable";

export default function App() {
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <button onClick={() => {
                moveableRef.current!.request<DraggableRequestParam>("draggable", {
                    deltaX: -49,
                    deltaY: 0,
                    useSnap: true,
                }, true);
            }}>Left</button>
            <button onClick={() => {
                moveableRef.current!.request<DraggableRequestParam>("draggable", {
                    deltaX: 49,
                    deltaY: 0,
                    useSnap: true,
                }, true);
            }}>Right</button>
            <div className="container">
                <div className="target">Target</div>
                <Moveable
                    ref={moveableRef}
                    target={".target"}
                    draggable={true}
                    snappable={true}
                    snapGridWidth={50}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
