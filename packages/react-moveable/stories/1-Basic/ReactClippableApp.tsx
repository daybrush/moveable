import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="root">
            <div className="container">
                <div className="target" ref={targetRef}>Target</div>
                <Moveable
                    target={targetRef}
                    draggable={props.draggable}
                    startDragRotate={props.startDragRotate}
                    throttleDragRotate={props.throttleDragRotate}
                    zoom={props.zoom}
                    // origin={props.origin}
                    // padding={props.padding}
                    clippable={props.clippable}
                    clipRelative={props.clipRelative}
                    clipArea={props.clipArea}
                    dragArea={props.dragArea}
                    dragWithClip={props.dragWithClip}
                    defaultClipPath={props.defaultClipPath}
                    clipTargetBounds={props.clipTargetBounds}
                    // clipVerticalGuidelines={props.clipVerticalGuidelines}
                    // clipHorizontalGuidelines={props.clipHorizontalGuidelines}
                    snapThreshold={5}
                    keepRatio={props.keepRatio}
                    onDrag={e => {
                        e.target.style.transform = e.transform;
                    }}
                    onClip={e => {
                        e.target.style.clipPath = e.clipStyle;
                    }} />
            </div>
        </div>
    );
}
