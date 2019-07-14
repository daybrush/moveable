/*
Copyright (c) 2019 Daybrush
name: react-moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/react-moveable
version: 0.4.2
*/
import { createElement, PureComponent } from 'react';
import { prefixCSS, prefixNames, ref } from 'framework-utils';
import { isUndefined, splitBracket, hasClass } from '@daybrush/utils';
import styler from 'react-css-styler';
import { drag } from '@daybrush/drag';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var PREFIX = "moveable-";
var MOVEABLE_CSS = prefixCSS(PREFIX, "\n{\n    position: fixed;\n    width: 0;\n    height: 0;\n    left: 0;\n    top: 0;\n    z-index: 3000;\n}\n.line, .control {\n    left: 0;\n    top: 0;\n}\n.control {\n    position: absolute;\n    width: 14px;\n    height: 14px;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    box-sizing: border-box;\n    background: #4af;\n    margin-top: -7px;\n    margin-left: -7px;\n}\n.line {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    background: #4af;\n    transform-origin: 0px 0.5px;\n}\n.line.rotation {\n    height: 40px;\n    width: 1px;\n    transform-origin: 0.5px 39.5px;\n}\n.line.rotation .control {\n    border-color: #4af;\n    background:#fff;\n    cursor: alias;\n}\n.control.e, .control.w {\n    cursor: ew-resize;\n}\n.control.s, .control.n {\n    cursor: ns-resize;\n}\n.control.nw, .control.se, :host.reverse .control.ne, :host.reverse .control.sw {\n    cursor: nwse-resize;\n}\n.control.ne, .control.sw, :host.reverse .control.nw, :host.reverse .control.se {\n    cursor: nesw-resize;\n}\n");

