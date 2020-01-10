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
    const {
        pos1, pos2, pos3, pos4,
        rotation,
    } = moveable.state;
    const {
        renderDirections: directions = defaultDirections,
        fullEdgesResize,
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
        
        const baseStyle = getControlTransform(rotation, ...indexes.map((index) => poses[index]));
        const style: React.CSSProperties = Object.assign(baseStyle, {});

        if (fullEdgesResize) {
            style.borderRadius = 0;

            if (direction === 's' || direction === 'n') {
                style.width = width - 10;
                style.height = 20;
                style.marginTop = '-10px';
                style.marginLeft = -width / 2 + 5;
                style.background = 'transparent';
                style.border = 'none';
            } else if (direction === 'e' || direction === 'w') {
                style.height = height - 10;
                style.width = 20;
                style.marginLeft = '-10px';
                style.marginTop = -height / 2 + 5;
                style.background = 'transparent';
                style.border = 'none';
            }
        }

        return (
            <div className={prefix("control", "direction", direction)} data-direction={direction} key={direction}
                style={style}></div>
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
