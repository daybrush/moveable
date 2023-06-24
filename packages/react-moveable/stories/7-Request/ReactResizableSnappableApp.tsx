import * as React from "react";
import Moveable, { ResizableRequestParam } from "@/react-moveable";

export default function App() {
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <button onClick={() => {
                moveableRef.current!.request<ResizableRequestParam>("resizable", {
                    direction: [1, 0],
                    deltaWidth: -49,
                    useSnap: true,
                }, true);
            }}>Left</button>
            <button onClick={() => {
                moveableRef.current!.request<ResizableRequestParam>("resizable", {
                    direction: [1, 0],
                    deltaWidth: 49,
                    useSnap: true,
                }, true);
            }}>Right</button>
            <div className="container">
                <div className="target">Target</div>
                <Moveable
                    ref={moveableRef}
                    target={".target"}
                    draggable={true}
                    resizable={true}
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
