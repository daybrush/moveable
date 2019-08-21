## 🚀 How to use Groupable
* **Groupable** indicates Whether the targets can be moved in group with draggable, resizable, scalable, rotatable.

* [API Documentation](https://daybrush.com/moveable/release/latest/doc/)
* **draggable**
    * [onDragGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroupStart)
    * [onDragGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroup)
    * [onDragGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroupEnd)
* **resizable**
    * [onResizeGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroupStart)
    * [onResizeGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroup)
    * [onResizeGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroupEnd)
* **scalable**
    * [onScaleGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroupStart)
    * [onScaleGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroup)
    * [onScaleGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rscaleGroupEnd)
* **rotatable**
    * [onRotateGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroupStart)
    * [onRotateGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroup)
    * [onRotateGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroupEnd)
* **pinchable**
    * [onPinchGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:pinchGroupStart)
    * [onPinchGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:pinchGroup)
    * [onPinchGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:pinchGroupEnd)

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxMoveableModule, NgxMoveableComponent } from '../ngx-moveable';

@NgModule({
  declarations: [
    AppComponent,
    NgxMoveableComponent,
  ],
  imports: [
    BrowserModule,
    // NgxMoveableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  target=[].slice.call(document.querySelectorAll(".target"));
  /* draggable */
  onDragGroupStart({ targets }) {
    console.log("onDragGroupStart", targets);
  }

  onDragGroup({ targets, events }) {
    console.log("onDragGroup", targets);

    events.forEach(ev => {
        // drag event
        console.log("onDrag left, top", ev.left, ev.top);
        // ev.target!.style.left = `${ev.left}px`;
        // ev.target!.style.top = `${ev.top}px`;
        console.log("onDrag translate", ev.dist);
        ev.target!.style.transform = ev.transform;)
    });
  }

  onDragGroupEnd({ targets, isDrag, clientX, clientY }) {
    console.log("onDragGroupEnd", target, isDrag);
  }

  /* resizable */
  onResizeGroupStart({ targets, clientX, clientY }) {
    console.log("onResizeGroupStart", targets);
  }

  onResizeGroup({ events, targets, direction }) {
    console.log("onResizeGroup", targets);

    events.forEach(ev => {
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
  }

  onResizeGroupEnd({ targets, isDrag, clientX, clientY }) {
    console.log("onResizeGroupEnd", targets, isDrag);
  }

  /* scalable */
  onScaleGroupStart({ targets, clientX, clientY }) {
    console.log("onScaleGroupStart", targets);
  }

  onScale({ targets, events }) {
    console.log("onScaleGroup", targets);

    events.forEach(ev => {
        const target = ev.target;
        // ev.drag is a drag event that occurs when the group scale.
        const left = ev.drag.beforeDist[0];
        const top = ev.drag.beforeDist[0];
        const scaleX = ev.scale[0];
        const scaleX = ev.scale[1];
    });
  }

  onScaleEnd({ target, isDrag, clientX, clientY }) {
    console.log("onScaleGroupEnd", target, isDrag);
  }

  /* rotatable */
  onRotateGroupStart({ targets, clientX, clientY }) {
    console.log("onRotateGroupStart", targets);
  }
  onRotateGroup({
    targets,
    events
    delta, dist,
  }) {
    e.events.forEach(ev => {
      const target = ev.target;
      // ev.drag is a drag event that occurs when the group rotate.
      const left = ev.drag.beforeDist[0];
      const top = ev.drag.beforeDist[1];
      const deg = ev.beforeDist;
    });
  }
  onRotateGroupEnd({ targets, isDrag, clientX, clientY }) {
    console.log("onRotateGroupEnd", targets, isDrag);
  }
  /* pinchable */
  // Enabling pincable lets you use events that
  // can be used in draggable, resizable, scalable, and rotateable.
  onPinchGroupStart({ targets, clientX, clientY, datas }) {
    // pinchGroupStart event occur before dragGroupStart, rotateGroupStart, scaleGroupStart, resizeGroupStart
    console.log("onPinchGroupStart");
  }
  onPinchGroup({ targets, clientX, clientY, datas }) {
    // pinchGroup event occur before dragGroup, rotateGroup, scaleGroup, resizeGroup
    console.log("onPinchGroup");
  }
  onPinchGroupEnd({ isDrag, targets, clientX, clientY, datas }) {
    // pinchGroupEnd event occur before dragGroupEnd, rotateGroupEnd, scaleGroupEnd, resizeGroupEnd
    console.log("onPinchGroupEnd");
  }
}
```

### Template
```html
<ngx-moveable
  [target]="target"
  [origin]="true"
  [edge]="false"

  [draggable]="true"
  [throttleDrag]="0"
  (drgGroupStart)="onDragGroupStart($event)"
  (dragGroup)="onDragGroup($event)"
  (dragGroupEnd)="onDragGroupEnd($event)"

  [keepRatio]="false"

  [resizable]="false"
  [throttleResize]="0"
  (resizeGroupStart)="onResizeGroupStart($event)"
  (resizeGroup)="onResizeGroup($event)"
  (resizeGroupEnd)="onResizeEnd($event)"
  
  [scalable]="false"
  [throttleScale]="0"
  (scaleStart)="onScaleGroupStart($event)"
  (scale)="onScaleGroup($event)"
  (sacleEnd)="onScaleGroupEnd($event)"

  [rotatable]="false"
  [throttleRotate]="0"
  (rotateStart)="onRotateGroupStart($event)"
  (rotate)="onRotateGroup($event)"
  (rotateEnd)="onRotateGroupEnd($event)"

  [pinchable]="false"
  (pinchStart)="onPinchGroupStart($event)"
  (pinch)="onPinchGroup($event)"
  (pinchEnd)="onPinchGroupEnd($event)"

```
