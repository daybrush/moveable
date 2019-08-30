import * as React from "react";
import Draggable from "../../src/react-moveable/ables/Draggable";
import Moveable from "../../src/react-moveable";
import { ref } from "framework-utils";

export default class MoveableExample extends React.Component<{
    onDragStart?: any,
    onDrag?: any,
    onDragEnd?: any,
 }> {
    public innerMoveable!: Moveable;
    public state = {
        target: null,
    };
    public render() {
        const { onDragStart, onDrag, onDragEnd } = this.props;

        return (
            <div className="c1" style={{
                position: "relative", left: "0px", top: "0px", width: "500px", height: "500px", border: "2px solid black",
                transform: "scale(2)",
            }}>
            <Moveable target={this.state.target} ref={ref(this, "innerMoveable")}
                draggable={true} onDragStart={onDragStart} onDrag={onDrag} onDragEnd={onDragEnd} />
            <div className="c2" style={{
                position: "relative", left: "0px", top: "0px", width: "100px", height: "100px", border: "2px solid black",
            }}></div></div>
        );
    }
    public componentDidMount() {
        this.setState({
            target: document.querySelector(".c2"),
        });
    }
}
