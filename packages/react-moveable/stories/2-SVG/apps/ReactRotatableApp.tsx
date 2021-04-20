import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const [translate, setTranslate]  = React.useState([0, 0]);
    const [rotate, setRotate]  = React.useState(0);
    const targetRef = React.useRef<HTMLDivElement>(null);
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef} style={{
                    transform: "",
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    resizable={true}
                    rotatable={props.rotatable}
                    throttleRotate={props.throttleRotate}
                    rotationPosition={props.rotationPosition}
                    onRotateStart={e => {
                        e.set(rotate);
                        e.dragStart && e.dragStart.set(translate);
                    }}
                    onRotate={e => {
                        const beforeTranslate = e.drag.beforeTranslate;
                        const rotate = e.rotate;

                        e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px) rotate(${rotate}deg)`;
                    }}
                    onRotateEnd={e => {
                        const lastEvent = e.lastEvent;

                        if (lastEvent) {
                            setTranslate(lastEvent.drag.beforeTranslate);
                            setRotate(lastEvent.rotate);
                        }
                    }}
                />
            </div>
        </div>
    );
}
