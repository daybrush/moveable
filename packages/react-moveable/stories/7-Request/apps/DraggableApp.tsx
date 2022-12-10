import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
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
                <div className="target">Target</div>
                <Moveable
                    ref={moveableRef}
                    target={".target"}
                    draggable={true}
                    throttleDrag={props.throttleDrag}
                    edgeDraggable={props.edgeDraggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onDragEnd={e => {
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
