import * as React from "react";
import Moveable from "../../src/react-moveable";

export default function App(props: Record<string, any>) {

    return (
        <div className="root">
            <div className="container">
                <div className="target target1">
                    Target
                    <div className="target target2">
                        Target
                    
                    </div>    
                </div>
                <Moveable
                    target=".target1"
                    draggable={true}
                    stopPropagation={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
                <Moveable
                    target=".target2"
                    draggable={true}
                    stopPropagation={true}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                />
            </div>
        </div>
    );
}
