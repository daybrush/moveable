import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="container">
        <div className="target" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "21px",
            position: "relative",
            width: "446px",
            height: "124px",
            zIndex: 1,
        }}></div>
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
