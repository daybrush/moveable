import * as React from "react";
import Moveable from "../../../src/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef} onClick={() => {
                    alert("Click");
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
