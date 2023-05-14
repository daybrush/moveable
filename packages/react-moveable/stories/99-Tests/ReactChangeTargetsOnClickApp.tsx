import * as React from "react";
import Moveable from "@/react-moveable";


export default function App() {
    const [targets, setTargets] = React.useState<Array<string>>([
        ".cube1",
        ".cube2",
    ]);
    const moveableRef = React.useRef<Moveable>(null);
    const cubes = [];

    for (let i = 0; i < 30; ++i) {
        cubes.push(i);
    }

    return <div className="root">
        <div className="container">
            <Moveable
                ref={moveableRef}
                draggable={true}
                target={targets}
                onClickGroup={() => {
                    console.log("?");
                    setTargets([".cube1", ".cube2", ".cube3"]);
                }}
                onDrag={e => {
                    e.target.style.cssText += e.cssText;
                }}
                onDragGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.cssText += ev.cssText;
                    });
                }}
            ></Moveable>

            <div className="elements selecto-area">
                {cubes.map(i => <div className={`cube cube${i}`} key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
