import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const [translate, setTranslate]  = React.useState([0, 0]);
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container" style={{
                display: "flex",
            }}>
                <div className="target" ref={targetRef} style={{
                    position: "relative",
                    width: "200px",
                    height: "100px",
                    // maxWidth: props.maxWidth,
                    // maxHeight: props.maxHeight,
                    // minWidth: props.minWidth,
                    // minHeight: props.minHeight,
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    resizable={true}
                    keepRatio={true}
                    throttleResize={1}
                    onResize={e => {
                        // const beforeTranslate = e.drag.beforeTranslate;

                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                    onResizeEnd={e => {
                        const lastEvent = e.lastEvent;

                        if (lastEvent) {
                            console.log(lastEvent.drag.transform);
                        }
                    }}
                />
            </div>
        </div>
    );
}
