import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="root">
            <div className="container" style={{
                left: "200px",
                top: "100px",
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target target1">Target 1</div>
                <div className="target target2">Target 2</div>
                <div className="target target3">Target 3</div>
                <Moveable
                    target={".target"}
                    draggable={true}
                    rotatable={true}
                    snappable={true}
                    verticalGuidelines={[0, 100]}
                    elementGuidelines={[".container"]}
                    onRenderGroup={e => {
                        e.events.forEach(ev => {
                            ev.target.style.cssText += ev.cssText;
                        });
                    }}
                />
            </div>
        </div>
    );
}
