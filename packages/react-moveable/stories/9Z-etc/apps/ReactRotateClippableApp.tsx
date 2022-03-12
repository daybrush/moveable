import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const targetRef = React.useRef<HTMLDivElement>(null);
    return (
        <div className="container">
            <div className="nested first">
                No Transform
                <div className="nested scale">
                    scale(1.5, 1.5)
                    <div className="nested rotate">
                        rotate(30deg)
                        <div className="target" ref={targetRef}>Target</div>
                    </div>
                </div>
            </div>
            <Moveable
                target={targetRef}
                draggable={true}
                throttleDrag={0}
                startDragRotate={0}
                throttleDragRotate={0}
                zoom={1}
                origin={true}
                padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                clippable={true}
                clipRelative={false}
                clipArea={false}
                dragWithClip={false}
                defaultClipPath={"inset"}
                clipTargetBounds={true}
                clipVerticalGuidelines={[]}
                clipHorizontalGuidelines={[]}
                snapThreshold={5}
                onClip={(e) => {
                    if (e.clipType === "rect") {
                        e.target.style.clip = e.clipStyle;
                    } else {
                        e.target.style.clipPath = e.clipStyle;
                    }
                }}
                // onDrag={e => {
                //     e.target.style.transform = e.transform;
                // }}
                onRender={(e) => {
                    // console.log('render');
                    e.target.style.transform = e.transform;
                }}
            />
        </div>
    );
}
