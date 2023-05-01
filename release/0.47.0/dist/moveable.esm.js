/*
Copyright (c) 2019 Daybrush
name: moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/moveable
version: 0.47.0
*/
import { ref, Properties } from 'framework-utils';
import * as React from 'croact';
import { renderSelf } from 'croact';
import Moveable$1, { MOVEABLE_PROPS, MOVEABLE_METHODS, MOVEABLE_EVENTS, getElementInfo as getElementInfo$1, makeAble as makeAble$1 } from 'croact-moveable';
import { camelize, isArray } from '@daybrush/utils';
import EventEmitter from '@scena/event-emitter';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
    return React.createElement(Moveable$1, __assign({
      ref: ref(this, "moveable")
    }, this.state));
  };

  return InnerMoveable;
}(React.Component);

var PROPERTIES = MOVEABLE_PROPS;
var METHODS = MOVEABLE_METHODS;
var EVENTS = MOVEABLE_EVENTS;

/**
 * Moveable is Draggable! Resizable! Scalable! Rotatable!
 * @sort 1
 * @alias Moveable
 * @extends EventEmitter
 */

var MoveableManager =
/*#__PURE__*/
function (_super) {
  __extends(MoveableManager, _super);
  /**
   *
   */


  function MoveableManager(parentElement, options) {
    if (options === void 0) {
      options = {};
    }

    var _this = _super.call(this) || this;

    _this.containerProvider = null;
    _this.selfElement = null;
    _this._warp = false;

    var nextOptions = __assign({}, options);

    var events = {};
    EVENTS.forEach(function (name) {
      events[camelize("on ".concat(name))] = function (e) {
        return _this.trigger(name, e);
      };
    });
    var selfElement;

    if (options.warpSelf) {
      delete options.warpSelf;
      _this._warp = true;
      selfElement = parentElement;
    } else {
      selfElement = document.createElement("div");
      parentElement.appendChild(selfElement);
    }

    _this.containerProvider = renderSelf(React.createElement(InnerMoveable, __assign({
      ref: ref(_this, "innerMoveable")
    }, nextOptions, events)), selfElement);
    var target = nextOptions.target;

    if (isArray(target) && target.length > 1) {
      _this.updateRect();
    }

    return _this;
  }

  var __proto = MoveableManager.prototype;

  __proto.setState = function (state, callback) {
    this.innerMoveable.setState(state, callback);
  };

  __proto.forceUpdate = function (callback) {
    this.innerMoveable.forceUpdate(callback);
  };

  __proto.dragStart = function (e) {
    var innerMoveable = this.innerMoveable;

    if (innerMoveable.$_timer) {
      this.forceUpdate();
    }

    this.getMoveable().dragStart(e);
  };

  __proto.destroy = function () {
    var _a;

    var selfElement = this.selfElement;
    renderSelf(null, selfElement, this.containerProvider);

    if (!this._warp) {
      (_a = selfElement === null || selfElement === void 0 ? void 0 : selfElement.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(selfElement);
    }

    this.containerProvider = null;
    this.off();
    this.selfElement = null;
    this.innerMoveable = null;
  };

  __proto.getMoveable = function () {
    return this.innerMoveable.moveable;
  };

  MoveableManager = __decorate([Properties(METHODS, function (prototype, property) {
    if (prototype[property]) {
      return;
    }

    prototype[property] = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      var self = this.getMoveable();

      if (!self || !self[property]) {
        return;
      }

      return self[property].apply(self, args);
    };
  }), Properties(PROPERTIES, function (prototype, property) {
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
  })], MoveableManager);
  return MoveableManager;
}(EventEmitter);

var Moveable =
/*#__PURE__*/
function (_super) {
  __extends(Moveable, _super);

  function Moveable() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return Moveable;
}(MoveableManager);

function getElementInfo(target, container, rootContainer) {
  return getElementInfo$1(target, container, rootContainer);
}
function makeAble(name, able) {
  return makeAble$1(name, able);
}

export { EVENTS, METHODS, PROPERTIES, Moveable as default, getElementInfo, makeAble };
//# sourceMappingURL=moveable.esm.js.map
