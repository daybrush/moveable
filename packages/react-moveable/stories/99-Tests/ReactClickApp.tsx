import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container" style={{
                height: "100px",
            }} onClick={() => {
                console.log("Click");
            }} onMouseDown={() => {
                console.log("MouseDown");
            }}>
                <div className="target" ref={targetRef}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    resizable={true}
                    preventClickDefault={true}
                    draggable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
