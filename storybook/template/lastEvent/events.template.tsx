import { previewFunction } from "storybook-addon-preview";

export const LAST_EVENT_DRAG_TEMPLATE = previewFunction(`function onDrag({ target, beforeTranslate }) {
    target.style.transform = ${"`"}translate(${"$"}{beforeTranslate[0]}px, ${"$"}{beforeTranslate[1]}px)${"`"};
}`);
export const LAST_EVENT_DRAG_END_TEMPLATE = previewFunction(`function onDragEnd({ lastEvent }) {
    if (lastEvent) {
        this.frame.translate = lastEvent.beforeTranslate;
    }
}`);

export const LAST_EVENT_RESIZE_TEMPLATE = previewFunction(`function onResize({ target, width, height, drag }) {
    const beforeTranslate = drag.beforeTranslate;
    target.style.width = ${"`"}${"$"}{width}px${"`"};
    target.style.height = ${"`"}${"$"}{height}px${"`"};
    target.style.transform = ${"`"}translate(${"$"}{beforeTranslate[0]}px, ${"$"}{beforeTranslate[1]}px)${"`"};
}`);

export const LAST_EVENT_RESIZE_END_TEMPLATE = previewFunction(`function onResizeEnd({ lastEvent }) {
    if (lastEvent) {
        this.frame.translate = lastEvent.drag.beforeTranslate;
    }
}`);

export const LAST_EVENT_SCALE_TEMPLATE = previewFunction(`function onScale({ target, scale, drag }) {
    const beforeTranslate = drag.beforeTranslate;

    this.frame.translate = beforeTranslate;
    this.frame.scale = scale;
    target.style.transform
        = ${"`"}translate(${"$"}{beforeTranslate[0]}px, ${"$"}{beforeTranslate[1]}px)${"`"}
        + ${"`"} scale(${"$"}{scale[0]}, ${"$"}{scale[1]})${"`"};
}`);
export const LAST_EVENT_SCALE_END_TEMPLATE = previewFunction(`function onScaleEnd({ lastEvent }) {
    if (lastEvent) {
        this.frame.translate = lastEvent.drag.beforeTranslate;
        this.frame.scale = lastEvent.scale;
    }
}`);

export const LAST_EVENT_ROTATE_TEMPLATE = previewFunction(`function onRotate({ beforeRotate }) {
    this.frame.rotate = beforeRotate;
    target.style.transform = ${"`"}rotate(${"$"}{beforeRotate}deg)${"`"};
}`);
export const LAST_EVENT_ROTATE_END_TEMPLATE = previewFunction(`function onRotateEnd({ lastEvent }) {
    if (lastEvent) {
        this.frame.rotate = lastEvent.beforeRotate;
    }
}`);

export const LAST_EVENT_WARP_TEMPLATE = previewFunction(`function onWarp({ matrix }) {
    target.style.transform = ${"`"}matrix3d(${"$"}{matrix.join(",")})${"`"};
}`);
export const LAST_EVENT_WARP_END_TEMPLATE = previewFunction(`function onWarpEnd({ lastEvent }) {
    if (lastEvent) {
        this.frame.matrix = lastEvent.matrix;
    }
}`);

export const LAST_EVENT_CLIP_TEMPLATE = previewFunction(`function onClip({ clipType, clipStyle }) {
    if (e.clipType === "rect") {
        e.target.style.clip = e.clipStyle;
    } else {
        e.target.style.clipPath = e.clipStyle;
    }
}`);
export const LAST_EVENT_CLIP_END_TEMPLATE = previewFunction(`function onClipEnd({ lastEvent }) {
    if (lastEvent) {
        this.frame.clipStyle = lastEvent.clipStyle;
    }
}`);
