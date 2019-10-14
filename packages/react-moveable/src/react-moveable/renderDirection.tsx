import MoveableManager from "./MoveableManager";
import { prefix, getControlTransform } from "./utils";
import { ResizableProps, ScalableProps, WarpableProps, Renderer } from "./types";

export function renderAllDirection(
    moveable: MoveableManager<Partial<ResizableProps & ScalableProps>>,
    React: Renderer,
): any[] {
    return [
        ...renderDiagonalDirection(moveable, React),
        ...renderDirection(moveable, React),
    ];
}
export function renderDiagonalDirection(
    moveable: MoveableManager<Partial<ResizableProps & ScalableProps & WarpableProps>>,
    React: Renderer,
): any[] {
    const { pos1, pos2, pos3, pos4 } = moveable.state;
    return [
        <div className={prefix("control", "direction", "nw")} data-direction="nw" key="nw"
            style={getControlTransform(pos1)}></div>,
        <div className={prefix("control", "direction", "ne")} data-direction="ne" key="ne"
            style={getControlTransform(pos2)}></div>,
        <div className={prefix("control", "direction", "sw")} data-direction="sw" key="sw"
            style={getControlTransform(pos3)}></div>,
        <div className={prefix("control", "direction", "se")} data-direction="se" key="se"
            style={getControlTransform(pos4)}></div>,
    ];
}
export function renderDirection(
    moveable: MoveableManager<Partial<ResizableProps & ScalableProps>>,
    React: Renderer,
): any[] {
    const { pos1, pos2, pos3, pos4 } = moveable.state;
    return [
        <div className={prefix("control", "direction", "n")} data-direction="n" key="n"
            style={getControlTransform(pos1, pos2)}></div>,
        <div className={prefix("control", "direction", "w")} data-direction="w" key="w"
            style={getControlTransform(pos1, pos3)}></div>,
        <div className={prefix("control", "direction", "e")} data-direction="e" key="e"
            style={getControlTransform(pos2, pos4)}></div>,
        <div className={prefix("control", "direction", "s")} data-direction="s" key="s"
            style={getControlTransform(pos3, pos4)}></div>,
    ];

}
