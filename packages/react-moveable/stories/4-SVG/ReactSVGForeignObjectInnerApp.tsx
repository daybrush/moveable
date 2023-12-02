import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <svg viewBox="0 0 86 54">
                    <foreignObject x="10" y="10" width="20" height="20">
                        <div>Hi</div>
                    </foreignObject>
                </svg>
                <Moveable
                    target={"foreignObject div"}
                    draggable={true}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