function prefix() {
  var classNames = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    classNames[_i] = arguments[_i];
  }

  return prefixNames.apply(void 0, [PREFIX].concat(classNames));
}
function caculate3x2(a, b) {
  // 0 2 4
  // 1 3 5
  return [a[0] * b[0] + a[2] * b[1] + a[4] * b[2], a[1] * b[0] + a[3] * b[1] + a[5] * b[2]];
}
function multiple3x2(a, b) {
  // 00 01 02
  // 10 11 12
  var a00 = a[0],
      a10 = a[1],
      a01 = a[2],
      a11 = a[3],
      a02 = a[4],
      a12 = a[5];
  var b00 = b[0],
      b10 = b[1],
      b01 = b[2],
      b11 = b[3],
      b02 = b[4],
      b12 = b[5];
  a[0] = a00 * b00 + a01 * b10;
  a[1] = a10 * b00 + a11 * b10;
  a[2] = a00 * b01 + a01 * b11;
  a[3] = a10 * b01 + a11 * b11;
  a[4] = a00 * b02 + a01 * b12 + a02 * 1;
  a[5] = a10 * b02 + a11 * b12 + a12 * 1;
  return a;
}
function invert3x2(a) {
  // 00 01 02
  // 10 11 12
  // 20 21 22
  var a00 = a[0],
      a10 = a[1],
      a01 = a[2],
      a11 = a[3],
      a02 = a[4],
      a12 = a[5];
  var a20 = 0;
  var a21 = 0;
  var a22 = 1;
  var det = a00 * a11 * a22 + a01 * a12 * a20 + a02 * a10 * a21 - a02 * a11 * a20 - a01 * a10 * a22 - a00 * a12 * a21;
  var b00 = a11 * a22 - a12 * a21;
  var b01 = a02 * a21 - a01 * a22;
  var b02 = a01 * a12 - a02 * a11;
  var b10 = a12 * a20 - a10 * a22;
  var b11 = a22 * a00 - a20 * a02;
  var b12 = a02 * a10 - a00 * a12; // const b20 = a11 * a21 - a11 * a20;
  // const b21 = a20 * a01 - a21 * a00;
  // const b22 = a00 * a11 - a01 * a10;

  a[0] = b00 / det;
  a[1] = b10 / det;
  a[2] = b01 / det;
  a[3] = b11 / det;
  a[4] = b02 / det;
  a[5] = b12 / det;
  return a;
}
function caculateMatrixStack(target) {
  var el = target;
  var matrixes = [];

  while (el) {
    var transform = window.getComputedStyle(el).transform;

    if (transform !== "none") {
      var value = splitBracket(transform).value;
      var matrix = value.split(/s*,\s*/g).map(function (v) {
        return parseFloat(v);
      });
      matrixes.push(matrix);
    } else {
      matrixes.push("none");
    }

    el = el.parentElement;
  }

  matrixes.reverse(); // 1 0 0
  // 0 1 0

  var mat = [1, 0, 0, 1, 0, 0];
  var length = matrixes.length;
  var beforeMatrix = [1, 0, 0, 1, 0, 0];
  matrixes.forEach(function (matrix, i) {
    if (length - 1 === i) {
      beforeMatrix = mat.slice();
    }

    if (matrix !== "none") {
      multiple3x2(mat, matrix);
    }
  });
  beforeMatrix[4] = 0;
  beforeMatrix[5] = 0;
  mat[4] = 0;
  mat[5] = 0;
  return [beforeMatrix, mat];
}
function caculatePosition(matrix, origin, width, height) {
  var _a = caculate3x2(matrix, [0, 0, 1]),
      x1 = _a[0],
      y1 = _a[1];

  var _b = caculate3x2(matrix, [width, 0, 1]),
      x2 = _b[0],
      y2 = _b[1];

  var _c = caculate3x2(matrix, [0, height, 1]),
      x3 = _c[0],
      y3 = _c[1];

  var _d = caculate3x2(matrix, [width, height, 1]),
      x4 = _d[0],
      y4 = _d[1];

  var _e = caculate3x2(matrix, [origin[0], origin[1], 1]),
      originX = _e[0],
      originY = _e[1];

  var minX = Math.min(x1, x2, x3, x4);
  var minY = Math.min(y1, y2, y3, y4);
  x1 = x1 - minX || 0;
  x2 = x2 - minX || 0;
  x3 = x3 - minX || 0;
  x4 = x4 - minX || 0;
  y1 = y1 - minY || 0;
  y2 = y2 - minY || 0;
  y3 = y3 - minY || 0;
  y4 = y4 - minY || 0;
  originX = originX - minX || 0;
  originY = originY - minY || 0;
  return [[originX, originY], [x1, y1], [x2, y2], [x3, y3], [x4, y4]];
}
function multipleRotationMatrix(matrix, rad) {
  var mat = matrix.slice();
  var cos = Math.cos(rad);
  var sin = Math.sin(rad);
  var rotationMatrix = [cos, sin, -sin, cos, 0, 0];
  return multiple3x2(mat, rotationMatrix);
}
function caculateRotationMatrix(matrix, rad) {
  var cos = Math.cos(rad);
  var sin = Math.sin(rad);
  var rotationMatrix = [cos, sin, -sin, cos, 0, 0];
  return caculate3x2(rotationMatrix, matrix);
}
function getRad(pos1, pos2) {
  var distX = pos2[0] - pos1[0];
  var distY = pos2[1] - pos1[1];
  var rad = Math.atan2(distY, distX);
  return rad > 0 ? rad : rad + Math.PI * 2;
}
function getLineTransform(pos1, pos2) {
  var distX = pos2[0] - pos1[0];
  var distY = pos2[1] - pos1[1];
  var width = Math.sqrt(distX * distX + distY * distY);
  var rad = getRad(pos1, pos2);
  return "translate(" + pos1[0] + "px, " + pos1[1] + "px) rotate(" + rad + "rad) scale(" + width + ", 1.2)";
}
function getControlTransform() {
  var poses = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    poses[_i] = arguments[_i];
  }

  var length = poses.length;
  var x = poses.reduce(function (prev, pos) {
    return prev + pos[0];
  }, 0) / length;
  var y = poses.reduce(function (prev, pos) {
    return prev + pos[1];
  }, 0) / length;
  return {
    transform: "translate(" + x + "px, " + y + "px)"
  };
}
function getSize(target, style, isOffset, isBoxSizing) {
  if (style === void 0) {
    style = window.getComputedStyle(target);
  }

  if (isBoxSizing === void 0) {
    isBoxSizing = isOffset || style.boxSizing === "border-box";
  }

  var width = target.offsetWidth;
  var height = target.offsetHeight;
  var hasOffset = !isUndefined(width);

  if ((isOffset || isBoxSizing) && hasOffset) {
    return [width, height];
  }

  width = target.clientWidth;
  height = target.clientHeight;

  if (isOffset || isBoxSizing) {
    var borderLeft = parseFloat(style.borderLeftWidth) || 0;
    var borderRight = parseFloat(style.borderRightWidth) || 0;
    var borderTop = parseFloat(style.borderTopWidth) || 0;
    var borderBottom = parseFloat(style.borderBottomWidth) || 0;
    return [width + borderLeft + borderRight, height + borderTop + borderBottom];
  } else {
    var paddingLeft = parseFloat(style.paddingLeft) || 0;
    var paddingRight = parseFloat(style.paddingRight) || 0;
    var paddingTop = parseFloat(style.paddingTop) || 0;
    var paddingBottom = parseFloat(style.paddingBottom) || 0;
    return [width - paddingLeft - paddingRight, height - paddingTop - paddingBottom];
  }
}
function getTargetInfo(target, container) {
  var _a, _b, _c;

  var left = 0;
  var top = 0;
  var origin = [0, 0];
  var pos1 = [0, 0];
  var pos2 = [0, 0];
  var pos3 = [0, 0];
  var pos4 = [0, 0];
  var beforeMatrix = [1, 0, 0, 1, 0, 0];
  var matrix = [1, 0, 0, 1, 0, 0];
  var width = 0;
  var height = 0;
  var transformOrigin = [0, 0];
  var direction = 1;
  var rotationPos = [0, 0];
  var rotationRad = 0;

  if (target) {
    var rect = target.getBoundingClientRect();
    var style = window.getComputedStyle(target);
    left = rect.left;
    top = rect.top;
    width = target.offsetWidth;
    height = target.offsetHeight;

    if (isUndefined(width)) {
      _a = getSize(target, style, true), width = _a[0], height = _a[1];
    }

    _b = caculateMatrixStack(target), beforeMatrix = _b[0], matrix = _b[1];
    transformOrigin = style.transformOrigin.split(" ").map(function (pos) {
      return parseFloat(pos);
    });
    _c = caculatePosition(matrix, transformOrigin, width, height), origin = _c[0], pos1 = _c[1], pos2 = _c[2], pos3 = _c[3], pos4 = _c[4];

    if (container) {
      var containerRect = container.getBoundingClientRect();
      left -= containerRect.left;
      top -= containerRect.top;
    }

    var pi = Math.PI;
    var pos1Rad = getRad(origin, pos1);
    var pos2Rad = getRad(origin, pos2); // 1 : clockwise
    // -1 : counterclockwise

    direction = pos1Rad < pos2Rad && pos2Rad - pos1Rad < pi || pos1Rad > pos2Rad && pos2Rad - pos1Rad < -pi ? 1 : -1;
    rotationRad = getRad(direction > 0 ? pos1 : pos2, direction > 0 ? pos2 : pos1);
    var relativeRotationPos = caculateRotationMatrix([0, -40, 0], rotationRad);
    rotationPos = [(pos1[0] + pos2[0]) / 2 + relativeRotationPos[0], (pos1[1] + pos2[1]) / 2 + relativeRotationPos[1]];
  }

  return {
    direction: direction,
    rotationRad: rotationRad,
    rotationPos: rotationPos,
    transform: "",
    target: target,
    left: left,
    top: top,
    pos1: pos1,
    pos2: pos2,
    pos3: pos3,
    pos4: pos4,
    width: width,
    height: height,
    beforeMatrix: beforeMatrix,
    matrix: matrix,
    origin: origin,
    transformOrigin: transformOrigin
  };
}
function getPosition(target) {
  var position = target.getAttribute("data-position");

  if (!position) {
    return;
  }

  var pos = [0, 0];
  position.indexOf("w") > -1 && (pos[0] = -1);
  position.indexOf("e") > -1 && (pos[0] = 1);
  position.indexOf("n") > -1 && (pos[1] = -1);
  position.indexOf("s") > -1 && (pos[1] = 1);
  return pos;
}

