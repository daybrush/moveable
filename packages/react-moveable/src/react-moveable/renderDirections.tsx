import { prefix, getControlTransform, getLineStyle } from "./utils";
import { Renderer, MoveableManagerInterface, RenderDirections } from "./types";
import { DIRECTION_INDEXES, DIRECTION_ROTATIONS, DIRECTIONS } from "./consts";
import { IObject, throttle, getRad } from "@daybrush/utils";

export function renderDirectionControls(
    moveable: MoveableManagerInterface<Partial<RenderDirections>>,
    defaultDirections: string[],
    React: Renderer,
    additionalClassName: string = "",
): any[] {
    const {
        renderPoses,
        rotation: rotationRad,
        direction,
    } = moveable.state;
    const {
        renderDirections: directions = defaultDirections,
        zoom,
    } = moveable.props;

    const directionMap: IObject<boolean> = {};

    if (!directions) {
        return [];
    }
    const sign = (direction > 0 ? 1 : -1);
    const renderDirections = directions === true ? DIRECTIONS : directions;
    const degRotation = rotationRad / Math.PI * 180;

    renderDirections.forEach(dir => {
        directionMap[dir] = true;
    });
    return renderDirections.map(dir => {
        const indexes = DIRECTION_INDEXES[dir];

        if (!indexes || !directionMap[dir]) {
            return null;
        }
        const directionRotation = (throttle(degRotation, 15) + sign * DIRECTION_ROTATIONS[dir] + 720) % 180;

        return (
            <div className={prefix("control", "direction", dir, additionalClassName)}
                data-rotation={directionRotation} data-direction={dir} key={`direction-${dir}`}
                style={getControlTransform(rotationRad, zoom!, ...indexes.map(index => renderPoses[index]))}></div>
        );
    });
}
export function renderLine(
    React: Renderer,
    direction: string,
    pos1: number[], pos2: number[],
    zoom: number,
    key: number | string, ...classNames: string[]) {
    const rad = getRad(pos1, pos2);
    const rotation = direction ? (throttle(rad / Math.PI * 180, 15)) % 180 : -1;

    return <div key={`line${key}`} className={prefix("line", "direction",  direction ? "edge" : "", direction, ...classNames)}
        data-rotation={rotation}
        data-line-index={key}
        data-direction={direction} style={getLineStyle(pos1, pos2, zoom, rad)}></div>;
}
export function renderAllDirections(
    moveable: MoveableManagerInterface<Partial<RenderDirections>>,
    React: Renderer,
) {
    return renderDirectionControls(moveable, DIRECTIONS, React);
}
export function renderDiagonalDirections(
    moveable: MoveableManagerInterface<Partial<RenderDirections>>,
    React: Renderer,
): any[] {
    return renderDirectionControls(moveable, ["nw", "ne", "sw", "se"], React);
}
