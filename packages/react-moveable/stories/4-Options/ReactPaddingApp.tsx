import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="target"></div>
        <Moveable
            target={".target"}
            draggable={true}
            scalable={true}
            rotatable={true}
            padding={{
                left: 10,
                right: 20,
                top: 30,
                bottom: 40,
            }}
            onRender={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
