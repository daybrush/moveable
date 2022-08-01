import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container" style={{
                width: "500px",
                height: "500px",
                border: "1px solid #ccc",
            }}>
                <div className="target" style={{
                    width: "200px",
                    height: "150px",
                }}>Target</div>
                <Moveable
                    ref={moveableRef}
                    target={".target"}
                    draggable={true}
                    snappable={true}
                    verticalGuidelines={[
                        0,
                        100,
                        {
                            pos: 200,
                            className: "red",
                        },
                    ]}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
