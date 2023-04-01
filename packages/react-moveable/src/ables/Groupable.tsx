import { minus } from "@scena/matrix";
import { refs } from "framework-utils";
import MoveableManager from "../MoveableManager";
import { renderLine } from "../renderDirections";
import { Renderer, MoveableGroupInterface, GroupableProps } from "../types";
import { flat } from "../utils";

export default {
    name: "groupable",
    props: [
        "defaultGroupRotate",
        "defaultGroupOrigin",
        "groupable",
        "groupableProps",
        "targetGroups",
        "hideChildMoveableDefaultLines",
    ] as const,
    events: [] as const,
    render(moveable: MoveableGroupInterface<GroupableProps>, React: Renderer): any[] {
        const props = moveable.props;
        let targets: Array<HTMLElement | SVGElement | undefined | null> = props.targets || [];

        const { left, top, isPersisted } = moveable.getState();
        const position = [left, top];
        const zoom = props.zoom || 1;
        const renderGroupRects = moveable.renderGroupRects;
        let persistDatChildren = props.persistData?.children || [];

        if (isPersisted) {
            targets = persistDatChildren.map(() => null);
        } else {
            persistDatChildren = [];
        }
        const requestStyles = moveable.getRequestChildStyles();

        moveable.moveables = moveable.moveables.slice(0, targets.length);
        return [
            ...targets.map((target, i) => {
                return <MoveableManager<GroupableProps>
                    key={"moveable" + i}
                    ref={refs(moveable, "moveables", i)}
                    target={target}
                    origin={false}
                    requestStyles={requestStyles}
                    cssStyled={props.cssStyled}
                    customStyledMap={props.customStyledMap}
                    useResizeObserver={props.useResizeObserver}
                    hideChildMoveableDefaultLines={props.hideChildMoveableDefaultLines}
                    parentMoveable={moveable}
                    parentPosition={position}
                    persistData={persistDatChildren[i]}
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
