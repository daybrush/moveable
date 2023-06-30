import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    const widthInputRef = React.useRef<HTMLInputElement>(null);
    const heightInputRef = React.useRef<HTMLInputElement>(null);
    const moveableRef = React.useRef<Moveable>(null);
    const onInput = (e: any) => {
        const ev = (e.nativeEvent || e) as InputEvent;
        const horizontal = JSON.parse((ev.target as HTMLElement).getAttribute("data-horizontal")!);

        if (typeof ev.data === "undefined") {
            moveableRef.current!.request("resizable", {
                offsetWidth: parseFloat(widthInputRef.current!.value),
                offsetHeight: parseFloat(heightInputRef.current!.value),
                horizontal,
            }, true);
        }
    };
    const onKeyUp = (e: any) => {
        const ev = (e.nativeEvent || e) as InputEvent;
        const horizontal = JSON.parse((ev.target as HTMLElement).getAttribute("data-horizontal")!);
        e.stopPropagation();

        // enter
        if (e.keyCode === 13) {
            moveableRef.current!.request("resizable", {
                offsetWidth: parseFloat(widthInputRef.current!.value),
                offsetHeight: parseFloat(heightInputRef.current!.value),
                horizontal,
            }, true);
        }
    };

    return <div className="root">
        <div>
            width: <input ref={widthInputRef}
                type="number" defaultValue="280"
                onInput={onInput} onKeyUp={onKeyUp} data-horizontal="true"/>&nbsp;
            height: <input ref={heightInputRef}
                type="number" defaultValue="230"
                onInput={onInput} onKeyUp={onKeyUp} data-horizontal="false"/>
        </div>
        <div className="container">
            <div className="target target1">Target1</div>
            <div className="target target2">Target2</div>
            <div className="target target3">Target3</div>
            <Moveable
                ref={moveableRef}
                target={".target"}
                draggable={true}
                resizable={props.resizable}
                keepRatio={props.keepRatio}
                throttleResize={props.throttleResize}
                renderDirections={props.renderDirections}
                onResizeGroupStart={({ setMin, setMax }) => {
                    setMin([props.minWidth, props.minHeight]);
                    setMax([props.maxWidth, props.maxHeight]);
                }}
                onResizeGroup={({ events }) => {
                    events.forEach(ev => {
                        ev.target.style.width = `${ev.boundingWidth}px`;
                        ev.target.style.height = `${ev.boundingHeight}px`;
                        ev.target.style.transform
                            = `translate(${ev.drag.beforeTranslate[0]}px, ${ev.drag.beforeTranslate[1]}px)`;
                    });
                }}
                onResizeGroupEnd={(e) => {
                    requestAnimationFrame(() => {
                        const rect = e.moveable.getRect();

                        widthInputRef.current!.value = `${rect.offsetWidth}`;
                        heightInputRef.current!.value = `${rect.offsetHeight}`;
                    });
                }}
                onDragGroup={({ events }) => {
                    events.forEach(ev => {
                        ev.target.style.transform = ev.transform;
                    });
                }}
            />
        </div>
    </div>;
}
