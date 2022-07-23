import * as React from "react";
import Moveable, { DIRECTIONS} from "../../../src/react-moveable";
import { useKeycon } from "react-keycon";

export default function App() {
    const { isKeydown } = useKeycon({
        keys: ["meta"],
    });

    return (
        <div className="root">
            <div className="target">Target</div>
            <Moveable
                target={".target"}
                rotatable={{
                    renderDirections: isKeydown ? DIRECTIONS : false,
                }}
                resizable={{
                    renderDirections: isKeydown ? false : true,
                }}
                rotateAroundControls={true}
                onResize={e => {
                    e.target.style.cssText += e.cssText;
                }}
                onRotateStart={e => {
                    e.setFixedDirection([-0.5, -0.5]);
                }}
                onRotate={e => {
                    e.target.style.transform = e.drag.transform;
                }}
            />
        </div>
    );
}
