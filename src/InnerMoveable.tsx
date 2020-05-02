import * as React from "react";
import { createPortal } from "react-dom";
import Moveable, { MoveableProps } from "react-moveable";
import { ref } from "framework-utils";

export default class InnerMoveable extends React.Component<any> {
    public state: any = {};
    public moveable: Moveable;
    constructor(props: any) {
        super(props);
        this.state = this.props;
    }
    public render() {
        return createPortal(<Moveable ref={ref(this, "moveable")} {...this.state} />, this.state.parentElement);
    }
}
