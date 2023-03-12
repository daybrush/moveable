import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const widthInputRef = React.useRef<HTMLInputElement>(null);
    const heightInputRef = React.useRef<HTMLInputElement>(null);
    const moveableRef = React.useRef<Moveable>(null);
    const onInput = (e: any) => {
        const ev = (e.nativeEvent || e) as InputEvent;

        if (typeof ev.data === "undefined") {
            moveableRef.current!.request("resizable", {
                offsetWidth: parseFloat(widthInputRef.current!.value),
                offsetHeight: parseFloat(heightInputRef.current!.value),
            }, true);
        }
    };
    const onKeyUp = (e: any) => {
        e.stopPropagation();

        // enter
        if (e.keyCode === 13) {
            moveableRef.current!.request("resizable", {
                offsetWidth: parseFloat(widthInputRef.current!.value),
                offsetHeight: parseFloat(heightInputRef.current!.value),
            }, true);
        }
    };

    return <div className="root">
        <div>
            width: <input ref={widthInputRef}
                type="number" defaultValue="280"
                onInput={onInput} onKeyUp={onKeyUp} data-horizontal="true"></input>&nbsp;
            height: <input ref={heightInputRef}
                type="number" defaultValue="230"
                onInput={onInput} onKeyUp={onKeyUp} data-horizontal="false"></input>
        </div>
        <div className="container">
            <div className="target">Target1</div>
            <Moveable
                ref={moveableRef}
                target={".target"}
                resizable={props.resizable}
                keepRatio={props.keepRatio}
                throttleResize={props.throttleResize}
                renderDirections={props.renderDirections}
                onResize={(e) => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = e.drag.transform;
                }}
                onResizeEnd={(e) => {
                    requestAnimationFrame(() => {
                        const rect = e.moveable.getRect();

                        widthInputRef.current!.value = `${rect.offsetWidth}`;
                        heightInputRef.current!.value = `${rect.offsetHeight}`;
                    });
                }}
            />
        </div>
    </div>;
}
