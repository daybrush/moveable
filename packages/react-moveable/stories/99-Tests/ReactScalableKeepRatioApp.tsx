import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="target" style={{
            transform: "scale(1, 0)",
        }}>Target1</div>
        <Moveable
            target={".target"}
            scalable={true}
            keepRatio={true}
            onScaleStart={e => {
                e.setRatio(1);
            }}
            onScale={e => {
                // console.log(e.scale);
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