function getDraggableDragger(moveable, target) {
  return drag(target, {
    container: window,
    dragstart: function (_a) {
      var datas = _a.datas;
      var style = window.getComputedStyle(target);
      var _b = moveable.state,
          matrix = _b.matrix,
          beforeMatrix = _b.beforeMatrix;
      datas.matrix = invert3x2(matrix.slice());
      datas.beforeMatrix = invert3x2(beforeMatrix.slice());
      datas.left = parseFloat(style.left || "") || 0;
      datas.top = parseFloat(style.top || "") || 0;
      datas.bottom = parseFloat(style.bottom || "") || 0;
      datas.right = parseFloat(style.right || "") || 0;
      datas.transform = style.transform;
      datas.prevDist = [0, 0];
      datas.prevBeforeDist = [0, 0];

      if (datas.transform === "none") {
        datas.transform = "";
      }

      return moveable.props.onDragStart({
        target: target
      });
    },
    drag: function (_a) {
      var datas = _a.datas,
          distX = _a.distX,
          distY = _a.distY;
      var beforeMatrix = datas.beforeMatrix,
          matrix = datas.matrix,
          prevDist = datas.prevDist,
          prevBeforeDist = datas.prevBeforeDist;
      var beforeDist = caculate3x2(beforeMatrix, [distX, distY, 1]);
      var dist = caculate3x2(matrix, [distX, distY, 1]);
      var delta = [dist[0] - prevDist[0], dist[1] - prevDist[1]];
      var beforeDelta = [beforeDist[0] - prevBeforeDist[0], beforeDist[1] - prevBeforeDist[1]];
      datas.prevDist = dist;
      datas.prevBeforeDist = beforeDist;
      var left = datas.left + beforeDist[0];
      var top = datas.top + beforeDist[1];
      var right = datas.right - beforeDist[0];
      var bottom = datas.bottom - beforeDist[1];
      var transform = datas.transform + " translate(" + dist[0] + "px, " + dist[1] + "px)";
      moveable.props.onDrag({
        target: target,
        transform: transform,
        dist: dist,
        delta: delta,
        beforeDist: beforeDist,
        beforeDelta: beforeDelta,
        left: left,
        top: top,
        right: right,
        bottom: bottom
      });
      moveable.setState({
        transform: "translate(" + distX + "px, " + distY + "px)"
      });
    },
    dragend: function (_a) {
      var isDrag = _a.isDrag;
      moveable.props.onDragEnd({
        target: target,
        isDrag: isDrag
      });

      if (isDrag) {
        moveable.updateRect();
      }
    }
  });
}

