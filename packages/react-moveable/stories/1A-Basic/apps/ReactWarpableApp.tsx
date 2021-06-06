import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const [matrix, setMatrix]  = React.useState([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]);
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef}>Target</div>
                <Moveable
                    target={targetRef}
                    warpable={props.warpable}
                    renderDirections={props.renderDirections}
                    onWarpStart={e => {
                        e.set(matrix);
                    }}
                    onWarp={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onWarpEnd={e => {
                        const lastEvent = e.lastEvent;

                        if (lastEvent) {
                            setMatrix(lastEvent.matrix);
                        }
                    }}
                />
            </div>
        </div>
    );
}
