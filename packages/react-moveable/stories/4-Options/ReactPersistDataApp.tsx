import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    return (
        <div className="root">
            <p className="description">
                * You can persist by `moveable.getRect()` method.
            </p>
            <Moveable
                // target={".target"}
                draggable={true}
                resizable={true}
                rotatable={true}
                viewContainer={document.body}
                persistData={{
                    left:  67.6202,
                    top: 110.6202,
                    offsetHeight: 100,
                    offsetWidth: 100,
                    origin: [130, 173],
                    pos1: [96.7019, 110.6202],
                    pos2: [192.3798, 139.7019],
                    pos3: [67.6202, 206.2981],
                    pos4: [163.2981, 235.3798],
                }}
                onRender={e => {
                    e.target.style.cssText += e.cssText;

                    console.log(e.moveable.getRect());
                }}
            />
        </div>
    );
}
