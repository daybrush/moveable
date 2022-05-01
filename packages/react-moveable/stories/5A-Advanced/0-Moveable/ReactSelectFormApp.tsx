import * as React from "react";
import Moveable from "../../../src/react-moveable";

export default function App() {
    const [target, setTarget] = React.useState<HTMLSelectElement>();

    React.useEffect(() => {
        setTarget(document.querySelector<HTMLSelectElement>("select")!);
    }, []);

    return (
        <div className="root">
            <select style={{
                position: "relative",
                width: "200px",
                height: "100px",
            }}>
                <option value="1">Option1</option>
                <option value="2">Option2</option>
                <option value="3">Option3</option>
            </select>
            <Moveable
                target={target}
                draggable={true}
                onRender={e => {
                    e.target.style.transform = e.transform;
                }}
            />
        </div>
    );
}
