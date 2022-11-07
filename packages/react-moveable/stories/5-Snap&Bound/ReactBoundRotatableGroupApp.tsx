import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container" style={{
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target target1">Target1</div>
                <div className="target target2">Target2</div>
                <div className="target target3">Target3</div>
                <Moveable
                    ref={moveableRef}
                    target={[".target1", ".target2"]}
                    draggable={true}
                    rotatable={true}
                    snappable={true}
                    // bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }}
                    verticalGuidelines={[0]}
                    onDragGroup={e => {
                        e.events.forEach(ev => {
                            ev.target.style.cssText += ev.cssText;
                        });
                    }}
                    onRotateGroup={e => {
                        e.events.forEach(ev => {
                            ev.target.style.cssText += ev.cssText;
                        });
                    }}
                />
            </div>
        </div>
    );
}