function scaleStart(moveable, position, _a) {
  var datas = _a.datas;
  var target = moveable.props.target;

  if (!position || !target) {
    return false;
  }

  var style = window.getComputedStyle(target);
  var _b = moveable.state,
      matrix = _b.matrix,
      width = _b.width,
      height = _b.height,
      left = _b.left,
      top = _b.top,
      transformOrigin = _b.transformOrigin,
      origin = _b.origin;
  datas.matrix = invert3x2(matrix.slice());
  datas.transform = style.transform;
  datas.prevDist = [1, 1];
  datas.position = position;
  datas.width = width;
  datas.height = height;
  datas.transformOrigin = transformOrigin;
  datas.originalMatrix = matrix;
  datas.originalOrigin = origin;
  datas.left = left;
  datas.top = top;

  if (datas.transform === "none") {
    datas.transform = "";
  }

  moveable.props.onScaleStart({
    target: target
  });
}
function scale(moveable, _a) {
  var datas = _a.datas,
      distX = _a.distX,
      distY = _a.distY;
  var originalMatrix = datas.originalMatrix,
      matrix = datas.matrix,
      prevDist = datas.prevDist,
      position = datas.position,
      width = datas.width,
      height = datas.height,
      left = datas.left,
      top = datas.top,
      transformOrigin = datas.transformOrigin,
      originalOrigin = datas.originalOrigin,
      transform = datas.transform;
  var dist = caculate3x2(matrix, [distX, distY, 1]);
  var distWidth = position[0] * dist[0];
  var distHeight = position[1] * dist[1]; // diagonal

  if (position[0] && position[1]) {
    var size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
    var rad = getRad([0, 0], dist);
    var standardRad = getRad([0, 0], position);
    var distDiagonal = Math.cos(rad - standardRad) * size;
    distWidth = distDiagonal;
    distHeight = distDiagonal * height / width;
  }

  var nextWidth = width + distWidth;
  var nextHeight = height + distHeight;
  var scaleX = nextWidth / width;
  var scaleY = nextHeight / height;

  var _b = caculatePosition(multiple3x2(originalMatrix.slice(), [scaleX, 0, 0, scaleY, 0, 0]), transformOrigin, width, height),
      origin = _b[0],
      pos1 = _b[1],
      pos2 = _b[2],
      pos3 = _b[3],
      pos4 = _b[4];

  var nextLeft = left + originalOrigin[0] - origin[0];
  var nextTop = top + originalOrigin[1] - origin[1];
  datas.prevDist = [scaleX, scaleY];
  moveable.props.onScale({
    target: moveable.props.target,
    scale: [scaleX, scaleY],
    dist: [scaleX - 1, scaleY - 1],
    delta: [scaleX - prevDist[0], scaleY - prevDist[1]],
    transform: transform + " scale(" + scaleX + ", " + scaleY + ")"
  });
  moveable.setState({
    origin: origin,
    pos1: pos1,
    pos2: pos2,
    pos3: pos3,
    pos4: pos4,
    left: nextLeft,
    top: nextTop
  });
}
function scaleEnd(moveable, _a) {
  var isDrag = _a.isDrag;
  moveable.props.onScaleEnd({
    target: moveable.props.target,
    isDrag: isDrag
  });

  if (isDrag) {
    moveable.updateRect();
  }
}

