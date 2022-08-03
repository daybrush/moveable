import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return <div className="no-container">
        <div className="will-change-container">
            {/* <div className="will-change-inner"> */}
                <div className="will-change-target">Target1</div>
            {/* </div> */}
        </div>
        <Moveable
            target={".will-change-target"}
            draggable={true}
            preventClickDefault={true}
            onDrag={e => {
                e.target.style.transform = e.transform;
            }}
        />
    </div>;
}
