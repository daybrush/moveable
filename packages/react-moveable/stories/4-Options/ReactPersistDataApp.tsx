import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <p className="description">
                * You can persist by `moveable.getRect()` method.
            </p>
            <div className="target" style={{
                transform: "translate(100px, 100px) rotate(45deg)",
            }}>
                No Target
            </div>
            <Moveable
                // target={".target"}
                draggable={true}
                resizable={true}
                rotatable={true}
                origin={true}
                persistData={{
                    left: 179.2893,
                    top: 229.2893,
                    offsetHeight: 100,
                    offsetWidth: 100,
                    origin: [250, 300],
                    pos1: [250, 229.2893],
                    pos2: [320.7107, 300],
                    pos3: [179.2893, 300],
                    pos4: [250, 370.7107],
                    transformOrigin: [
                        50,
                        50,
                    ],
                }}
                onRender={e => {
                    e.target.style.cssText += e.cssText;

                    console.log(e.moveable.getRect());
                }}
            />
        </div>
    );
}
