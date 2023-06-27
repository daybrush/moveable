import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef} style={{
                    transform: "translate(0px, 0px) rotate(0deg)",
                }}>Target</div>
                <Moveable
                    target={targetRef}
                    rotatable={props.rotatable}
                    throttleRotate={props.throttleRotate}
                    rotationPosition={props.rotationPosition}
                    onRotate={e => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
}
