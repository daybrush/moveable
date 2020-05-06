# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.17.5] - 2020-05-07
* `moveable` 0.17.5
* `react-moveable` 0.20.6
* `preact-moveable` 0.19.6
* `ngx-moveable` 0.13.6
* `svelte-moveable` 0.8.6

### Fixed
* Fix client position #220
* Caculate min, max size for Resizable #231

## [0.17.4] - 2020-05-05
* `moveable` 0.17.4
* `react-moveable` 0.20.5
* `preact-moveable` 0.19.5
* `ngx-moveable` 0.13.5
* `svelte-moveable` 0.8.5

### Fixed
* Fix that getElement() is not a function #228

## [0.17.3] - 2020-05-05
* `moveable` 0.17.3
* `react-moveable` 0.20.4
* `preact-moveable` 0.19.4
* `ngx-moveable` 0.13.4
* `svelte-moveable` 0.8.4

### Fixed
* Fix duplicated drag are and padding area.
* Fix that click event is not fired. #228

## [0.17.2] - 2020-05-03
* `moveable` 0.17.2
* `react-moveable` 0.20.3
* `preact-moveable` 0.19.3
* `ngx-moveable` 0.13.2
* `svelte-moveable` 0.8.2

### Fixed
* Fix padding's background color
* Fix first rendering issue

## [0.17.1] - 2020-05-03
* `moveable` 0.17.1
* `react-moveable` 0.20.1
* `preact-moveable` 0.19.1
* `ngx-moveable` 0.13.1
* `svelte-moveable` 0.8.1

### Added
* Add `padding`, `dragTarget` props #148 #127 #156 #217
* Add `snapDistFormat` props #222 #209 #229
* Add `pinchOutside` props  #139
* Add `hitTest` method #226

### Fixed
* Error: @Output click not initialized in 'NgxMoveableComponent' #228
* In main demo, if the keyboard arrow is held down, drag feature eventually breaks #225
* Moveable.request does not work in groupable #220
* Element Guidelines when parent is scaled #219


## [0.16.3] - 2020-04-04
* `moveable` 0.16.3
* `react-moveable` 0.19.2
* `preact-moveable` 0.18.2
* `ngx-moveable` 0.12.2
* `svelte-moveable` 0.7.2

### Fixed
* isPinch is undefined during onDrag (when actually pinching on mobile) #212, #213
* Pinch Central Problem #139


## [0.16.2] - 2020-04-01
* `moveable` 0.16.2
* `react-moveable` 0.19.1
* `preact-moveable` 0.18.1
* `ngx-moveable` 0.12.1
* `svelte-moveable` 0.7.1

### Fixed
* Fix SVG Firefox Issue #211
* when isDisplaySnapDigit={false} the number is displayed but set to 0 #200


## [0.16.1] - 2020-03-31
* `moveable` 0.16.1
* `react-moveable` 0.19.0
* `preact-moveable` 0.18.0
* `ngx-moveable` 0.12.0
* `svelte-moveable` 0.7.0

### Added
* Add `snapGap` props #200
* Add `onSnap` event #204
* Add `triggerAblesSimultaneously` props #207
* Add `isDragging` method

### Fixed
* scrollGroup is not working #208
* Race condition when react-moveable is unmounted bug #197
* Resizing diagonal corners didn't snap.

## [0.15.2] - 2020-03-05
* `moveable` 0.15.2
* `react-moveable` 0.18.1
* `preact-moveable` 0.17.1
* `ngx-moveable` 0.11.1
* `svelte-moveable` 0.6.1


### Fixed
* Fix rootContainer for 2d transform #137

## [0.15.1] - 2020-03-05
https://github.com/daybrush/moveable/milestone/8

* `moveable` 0.15.1
* `react-moveable` 0.18.0
* `preact-moveable` 0.17.0
* `ngx-moveable` 0.11.0
* `svelte-moveable` 0.6.0

### Added
* Support `scrollable`, `onScroll` for resizable, scalable #180
* Add `zoom` props #158
* Add `rootContainer` props with Absolute Container Matrix(SVG, elementGuidelines is not supported) #137 #163
* Add `snapDigit` props #173
* Add `isDisplaySnapDigit` props #186
* Add `innerBounds` props #172
* Add `request` method (Draggable, Resizable, Rotatable, Scalable) #141

### Fixed
* Fix Portal issue #187

## [0.14.1] - 2020-02-05
* `moveable` 0.14.1
* `ngx-moveable` 0.10.1
* `svelte-moveable` 0.5.1

### Fixed
* Update `react-simple-compat` 0.1.2.
* When I set the property target of moveable to array, it will not work！ #171

## [0.14.0] - 2020-02-03
* `moveable` 0.14.0
* `react-moveable` 0.17.0
* `preact-moveable` 0.16.0
* `ngx-moveable` 0.10.0
* `svelte-moveable` 0.5.0

