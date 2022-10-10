import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <div className="target">Target</div>
                <Moveable
                    target={".target"}
                    roundable={true}
                    onRound={e => {
                        e.target.style.borderRadius = e.borderRadius;
                    }}
                />
            </div>
        </div>
    );
}
