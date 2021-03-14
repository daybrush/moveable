import * as React from "react";
import Moveable from "../../src/react-moveable";

export default function App(props: Record<string, any>) {
    const [translate, setTranslate]  = React.useState([0, 0]);
    const [scale, setScale]  = React.useState([2, 1]);
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef} style={{
                    transform: "scale(2, 1)",
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    scalable={true}
                    keepRatio={props.keepRatio}
                    throttleScale={props.throttleScale}
                    onScaleStart={e => {
                        e.set(scale);
                        e.dragStart && e.dragStart.set(translate);
                    }}
                    onScale={e => {
                        const beforeTranslate = e.drag.beforeTranslate;
                        const scale = e.scale;

                        e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px) scale(${scale[0]}, ${scale[1]})`;
                    }}
                    onScaleEnd={e => {
                        const lastEvent = e.lastEvent;

                        if (lastEvent) {
                            setTranslate(lastEvent.drag.beforeTranslate);
                            setScale(lastEvent.scale);
                        }
                    }}
                />
            </div>
        </div>
    );
};
