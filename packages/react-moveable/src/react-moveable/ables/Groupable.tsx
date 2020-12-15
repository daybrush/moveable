import { refs } from "framework-utils";
import MoveableManager from "../MoveableManager";
import { Renderer, MoveableGroupInterface } from "../types";

export default {
    name: "groupable",
    props: {
        defaultGroupRotate: Number,
        defaultGroupOrigin: String,
        groupable: Boolean,
    } as const,
    events: {} as const,
    render(moveable: MoveableGroupInterface, React: Renderer): any[] {
        const targets = moveable.props.targets || [];

        moveable.moveables = [];
        const { left, top } = moveable.state;
        const position = { left, top };

        return targets.map((target, i) => {
            return <MoveableManager
                key={"moveable" + i}
                ref={refs(moveable, "moveables", i)}
                target={target}
                origin={false}
                cssStyled={moveable.props.cssStyled}
                customStyledMap={moveable.props.customStyledMap}
                parentMoveable={moveable}
                parentPosition={position}
            />;
        });
    },
};
