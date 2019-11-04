import MoveableManager from "./MoveableManager";
import { prefix, getControlTransform } from "./utils";
import { ResizableProps, ScalableProps, WarpableProps, Renderer } from "./types";
import { DIRECTION_INDEXES } from "./consts";
import { IObject } from "@daybrush/utils";

export function renderControls(
    moveable: MoveableManager<Partial<ResizableProps & ScalableProps & WarpableProps>>,
    defaultDirections: string[],
    React: Renderer,
): any[] {
    const { pos1, pos2, pos3, pos4 } = moveable.state;
    const {
        renderDirections: directions = defaultDirections,
    } = moveable.props;
    const poses = [pos1, pos2, pos3, pos4];

    const directionMap: IObject<boolean> = {};
    directions.forEach(direction => {
        directionMap[direction] = true;
    });
    return directions.map(direction => {
        const indexes = DIRECTION_INDEXES[direction];

        if (!indexes || !directionMap[direction]) {
            return null;
        }
        return (
            <div className={prefix("control", "direction", direction)} data-direction={direction} key={direction}
                style={getControlTransform(...indexes.map(index => poses[index]))}></div>
        );
    });
}
export function renderAllDirections(
    moveable: MoveableManager<Partial<ResizableProps & ScalableProps & WarpableProps>>,
    React: Renderer,
) {
    return renderControls(moveable, ["nw", "ne", "sw", "se", "n", "w", "s", "e"], React);
}
export function renderDiagonalDirections(
    moveable: MoveableManager<Partial<ResizableProps & ScalableProps & WarpableProps>>,
    React: Renderer,
): any[] {
    return renderControls(moveable, ["nw", "ne", "sw", "se"], React);
}
