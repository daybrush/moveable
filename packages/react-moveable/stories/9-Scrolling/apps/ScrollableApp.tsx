import * as React from "react";
import Moveable from "../../../src/react-moveable";
import InfiniteViewer from "react-infinite-viewer";

export default function App() {
    const viewerRef = React.useRef<InfiniteViewer>(null);
    const targetRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setTimeout(() => {
            viewerRef.current!.scrollCenter();
        }, 100);
    }, []);
    return (<div className="container">
        <button className="button" onClick={() => {
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
                        return [
                            viewerRef.current!.getScrollLeft(),
                            viewerRef.current!.getScrollTop(),
                        ];
                    }}
                    onScroll={({ direction }) => {
                        viewerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                    }}
                    target={targetRef}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    onRender={e => {
                        e.target.style.cssText += e.cssText;
                    }}
                ></Moveable>
            </div>
        </InfiniteViewer>
    </div>);
}