### Added
* Add `throttleDragRotate` #145
* Support for displaying snap distances in elementGuidelines #142
* Support bounds for a rotated system #106 #163

### Fixed
* Change `preact` to `react-simple-compat` #129
* Change Rotation handle CSS #167
* Fixed an issue where the origin was reset when the `resizable` option was toggled #168
* Change the scrollable behavior to `@scnea/dragscroll`

## [0.13.4] - 2020-01-12
* `moveable` 0.13.4
* `react-moveable` 0.16.6
* `preact-moveable` 0.15.5
* `ngx-moveable` 0.9.4
* `svelte-moveable` 0.4.4

### Fixed
* Fixed that control points rotation is wrong bug #151
* Fixed that Scrollable isn't working. (wrong caculation) #150
* Fixed that Crash of ngx-moveable when using --prod on angular bug #129

## [0.13.3] - 2019-12-30
* `moveable` 0.13.3
* `react-moveable` 0.16.4
* `preact-moveable` 0.15.3
* `ngx-moveable` 0.9.3
* `svelte-moveable` 0.4.3

### Fixed
* Fixed the problem that resize and scale occur simultaneously
* Change CSS Module (css-styler => css-styled)
* Update @moveable/matrix #128

## [0.13.2] - 2019-12-26
* `moveable` 0.13.2
* `react-moveable` 0.16.3
* `preact-moveable` 0.15.2
* `ngx-moveable` 0.9.2
* `svelte-moveable` 0.4.2

### Fixed
* Fixed error that warp event does not occur in warpable.
* Fixed minor differences in Snappable #121
* Fixed a problem where the scale of a group was only keepRatio. #124
* Fixed pinchable not working.
* Fixed snappable not working. #127
* Update @moveable/matrix #128

## [0.13.1] - 2019-12-13
### Fixed
* Fix Snappable for dymaic guidelines (vertical, horizontal) #119
* Element snaps with elementGuideline and verticalGuideline at the same posiiton #121

## [0.13.0] - 2019-12-12
* `moveable` 0.13.0
* `react-moveable` 0.16.1
* `preact-moveable` 0.15.0
* `ngx-moveable` 0.9.0
* `svelte-movable` 0.4.0

### Added
* Add `snapVertical`, `snapHorizontal`, `snapElement` props. #119
* Add `set` method on rotateGroup event. #107
* Add dashed line in element guidelines. #120

### Fixed
* moveable-control is abnormally rotated. #115
* Element snaps with elementGuideline and verticalGuideline at the same posiiton #121
* Huge width value on resizing rotated element on guidelines #122
* Weird snapping with rotated groupables #112
* Input box failed to get focus #110
* Snappable with Scalable does not work. #108

## [0.12.0] - 2019-11-28
### Added
* Add `defaultGroupRotate` props. #102

### Fixed
* Fix that `clickGroup` does not trigger after rotating #103
* Fix that at certain angles, moveable-control handle gets cut #104
* Fix that Element "sliding" when resizing #104

## [0.11.1] - 2019-11-23
### Fixed
* Fix Resizable's base direction caculation

## [0.11.0] - 2019-11-23
### Added
* Add `baseDirection` props.
* Add `offsetWidth`, `offsetHeight` in `getRect`'s method return value. #99

### Fixed
* Fix Resizable's wrong position calculation #99
* Fixed the problem that resize can't snap


## [0.10.8] - 2019-11-21
### Fixed
* Fix Resizable's wrong position calculation
* Fixes incorrect import issue in Preact.


## [0.10.5] - 2019-11-15
### Fixed
* Fixed calculation of client, offset position considering borderWidth.
* Fixed zero scale


## [0.10.4] - 2019-11-15
### Fixed
* Fixes incorrect calculation when parent element is static in safari.

## [0.10.2] - 2019-11-12
### Fixed
* Fix that scale or resize with `keepRatio`, snap is wrong.

## [0.10.1] - 2019-11-12
### Fixed
* Fix that guidelines do not appear when dragging.

## [0.10.0] - 2019-11-09
### Added
* Add `scrollable` props. #39
    * Add `onScroll`, `onScrollGroup` event
    * Add `scrollContainer` props
    * Add `getScrollPosition` props
* Add `currentTarget` and `inputEvent` on all events #74 #86
* Add `setState` method #82
* Add `getRect` method #71
* Add `renderDirection` props #63
* Add `className` props #53 #63
* Add `onClick` event
* Add `onRenderStart`, `onRender`, `onRenderEnd` events #52
* Add `onRenderGroupStart`, `onRenderGroup`, `onRenderGroupEnd` events #52
* Add `warp` in top, right, bottom and left directions.

