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
 * @property - throttle of x, y when drag.
 * @property - throttle of width, height when resize.
 * @property - throttle of scaleX, scaleY when scale.
 * @property - throttle of angle(degree) when rotate.
 * @property - When resize or scale, keeps a ratio of the width, height.

 */
export interface MoveableOptions {
    draggable?: boolean;
    resizable?: boolean;
    scalable?: boolean;
    rotatable?: boolean;
    origin?: boolean;
    target?: SVGElement | HTMLElement;
    container?: SVGElement | HTMLElement | null;
    throttleDrag?: number;
    throttleResize?: number;
    throttleScale?: number;
    throttleRotate?: number;
    keepRatio?: boolean;
}
