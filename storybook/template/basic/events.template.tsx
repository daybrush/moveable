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

export const SCALE_START_TEMPLATE = previewFunction(`function onScaleStart({ set, dragStart }) {
    set(this.frame.scale);
    dragStart && dragStart.set(this.frame.translate);
}`);
export const SCALE_TEMPLATE = previewFunction(`function onScale({ target, scale, drag }) {
    const beforeTranslate = drag.beforeTranslate;

    this.frame.translate = beforeTranslate;
    this.frame.scale = scale;
    target.style.transform
        = ${"`"}translate(${"$"}{beforeTranslate[0]}px, ${"$"}{beforeTranslate[1]}px)${"`"}
        + ${"`"} scale(${"$"}{scale[0]}, ${"$"}{scale[1]})${"`"};
}`);

export const ROTATE_START_TEMPLATE = previewFunction(`function onRotateStart({ set }) {
    set(this.frame.rotate);
}`);
export const ROTATE_TEMPLATE = previewFunction(`function onRotate({ beforeRotate }) {
    this.frame.rotate = beforeRotate;
    target.style.transform = ${"`"}rotate(${"$"}{beforeRotate}deg)${"`"};
}`);

export const WARP_START_TEMPLATE = previewFunction(`function onWarpStart({ set }) {
    set(this.frame.matrix);
}`);
export const WARP_TEMPLATE = previewFunction(`function onWarp({ matrix }) {
    this.frame.matrix = matrix;
    target.style.transform = ${"`"}matrix3d(${"$"}{matrix.join(",")})${"`"};
}`);
export const CLIP_START_TEMPLATE = previewFunction(`function onClipStart() {}`);
export const CLIP_TEMPLATE = previewFunction(`function onClip({ clipType, clipStyle }) {
    if (e.clipType === "rect") {
        e.target.style.clip = e.clipStyle;
    } else {
        e.target.style.clipPath = e.clipStyle;
    }
    this.frame.clipStyle = e.clipStyle;
}`);

export const ROUND_TEMPLATE = previewFunction(`function onRound({ borderRadius }) {
    e.target.style.borderRadius = borderRadius;
}`);

export const DRAG_ORIGIN_START_TEMPLATE = previewFunction(`function onDragOriginStart({ dragStart }) {
    dragStart && dragStart.set(this.frame.translate);
}`);
export const DRAG_ORIGIN_TEMPLATE = previewFunction(`function onDragOrigin({ target, drag, transformOrigin }) {
    this.frame.translate = drag.beforeTranslate;
    this.frame.transformOrigin = transformOrigin;
}`);
export const DRAG_ORIGIN_DRAG_START_TEMPLATE = previewFunction(`function onDragStart({ set }) {
    set(this.frame.translate);
}`);
export const DRAG_ORIGIN_DRAG_TEMPLATE = previewFunction(`function onDrag({ target, beforeTranslate }) {
    this.frame.translate = beforeTranslate;
}`);
export const DRAG_ORIGIN_ROTATE_START_TEMPLATE = previewFunction(`function onRotateStart({ set }) {
    set(this.frame.rotate);
}`);
export const DRAG_ORIGIN_ROTATE_TEMPLATE = previewFunction(`function onRotate({ beforeRotate }) {
    this.frame.rotate = beforeRotate;
}`);
export const DRAG_ORIGIN_RENDER_TEMPLATE = previewFunction(`function onRender({ target }) {
    const { translate, rotate, transformOrigin } = this.frame;
    target.style.transformOrigin = transformOrigin;
    target.style.transform = ${"`"}translate(${"$"}{translate[0]}px, ${"$"}{translate[1]}px)${"`"}
        +  ${"`"} rotate(${"$"}{rotate}deg)${"`"};
}`);
