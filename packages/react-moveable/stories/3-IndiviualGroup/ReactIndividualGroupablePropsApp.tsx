import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <div className="container">
                <div className="target target1">Target1</div>
                <div className="target target2">Target2</div>
                <div className="target target3">Target3</div>
                <Moveable
                    target={".target"}
                    individualGroupable={true}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    individualGroupableProps={element => {
                        if (element!.classList.contains("target2")) {
                            return {
                                resizable: false,
                            };
                        }
                    }}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
