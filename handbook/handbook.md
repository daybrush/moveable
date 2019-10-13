# Moveable Handbook

This document explains how to use [moveable](https://github.com/daybrush/moveable).

# Table of Contents
  * [API Documentation](https://daybrush.com/moveable/release/latest/doc/)
  * [Introduction](#toc-introduction)
  * [Basic Support](#toc-support)
  * [Ables](#toc-ables)
      * [Draggable](#toc-draggable)
      * [Resizable](#toc-resizable)
      * [Scalable](#toc-scalable)
      * [Rotatable](#toc-rotatable)
      * [Warpable](#toc-warpable)
      * [Pinchable](#toc-pinchable)
      * [Snappable(Guidelines & Boundaries)](#toc-snappable)
  * [How to use Group](#toc-group)
    * [Group with Draggable](#toc-group-draggable)
    * [Group with Resizable](#toc-group-resizable)
    * [Group with Scalable](#toc-group-scalable)
    * [Group with Rotatable](#toc-group-rotatable)
  * [How to use custom css](#toc-custom-css)


# <a id="toc-introduction"></a>Introduction

<p align="middle" ><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/logo.png"/></p>
<h2 align="middle">Moveable</h2>

Moveable makes the target draggable, resizable, scalable, warpable, rotatable, pinchable and snappable.

The reason for creating a moveable is to create an editor. Main Project is **[scenejs-editor](https://github.com/daybrush/scenejs-editor)**.


Another reason for this is the [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform).

If the transform overlaps from the root element to the parent element, the distance it moves is not equal to the amount actually moved. So I made it to calculate the distance actually moved.


# <a id="toc-support"></a>Basic Support

* Support Webkit Safari(Mac, iOS)
* Support SVG Elements (Not Support Resizable, Use scaldable instead of resizable.)
* Support 3d Transform
* [Support Group](#toc-group)


If you have any questions or requests or want to contribute to `moveable` or other packages, please write the [issue](https://github.com/daybrush/moveable/issues) or give me a Pull Request freely.


# <a id="toc-ables"></a>Ables
You can Drag, Resize, Scale, Rotate, Warp, Pinch, Snap.

* [Draggable](#toc-draggable)
* [Resizable](#toc-resizable)
* [Scalable](#toc-scalable)
* [Rotatable](#toc-rotatable)
* [Warpable](#toc-warpable)
* [Pinchable](#toc-pinchable)
* [Snappable(Guidelines & Boundaries)](#toc-snappable)

## <a id="toc-draggable"></a>Draggable

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/draggable.gif"></a>


**Draggable** refers to the ability to drag and move targets.

### Events
* [onDragStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragStart): When the drag starts, the dragStart event is called.
* [onDrag](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:drag): When dragging, the drag event is called.
* [onDragEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragEnd): When the drag finishes, the dragEnd event is called.

### Options
* [throttleDrag](https://daybrush.com/moveable/release/latest/doc/Moveable.html#throttleDrag): throttle of x, y when drag. (default: 0)
* [dragArea](https://daybrush.com/moveable/release/latest/doc/Moveable.html#dragArea): Add an event to the moveable area instead of the target for stopPropagation. (default: false)

### Vanilla Exmaple

```ts
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: targets,
    draggable: true,
    throttleDrag: 0,
});

const frame = {
    translate: [0, 0],
};
moveable.on("dragStart", ({ set }) => {
    set(frame.translate);
}).on("drag", ({ target, beforeTranslate }) => {
    frame.translate = beforeTranslate;
    target.style.transform
        = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
}).on("dragEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onDragEnd", target, isDrag);
});
```

### React & Preact Example


```tsx
import Moveable from "react-moveable"; // preact-moveable

this.frame = {
    translate: [0, 0],
};
<Moveable
    target={document.querySelector(".target")}
    draggable={true}
    throttleDrag={0}
    onDragStart={({ set }) => {
        set(frame.translate);
    }}
    onDrag={({ target, beforeTranslate }) => {
        frame.translate = beforeTranslate;
        target.style.transform
            = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    }}
    onDragEnd={({ target, isDrag, clientX, clientY }) => {
        console.log("onDragEnd", target, isDrag);
    }} />;
```


### Angular Example
```ts
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [draggable]="true"
    [throttleDrag]="0"
    (dragStart)="onDragStart($event)
    (drag)="onDrag($event)
    (dragEnd)="onDragEnd($event)
    />
`,
})
export class AppComponent {
    frame = {
        translate: [0, 0],
    };
    onDragStart({ set }) {
        ev.set(frame.translate);
    }
    onDrag({ target, beforeTranslate }) {
        frame.translate = beforeTranslate;
        target.style.transform
            = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    }
    onDragEnd({ target, isDrag, clientX, clientY }) {
        console.log("onDragEnd", target, isDrag);
    }
}
```


## <a id="toc-resizable"></a>Resizable

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/resizable.gif"></a>

**Resizable** indicates whether the target's width and height can be increased or decreased.


### Events
* [onReiszeStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeStart): When the resize starts, the resizeStart event is called.
* [onResize](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resize): When resizing, the resize event is called.
* [onResizeEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeEnd): When the resize finishes, the resizeEnd event is called.


### Options
* [throttleResize](https://daybrush.com/moveable/release/latest/doc/Moveable.html#throttleResize): throttle of width, height when resize. (default: 0)
* [keepRatio](https://daybrush.com/moveable/release/latest/doc/Moveable.html#keepRatio): When resize or scale, keeps a ratio of the width, height. (default: false)


### Vanilla Example

```ts
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    target: document.querySelector(".target"),
    scalable: true,
    throttleScale: 0,
    keepRatio: false,
});

const frame = {
    translate: [0, 0],
};
moveable.on("resizeStart", ({ set, setOrigin, dragStart }) => {
    // Set origin if transform-orgin use %.
    setOrigin(["%", "%"]);

    // If cssSize and offsetSize are different, set cssSize. (no box-sizing)
    const style = window.getComputedStyle(ev.target);
    const cssWidth = parseFloat(style.width);
    const cssHeight = parseFloat(style.height);
    set([cssWidth, cssHeight]);

    // If a drag event has already occurred, there is no dragStart.
    dragStart && dragStart.set(frame.translate);
}).on("resize", ({ target, width, height, drag }) => {
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;

    // get drag event
    frame.translate = drag.beforeTranslate;
    target.style.transform
        = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
}).on("resizeEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onResizeEnd", target, isDrag);
});
```

### React & Preact Example

```tsx
import Moveable from "react-moveable"; // preact-moveable

this.frame = {
    translate: [0, 0],
};
<Moveable
    target={document.querySelector(".target")}
    resizable={true}
    throttleResize={0}
    keepRatio={false}
    onResizeStart={({ set, setOrigin, dragStart }) => {
        // Set origin if transform-orgin use %.
        setOrigin(["%", "%"]);

        // If cssSize and offsetSize are different, set cssSize. (no box-sizing)
        const style = window.getComputedStyle(ev.target);
        const cssWidth = parseFloat(style.width);
        const cssHeight = parseFloat(style.height);
        set([cssWidth, cssHeight]);

        // If a drag event has already occurred, there is no dragStart.
        dragStart && dragStart.set(this.frame.translate);
    }}
    onResize={({ target, width, height, drag }) => {
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;

        // get drag event
        this.frame.translate = drag.beforeTranslate;
        target.style.transform
            = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
    }}
    onResizeEnd={({ target, isDrag, clientX, clientY }) => {
        console.log("onResizeEnd", target, isDrag);
    }} />;
```


### Angular Example
```ts
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [resizable]="true"
    [throttleResize]="0"
    [keepRatio]="false"
    (resizeStart)="onResizeStart($event)
    (resize)="onResize($event)
    (resizeEnd)="onResizeEnd($event)
    />
`,
})
export class AppComponent {
    frame = {
        translate: [0, 0],
    };
    onResizeStart({ set, setOrigin, dragStart }) {
        // Set origin if transform-orgin use %.
        setOrigin(["%", "%"]);

        // If cssSize and offsetSize are different, set cssSize. (no box-sizing)
        const style = window.getComputedStyle(ev.target);
        const cssWidth = parseFloat(style.width);
        const cssHeight = parseFloat(style.height);
        set([cssWidth, cssHeight]);

        // If a drag event has already occurred, there is no dragStart.
        dragStart && dragStart.set(this.frame.translate);
    }
    onResize({ target, width, height, drag }) {
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;

        // get drag event
        this.frame.translate = drag.beforeTranslate;
        target.style.transform
            = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
    }
    onResizeEnd({ target, isDrag, clientX, clientY }) {
        console.log("onResizeEnd", target, isDrag);
    }
}
```

## <a id="toc-scalable"></a>Scalable
<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/scalable.gif"></a>

**Scalable** indicates whether the target's x and y can be scale of transform.

### Events
* [onScaleStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragStart): When the scale starts, the scaleStart event is called.
* [onScale](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:drag): When scaling, the scale event is called.
* [onScaleEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragEnd): When the scale finishes, the scaleEnd event is called.

### Options
* [throttleScale](https://daybrush.com/moveable/release/latest/doc/Moveable.html#throttleScale): throttle of scaleX, scaleY when scale. (default: 0)
* [keepRatio](https://daybrush.com/moveable/release/latest/doc/Moveable.html#keepRatio): When resize or scale, keeps a ratio of the width, height. (default: false)


### Vanilla Example

```ts
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    target: document.querySelector(".target"),
    scalable: true,
    throttleScale: 0,
    keepRatio: false,
});

const frame = {
    translate: [0, 0],
    scale: [1, 1],
};
moveable.on("scaleStart", ({ set, dragStart }) => {
    set(frame.scale);

    // If a drag event has already occurred, there is no dragStart.
    dragStart && dragStart.set(frame.translate);
}).on("scale", ({ target, scale, drag }) => {
    frame.scale = scale;
    // get drag event
    frame.translate = drag.beforeTranslate;
    target.style.transform
        = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`
        + `scale(${scale[0]}, ${scale[1]})`;
}).on("scaleEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onScaleEnd", target, isDrag);
});
```

### React & Preact Example

```tsx
import Moveable from "react-moveable"; // preact-moveable

this.frame = {
    translate: [0, 0],
    scale: [1, 1],
};
<Moveable
    target={document.querySelector(".target")}
    scalable={true}
    throttleScale={0}
    keepRatio={false}
    onScaleStart={({ set, dragStart }) => {
        set(this.frame.scale);

        // If a drag event has already occurred, there is no dragStart.
        dragStart && dragStart.set(this.frame.translate);
    }}
    onScale={({ target, scale, drag }) => {
        this.frame.scale = scale;
        // get drag event
        this.frame.translate = drag.beforeTranslate;
        target.style.transform
            = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`
            + `scale(${scale[0]}, ${scale[1]})`;
    }}
    onScaleEnd={({ target, isDrag, clientX, clientY }) => {
        console.log("onScaleEnd", target, isDrag);
    }} />;
```


### Angular Example
```ts
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [scalable]="true"
    [throttleScale]="0"
    [keepRatio]="false"
    (scaleStart)="onScaleStart($event)
    (scale)="onScale($event)
    (scaleEnd)="onScaleEnd($event)
    />
`,
})
export class AppComponent {
    frame = {
        translate: [0, 0],
        scale: [1, 1],
    };
    onScaleStart({ set, dragStart }) {
        set(this.frame.scale);

        // If a drag event has already occurred, there is no dragStart.
        dragStart && dragStart.set(frame.translate);
    }
    onScale({ target, scale, drag }) {
        this.frame.scale = scale;
        // get drag event
        this.frame.translate = drag.beforeTranslate;
        target.style.transform
            = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`
            + `scale(${scale[0]}, ${scale[1]})`;
    }
    onScaleEnd({ target, isDrag, clientX, clientY }) {
        console.log("onScaleEnd", target, isDrag);
    }
}
```

## <a id="toc-rotatable"></a>Rotatable
<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/rotatable.gif"></a>

**Rotatable** indicates whether the target can be rotated.

### Events
* [onRotateStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateStart): When the rotate starts, the rotateStart event is called.
* [onRotate](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotate): When rotating, the rotate event is called.
* [onRotateEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateEnd): When the rotate finishes, the rotateEnd event is called.

### Options
* [throttleRotate](https://daybrush.com/moveable/release/latest/doc/Moveable.html#throttleRotate): throttle of angle(degree) when rotate. (default: 0)
* [rotationPosition](https://daybrush.com/moveable/release/latest/doc/Moveable.html#rotationPosition): You can specify the position of the rotation. (default: "top")


### Vanilla Example

```ts
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    target: document.querySelector(".target"),
    rotatable: true,
    throttleRotate: 0,
    rotationPosition: "top",
});

const frame = {
    rotate: 0,
};
moveable.on("rotateStart", ({ set }) => {
    set(frame.rotate);
}).on("rotate", ({ target, beforeRotate }) => {
    frame.rotate = beforeRotate;
    target.style.transform = `rotate(${beforeRotate}deg)`;
}).on("rotateEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onRotateEnd", target, isDrag);
});
```

### React & Preact Example

```tsx
import Moveable from "react-moveable"; // preact-moveable

this.frame = {
    rotate: 0,
};
<Moveable
    target={document.querySelector(".target")}
    rotatable={true}
    throttleRotate={0}
    rotationPosition="top"
    onRotateStart={({ set }) => {
        set(this.frame.rotate);
    }}
    onRotate={({ target, beforeRotate }) => {
        this.frame.rotate = beforeRotate;
        target.style.transform = `rotate(${beforeRotate}deg)`;
    }}
    onRotateEnd={({ target, isDrag, clientX, clientY }) => {
        console.log("onRotateEnd", target, isDrag);
    }} />;
```

### Angular Example
```ts
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [rotatable]="true"
    [throttleRotate]="0"
    rotationPosition="top"
    (rotateStart)="onRotateStart($event)
    (rotate)="onRotate($event)
    (rotateEnd)="onRotateEnd($event)
    />
`,
})
export class AppComponent {
    frame = {
        rotate: 0,
    };
    onRotateStart({ set }) {
        set(this.frame.rotate);
    }
    onRotate({ target, beforeRotate }) {
        this.frame.rotate = beforeRotate;
        target.style.transform = `rotate(${beforeRotate}deg)`;
    }
    onRotateEnd({ target, isDrag, clientX, clientY }) {
        console.log("onRotateEnd", target, isDrag);
    }
}
```


## <a id="toc-warpable"></a>Warpable

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/warpable.gif"></a>


**Warpable** indicates whether the target can be warped(distorted, bented).

### Events
* [onWarpStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:warpStart): When the warp starts, the warpStart event is called.
* [onWarp](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:warp): When warping, the warp event is called.
* [onWarpEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:warpEnd): When the warp finishes, the warpEnd event is called.

### Vanilla Example


```ts
import Moveable from "moveable";

const moveable = new Moveable(document.body, {
    target: document.querySelector(".target"),
    warpable: true,
});

let warpMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
];

moveable.on("warpStart", ({ set }) => {
    set(warpMatrix);
}).on("warp", ({ target, matrix, transform }) => {
    warpMatrix = matrix;

    // target.style.transform = transform;
    target.style.transform = `matrix3d(${matrix.join(",")})`;
}).on("warpEnd", ({ target, isDrag, clientX, clientY }) => {
    console.log("onWarpEnd", target, isDrag);
});
```

### React & Preact Example

```tsx
import Moveable from "react-moveable"; // preact-moveable

this.warpMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
];
<Moveable
    target={document.querySelector(".target")}
    warpable={true}
    onWarpStart={({ set }) => {
        set(this.matrix);
    }}
    onWarp={({ target, matrix, transform }) => {
        warpMatrix = matrix;

        // target.style.transform = transform;
        target.style.transform = `matrix3d(${matrix.join(",")})`;
    }}
    onWarpEnd={({ target, isDrag, clientX, clientY }) => {
        console.log("onWarpEnd", target, isDrag);
    }} />;
```

### Angular Example
```ts
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [warpable]="true"
    (warpStart)="onWarpStart($event)
    (warp)="onWarp($event)
    (warpEnd)="onWarpEnd($event)
    />
`,
})
export class AppComponent {
    warpMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
    onWarpStart({ set }) {
        set(this.matrix);
    }
    onWarp({ target, matrix, transform }) {
        warpMatrix = matrix;

        // target.style.transform = transform;
        target.style.transform = `matrix3d(${matrix.join(",")})`;
    }
    onWarpEnd({ target, isDrag, clientX, clientY }) {
        console.log("onWarpEnd", target, isDrag);
    }
}
```

## <a id="toc-pinchable"></a>Pinchable

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/pinchable.gif"></a>

**Pinchable** indicates whether the target can be pinched with draggable, resizable, scalable, rotatable.

### Events
* [onPinchStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:pinchStart): When the pinch starts, the pinchStart event is called with part of scaleStart, rotateStart, resizeStart
* [onPinch](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:pinch): When pinching, the pinch event is called with part of scale, rotate, resize
* [onPinchEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:pinchEnd): When the pinch finishes, the pinchEnd event is called.

### Options
* [pinchThreshold](https://daybrush.com/moveable/release/latest/doc/Moveable.html#pinchThreshold): Minimum distance to pinch. (default: 20)
### Vanilla Example

```ts
const moveable = new Moveable(document.body, {
    target: document.querySelector(".target"),
    pinchable: true,
    draggable: true,
    resizable: true,
    pinchThreshold: 20,
});
```

### React & Preact Example

```tsx
import Moveable from "react-moveable"; // preact-moveable

<Moveable
    target={document.querySelector(".target")}
    pinchable={true}
    draggable={true}
    resizable={true
    pinchThreshold={20} />
```


### Angular Example
```ts
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [pinchable]="true"
    [draggable]="true"
    [resizable]="true"
    [pinchThreshold]="20"

    />
`,
})
export class AppComponent {

}
```

## <a id="toc-snappable"></a>Snappable(Guidelines & Boundaries)

<p align="center"><img src="https://raw.githubusercontent.com/daybrush/moveable/master/demo/images/snappable.gif"></a>

**Snappable** indicates whether to snap to the guidelines.

### Options
* [bounds](https://daybrush.com/moveable/release/latest/doc/Moveable.html#bounds): You can set up boundaries. (default: null)
* [snapThreshold](https://daybrush.com/moveable/release/latest/doc/Moveable.html#snapThreshold): Distance value that can snap to guidelines. (default: 0)
* [snapCenter](https://daybrush.com/moveable/release/latest/doc/Moveable.html#snapCenter): When you drag, make the snap in the center of the target. (default: false)
* [horizontalGuidelines](https://daybrush.com/moveable/release/latest/doc/Moveable.html#horizontalGuidlines): Add guidelines in the horizontal direction. (default: [])
* [verticalGuidelines](https://daybrush.com/moveable/release/latest/doc/Moveable.html#verticalGuidlines): Add guidelines in the vertical direction. (default: [])


![](../demo/images/guidelines.png)

* [elementGuidelines](https://daybrush.com/moveable/release/latest/doc/Moveable.html#elementGuidelines)
Add guidelines for the element.

![](../demo/images/element_guidelines.png)


### Vanilla Example

```ts
const moveable = new Moveable(document.body, {
    target: document.querySelector(".target"),
    snappable: true,
    snapThreshold: 5,
    bounds: { left: 0, top: 0, bottom: 1000, right: 1000 },
    verticalGuidelines: [100, 200, 300],
    horizontalGuidelines: [0, 100, 200],
    elementGuidelines: [document.querySelector(".element")],
});
```

### React & Preact Example

```tsx
import Moveable from "react-moveable"; // preact-moveable

<Moveable
    target={document.querySelector(".target")}
    snappable={true}
    snapThreshold={5}
    bounds={{ left: 0, top: 0, bottom: 1000, right: 1000 }}
    verticalGuidelines={[100, 200, 300]}
    horizontalGuidelines={[0, 100, 200]}
    elementGuidelines={[document.querySelector(".element")]} />
```


### Angular Example
```ts
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div #target class="target">target</div>
<ngx-moveable
    [target]="target"
    [snappable]="true"
    [bounds]="bounds"
    [verticalGuidelines]="verticalGuidelines"
    [horizontalGuidelines]="horizontalGuidelines"
    [elementGuidelines]="elementGuidelines"
    />
`,
})
export class AppComponent {
    bounds = { left: 0, top: 0, bottom: 1000, right: 1000 };
    verticalGuidelines = [100, 200, 300];
    horizontalGuidelines = [0, 100, 200];
    elementGuidelines = [document.querySelector(".element")];
}
```


# <a id="toc-group"></a> How to use Group

**Groupable** indicates Whether the targets can be moved in group with draggable, resizable, scalable, rotatable.

If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).

When using group, event name changes. (ex: dragStart => dragGroupStart, pinchStart => pinchGroupStart)

The drag event always occurs with the group event.(Resizable, Scalable, Rotatable)

In a group, Pinchable and Snappable are the same as they used to be. But warpable is not available.

## How to use Group with ables
* [**draggable**](#toc-group-draggable)
* [**resizable**](#toc-group-resizable)
* [**scalable**](#toc-group-scalable)
* [**rotatable**](#toc-group-rotatable)

## <a id="toc-group-draggable"></a>Group with Draggable

### Events
* [onDragGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroupStart): When the group drag starts, the `dragGroupStart` event is called.
* [onDragGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroup): When the group drag, the `dragGroup` event is called.
* [onDragGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:dragGroupEnd): When the group drag finishes, the `dragGroupEnd` event is called.


### Vanilla Example

```ts
import Moveable from "moveable";

const targets = [].slice.call(document.querySelectorAll(".target"));
const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: targets,
    draggable: true,
});

const frames = targets.map(() => ({
    translate: [0, 0],
}));
moveable.on("draGroupStart", ({ events }) => {
    events.forEach((ev, i) => {
        const frame = frames[i];
        ev.set(frame.translate);
    });
}).on("dragGroup", ({ targets, events }) => {
    events.forEach(({ target, beforeTranslate }, i) => {
        const frame = frames[i];

        frame.translate = beforeTranslate;
        target.style.transform
            = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
    });
}).on("dragGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onDragGroupEnd", targets, isDrag);
});
```

### React & Preact Example


```tsx
import Moveable from "react-moveable"; // preact-moveable

this.targets = [].slice.call(document.querySelectorAll(".target"));
this.frames = targets.map(() => ({
    translate: [0, 0],
}));

<Moveable
    target={this.targets}
    draggable={true}
    onDragGroupStart={({ events }) => {
        events.forEach((ev, i) => {
            const frame = this.frames[i];
            ev.set(frame.translate);
        });
    }}
    onDragGroup={({ targets, events }) => {
        events.forEach(({ target, beforeTranslate }, i) => {
            const frame = this.frames[i];

            frame.translate = beforeTranslate;
            target.style.transform
                = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        });
    }}
    onDragGroupEnd={({ targets, isDrag, clientX, clientY }) => {
        console.log("onDragGroupEnd", targets, isDrag);
    }} />
```


### Angular Example
```ts
import { OnInit } from "@angular/core";
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div class="target target1">target1</div>
<div class="target target2">target2</div>
<div class="target target3">target3</div>
<ngx-moveable
    [target]="targets"
    [draggable]="true"
    (onDragGroupStart)="onDragGroupStart($event)"
    (onDragGroup)="onDragGroup($event)"
    (onDragGroupEnd)="onDragGroupEnd($event)"
    />
`,
})
export class AppComponent implements OnInit {
    targets = [];
    frames = [];
    ngOnInit() {
        this.targets = [].slice.call(document.querySelectorAll(".target"));
        this.frames = targets.map(() => ({
            translate: [0, 0],
        }));
    }
    onDragGroupStart({ events }) {
        events.forEach((ev, i) => {
            const frame = this.frames[i];
            ev.set(frame.translate);
        });
    }
    onDragGroup({ targets, events }) {
        events.forEach(({ target, beforeTranslate }, i) => {
            const frame = this.frames[i];

            frame.translate = beforeTranslate;
            target.style.transform
                = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        });
    }
    onDragGroupEnd({ targets, isDrag, clientX, clientY }) {
        console.log("onDragGroupEnd", targets, isDrag);
    }
}
```


## <a id="toc-group-resizable"></a>Group with Resizable
### Events
* [onReiszeGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroupStart): When the group resize starts, the `resizeGroupStart` event is called.
* [onResizeGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroup): When the group resize, the `resizeGroup` event is called.
* [onResizeGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:resizeGroupEnd): When the group resize finishes, the `resizeGroupEnd` event is called.

### Vanilla Example
```ts
import Moveable from "moveable";

const targets = [].slice.call(document.querySelectorAll(".target"));
const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: targets,
    resizable: true,
});

const frames = targets.map(() => ({
    translate: [0, 0],
}));
moveable.on("resizeGroupStart", ({ events }) => {
    events.forEach((ev, i) => {
        const frame = frames[i];

        // Set origin if transform-orgin use %.
        ev.setOrigin(["%", "%"]);

        // If cssSize and offsetSize are different, set cssSize.
        const style = window.getComputedStyle(ev.target);
        const cssWidth = parseFloat(style.width);
        const cssHeight = parseFloat(style.height);
        ev.set([cssWidth, cssHeight]);

        // If a drag event has already occurred, there is no dragStart.
        ev.dragStart && ev.dragStart.set(frame.translate);
    });
}).on("resizeGroup", ({ events }) => {
    events.forEach(({ target, width, height, drag }, i) => {
        const frame = frames[i];

        target.style.width = `${width}px`;
        target.style.height = `${height}px`;

        // get drag event
        frame.translate = drag.beforeTranslate;
        target.style.transform
            = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
    });
}).on("resizeGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onResizeGroupEnd", targets, isDrag);
});
```

### React & Preact Example


```tsx
import Moveable from "react-moveable"; // preact-moveable

this.targets = [].slice.call(document.querySelectorAll(".target"));
this.frames = targets.map(() => ({
    translate: [0, 0],
}));

<Moveable
    target={this.targets}
    resizable={true}
    onResizeGroupStart={({ events }) => {
        events.forEach((ev, i) => {
            const frame = this.frames[i];

            // Set origin if transform-orgin use %.
            ev.setOrigin(["%", "%"]);

            // If cssSize and offsetSize are different, set cssSize.
            const style = window.getComputedStyle(ev.target);
            const cssWidth = parseFloat(style.width);
            const cssHeight = parseFloat(style.height);
            ev.set([cssWidth, cssHeight]);

            // If a drag event has already occurred, there is no dragStart.
            ev.dragStart && ev.dragStart.set(frame.translate);
        });
    }}
    onResizeGroup={({ events }) => {
        events.forEach(({ target, width, height, drag }, i) => {
            const frame = this.frames[i];

            target.style.width = `${width}px`;
            target.style.height = `${height}px`;

            // get drag event
            frame.translate = drag.beforeTranslate;
            target.style.transform
                = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
        });
    }}
    onResizeGroupEnd={({ targets, isDrag, clientX, clientY }) => {
        console.log("onResizeGroupEnd", targets, isDrag);
    }} />
```


### Angular Example
```ts
import { OnInit } from "@angular/core";
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div class="target target1">target1</div>
<div class="target target2">target2</div>
<div class="target target3">target3</div>
<ngx-moveable
    [target]="targets"
    [resizable]="true"
    (onResizeGroupStart)="onResizeGroupStart($event)"
    (onResizeGroup)="onResizeGroup($event)"
    (onResizeGroupEnd)="onResizeGroupEnd($event)"
    />
`,
})
export class AppComponent implements OnInit {
    targets = [];
    frames = [];
    ngOnInit() {
        this.targets = [].slice.call(document.querySelectorAll(".target"));
        this.frames = targets.map(() => ({
            translate: [0, 0],
        }));
    }
    onResizeGroupStart({ events }) {
        events.forEach((ev, i) => {
            const frame = this.frames[i];

            // Set origin if transform-orgin use %.
            ev.setOrigin(["%", "%"]);

            // If cssSize and offsetSize are different, set cssSize.
            const style = window.getComputedStyle(ev.target);
            const cssWidth = parseFloat(style.width);
            const cssHeight = parseFloat(style.height);
            ev.set([cssWidth, cssHeight]);

            // If a drag event has already occurred, there is no dragStart.
            ev.dragStart && ev.dragStart.set(frame.translate);
        });
    }
    onResizeGroup({ events }) {
        events.forEach(({ target, width, height, drag }, i) => {
            const frame = this.frames[i];

            target.style.width = `${width}px`;
            target.style.height = `${height}px`;

            // get drag event
            frame.translate = drag.beforeTranslate;
            target.style.transform
                = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
        });
    }
    onResizeGroupEnd({ targets, isDrag, clientX, clientY }) {
        console.log("onResizeGroupEnd", targets, isDrag);
    }
}
```


## <a id="toc-group-scalable"></a>Group with Scalable

### Events
* [onScaleGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroupStart)
* [onScaleGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroup)
* [onScaleGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:scaleGroupEnd)


### Vanilla Example
```ts
import Moveable from "moveable";

const targets = [].slice.call(document.querySelectorAll(".target"));
const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: targets,
    scalable: true,
});

const frames = targets.map(() => ({
    translate: [0, 0],
    scale: [1, 1],
}));
moveable.on("scaleGroupStart", ({ events }) => {
    events.forEach((ev, i) => {
        const frame = frames[i];

        ev.set(frame.scale);
        // If a drag event has already occurred, there is no dragStart.
        ev.dragStart && ev.dragStart.set(frame.translate);
    });
}).on("scaleGroup", ({ events }) => {
    events.forEach(({ target, scale, drag }, i) => {
        const frame = frames[i];

        frame.scale = scale;

        // get drag event
        frame.translate = drag.beforeTranslate;
        target.style.transform
            = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) `
            + `scale(${scale[0]}, ${scale[1]})`;
    });
}).on("scaleGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onScaleGroupEnd", targets, isDrag);
});
```

### React & Preact Example


```tsx
import Moveable from "react-moveable"; // preact-moveable

this.targets = [].slice.call(document.querySelectorAll(".target"));
this.frames = targets.map(() => ({
    translate: [0, 0],
    scale: [1, 1],
}));

<Moveable
    target={this.targets}
    scalable={true}
    onScaleGroupStart={({ events }) => {
        events.forEach((ev, i) => {
            const frame = this.frames[i];

            ev.set(frame.scale);
            // If a drag event has already occurred, there is no dragStart.
            ev.dragStart && ev.dragStart.set(frame.translate);
        });
    }}
    onScaleGroup={({ events }) => {
        events.forEach(({ target, scale, drag }, i) => {
            const frame = this.frames[i];

            frame.scale = scale;

            // get drag event
            frame.translate = drag.beforeTranslate;
            target.style.transform
                = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) `
                + `scale(${scale[0]}, ${scale[1]})`;
        });
    }}
    onScaleGroupEnd={({ targets, isDrag, clientX, clientY }) => {
        console.log("onScaleGroupEnd", targets, isDrag);
    }} />
```


### Angular Example
```ts
import { OnInit } from "@angular/core";
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div class="target target1">target1</div>
<div class="target target2">target2</div>
<div class="target target3">target3</div>
<ngx-moveable
    [target]="targets"
    [scalable]="true"
    (onScaleGroupStart)="onScaleGroupStart($event)"
    (onScaleGroup)="onScaleGroup($event)"
    (onScaleGroupEnd)="onScaleGroupEnd($event)"
    />
`,
})
export class AppComponent implements OnInit {
    targets = [];
    frames = [];
    ngOnInit() {
        this.targets = [].slice.call(document.querySelectorAll(".target"));
        this.frames = targets.map(() => ({
            translate: [0, 0],
            scale: [1, 1],
        }));
    }
    onScaleGroupStart({ events }) {
        events.forEach((ev, i) => {
            const frame = this.frames[i];

            ev.set(frame.scale);
            // If a drag event has already occurred, there is no dragStart.
            ev.dragStart && ev.dragStart.set(frame.translate);
        });
    }
    onScaleGroup({ events }) {
        events.forEach(({ target, scale, drag }, i) => {
            const frame = this.frames[i];

            frame.scale = scale;

            // get drag event
            frame.translate = drag.beforeTranslate;
            target.style.transform
                = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) `
                + `scale(${scale[0]}, ${scale[1]})`;
        });
    }
    onScaleGroupEnd({ targets, isDrag, clientX, clientY }) {
        console.log("onScaleGroupEnd", targets, isDrag);
    }
}
```


## <a id="toc-group-rotatable"></a>Group with Rotatable
### Events
* [onRotateGroupStart](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroupStart)
* [onRotateGroup](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroup)
* [onRotateGroupEnd](https://daybrush.com/moveable/release/latest/doc/Moveable.html#.event:rotateGroupEnd)


### Vanilla Example
```ts
import Moveable from "moveable";

const targets = [].slice.call(document.querySelectorAll(".target"));
const moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: targets,
    rotatable: true,
});

const frames = targets.map(() => ({
    translate: [0, 0],
    rotate: 0,
}));
moveable.on("rotateGroupStart", ({ events }) => {
    events.forEach((ev, i) => {
        const frame = frames[i];

        ev.set(frame.rotate);
        // If a drag event has already occurred, there is no dragStart.
        ev.dragStart && ev.dragStart.set(frame.translate);
    });
}).on("rotateGroup", ({ events }) => {
    events.forEach(({ target, beforeRotate, drag }, i) => {
        const frame = frames[i];

        frame.rotate = beforeRotate;

        // get drag event
        frame.translate = drag.beforeTranslate;
        target.style.transform
            = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) `
            + `rotate(${beforeRotate}deg)`;
    });
}).on("rotateGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
    console.log("onRotateGroupEnd", targets, isDrag);
});
```

### React & Preact Example


```tsx
import Moveable from "react-moveable"; // preact-moveable

this.targets = [].slice.call(document.querySelectorAll(".target"));
this.frames = targets.map(() => ({
    translate: [0, 0],
    rotate: 0,
}));

<Moveable
    target={this.targets}
    rotatable={true}
    onRotateGroupStart={({ events }) => {
        events.forEach((ev, i) => {
            const frame = this.frames[i];

            ev.set(frame.rotate);
            // If a drag event has already occurred, there is no dragStart.
            ev.dragStart && ev.dragStart.set(frame.translate);
        });
    }}
    onRotateGroup={({ events }) => {
        events.forEach(({ target, beforeRotate, drag }, i) => {
            const frame = this.frames[i];

            frame.rotate = beforeRotate;

            // get drag event
            frame.translate = drag.beforeTranslate;
            target.style.transform
                = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) `
                + `rotate(${beforeRotate}deg)`;
        });
    }}
    onRotateGroupEnd={({ targets, isDrag, clientX, clientY }) => {
        console.log("onRotateGroupEnd", targets, isDrag);
    }} />
```


### Angular Example
```ts
import { OnInit } from "@angular/core";
import {
    NgxMoveableModule,
    NgxMoveableComponent,
} from "ngx-moveable";

@Component({
    selector: 'AppComponent',
    template: `
<div class="target target1">target1</div>
<div class="target target2">target2</div>
<div class="target target3">target3</div>
<ngx-moveable
    [target]="targets"
    [rotatable]="true"
    (onRotateGroupStart)="onRotateGroupStart($event)"
    (onRotateGroup)="onRotateGroup($event)"
    (onRotateroupEnd)="onRotateGroupEnd($event)"
    />
`,
})
export class AppComponent implements OnInit {
    targets = [];
    frames = [];
    ngOnInit() {
        this.targets = [].slice.call(document.querySelectorAll(".target"));
        this.frames = targets.map(() => ({
            translate: [0, 0],
            rotate: 0,
        }));
    }
    onRotateGroupStart({ events }) => {
        events.forEach((ev, i) => {
            const frame = this.frames[i];

            ev.set(frame.rotate);
            // If a drag event has already occurred, there is no dragStart.
            ev.dragStart && ev.dragStart.set(frame.translate);
        });
    }
    onRotateGroup({ events }) {
        events.forEach(({ target, beforeRotate, drag }, i) => {
            const frame = this.frames[i];

            frame.rotate = beforeRotate;

            // get drag event
            frame.translate = drag.beforeTranslate;
            target.style.transform
                = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) `
                + `rotate(${beforeRotate}deg)`;
        });
    }
    onRotateGroupEnd({ targets, isDrag, clientX, clientY }) {
        console.log("onRotateGroupEnd", targets, isDrag);
    }
}
```

# <a id="toc-custom-css"></a>✨ How to use custom CSS

If you want to custom CSS, use **`!important`**.

```css
.moveable-control {
    width: 20px!important;
    height: 20px!important;
    margin-top: -10px!important;
    margin-left: -10px!important;
}
```

## moveable-line

```css
.moveable-line {
    position: absolute;
    width: 1px;
    height: 1px;
    background: #4af;
    transform-origin: 0px 0.5px;
}
```

![](../demo/images/line.png)


```css
.moveable-line.moveable-rotation-line {
    height: 40px;
    width: 1px;
    transform-origin: 0.5px 39.5px;
}
```
## moveable-control

```css
.moveable-control {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-sizing: border-box;
    background: #4af;
    margin-top: -7px;
    margin-left: -7px;
    z-index: 10;
}
```

![](../demo/images/control.png)

## moveable-rotataion

```css
/* moveable-rotation */
.moveable-line.moveable-rotation-line .moveable-control {
    border-color: #4af;
    background:#fff;
    cursor: alias;
}
```

## moveable-origin
```css
.moveable-control.moveable-origin {
    border-color: #f55;
    background: #fff;
    width: 12px;
    height: 12px;
    margin-top: -6px;
    margin-left: -6px;
    pointer-events: none;
}
```

## moveable-direction

```css
.moveable-direction.moveable-e, .moveable-direction.moveable-w {
    cursor: ew-resize;
}
.moveable-direction.moveable-s, .moveable-direction.moveable-n {
    cursor: ns-resize;
}
.moveable-direction.moveable-nw, .moveable-direction.moveable-se, .moveable-reverse .moveable-direction.moveable-ne, .moveable-reverse .moveable-direction.moveable-sw {
    cursor: nwse-resize;
}
.moveable-direction.moveable-ne, .moveable-direction.moveable-sw, .rCSckyn7i.moveable-reverse .moveable-direction.moveable-nw, moveable-reverse .moveable-direction.moveable-se {
    cursor: nesw-resize;
}
```


## Default CSS

```css
.moveable-control-box {
	position: fixed;
	width: 0;
	height: 0;
	left: 0;
	top: 0;
	z-index: 3000;
}
.moveable-control-box .moveable-control-box{
    z-index: 0;
}
.moveable-control-box .moveable-line,
.moveable-control-box .moveable-control{
	left: 0;
	top: 0;
}
.moveable-control-box .moveable-control{
	position: absolute;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border: 2px solid #fff;
	box-sizing: border-box;
	background: #4af;
	margin-top: -7px;
    margin-left: -7px;
    z-index: 10;
}
.moveable-control-box .moveable-line{
	position: absolute;
	width: 1px;
	height: 1px;
	background: #4af;
	transform-origin: 0px 0.5px;
}
.moveable-control-box .moveable-line.moveable-rotation-line{
	height: 40px;
	width: 1px;
	transform-origin: 0.5px 39.5px;
}
.moveable-control-box .moveable-line.moveable-rotation-line .moveable-control{
	border-color: #4af;
	background:#fff;
	cursor: alias;
}
.moveable-control-box .moveable-line.moveable-vertical.moveable-bold{
    width: 2px;
    margin-left: -1px;
}
.moveable-control-box .moveable-line.moveable-horizontal.moveable-bold{
    height: 2px;
    margin-top: -1px;
}
.moveable-control-box .moveable-control.moveable-origin{
	border-color: #f55;
	background: #fff;
	width: 12px;
	height: 12px;
	margin-top: -6px;
	margin-left: -6px;
	pointer-events: none;
}
.moveable-control-box .moveable-direction.moveable-e,
.moveable-control-box .moveable-direction.moveable-w{
	cursor: ew-resize;
}
.moveable-control-box .moveable-direction.moveable-s,
.moveable-control-box .moveable-direction.moveable-n{
	cursor: ns-resize;
}
.moveable-control-box .moveable-direction.moveable-nw,
.moveable-control-box .moveable-direction.moveable-se, .rCSw4d7my.moveable-reverse .moveable-direction.moveable-ne, .rCSw4d7my.moveable-reverse .moveable-direction.moveable-sw{
	cursor: nwse-resize;
}
.moveable-control-box .moveable-direction.moveable-ne,
.moveable-control-box .moveable-direction.moveable-sw, .rCSw4d7my.moveable-reverse .moveable-direction.moveable-nw, .rCSw4d7my.moveable-reverse .moveable-direction.moveable-se{
	cursor: nesw-resize;
}
.moveable-control-box .moveable-group{
    z-index: -1;
}
.moveable-control-box .moveable-area{
    position: absolute;
}
.moveable-control-box .moveable-area.moveable-avoid,
.moveable-control-box .moveable-area.moveable-avoid:before,
.moveable-control-box .moveable-area.moveable-avoid:after{
    transform-origin: 50% calc(100% + 20px);
}
.moveable-control-box .moveable-area.moveable-avoid:before,
.moveable-control-box .moveable-area.moveable-avoid:after{
    content: "";
    top: 0px;
    left: 0px;
    position: absolute;
    width: 100%;
    height: 100%;
}
.moveable-control-box .moveable-area.moveable-avoid:before{
    transform: rotate(120deg);
}
.moveable-control-box .moveable-area.moveable-avoid:after{
    transform: rotate(-120deg);
}


```
