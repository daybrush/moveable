import * as React from "react";
import Moveable from "@/react-moveable";

export default function App() {
    const arr: number[] = [];

    for (let i = 0; i < 300; ++i) {
        arr.push(i);
    }
    return (
        <div className="root">
            <div className="container">
                {arr.map((i) => {
                    return <>
                        <div className={`target target${i}`}>Target</div>
                        <Moveable
                            target={`.target${i}` as string}
                            draggable={true}
                            onRender={e => {
                                e.target.style.cssText += e.cssText;
                            }}
                        />
                    </>;
                })}
            </div>
        </div>
    );
}
