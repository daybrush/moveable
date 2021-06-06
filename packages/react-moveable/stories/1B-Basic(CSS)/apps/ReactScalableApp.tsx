import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef} style={{
                    transform: "scale(2, 1)",
                }}>Target</div>
                <Moveable
                    target={targetRef}
                    scalable={true}
                    keepRatio={props.keepRatio}
                    throttleScale={props.throttleScale}
                    renderDirections={props.renderDirections}
                    onScale={e => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
}
