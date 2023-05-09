import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (<div className="container">
        <svg width="50" height="50" style={{
            transform: "translate(13px, 37px)",
        }}>
            <circle cx="25" cy="25" r="25" fill="blue"></circle>
        </svg>
        <svg width="50" height="50" style={{
            transform: "translate(104px, 30px)",
        }}>
            <rect width="50" height="50" rx="3" fill="red" />
        </svg>
        <Moveable
            target={"svg"}
            draggable={true}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
        />
    </div>);
}
