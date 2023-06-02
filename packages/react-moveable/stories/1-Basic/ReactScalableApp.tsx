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
                    scalable={true}
                    keepRatio={props.keepRatio}
                    throttleScale={props.throttleScale}
                    renderDirections={props.renderDirections}
                    snappable={true}
                    snapThreshold={5}
                    snapDigit={0}
                    snapGap={true}
                    elementGuidelines={[".target"]}
                    snapDirections={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                    }}
                    elementSnapDirections={{
                        top: true,
                        right: true,
                        bottom: true,
                        left: true,
                    }}
                    elementSn
                    onScale={e => {
                        // e.target.style.transform = e.drag.transform;
                        e.target.style.cssText += e.cssText;
                    }}
                    onRender={e => {
                        // e.target.style.cssText += e.cssText;
                    }}
                />
            </div>
        </div>
    );
}
