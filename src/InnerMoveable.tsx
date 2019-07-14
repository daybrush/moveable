import { Component, h } from "preact";
import Moveable, { MoveableProps, MoveableInterface } from "preact-moveable";
import { ref } from "framework-utils";

export default class InnerMoveable extends Component<MoveableProps> {
    public state: MoveableProps = {};
    public preactMoveable: MoveableInterface;
    constructor(props: MoveableProps) {
        super(props);
        this.state = this.props;
    }
    public render() {
        return <Moveable ref={ref(this, "preactMoveable")} {...this.state} />;
    }
}