### Fixed
* Fix target's boundingRect matrix caculation with scroll position
* Fix problem where the ratio is not maintained with keepRatio #70
* Fix that `el is undefined` #73
* Fix `dragArea`'s caculation
* Fix that `dragStart` method is not work with group
* Fix that `clickGroup` event occurs when `dragStart` a mousedown target
* Fix that Moveable is deleted when a single target is changed to multiple targets

## [0.9.8] - 2019-10-26
### Fixed
* Fix that miscaculate static parent's offset position
* Fix dragArea's transformOrigin

## [0.9.7] - 2019-10-16
### Fixed
* Fix typo that `elemenGuildelines` to `elementGuidelines` #62


## [0.9.6] - 2019-10-14
### Fixed
* Update PreactX
* fix that setState is not a function #56

## [0.9.5] - 2019-10-02
### Fixed
* fix that parent drag event occur snap.

## [0.9.4] - 2019-10-02
### Fixed
* fix that resizing north, west direction occur decimal point issue.
* Disable pinchable with snappable.
* Fix offset caculation for Webkit

## [0.9.3] - 2019-10-01
### Fixed
* fix that keepRatio want to behave like sketches and illustrators. #47
* fix keepRatio default false


## [0.9.2] - 2019-10-01
### Fixed
* fix that bounds don't apply when snap

## [0.9.1] - 2019-09-30
### Fixed
* remove console.log

## [0.9.0] - 2019-09-29
### Added
* Add Snappable (Drag, Resize, Scale, Warp) (#6)
* Add `horizontalGuidelines` & `verticalGuidelines` & `elementGuidelines` (#6)
* Add `bounds` option (boundaries) (#23, #24)
* Add `rotationPositoin` option for rotation handle position (#40)
* Add `dragArea` option (#38)
* Add `dragStart` event on `resizeStart`, `scaleStart`. (#9)
* Add `drag` event on `resize`, `scale`. (#9)
* Add `set` parameter function on `warpStart`.


### Fixed
* north and west controls want to behave like photoshop (#9)
* Fix offset caculation for Webkit


## [0.8.0] - 2019-08-28
### Added
- Add `pinchThreshold` option that set minimum distance to pinch easily.
- Add `events` parameter for all `groupStart` event. (such as `onDragGroupStart`, `onScaleGroupStart`, ...etc)
- Add `clickGroup` event to find clicked target in the group
- Add `set` event method for all `start` event for absolute value. (such as `onDragStart`, `onScaleStart`, ...etc) #16
- Add `dragStart` method for external mouse, touch event.
- Add `isInside` method that the coordinates are inside Moveable


### Fixed
- Update @daybrush/drag@0.9.1
- Fix the way dist is used in `onScale` event

## [0.7.5] - 2019-08-24
### Fixed
- Update @daybrush/drag@0.8.2

## [0.7.4] - 2019-08-24
### Fixed
- Fix that pinch does not occur when pressed at the same time.
- Fix that scrolls and drags occur simultaneously and racks occur. #27
- Fix that mis-calculating when a static element is a parent.1 #28
- Fix that destroy() error #30

## [0.7.3] - 2019-08-23
### Fixed
- Fix infinite loop issue.

## [0.7.2] - 2019-08-21
### Fixed
- Remove react types.

## [0.7.1] - 2019-08-20
### Fixed
- Remove unnecessary code.

## [0.7.0] - 2019-08-20
### Added
- Add [Groupable](https://github.com/daybrush/moveable/blob/master/groupable.md)
- Add edge option

### Fixed
- fix that do not call `resizeEnd` #19


## [0.6.4] - 2019-08-07
### Fixed
- fix ESM config

## [0.6.3] - 2019-08-07
### Fixed
- fix missing throttleScale

## [0.6.2] - 2019-08-07
### Fixed
- Update framework-utils and It reduced sizes by 2 kb based on min file.

## [0.6.1] - 2019-08-06
### Fixed
- fix destroy method for property release issue. #18

## [0.6.0] - 2019-08-06
### Added
- Support SVG Elements #13
- Support SVG Transform Origin in Safari, iOS #13
- Add datas parameter to send data #12
- Add pinchable option and events #11

### Fixed
* The default value of `container` option is fixed to `parentElement`.
* Fix Rotatable for distorted axis.

## [0.5.0] - 2019-07-31
### Added
- Add destroy method. #14

### Fixed
- Fix that the getter method gets incorrect values.

## [0.4.1] - 2019-07-29
### Fixed
- Fix that the `warpEnd` event didn't call

## [0.4.0] - 2019-07-29
### Added
- Add Warpable and option, events
- Support SVG Offset (Only SVG Tag)
- Support 3d transform(matrix) (`perspective` is not yet supported.)

### Fixed
- Fix right mouse click issue #7
- Synchronize target's shape. (Previously, it worked independently of target's shape.)
