import EgComponent from "@egjs/component";
import { ref } from "framework-utils";
import { h, render } from "preact";
import InnerMoveable from "./InnerMoveable";
import { MoveableOptions } from "./types";
import {
    OnDragStart, OnDrag, OnResize, OnResizeStart,
    OnResizeEnd, OnScaleStart, OnScaleEnd, OnRotateStart,
    OnRotateEnd, OnDragEnd, OnRotate, OnScale,
} from "preact-moveable";

export default class Moveable extends EgComponent {
    private preactMoveable!: InnerMoveable;
    constructor(parentElement: HTMLElement, options: MoveableOptions = {}) {
        super();
        const element = document.createElement("div");

        render(
            <InnerMoveable
                ref={ref(this, "preactMoveable")}
                {...options}
                onDragStart={this.onDragStart}
                onDrag={this.onDrag}
                onDragEnd={this.onDragEnd}
                onResizeStart={this.onResizeStart}
                onResize={this.onResize}
                onResizeEnd={this.onResizeEnd}
                onScaleStart={this.onScaleStart}
                onScale={this.onScale}
                onScaleEnd={this.onScaleEnd}
                onRotateStart={this.onRotateStart}
                onRotate={this.onRotate}
                onRotateEnd={this.onRotateEnd}
            />,
            element,
        );
        parentElement.appendChild(element.children[0]);
    }
    get draggable() {
        return this.preactMoveable.state.draggable || false;
    }
    set draggable(draggable: boolean) {
        this.preactMoveable.setState({
            draggable,
        });
    }
    get target() {
        return this.preactMoveable.state.draggable || false;
    }
    set target(target: boolean) {
        this.preactMoveable.setState({
            target,
        });
    }
    get resizable() {
        return this.preactMoveable.state.resizable || false;
    }
    set resizable(resizable: boolean) {
        this.preactMoveable.setState({
            resizable,
        });
    }
    get scalable() {
        return this.preactMoveable.state.scalable || false;
    }
    set scalable(scalable: boolean) {
        this.preactMoveable.setState({
            scalable,
        });
    }
    get rotatable() {
        return this.preactMoveable.state.rotatable || false;
    }
    set rotatable(rotatable: boolean) {
        this.preactMoveable.setState({
            rotatable,
        });
    }
    private onDragStart = (e: OnDragStart) => {
        this.trigger("dragStart", e);
    }
    private onDrag = (e: OnDrag) => {
        this.trigger("drag", e);
    }
    private onDragEnd = (e: OnDragEnd) => {
        this.trigger("dragEnd", e);
    }
    private onResizeStart = (e: OnResizeStart) => {
        this.trigger("resizeStart", e);
    }
    private onResize = (e: OnResize) => {
        this.trigger("resize", e);
    }
    private onResizeEnd = (e: OnResizeEnd) => {
        this.trigger("resizeEnd", e);
    }
    private onScaleStart = (e: OnScaleStart) => {
        this.trigger("scaleStart", e);
    }
    private onScale = (e: OnScale) => {
        this.trigger("scale", e);
    }
    private onScaleEnd = (e: OnScaleEnd) => {
        this.trigger("scaleEnd", e);
    }
    private onRotateStart = (e: OnRotateStart) => {
        this.trigger("rotateStart", e);
    }
    private onRotate = (e: OnRotate) => {
        this.trigger("rotate", e);
    }
    private onRotateEnd = (e: OnRotateEnd) => {
        this.trigger("rotateEnd", e);
    }
}
