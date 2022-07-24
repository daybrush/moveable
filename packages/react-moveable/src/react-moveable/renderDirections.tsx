import { prefix, getControlTransform, getLineStyle, getProps } from "./utils";
import {
    Renderer, MoveableManagerInterface,
    RenderDirections,
} from "./types";
import { DIRECTION_INDEXES, DIRECTION_ROTATIONS, DIRECTIONS, DIRECTIONS4 } from "./consts";
import { IObject, throttle, getRad, getKeys } from "@daybrush/utils";

export interface DirectionControlInfo {
    data: Record<string, any>;
    classNames: string[];
    dir: string;
}
export function renderDirectionControlsByInfos(
    moveable: MoveableManagerInterface<Partial<RenderDirections>>,
    ableName: string,
    renderDirections: DirectionControlInfo[],
    React: Renderer,
): any[] {

    const {
        renderPoses,
        rotation: rotationRad,
        direction,
    } = moveable.state;
    const {
        zoom,
    } = getProps(moveable.props, ableName as any);


    const sign = (direction > 0 ? 1 : -1);
    const degRotation = rotationRad / Math.PI * 180;
    const directionMap: IObject<boolean> = {};

    const renderState = moveable.renderState;
    if (!renderState.renderDirectionMap) {
        renderState.renderDirectionMap = {};
    }
    const renderDirectionMap = renderState.renderDirectionMap;

    renderDirections.forEach(({ dir }) => {
        directionMap[dir] = true;
    });

    return renderDirections.map(({ data, classNames, dir }) => {
        const indexes = DIRECTION_INDEXES[dir];

        if (!indexes || !directionMap[dir]) {
            return null;
        }
        renderDirectionMap[dir] = true;
        const directionRotation = (throttle(degRotation, 15) + sign * DIRECTION_ROTATIONS[dir] + 720) % 180;

        const dataAttrs: Record<string, string> = {};

        getKeys(data).forEach(name => {
            dataAttrs[`data-${name}`] = data[name];
        });
        return (
            <div className={prefix("control", "direction", dir, ableName, ...classNames)}
                data-rotation={directionRotation}
                data-direction={dir}
                {...dataAttrs}
                key={`direction-${dir}`}
                style={getControlTransform(rotationRad, zoom!, ...indexes.map(index => renderPoses[index]))}></div>
        );
    });
}
export function renderDirectionControls(
    moveable: MoveableManagerInterface<Partial<RenderDirections>>,
    defaultDirections: string[],
    ableName: string,
    React: Renderer,
): any[] {
    const {
        renderDirections: directions = defaultDirections,
    } = getProps(moveable.props, ableName as any);

    if (!directions) {
        return [];
    }
    const renderDirections = directions === true ? DIRECTIONS : directions;

    return renderDirectionControlsByInfos(
        moveable,
        ableName,
        renderDirections.map(dir => {
            return {
                data: {},
                classNames: [],
                dir,
            };
        }),
        React,
    );
}
export function renderAroundControls(
    moveable: MoveableManagerInterface<Partial<RenderDirections>>,
    React: Renderer,
): any[] {
    const renderState = moveable.renderState;
    if (!renderState.renderDirectionMap) {
        renderState.renderDirectionMap = {};
    }
    const {
        renderPoses,
        rotation: rotationRad,
        direction,
    } = moveable.state;

    const renderDirectionMap = renderState.renderDirectionMap;

    const {
        zoom,
    } = moveable.props;
    const sign = (direction > 0 ? 1 : -1);
    const degRotation = rotationRad / Math.PI * 180;

    return getKeys(renderDirectionMap).map(dir => {
        const indexes = DIRECTION_INDEXES[dir];

        if (!indexes) {
            return null;
        }
        const directionRotation = (throttle(degRotation, 15) + sign * DIRECTION_ROTATIONS[dir] + 720) % 180;

        return (
            <div className={prefix("around-control")} data-rotation={directionRotation} data-direction={dir} key={`direction-around-${dir}`}
                style={getControlTransform(rotationRad, zoom!, ...indexes.map(index => renderPoses[index]))}></div>
        );
    });
}

export function renderLine(
    React: Renderer,
    direction: string,
    pos1: number[], pos2: number[],
    zoom: number,
    key: number | string, ...classNames: string[],
): any {
    const rad = getRad(pos1, pos2);
    const rotation = direction ? (throttle(rad / Math.PI * 180, 15)) % 180 : -1;

    return <div key={`line${key}`} className={prefix("line", "direction", direction ? "edge" : "", direction, ...classNames)}
        data-rotation={rotation}
        data-line-index={key}
        data-direction={direction} style={getLineStyle(pos1, pos2, zoom, rad)}></div>;
}

export function renderEdgeLines(
    React: Renderer,
    ableName: string,
    edge: true | string[],
    poses: number[][],
    zoom: number,
): any[] {
    const directions = edge === true ? DIRECTIONS4 : edge;

    return directions.map((direction, i) => {
        const [index1, index2] = DIRECTION_INDEXES[direction];

        if (index2 == null) {
            return;
        }
        return renderLine(React, direction, poses[index1], poses[index2], zoom, `${ableName}Edge${i}`, ableName);
    }).filter(Boolean);
}
export function getRenderDirections(ableName: string) {
    return (
        moveable: MoveableManagerInterface<Partial<RenderDirections>>,
        React: Renderer,
    ) => {
        const edge = getProps(moveable.props, ableName as any).edge;

        if (edge && (edge === true || edge.length)) {
            return [
                ...renderEdgeLines(
                    React,
                    ableName,
                    edge,
                    moveable.state.renderPoses,
                    moveable.props.zoom!,
                ),
                ...renderDiagonalDirections(moveable, ableName, React),
            ];
        }
        return renderAllDirections(moveable, ableName, React);
    };
}
export function renderAllDirections(
    moveable: MoveableManagerInterface<Partial<RenderDirections>>,
    ableName: string,
    React: Renderer,
) {
    return renderDirectionControls(moveable, DIRECTIONS, ableName, React);
}
export function renderDiagonalDirections(
    moveable: MoveableManagerInterface<Partial<RenderDirections>>,
    ableName: string,
    React: Renderer,
): any[] {
    return renderDirectionControls(moveable, ["nw", "ne", "sw", "se"], ableName, React);
}
