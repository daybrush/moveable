import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return (<div className="container">
        <div className="scrollArea">
            <div className="target">Target</div>
            <Moveable
                scrollable={true}
                scrollOptions={{
                    container: ".scrollArea",
                    threshold: props.threshold,
                    checkScrollEvent: props.checkScrollEvent,
                    throttleTime: props.throttleTime,
                }}
                target={".target"}
                draggable={true}
                resizable={true}
                rotatable={true}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
                onScroll={({ scrollContainer, direction }) => {
                    scrollContainer.scrollBy(direction[0] * 10, direction[1] * 10);
                }}
            ></Moveable>
        </div>
    </div>);
}
