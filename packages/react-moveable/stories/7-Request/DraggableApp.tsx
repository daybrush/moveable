import * as React from "react";
import Moveable from "../../src/react-moveable";

export default function App(props: Record<string, any>) {
    const [translate, setTranslate]  = React.useState([0, 0]);
    const targetRef = React.useRef<HTMLDivElement>(null);
    const xInputRef = React.useRef<HTMLInputElement>(null);
    const yInputRef = React.useRef<HTMLInputElement>(null);
    const moveableRef = React.useRef<Moveable>(null);
    const [requestCallbacks] = React.useState(() => {
        function request() {
            moveableRef.current!.request("draggable", {
                x: parseInt(xInputRef.current!.value),
                y: parseInt(yInputRef.current!.value),
            }, true);
        }
        return {
            onInput(e: any) {
                const ev = (e.nativeEvent || e) as InputEvent;

                if (typeof ev.data === "undefined") {
                    request();
                }
            },
            onKeyUp(e: any) {
                e.stopPropagation();

                // enter
                if (e.keyCode === 13) {
                    request();
                }
            },
        };
    });

    return (
        <div className="root">
            <div>
                X: <input ref={xInputRef} type="number" defaultValue="100" {...requestCallbacks}></input>&nbsp;
                Y: <input ref={yInputRef} type="number" defaultValue="150" {...requestCallbacks}></input>
            </div>

            <div className="container" style={{
                transform: `scale(${props.containerScale})`,
            }}>
                <div className="target" ref={targetRef}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={true}
                    throttleDrag={props.throttleDrag}
                    edgeDraggable={props.edgeDraggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}
                    onDragStart={e => {
                        e.set(translate);
                    }}
                    onDrag={e => {
                        e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
                    }}
                    onDragEnd={e => {
                        const lastEvent = e.lastEvent;
                        lastEvent && setTranslate(lastEvent.beforeTranslate);

                        requestAnimationFrame(() => {
                            const rect = e.moveable.getRect();

                            xInputRef.current!.value = `${rect.left}`;
                            yInputRef.current!.value = `${rect.top}`;
                        });
                    }}
                />
            </div>
        </div>
    );
};
