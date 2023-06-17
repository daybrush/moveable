import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="target">Target</div>
        <Moveable
            target={".target"}
            draggable={true}
            scalable={true}
            onScaleStart={e => {
                e.setMinScaleSize([100, 100]);
                e.setMaxScaleSize([500, 500]);
            }}
            onRender={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
