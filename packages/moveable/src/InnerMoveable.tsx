import * as React from "react";
import Moveable from "react-moveable";
import { ref } from "framework-utils";

export default class InnerMoveable extends React.Component<any> {
    public state: any = {};
    public moveable!: Moveable;
    constructor(props: any) {
        super(props);
        this.state = this.props;
    }
    public render(): React.ReactNode {
        return <Moveable ref={ref(this, "moveable")} {...this.state} />;
    }
}
