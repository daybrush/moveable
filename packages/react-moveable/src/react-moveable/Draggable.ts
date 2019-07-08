import Moveable from "./Moveable";
import { drag } from "@daybrush/drag";

export function getDraggableDragger(
    moveable: Moveable,
    target: HTMLElement,
) {
    return drag(target, {
        container: window,
        drag: ({ distX, distY }) => {
            moveable.setState({
                transform: `translate(${distX}px, ${distY}px)`,
            });
        },
    });
}
