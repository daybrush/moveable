import * as React from "react";
import { createPortal } from "react-dom";
import Moveable from "@/react-moveable";

function Iframe(props: Record<string, any>) {
    const [ref, setRef] = React.useState<HTMLIFrameElement | null>();
    const container = ref?.contentWindow?.document?.body;

    return (
        <iframe ref={setRef}>
            {container && createPortal(props.children, container)}
        </iframe>
    );
}

export default function App() {
    const targetRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="root">
            <div className="container">
                <Iframe>
                    <div className="target" ref={targetRef}>Target</div>
                    <Moveable
                        target={targetRef}
                        draggable={true}
                        onRender={e => {
                            e.target.style.cssText += e.cssText;
                        }}
                    />
                </Iframe>
            </div>
        </div>
    );
}
