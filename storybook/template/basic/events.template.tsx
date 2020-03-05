import { previewFunction } from "storybook-addon-preview";

export const DRAG_START_TEMPLATE = previewFunction(`function onDragStart({ set }) {
    set(this.frame.translate);
}`);
export const DRAG_TEMPLATE = previewFunction(`function onDrag({ target, beforeTranslate }) {
    this.frame.translate = beforeTranslate;
    target.style.transform = ${"`"}translate(${"$"}{beforeTranslate[0]}px, ${"$"}{beforeTranslate[1]}px)${"`"};
}`);

export const RESIZE_START_TEMPLATE = previewFunction(`function onResizeStart({ setOrigin, dragStart }) {
    setOrigin(["%", "%"]);
    dragStart && dragStart.set(this.frame.translate);
}`);
export const RESIZE_TEMPLATE = previewFunction(`function onResize({ target, width, height, drag }) {
    const beforeTranslate = drag.beforeTranslate;

    this.frame.translate = beforeTranslate;
    target.style.width = ${"`"}${"$"}{width}px${"`"};
    target.style.height = ${"`"}${"$"}{height}px${"`"};
    target.style.transform = ${"`"}translate(${"$"}{beforeTranslate[0]}px, ${"$"}{beforeTranslate[1]}px)${"`"};
}`);

export const ROTATE_START_TEMPLATE = previewFunction(`function onRotateStart({ set }) {
    set(this.frame.rotate);
}`);
export const ROTATE_TEMPLATE = previewFunction(`function onRotate({ beforeRotate }) {
    this.frame.rotate = beforeRotate;
}`);
