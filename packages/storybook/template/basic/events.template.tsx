import { previewFunction } from "storybook-addon-preview";

export const DRAG_START_TEMPLATE = previewFunction(`function onDragStart(e) {
    e.set(this.frame.translate);
}`);
export const DRAG_TEMPLATE = previewFunction(`function onDrag(e) {
    this.frame.translate = e.beforeTranslate;
    e.target.style.transform = ${"`"}translate(${"$"}{e.beforeTranslate[0]}px, ${"$"}{e.beforeTranslate[1]}px)${"`"};
}`);

export const RESIZE_START_TEMPLATE = previewFunction(`function onResizeStart(e) {
    e.setOrigin(["%", "%"]);
    e.dragStart && e.dragStart.set(this.frame.translate);
}`);
export const RESIZE_TEMPLATE = previewFunction(`function onResize(e) {
    const beforeTranslate = e.drag.beforeTranslate;

    this.frame.translate = beforeTranslate;
    e.target.style.width = ${"`"}${"$"}{e.width}px${"`"};
    e.target.style.height = ${"`"}${"$"}{e.height}px${"`"};
    e.target.style.transform = ${"`"}translate(${"$"}{beforeTranslate[0]}px, ${"$"}{beforeTranslate[1]}px)${"`"};
}`);

export const SCALE_START_TEMPLATE = previewFunction(`function onScaleStart(e) {
    e.set(this.frame.scale);
    e.dragStart && e.dragStart.set(this.frame.translate);
}`);
export const SCALE_TEMPLATE = previewFunction(`function onScale(e) {
    const beforeTranslate = e.drag.beforeTranslate;

    this.frame.translate = beforeTranslate;
    this.frame.scale = e.scale;
    e.target.style.transform
        = ${"`"}translate(${"$"}{beforeTranslate[0]}px, ${"$"}{beforeTranslate[1]}px)${"`"}
        + ${"`"} scale(${"$"}{e.scale[0]}, ${"$"}{e.scale[1]})${"`"};
}`);

export const ROTATE_START_TEMPLATE = previewFunction(`function onRotateStart(e) {
    e.set(this.frame.rotate);
}`);
export const ROTATE_TEMPLATE = previewFunction(`function onRotate({ beforeRotate }) {
    this.frame.rotate = e.beforeRotate;
    target.style.transform = ${"`"}rotate(${"$"}{e.beforeRotate}deg)${"`"};
}`);

export const WARP_START_TEMPLATE = previewFunction(`function onWarpStart(e) {
    e.set(this.frame.matrix);
}`);
export const WARP_TEMPLATE = previewFunction(`function onWarp(e) {
    this.frame.matrix = e.matrix;
    e.target.style.transform = ${"`"}matrix3d(${"$"}{e.matrix.join(",")})${"`"};
}`);
export const CLIP_START_TEMPLATE = previewFunction(`function onClipStart() {}`);
export const CLIP_TEMPLATE = previewFunction(`function onClip(e) {
    if (e.clipType === "rect") {
        e.target.style.clip = e.clipStyle;
    } else {
        e.target.style.clipPath = e.clipStyle;
    }
    this.frame.clipStyle = e.clipStyle;
}`);

export const ROUND_TEMPLATE = previewFunction(`function onRound(e) {
    e.target.style.borderRadius = e.borderRadius;
}`);

export const DRAG_ORIGIN_START_TEMPLATE = previewFunction(`function onDragOriginStart(e) {
    e.dragStart && e.dragStart.set(this.frame.translate);
}`);
export const DRAG_ORIGIN_TEMPLATE = previewFunction(`function onDragOrigin(e) {
    this.frame.translate = e.drag.beforeTranslate;
    this.frame.transformOrigin = e.transformOrigin;
}`);
export const DRAG_ORIGIN_DRAG_START_TEMPLATE = previewFunction(`function onDragStart(e) {
    e.set(this.frame.translate);
}`);
export const DRAG_ORIGIN_DRAG_TEMPLATE = previewFunction(`function onDrag(e) {
    this.frame.translate = e.beforeTranslate;
}`);
export const DRAG_ORIGIN_ROTATE_START_TEMPLATE = previewFunction(`function onRotateStart(e) {
    e.set(this.frame.rotate);
}`);
export const DRAG_ORIGIN_ROTATE_TEMPLATE = previewFunction(`function onRotate(e) {
    this.frame.rotate = e.beforeRotate;
}`);
export const DRAG_ORIGIN_RENDER_TEMPLATE = previewFunction(`function onRender(e) {
    const { translate, rotate, transformOrigin } = this.frame;
    e.target.style.transformOrigin = transformOrigin;
    e.target.style.transform = ${"`"}translate(${"$"}{translate[0]}px, ${"$"}{translate[1]}px)${"`"}
        +  ${"`"} rotate(${"$"}{rotate}deg)${"`"};
}`);