function getRotateInfo(moveable, datas, clientX, clientY) {
  var startAbsoluteOrigin = datas.startAbsoluteOrigin,
      startRad = datas.startRad,
      prevRad = datas.prevRad,
      prevLoop = datas.loop,
      direction = datas.direction;
  var rad = getRad(startAbsoluteOrigin, [clientX, clientY]);

  if (prevRad > rad && prevRad > 270 && rad < 90) {
    // 360 => 0
    ++datas.loop;
  } else if (prevRad < rad && prevRad < 90 && rad > 270) {
    // 0 => 360
    --datas.loop;
  }

  var absolutePrevRad = prevLoop * 360 + prevRad;
  var absoluteRad = datas.loop * 360 + rad;
  var _a = moveable.state,
      width = _a.width,
      height = _a.height,
      transformOrigin = _a.transformOrigin,
      prevOrigin = _a.origin,
      prevLeft = _a.left,
      prevTop = _a.top;
  var matrix = multipleRotationMatrix(datas.matrix, direction * (rad - startRad));
  var prevAbsoluteOrigin = [prevLeft + prevOrigin[0], prevTop + prevOrigin[1]];

  var _b = caculatePosition(matrix, transformOrigin, width, height),
      origin = _b[0],
      pos1 = _b[1],
      pos2 = _b[2],
      pos3 = _b[3],
      pos4 = _b[4];

  var left = prevAbsoluteOrigin[0] - origin[0];
  var top = prevAbsoluteOrigin[1] - origin[1];
  datas.prevRad = rad;
  return {
    delta: direction * (absoluteRad - absolutePrevRad) / Math.PI * 180,
    dist: direction * (absolutePrevRad - startRad) / Math.PI * 180,
    origin: origin,
    pos1: pos1,
    pos2: pos2,
    pos3: pos3,
    pos4: pos4,
    matrix: matrix,
    left: left,
    top: top
  };
}

