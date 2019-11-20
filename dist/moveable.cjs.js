/*
Copyright (c) 2019 Daybrush
name: moveable
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/moveable.git
version: 0.10.8
*/
'use strict';

var EgComponent = require('@egjs/component');
var frameworkUtils = require('framework-utils');
var preact = require('preact');
var compat = require('preact/compat');
var Moveable$1 = require('preact-moveable');
var utils = require('@daybrush/utils');

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

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var InnerMoveable =
/*#__PURE__*/
function (_super) {
  __extends(InnerMoveable, _super);

  function InnerMoveable(props) {
    var _this = _super.call(this, props) || this;

    _this.state = {};
    _this.state = _this.props;
    return _this;
  }

  var __proto = InnerMoveable.prototype;

  __proto.render = function () {
    return compat.createPortal(preact.h(Moveable$1, __assign({
      ref: frameworkUtils.ref(this, "preactMoveable")
    }, this.state)), this.state.parentElement);
  };

  return InnerMoveable;
}(preact.Component);

var PROPERTIES = ["draggable", "resizable", "scalable", "rotatable", "warpable", "pinchable", "snappable", "origin", "target", "edge", "throttleDrag", "throttleResize", "throttleScale", "throttleRotate", "keepRatio", "dragArea", "pinchThreshold", "snapCenter", "snapThreshold", "horizontalGuidelines", "verticalGuidelines", "elementGuidelines", "bounds", "className", "renderDirections", "scrollable", "getScrollPosition", "scrollContainer", "scrollThreshold"];
var EVENTS = ["dragStart", "drag", "dragEnd", "resizeStart", "resize", "resizeEnd", "scaleStart", "scale", "scaleEnd", "rotateStart", "rotate", "rotateEnd", "warpStart", "warp", "warpEnd", "pinchStart", "pinch", "pinchEnd", "dragGroupStart", "dragGroup", "dragGroupEnd", "resizeGroupStart", "resizeGroup", "resizeGroupEnd", "scaleGroupStart", "scaleGroup", "scaleGroupEnd", "rotateGroupStart", "rotateGroup", "rotateGroupEnd", "pinchGroupStart", "pinchGroup", "pinchGroupEnd", "clickGroup", "scroll", "scrollGroup", "renderStart", "render", "renderEnd", "renderGroupStart", "renderGroup", "renderGroupEnd"];

/**
 * Moveable is Draggable! Resizable! Scalable! Rotatable!
 * @sort 1
 * @extends eg.Component
 */

var Moveable =
/*#__PURE__*/
function (_super) {
  __extends(Moveable, _super);
  /**
   *
   */


  function Moveable(parentElement, options) {
    if (options === void 0) {
      options = {};
    }

    var _this = _super.call(this) || this;

    _this.tempElement = document.createElement("div");

    var nextOptions = __assign({
      container: parentElement
    }, options);

    var events = {};
    EVENTS.forEach(function (name) {
      events[utils.camelize("on " + name)] = function (e) {
        return _this.trigger(name, e);
      };
    });
    preact.render(preact.h(InnerMoveable, __assign({
      ref: frameworkUtils.ref(_this, "innerMoveable"),
      parentElement: parentElement
    }, nextOptions, events)), _this.tempElement);
    var target = nextOptions.target;

    if (utils.isArray(target) && target.length > 1) {
      _this.updateRect();
    }

    return _this;
  }
  /**
   * Check if the target is an element included in the moveable.
   * @param - the target
   * @example
   * import Moveable from "moveable";
   *
   * const moveable = new Moveable(document.body);
   *
   * window.addEventListener("click", e => {
   *     if (!moveable.isMoveableElement(e.target)) {
   *         moveable.target = e.target;
   *     }
   * });
   */


  var __proto = Moveable.prototype;

  __proto.isMoveableElement = function (target) {
    return this.getMoveable().isMoveableElement(target);
  };
  /**
   * If the width, height, left, and top of all elements change, update the shape of the moveable.
   * @example
   * import Moveable from "moveable";
   *
   * const moveable = new Moveable(document.body);
   *
   * window.addEventListener("resize", e => {
   *     moveable.updateRect();
   * });
   */


  __proto.updateRect = function () {
    this.getMoveable().updateRect();
  };
  /**
   * You can drag start the Moveable through the external `MouseEvent`or `TouchEvent`. (Angular: ngDragStart)
   * @param - external `MouseEvent`or `TouchEvent`
   * @example
   * import Moveable from "moveable";
   *
   * const moveable = new Moveable(document.body);
   *
   * document.body.addEventListener("mousedown", e => {
   *     if (!moveable.isMoveableElement(e.target)) {
   *          moveable.dragStart(e);
   *     }
   * });
   */


  __proto.dragStart = function (e) {
    this.getMoveable().dragStart(e);
  };
  /**
   * Whether the coordinates are inside Moveable
   * @param - x coordinate
   * @param - y coordinate
   * @return - True if the coordinate is in moveable or false
   * @example
   * import Moveable from "moveable";
   *
   * const moveable = new Moveable(document.body);
   *
   * document.body.addEventListener("mousedown", e => {
   *     if (moveable.isInside(e.clientX, e.clientY)) {
   *          console.log("inside");
   *     }
   * });
   */


  __proto.isInside = function (clientX, clientY) {
    return this.getMoveable().isInside(clientX, clientY);
  };
  /**
   * You can get the vertex information, position and offset size information of the target based on the container.
   * @return - The Rect Info
   * @example
   * import Moveable from "moveable";
   *
   * const moveable = new Moveable(document.body);
   *
   * const rectInfo = moveable.getRect();
   */


  __proto.getRect = function () {
    return this.getMoveable().getRect();
  };
  /**
   * You can change options or properties dynamically.
   * @param - options or properties
   * @param - After the change, the callback function is executed when the update is completed.
   * @example
   * import Moveable from "moveable";
   *
   * const moveable = new Moveable(document.body);
   *
   * moveable.setState({
   *   target: document.querySelector(".target"),
   * }, () => {
   *   moveable.dragStart(e);
   * })
   */


  __proto.setState = function (state, callback) {
    this.innerMoveable.setState(state, callback);
  };
  /**
   * If the width, height, left, and top of the only target change, update the shape of the moveable.
   * @param - the values of x and y to move moveable.
   * @example
   * import Moveable from "moveable";
   *
   * const moveable = new Moveable(document.body);
   *
   * moveable.updateTarget();
   */


  __proto.updateTarget = function () {
    this.getMoveable().updateTarget();
  };
  /**
   * Remove the Moveable object and the events.
   * @example
   * import Moveable from "moveable";
   *
   * const moveable = new Moveable(document.body);
   *
   * moveable.destroy();
   */


  __proto.destroy = function () {
    preact.render("", this.tempElement);
    this.off();
    this.tempElement = null;
    this.innerMoveable = null;
  };

  __proto.getMoveable = function () {
    return this.innerMoveable.preactMoveable;
  };

  Moveable = __decorate([frameworkUtils.Properties(PROPERTIES, function (prototype, property) {
    Object.defineProperty(prototype, property, {
      get: function () {
        return this.getMoveable().props[property];
      },
      set: function (value) {
        var _a;

        this.setState((_a = {}, _a[property] = value, _a));
      },
      enumerable: true,
      configurable: true
    });
  })], Moveable);
  return Moveable;
}(EgComponent);

Moveable.PROPERTIES = PROPERTIES;
Moveable.EVENTS = EVENTS;

module.exports = Moveable;
//# sourceMappingURL=moveable.cjs.js.map
