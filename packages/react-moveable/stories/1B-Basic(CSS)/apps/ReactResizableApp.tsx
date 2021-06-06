
import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef} style={{
                    maxWidth: props.maxWidth,
                    maxHeight: props.maxHeight,
                    minWidth: props.minWidth,
                    minHeight: props.minHeight,
                }}>Target</div>
                <Moveable
                    target={targetRef}
                    resizable={props.resizable}
                    keepRatio={props.keepRatio}
                    throttleResize={props.throttleResize}
                    renderDirections={props.renderDirections}
                    onResize={e => {
                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            </div>
        </div>
    );
}
