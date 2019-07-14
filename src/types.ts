/**
 * @memberof Moveable
 * @typedef
 * @property - Whether or not target can be dragged.
 * @property - Whether or not target can be resized.
 * @property - Whether or not target can be scaled.
 * @property - Whether or not target can be rotated.
 * @property - Whether or not the origin controlbox will be visible or not
 * @property - The target to indicate Moveable Control Box.
 * @property - Moveable Container.

 */
export interface MoveableOptions {
    draggable?: boolean;
    resizable?: boolean;
    scalable?: boolean;
    rotatable?: boolean;
    origin?: boolean;
    target?: SVGElement | HTMLElement;
    container?: SVGElement | HTMLElement | null;
}
