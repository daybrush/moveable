import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="target" style={{
            width: "300px",
            height: "300px",
        }}></div>
        <Moveable
            target={".target"}
            draggable={true}
            rotatable={true}
            zoom={5}
            onRender={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
