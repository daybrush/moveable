import * as React from "react";
import Moveable from "../../src/react-moveable";

export default function App(props: Record<string, any>) {
    const [translate, setTranslate]  = React.useState([0, 0]);
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef} style={{
                    width: "200px",
                    height: "100px",
                    maxWidth: props.maxWidth,
                    maxHeight: props.maxHeight,
                    minWidth: props.minWidth,
                    minHeight: props.minHeight,
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    resizable={props.resizable}
                    keepRatio={props.keepRatio}
                    throttleResize={props.throttleResize}
                    onResizeStart={e => {
                        e.dragStart && e.dragStart.set(translate);
                    }}
                    onResize={e => {
                        const beforeTranslate = e.drag.beforeTranslate;

                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
                        e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
                    }}
                    onResizeEnd={e => {
                        const lastEvent = e.lastEvent;

                        if (lastEvent) {
                            setTranslate(lastEvent.drag.beforeTranslate);
                        }
                    }}
                />
            </div>
        </div>
    );
};
