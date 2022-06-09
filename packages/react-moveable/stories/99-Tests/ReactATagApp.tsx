import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="target"><a href="https://daybrush.com">Target1</a></div>
        <Moveable
            target={".target"}
            draggable={true}
            preventClickDefault={true}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
        />
    </div>;
}
