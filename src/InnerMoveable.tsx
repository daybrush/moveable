import { Component, h } from "preact";
import Moveable, { MoveableProps } from "preact-moveable";

export default class InnerMoveable extends Component<MoveableProps> {
    public state: MoveableProps = {};
    constructor(props: MoveableProps) {
        super(props);
        this.state = this.props;
    }
    public render() {
        return <Moveable {...this.state} />;
    }
}
