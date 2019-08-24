# 🎉 How to use custom CSS

If you want to custom CSS, use **`!important`**.

```css
.moveable-control {
    width: 20px!important;
    height: 20px!important;
    margin-top: -10px!important;
    margin-left: -10px!important;
}
```

## Classes used in moveable
### moveable-line

```css
.moveable-line {
    position: absolute;
    width: 1px;
    height: 1px;
    background: #4af;
    transform-origin: 0px 0.5px;
}
```

![](./demo/images/line.png)


```css
.moveable-line.moveable-rotation-line {
    height: 40px;
    width: 1px;
    transform-origin: 0.5px 39.5px;
}
```
### moveable-control

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

![](./demo/images/control.png)

#### moveable-rotataion

```css
/* moveable-rotation */
.moveable-line.moveable-rotation-line .moveable-control {
    border-color: #4af;
    background:#fff;
    cursor: alias;
}
```

#### moveable-origin
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

#### moveable-direction

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
.rCSckyn7i {
    position: fixed;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
    z-index: 3000;
}
.rCSckyn7i .moveable-control-box {
    z-index: 0;
}
.rCSckyn7i .moveable-line, .rCSckyn7i .moveable-control {
    left: 0;
    top: 0;
}
.rCSckyn7i .moveable-control {
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
.rCSckyn7i .moveable-line {
    position: absolute;
    width: 1px;
    height: 1px;
    background: #4af;
    transform-origin: 0px 0.5px;
}
.rCSckyn7i .moveable-line.moveable-rotation-line {
    height: 40px;
    width: 1px;
    transform-origin: 0.5px 39.5px;
}
.rCSckyn7i .moveable-line.moveable-rotation-line .moveable-control {
    border-color: #4af;
    background:#fff;
    cursor: alias;
}
.rCSckyn7i .moveable-control.moveable-origin {
    border-color: #f55;
    background: #fff;
    width: 12px;
    height: 12px;
    margin-top: -6px;
    margin-left: -6px;
    pointer-events: none;
}
.rCSckyn7i .moveable-direction.moveable-e, .rCSckyn7i .moveable-direction.moveable-w {
    cursor: ew-resize;
}
.rCSckyn7i .moveable-direction.moveable-s, .rCSckyn7i .moveable-direction.moveable-n {
    cursor: ns-resize;
}
.rCSckyn7i .moveable-direction.moveable-nw, .rCSckyn7i .moveable-direction.moveable-se, .rCSckyn7i.moveable-reverse .moveable-direction.moveable-ne, .rCSckyn7i.moveable-reverse .moveable-direction.moveable-sw {
    cursor: nwse-resize;
}
.rCSckyn7i .moveable-direction.moveable-ne, .rCSckyn7i .moveable-direction.moveable-sw, .rCSckyn7i.moveable-reverse .moveable-direction.moveable-nw, .rCSckyn7i.moveable-reverse .moveable-direction.moveable-se {
    cursor: nesw-resize;
}
.rCSckyn7i .moveable-group {
    z-index: -1;
}
```