function rotateStart(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY;
  var target = moveable.props.target;

  if (!target) {
    return false;
  }

  var _b = moveable.state,
      matrix = _b.matrix,
      left = _b.left,
      top = _b.top,
      origin = _b.origin,
      rotationPos = _b.rotationPos,
      direction = _b.direction;
  datas.transform = window.getComputedStyle(target).transform;
  datas.matrix = matrix;
  datas.left = left;
  datas.top = top;
  datas.startAbsoluteOrigin = [clientX - rotationPos[0] + origin[0], clientY - rotationPos[1] + origin[1]];
  datas.prevRad = getRad(datas.startAbsoluteOrigin, [clientX, clientY]);
  datas.startRad = datas.prevRad;
  datas.loop = 0;
  datas.direction = direction;

  if (datas.transform === "none") {
    datas.transform = "";
  }

  moveable.props.onRotateStart({
    target: target
  });
}
function rotate(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY;

  var _b = getRotateInfo(moveable, datas, clientX, clientY),
      delta = _b.delta,
      dist = _b.dist,
      origin = _b.origin,
      pos1 = _b.pos1,
      pos2 = _b.pos2,
      pos3 = _b.pos3,
      pos4 = _b.pos4,
      matrix = _b.matrix,
      left = _b.left,
      top = _b.top;

  moveable.props.onRotate({
    target: moveable.props.target,
    delta: delta,
    dist: dist,
    transform: datas.transform + " rotate(" + dist + "deg)"
  });
  moveable.setState({
    origin: origin,
    pos1: pos1,
    pos2: pos2,
    pos3: pos3,
    pos4: pos4,
    matrix: matrix,
    left: left,
    top: top
  });
}
function rotateEnd(moveable, _a) {
  var isDrag = _a.isDrag;
  moveable.props.onRotateEnd({
    target: moveable.props.target,
    isDrag: isDrag
  });

  if (isDrag) {
    moveable.updateRect();
  }
}

function resizeStart(moveable, position, _a) {
  var datas = _a.datas;
  var target = moveable.props.target;

  if (!target || !position) {
    return false;
  }

  var beforeMatrix = moveable.state.beforeMatrix;

  var _b = getSize(target),
      width = _b[0],
      height = _b[1];

  datas.matrix = invert3x2(beforeMatrix.slice());
  datas.position = position;
  datas.width = width;
  datas.height = height;
  datas.prevWidth = 0;
  datas.prevHeight = 0;
  moveable.props.onResizeStart({
    target: target
  });
}
function resize(moveable, _a) {
  var datas = _a.datas,
      distX = _a.distX,
      distY = _a.distY;
  var matrix = datas.matrix,
      position = datas.position,
      width = datas.width,
      height = datas.height,
      prevWidth = datas.prevWidth,
      prevHeight = datas.prevHeight;
  var dist = caculate3x2(matrix, [distX, distY, 1]);
  var distWidth = position[0] * dist[0];
  var distHeight = position[1] * dist[1]; // diagonal

  if (position[0] && position[1]) {
    var size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
    var rad = getRad([0, 0], dist);
    var standardRad = getRad([0, 0], position);
    var distDiagonal = Math.cos(rad - standardRad) * size;
    distWidth = distDiagonal;
    distHeight = distDiagonal * height / width;
  }

  var nextWidth = width + distWidth;
  var nextHeight = height + distHeight;
  datas.prevWidth = distWidth;
  datas.prevHeight = distHeight;
  moveable.props.onResize({
    target: moveable.props.target,
    width: nextWidth,
    height: nextHeight,
    dist: [distWidth, distHeight],
    delta: [distWidth - prevWidth, distHeight - prevHeight]
  });
  moveable.updateRect();
}
function resizeEnd(moveable, _a) {
  var isDrag = _a.isDrag;
  moveable.props.onScaleEnd({
    target: moveable.props.target,
    isDrag: isDrag
  });

  if (isDrag) {
    moveable.updateRect();
  }
}

