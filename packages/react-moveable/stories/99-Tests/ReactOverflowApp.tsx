import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const moveableRef = React.useRef<Moveable>(null);

    return (
        <div className="root">
            <div className="container" style={{
                height: "100px",
            }}>
                <div className="target" style={{
                    overflow: "auto",
                }} onScroll={() => {
                    moveableRef.current?.updateRect();
                }}>
                    <div className="scroll" style={{
                        width: "100%",
                        height: "1000px",
                    }}></div>
                </div>
                <Moveable
                    ref={moveableRef}
                    target={".target"}
                    resizable={true}
                    preventClickDefault={true}
                    draggable={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
