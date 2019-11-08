import { Component, h } from "preact";
import { createPortal } from "preact/compat";
import Moveable, { MoveableProps, PreactMoveableInterface } from "preact-moveable";
import { ref } from "framework-utils";

export default class InnerMoveable extends Component<MoveableProps> {
    public state: MoveableProps = {};
    public preactMoveable: PreactMoveableInterface;
    constructor(props: MoveableProps) {
        super(props);
        this.state = this.props;
    }
    public render() {
        return createPortal(<Moveable ref={ref(this, "preactMoveable")} {...this.state} />, this.props.parentElement);
    }
}
