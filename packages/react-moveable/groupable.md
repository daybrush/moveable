## 🚀 How to use Groupable
* **Groupable** indicates Whether the targets can be moved in group with draggable, resizable, scalable, rotatable.

* [API Documentation](https://daybrush.com/moveable/release/latest/doc/)

```tsx
import Moveable from "react-moveable";

render() {
    return (
        <Moveable
            /* multiple targets */
            targets={[].slice.call(document.querySelectorAll(".target"))}
            container={null}
            origin={true}

            /* Resize event edges */
            edge={false}

            /* draggable */
            draggable={true}
            throttleDrag={0}
            onDragGroupStart={({ targets }) => {
                console.log("onDragGroupStart", targets);
            }}
            onDragGroup={({ targets, events }) => {
                console.log("onDragGroup", targets);

                events.forEach(ev => {
                    // drag event
                    console.log("onDrag left, top", ev.left, ev.top);
                    // ev.target!.style.left = `${ev.left}px`;
                    // ev.target!.style.top = `${ev.top}px`;
                    console.log("onDrag translate", ev.dist);
                    ev.target!.style.transform = ev.transform;)
                });
            }}
            onDragGroupEnd={({ targets, isDrag, clientX, clientY }) => {
                console.log("onDragGroupEnd", target, isDrag);
            }}

            /* When resize or scale, keeps a ratio of the width, height. */
            keepRatio={true}

            /* resizable*/
            /* Only one of resizable, scalable, warpable can be used. */
            resizable={true}
            throttleResize={0}
            onResizeGroupStart={({ targets, clientX, clientY }) => {
                console.log("onResizeGroupStart", targets);
            }}
            onResizeGroup={({ targets, direction }) => {
                console.log("onResizeGroup", targets);

                e.events.forEach(ev => {
                    const offset = [
                        direction[0] < 0 ? -ev.delta[0] : 0,
                        direction[1] < 0 ? -ev.delta[1] : 0,
                    ];
                    // ev.drag is a drag event that occurs when the group resize.
                    const left = offset[0] + ev.drag.beforeDist[0];
                    const top = offset[1] + ev.drag.beforeDist[1];
                    const width = ev.width;
                    const top = ev.top;
                });
            }}
            onResizeGroupEnd={({ targets, isDrag, clientX, clientY }) => {
                console.log("onResizeGroupEnd", targets, isDrag);
            }}
        />
    );
}
```
