/*
Copyright (c) 2019 Daybrush
name: moveable
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/moveable.git
version: 0.26.0
*/
import { ref, Properties } from 'framework-utils';
import { createPortal, createElement, Component, render } from 'react-simple-compat';
import Moveable$1, { MOVEABLE_PROPS, MOVEABLE_METHODS, MOVEABLE_EVENTS, MOVEABLE_PROPS_MAP, getElementInfo as getElementInfo$1, makeAble as makeAble$1 } from 'react-compat-moveable';
import { isObject, findIndex, camelize, isArray } from '@daybrush/utils';

/*! *****************************************************************************
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
    return createPortal(createElement(Moveable$1, __assign({
      ref: ref(this, "moveable")
    }, this.state)), this.state.parentElement);
  };

  return InnerMoveable;
}(Component);

var PROPERTIES = MOVEABLE_PROPS;
var METHODS = MOVEABLE_METHODS;
var EVENTS = MOVEABLE_EVENTS;
var PROPS_MAP = MOVEABLE_PROPS_MAP;

/*
Copyright (c) 2019 Daybrush
name: @scena/event-emitter
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/gesture.git
version: 1.0.3
*/

/*! *****************************************************************************
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
var __assign$1 = function () {
  __assign$1 = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign$1.apply(this, arguments);
};
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

/**
 * Implement EventEmitter on object or component.
 */

var EventEmitter =
/*#__PURE__*/
function () {
  function EventEmitter() {
    this._events = {};
  }
  /**
   * Add a listener to the registered event.
   * @param - Name of the event to be added
   * @param - listener function of the event to be added
   * @example
   * import EventEmitter from "@scena/event-emitter";
   * cosnt emitter = new EventEmitter();
   *
   * // Add listener in "a" event
   * emitter.on("a", () => {
   * });
   * // Add listeners
   * emitter.on({
   *  a: () => {},
   *  b: () => {},
   * });
   */


  var __proto = EventEmitter.prototype;

  __proto.on = function (eventName, listener) {
    if (isObject(eventName)) {
      for (var name in eventName) {
        this.on(name, eventName[name]);
      }
    } else {
      this._addEvent(eventName, listener, {});
    }

    return this;
  };
  /**
   * Remove listeners registered in the event target.
   * @param - Name of the event to be removed
   * @param - listener function of the event to be removed
   * @example
   * import EventEmitter from "@scena/event-emitter";
   * cosnt emitter = new EventEmitter();
   *
   * // Remove all listeners.
   * emitter.off();
   *
   * // Remove all listeners in "A" event.
   * emitter.off("a");
   *
   *
   * // Remove "listener" listener in "a" event.
   * emitter.off("a", listener);
   */


  __proto.off = function (eventName, listener) {
    if (!eventName) {
      this._events = {};
    } else if (isObject(eventName)) {
      for (var name in eventName) {
        this.off(name);
      }
    } else if (!listener) {
      this._events[eventName] = [];
    } else {
      var events = this._events[eventName];

      if (events) {
        var index = findIndex(events, function (e) {
          return e.listener === listener;
        });

        if (index > -1) {
          events.splice(index, 1);
        }
      }
    }

    return this;
  };
  /**
   * Add a disposable listener and Use promise to the registered event.
   * @param - Name of the event to be added
   * @param - disposable listener function of the event to be added
   * @example
   * import EventEmitter from "@scena/event-emitter";
   * cosnt emitter = new EventEmitter();
   *
   * // Add a disposable listener in "a" event
   * emitter.once("a", () => {
   * });
   *
   * // Use Promise
   * emitter.once("a").then(e => {
   * });
   */


  __proto.once = function (eventName, listener) {
    var _this = this;

    if (listener) {
      this._addEvent(eventName, listener, {
        once: true
      });
    }

    return new Promise(function (resolve) {
      _this._addEvent(eventName, resolve, {
        once: true
      });
    });
  };
  /**
   * Fires an event to call listeners.
   * @param - Event name
   * @param - Event parameter
   * @return If false, stop the event.
   * @example
   *
   * import EventEmitter from "@scena/event-emitter";
   *
   *
   * const emitter = new EventEmitter();
   *
   * emitter.on("a", e => {
   * });
   *
   *
   * emitter.emit("a", {
   *   a: 1,
   * });
   */


  __proto.emit = function (eventName, param) {
    var _this = this;

    if (param === void 0) {
      param = {};
    }

    var events = this._events[eventName];

    if (!eventName || !events) {
      return true;
    }

    var isStop = false;
    param.eventType = eventName;

    param.stop = function () {
      isStop = true;
    };

    param.currentTarget = this;

    __spreadArrays(events).forEach(function (info) {
      info.listener(param);

      if (info.once) {
        _this.off(eventName, info.listener);
      }
    });

    return !isStop;
  };
  /**
   * Fires an event to call listeners.
   * @param - Event name
   * @param - Event parameter
   * @return If false, stop the event.
   * @example
   *
   * import EventEmitter from "@scena/event-emitter";
   *
   *
   * const emitter = new EventEmitter();
   *
   * emitter.on("a", e => {
   * });
   *
   *
   * emitter.emit("a", {
   *   a: 1,
   * });
   */

  /**
  * Fires an event to call listeners.
  * @param - Event name
  * @param - Event parameter
  * @return If false, stop the event.
  * @example
  *
  * import EventEmitter from "@scena/event-emitter";
  *
  *
  * const emitter = new EventEmitter();
  *
  * emitter.on("a", e => {
  * });
  *
  * // emit
  * emitter.trigger("a", {
  *   a: 1,
  * });
  */


  __proto.trigger = function (eventName, param) {
    if (param === void 0) {
      param = {};
    }

    return this.emit(eventName, param);
  };

  __proto._addEvent = function (eventName, listener, options) {
    var events = this._events;
    events[eventName] = events[eventName] || [];
    var listeners = events[eventName];
    listeners.push(__assign$1({
      listener: listener
    }, options));
  };

  return EventEmitter;
}();

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

    _this.tempElement = document.createElement("div");

    var nextOptions = __assign({
      container: parentElement || document.body
    }, options);

    var events = {};
    EVENTS.forEach(function (name) {
      events[camelize("on " + name)] = function (e) {
        return _this.trigger(name, e);
      };
    });
    render(createElement(InnerMoveable, __assign({
      ref: ref(_this, "innerMoveable"),
      parentElement: parentElement
    }, nextOptions, events)), _this.tempElement);
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

  __proto.destroy = function () {
    render(null, this.tempElement);
    this.off();
    this.tempElement = null;
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

export default Moveable;
export { EVENTS, METHODS, PROPERTIES, PROPS_MAP, getElementInfo, makeAble };
//# sourceMappingURL=moveable.esm.js.map
