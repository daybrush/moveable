import { minus } from "@scena/matrix";
import { refs } from "framework-utils";
import MoveableManager from "../MoveableManager";
import { renderLine } from "../renderDirections";
import { Renderer, MoveableGroupInterface, GroupableProps } from "../types";
import { flat } from "../utils";

export default {
    name: "groupable",
    props: {
        defaultGroupRotate: Number,
        defaultGroupOrigin: String,
        groupable: Boolean,
        targetGroups: Object,
        hideChildMoveableDefaultLines: Boolean,
    } as const,
    events: {} as const,
    render(moveable: MoveableGroupInterface<GroupableProps>, React: Renderer): any[] {
        const targets = moveable.props.targets || [];

        moveable.moveables = [];
        const { left, top } = moveable.state;
        const position = [left, top];
        const props = moveable.props;
        const zoom = props.zoom || 1;
        const renderGroupRects = moveable.renderGroupRects;

        return [
            ...targets.map((target, i) => {
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
                    zoom={zoom}
                />;
            }),
            ...flat(renderGroupRects.map(({ pos1, pos2, pos3, pos4 }, i) => {
                const poses = [pos1, pos2, pos3, pos4];

                return [
                    [0, 1],
                    [1, 3],
                    [3, 2],
                    [2, 0],
                ].map(([from, to], j) => {
                    return renderLine(
                        React,
                        "",
                        minus(poses[from], position),
                        minus(poses[to], position),
                        zoom,
                        `group-rect-${i}-${j}`,
                    );
                });
            })),
        ];
    },
};
