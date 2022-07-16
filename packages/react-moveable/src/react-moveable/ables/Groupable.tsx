import { refs } from "framework-utils";
import MoveableManager from "../MoveableManager";
import { Renderer, MoveableGroupInterface, GroupableProps } from "../types";

export default {
    name: "groupable",
    props: {
        defaultGroupRotate: Number,
        defaultGroupOrigin: String,
        groupable: Boolean,
        hideChildMoveableDefaultLines: Boolean,
    } as const,
    events: {} as const,
    render(moveable: MoveableGroupInterface<GroupableProps>, React: Renderer): any[] {
        const targets = moveable.props.targets || [];

        moveable.moveables = [];
        const { left, top } = moveable.state;
        const position = { left, top };
        const props = moveable.props;

        return targets.map((target, i) => {
            return <MoveableManager<GroupableProps>
                key={"moveable" + i}
                ref={refs(moveable, "moveables", i)}
                target={target}
                origin={false}
                cssStyled={props.cssStyled}
                customStyledMap={props.customStyledMap}
                useResizeObserver={props.useResizeObserver}
                hideChildMoveableDefaultLines={props.hideChildMoveableDefaultLines}
                parentMoveable={moveable}
                parentPosition={position}
            />;
        });
    },
};
