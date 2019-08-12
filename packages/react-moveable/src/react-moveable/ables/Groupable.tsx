import { refs } from "framework-utils";
import MoveableGroup from "../MoveableGroup";
import MoveableManager from "../MoveableManager";

export default {
    name: "groupable",
    render(moveable: MoveableGroup) {
        const targets = moveable.props.targets || [];

        moveable.moveables = [];
        return targets.map((target, i) => {
            return <MoveableManager target={target} key={i} ref={refs(moveable, "moveables", i)}/>;
        });
    },
}