function getMoveableDragger(moveable, target) {
  var type;
  return drag(target, {
    container: window,
    dragstart: function (_a) {
      var datas = _a.datas,
          inputEvent = _a.inputEvent,
          clientX = _a.clientX,
          clientY = _a.clientY;
      var inputTarget = inputEvent.target;
      type = "";

      if (!hasClass(inputTarget, prefix("control"))) {
        return false;
      }

      if (hasClass(inputTarget, prefix("rotation"))) {
        type = "rotate";
        return rotateStart(moveable, {
          datas: datas,
          clientX: clientX,
          clientY: clientY
        });
      } else if (moveable.props.scalable) {
        var position = getPosition(inputTarget);
        type = "scale";
        return scaleStart(moveable, position, {
          datas: datas
        });
      } else if (moveable.props.resizable) {
        var position = getPosition(inputTarget);
        type = "resize";
        return resizeStart(moveable, position, {
          datas: datas
        });
      } else {
        return false;
      }
    },
    drag: function (_a) {
      var datas = _a.datas,
          clientX = _a.clientX,
          clientY = _a.clientY,
          distX = _a.distX,
          distY = _a.distY;

      if (!type) {
        return;
      } else if (type === "rotate") {
        return rotate(moveable, {
          datas: datas,
          clientX: clientX,
          clientY: clientY
        });
      } else if (type === "scale") {
        return scale(moveable, {
          datas: datas,
          distX: distX,
          distY: distY
        });
      } else if (type === "resize") {
        return resize(moveable, {
          datas: datas,
          distX: distX,
          distY: distY
        });
      }
    },
    dragend: function (_a) {
      var isDrag = _a.isDrag;

      if (!type) {
        return;
      } else if (type === "rotate") {
        return rotateEnd(moveable, {
          isDrag: isDrag
        });
      } else if (type === "scale") {
        return scaleEnd(moveable, {
          isDrag: isDrag
        });
      } else if (type === "resize") {
        return resizeEnd(moveable, {
          isDrag: isDrag
        });
      }
    }
  });
}

var ControlBoxElement = styler("div", MOVEABLE_CSS);

