import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { DEFAULT_REACT_CODESANDBOX, withPreview } from "storybook-addon-preview";
import "../../template/basic/basic.css";
import Moveable, {  } from "react-moveable";
import MoveableHelper from "moveable-helper";
import { BASIC_CSS_TEMPLATE } from "../../template/basic/template";
import InfiniteViewer from "react-infinite-viewer";
import "./scroll.css";

const story = storiesOf("Support Scroll", module);

story.addDecorator(withKnobs).addDecorator(withPreview);

function App() {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    });
    const viewerRef = React.useRef<InfiniteViewer>(null);
    const targetRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        viewerRef.current!.scrollCenter();
    });
    return <div className="container">
        <button onClick={() => {
            viewerRef.current!.scrollCenter();
        }} style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1,
        }}>Scroll Center</button>
        <InfiniteViewer className="infinite-viewer" ref={viewerRef}>
            <div className="viewport" style={{
                width: "400px",
                height: "400px",
                border: "1px solid #ccc",
            }}>
                <div className="target" ref={targetRef}>Target</div>
                <Moveable
                    scrollable={true}
                    scrollContainer={() => viewerRef.current!.getElement()}
                    scrollThreshold={20}
                    getScrollPosition={() => {
                        console.log( viewerRef.current!.getScrollLeft(),
                        viewerRef.current!.getScrollTop());
                        return [
                            viewerRef.current!.getScrollLeft(),
                            viewerRef.current!.getScrollTop(),
                        ];
                    }}
                    onScroll={({ direction }) => {
                        console.log(direction);
                        viewerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                    }}

                    target={targetRef}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    onDragStart={helper.onDragStart}
                    onDrag={helper.onDrag}
                    onResizeStart={helper.onResizeStart}
                    onResize={helper.onResize}
                    onRotateStart={helper.onRotateStart}
                    onRotate={helper.onRotate}
                />
            </div>
        </InfiniteViewer>
    </div>;
}
story.add("Use Scrollable", () => {
    return <App />;
}, {
    preview: [
        {
            tab: "CSS",
            template: BASIC_CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "React",
            template: `
import * as React from "react";
import Moveable from "react-moveable";
import MoveableHelper from "moveable-helper";
import InfiniteViewer from "react-infinite-viewer";

export default function App() {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    });
    const viewerRef = React.useRef<InfiniteViewer>(null);
    const targetRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        viewerRef.current!.scrollCenter();
    });
    return <div className="container">
        <button onClick={() => {
            viewerRef.current!.scrollCenter();
        }} style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1,
        }}>Scroll Center</button>
        <InfiniteViewer className="infinite-viewer" ref={viewerRef}>
            <div className="viewport" style={{
                width: "400px",
                height: "400px",
                border: "1px solid #ccc",
            }}>
                <div className="target" ref={targetRef}>Target</div>
                <Moveable
                    scrollable={true}
                    scrollContainer={() => viewerRef.current!.getElement()}
                    scrollThreshold={20}
                    getScrollPosition={() => {
                        console.log( viewerRef.current!.getScrollLeft(),
                        viewerRef.current!.getScrollTop());
                        return [
                            viewerRef.current!.getScrollLeft(),
                            viewerRef.current!.getScrollTop(),
                        ];
                    }}
                    onScroll={({ direction }) => {
                        console.log(direction);
                        viewerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                    }}

                    target={targetRef}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    onDragStart={helper.onDragStart}
                    onDrag={helper.onDrag}
                    onResizeStart={helper.onResizeStart}
                    onResize={helper.onResize}
                    onRotateStart={helper.onRotateStart}
                    onRotate={helper.onRotate}
                />
            </div>
        </InfiniteViewer>
    </div>;
}
            `,
            language: "tsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-moveable", "moveable-helper", "react-infinite-viewer"]),
        },
    ]
});
