import {
    DraggableEvents, ResizableEvents,
    ScalableEvents, RotatableEvents, DraggableOptions,
    ResizableOptions, ScalableOptions, RotatableOptions, WarpableOptions,
    WarpableEvents, GroupableOptions, SnappableEvents, SnappableOptions,
    RenderableEvents, ClickableEvents, RoundableEvents, RoundableOptions,
    ClippableOptions, ClippableEvents, OriginDraggableEvents,
    DefaultOptions,
    DragAreaOptions, PinchableOptions, PinchableEvents, ScrollableEvents,
    ScrollableOptions,

    OriginOptions,
    PaddingOptions, OriginDraggableOptions,
    MoveableOptions, BeforeRenderableEvents, ClickableOptions, MoveableEvents, MoveableDefaultEvents,
} from "../src";

import Draggable from "../src/ables/Draggable";
import Resizable from "../src/ables/Resizable";
import Scalable from "../src/ables/Scalable";
import Rotatable from "../src/ables/Rotatable";
import Warpable from "../src/ables/Warpable";
import Groupable from "../src/ables/Groupable";
import Snappable from "../src/ables/Snappable";
import Default from "../src/ables/Default";
import DragArea from "../src/ables/DragArea";
import Roundable from "../src/ables/Roundable";
import Clippable from "../src/ables/Clippable";
import OriginDraggable from "../src/ables/OriginDraggable";
import Pinchable from "../src/ables/Pinchable";
import Scrollable from "../src/ables/Scrollable";
import Origin from "../src/ables/Origin";
import Padding from "../src/ables/Padding";
import Renderable from "../src/ables/Renderable";
import BeforeRenderable from "../src/ables/BeforeRenderable";
import Clickable from "../src/ables/Clickable";

type MatchTypes<
    T extends { [key in keyof Required<E>]: any },
    E extends  { [key in keyof Required<T>]: any },
> = any;
// type Writable<T> = { -readonly [key in keyof T]: any };

type PropsTester<Able extends { props: readonly string[] }, Props extends Record<string, any> = MoveableOptions> = {
    -readonly [key in Able["props"][number]]: Props[key];
};
type EventsTester<Able extends { events: readonly string[] }, Events extends Record<string, any> = MoveableEvents> = {
    -readonly [key in Able["events"][number] as `on${Capitalize<key>}`]: Events[key];
};

interface EmptyOptions { }

export type TestProps = [
    MatchTypes<PropsTester<typeof Default>, Required<DefaultOptions>>,
    MatchTypes<PropsTester<typeof DragArea>, Required<DragAreaOptions>>,
    MatchTypes<PropsTester<typeof Padding>, Required<PaddingOptions>>,
    MatchTypes<PropsTester<typeof Draggable>, Required<DraggableOptions>>,
    MatchTypes<PropsTester<typeof OriginDraggable>, Required<OriginDraggableOptions>>,
    MatchTypes<PropsTester<typeof Pinchable>, Required<PinchableOptions>>,
    MatchTypes<PropsTester<typeof Origin>, Required<OriginOptions>>,
    MatchTypes<PropsTester<typeof Clickable>, Required<ClickableOptions>>,
    MatchTypes<PropsTester<typeof Renderable>, Required<EmptyOptions>>,
    MatchTypes<PropsTester<typeof BeforeRenderable>, Required<EmptyOptions>>,
    MatchTypes<PropsTester<typeof Scrollable>, Required<ScrollableOptions>>,
    MatchTypes<PropsTester<typeof Scalable>, Required<ScalableOptions>>,
    MatchTypes<PropsTester<typeof Resizable>, Required<ResizableOptions>>,
    MatchTypes<PropsTester<typeof Origin>, Required<OriginOptions>>,
    MatchTypes<PropsTester<typeof Rotatable>, Required<RotatableOptions>>,
    MatchTypes<PropsTester<typeof Warpable>, Required<WarpableOptions>>,
    MatchTypes<PropsTester<typeof Groupable>, Required<GroupableOptions>>,
    MatchTypes<PropsTester<typeof Clippable>, Required<ClippableOptions>>,
    MatchTypes<PropsTester<typeof Snappable>, Required<SnappableOptions>>,
    MatchTypes<PropsTester<typeof Roundable>, Required<RoundableOptions>>,
];

export type TestProps2 = [
    MatchTypes<EventsTester<typeof Default>, Required<MoveableDefaultEvents>>,
    MatchTypes<EventsTester<typeof DragArea>, Required<ClickableEvents>>,
    MatchTypes<EventsTester<typeof Padding>, Required<EmptyOptions>>,
    MatchTypes<EventsTester<typeof Draggable>, Required<DraggableEvents>>,
    MatchTypes<EventsTester<typeof OriginDraggable>, Required<OriginDraggableEvents>>,
    MatchTypes<EventsTester<typeof Pinchable>, Required<PinchableEvents>>,
    MatchTypes<EventsTester<typeof Origin>, Required<EmptyOptions>>,
    MatchTypes<EventsTester<typeof Clickable>, Required<ClickableEvents>>,
    MatchTypes<EventsTester<typeof Renderable>, Required<RenderableEvents>>,
    MatchTypes<EventsTester<typeof BeforeRenderable>, Required<BeforeRenderableEvents>>,
    MatchTypes<EventsTester<typeof Scrollable>, Required<ScrollableEvents>>,
    MatchTypes<EventsTester<typeof Scalable>, Required<ScalableEvents>>,
    MatchTypes<EventsTester<typeof Resizable>, Required<ResizableEvents>>,
    MatchTypes<EventsTester<typeof Origin>, Required<EmptyOptions>>,
    MatchTypes<EventsTester<typeof Rotatable>, Required<RotatableEvents>>,
    MatchTypes<EventsTester<typeof Warpable>, Required<WarpableEvents>>,
    MatchTypes<EventsTester<typeof Groupable>, Required<EmptyOptions>>,
    MatchTypes<EventsTester<typeof Clippable>, Required<ClippableEvents>>,
    MatchTypes<EventsTester<typeof Snappable>, Required<SnappableEvents>>,
    MatchTypes<EventsTester<typeof Roundable>, Required<RoundableEvents>>,
];
