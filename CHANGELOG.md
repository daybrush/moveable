# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
