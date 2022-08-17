import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (
        <div className="root">
            <div className="container" style={{
                width: "500px",
                transform: "translate(100px, 100px) scale(2)",
            }}>
                <div className="target">Target</div>
                <Moveable
                    target={".target"}
                    draggable={true}
                    scalable={true}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