var Moveable =
/*#__PURE__*/
function (_super) {
  __extends(Moveable, _super);

  function Moveable() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.state = {
      target: null,
      beforeMatrix: [1, 0, 0, 1, 0, 0],
      matrix: [1, 0, 0, 1, 0, 0],
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      transform: "",
      transformOrigin: [0, 0],
      direction: 1,
      rotationRad: 0,
      rotationPos: [0, 0],
      origin: [0, 0],
      pos1: [0, 0],
      pos2: [0, 0],
      pos3: [0, 0],
      pos4: [0, 0]
    };
    return _this;
  }

  var __proto = Moveable.prototype;

  __proto.isMoveableElement = function (target) {
    return target && target.className.indexOf(PREFIX) > -1;
  };

  __proto.render = function () {
    if (this.state.target !== this.props.target) {
      this.updateRect(true);
    }

    var _a = this.state,
        left = _a.left,
        top = _a.top,
        pos1 = _a.pos1,
        pos2 = _a.pos2,
        pos3 = _a.pos3,
        pos4 = _a.pos4,
        target = _a.target,
        transform = _a.transform,
        direction = _a.direction;
    return createElement(ControlBoxElement, {
      ref: ref(this, "controlBox"),
      className: prefix("control-box", direction === -1 ? "reverse" : ""),
      style: {
        position: this.props.container ? "absolute" : "fixed",
        display: target ? "block" : "none",
        transform: "translate(" + left + "px, " + top + "px) " + transform
      }
    }, createElement("div", {
      className: prefix("line"),
      style: {
        transform: getLineTransform(pos1, pos2)
      }
    }), createElement("div", {
      className: prefix("line"),
      style: {
        transform: getLineTransform(pos2, pos4)
      }
    }), createElement("div", {
      className: prefix("line"),
      style: {
        transform: getLineTransform(pos1, pos3)
      }
    }), createElement("div", {
      className: prefix("line"),
      style: {
        transform: getLineTransform(pos3, pos4)
      }
    }), this.renderRotation(direction), this.renderPosition(), this.renderOrigin());
  };

  __proto.renderRotation = function (direction) {
    if (!this.props.rotatable) {
      return null;
    }

    var _a = this.state,
        pos1 = _a.pos1,
        pos2 = _a.pos2;
    var rotationRad = getRad(direction > 0 ? pos1 : pos2, direction > 0 ? pos2 : pos1);
    return createElement("div", {
      className: prefix("line rotation"),
      style: {
        // tslint:disable-next-line: max-line-length
        transform: "translate(" + (pos1[0] + pos2[0]) / 2 + "px, " + (pos1[1] + pos2[1]) / 2 + "px) translateY(-40px) rotate(" + rotationRad + "rad)"
      }
    }, createElement("div", {
      className: prefix("control", "rotation"),
      ref: ref(this, "rotationElement")
    }));
  };

  __proto.renderOrigin = function () {
    if (!this.props.origin) {
      return null;
    }

    var origin = this.state.origin;
    return createElement("div", {
      className: prefix("control", "origin"),
      style: getControlTransform(origin)
    });
  };

  __proto.renderPosition = function () {
    if (!this.props.resizable && !this.props.scalable) {
      return null;
    }

    var _a = this.state,
        pos1 = _a.pos1,
        pos2 = _a.pos2,
        pos3 = _a.pos3,
        pos4 = _a.pos4;
    return [createElement("div", {
      className: prefix("control", "nw"),
      "data-position": "nw",
      key: "nw",
      style: getControlTransform(pos1)
    }), createElement("div", {
      className: prefix("control", "n"),
      "data-position": "n",
      key: "n",
      style: getControlTransform(pos1, pos2)
    }), createElement("div", {
      className: prefix("control", "ne"),
      "data-position": "ne",
      key: "ne",
      style: getControlTransform(pos2)
    }), createElement("div", {
      className: prefix("control", "w"),
      "data-position": "w",
      key: "w",
      style: getControlTransform(pos1, pos3)
    }), createElement("div", {
      className: prefix("control", "e"),
      "data-position": "e",
      key: "e",
      style: getControlTransform(pos2, pos4)
    }), createElement("div", {
      className: prefix("control", "sw"),
      "data-position": "sw",
      key: "sw",
      style: getControlTransform(pos3)
    }), createElement("div", {
      className: prefix("control", "s"),
      "data-position": "s",
      key: "s",
      style: getControlTransform(pos3, pos4)
    }), createElement("div", {
      className: prefix("control", "se"),
      "data-position": "se",
      key: "se",
      style: getControlTransform(pos4)
    })];
  };

  __proto.componentDidMount = function () {
    /* rotatable */

    /* resizable */

    /* scalable */
    this.moveableDragger = getMoveableDragger(this, this.controlBox.getElement());
  };

  __proto.componentWillUnmount = function () {
    if (this.draggableDragger) {
      this.draggableDragger.unset();
      this.draggableDragger = null;
    }

    if (this.moveableDragger) {
      this.moveableDragger.unset();
      this.moveableDragger = null;
    }
  };

  __proto.move = function (pos) {
    if (!pos[0] && !pos[1]) {
      return;
    }

    var _a = this.state,
        left = _a.left,
        top = _a.top;
    this.setState({
      left: left + pos[0],
      top: top + pos[1]
    });
  };

  __proto.updateRect = function (isNotSetState) {
    var target = this.props.target;
    var state = this.state;

    if (state.target !== target) {
      if (this.draggableDragger) {
        this.draggableDragger.unset();
        this.draggableDragger = null;
      }

      if (target && this.props.draggable) {
        this.draggableDragger = getDraggableDragger(this, target);
      }
    }

    var container = this.props.container;
    this.updateState(getTargetInfo(target, container), isNotSetState);
  };

  __proto.updateState = function (nextState, isNotSetState) {
    var state = this.state;

    if (isNotSetState) {
      for (var name in nextState) {
        state[name] = nextState[name];
      }
    } else {
      this.setState(nextState);
    }
  };

  Moveable.defaultProps = {
    container: null,
    rotatable: false,
    draggable: false,
    scalable: false,
    resizable: false,
    origin: true,
    onRotateStart: function () {},
    onRotate: function () {},
    onRotateEnd: function () {},
    onDragStart: function () {},
    onDrag: function () {},
    onDragEnd: function () {},
    onScaleStart: function () {},
    onScale: function () {},
    onScaleEnd: function () {},
    onResizeStart: function () {},
    onResize: function () {},
    onResizeEnd: function () {}
  };
  return Moveable;
}(PureComponent);

export default Moveable;
//# sourceMappingURL=moveable.esm.js.map
