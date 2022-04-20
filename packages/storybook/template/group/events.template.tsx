import { previewFunction } from "storybook-addon-preview";

export const DRAG_GROUP_START_TEMPLATE = previewFunction(`function onDragGroupStart({ events }) {
    events.forEach((ev, i) => {
        ev.set(this.frames[i].translate);
    });
}`);
export const DRAG_GROUP_TEMPLATE = previewFunction(`function onDragGroup({ events }) {
    events.forEach((ev, i) => {
        this.frames[i].translate = ev.beforeTranslate;
        ev.target.style.transform
            = ${"`"}translate(${"$"}{ev.beforeTranslate[0]}px, ${"$"}{ev.beforeTranslate[1]}px)${"`"};
    });
}`);
export const RESIZE_GROUP_START_TEMPLATE = previewFunction(`function onResizeGroupStart({ events }) {
    events.forEach((ev, i) => {
        ev.dragStart && ev.dragStart.set(this.frames[i].translate);
    });
}`);
export const RESIZE_GROUP_TEMPLATE = previewFunction(`function onResizeGroup({ events }) {
    events.forEach((ev, i) => {
        this.frames[i].translate = ev.drag.beforeTranslate;
        ev.target.style.width = ${"`"}${"$"}{ev.width}px${"`"};
        ev.target.style.height = ${"`"}${"$"}{ev.height}px${"`"};
        ev.target.style.transform
            = ${"`"}translate(${"$"}{ev.drag.beforeTranslate[0]}px, ${"$"}{ev.drag.beforeTranslate[1]}px)${"`"};
    });
}`);

export const SCALE_GROUP_START_TEMPLATE = previewFunction(`function onScaleGroupStart({ events }) {
    events.forEach((ev, i) => {
        ev.set(this.frames[i].scale);
        ev.dragStart && ev.dragStart.set(this.frames[i].translate);
    });
}`);
export const SCALE_GROUP_TEMPLATE = previewFunction(`function onScaleGroup({ events }) {
    events.forEach((ev, i) => {
        this.frames[i].translate = ev.drag.beforeTranslate;
        this.frames[i].scale = ev.scale;

        ev.target.style.transform
            = ${"`"}translate(${"$"}{ev.drag.beforeTranslate[0]}px, ${"$"}{ev.drag.beforeTranslate[1]}px)${"`"}
            + ${"`"} scale(${"$"}{ev.scale[0]}, ${"$"}{ev.scale[1]})${"`"};
    });
}`);

export const ROTATE_GROUP_START_TEMPLATE = previewFunction(`function onRotateGroupStart({ events }) {
    events.forEach((ev, i) => {
        ev.set(this.frames[i].rotate);
        ev.dragStart && ev.dragStart.set(this.frames[i].translate);
    });
}`);
export const ROTATE_GROUP_TEMPLATE = previewFunction(`function onRotateGroup({ events }) {
    events.forEach((ev, i) => {
        this.frames[i].translate = ev.drag.beforeTranslate;
        this.frames[i].rotate = ev.rotate;

        ev.target.style.transform
            = ${"`"}translate(${"$"}{ev.drag.beforeTranslate[0]}px, ${"$"}{ev.drag.beforeTranslate[1]}px)${"`"}
            + ${"`"} rotate(${"$"}{ev.rotate}deg)${"`"};
    });
}`);
