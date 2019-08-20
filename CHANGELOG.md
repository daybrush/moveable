# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).


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
