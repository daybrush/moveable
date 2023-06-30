import * as React from "react";
import Moveable from "@/react-moveable";

export default function App(props: Record<string, any>) {
    return <div className="container">
        <div className="target"></div>
        <Moveable
            target={".target"}
            draggable={true}
            resizable={true}
            linePadding={props.linePadding}
            edge={true}
            onRender={e => {
                e.target.style.cssText += e.cssText;
            }}
        />
    </div>;
}
