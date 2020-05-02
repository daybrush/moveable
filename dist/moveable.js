/*
Copyright (c) 2019 Daybrush
name: moveable
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/moveable.git
version: 0.17.1
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Moveable = factory());
}(this, (function () { 'use strict';

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

    /*
    Copyright (c) 2017 NAVER Corp.
    @egjs/component project is licensed under the MIT license

    @egjs/component JavaScript library
    https://naver.github.io/egjs-component

    @version 2.1.2
    */
    /**
     * Copyright (c) 2015 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    function isUndefined(value) {
      return typeof value === "undefined";
    }
    /**
     * A class used to manage events in a component
     * @ko 컴포넌트의 이벤트을 관리할 수 있게 하는 클래스
     * @alias eg.Component
     */


    var Component =
    /*#__PURE__*/
    function () {
      var Component =
      /*#__PURE__*/
      function () {
        /**
        * Version info string
        * @ko 버전정보 문자열
        * @name VERSION
        * @static
        * @type {String}
        * @example
        * eg.Component.VERSION;  // ex) 2.0.0
        * @memberof eg.Component
        */

        /**
         * @support {"ie": "7+", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.1+ (except 3.x)"}
         */
        function Component() {
          this._eventHandler = {};
          this.options = {};
        }
        /**
         * Triggers a custom event.
         * @ko 커스텀 이벤트를 발생시킨다
         * @param {String} eventName The name of the custom event to be triggered <ko>발생할 커스텀 이벤트의 이름</ko>
         * @param {Object} customEvent Event data to be sent when triggering a custom event <ko>커스텀 이벤트가 발생할 때 전달할 데이터</ko>
         * @return {Boolean} Indicates whether the event has occurred. If the stop() method is called by a custom event handler, it will return false and prevent the event from occurring. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">Ref</a> <ko>이벤트 발생 여부. 커스텀 이벤트 핸들러에서 stop() 메서드를 호출하면 'false'를 반환하고 이벤트 발생을 중단한다. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">참고</a></ko>
         * @example
        class Some extends eg.Component {
         some(){
         	if(this.trigger("beforeHi")){ // When event call to stop return false.
        	this.trigger("hi");// fire hi event.
         	}
         }
        }
        const some = new Some();
        some.on("beforeHi", (e) => {
        if(condition){
        	e.stop(); // When event call to stop, `hi` event not call.
        }
        });
        some.on("hi", (e) => {
        // `currentTarget` is component instance.
        console.log(some === e.currentTarget); // true
        });
        // If you want to more know event design. You can see article.
        // https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F
         */


        var _proto = Component.prototype;

        _proto.trigger = function trigger(eventName, customEvent) {
          if (customEvent === void 0) {
            customEvent = {};
          }

          var handlerList = this._eventHandler[eventName] || [];
          var hasHandlerList = handlerList.length > 0;

          if (!hasHandlerList) {
            return true;
          } // If detach method call in handler in first time then handler list calls.


          handlerList = handlerList.concat();
          customEvent.eventType = eventName;
          var isCanceled = false;
          var arg = [customEvent];
          var i = 0;

          customEvent.stop = function () {
            isCanceled = true;
          };

          customEvent.currentTarget = this;

          for (var _len = arguments.length, restParam = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            restParam[_key - 2] = arguments[_key];
          }

          if (restParam.length >= 1) {
            arg = arg.concat(restParam);
          }

          for (i = 0; handlerList[i]; i++) {
            handlerList[i].apply(this, arg);
          }

          return !isCanceled;
        };
        /**
         * Executed event just one time.
         * @ko 이벤트가 한번만 실행된다.
         * @param {eventName} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
         * @param {Function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
         * @return {eg.Component} An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
         * @example
        class Some extends eg.Component {
         hi() {
           alert("hi");
         }
         thing() {
           this.once("hi", this.hi);
         }
        }
        var some = new Some();
        some.thing();
        some.trigger("hi");
        // fire alert("hi");
        some.trigger("hi");
        // Nothing happens
         */


        _proto.once = function once(eventName, handlerToAttach) {
          if (typeof eventName === "object" && isUndefined(handlerToAttach)) {
            var eventHash = eventName;
            var i;

            for (i in eventHash) {
              this.once(i, eventHash[i]);
            }

            return this;
          } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
            var self = this;
            this.on(eventName, function listener() {
              for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                arg[_key2] = arguments[_key2];
              }

              handlerToAttach.apply(self, arg);
              self.off(eventName, listener);
            });
          }

          return this;
        };
        /**
         * Checks whether an event has been attached to a component.
         * @ko 컴포넌트에 이벤트가 등록됐는지 확인한다.
         * @param {String} eventName The name of the event to be attached <ko>등록 여부를 확인할 이벤트의 이름</ko>
         * @return {Boolean} Indicates whether the event is attached. <ko>이벤트 등록 여부</ko>
         * @example
        class Some extends eg.Component {
         some() {
           this.hasOn("hi");// check hi event.
         }
        }
         */


        _proto.hasOn = function hasOn(eventName) {
          return !!this._eventHandler[eventName];
        };
        /**
         * Attaches an event to a component.
         * @ko 컴포넌트에 이벤트를 등록한다.
         * @param {eventName} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
         * @param {Function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
         * @return {eg.Component} An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
         * @example
        class Some extends eg.Component {
         hi() {
           console.log("hi");
         }
         some() {
           this.on("hi",this.hi); //attach event
         }
        }
        */


        _proto.on = function on(eventName, handlerToAttach) {
          if (typeof eventName === "object" && isUndefined(handlerToAttach)) {
            var eventHash = eventName;
            var name;

            for (name in eventHash) {
              this.on(name, eventHash[name]);
            }

            return this;
          } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
            var handlerList = this._eventHandler[eventName];

            if (isUndefined(handlerList)) {
              this._eventHandler[eventName] = [];
              handlerList = this._eventHandler[eventName];
            }

            handlerList.push(handlerToAttach);
          }

          return this;
        };
        /**
         * Detaches an event from the component.
         * @ko 컴포넌트에 등록된 이벤트를 해제한다
         * @param {eventName} eventName The name of the event to be detached <ko>해제할 이벤트의 이름</ko>
         * @param {Function} handlerToDetach The handler function of the event to be detached <ko>해제할 이벤트의 핸들러 함수</ko>
         * @return {eg.Component} An instance of a component itself <ko>컴포넌트 자신의 인스턴스</ko>
         * @example
        class Some extends eg.Component {
         hi() {
           console.log("hi");
         }
         some() {
           this.off("hi",this.hi); //detach event
         }
        }
         */


        _proto.off = function off(eventName, handlerToDetach) {
          // All event detach.
          if (isUndefined(eventName)) {
            this._eventHandler = {};
            return this;
          } // All handler of specific event detach.


          if (isUndefined(handlerToDetach)) {
            if (typeof eventName === "string") {
              this._eventHandler[eventName] = undefined;
              return this;
            } else {
              var eventHash = eventName;
              var name;

              for (name in eventHash) {
                this.off(name, eventHash[name]);
              }

              return this;
            }
          } // The handler of specific event detach.


          var handlerList = this._eventHandler[eventName];

          if (handlerList) {
            var k;
            var handlerFunction;

            for (k = 0; (handlerFunction = handlerList[k]) !== undefined; k++) {
              if (handlerFunction === handlerToDetach) {
                handlerList = handlerList.splice(k, 1);
                break;
              }
            }
          }

          return this;
        };

        return Component;
      }();

      Component.VERSION = "2.1.2";
      return Component;
    }();

    /*
    Copyright (c) 2019 Daybrush
    name: framework-utils
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/framework-utils.git
    version: 0.3.4
    */
    function prefixNames(prefix) {
      var classNames = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        classNames[_i - 1] = arguments[_i];
      }

      return classNames.map(function (className) {
        return className.split(" ").map(function (name) {
          return name ? "" + prefix + name : "";
        }).join(" ");
      }).join(" ");
    }
    function prefixCSS(prefix, css) {
      return css.replace(/([^}{]*){/mg, function (_, selector) {
        return selector.replace(/\.([^{,\s\d.]+)/g, "." + prefix + "$1") + "{";
      });
    }
    /* react */

    function ref(target, name) {
      return function (e) {
        e && (target[name] = e);
      };
    }
    function refs(target, name, i) {
      return function (e) {
        e && (target[name][i] = e);
      };
    }
    /* Class Decorator */

    function Properties(properties, action) {
      return function (component) {
        var prototype = component.prototype;
        properties.forEach(function (property) {
          action(prototype, property);
        });
      };
    }

    /*
    Copyright (c) 2019-present NAVER Corp.
    name: @egjs/list-differ
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-list-differ
    version: 1.0.0
    */
    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var PolyMap =
    /*#__PURE__*/
    function () {
      function PolyMap() {
        this.keys = [];
        this.values = [];
      }

      var __proto = PolyMap.prototype;

      __proto.get = function (key) {
        return this.values[this.keys.indexOf(key)];
      };

      __proto.set = function (key, value) {
        var keys = this.keys;
        var values = this.values;
        var prevIndex = keys.indexOf(key);
        var index = prevIndex === -1 ? keys.length : prevIndex;
        keys[index] = key;
        values[index] = value;
      };

      return PolyMap;
    }();

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var HashMap =
    /*#__PURE__*/
    function () {
      function HashMap() {
        this.object = {};
      }

      var __proto = HashMap.prototype;

      __proto.get = function (key) {
        return this.object[key];
      };

      __proto.set = function (key, value) {
        this.object[key] = value;
      };

      return HashMap;
    }();

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var SUPPORT_MAP = typeof Map === "function";

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var Link =
    /*#__PURE__*/
    function () {
      function Link() {}

      var __proto = Link.prototype;

      __proto.connect = function (prevLink, nextLink) {
        this.prev = prevLink;
        this.next = nextLink;
        prevLink && (prevLink.next = this);
        nextLink && (nextLink.prev = this);
      };

      __proto.disconnect = function () {
        // In double linked list, diconnect the interconnected relationship.
        var prevLink = this.prev;
        var nextLink = this.next;
        prevLink && (prevLink.next = nextLink);
        nextLink && (nextLink.prev = prevLink);
      };

      __proto.getIndex = function () {
        var link = this;
        var index = -1;

        while (link) {
          link = link.prev;
          ++index;
        }

        return index;
      };

      return Link;
    }();

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */

    function orderChanged(changed, fixed) {
      // It is roughly in the order of these examples.
      // 4, 6, 0, 2, 1, 3, 5, 7
      var fromLinks = []; // 0, 1, 2, 3, 4, 5, 6, 7

      var toLinks = [];
      changed.forEach(function (_a) {
        var from = _a[0],
            to = _a[1];
        var link = new Link();
        fromLinks[from] = link;
        toLinks[to] = link;
      }); // `fromLinks` are connected to each other by double linked list.

      fromLinks.forEach(function (link, i) {
        link.connect(fromLinks[i - 1]);
      });
      return changed.filter(function (_, i) {
        return !fixed[i];
      }).map(function (_a, i) {
        var from = _a[0],
            to = _a[1];

        if (from === to) {
          return [0, 0];
        }

        var fromLink = fromLinks[from];
        var toLink = toLinks[to - 1];
        var fromIndex = fromLink.getIndex(); // Disconnect the link connected to `fromLink`.

        fromLink.disconnect(); // Connect `fromLink` to the right of `toLink`.

        if (!toLink) {
          fromLink.connect(undefined, fromLinks[0]);
        } else {
          fromLink.connect(toLink, toLink.next);
        }

        var toIndex = fromLink.getIndex();
        return [fromIndex, toIndex];
      });
    }

    var Result =
    /*#__PURE__*/
    function () {
      function Result(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed) {
        this.prevList = prevList;
        this.list = list;
        this.added = added;
        this.removed = removed;
        this.changed = changed;
        this.maintained = maintained;
        this.changedBeforeAdded = changedBeforeAdded;
        this.fixed = fixed;
      }

      var __proto = Result.prototype;
      Object.defineProperty(__proto, "ordered", {
        get: function () {
          if (!this.cacheOrdered) {
            this.caculateOrdered();
          }

          return this.cacheOrdered;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "pureChanged", {
        get: function () {
          if (!this.cachePureChanged) {
            this.caculateOrdered();
          }

          return this.cachePureChanged;
        },
        enumerable: true,
        configurable: true
      });

      __proto.caculateOrdered = function () {
        var ordered = orderChanged(this.changedBeforeAdded, this.fixed);
        var changed = this.changed;
        var pureChanged = [];
        this.cacheOrdered = ordered.filter(function (_a, i) {
          var from = _a[0],
              to = _a[1];
          var _b = changed[i],
              fromBefore = _b[0],
              toBefore = _b[1];

          if (from !== to) {
            pureChanged.push([fromBefore, toBefore]);
            return true;
          }
        });
        this.cachePureChanged = pureChanged;
      };

      return Result;
    }();

    /**
     *
     * @memberof eg.ListDiffer
     * @static
     * @function
     * @param - Previous List <ko> 이전 목록 </ko>
     * @param - List to Update <ko> 업데이트 할 목록 </ko>
     * @param - This callback function returns the key of the item. <ko> 아이템의 키를 반환하는 콜백 함수입니다.</ko>
     * @return - Returns the diff between `prevList` and `list` <ko> `prevList`와 `list`의 다른 점을 반환한다.</ko>
     * @example
     * import { diff } from "@egjs/list-differ";
     * // script => eg.ListDiffer.diff
     * const result = diff([0, 1, 2, 3, 4, 5], [7, 8, 0, 4, 3, 6, 2, 1], e => e);
     * // List before update
     * // [1, 2, 3, 4, 5]
     * console.log(result.prevList);
     * // Updated list
     * // [4, 3, 6, 2, 1]
     * console.log(result.list);
     * // Index array of values added to `list`
     * // [0, 1, 5]
     * console.log(result.added);
     * // Index array of values removed in `prevList`
     * // [5]
     * console.log(result.removed);
     * // An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.changed);
     * // The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
     * // [[4, 3], [3, 4], [2, 6]]
     * console.log(result.pureChanged);
     * // An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
     * // [[4, 1], [4, 2], [4, 3]]
     * console.log(result.ordered);
     * // An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.maintained);
     */

    function diff(prevList, list, findKeyCallback) {
      var mapClass = SUPPORT_MAP ? Map : findKeyCallback ? HashMap : PolyMap;

      var callback = findKeyCallback || function (e) {
        return e;
      };

      var added = [];
      var removed = [];
      var maintained = [];
      var prevKeys = prevList.map(callback);
      var keys = list.map(callback);
      var prevKeyMap = new mapClass();
      var keyMap = new mapClass();
      var changedBeforeAdded = [];
      var fixed = [];
      var removedMap = {};
      var changed = [];
      var addedCount = 0;
      var removedCount = 0; // Add prevKeys and keys to the hashmap.

      prevKeys.forEach(function (key, prevListIndex) {
        prevKeyMap.set(key, prevListIndex);
      });
      keys.forEach(function (key, listIndex) {
        keyMap.set(key, listIndex);
      }); // Compare `prevKeys` and `keys` and add them to `removed` if they are not in `keys`.

      prevKeys.forEach(function (key, prevListIndex) {
        var listIndex = keyMap.get(key); // In prevList, but not in list, it is removed.

        if (typeof listIndex === "undefined") {
          ++removedCount;
          removed.push(prevListIndex);
        } else {
          removedMap[listIndex] = removedCount;
        }
      }); // Compare `prevKeys` and `keys` and add them to `added` if they are not in `prevKeys`.

      keys.forEach(function (key, listIndex) {
        var prevListIndex = prevKeyMap.get(key); // In list, but not in prevList, it is added.

        if (typeof prevListIndex === "undefined") {
          added.push(listIndex);
          ++addedCount;
        } else {
          maintained.push([prevListIndex, listIndex]);
          removedCount = removedMap[listIndex] || 0;
          changedBeforeAdded.push([prevListIndex - removedCount, listIndex - addedCount]);
          fixed.push(listIndex === prevListIndex);

          if (prevListIndex !== listIndex) {
            changed.push([prevListIndex, listIndex]);
          }
        }
      }); // Sort by ascending order of 'to(list's index).

      removed.reverse();
      return new Result(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed);
    }

    /**
     * A module that checks diff when values are added, removed, or changed in an array.
     * @ko 배열 또는 오브젝트에서 값이 추가되거나 삭제되거나 순서가 변경사항을 체크하는 모듈입니다.
     * @memberof eg
     */

    var ListDiffer =
    /*#__PURE__*/
    function () {
      /**
       * @param - Initializing Data Array. <ko> 초기 설정할 데이터 배열.</ko>
       * @param - This callback function returns the key of the item. <ko> 아이템의 키를 반환하는 콜백 함수입니다.</ko>
       * @example
       * import ListDiffer from "@egjs/list-differ";
       * // script => eg.ListDiffer
       * const differ = new ListDiffer([0, 1, 2, 3, 4, 5], e => e);
       * const result = differ.update([7, 8, 0, 4, 3, 6, 2, 1]);
       * // List before update
       * // [1, 2, 3, 4, 5]
       * console.log(result.prevList);
       * // Updated list
       * // [4, 3, 6, 2, 1]
       * console.log(result.list);
       * // Index array of values added to `list`.
       * // [0, 1, 5]
       * console.log(result.added);
       * // Index array of values removed in `prevList`.
       * // [5]
       * console.log(result.removed);
       * // An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`.
       * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
       * console.log(result.changed);
       * // The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
       * // [[4, 3], [3, 4], [2, 6]]
       * console.log(result.pureChanged);
       * // An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
       * // [[4, 1], [4, 2], [4, 3]]
       * console.log(result.ordered);
       * // An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved.
       * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
       * console.log(result.maintained);
       */
      function ListDiffer(list, findKeyCallback) {
        if (list === void 0) {
          list = [];
        }

        this.findKeyCallback = findKeyCallback;
        this.list = [].slice.call(list);
      }
      /**
       * Update list.
       * @ko 리스트를 업데이트를 합니다.
       * @param - List to update <ko> 업데이트할 리스트 </ko>
       * @return - Returns the results of an update from `prevList` to `list`.<ko> `prevList`에서 `list`로 업데이트한 결과를 반환한다. </ko>
       */


      var __proto = ListDiffer.prototype;

      __proto.update = function (list) {
        var newData = [].slice.call(list);
        var result = diff(this.list, newData, this.findKeyCallback);
        this.list = newData;
        return result;
      };

      return ListDiffer;
    }();

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 0.10.3
    */
    /**
    * get string "function"
    * @memberof Consts
    * @example
    import {FUNCTION} from "@daybrush/utils";

    console.log(FUNCTION); // "function"
    */

    var FUNCTION = "function";
    /**
    * get string "object"
    * @memberof Consts
    * @example
    import {OBJECT} from "@daybrush/utils";

    console.log(OBJECT); // "object"
    */

    var OBJECT = "object";
    /**
    * get string "string"
    * @memberof Consts
    * @example
    import {STRING} from "@daybrush/utils";

    console.log(STRING); // "string"
    */

    var STRING = "string";
    /**
    * get string "undefined"
    * @memberof Consts
    * @example
    import {UNDEFINED} from "@daybrush/utils";

    console.log(UNDEFINED); // "undefined"
    */

    var UNDEFINED = "undefined";
    var OPEN_CLOSED_CHARACTER = ["\"", "'", "\\\"", "\\'"];

    /**
    * @namespace
    * @name Utils
    */

    /**
     * Returns the inner product of two numbers(`a1`, `a2`) by two criteria(`b1`, `b2`).
     * @memberof Utils
     * @param - The first number
     * @param - The second number
     * @param - The first number to base on the inner product
     * @param - The second number to base on the inner product
     * @return - Returns the inner product
    import { dot } from "@daybrush/utils";

    console.log(dot(0, 15, 2, 3)); // 6
    console.log(dot(5, 15, 2, 3)); // 9
    console.log(dot(5, 15, 1, 1)); // 10
     */

    function dot(a1, a2, b1, b2) {
      return (a1 * b2 + a2 * b1) / (b1 + b2);
    }
    /**
    * Check the type that the value is undefined.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {boolean} true if the type is correct, false otherwise
    * @example
    import {isUndefined} from "@daybrush/utils";

    console.log(isUndefined(undefined)); // true
    console.log(isUndefined("")); // false
    console.log(isUndefined(1)); // false
    console.log(isUndefined(null)); // false
    */

    function isUndefined$1(value) {
      return typeof value === UNDEFINED;
    }
    /**
    * Check the type that the value is object.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isObject} from "@daybrush/utils";

    console.log(isObject({})); // true
    console.log(isObject(undefined)); // false
    console.log(isObject("")); // false
    console.log(isObject(null)); // false
    */

    function isObject(value) {
      return value && typeof value === OBJECT;
    }
    /**
    * Check the type that the value is isArray.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isArray} from "@daybrush/utils";

    console.log(isArray([])); // true
    console.log(isArray({})); // false
    console.log(isArray(undefined)); // false
    console.log(isArray(null)); // false
    */

    function isArray(value) {
      return Array.isArray(value);
    }
    /**
    * Check the type that the value is string.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isString} from "@daybrush/utils";

    console.log(isString("1234")); // true
    console.log(isString(undefined)); // false
    console.log(isString(1)); // false
    console.log(isString(null)); // false
    */

    function isString(value) {
      return typeof value === STRING;
    }
    /**
    * Check the type that the value is function.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isFunction} from "@daybrush/utils";

    console.log(isFunction(function a() {})); // true
    console.log(isFunction(() => {})); // true
    console.log(isFunction("1234")); // false
    console.log(isFunction(1)); // false
    console.log(isFunction(null)); // false
    */

    function isFunction(value) {
      return typeof value === FUNCTION;
    }

    function findClosed(closedCharacter, texts, index, length) {
      for (var i = index; i < length; ++i) {
        var character = texts[i].trim();

        if (character === closedCharacter) {
          return i;
        }

        var nextIndex = i;

        if (character === "(") {
          nextIndex = findClosed(")", texts, i + 1, length);
        } else if (OPEN_CLOSED_CHARACTER.indexOf(character) > -1) {
          nextIndex = findClosed(character, texts, i + 1, length);
        }

        if (nextIndex === -1) {
          break;
        }

        i = nextIndex;
      }

      return -1;
    }

    function splitText(text, separator) {
      var texts = text.split(/(\s*,\s*|\(|\)|"|'|\\"|\\'|\s+)/g).filter(Boolean);
      var length = texts.length;
      var values = [];
      var tempValues = [];

      for (var i = 0; i < length; ++i) {
        var character = texts[i].trim();
        var nextIndex = i;

        if (character === "(") {
          nextIndex = findClosed(")", texts, i + 1, length);
        } else if (character === ")") {
          throw new Error("invalid format");
        } else if (OPEN_CLOSED_CHARACTER.indexOf(character) > -1) {
          nextIndex = findClosed(character, texts, i + 1, length);
        } else if (character === separator) {
          if (tempValues.length) {
            values.push(tempValues.join(""));
            tempValues = [];
          }

          continue;
        }

        if (nextIndex === -1) {
          nextIndex = length - 1;
        }

        tempValues.push(texts.slice(i, nextIndex + 1).join(""));
        i = nextIndex;
      }

      if (tempValues.length) {
        values.push(tempValues.join(""));
      }

      return values;
    }
    /**
    * divide text by comma.
    * @memberof Utils
    * @param {string} text - text to divide
    * @return {Array} divided texts
    * @example
    import {splitComma} from "@daybrush/utils";

    console.log(splitComma("a,b,c,d,e,f,g"));
    // ["a", "b", "c", "d", "e", "f", "g"]
    console.log(splitComma("'a,b',c,'d,e',f,g"));
    // ["'a,b'", "c", "'d,e'", "f", "g"]
    */

    function splitComma(text) {
      // divide comma(,)
      // "[^"]*"|'[^']*'
      return splitText(text, ",");
    }
    /**
    * divide text by bracket "(", ")".
    * @memberof Utils
    * @param {string} text - text to divide
    * @return {object} divided texts
    * @example
    import {splitBracket} from "@daybrush/utils";

    console.log(splitBracket("a(1, 2)"));
    // {prefix: "a", value: "1, 2", suffix: ""}
    console.log(splitBracket("a(1, 2)b"));
    // {prefix: "a", value: "1, 2", suffix: "b"}
    */

    function splitBracket(text) {
      var matches = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(text);

      if (!matches || matches.length < 4) {
        return {};
      } else {
        return {
          prefix: matches[1],
          value: matches[2],
          suffix: matches[3]
        };
      }
    }
    /**
    * divide text by number and unit.
    * @memberof Utils
    * @param {string} text - text to divide
    * @return {} divided texts
    * @example
    import {splitUnit} from "@daybrush/utils";

    console.log(splitUnit("10px"));
    // {prefix: "", value: 10, unit: "px"}
    console.log(splitUnit("-10px"));
    // {prefix: "", value: -10, unit: "px"}
    console.log(splitUnit("a10%"));
    // {prefix: "a", value: 10, unit: "%"}
    */

    function splitUnit(text) {
      var matches = /^([^\d|e|\-|\+]*)((?:\d|\.|-|e-|e\+)+)(\S*)$/g.exec(text);

      if (!matches) {
        return {
          prefix: "",
          unit: "",
          value: NaN
        };
      }

      var prefix = matches[1];
      var value = matches[2];
      var unit = matches[3];
      return {
        prefix: prefix,
        unit: unit,
        value: parseFloat(value)
      };
    }
    /**
    * transform strings to camel-case
    * @memberof Utils
    * @param {String} text - string
    * @return {String} camel-case string
    * @example
    import {camelize} from "@daybrush/utils";

    console.log(camelize("transform-origin")); // transformOrigin
    console.log(camelize("abcd_efg")); // abcdEfg
    console.log(camelize("abcd efg")); // abcdEfg
    */

    function camelize(str) {
      return str.replace(/[\s-_]([a-z])/g, function (all, letter) {
        return letter.toUpperCase();
      });
    }
    /**
    * Date.now() method
    * @memberof CrossBrowser
    * @return {number} milliseconds
    * @example
    import {now} from "@daybrush/utils";

    console.log(now()); // 12121324241(milliseconds)
    */

    function now() {
      return Date.now ? Date.now() : new Date().getTime();
    }
    /**
    * Returns the index of the first element in the array that satisfies the provided testing function.
    * @function
    * @memberof CrossBrowser
    * @param - The array `findIndex` was called upon.
    * @param - A function to execute on each value in the array until the function returns true, indicating that the satisfying element was found.
    * @param - Returns defaultIndex if not found by the function.
    * @example
    import { findIndex } from "@daybrush/utils";

    findIndex([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // 1
    */

    function findIndex(arr, callback, defaultIndex) {
      if (defaultIndex === void 0) {
        defaultIndex = -1;
      }

      var length = arr.length;

      for (var i = 0; i < length; ++i) {
        if (callback(arr[i], i, arr)) {
          return i;
        }
      }

      return defaultIndex;
    }
    /**
    * Returns the value of the first element in the array that satisfies the provided testing function.
    * @function
    * @memberof CrossBrowser
    * @param - The array `find` was called upon.
    * @param - A function to execute on each value in the array,
    * @param - Returns defalutValue if not found by the function.
    * @example
    import { find } from "@daybrush/utils";

    find([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // {a: 2}
    */

    function find(arr, callback, defalutValue) {
      var index = findIndex(arr, callback);
      return index > -1 ? arr[index] : defalutValue;
    }
    /**
    * Checks if the specified class value exists in the element's class attribute.
    * @memberof DOM
    * @param element - target
    * @param className - the class name to search
    * @return {boolean} return false if the class is not found.
    * @example
    import {hasClass} from "@daybrush/utils";

    console.log(hasClass(element, "start")); // true or false
    */

    function hasClass(element, className) {
      if (element.classList) {
        return element.classList.contains(className);
      }

      return !!element.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
    }
    /**
    * Add the specified class value. If these classe already exist in the element's class attribute they are ignored.
    * @memberof DOM
    * @param element - target
    * @param className - the class name to add
    * @example
    import {addClass} from "@daybrush/utils";

    addClass(element, "start");
    */

    function addClass(element, className) {
      if (element.classList) {
        element.classList.add(className);
      } else {
        element.className += " " + className;
      }
    }
    /**
    * Removes the specified class value.
    * @memberof DOM
    * @param element - target
    * @param className - the class name to remove
    * @example
    import {removeClass} from "@daybrush/utils";

    removeClass(element, "start");
    */

    function removeClass(element, className) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
        element.className = element.className.replace(reg, " ");
      }
    }
    /**
    * Sets up a function that will be called whenever the specified event is delivered to the target
    * @memberof DOM
    * @param - event target
    * @param - A case-sensitive string representing the event type to listen for.
    * @param - The object which receives a notification (an object that implements the Event interface) when an event of the specified type occurs
    * @param - An options object that specifies characteristics about the event listener. The available options are:
    * @example
    import {addEvent} from "@daybrush/utils";

    addEvent(el, "click", e => {
      console.log(e);
    });
    */

    function addEvent(el, type, listener, options) {
      el.addEventListener(type, listener, options);
    }
    /**
    * removes from the EventTarget an event listener previously registered with EventTarget.addEventListener()
    * @memberof DOM
    * @param - event target
    * @param - A case-sensitive string representing the event type to listen for.
    * @param - The EventListener function of the event handler to remove from the event target.
    * @example
    import {addEvent, removeEvent} from "@daybrush/utils";
    const listener = e => {
      console.log(e);
    };
    addEvent(el, "click", listener);
    removeEvent(el, "click", listener);
    */

    function removeEvent(el, type, listener) {
      el.removeEventListener(type, listener);
    }

    /*
    Copyright (c) Daybrush
    name: react-simple-compat
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/react-simple-compat.git
    version: 0.1.4
    */

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
    var extendStatics$1 = function (d, b) {
      extendStatics$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
      extendStatics$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
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
    function __rest(s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }
    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

      return r;
    }

    function isDiff(a, b) {
      if (a === b) {
        return false;
      }

      for (var i in a) {
        if (!(i in b)) {
          return true;
        }
      }

      for (var i in b) {
        if (a[i] !== b[i]) {
          return true;
        }
      }

      return false;
    }

    function diffObject(a, b) {
      var keys1 = Object.keys(a);
      var keys2 = Object.keys(b);
      var result = diff(keys1, keys2, function (key) {
        return key;
      });
      var added = {};
      var removed = {};
      var changed = {};
      result.added.forEach(function (index) {
        var name = keys2[index];
        added[name] = b[name];
      });
      result.removed.forEach(function (index) {
        var name = keys1[index];
        removed[name] = a[name];
      });
      result.maintained.forEach(function (_a) {
        var index = _a[0];
        var name = keys1[index];
        var values = [a[name], b[name]];

        if (a[name] !== b[name]) {
          changed[name] = values;
        }
      });
      return {
        added: added,
        removed: removed,
        changed: changed
      };
    }

    function executeHooks(hooks) {
      hooks.forEach(function (hook) {
        hook();
      });
    }

    function fillKeys(keys) {
      var index = 0;
      return keys.map(function (key) {
        return key == null ? "$compat" + ++index : "" + key;
      });
    }

    function createProvider(el, key, index, container) {
      if (isString(el)) {
        return new TextProvider("text_" + el, key, index, container, null, {});
      }

      var providerClass = typeof el.type === "string" ? ElementProvider : el.type.prototype.render ? ComponentProvider : FunctionProvider;
      return new providerClass(el.type, key, index, container, el.ref, el.props);
    }

    function flat(arr) {
      var arr2 = [];
      arr.forEach(function (el) {
        arr2 = arr2.concat(isArray(el) ? flat(el) : el);
      });
      return arr2;
    }

    function getAttributes(props) {
      var className = props.className,
          otherProps = __rest(props, ["className"]);

      if (className != null) {
        otherProps.class = className;
      }

      delete otherProps.style;
      delete otherProps.children;
      return otherProps;
    }

    function fillProps(props, defaultProps) {
      if (!defaultProps) {
        return props;
      }

      for (var name in defaultProps) {
        if (isUndefined$1(props[name])) {
          props[name] = defaultProps[name];
        }
      }

      return props;
    }

    function createElement(type, props) {
      var children = [];

      for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
      }

      var _a = props || {},
          key = _a.key,
          ref = _a.ref,
          otherProps = __rest(_a, ["key", "ref"]);

      return {
        type: type,
        key: key,
        ref: ref,
        props: __assign$1(__assign$1({}, otherProps), {
          children: flat(children).filter(function (child) {
            return child != null;
          })
        })
      };
    }

    var Provider =
    /*#__PURE__*/
    function () {
      function Provider(type, key, index, container, ref, props) {
        if (props === void 0) {
          props = {};
        }

        this.type = type;
        this.key = key;
        this.index = index;
        this.container = container;
        this.ref = ref;
        this.props = props;
        this._providers = [];
      }

      var __proto = Provider.prototype;

      __proto._should = function (nextProps, nextState) {
        return true;
      };

      __proto._update = function (hooks, nextElement, nextState, isForceUpdate) {
        if (this.base && !isString(nextElement) && !isForceUpdate && !this._should(nextElement.props, nextState)) {
          return false;
        }

        this.original = nextElement;

        this._setState(nextState); // render


        var prevProps = this.props;

        if (!isString(nextElement)) {
          this.props = nextElement.props;
          this.ref = nextElement.ref;
        }

        this._render(hooks, this.base ? prevProps : {}, nextState);

        return true;
      };

      __proto._mounted = function () {
        var ref = this.ref;
        ref && ref(this.base);
      };

      __proto._setState = function (nextstate) {
        return;
      };

      __proto._updated = function () {
        var ref = this.ref;
        ref && ref(this.base);
      };

      __proto._destroy = function () {
        var ref = this.ref;
        ref && ref(null);
      };

      return Provider;
    }();

    function diffAttributes(attrs1, attrs2, el) {
      var _a = diffObject(attrs1, attrs2),
          added = _a.added,
          removed = _a.removed,
          changed = _a.changed;

      for (var name in added) {
        el.setAttribute(name, added[name]);
      }

      for (var name in changed) {
        el.setAttribute(name, changed[name][1]);
      }

      for (var name in removed) {
        el.removeAttribute(name);
      }
    }

    function diffEvents(events1, events2, provier) {
      var _a = diffObject(events1, events2),
          added = _a.added,
          removed = _a.removed,
          changed = _a.changed;

      for (var name in removed) {
        provier.removeEventListener(name);
      }

      for (var name in added) {
        provier.addEventListener(name, added[name]);
      }

      for (var name in changed) {
        provier.removeEventListener(name);
        provier.addEventListener(name, changed[name][1]);
      }

      for (var name in removed) {
        provier.removeEventListener(name);
      }
    }

    function diffStyle(style1, style2, el) {
      var style = el.style;

      var _a = diffObject(style1, style2),
          added = _a.added,
          removed = _a.removed,
          changed = _a.changed;

      for (var name in added) {
        style[name] = added[name];
      }

      for (var name in changed) {
        style[name] = changed[name][1];
      }

      for (var name in removed) {
        style[name] = "";
      }
    }

    function splitProps(props) {
      var attributes = {};
      var events = {};

      for (var name in props) {
        if (name.indexOf("on") === 0) {
          events[name.replace("on", "").toLowerCase()] = props[name];
        } else {
          attributes[name] = props[name];
        }
      }

      return {
        attributes: attributes,
        events: events
      };
    }

    var TextProvider =
    /*#__PURE__*/
    function (_super) {
      __extends$1(TextProvider, _super);

      function TextProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = TextProvider.prototype;

      __proto._render = function (hooks) {
        var _this = this;

        var isMount = !this.base;

        if (isMount) {
          this.base = document.createTextNode(this.type.replace("text_", ""));
        }

        hooks.push(function () {
          if (isMount) {
            _this._mounted();
          } else {
            _this._updated();
          }
        });
        return true;
      };

      __proto._unmount = function () {
        this.base.parentNode.removeChild(this.base);
      };

      return TextProvider;
    }(Provider);

    var ElementProvider =
    /*#__PURE__*/
    function (_super) {
      __extends$1(ElementProvider, _super);

      function ElementProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.events = {};
        return _this;
      }

      var __proto = ElementProvider.prototype;

      __proto.addEventListener = function (name, callback) {
        var events = this.events;

        events[name] = function (e) {
          e.nativeEvent = e;
          callback(e);
        };

        this.base.addEventListener(name, events[name]);
      };

      __proto.removeEventListener = function (name) {
        var events = this.events;
        this.base.removeEventListener(name, events[name]);
        delete events[name];
      };

      __proto._should = function (nextProps) {
        return isDiff(this.props, nextProps);
      };

      __proto._render = function (hooks, prevProps) {
        var _this = this;

        var isMount = !this.base;

        if (isMount) {
          this.base = document.createElement(this.type);
        }

        renderProviders(this, this._providers, this.props.children, hooks, null);
        var base = this.base;

        var _a = splitProps(prevProps),
            prevAttributes = _a.attributes,
            prevEvents = _a.events;

        var _b = splitProps(this.props),
            nextAttributes = _b.attributes,
            nextEvents = _b.events;

        diffAttributes(getAttributes(prevAttributes), getAttributes(nextAttributes), base);
        diffEvents(prevEvents, nextEvents, this);
        diffStyle(prevProps.style || {}, this.props.style || {}, base);
        hooks.push(function () {
          if (isMount) {
            _this._mounted();
          } else {
            _this._updated();
          }
        });
        return true;
      };

      __proto._unmount = function () {
        var events = this.events;
        var base = this.base;

        for (var name in events) {
          base.removeEventListener(name, events[name]);
        }

        this._providers.forEach(function (provider) {
          provider._unmount();
        });

        this.events = {};
        base.parentNode.removeChild(base);
      };

      return ElementProvider;
    }(Provider);

    function findContainerNode(provider) {
      if (!provider) {
        return null;
      }

      var base = provider.base;

      if (base instanceof Node) {
        return base;
      }

      return findContainerNode(provider.container);
    }

    function findDOMNode(comp) {
      if (!comp) {
        return null;
      }

      if (comp instanceof Node) {
        return comp;
      }

      var providers = comp._provider._providers;

      if (!providers.length) {
        return null;
      }

      return findDOMNode(providers[0].base);
    }

    var FunctionProvider =
    /*#__PURE__*/
    function (_super) {
      __extends$1(FunctionProvider, _super);

      function FunctionProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = FunctionProvider.prototype;

      __proto._render = function (hooks) {
        var template = this.type(this.props);
        renderProviders(this, this._providers, template ? [template] : [], hooks);
        return true;
      };

      __proto._unmount = function () {
        this._providers.forEach(function (provider) {
          provider._unmount();
        });
      };

      return FunctionProvider;
    }(Provider);

    var ContainerProvider =
    /*#__PURE__*/
    function (_super) {
      __extends$1(ContainerProvider, _super);

      function ContainerProvider(base) {
        var _this = _super.call(this, "container", "container", 0, null) || this;

        _this.base = base;
        return _this;
      }

      var __proto = ContainerProvider.prototype;

      __proto._render = function () {
        return true;
      };

      __proto._unmount = function () {
        return;
      };

      return ContainerProvider;
    }(Provider);

    var ComponentProvider =
    /*#__PURE__*/
    function (_super) {
      __extends$1(ComponentProvider, _super);

      function ComponentProvider(type, key, index, container, ref, props) {
        if (props === void 0) {
          props = {};
        }

        return _super.call(this, type, key, index, container, ref, fillProps(props, type.defaultProps)) || this;
      }

      var __proto = ComponentProvider.prototype;

      __proto._should = function (nextProps, nextState) {
        return this.base.shouldComponentUpdate(fillProps(nextProps, this.type.defaultProps), nextState || this.base.state);
      };

      __proto._render = function (hooks, prevProps, nextState) {
        var _this = this;

        this.props = fillProps(this.props, this.type.defaultProps);
        var isMount = !this.base;

        if (isMount) {
          this.base = new this.type(this.props);
          this.base._provider = this;
        } else {
          this.base.props = this.props;
        }

        var base = this.base;
        var prevState = base.state;
        var template = base.render();

        if (template && template.props && !template.props.children.length) {
          template.props.children = this.props.children;
        }

        renderProviders(this, this._providers, template ? [template] : [], hooks, nextState, null);
        hooks.push(function () {
          if (isMount) {
            _this._mounted();

            base.componentDidMount();
          } else {
            _this._updated();

            base.componentDidUpdate(prevProps, prevState);
          }
        });
      };

      __proto._setState = function (nextState) {
        if (!nextState) {
          return;
        }

        var base = this.base;
        base.state = nextState;
      };

      __proto._unmount = function () {
        this._providers.forEach(function (provider) {
          provider._unmount();
        });

        this.base.componentWillUnmount();
      };

      return ComponentProvider;
    }(Provider);

    var Component$1 =
    /*#__PURE__*/
    function () {
      function Component(props) {
        if (props === void 0) {
          props = {};
        }

        this.props = props;
        this.state = {};
      }

      var __proto = Component.prototype;

      __proto.shouldComponentUpdate = function (props, state) {
        return true;
      };

      __proto.render = function () {
        return null;
      };

      __proto.setState = function (state, callback, isForceUpdate) {
        var hooks = [];
        var provider = this._provider;
        var isUpdate = renderProviders(provider.container, [provider], [provider.original], hooks, __assign$1(__assign$1({}, this.state), state), isForceUpdate);

        if (isUpdate) {
          if (callback) {
            hooks.push(callback);
          }

          executeHooks(hooks);
        }
      };

      __proto.forceUpdate = function (callback) {
        this.setState(this.state, callback, true);
      };

      __proto.componentDidMount = function () {};

      __proto.componentDidUpdate = function (prevProps, prevState) {};

      __proto.componentWillUnmount = function () {};

      return Component;
    }();

    var PureComponent =
    /*#__PURE__*/
    function (_super) {
      __extends$1(PureComponent, _super);

      function PureComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = PureComponent.prototype;

      __proto.shouldComponentUpdate = function (props, state) {
        return isDiff(this.props, props) || isDiff(this.state, state);
      };

      return PureComponent;
    }(Component$1);

    var _Portal =
    /*#__PURE__*/
    function (_super) {
      __extends$1(_Portal, _super);

      function _Portal() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = _Portal.prototype;

      __proto.componentDidMount = function () {
        var _a = this.props,
            element = _a.element,
            container = _a.container;
        this._portalProvider = new ContainerProvider(container);
        renderProvider(element, container, this._portalProvider);
      };

      __proto.componentDidUpdate = function () {
        var _a = this.props,
            element = _a.element,
            container = _a.container;
        renderProvider(element, container, this._portalProvider);
      };

      __proto.componentWillUnmount = function () {
        var container = this.props.container;
        renderProvider(null, container, this._portalProvider);
        this._portalProvider = null;
      };

      return _Portal;
    }(PureComponent);

    function updateProvider(provider, children, nextState) {
      var hooks = [];
      renderProviders(provider, provider._providers, children, hooks, nextState);
      executeHooks(hooks);
    }

    function getNextSibiling(provider, childProvider) {
      var childProviders = provider._providers;
      var length = childProviders.length;

      for (var i = childProvider.index + 1; i < length; ++i) {
        var el = findDOMNode(childProviders[i].base);

        if (el) {
          return el;
        }
      }

      return null;
    }

    function diffProviders(containerProvider, providers, children) {
      var childrenKeys = children.map(function (p) {
        return isString(p) ? null : p.key;
      });
      var keys1 = fillKeys(providers.map(function (p) {
        return p.key;
      }));
      var keys2 = fillKeys(childrenKeys);
      var result = diff(keys1, keys2, function (key) {
        return key;
      });
      result.removed.forEach(function (index) {
        providers.splice(index, 1)[0]._unmount();
      });
      result.ordered.forEach(function (_a) {
        var from = _a[0],
            to = _a[1];
        var childrenProvider = providers.splice(from, 1)[0];
        providers.splice(to, 0, childrenProvider);
        var el = findDOMNode(childrenProvider.base);
        var next = findDOMNode(providers[to + 1] && providers[to + 1].base);

        if (el) {
          el.parentNode.insertBefore(el, next);
        }
      });
      result.added.forEach(function (index) {
        providers.splice(index, 0, createProvider(children[index], childrenKeys[index], index, containerProvider));
      });
      var changed = result.maintained.filter(function (_a) {
        var _ = _a[0],
            to = _a[1];
        var el = children[to];
        var childProvider = providers[to];
        var type = isString(el) ? "text_" + el : el.type;

        if (type !== childProvider.type) {
          childProvider._unmount();

          providers.splice(to, 1, createProvider(el, childrenKeys[to], to, containerProvider));
          return true;
        }

        childProvider.index = to;
        return false;
      });
      return __spreadArrays(result.added, changed.map(function (_a) {
        var _ = _a[0],
            to = _a[1];
        return to;
      }));
    }

    function renderProviders(containerProvider, providers, children, updatedHooks, nextState, isForceUpdate) {
      var result = diffProviders(containerProvider, providers, children);
      var updated = providers.filter(function (childProvider, i) {
        return childProvider._update(updatedHooks, children[i], nextState, isForceUpdate);
      });
      var containerNode = findContainerNode(containerProvider);

      if (containerNode) {
        result.reverse().forEach(function (index) {
          var childProvider = providers[index];
          var el = findDOMNode(childProvider.base);

          if (!el) {
            return;
          }

          if (containerNode !== el && !el.parentNode) {
            var nextElement = getNextSibiling(containerProvider, childProvider);
            containerNode.insertBefore(el, nextElement);
          }
        });
      }

      return updated.length > 0;
    }

    function renderProvider(element, container, provider) {
      if (provider === void 0) {
        provider = container.__REACT_COMPAT__;
      }

      var isProvider = !!provider;

      if (!provider) {
        provider = new ContainerProvider(container);
      }

      updateProvider(provider, element ? [element] : []);

      if (!isProvider) {
        container.__REACT_COMPAT__ = provider;
      }

      return provider;
    }

    function render(element, container, callback) {
      var provider = container.__REACT_COMPAT__;

      if (element && !provider) {
        container.innerHTML = "";
      }

      renderProvider(element, container, provider);
      callback && callback();
    }
    function createPortal(el, container) {
      return createElement(_Portal, {
        element: el,
        container: container
      });
    }

    /*
    Copyright (c) 2017 NAVER Corp.
    @egjs/agent project is licensed under the MIT license

    @egjs/agent JavaScript library


    @version 2.1.5
    */
    var win = typeof window !== "undefined" && window || {};
    var navigator = win.navigator;

    var parseRules = {
    	browser: [{
    		criteria: "PhantomJS",
    		identity: "PhantomJS"
    	}, {
    		criteria: /Whale/,
    		identity: "Whale",
    		versionSearch: "Whale"
    	}, {
    		criteria: /Edge/,
    		identity: "Edge",
    		versionSearch: "Edge"
    	}, {
    		criteria: /MSIE|Trident|Windows Phone/,
    		identity: "IE",
    		versionSearch: "IEMobile|MSIE|rv"
    	}, {
    		criteria: /MiuiBrowser/,
    		identity: "MIUI Browser",
    		versionSearch: "MiuiBrowser"
    	}, {
    		criteria: /SamsungBrowser/,
    		identity: "Samsung Internet",
    		versionSearch: "SamsungBrowser"
    	}, {
    		criteria: /SAMSUNG /,
    		identity: "Samsung Internet",
    		versionSearch: "Version"
    	}, {
    		criteria: /Chrome|CriOS/,
    		identity: "Chrome"
    	}, {
    		criteria: /Android/,
    		identity: "Android Browser",
    		versionSearch: "Version"
    	}, {
    		criteria: /iPhone|iPad/,
    		identity: "Safari",
    		versionSearch: "Version"
    	}, {
    		criteria: "Apple",
    		identity: "Safari",
    		versionSearch: "Version"
    	}, {
    		criteria: "Firefox",
    		identity: "Firefox"
    	}],
    	os: [{
    		criteria: /Windows Phone/,
    		identity: "Windows Phone",
    		versionSearch: "Windows Phone"
    	}, {
    		criteria: "Windows 2000",
    		identity: "Window",
    		versionAlias: "5.0"
    	}, {
    		criteria: /Windows NT/,
    		identity: "Window",
    		versionSearch: "Windows NT"
    	}, {
    		criteria: /iPhone|iPad/,
    		identity: "iOS",
    		versionSearch: "iPhone OS|CPU OS"
    	}, {
    		criteria: "Mac",
    		versionSearch: "OS X",
    		identity: "MAC"
    	}, {
    		criteria: /Android/,
    		identity: "Android"
    	}, {
    		criteria: /Tizen/,
    		identity: "Tizen"
    	}, {
    		criteria: /Web0S/,
    		identity: "WebOS"
    	}],

    	// Webview check condition
    	// ios: If has no version information
    	// Android 5.0 && chrome 40+: Presence of "; wv" in userAgent
    	// Under android 5.0: Presence of "NAVER" or "Daum" in userAgent
    	webview: [{
    		criteria: /iPhone|iPad/,
    		browserVersionSearch: "Version",
    		webviewBrowserVersion: /-1/
    	}, {
    		criteria: /iPhone|iPad|Android/,
    		webviewToken: /NAVER|DAUM|; wv/

    	}],
    	defaultString: {
    		browser: {
    			version: "-1",
    			name: "unknown"
    		},
    		os: {
    			version: "-1",
    			name: "unknown"
    		}
    	}
    };

    function filter(arr, compare) {
    	var result = [];

    	for (var i = 0; i < arr.length; i++) {
    		compare(arr[i]) && result.push(arr[i]);
    	}
    	return result;
    }

    function some(arr, compare) {
    	for (var i = 0; i < arr.length; i++) {
    		if (compare(arr[i])) {
    			return true;
    		}
    	}
    	return false;
    }

    var UA = void 0;

    function setUa(ua) {
    	UA = ua;
    }

    function isMatched(base, target) {
    	return target && target.test ? !!target.test(base) : base.indexOf(target) > -1;
    }

    function getIdentityStringFromArray(rules, defaultStrings) {
    	var matchedRule = filter(rules, function (rule) {
    		return isMatched(UA, rule.criteria);
    	})[0];

    	return matchedRule && matchedRule.identity || defaultStrings.name;
    }

    function getRule(rules, targetIdentity) {
    	return filter(rules, function (rule) {
    		var criteria = rule.criteria;
    		var identityMatched = new RegExp(rule.identity, "i").test(targetIdentity);

    		if (criteria ? identityMatched && isMatched(UA, criteria) : identityMatched) {
    			return true;
    		} else {
    			return false;
    		}
    	})[0];
    }

    function getBrowserName() {
    	return getIdentityStringFromArray(parseRules.browser, parseRules.defaultString.browser);
    }

    function getBrowserRule(browserName) {
    	var rule = getRule(parseRules.browser, browserName);

    	if (!rule) {
    		rule = {
    			criteria: browserName,
    			versionSearch: browserName,
    			identity: browserName
    		};
    	}

    	return rule;
    }

    function extractBrowserVersion(versionToken, ua) {
    	var browserVersion = parseRules.defaultString.browser.version;
    	var versionRegexResult = new RegExp("(" + versionToken + ")", "i").exec(ua);

    	if (!versionRegexResult) {
    		return browserVersion;
    	}

    	var versionTokenIndex = versionRegexResult.index;
    	var verTkn = versionRegexResult[0];

    	if (versionTokenIndex > -1) {
    		var versionIndex = versionTokenIndex + verTkn.length + 1;

    		browserVersion = ua.substring(versionIndex).split(" ")[0].replace(/_/g, ".").replace(/;|\)/g, "");
    	}
    	return browserVersion;
    }

    function getBrowserVersion(browserName) {
    	if (!browserName) {
    		return undefined;
    	}

    	// console.log(browserRule);
    	// const versionToken = browserRule ? browserRule.versionSearch : browserName;
    	var browserRule = getBrowserRule(browserName);
    	var versionToken = browserRule.versionSearch || browserName;
    	var browserVersion = extractBrowserVersion(versionToken, UA);

    	return browserVersion;
    }

    function isWebview() {
    	var webviewRules = parseRules.webview;
    	var browserVersion = void 0;

    	return some(filter(webviewRules, function (rule) {
    		return isMatched(UA, rule.criteria);
    	}), function (rule) {
    		browserVersion = extractBrowserVersion(rule.browserVersionSearch, UA);
    		if (isMatched(UA, rule.webviewToken) || isMatched(browserVersion, rule.webviewBrowserVersion)) {
    			return true;
    		} else {
    			return false;
    		}
    	});
    }

    function getOSRule(osName) {
    	return getRule(parseRules.os, osName);
    }

    function getOsName() {
    	return getIdentityStringFromArray(parseRules.os, parseRules.defaultString.os);
    }

    function getOsVersion(osName) {
    	var osRule = getOSRule(osName) || {};
    	var defaultOSVersion = parseRules.defaultString.os.version;
    	var osVersion = void 0;

    	if (!osName) {
    		return undefined;
    	}
    	if (osRule.versionAlias) {
    		return osRule.versionAlias;
    	}
    	var osVersionToken = osRule.versionSearch || osName;
    	var osVersionRegex = new RegExp("(" + osVersionToken + ")\\s([\\d_\\.]+|\\d_0)", "i");
    	var osVersionRegexResult = osVersionRegex.exec(UA);

    	if (osVersionRegexResult) {
    		osVersion = osVersionRegex.exec(UA)[2].replace(/_/g, ".").replace(/;|\)/g, "");
    	}
    	return osVersion || defaultOSVersion;
    }

    function getOs() {
    	var name = getOsName();
    	var version = getOsVersion(name);

    	return { name: name, version: version };
    }

    function getBrowser() {
    	var name = getBrowserName();
    	var version = getBrowserVersion(name);

    	return { name: name, version: version, webview: isWebview() };
    }

    function getIsMobile() {
    	return UA.indexOf("Mobi") !== -1;
    }

    /**
     * Copyright (c) NAVER Corp.
     * egjs-agent projects are licensed under the MIT license
     */

    /**
     * @namespace eg.agent
     */
    /**
     * Extracts browser and operating system information from the user agent string.
     * @ko 유저 에이전트 문자열에서 브라우저와 운영체제 정보를 추출한다.
     * @function eg.agent#agent
     * @param {String} [userAgent=navigator.userAgent] user agent string to parse <ko>파싱할 유저에이전트 문자열</ko>
     * @return {Object} agentInfo
     * @return {Object} agentInfo.os os Operating system information <ko>운영체제 정보</ko>
     * @return {String} agentInfo.os.name Operating system name (android, ios, window, mac, unknown) <ko>운영체제 이름 (android, ios, window, mac, unknown)</ko>
     * @return {String} agentInfo.os.version Operating system version <ko>운영체제 버전</ko>
     * @return {String} agentInfo.browser Browser information <ko>브라우저 정보</ko>
     * @return {String} agentInfo.browser.name Browser name (safari, chrome, sbrowser, ie, firefox, unknown) <ko>브라우저 이름 (safari, chrome, sbrowser, ie, firefox, unknown)</ko>
     * @return {String} agentInfo.browser.version Browser version <ko>브라우저 버전 </ko>
     * @return {Boolean} agentInfo.browser.webview Indicates whether the browser is inapp<ko>웹뷰 브라우저 여부</ko>
     * @return {Boolean} agentInfo.isMobile Indicates whether the browser is for mobile<ko>모바일 브라우저 여부</ko>
     * @example
    import agent from "@egjs/agent";

    const {os, browser, isMobile} = agent();
     */
    function agent() {
      var ua = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navigator.userAgent;

      setUa(ua);

      var agentInfo = {
        os: getOs(),
        browser: getBrowser(),
        isMobile: getIsMobile()
      };

      agentInfo.browser.name = agentInfo.browser.name.toLowerCase();
      agentInfo.os.name = agentInfo.os.name.toLowerCase();
      agentInfo.os.version = agentInfo.os.version.toLowerCase();

      if (agentInfo.os.name === "ios" && agentInfo.browser.webview) {
        agentInfo.browser.version = "-1";
      }

      return agentInfo;
    }
    /**
     * Version info string
     * @ko 버전정보 문자열
     * @name VERSION
     * @static
     * @type {String}
     * @example
     * eg.agent.VERSION;  // ex) 2.2.0
     * @memberof eg.agent
     */
    agent.VERSION = "2.1.5";

    /*
    Copyright (c) 2019 Daybrush
    name: @moveable/matrix
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/moveable.git
    version: 0.3.1
    */
    function add(matrix, inverseMatrix, startIndex, endIndex, fromStart, k) {
      for (var i = startIndex; i < endIndex; ++i) {
        matrix[i] += matrix[fromStart + i - startIndex] * k;
        inverseMatrix[i] += inverseMatrix[fromStart + i - startIndex] * k;
      }
    }

    function swap(matrix, inverseMatrix, startIndex, endIndex, fromStart) {
      for (var i = startIndex; i < endIndex; ++i) {
        var v = matrix[i];
        var iv = inverseMatrix[i];
        matrix[i] = matrix[fromStart + i - startIndex];
        matrix[fromStart + i - startIndex] = v;
        inverseMatrix[i] = inverseMatrix[fromStart + i - startIndex];
        inverseMatrix[fromStart + i - startIndex] = iv;
      }
    }

    function divide(matrix, inverseMatrix, startIndex, endIndex, k) {
      for (var i = startIndex; i < endIndex; ++i) {
        matrix[i] /= k;
        inverseMatrix[i] /= k;
      }
    }

    function ignoreDimension(matrix, m, n) {
      if (n === void 0) {
        n = Math.sqrt(matrix.length);
      }

      var newMatrix = matrix.slice();

      for (var i = 0; i < n; ++i) {
        newMatrix[i * n + m - 1] = 0;
        newMatrix[(m - 1) * n + i] = 0;
      }

      newMatrix[(m - 1) * (n + 1)] = 1;
      return newMatrix;
    }
    function invert(matrix, n) {
      if (n === void 0) {
        n = Math.sqrt(matrix.length);
      }

      var newMatrix = matrix.slice();
      var inverseMatrix = createIdentityMatrix(n);

      for (var i = 0; i < n; ++i) {
        var startIndex = n * i;
        var endIndex = n * (i + 1);
        var identityIndex = startIndex + i;

        if (newMatrix[identityIndex] === 0) {
          for (var j = i + 1; j < n; ++j) {
            if (newMatrix[n * j + i]) {
              swap(newMatrix, inverseMatrix, startIndex, endIndex, n * j);
              break;
            }
          }
        }

        if (newMatrix[identityIndex]) {
          divide(newMatrix, inverseMatrix, startIndex, endIndex, newMatrix[identityIndex]);
        } else {
          // no inverse matrix
          return [];
        }

        for (var j = 0; j < n; ++j) {
          var targetStartIndex = n * j;
          var targetEndIndex = targetStartIndex + n;
          var targetIndex = targetStartIndex + i;
          var target = newMatrix[targetIndex];

          if (target === 0 || i === j) {
            continue;
          }

          add(newMatrix, inverseMatrix, targetStartIndex, targetEndIndex, startIndex, -target);
        }
      }

      return inverseMatrix;
    }
    function transpose(matrix, n) {
      if (n === void 0) {
        n = Math.sqrt(matrix.length);
      }

      var newMatrix = [];

      for (var i = 0; i < n; ++i) {
        for (var j = 0; j < n; ++j) {
          newMatrix[j * n + i] = matrix[n * i + j];
        }
      }

      return newMatrix;
    }
    function getRad(pos1, pos2) {
      var distX = pos2[0] - pos1[0];
      var distY = pos2[1] - pos1[1];
      var rad = Math.atan2(distY, distX);
      return rad >= 0 ? rad : rad + Math.PI * 2;
    }
    function getOrigin(matrix, n) {
      if (n === void 0) {
        n = Math.sqrt(matrix.length);
      }

      var originMatrix = [];

      for (var i = 0; i < n - 1; ++i) {
        originMatrix[i] = matrix[(i + 1) * n - 1];
      }

      originMatrix[n - 1] = 0;
      return originMatrix;
    }
    function convertPositionMatrix(matrix, n) {
      var newMatrix = matrix.slice();

      for (var i = matrix.length; i < n - 1; ++i) {
        newMatrix[i] = 0;
      }

      newMatrix[n - 1] = 1;
      return newMatrix;
    }
    function convertDimension(matrix, n, m) {
      if (n === void 0) {
        n = Math.sqrt(matrix.length);
      } // n < m


      if (n === m) {
        return matrix;
      }

      var newMatrix = createIdentityMatrix(m);
      var length = Math.min(n, m);

      for (var i = 0; i < length - 1; ++i) {
        for (var j = 0; j < length - 1; ++j) {
          newMatrix[i * m + j] = matrix[i * n + j];
        }

        newMatrix[(i + 1) * m - 1] = matrix[(i + 1) * n - 1];
        newMatrix[(m - 1) * m + i] = matrix[(n - 1) * n + i];
      }

      newMatrix[m * m - 1] = matrix[n * n - 1];
      return newMatrix;
    }
    function multiplies(n) {
      var matrixes = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        matrixes[_i - 1] = arguments[_i];
      }

      var m = createIdentityMatrix(n);
      matrixes.forEach(function (matrix) {
        m = multiply(m, matrix, n);
      });
      return m;
    }
    function multiply(matrix, matrix2, n) {
      var newMatrix = []; // n * m X m * k

      var m = matrix.length / n;
      var k = matrix2.length / m;

      if (!m) {
        return matrix2;
      } else if (!k) {
        return matrix;
      }

      for (var i = 0; i < n; ++i) {
        for (var j = 0; j < k; ++j) {
          newMatrix[i * k + j] = 0;

          for (var l = 0; l < m; ++l) {
            newMatrix[i * k + j] += matrix[i * m + l] * matrix2[l * k + j];
          }
        }
      } // n * k


      return newMatrix;
    }
    function multiplyCSS(matrix, matrix2, n) {
      if (n === void 0) {
        n = Math.sqrt(matrix.length);
      }

      var newMatrix = []; // n(y) * m(x) X m(y) * k(x)

      var m = matrix.length / n;
      var k = matrix2.length / m;

      for (var i = 0; i < n; ++i) {
        for (var j = 0; j < k; ++j) {
          newMatrix[i + j * k] = 0;

          for (var l = 0; l < m; ++l) {
            newMatrix[i + j * k] += matrix[i + l * m] * matrix2[l + j * k];
          }
        }
      } // n * k


      return newMatrix;
    }
    function average() {
      var nums = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i] = arguments[_i];
      }

      var length = nums.length;
      var total = 0;

      for (var i = length - 1; i >= 0; --i) {
        total += nums[i];
      }

      return length ? total / length : 0;
    }
    function plus(pos1, pos2) {
      var length = Math.min(pos1.length, pos2.length);
      var nextPos = pos1.slice();

      for (var i = 0; i < length; ++i) {
        nextPos[i] = nextPos[i] + pos2[i];
      }

      return nextPos;
    }
    function minus(pos1, pos2) {
      var length = Math.min(pos1.length, pos2.length);
      var nextPos = pos1.slice();

      for (var i = 0; i < length; ++i) {
        nextPos[i] = nextPos[i] - pos2[i];
      }

      return nextPos;
    }
    function caculate(matrix, matrix2, n) {
      if (n === void 0) {
        n = matrix2.length;
      }

      var result = multiply(matrix, matrix2, n);
      var k = result[n - 1];
      return result.map(function (v) {
        return v / k;
      });
    }
    function rotate(pos, rad) {
      return caculate(createRotateMatrix(rad, 3), convertPositionMatrix(pos, 3));
    }
    function convertCSStoMatrix(a) {
      if (a.length === 6) {
        return [a[0], a[2], a[4], a[1], a[3], a[5], 0, 0, 1];
      }

      return transpose(a);
    }
    function convertMatrixtoCSS(a) {
      if (a.length === 9) {
        return [a[0], a[3], a[1], a[4], a[2], a[5]];
      }

      return transpose(a);
    }
    function createRotateMatrix(rad, n) {
      var cos = Math.cos(rad);
      var sin = Math.sin(rad);
      var m = createIdentityMatrix(n);
      m[0] = cos;
      m[1] = -sin;
      m[n] = sin;
      m[n + 1] = cos;
      return m;
    }
    function createIdentityMatrix(n) {
      var length = n * n;
      var matrix = [];

      for (var i = 0; i < length; ++i) {
        matrix[i] = i % (n + 1) ? 0 : 1;
      }

      return matrix;
    }
    function createScaleMatrix(scale, n) {
      var m = createIdentityMatrix(n);
      var length = Math.min(scale.length, n - 1);

      for (var i = 0; i < length; ++i) {
        m[(n + 1) * i] = scale[i];
      }

      return m;
    }
    function createOriginMatrix(origin, n) {
      var m = createIdentityMatrix(n);
      var length = Math.min(origin.length, n - 1);

      for (var i = 0; i < length; ++i) {
        m[n * (i + 1) - 1] = origin[i];
      }

      return m;
    }
    function createWarpMatrix(pos0, pos1, pos2, pos3, nextPos0, nextPos1, nextPos2, nextPos3) {
      var x0 = pos0[0],
          y0 = pos0[1];
      var x1 = pos1[0],
          y1 = pos1[1];
      var x2 = pos2[0],
          y2 = pos2[1];
      var x3 = pos3[0],
          y3 = pos3[1];
      var u0 = nextPos0[0],
          v0 = nextPos0[1];
      var u1 = nextPos1[0],
          v1 = nextPos1[1];
      var u2 = nextPos2[0],
          v2 = nextPos2[1];
      var u3 = nextPos3[0],
          v3 = nextPos3[1];
      var matrix = [x0, y0, 1, 0, 0, 0, -u0 * x0, -u0 * y0, 0, 0, 0, x0, y0, 1, -v0 * x0, -v0 * y0, x1, y1, 1, 0, 0, 0, -u1 * x1, -u1 * y1, 0, 0, 0, x1, y1, 1, -v1 * x1, -v1 * y1, x2, y2, 1, 0, 0, 0, -u2 * x2, -u2 * y2, 0, 0, 0, x2, y2, 1, -v2 * x2, -v2 * y2, x3, y3, 1, 0, 0, 0, -u3 * x3, -u3 * y3, 0, 0, 0, x3, y3, 1, -v3 * x3, -v3 * y3];
      var inverseMatrix = invert(matrix, 8);

      if (!inverseMatrix.length) {
        return [];
      }

      var h = multiply(inverseMatrix, [u0, v0, u1, v1, u2, v2, u3, v3], 8);
      h[8] = 1;
      return convertDimension(h, 3, 4);
    }

    /*
    Copyright (c) 2019 Daybrush
    name: css-styled
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/css-styled.git
    version: 0.1.7
    */

    function hash(str) {
      var hash = 5381,
          i    = str.length;

      while(i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
      }

      /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
       * integers. Since we want the results to be always positive, convert the
       * signed int to an unsigned by doing an unsigned bitshift. */
      return hash >>> 0;
    }

    var stringHash = hash;

    function getHash(str) {
      return stringHash(str).toString(36);
    }
    function getShadowRoot(parentElement) {
      if (parentElement.getRootNode) {
        var rootNode = parentElement.getRootNode();

        if (rootNode.nodeType === 11) {
          return rootNode;
        }
      }

      return;
    }
    function injectStyle(className, css, shadowRoot) {
      var style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.innerHTML = css.replace(/([^}{]*){/mg, function (all, selector) {
        return splitComma(selector).map(function (subSelector) {
          if (subSelector.indexOf(":global") > -1) {
            return subSelector.replace(/\:global/g, "");
          } else if (subSelector.indexOf(":host") > -1) {
            return "" + subSelector.replace(/\:host/g, "." + className);
          }

          return "." + className + " " + subSelector;
        }).join(", ") + "{";
      });
      (shadowRoot || document.head || document.body).appendChild(style);
      return style;
    }

    function styled(css) {
      var injectClassName = "rCS" + getHash(css);
      var injectCount = 0;
      var injectElement;
      return {
        className: injectClassName,
        inject: function (el) {
          var shadowRoot = getShadowRoot(el);
          var firstMount = injectCount === 0;
          var styleElement;

          if (shadowRoot || firstMount) {
            styleElement = injectStyle(injectClassName, css, shadowRoot);
          }

          if (firstMount) {
            injectElement = styleElement;
          }

          if (!shadowRoot) {
            ++injectCount;
          }

          return {
            destroy: function () {
              if (shadowRoot) {
                el.removeChild(styleElement);
                styleElement = null;
              } else {
                if (injectCount > 0) {
                  --injectCount;
                }

                if (injectCount === 0 && injectElement) {
                  injectElement.parentNode.removeChild(injectElement);
                  injectElement = null;
                }
              }
            }
          };
        }
      };
    }

    /*
    Copyright (c) 2019 Daybrush
    name: react-css-styled
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/css-styled/tree/master/packages/react-css-styled
    version: 0.1.4
    */

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
    var extendStatics$2 = function (d, b) {
      extendStatics$2 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$2(d, b);
    };

    function __extends$2(d, b) {
      extendStatics$2(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$2 = function () {
      __assign$2 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$2.apply(this, arguments);
    };
    function __rest$1(s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }

    function styled$1(Tag, css) {
      var injector = styled(css);
      return (
        /*#__PURE__*/
        function (_super) {
          __extends$2(Styled, _super);

          function Styled() {
            return _super !== null && _super.apply(this, arguments) || this;
          }

          Styled.prototype.render = function () {
            var _a = this.props,
                _b = _a.className,
                className = _b === void 0 ? "" : _b,
                attributes = __rest$1(_a, ["className"]);

            return createElement(Tag, __assign$2({
              ref: ref(this, "element"),
              className: className + " " + injector.className
            }, attributes));
          };

          Styled.prototype.componentDidMount = function () {
            this.injectResult = injector.inject(this.element);
          };

          Styled.prototype.componentWillUnmount = function () {
            this.injectResult.destroy();
            this.injectResult = null;
          };

          Styled.prototype.getElement = function () {
            return this.element;
          };

          return Styled;
        }(Component$1)
      );
    }

    /*
    Copyright (c) 2019 Daybrush
    name: @daybrush/drag
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/drag.git
    version: 0.14.0
    */

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
    var __assign$3 = function () {
      __assign$3 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$3.apply(this, arguments);
    };

    function getPinchDragPosition(clients, prevClients, startClients, startPinchClients) {
      var nowCenter = getAverageClient(clients);
      var prevCenter = getAverageClient(prevClients);
      var startCenter = getAverageClient(startPinchClients);
      var pinchClient = plueClient(startPinchClients[0], minusClient(nowCenter, startCenter));
      var pinchPrevClient = plueClient(startPinchClients[0], minusClient(prevCenter, startCenter));
      return getPosition(pinchClient, pinchPrevClient, startClients[0]);
    }
    function isMultiTouch(e) {
      return e.touches && e.touches.length >= 2;
    }
    function getPositionEvent(e) {
      if (e.touches) {
        return getClients(e.touches);
      } else {
        return [getClient(e)];
      }
    }
    function getPosition(client, prevClient, startClient) {
      var clientX = client.clientX,
          clientY = client.clientY;
      var prevX = prevClient.clientX,
          prevY = prevClient.clientY;
      var startX = startClient.clientX,
          startY = startClient.clientY;
      var deltaX = clientX - prevX;
      var deltaY = clientY - prevY;
      var distX = clientX - startX;
      var distY = clientY - startY;
      return {
        clientX: clientX,
        clientY: clientY,
        deltaX: deltaX,
        deltaY: deltaY,
        distX: distX,
        distY: distY
      };
    }
    function getDist(clients) {
      return Math.sqrt(Math.pow(clients[0].clientX - clients[1].clientX, 2) + Math.pow(clients[0].clientY - clients[1].clientY, 2));
    }
    function getPositions(clients, prevClients, startClients) {
      return clients.map(function (client, i) {
        return getPosition(client, prevClients[i], startClients[i]);
      });
    }
    function getClients(touches) {
      var length = Math.min(touches.length, 2);
      var clients = [];

      for (var i = 0; i < length; ++i) {
        clients.push(getClient(touches[i]));
      }

      return clients;
    }
    function getClient(e) {
      return {
        clientX: e.clientX,
        clientY: e.clientY
      };
    }
    function getAverageClient(clients) {
      if (clients.length === 1) {
        return clients[0];
      }

      return {
        clientX: (clients[0].clientX + clients[1].clientX) / 2,
        clientY: (clients[0].clientY + clients[1].clientY) / 2
      };
    }
    function plueClient(client1, client2) {
      return {
        clientX: client1.clientX + client2.clientX,
        clientY: client1.clientY + client2.clientY
      };
    }
    function minusClient(client1, client2) {
      return {
        clientX: client1.clientX - client2.clientX,
        clientY: client1.clientY - client2.clientY
      };
    }

    /**
     * You can set up drag events in any browser.
     */

    var Dragger =
    /*#__PURE__*/
    function () {
      /**
       *
       */
      function Dragger(targets, options) {
        var _this = this;

        if (options === void 0) {
          options = {};
        }

        this.options = {};
        this.flag = false;
        this.pinchFlag = false;
        this.datas = {};
        this.isDrag = false;
        this.isPinch = false;
        this.isMouse = false;
        this.isTouch = false;
        this.prevClients = [];
        this.startClients = [];
        this.movement = 0;
        this.startPinchClients = [];
        this.startDistance = 0;
        this.customDist = [0, 0];
        this.targets = [];
        /**
         * @method
         */

        this.onDragStart = function (e) {
          if (!_this.flag && e.cancelable === false) {
            return;
          }

          var _a = _this.options,
              container = _a.container,
              pinchOutside = _a.pinchOutside,
              dragstart = _a.dragstart,
              preventRightClick = _a.preventRightClick;
          var isTouch = _this.isTouch;

          if (!_this.flag && isTouch && pinchOutside) {
            setTimeout(function () {
              addEvent(container, "touchstart", _this.onDragStart);
            });
          }

          if (_this.flag && isTouch && pinchOutside) {
            removeEvent(container, "touchstart", _this.onDragStart);
          }

          if (isMultiTouch(e)) {
            if (!_this.flag && e.touches.length !== e.changedTouches.length) {
              return;
            }

            if (!_this.pinchFlag) {
              _this.onPinchStart(e);
            }
          }

          if (_this.flag) {
            return;
          }

          var clients = _this.startClients[0] ? _this.startClients : getPositionEvent(e);
          _this.customDist = [0, 0];
          _this.flag = true;
          _this.isDrag = false;
          _this.startClients = clients;
          _this.prevClients = clients;
          _this.datas = {};
          _this.movement = 0;
          var position = getPosition(clients[0], _this.prevClients[0], _this.startClients[0]);

          if (preventRightClick && e.which === 3 || (dragstart && dragstart(__assign$3({
            type: "dragstart",
            datas: _this.datas,
            inputEvent: e
          }, position))) === false) {
            _this.startClients = [];
            _this.prevClients = [];
            _this.flag = false;
          }

          _this.flag && e.preventDefault();
        };

        this.onDrag = function (e, isScroll) {
          if (!_this.flag) {
            return;
          }

          var clients = getPositionEvent(e);

          if (_this.pinchFlag) {
            _this.onPinch(e, clients);
          }

          var result = _this.move([0, 0], e, clients);

          if (!result || !result.deltaX && !result.deltaY) {
            return;
          }

          var drag = _this.options.drag;
          drag && drag(__assign$3({}, result, {
            isScroll: !!isScroll,
            inputEvent: e
          }));
        };

        this.onDragEnd = function (e) {
          if (!_this.flag) {
            return;
          }

          var _a = _this.options,
              dragend = _a.dragend,
              pinchOutside = _a.pinchOutside,
              container = _a.container;

          if (_this.isTouch && pinchOutside) {
            removeEvent(container, "touchstart", _this.onDragStart);
          }

          if (_this.pinchFlag) {
            _this.onPinchEnd(e);
          }

          _this.flag = false;
          var prevClients = _this.prevClients;
          var startClients = _this.startClients;
          var position = _this.pinchFlag ? getPinchDragPosition(prevClients, prevClients, startClients, _this.startPinchClients) : getPosition(prevClients[0], prevClients[0], startClients[0]);
          _this.startClients = [];
          _this.prevClients = [];
          dragend && dragend(__assign$3({
            type: "dragend",
            datas: _this.datas,
            isDrag: _this.isDrag,
            inputEvent: e
          }, position));
        };

        var elements = [].concat(targets);
        this.options = __assign$3({
          container: elements.length > 1 ? window : elements[0],
          preventRightClick: true,
          preventDefault: true,
          pinchThreshold: 0,
          events: ["touch", "mouse"]
        }, options);
        var _a = this.options,
            container = _a.container,
            events = _a.events;
        this.isTouch = events.indexOf("touch") > -1;
        this.isMouse = events.indexOf("mouse") > -1;
        this.customDist = [0, 0];
        this.targets = elements;

        if (this.isMouse) {
          elements.forEach(function (el) {
            addEvent(el, "mousedown", _this.onDragStart);
          });
          addEvent(container, "mousemove", this.onDrag);
          addEvent(container, "mouseup", this.onDragEnd);
        }

        if (this.isTouch) {
          var passive_1 = {
            passive: false
          };
          elements.forEach(function (el) {
            addEvent(el, "touchstart", _this.onDragStart, passive_1);
          });
          addEvent(container, "touchmove", this.onDrag, passive_1);
          addEvent(container, "touchend", this.onDragEnd, passive_1);
          addEvent(container, "touchcancel", this.onDragEnd, passive_1);
        }
      }
      /**
       *
       */


      var __proto = Dragger.prototype;

      __proto.isDragging = function () {
        return this.isDrag;
      };
      /**
       *
       */


      __proto.isFlag = function () {
        return this.flag;
      };
      /**
       *
       */


      __proto.isPinching = function () {
        return this.isPinch;
      };
      /**
       *
       */


      __proto.scrollBy = function (deltaX, deltaY, e, isCallDrag) {
        if (isCallDrag === void 0) {
          isCallDrag = true;
        }

        if (!this.flag) {
          return;
        }

        this.startClients.forEach(function (client) {
          client.clientX -= deltaX;
          client.clientY -= deltaY;
        });
        this.prevClients.forEach(function (client) {
          client.clientX -= deltaX;
          client.clientY -= deltaY;
        });
        isCallDrag && this.onDrag(e, true);
      };

      __proto.move = function (_a, inputEvent, clients) {
        var deltaX = _a[0],
            deltaY = _a[1];

        if (clients === void 0) {
          clients = this.prevClients;
        }

        var customDist = this.customDist;
        var prevClients = this.prevClients;
        var startClients = this.startClients;
        var position = this.pinchFlag ? getPinchDragPosition(clients, prevClients, startClients, this.startPinchClients) : getPosition(clients[0], prevClients[0], startClients[0]);
        customDist[0] += deltaX;
        customDist[1] += deltaY;
        position.deltaX += deltaX;
        position.deltaY += deltaY;
        var positionDeltaX = position.deltaX,
            positionDeltaY = position.deltaY;
        position.distX += customDist[0];
        position.distY += customDist[1];
        this.movement += Math.sqrt(positionDeltaX * positionDeltaX + positionDeltaY * positionDeltaY);
        this.prevClients = clients;
        this.isDrag = true;
        return __assign$3({
          type: "drag",
          datas: this.datas
        }, position, {
          isDrag: this.isDrag,
          isPinch: this.isPinch,
          isScroll: false,
          inputEvent: inputEvent
        });
      };

      __proto.onPinchStart = function (e) {
        var _a, _b;

        var _c = this.options,
            pinchstart = _c.pinchstart,
            pinchThreshold = _c.pinchThreshold;

        if (this.isDrag && this.movement > pinchThreshold) {
          return;
        }

        var pinchClients = getClients(e.changedTouches);
        this.pinchFlag = true;

        (_a = this.startClients).push.apply(_a, pinchClients);

        (_b = this.prevClients).push.apply(_b, pinchClients);

        this.startDistance = getDist(this.prevClients);
        this.startPinchClients = this.prevClients.slice();

        if (!pinchstart) {
          return;
        }

        var startClients = this.prevClients;
        var startAverageClient = getAverageClient(startClients);
        var centerPosition = getPosition(startAverageClient, startAverageClient, startAverageClient);
        pinchstart(__assign$3({
          type: "pinchstart",
          datas: this.datas,
          touches: getPositions(startClients, startClients, startClients)
        }, centerPosition, {
          inputEvent: e
        }));
      };

      __proto.onPinch = function (e, clients) {
        if (!this.flag || !this.pinchFlag || clients.length < 2) {
          return;
        }

        this.isPinch = true;
        var pinch = this.options.pinch;

        if (!pinch) {
          return;
        }

        var prevClients = this.prevClients;
        var startClients = this.startClients;
        var centerPosition = getPosition(getAverageClient(clients), getAverageClient(prevClients), getAverageClient(startClients));
        var distance = getDist(clients);
        pinch(__assign$3({
          type: "pinch",
          datas: this.datas,
          touches: getPositions(clients, prevClients, startClients),
          scale: distance / this.startDistance,
          distance: distance
        }, centerPosition, {
          inputEvent: e
        }));
      };

      __proto.onPinchEnd = function (e) {
        if (!this.flag || !this.pinchFlag) {
          return;
        }

        var isPinch = this.isPinch;
        this.isPinch = false;
        this.pinchFlag = false;
        var pinchend = this.options.pinchend;

        if (!pinchend) {
          return;
        }

        var prevClients = this.prevClients;
        var startClients = this.startClients;
        var centerPosition = getPosition(getAverageClient(prevClients), getAverageClient(prevClients), getAverageClient(startClients));
        pinchend(__assign$3({
          type: "pinchend",
          datas: this.datas,
          isPinch: isPinch,
          touches: getPositions(prevClients, prevClients, startClients)
        }, centerPosition, {
          inputEvent: e
        }));
        this.isPinch = false;
        this.pinchFlag = false;
      };
      /**
       *
       */


      __proto.unset = function () {
        var _this = this;

        var targets = this.targets;
        var container = this.options.container;

        if (this.isMouse) {
          targets.forEach(function (target) {
            removeEvent(target, "mousedown", _this.onDragStart);
          });
          removeEvent(container, "mousemove", this.onDrag);
          removeEvent(container, "mouseup", this.onDragEnd);
        }

        if (this.isTouch) {
          targets.forEach(function (target) {
            removeEvent(target, "touchstart", _this.onDragStart);
          });
          removeEvent(container, "touchstart", this.onDragStart);
          removeEvent(container, "touchmove", this.onDrag);
          removeEvent(container, "touchend", this.onDragEnd);
          removeEvent(container, "touchcancel", this.onDragEnd);
        }
      };

      return Dragger;
    }();

    /*
    Copyright (c) 2019 Daybrush
    name: @scena/dragscroll
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/dragscroll.git
    version: 0.2.1
    */

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
    var extendStatics$3 = function (d, b) {
      extendStatics$3 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$3(d, b);
    };

    function __extends$3(d, b) {
      extendStatics$3(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function getDefaultScrollPosition(e) {
      var container = e.container;
      return [container.scrollLeft, container.scrollTop];
    }

    var DragScroll =
    /*#__PURE__*/
    function (_super) {
      __extends$3(DragScroll, _super);

      function DragScroll() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.startRect = null;
        _this.startPos = [];
        _this.prevTime = 0;
        _this.timer = 0;
        return _this;
      }

      var __proto = DragScroll.prototype;

      __proto.dragStart = function (e, options) {
        var _a = options.container.getBoundingClientRect(),
            top = _a.top,
            left = _a.left,
            width = _a.width,
            height = _a.height;

        this.startPos = [e.clientX, e.clientY];
        this.startRect = {
          top: top,
          left: left,
          width: width,
          height: height
        };
      };

      __proto.drag = function (e, options) {
        var _this = this;

        var clientX = e.clientX,
            clientY = e.clientY;
        var container = options.container,
            _a = options.threshold,
            threshold = _a === void 0 ? 0 : _a,
            _b = options.throttleTime,
            throttleTime = _b === void 0 ? 0 : _b,
            _c = options.getScrollPosition,
            getScrollPosition = _c === void 0 ? getDefaultScrollPosition : _c;

        var _d = this,
            startRect = _d.startRect,
            startPos = _d.startPos;

        var nowTime = now();
        var distTime = Math.max(throttleTime + this.prevTime - nowTime, 0);
        var direction = [0, 0];

        if (startRect.top > clientY - threshold) {
          if (startPos[1] > startRect.top || clientY < startPos[1]) {
            direction[1] = -1;
          }
        } else if (startRect.top + startRect.height < clientY + threshold) {
          if (startPos[1] < startRect.top + startRect.height || clientY > startPos[1]) {
            direction[1] = 1;
          }
        }

        if (startRect.left > clientX - threshold) {
          if (startPos[0] > startRect.left || clientX < startPos[0]) {
            direction[0] = -1;
          }
        } else if (startRect.left + startRect.width < clientX + threshold) {
          if (startPos[0] < startRect.left + startRect.width || clientX > startPos[0]) {
            direction[0] = 1;
          }
        }

        clearTimeout(this.timer);

        if (!direction[0] && !direction[1]) {
          return false;
        }

        if (distTime > 0) {
          this.timer = window.setTimeout(function () {
            _this.drag(e, options);
          }, distTime);
          return false;
        }

        this.prevTime = nowTime;
        var prevPos = getScrollPosition({
          container: container,
          direction: direction
        });
        this.trigger("scroll", {
          container: container,
          direction: direction,
          inputEvent: e
        });
        var nextPos = getScrollPosition({
          container: container,
          direction: direction
        });
        var offsetX = nextPos[0] - prevPos[0];
        var offsetY = nextPos[1] - prevPos[1];

        if (!offsetX && !offsetY) {
          return false;
        }

        this.trigger("move", {
          offsetX: direction[0] ? offsetX : 0,
          offsetY: direction[1] ? offsetY : 0,
          inputEvent: e
        });

        if (throttleTime) {
          this.timer = window.setTimeout(function () {
            _this.drag(e, options);
          }, throttleTime);
        }

        return true;
      };

      __proto.dragEnd = function () {
        clearTimeout(this.timer);
      };

      return DragScroll;
    }(Component);

    /*
    Copyright (c) 2019-present NAVER Corp.
    name: @egjs/children-differ
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-children-differ
    version: 1.0.0
    */

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
    var extendStatics$4 = function (d, b) {
      extendStatics$4 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$4(d, b);
    };

    function __extends$4(d, b) {
      extendStatics$4(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /*
    egjs-children-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var findKeyCallback = typeof Map === "function" ? undefined : function () {
      var childrenCount = 0;
      return function (el) {
        return el.__DIFF_KEY__ || (el.__DIFF_KEY__ = ++childrenCount);
      };
    }();

    /**
     * A module that checks diff when child are added, removed, or changed .
     * @ko 자식 노드들에서 자식 노드가 추가되거나 삭제되거나 순서가 변경된 사항을 체크하는 모듈입니다.
     * @memberof eg
     * @extends eg.ListDiffer
     */

    var ChildrenDiffer =
    /*#__PURE__*/
    function (_super) {
      __extends$4(ChildrenDiffer, _super);
      /**
       * @param - Initializing Children <ko> 초기 설정할 자식 노드들</ko>
       */


      function ChildrenDiffer(list) {
        if (list === void 0) {
          list = [];
        }

        return _super.call(this, list, findKeyCallback) || this;
      }

      return ChildrenDiffer;
    }(ListDiffer);

    /*
    Copyright (c) 2019 Daybrush
    name: react-moveable
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/moveable/blob/master/packages/react-moveable
    version: 0.20.1
    */

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
    var extendStatics$5 = function (d, b) {
      extendStatics$5 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$5(d, b);
    };

    function __extends$5(d, b) {
      extendStatics$5(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$4 = function () {
      __assign$4 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$4.apply(this, arguments);
    };

    function getSVGCursor(scale, degree) {
      return "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + 32 * scale + "px\" height=\"" + 32 * scale + "px\" viewBox=\"0 0 32 32\" ><path d=\"M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z\" stroke-linejoin=\"round\" stroke-width=\"1.2\" fill=\"black\" stroke=\"white\" style=\"transform:rotate(" + degree + "deg);transform-origin: 16px 16px\"></path></svg>";
    }

    function getCursorCSS(degree) {
      var x1 = getSVGCursor(1, degree);
      var x2 = getSVGCursor(2, degree);
      var degree45 = Math.round(degree / 45) * 45 % 180;
      var defaultCursor = degree45 === 135 ? "nwse-resize" : degree45 === 45 ? "nesw-resize" : degree45 === 90 ? "ew-resize" : "ns-resize"; // 135
      // tslint:disable-next-line: max-line-length

      return "cursor:" + defaultCursor + ";cursor: url('" + x1 + "') 16 16, " + defaultCursor + ";cursor: -webkit-image-set(url('" + x1 + "') 1x, url('" + x2 + "') 2x) 16 16, " + defaultCursor + ";";
    }

    var agent$1 = agent();
    var IS_WEBKIT = agent$1.os.name.indexOf("ios") > -1 || agent$1.browser.name.indexOf("safari") > -1;
    var PREFIX = "moveable-";
    var MOVEABLE_CSS = prefixCSS(PREFIX, "\n{\n\tposition: fixed;\n\twidth: 0;\n\theight: 0;\n\tleft: 0;\n\ttop: 0;\n    z-index: 3000;\n    --zoom: 1;\n    --zoompx: 1px;\n}\n.control-box {\n    z-index: 0;\n}\n.line, .control {\n\tleft: 0;\n    top: 0;\n    will-change: transform;\n}\n.control {\n\tposition: absolute;\n\twidth: 14px;\n\theight: 14px;\n\tborder-radius: 50%;\n\tborder: 2px solid #fff;\n\tbox-sizing: border-box;\n\tbackground: #4af;\n\tmargin-top: -7px;\n    margin-left: -7px;\n    width: calc(14 * var(--zoompx));\n    height: calc(14 * var(--zoompx));\n    margin-top: calc(-7 * var(--zoompx));\n    margin-left: calc(-7 * var(--zoompx));\n    border: calc(2 * var(--zoompx)) solid #fff;\n    z-index: 10;\n}\n.padding {\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    width: 100px;\n    height: 100px;\n    transform-origin: 0 0;\n    background: rgba(255, 100, 100, 0.3);\n}\n.line {\n\tposition: absolute;\n\twidth: 1px;\n    height: 1px;\n    width: var(--zoompx);\n    height: var(--zoompx);\n\tbackground: #4af;\n\ttransform-origin: 0px 50%;\n}\n.line.dashed {\n    box-sizing: border-box;\n    background: transparent;\n}\n.line.dashed.horizontal {\n    border-top: 1px dashed #4af;\n    border-top: var(--zoompx) dashed #4af;\n}\n.line.dashed.vertical {\n    border-left: 1px dashed #4af;\n    border-left: var(--zoompx) dashed #4af;\n}\n.line.dashed:before {\n    position: absolute;\n    content: attr(data-size);\n    color: #4af;\n    font-size: 12px;\n    font-weight: bold;\n}\n.line.dashed.horizontal:before, .line.gap.horizontal:before {\n    left: 50%;\n    transform: translateX(-50%);\n    bottom: 5px;\n}\n.line.dashed.vertical:before, .line.gap.vertical:before {\n    top: 50%;\n    transform: translateY(-50%);\n    left: 5px;\n}\n.line.rotation-line {\n\theight: 40px;\n    width: 1px;\n    transform-origin: 50% calc(100% - 0.5px);\n    top: -40px;\n    width: var(--zoompx);\n    height: calc(40 * var(--zoompx));\n    top: calc(-40 * var(--zoompx));\n    transform-origin: 50% calc(100% - 0.5 * var(--zoompx));\n}\n.line.rotation-line .control {\n\tborder-color: #4af;\n\tbackground:#fff;\n    cursor: alias;\n    left: 50%;\n}\n.line.vertical {\n    transform: translateX(-50%);\n}\n.line.horizontal {\n    transform: translateY(-50%);\n}\n.line.vertical.bold {\n    width: 2px;\n    width: calc(2 * var(--zoompx));\n}\n.line.horizontal.bold {\n    height: 2px;\n    height: calc(2 * var(--zoompx));\n}\n\n.line.gap {\n    background: #f55;\n}\n.line.gap:before {\n    position: absolute;\n    content: attr(data-size);\n    color: #f55;\n    font-size: 12px;\n    font-weight: bold;\n}\n.control.origin {\n\tborder-color: #f55;\n\tbackground: #fff;\n\twidth: 12px;\n\theight: 12px;\n\tmargin-top: -6px;\n    margin-left: -6px;\n    width: calc(12 * var(--zoompx));\n    height: calc(12 * var(--zoompx));\n    margin-top: calc(-6 * var(--zoompx));\n    margin-left: calc(-6 * var(--zoompx));\n\tpointer-events: none;\n}\n" + [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map(function (degree) {
      return "\n.direction[data-rotation=\"" + degree + "\"] {\n\t" + getCursorCSS(degree) + "\n}\n";
    }).join("\n") + "\n.group {\n    z-index: -1;\n}\n.area {\n    position: absolute;\n}\n.area-pieces {\n    position: absolute;\n    top: 0;\n    left: 0;\n    display: none;\n}\n.area.avoid {\n    pointer-events: none;\n}\n.area.avoid+.area-pieces {\n    display: block;\n}\n.area-piece {\n    position: absolute;\n}\n" + (IS_WEBKIT ? ":global svg *:before {\n\tcontent:\"\";\n\ttransform-origin: inherit;\n}" : "") + "\n");
    var NEARBY_POS = [[0, 1, 2], [1, 0, 3], [2, 0, 3], [3, 1, 2]];
    var TINY_NUM = 0.0000001;
    var MIN_SCALE = 0.000000001;
    var MAX_NUM = Math.pow(10, 10);
    var MIN_NUM = -MAX_NUM;
    var DIRECTION_INDEXES = {
      n: [0, 1],
      s: [2, 3],
      w: [2, 0],
      e: [1, 3],
      nw: [0],
      ne: [1],
      sw: [2],
      se: [3]
    };
    var DIRECTION_ROTATIONS = {
      n: 0,
      s: 180,
      w: 270,
      e: 90,
      nw: 315,
      ne: 45,
      sw: 225,
      se: 135
    };

    function multiply2(pos1, pos2) {
      return [pos1[0] * pos2[0], pos1[1] * pos2[1]];
    }
    function prefix() {
      var classNames = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        classNames[_i] = arguments[_i];
      }

      return prefixNames.apply(void 0, [PREFIX].concat(classNames));
    }
    function createIdentityMatrix3() {
      return createIdentityMatrix(3);
    }
    function getTransformMatrix(transform) {
      if (!transform || transform === "none") {
        return [1, 0, 0, 1, 0, 0];
      }

      if (isObject(transform)) {
        return transform;
      }

      var value = splitBracket(transform).value;
      return value.split(/s*,\s*/g).map(function (v) {
        return parseFloat(v);
      });
    }
    function getAbsoluteMatrix(matrix, n, origin) {
      return multiplies(n, createOriginMatrix(origin, n), matrix, createOriginMatrix(origin.map(function (a) {
        return -a;
      }), n));
    }
    function measureSVGSize(el, unit, isHorizontal) {
      if (unit === "%") {
        var viewBox = getSVGViewBox(el.ownerSVGElement);
        return viewBox[isHorizontal ? "width" : "height"] / 100;
      }

      return 1;
    }
    function getBeforeTransformOrigin(el) {
      var relativeOrigin = getTransformOrigin(getComputedStyle(el, ":before"));
      return relativeOrigin.map(function (o, i) {
        var _a = splitUnit(o),
            value = _a.value,
            unit = _a.unit;

        return value * measureSVGSize(el, unit, i === 0);
      });
    }
    function getTransformOrigin(style) {
      var transformOrigin = style.transformOrigin;
      return transformOrigin ? transformOrigin.split(" ") : ["0", "0"];
    }
    function getOffsetInfo(el, lastParent, isParent) {
      var body = document.body;
      var target = !el || isParent ? el : el.parentElement;
      var isEnd = false;
      var position = "relative";

      while (target && target !== body) {
        if (lastParent === target) {
          isEnd = true;
        }

        var style = getComputedStyle(target);
        var transform = style.transform;
        position = style.position;

        if (position !== "static" || transform && transform !== "none") {
          break;
        }

        target = target.parentElement;
        position = "relative";
      }

      return {
        isStatic: position === "static",
        isEnd: isEnd || !target || target === body,
        offsetParent: target || body
      };
    }
    function getOffsetPosInfo(el, container, style, isFixed) {
      var _a;

      var tagName = el.tagName.toLowerCase();
      var offsetLeft = el.offsetLeft;
      var offsetTop = el.offsetTop;

      if (isFixed) {
        var containerClientRect = (container || document.documentElement).getBoundingClientRect();
        offsetLeft -= containerClientRect.left;
        offsetTop -= containerClientRect.top;
      } // svg


      var isSVG = isUndefined$1(offsetLeft);
      var hasOffset = !isSVG;
      var origin; // inner svg element

      if (!hasOffset && tagName !== "svg") {
        origin = IS_WEBKIT ? getBeforeTransformOrigin(el) : getTransformOrigin(style).map(function (pos) {
          return parseFloat(pos);
        });
        hasOffset = true;

        if (tagName === "g") {
          offsetLeft = 0;
          offsetTop = 0;
        } else {
          _a = getSVGGraphicsOffset(el, origin), offsetLeft = _a[0], offsetTop = _a[1], origin[0] = _a[2], origin[1] = _a[3];
        }
      } else {
        origin = getTransformOrigin(style).map(function (pos) {
          return parseFloat(pos);
        });
      }

      return {
        isSVG: isSVG,
        hasOffset: hasOffset,
        offset: [offsetLeft, offsetTop],
        origin: origin
      };
    }
    function getMatrixStackInfo(target, container, prevMatrix) {
      var el = target;
      var matrixes = [];
      var isEnd = false;
      var is3d = false;
      var n = 3;
      var transformOrigin;
      var targetMatrix;
      var offsetContainer = getOffsetInfo(container, container, true).offsetParent;

      if (prevMatrix) {
        isEnd = target === container;

        if (prevMatrix.length > 10) {
          is3d = true;
          n = 4;
        }

        container = target.parentElement;
      }

      while (el && !isEnd) {
        var style = getComputedStyle(el);
        var tagName = el.tagName.toLowerCase();
        var position = style.position;
        var isFixed = position === "fixed";
        var styleTransform = style.transform;
        var matrix = convertCSStoMatrix(getTransformMatrix(styleTransform)); // convert 3 to 4

        var length = matrix.length;

        if (!is3d && length === 16) {
          is3d = true;
          n = 4;
          var matrixesLength = matrixes.length;

          for (var i = 0; i < matrixesLength; ++i) {
            matrixes[i] = convertDimension(matrixes[i], 3, 4);
          }
        }

        if (is3d && length === 9) {
          matrix = convertDimension(matrix, 3, 4);
        }

        var _a = getOffsetPosInfo(el, container, style, isFixed),
            hasOffset = _a.hasOffset,
            isSVG = _a.isSVG,
            origin = _a.origin,
            offsetPos = _a.offset;

        var offsetLeft = offsetPos[0],
            offsetTop = offsetPos[1];

        if (tagName === "svg" && targetMatrix) {
          matrixes.push( // scale matrix for svg's SVGElements.
          getSVGMatrix(el, n), createIdentityMatrix(n));
        }

        var _b = getOffsetInfo(el, container),
            offsetParent = _b.offsetParent,
            isOffsetEnd = _b.isEnd,
            isStatic = _b.isStatic;

        if (IS_WEBKIT && hasOffset && !isSVG && isStatic && position === "relative") {
          offsetLeft -= offsetParent.offsetLeft;
          offsetTop -= offsetParent.offsetTop;
          isEnd = isEnd || isOffsetEnd;
        }

        var parentClientLeft = 0;
        var parentClientTop = 0;

        if (hasOffset && offsetContainer !== offsetParent) {
          // border
          parentClientLeft = offsetParent.clientLeft;
          parentClientTop = offsetParent.clientTop;
        }

        matrixes.push( // absolute matrix
        getAbsoluteMatrix(matrix, n, origin), // offset matrix (offsetPos + clientPos(border))
        createOriginMatrix(hasOffset ? [offsetLeft - el.scrollLeft + parentClientLeft, offsetTop - el.scrollTop + parentClientTop] : [el, origin], n));

        if (!targetMatrix) {
          targetMatrix = matrix;
        }

        if (!transformOrigin) {
          transformOrigin = origin;
        }

        if (isEnd || isFixed) {
          break;
        } else {
          el = offsetParent;
          isEnd = isOffsetEnd;
        }
      }

      if (!targetMatrix) {
        targetMatrix = createIdentityMatrix(n);
      }

      if (!transformOrigin) {
        transformOrigin = [0, 0];
      }

      return {
        offsetContainer: offsetContainer,
        matrixes: matrixes,
        targetMatrix: targetMatrix,
        transformOrigin: transformOrigin,
        is3d: is3d
      };
    }
    function caculateMatrixStack(target, container, rootContainer, prevMatrix, prevRootMatrix, prevN) {
      var _a = getMatrixStackInfo(target, container, prevMatrix),
          matrixes = _a.matrixes,
          is3d = _a.is3d,
          prevTargetMatrix = _a.targetMatrix,
          transformOrigin = _a.transformOrigin,
          offsetContainer = _a.offsetContainer;

      var _b = getMatrixStackInfo(offsetContainer, rootContainer, prevRootMatrix),
          rootMatrixes = _b.matrixes,
          isRoot3d = _b.is3d;

      var n = isRoot3d || is3d ? 4 : 3;
      var isSVGGraphicElement = target.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in target;
      var originalContainer = container || document.body;
      var allMatrix = prevMatrix ? convertDimension(prevMatrix, prevN, n) : createIdentityMatrix(n);
      var targetMatrix = prevTargetMatrix;
      var rootMatrix = prevRootMatrix ? convertDimension(prevRootMatrix, prevN, n) : createIdentityMatrix(n);
      var beforeMatrix = prevMatrix ? convertDimension(prevMatrix, prevN, n) : createIdentityMatrix(n);
      var offsetMatrix = createIdentityMatrix(n);
      var length = matrixes.length;
      var endContainer = getOffsetInfo(originalContainer, originalContainer, true).offsetParent;
      rootMatrixes.reverse();
      matrixes.reverse();

      if (!is3d && isRoot3d) {
        targetMatrix = convertDimension(targetMatrix, 3, 4);
        matrixes.forEach(function (matrix, i) {
          matrixes[i] = convertDimension(matrix, 3, 4);
        });
      }

      if (is3d && !isRoot3d) {
        rootMatrixes.forEach(function (matrix, i) {
          rootMatrixes[i] = convertDimension(matrix, 3, 4);
        });
      } // rootMatrix = (...) -> container -> offset -> absolute -> offset -> absolute(targetMatrix)
      // beforeMatrix = (... -> container -> offset -> absolute) -> offset -> absolute(targetMatrix)
      // offsetMatrix = (... -> container -> offset -> absolute -> offset) -> absolute(targetMatrix)


      if (!prevRootMatrix) {
        rootMatrixes.forEach(function (matrix) {
          rootMatrix = multiply(rootMatrix, matrix, n);
        });
      }

      matrixes.forEach(function (matrix, i) {
        var _a;

        if (length - 2 === i) {
          // length - 3
          beforeMatrix = allMatrix.slice();
        }

        if (length - 1 === i) {
          // length - 2
          offsetMatrix = allMatrix.slice();
        } // caculate for SVGElement


        if (isObject(matrix[n - 1])) {
          _a = getSVGOffset(matrix[n - 1], endContainer, n, matrix[2 * n - 1], allMatrix, matrixes[i + 1]), matrix[n - 1] = _a[0], matrix[2 * n - 1] = _a[1];
        }

        allMatrix = multiply(allMatrix, matrix, n);
      });
      var isMatrix3d = !isSVGGraphicElement && is3d;

      if (!targetMatrix) {
        targetMatrix = createIdentityMatrix(isMatrix3d ? 4 : 3);
      }

      var transform = (isMatrix3d ? "matrix3d" : "matrix") + "(" + convertMatrixtoCSS(isSVGGraphicElement && targetMatrix.length === 16 ? convertDimension(targetMatrix, 4, 3) : targetMatrix) + ")";
      rootMatrix = ignoreDimension(rootMatrix, n, n);
      return [rootMatrix, beforeMatrix, offsetMatrix, allMatrix, targetMatrix, transform, transformOrigin, is3d || isRoot3d];
    }
    function getSVGViewBox(el) {
      var clientWidth = el.clientWidth;
      var clientHeight = el.clientHeight;
      var viewBox = el.viewBox;
      var baseVal = viewBox && viewBox.baseVal || {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
      return {
        x: baseVal.x,
        y: baseVal.y,
        width: baseVal.width || clientWidth,
        height: baseVal.height || clientHeight
      };
    }
    function getSVGMatrix(el, n) {
      var clientWidth = el.clientWidth;
      var clientHeight = el.clientHeight;

      var _a = getSVGViewBox(el),
          viewBoxWidth = _a.width,
          viewBoxHeight = _a.height;

      var scaleX = clientWidth / viewBoxWidth;
      var scaleY = clientHeight / viewBoxHeight;
      var preserveAspectRatio = el.preserveAspectRatio.baseVal; // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio

      var align = preserveAspectRatio.align; // 1 : meet 2: slice

      var meetOrSlice = preserveAspectRatio.meetOrSlice;
      var svgOrigin = [0, 0];
      var scale = [scaleX, scaleY];
      var translate = [0, 0];

      if (align !== 1) {
        var xAlign = (align - 2) % 3;
        var yAlign = Math.floor((align - 2) / 3);
        svgOrigin[0] = viewBoxWidth * xAlign / 2;
        svgOrigin[1] = viewBoxHeight * yAlign / 2;
        var scaleDimension = meetOrSlice === 2 ? Math.max(scaleY, scaleX) : Math.min(scaleX, scaleY);
        scale[0] = scaleDimension;
        scale[1] = scaleDimension;
        translate[0] = (clientWidth - viewBoxWidth) / 2 * xAlign;
        translate[1] = (clientHeight - viewBoxHeight) / 2 * yAlign;
      }

      var scaleMatrix = createScaleMatrix(scale, n);
      scaleMatrix[n - 1] = translate[0], scaleMatrix[2 * n - 1] = translate[1];
      return getAbsoluteMatrix(scaleMatrix, n, svgOrigin);
    }
    function getSVGGraphicsOffset(el, origin) {
      if (!el.getBBox) {
        return [0, 0];
      }

      var bbox = el.getBBox();
      var viewBox = getSVGViewBox(el.ownerSVGElement);
      var left = bbox.x - viewBox.x;
      var top = bbox.y - viewBox.y;
      return [left, top, origin[0] - left, origin[1] - top];
    }
    function caculatePosition(matrix, pos, n) {
      return caculate(matrix, convertPositionMatrix(pos, n), n);
    }
    function caculatePoses(matrix, width, height, n) {
      return [[0, 0], [width, 0], [0, height], [width, height]].map(function (pos) {
        return caculatePosition(matrix, pos, n);
      });
    }
    function getRect(poses) {
      var posesX = poses.map(function (pos) {
        return pos[0];
      });
      var posesY = poses.map(function (pos) {
        return pos[1];
      });
      var left = Math.min.apply(Math, posesX);
      var top = Math.min.apply(Math, posesY);
      var right = Math.max.apply(Math, posesX);
      var bottom = Math.max.apply(Math, posesY);
      var rectWidth = right - left;
      var rectHeight = bottom - top;
      return {
        left: left,
        top: top,
        right: right,
        bottom: bottom,
        width: rectWidth,
        height: rectHeight
      };
    }
    function caculateRect(matrix, width, height, n) {
      var poses = caculatePoses(matrix, width, height, n);
      return getRect(poses);
    }
    function getSVGOffset(el, container, n, origin, beforeMatrix, absoluteMatrix) {
      var _a;

      var _b = getSize(el),
          width = _b[0],
          height = _b[1];

      var containerClientRect = container.getBoundingClientRect();
      var rect = el.getBoundingClientRect();
      var rectLeft = rect.left - containerClientRect.left + container.scrollLeft;
      var rectTop = rect.top - containerClientRect.top + container.scrollTop;
      var rectWidth = rect.width;
      var rectHeight = rect.height;
      var mat = multiplies(n, beforeMatrix, absoluteMatrix);

      var _c = caculateRect(mat, width, height, n),
          prevLeft = _c.left,
          prevTop = _c.top,
          prevWidth = _c.width,
          prevHeight = _c.height;

      var posOrigin = caculatePosition(mat, origin, n);
      var prevOrigin = minus(posOrigin, [prevLeft, prevTop]);
      var rectOrigin = [rectLeft + prevOrigin[0] * rectWidth / prevWidth, rectTop + prevOrigin[1] * rectHeight / prevHeight];
      var offset = [0, 0];
      var count = 0;

      while (++count < 10) {
        var inverseBeforeMatrix = invert(beforeMatrix, n);
        _a = minus(caculatePosition(inverseBeforeMatrix, rectOrigin, n), caculatePosition(inverseBeforeMatrix, posOrigin, n)), offset[0] = _a[0], offset[1] = _a[1];
        var mat2 = multiplies(n, beforeMatrix, createOriginMatrix(offset, n), absoluteMatrix);

        var _d = caculateRect(mat2, width, height, n),
            nextLeft = _d.left,
            nextTop = _d.top;

        var distLeft = nextLeft - rectLeft;
        var distTop = nextTop - rectTop;

        if (Math.abs(distLeft) < 2 && Math.abs(distTop) < 2) {
          break;
        }

        rectOrigin[0] -= distLeft;
        rectOrigin[1] -= distTop;
      }

      return offset.map(function (p) {
        return Math.round(p);
      });
    }
    function caculateMoveablePosition(matrix, origin, width, height) {
      var is3d = matrix.length === 16;
      var n = is3d ? 4 : 3;

      var _a = caculatePoses(matrix, width, height, n),
          _b = _a[0],
          x1 = _b[0],
          y1 = _b[1],
          _c = _a[1],
          x2 = _c[0],
          y2 = _c[1],
          _d = _a[2],
          x3 = _d[0],
          y3 = _d[1],
          _e = _a[3],
          x4 = _e[0],
          y4 = _e[1];

      var _f = caculatePosition(matrix, origin, n),
          originX = _f[0],
          originY = _f[1];

      var left = Math.min(x1, x2, x3, x4);
      var top = Math.min(y1, y2, y3, y4);
      var right = Math.max(x1, x2, x3, x4);
      var bottom = Math.max(y1, y2, y3, y4);
      x1 = x1 - left || 0;
      x2 = x2 - left || 0;
      x3 = x3 - left || 0;
      x4 = x4 - left || 0;
      y1 = y1 - top || 0;
      y2 = y2 - top || 0;
      y3 = y3 - top || 0;
      y4 = y4 - top || 0;
      originX = originX - left || 0;
      originY = originY - top || 0;
      var center = [(x1 + x2 + x3 + x4) / 4, (y1 + y2 + y3 + y4) / 4];
      var pos1Rad = getRad(center, [x1, y1]);
      var pos2Rad = getRad(center, [x2, y2]);
      var direction = pos1Rad < pos2Rad && pos2Rad - pos1Rad < Math.PI || pos1Rad > pos2Rad && pos2Rad - pos1Rad < -Math.PI ? 1 : -1;
      return [[left, top, right, bottom], [originX, originY], [[x1, y1], [x2, y2], [x3, y3], [x4, y4]], direction];
    }
    function getDistSize(vec) {
      return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }
    function getDiagonalSize(pos1, pos2) {
      return getDistSize([pos2[0] - pos1[0], pos2[1] - pos1[1]]);
    }
    function getLineStyle(pos1, pos2, rad) {
      if (rad === void 0) {
        rad = getRad(pos1, pos2);
      }

      var width = getDiagonalSize(pos1, pos2);
      return {
        transform: "translateY(-50%) translate(" + pos1[0] + "px, " + pos1[1] + "px) rotate(" + rad + "rad)",
        width: width + "px"
      };
    }
    function getControlTransform(rotation) {
      var poses = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        poses[_i - 1] = arguments[_i];
      }

      var length = poses.length;
      var x = poses.reduce(function (prev, pos) {
        return prev + pos[0];
      }, 0) / length;
      var y = poses.reduce(function (prev, pos) {
        return prev + pos[1];
      }, 0) / length;
      return {
        transform: "translate(" + x + "px, " + y + "px) rotate(" + rotation + "rad)"
      };
    }
    function getCSSSize(target) {
      var style = window.getComputedStyle(target);
      return [parseFloat(style.width), parseFloat(style.height)];
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
      var hasOffset = !isUndefined$1(width);

      if ((isOffset || isBoxSizing) && hasOffset) {
        return [width, height];
      }

      width = target.clientWidth;
      height = target.clientHeight;

      if (!hasOffset && !width && !height) {
        var bbox = target.getBBox();
        return [bbox.width, bbox.height];
      }

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
    function getRotationRad(poses, direction) {
      return getRad(direction > 0 ? poses[0] : poses[1], direction > 0 ? poses[1] : poses[0]);
    }
    function getTargetInfo(target, container, parentContainer, rootContainer, state) {
      var _a, _b, _c, _d, _e;

      var left = 0;
      var top = 0;
      var right = 0;
      var bottom = 0;
      var origin = [0, 0];
      var poses = [[0, 0], [0, 0], [0, 0], [0, 0]];
      var rootMatrix = createIdentityMatrix3();
      var offsetMatrix = createIdentityMatrix3();
      var beforeMatrix = createIdentityMatrix3();
      var matrix = createIdentityMatrix3();
      var targetMatrix = createIdentityMatrix3();
      var width = 0;
      var height = 0;
      var transformOrigin = [0, 0];
      var direction = 1;
      var beforeDirection = 1;
      var is3d = false;
      var targetTransform = "";
      var beforeOrigin = [0, 0];
      var targetClientRect = resetClientRect();
      var containerClientRect = resetClientRect();
      var rotation = 0;
      var prevMatrix = state ? state.beforeMatrix : undefined;
      var prevRootMatrix = state ? state.rootMatrix : undefined;
      var prevN = state ? state.is3d ? 4 : 3 : undefined;

      if (target) {
        if (state) {
          width = state.width;
          height = state.height;
        } else {
          var style = getComputedStyle(target);
          width = target.offsetWidth;
          height = target.offsetHeight;

          if (isUndefined$1(width)) {
            _a = getSize(target, style, true), width = _a[0], height = _a[1];
          }
        }

        _b = caculateMatrixStack(target, container, rootContainer, prevMatrix, prevRootMatrix, prevN), rootMatrix = _b[0], beforeMatrix = _b[1], offsetMatrix = _b[2], matrix = _b[3], targetMatrix = _b[4], targetTransform = _b[5], transformOrigin = _b[6], is3d = _b[7];
        _c = caculateMoveablePosition(matrix, transformOrigin, width, height), _d = _c[0], left = _d[0], top = _d[1], right = _d[2], bottom = _d[3], origin = _c[1], poses = _c[2], direction = _c[3];
        var n = is3d ? 4 : 3;
        var beforePos = [0, 0];
        _e = caculateMoveablePosition(offsetMatrix, plus(transformOrigin, getOrigin(targetMatrix, n)), width, height), beforePos = _e[0], beforeOrigin = _e[1], beforeDirection = _e[3];
        beforeOrigin = [beforeOrigin[0] + beforePos[0] - left, beforeOrigin[1] + beforePos[1] - top];
        targetClientRect = getClientRect(target);
        containerClientRect = getClientRect(getOffsetInfo(parentContainer, parentContainer, true).offsetParent || document.body, true);
        rotation = getRotationRad([poses[0], poses[1]], direction);
      }

      return {
        rotation: rotation,
        targetClientRect: targetClientRect,
        containerClientRect: containerClientRect,
        beforeDirection: beforeDirection,
        direction: direction,
        target: target,
        left: left,
        top: top,
        right: right,
        bottom: bottom,
        pos1: poses[0],
        pos2: poses[1],
        pos3: poses[2],
        pos4: poses[3],
        width: width,
        height: height,
        rootMatrix: rootMatrix,
        beforeMatrix: beforeMatrix,
        offsetMatrix: offsetMatrix,
        targetMatrix: targetMatrix,
        matrix: matrix,
        targetTransform: targetTransform,
        is3d: is3d,
        beforeOrigin: beforeOrigin,
        origin: origin,
        transformOrigin: transformOrigin
      };
    }
    function resetClientRect() {
      return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
        clientLeft: 0,
        clientTop: 0,
        clientWidth: 0,
        clientHeight: 0,
        scrollWidth: 0,
        scrollHeight: 0
      };
    }
    function getClientRect(el, isExtends) {
      var _a = el.getBoundingClientRect(),
          left = _a.left,
          width = _a.width,
          top = _a.top,
          bottom = _a.bottom,
          right = _a.right,
          height = _a.height;

      var rect = {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        width: width,
        height: height
      };

      if (isExtends) {
        rect.clientLeft = el.clientLeft;
        rect.clientTop = el.clientTop;
        rect.clientWidth = el.clientWidth;
        rect.clientHeight = el.clientHeight;
        rect.scrollWidth = el.scrollWidth;
        rect.scrollHeight = el.scrollHeight;
      }

      return rect;
    }
    function getDirection(target) {
      if (!target) {
        return;
      }

      var direciton = target.getAttribute("data-direction");

      if (!direciton) {
        return;
      }

      var dir = [0, 0];
      direciton.indexOf("w") > -1 && (dir[0] = -1);
      direciton.indexOf("e") > -1 && (dir[0] = 1);
      direciton.indexOf("n") > -1 && (dir[1] = -1);
      direciton.indexOf("s") > -1 && (dir[1] = 1);
      return dir;
    }
    function getAbsolutePoses(poses, dist) {
      return [plus(dist, poses[0]), plus(dist, poses[1]), plus(dist, poses[2]), plus(dist, poses[3])];
    }
    function getAbsolutePosesByState(_a) {
      var left = _a.left,
          top = _a.top,
          pos1 = _a.pos1,
          pos2 = _a.pos2,
          pos3 = _a.pos3,
          pos4 = _a.pos4;
      return getAbsolutePoses([pos1, pos2, pos3, pos4], [left, top]);
    }
    function roundSign(num) {
      return Math.round(num % 1 === -0.5 ? num - 1 : num);
    }
    function throttle(num, unit) {
      if (!unit) {
        return num;
      }

      return Math.round(num / unit) * unit;
    }
    function throttleArray(nums, unit) {
      nums.forEach(function (_, i) {
        nums[i] = throttle(nums[i], unit);
      });
      return nums;
    }
    function unset(self, name) {
      if (self[name]) {
        self[name].unset();
        self[name] = null;
      }
    }
    function getOrientationDirection(pos, pos1, pos2) {
      return (pos[0] - pos1[0]) * (pos2[1] - pos1[1]) - (pos[1] - pos1[1]) * (pos2[0] - pos1[0]);
    }
    function isInside(pos, pos1, pos2, pos3, pos4) {
      var k1 = getOrientationDirection(pos, pos1, pos2);
      var k2 = getOrientationDirection(pos, pos2, pos3);
      var k3 = getOrientationDirection(pos, pos3, pos1);
      var k4 = getOrientationDirection(pos, pos2, pos3);
      var k5 = getOrientationDirection(pos, pos3, pos4);
      var k6 = getOrientationDirection(pos, pos4, pos2);
      var signs1 = [k1, k2, k3];
      var signs2 = [k4, k5, k6];

      if (signs1.every(function (sign) {
        return sign >= 0;
      }) || signs1.every(function (sign) {
        return sign <= 0;
      }) || signs2.every(function (sign) {
        return sign >= 0;
      }) || signs2.every(function (sign) {
        return sign <= 0;
      })) {
        return true;
      }

      return false;
    }
    function fillParams(moveable, e, params) {
      var datas = e.datas;

      if (!datas.datas) {
        datas.datas = {};
      }

      return __assign$4({}, params, {
        target: moveable.state.target,
        clientX: e.clientX,
        clientY: e.clientY,
        inputEvent: e.inputEvent,
        currentTarget: moveable,
        datas: datas.datas
      });
    }
    function triggerEvent(moveable, name, params, isManager) {
      if (isManager) {
        MoveableManager.prototype.triggerEvent.call(moveable, name, params);
      }

      return moveable.triggerEvent(name, params);
    }
    function getComputedStyle(el, pseudoElt) {
      return window.getComputedStyle(el, pseudoElt);
    }
    function filterAbles(ables, methods, triggerAblesSimultaneously) {
      var enabledAbles = {};
      var ableGroups = {};
      return ables.filter(function (able) {
        var name = able.name;

        if (enabledAbles[name] || !methods.some(function (method) {
          return able[method];
        })) {
          return false;
        }

        if (!triggerAblesSimultaneously && able.ableGroup) {
          if (ableGroups[able.ableGroup]) {
            return false;
          }

          ableGroups[able.ableGroup] = true;
        }

        enabledAbles[name] = true;
        return true;
      });
    }
    function getKeepRatioHeight(width, isWidth, ratio) {
      return width * (isWidth ? ratio : 1 / ratio);
    }
    function getKeepRatioWidth(height, isWidth, ratio) {
      return height * (isWidth ? 1 / ratio : ratio);
    }
    function equals(a1, a2) {
      return a1 === a2 || a1 == null && a2 == null;
    }
    function selectValue() {
      var values = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
      }

      var length = values.length - 1;

      for (var i = 0; i < length; ++i) {
        var value = values[i];

        if (!isUndefined$1(value)) {
          return value;
        }
      }

      return values[length];
    }
    function groupBy(arr, func) {
      var groups = [];
      var groupKeys = [];
      arr.forEach(function (el, index) {
        var groupKey = func(el, index, arr);
        var keyIndex = groupKeys.indexOf(groupKey);
        var group = groups[keyIndex] || [];

        if (keyIndex === -1) {
          groupKeys.push(groupKey);
          groups.push(group);
        }

        group.push(el);
      });
      return groups;
    }
    function groupByMap(arr, func) {
      var groups = [];
      var groupKeys = {};
      arr.forEach(function (el, index) {
        var groupKey = func(el, index, arr);
        var group = groupKeys[groupKey];

        if (!group) {
          group = [];
          groupKeys[groupKey] = group;
          groups.push(group);
        }

        group.push(el);
      });
      return groups;
    }
    function flat$1(arr) {
      return arr.reduce(function (prev, cur) {
        return prev.concat(cur);
      }, []);
    }
    function maxOffset() {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      args.sort(function (a, b) {
        return Math.abs(b) - Math.abs(a);
      });
      return args[0];
    }
    function minOffset() {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      args.sort(function (a, b) {
        return Math.abs(a) - Math.abs(b);
      });
      return args[0];
    }
    function caculateInversePosition(matrix, pos, n) {
      return caculate(invert(matrix, n), convertPositionMatrix(pos, n), n);
    }
    function convertDragDist(state, e) {
      var _a;

      var is3d = state.is3d,
          rootMatrix = state.rootMatrix;
      var n = is3d ? 4 : 3;
      _a = caculateInversePosition(rootMatrix, [e.distX, e.distY], n), e.distX = _a[0], e.distY = _a[1];
      return e;
    }
    function caculatePadding(matrix, pos, transformOrigin, origin, n) {
      return minus(caculatePosition(matrix, plus(transformOrigin, pos), n), origin);
    }

    function triggerRenderStart(moveable, isGroup, e) {
      var params = fillParams(moveable, e, {
        isPinch: !!e.isPinch
      });
      var eventAffix = isGroup ? "Group" : "";

      if (isGroup) {
        params.targets = moveable.props.targets;
      }

      triggerEvent(moveable, "onRender" + eventAffix + "Start", params);
    }
    function triggerRender(moveable, isGroup, e) {
      var params = fillParams(moveable, e, {
        isPinch: !!e.isPinch
      });
      var eventAffix = isGroup ? "Group" : "";

      if (isGroup) {
        params.targets = moveable.props.targets;
      }

      triggerEvent(moveable, "onRender" + eventAffix, params);
    }
    function triggerRenderEnd(moveable, isGroup, e) {
      var params = fillParams(moveable, e, {
        isPinch: !!e.sPinch,
        isDrag: e.isDrag
      });
      var eventAffix = isGroup ? "Group" : "";

      if (isGroup) {
        params.targets = moveable.props.targets;
      }

      triggerEvent(moveable, "onRender" + eventAffix + "End", params);
    }

    function triggerAble(moveable, ableType, eventOperation, eventAffix, eventType, e, isReqeust) {
      var isStart = eventType === "Start";

      if (isStart && eventAffix.indexOf("Control") > -1 && !e.isRequest && moveable.areaElement === e.inputEvent.target) {
        return false;
      }

      var eventName = "" + eventOperation + eventAffix + eventType;
      var conditionName = "" + eventOperation + eventAffix + "Condition";
      var isEnd = eventType === "End";
      var isAfter = eventType.indexOf("After") > -1;

      if (isStart) {
        moveable.updateRect(eventType, true, false);
      }

      if (eventType === "" && !isAfter) {
        convertDragDist(moveable.state, e);
      }

      var isGroup = eventAffix.indexOf("Group") > -1;
      var ables = moveable[ableType];

      if (!ables.length) {
        return false;
      }

      var events = ables.filter(function (able) {
        return able[eventName];
      });
      var datas = e.datas;
      var renderDatas = datas.render || (datas.render = {});

      var renderEvent = __assign$4({}, e, {
        datas: renderDatas,
        originalDatas: datas
      });

      var results = events.filter(function (able) {
        var condition = isStart && able[conditionName];
        var ableName = able.name;
        var nextDatas = datas[ableName] || (datas[ableName] = {});

        if (!condition || condition(e, moveable)) {
          return able[eventName](moveable, __assign$4({}, e, {
            datas: nextDatas,
            originalDatas: datas
          }));
        }

        return false;
      });
      var isUpdate = results.length;

      if (isStart) {
        if (events.length && !isUpdate) {
          moveable.state.dragger = null;

          if (moveable.moveables) {
            moveable.moveables.forEach(function (childeMoveable) {
              childeMoveable.state.dragger = null;
            });
          }

          return false;
        }

        triggerRenderStart(moveable, isGroup, renderEvent);
      } else if (isEnd) {
        triggerRenderEnd(moveable, isGroup, renderEvent);
      } else if (isUpdate) {
        triggerRender(moveable, isGroup, renderEvent);
      }

      if (isEnd) {
        moveable.state.dragger = null;
      }

      if (moveable.isUnmounted) {
        return false;
      }

      if (!isStart && isUpdate) {
        if (results.some(function (able) {
          return able.updateRect;
        }) && !isGroup) {
          moveable.updateRect(eventType, false, false);
        } else {
          moveable.updateRect(eventType, true, false);
        }
      }

      if ((!isStart && isUpdate || isEnd && !isUpdate) && !isReqeust) {
        moveable.forceUpdate();
      }

      if (!isStart && !isEnd && !isAfter && isUpdate) {
        triggerAble(moveable, ableType, eventOperation, eventAffix, eventType + "After", e);
      }
    }
    function getTargetAbleDragger(moveable, moveableTarget, eventAffix) {
      var controlBox = moveable.controlBox.getElement();
      var targets = [];
      targets.push(controlBox);

      if (!moveable.props.dragArea) {
        targets.push(moveableTarget);
      }

      var startFunc = function (e) {
        var eventTarget = e.inputEvent.target;
        var areaElement = moveable.areaElement;
        return eventTarget === areaElement || !moveable.isMoveableElement(eventTarget) || eventTarget.className.indexOf("moveable-area") > -1 || eventTarget.className.indexOf("moveable-padding") > -1;
      };

      return getAbleDragger(moveable, targets, "targetAbles", eventAffix, {
        dragstart: startFunc,
        pinchstart: startFunc
      });
    }
    function getAbleDragger(moveable, target, ableType, eventAffix, conditionFunctions) {
      if (conditionFunctions === void 0) {
        conditionFunctions = {};
      }

      var _a = moveable.props,
          pinchOutside = _a.pinchOutside,
          pinchThreshold = _a.pinchThreshold;
      var options = {
        container: window,
        pinchThreshold: pinchThreshold,
        pinchOutside: pinchOutside
      };
      ["drag", "pinch"].forEach(function (eventOperation) {
        ["Start", "", "End"].forEach(function (eventType) {
          var eventName = "" + eventOperation + eventType.toLowerCase();

          options[eventName] = function (e) {
            if (conditionFunctions[eventName] && !conditionFunctions[eventName](e)) {
              return false;
            }

            return triggerAble(moveable, ableType, eventOperation, eventAffix, eventType, e);
          };
        });
      });
      return new Dragger(target, options);
    }

    var ControlBoxElement = styled$1("div", MOVEABLE_CSS);

    function renderLine(direction, pos1, pos2, index) {
      var rad = getRad(pos1, pos2);
      var rotation = direction ? throttle(rad / Math.PI * 180, 15) % 180 : -1;
      return createElement("div", {
        key: "line" + index,
        className: prefix("line", "direction", direction),
        "data-rotation": rotation,
        "data-direction": direction,
        style: getLineStyle(pos1, pos2, rad)
      });
    }

    var MoveableManager =
    /*#__PURE__*/
    function (_super) {
      __extends$5(MoveableManager, _super);

      function MoveableManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.state = {
          container: null,
          target: null,
          beforeMatrix: createIdentityMatrix3(),
          matrix: createIdentityMatrix3(),
          targetMatrix: createIdentityMatrix3(),
          offsetMatrix: createIdentityMatrix3(),
          targetTransform: "",
          is3d: false,
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transformOrigin: [0, 0],
          direction: 1,
          beforeDirection: 1,
          beforeOrigin: [0, 0],
          origin: [0, 0],
          pos1: [0, 0],
          pos2: [0, 0],
          pos3: [0, 0],
          pos4: [0, 0],
          renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]],
          targetClientRect: resetClientRect(),
          containerClientRect: resetClientRect(),
          rotation: 0
        };
        _this.targetAbles = [];
        _this.controlAbles = [];
        _this.isUnmounted = false;
        return _this;
      }

      var __proto = MoveableManager.prototype;

      __proto.render = function () {
        var props = this.props;
        var state = this.state;
        var edge = props.edge,
            parentPosition = props.parentPosition,
            className = props.className,
            propsTarget = props.target,
            zoom = props.zoom;
        this.checkUpdate();

        var _a = parentPosition || {
          left: 0,
          top: 0
        },
            parentLeft = _a.left,
            parentTop = _a.top;

        var left = state.left,
            top = state.top,
            stateTarget = state.target,
            direction = state.direction,
            renderPoses = state.renderPoses;
        var groupTargets = props.targets;
        var isDisplay = (groupTargets && groupTargets.length || propsTarget) && stateTarget;
        return createElement(ControlBoxElement, {
          ref: ref(this, "controlBox"),
          className: prefix("control-box", direction === -1 ? "reverse" : "") + " " + className,
          style: {
            "position": "absolute",
            "display": isDisplay ? "block" : "none",
            "transform": "translate(" + (left - parentLeft) + "px, " + (top - parentTop) + "px) translateZ(50px)",
            "--zoom": zoom,
            "--zoompx": zoom + "px"
          }
        }, this.renderAbles(), renderLine(edge ? "n" : "", renderPoses[0], renderPoses[1], 0), renderLine(edge ? "e" : "", renderPoses[1], renderPoses[3], 1), renderLine(edge ? "w" : "", renderPoses[0], renderPoses[2], 2), renderLine(edge ? "s" : "", renderPoses[2], renderPoses[3], 3));
      };

      __proto.componentDidMount = function () {
        this.controlBox.getElement();
        var props = this.props;
        var parentMoveable = props.parentMoveable,
            container = props.container;
        this.updateEvent(props);

        if (!container && !parentMoveable) {
          this.updateRect("End", false, true);
        }
      };

      __proto.componentDidUpdate = function (prevProps) {
        this.updateEvent(prevProps);
      };

      __proto.componentWillUnmount = function () {
        this.isUnmounted = true;
        unset(this, "targetDragger");
        unset(this, "controlDragger");
      };

      __proto.getContainer = function () {
        var _a = this.props,
            parentMoveable = _a.parentMoveable,
            container = _a.container;
        return container || parentMoveable && parentMoveable.getContainer() || this.controlBox.getElement().parentElement;
      };

      __proto.isMoveableElement = function (target) {
        return target && (target.getAttribute("class") || "").indexOf(PREFIX) > -1;
      };

      __proto.dragStart = function (e) {
        if (this.targetDragger) {
          this.targetDragger.onDragStart(e);
        }

        return this;
      };

      __proto.hitTest = function (el) {
        var rect;

        if (el instanceof Element) {
          var clientRect = el.getBoundingClientRect();
          rect = {
            left: clientRect.left,
            top: clientRect.top,
            width: clientRect.width,
            height: clientRect.height
          };
        } else {
          rect = __assign$4({
            width: 0,
            height: 0
          }, el);
        }

        var _a = this.state.targetClientRect,
            rectLeft = _a.left,
            rectTop = _a.top,
            rectWidth = _a.width,
            rectHeight = _a.height;
        var left = rect.left,
            top = rect.top,
            width = rect.width,
            height = rect.height;
        var right = left + width;
        var bottom = top + height;
        var rectRight = rectLeft + rectWidth;
        var rectBottom = rectTop + rectHeight;
        var testLeft = Math.max(rectLeft, left);
        var testRight = Math.min(rectRight, right);
        var testTop = Math.max(rectTop, top);
        var testBottom = Math.min(rectBottom, bottom);

        if (testRight < testLeft || testBottom < testTop) {
          return 0;
        }

        var rectSize = (Math.min(rectRight, right) - Math.max(left, rectLeft)) * (Math.min(rectBottom, bottom) - Math.max(rectTop, top));
        return Math.min(100, (testRight - testLeft) * (testBottom - testTop) / rectSize * 100);
      };

      __proto.isInside = function (clientX, clientY) {
        var _a = this.state,
            pos1 = _a.pos1,
            pos2 = _a.pos2,
            pos3 = _a.pos3,
            pos4 = _a.pos4,
            target = _a.target,
            targetClientRect = _a.targetClientRect;

        if (!target) {
          return false;
        }

        var left = targetClientRect.left,
            top = targetClientRect.top;
        var pos = [clientX - left, clientY - top];
        return isInside(pos, pos1, pos2, pos3, pos4);
      };

      __proto.updateRect = function (type, isTarget, isSetState) {
        if (isSetState === void 0) {
          isSetState = true;
        }

        var props = this.props;
        var parentMoveable = props.parentMoveable;
        var state = this.state;
        var target = state.target || this.props.target;
        var container = this.getContainer();
        var rootContainer = parentMoveable ? parentMoveable.props.rootContainer : props.rootContainer;
        this.updateState(getTargetInfo(target, container, container, rootContainer || container, isTarget ? state : undefined), parentMoveable ? false : isSetState);
      };

      __proto.updateEvent = function (prevProps) {
        var controlBoxElement = this.controlBox.getElement();
        var hasTargetAble = this.targetAbles.length;
        var hasControlAble = this.controlAbles.length;
        var props = this.props;
        var target = props.dragTarget || props.target;
        var prevTarget = prevProps.dragTarget || prevProps.target;
        var dragArea = props.dragArea;
        var prevDragArea = prevProps.dragArea;
        var isTargetChanged = !dragArea && prevTarget !== target;
        var isUnset = !hasTargetAble && this.targetDragger || isTargetChanged || prevDragArea !== dragArea;

        if (isUnset) {
          unset(this, "targetDragger");
          this.updateState({
            dragger: null
          });
        }

        if (!hasControlAble) {
          unset(this, "controlDragger");
        }

        if (target && hasTargetAble && !this.targetDragger) {
          this.targetDragger = getTargetAbleDragger(this, target, "");
        }

        if (!this.controlDragger && hasControlAble) {
          this.controlDragger = getAbleDragger(this, controlBoxElement, "controlAbles", "Control");
        }

        if (isUnset) {
          this.unsetAbles();
        }
      };

      __proto.isDragging = function () {
        return (this.targetDragger ? this.targetDragger.isFlag() : false) || (this.controlDragger ? this.controlDragger.isFlag() : false);
      };

      __proto.updateTarget = function (type) {
        this.updateRect(type, true);
      };

      __proto.getRect = function () {
        var state = this.state;
        var poses = getAbsolutePosesByState(this.state);
        var pos1 = poses[0],
            pos2 = poses[1],
            pos3 = poses[2],
            pos4 = poses[3];
        var rect = getRect(poses);
        var offsetWidth = state.width,
            offsetHeight = state.height;
        var width = rect.width,
            height = rect.height,
            left = rect.left,
            top = rect.top;
        var statePos = [state.left, state.top];
        var origin = plus(statePos, state.origin);
        var beforeOrigin = plus(statePos, state.beforeOrigin);
        return {
          width: width,
          height: height,
          left: left,
          top: top,
          pos1: pos1,
          pos2: pos2,
          pos3: pos3,
          pos4: pos4,
          offsetWidth: offsetWidth,
          offsetHeight: offsetHeight,
          beforeOrigin: beforeOrigin,
          origin: origin
        };
      };

      __proto.request = function (ableName, param, isInstant) {
        if (param === void 0) {
          param = {};
        }

        var _a = this.props,
            ables = _a.ables,
            groupable = _a.groupable;
        var requsetAble = ables.filter(function (able) {
          return able.name === ableName;
        })[0];

        if (this.isDragging() || !requsetAble || !requsetAble.request) {
          return {
            request: function () {
              return this;
            },
            requestEnd: function () {
              return this;
            }
          };
        }

        var self = this;
        var ableRequester = requsetAble.request(this);
        var ableType = ableRequester.isControl ? "controlAbles" : "targetAbles";
        var eventAffix = "" + (groupable ? "Group" : "") + (ableRequester.isControl ? "Control" : "");
        var requester = {
          request: function (ableParam) {
            triggerAble(self, ableType, "drag", eventAffix, "", __assign$4({}, ableRequester.request(ableParam), {
              isRequest: true
            }), isInstant);
            return this;
          },
          requestEnd: function () {
            triggerAble(self, ableType, "drag", eventAffix, "End", __assign$4({}, ableRequester.requestEnd(), {
              isRequest: true
            }));
            return this;
          }
        };
        triggerAble(self, ableType, "drag", eventAffix, "Start", __assign$4({}, ableRequester.requestStart(param), {
          isRequest: true
        }), isInstant);
        return param.isInstant ? requester.request(param).requestEnd() : requester;
      };

      __proto.updateRenderPoses = function () {
        var state = this.state;
        var props = this.props;
        var beforeOrigin = state.beforeOrigin,
            transformOrigin = state.transformOrigin,
            matrix = state.matrix,
            is3d = state.is3d,
            pos1 = state.pos1,
            pos2 = state.pos2,
            pos3 = state.pos3,
            pos4 = state.pos4,
            stateLeft = state.left,
            stateTop = state.top;

        var _a = props.padding || {},
            _b = _a.left,
            left = _b === void 0 ? 0 : _b,
            _c = _a.top,
            top = _c === void 0 ? 0 : _c,
            _d = _a.bottom,
            bottom = _d === void 0 ? 0 : _d,
            _e = _a.right,
            right = _e === void 0 ? 0 : _e;

        var n = is3d ? 4 : 3;
        var absoluteOrigin = props.groupable ? beforeOrigin : plus(beforeOrigin, [stateLeft, stateTop]);
        state.renderPoses = [plus(pos1, caculatePadding(matrix, [-left, -top], transformOrigin, absoluteOrigin, n)), plus(pos2, caculatePadding(matrix, [right, -top], transformOrigin, absoluteOrigin, n)), plus(pos3, caculatePadding(matrix, [-left, bottom], transformOrigin, absoluteOrigin, n)), plus(pos4, caculatePadding(matrix, [right, bottom], transformOrigin, absoluteOrigin, n))];
      };

      __proto.checkUpdate = function () {
        var _a = this.props,
            target = _a.target,
            container = _a.container,
            parentMoveable = _a.parentMoveable;
        var _b = this.state,
            stateTarget = _b.target,
            stateContainer = _b.container;

        if (!stateTarget && !target) {
          return;
        }

        this.updateAbles();
        this.updateRenderPoses();
        var isChanged = !equals(stateTarget, target) || !equals(stateContainer, container);

        if (!isChanged) {
          return;
        }

        this.updateState({
          target: target,
          container: container
        });

        if (!parentMoveable && (container || this.controlBox)) {
          this.updateRect("End", false, false);
        }
      };

      __proto.triggerEvent = function (name, e) {
        var callback = this.props[name];
        return callback && callback(e);
      };

      __proto.unsetAbles = function () {
        var _this = this;

        if (this.targetAbles.filter(function (able) {
          if (able.unset) {
            able.unset(_this);
            return true;
          }

          return false;
        }).length) {
          this.forceUpdate();
        }
      };

      __proto.updateAbles = function (ables, eventAffix) {
        if (ables === void 0) {
          ables = this.props.ables;
        }

        if (eventAffix === void 0) {
          eventAffix = "";
        }

        var props = this.props;
        var triggerAblesSimultaneously = props.triggerAblesSimultaneously;
        var enabledAbles = ables.filter(function (able) {
          return able && props[able.name];
        });
        var dragStart = "drag" + eventAffix + "Start";
        var pinchStart = "pinch" + eventAffix + "Start";
        var dragControlStart = "drag" + eventAffix + "ControlStart";
        var targetAbles = filterAbles(enabledAbles, [dragStart, pinchStart], triggerAblesSimultaneously);
        var controlAbles = filterAbles(enabledAbles, [dragControlStart], triggerAblesSimultaneously);
        this.targetAbles = targetAbles;
        this.controlAbles = controlAbles;
      };

      __proto.updateState = function (nextState, isSetState) {
        if (isSetState) {
          this.setState(nextState);
        } else {
          var state = this.state;

          for (var name in nextState) {
            state[name] = nextState[name];
          }
        }
      };

      __proto.renderAbles = function () {
        var _this = this;

        var props = this.props;
        var ables = props.ables;
        var triggerAblesSimultaneously = props.triggerAblesSimultaneously;
        var enabledAbles = ables.filter(function (able) {
          return able && props[able.name];
        });
        var Renderer = {
          createElement: createElement
        };
        return groupByMap(flat$1(filterAbles(enabledAbles, ["render"], triggerAblesSimultaneously).map(function (_a) {
          var render = _a.render;
          return render(_this, Renderer) || [];
        })).filter(function (el) {
          return el;
        }), function (_a) {
          var key = _a.key;
          return key;
        }).map(function (group) {
          return group[0];
        });
      };

      MoveableManager.defaultProps = {
        target: null,
        dragTarget: null,
        container: null,
        rootContainer: null,
        origin: true,
        edge: false,
        parentMoveable: null,
        parentPosition: null,
        ables: [],
        pinchThreshold: 20,
        dragArea: false,
        transformOrigin: "",
        className: "",
        zoom: 1,
        triggerAblesSimultaneously: false,
        padding: {},
        pinchOutside: true
      };
      return MoveableManager;
    }(PureComponent);

    function getRotatiion(touches) {
      return getRad([touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]) / Math.PI * 180;
    }

    var Pinchable = {
      name: "pinchable",
      updateRect: true,
      props: {
        pinchable: Boolean,
        pinchOutside: Boolean,
        pinchThreshold: Number
      },
      pinchStart: function (moveable, e) {
        var datas = e.datas,
            touches = e.touches,
            targets = e.targets;
        var _a = moveable.props,
            pinchable = _a.pinchable,
            ables = _a.ables;

        if (!pinchable) {
          return false;
        }

        var eventName = "onPinch" + (targets ? "Group" : "") + "Start";
        var controlEventName = "drag" + (targets ? "Group" : "") + "ControlStart";
        var pinchAbles = (pinchable === true ? moveable.controlAbles : ables.filter(function (able) {
          return pinchable.indexOf(able.name) > -1;
        })).filter(function (able) {
          return able.canPinch && able[controlEventName];
        });
        var params = fillParams(moveable, e, {});

        if (targets) {
          params.targets = targets;
        }

        var result = triggerEvent(moveable, eventName, params);
        datas.isPinch = result !== false;
        datas.ables = pinchAbles;
        var isPinch = datas.isPinch;

        if (!isPinch) {
          return false;
        }

        var parentRotate = getRotatiion(touches);
        pinchAbles.forEach(function (able) {
          datas[able.name + "Datas"] = {};

          if (!able[controlEventName]) {
            return;
          }

          var ableEvent = __assign$4({}, e, {
            datas: datas[able.name + "Datas"],
            parentRotate: parentRotate,
            isPinch: true
          });

          able[controlEventName](moveable, ableEvent);
        });
        moveable.state.snapRenderInfo = {
          request: e.isRequest,
          direction: [0, 0]
        };
        return isPinch;
      },
      pinch: function (moveable, e) {
        var datas = e.datas,
            pinchScale = e.scale,
            distance = e.distance,
            touches = e.touches,
            inputEvent = e.inputEvent,
            targets = e.targets;

        if (!datas.isPinch) {
          return;
        }

        var parentRotate = getRotatiion(touches);
        var parentDistance = distance * (1 - 1 / pinchScale);
        var params = fillParams(moveable, e, {});

        if (targets) {
          params.targets = targets;
        }

        var eventName = "onPinch" + (targets ? "Group" : "");
        triggerEvent(moveable, eventName, params);
        var ables = datas.ables;
        var controlEventName = "drag" + (targets ? "Group" : "") + "Control";
        ables.forEach(function (able) {
          if (!able[controlEventName]) {
            return;
          }

          able[controlEventName](moveable, __assign$4({}, e, {
            datas: datas[able.name + "Datas"],
            inputEvent: inputEvent,
            parentDistance: parentDistance,
            parentRotate: parentRotate,
            isPinch: true
          }));
        });
        return params;
      },
      pinchEnd: function (moveable, e) {
        var datas = e.datas,
            isPinch = e.isPinch,
            inputEvent = e.inputEvent,
            targets = e.targets;

        if (!datas.isPinch) {
          return;
        }

        var eventName = "onPinch" + (targets ? "Group" : "") + "End";
        var params = fillParams(moveable, e, {
          isDrag: isPinch
        });

        if (targets) {
          params.targets = targets;
        }

        triggerEvent(moveable, eventName, params);
        var ables = datas.ables;
        var controlEventName = "drag" + (targets ? "Group" : "") + "ControlEnd";
        ables.forEach(function (able) {
          if (!able[controlEventName]) {
            return;
          }

          able[controlEventName](moveable, __assign$4({}, e, {
            isDrag: isPinch,
            datas: datas[able.name + "Datas"],
            inputEvent: inputEvent,
            isPinch: true
          }));
        });
        return isPinch;
      },
      pinchGroupStart: function (moveable, e) {
        return this.pinchStart(moveable, __assign$4({}, e, {
          targets: moveable.props.targets
        }));
      },
      pinchGroup: function (moveable, e) {
        return this.pinch(moveable, __assign$4({}, e, {
          targets: moveable.props.targets
        }));
      },
      pinchGroupEnd: function (moveable, e) {
        return this.pinchEnd(moveable, __assign$4({}, e, {
          targets: moveable.props.targets
        }));
      }
    };

    function setCustomDrag(state, delta, inputEvent, isPinch, isConvert) {
      var result = state.dragger.move(delta, inputEvent);
      var datas = result.originalDatas || result.datas;
      var draggableDatas = datas.draggable || (datas.draggable = {});
      return __assign$4({}, isConvert ? convertDragDist(state, result) : result, {
        isDrag: true,
        isPinch: !!isPinch,
        parentEvent: true,
        datas: draggableDatas
      });
    }

    var CustomDragger =
    /*#__PURE__*/
    function () {
      function CustomDragger() {
        this.prevX = 0;
        this.prevY = 0;
        this.startX = 0;
        this.startY = 0;
        this.isDrag = false;
        this.isFlag = false;
        this.datas = {
          draggable: {}
        };
      }

      var __proto = CustomDragger.prototype;

      __proto.dragStart = function (client, inputEvent) {
        this.isDrag = false;
        this.isFlag = false;
        this.datas = {
          draggable: {}
        };
        return __assign$4({}, this.move(client, inputEvent), {
          type: "dragstart"
        });
      };

      __proto.drag = function (client, inputEvent) {
        return this.move([client[0] - this.prevX, client[1] - this.prevY], inputEvent);
      };

      __proto.move = function (delta, inputEvent) {
        var clientX;
        var clientY;

        if (!this.isFlag) {
          this.prevX = delta[0];
          this.prevY = delta[1];
          this.startX = delta[0];
          this.startY = delta[1];
          clientX = delta[0];
          clientY = delta[1];
          this.isFlag = true;
        } else {
          clientX = this.prevX + delta[0];
          clientY = this.prevY + delta[1];
          this.isDrag = true;
        }

        this.prevX = clientX;
        this.prevY = clientY;
        return {
          type: "drag",
          clientX: clientX,
          clientY: clientY,
          inputEvent: inputEvent,
          isDrag: this.isDrag,
          distX: clientX - this.startX,
          distY: clientY - this.startY,
          deltaX: delta[0],
          deltaY: delta[1],
          datas: this.datas.draggable,
          originalDatas: this.datas,
          parentEvent: true,
          parentDragger: this
        };
      };

      return CustomDragger;
    }();

    function triggerChildDragger(moveable, able, type, delta, e, isConvert) {
      var isStart = !!type.match(/Start$/g);
      var isEnd = !!type.match(/End$/g);
      var inputEvent = e.inputEvent;
      var isPinch = e.isPinch;
      var datas = e.datas;
      var childs = moveable.moveables.map(function (child, i) {
        var childEvent = {};

        if (isStart) {
          childEvent = new CustomDragger().dragStart(delta, inputEvent);
        } else {
          if (!child.state.dragger) {
            child.state.dragger = datas.childDraggers[i];
          }

          childEvent = setCustomDrag(child.state, delta, inputEvent, isPinch, isConvert);
        }

        var result = able[type](child, __assign$4({}, childEvent, {
          parentFlag: true
        }));

        if (isEnd) {
          child.state.dragger = null;
        }

        return result;
      });

      if (isStart) {
        datas.childDraggers = moveable.moveables.map(function (child) {
          return child.state.dragger;
        });
      }

      return childs;
    }
    function triggerChildAble(moveable, able, type, datas, eachEvent, callback) {
      var name = able.name;
      var ableDatas = datas[name] || (datas[name] = []);
      var isEnd = !!type.match(/End$/g);
      var childs = moveable.moveables.map(function (child, i) {
        var childDatas = ableDatas[i] || (ableDatas[i] = {});
        var childEvent = isFunction(eachEvent) ? eachEvent(child, childDatas) : eachEvent;
        var result = able[type](child, __assign$4({}, childEvent, {
          datas: childDatas,
          parentFlag: true
        }));
        result && callback && callback(child, childDatas, result, i);

        if (isEnd) {
          child.state.dragger = null;
        }

        return result;
      });
      return childs;
    }

    function setDragStart(moveable, _a) {
      var datas = _a.datas;
      var _b = moveable.state,
          matrix = _b.matrix,
          beforeMatrix = _b.beforeMatrix,
          is3d = _b.is3d,
          left = _b.left,
          top = _b.top,
          origin = _b.origin,
          offsetMatrix = _b.offsetMatrix,
          targetMatrix = _b.targetMatrix,
          transformOrigin = _b.transformOrigin;
      var n = is3d ? 4 : 3;
      datas.is3d = is3d;
      datas.matrix = matrix;
      datas.targetMatrix = targetMatrix;
      datas.beforeMatrix = beforeMatrix;
      datas.offsetMatrix = offsetMatrix;
      datas.transformOrigin = transformOrigin;
      datas.inverseMatrix = invert(matrix, n);
      datas.inverseBeforeMatrix = invert(beforeMatrix, n);
      datas.absoluteOrigin = convertPositionMatrix(plus([left, top], origin), n);
      datas.startDragBeforeDist = caculate(datas.inverseBeforeMatrix, datas.absoluteOrigin, n);
      datas.startDragDist = caculate(datas.inverseMatrix, datas.absoluteOrigin, n);
    }
    function getDragDist(_a, isBefore) {
      var datas = _a.datas,
          distX = _a.distX,
          distY = _a.distY;
      var inverseBeforeMatrix = datas.inverseBeforeMatrix,
          inverseMatrix = datas.inverseMatrix,
          is3d = datas.is3d,
          startDragBeforeDist = datas.startDragBeforeDist,
          startDragDist = datas.startDragDist,
          absoluteOrigin = datas.absoluteOrigin;
      var n = is3d ? 4 : 3;
      return minus(caculate(isBefore ? inverseBeforeMatrix : inverseMatrix, plus(absoluteOrigin, [distX, distY]), n), isBefore ? startDragBeforeDist : startDragDist);
    }
    function getInverseDragDist(_a, isBefore) {
      var datas = _a.datas,
          distX = _a.distX,
          distY = _a.distY;
      var beforeMatrix = datas.beforeMatrix,
          matrix = datas.matrix,
          is3d = datas.is3d,
          startDragBeforeDist = datas.startDragBeforeDist,
          startDragDist = datas.startDragDist,
          absoluteOrigin = datas.absoluteOrigin;
      var n = is3d ? 4 : 3;
      return minus(caculate(isBefore ? beforeMatrix : matrix, plus(isBefore ? startDragBeforeDist : startDragDist, [distX, distY]), n), absoluteOrigin);
    }
    function caculateTransformOrigin(transformOrigin, width, height, prevWidth, prevHeight, prevOrigin) {
      if (prevWidth === void 0) {
        prevWidth = width;
      }

      if (prevHeight === void 0) {
        prevHeight = height;
      }

      if (prevOrigin === void 0) {
        prevOrigin = [0, 0];
      }

      if (!transformOrigin) {
        return prevOrigin;
      }

      return transformOrigin.map(function (pos, i) {
        var _a = splitUnit(pos),
            value = _a.value,
            unit = _a.unit;

        var prevSize = i ? prevHeight : prevWidth;
        var size = i ? height : width;

        if (pos === "%" || isNaN(value)) {
          // no value but %
          var measureRatio = prevSize ? prevOrigin[i] / prevSize : 0;
          return size * measureRatio;
        } else if (unit !== "%") {
          return value;
        }

        return size * value / 100;
      });
    }
    function getPosIndexesByDirection(direction) {
      var indexes = [];

      if (direction[1] >= 0) {
        if (direction[0] >= 0) {
          indexes.push(3);
        }

        if (direction[0] <= 0) {
          indexes.push(2);
        }
      }

      if (direction[1] <= 0) {
        if (direction[0] >= 0) {
          indexes.push(1);
        }

        if (direction[0] <= 0) {
          indexes.push(0);
        }
      }

      return indexes;
    }
    function getPosesByDirection(poses, direction) {
      /*
      [-1, -1](pos1)       [0, -1](pos1,pos2)       [1, -1](pos2)
      [-1, 0](pos1, pos3)                           [1, 0](pos2, pos4)
      [-1, 1](pos3)        [0, 1](pos3, pos4)       [1, 1](pos4)
      */
      return getPosIndexesByDirection(direction).map(function (index) {
        return poses[index];
      });
    }
    function getPosByDirection(poses, direction) {
      /*
      [-1, -1](pos1)       [0, -1](pos1,pos2)       [1, -1](pos2)
      [-1, 0](pos1, pos3)                           [1, 0](pos2, pos4)
      [-1, 1](pos3)        [0, 1](pos3, pos4)       [1, 1](pos4)
      */
      var nextPoses = getPosesByDirection(poses, direction);
      return [average.apply(void 0, nextPoses.map(function (pos) {
        return pos[0];
      })), average.apply(void 0, nextPoses.map(function (pos) {
        return pos[1];
      }))];
    }
    function getPosByReverseDirection(_a, direction) {
      /*
      [-1, -1](pos4)       [0, -1](pos3,pos4)       [1, -1](pos3)
      [-1, 0](pos2, pos4)                           [1, 0](pos3, pos1)
      [-1, 1](pos2)        [0, 1](pos1, pos2)       [1, 1](pos1)
      */
      var pos1 = _a[0],
          pos2 = _a[1],
          pos3 = _a[2],
          pos4 = _a[3];
      return getPosByDirection([pos4, pos3, pos2, pos1], direction);
    }

    function getStartPos(poses, direction) {
      var startPos1 = poses[0],
          startPos2 = poses[1],
          startPos3 = poses[2],
          startPos4 = poses[3];
      return getPosByReverseDirection([startPos1, startPos2, startPos3, startPos4], direction);
    }

    function getDist$1(startPos, matrix, width, height, n, direction) {
      var poses = caculatePoses(matrix, width, height, n);
      var pos = getPosByReverseDirection(poses, direction);
      var distX = startPos[0] - pos[0];
      var distY = startPos[1] - pos[1];
      return [distX, distY];
    }

    function getNextMatrix(offsetMatrix, targetMatrix, origin, n) {
      return multiply(offsetMatrix, getAbsoluteMatrix(targetMatrix, n, origin), n);
    }
    function scaleMatrix(state, scale) {
      var transformOrigin = state.transformOrigin,
          offsetMatrix = state.offsetMatrix,
          is3d = state.is3d,
          targetMatrix = state.targetMatrix;
      var n = is3d ? 4 : 3;
      return getNextMatrix(offsetMatrix, multiply(targetMatrix, createScaleMatrix(scale, n), n), transformOrigin, n);
    }
    function getScaleDist(moveable, scale, direction, fixedPosition) {
      var state = moveable.state;
      var is3d = state.is3d,
          left = state.left,
          top = state.top,
          width = state.width,
          height = state.height;
      var n = is3d ? 4 : 3;
      var groupable = moveable.props.groupable;
      var nextMatrix = scaleMatrix(moveable.state, scale);
      var groupLeft = groupable ? left : 0;
      var groupTop = groupable ? top : 0;
      var dist = getDist$1(fixedPosition, nextMatrix, width, height, n, direction);
      return minus(dist, [groupLeft, groupTop]);
    }
    function getResizeDist(moveable, width, height, direction, fixedPosition, transformOrigin) {
      var groupable = moveable.props.groupable;
      var _a = moveable.state,
          prevOrigin = _a.transformOrigin,
          targetMatrix = _a.targetMatrix,
          offsetMatrix = _a.offsetMatrix,
          is3d = _a.is3d,
          prevWidth = _a.width,
          prevHeight = _a.height,
          left = _a.left,
          top = _a.top;
      var n = is3d ? 4 : 3;
      var nextOrigin = caculateTransformOrigin(transformOrigin, width, height, prevWidth, prevHeight, prevOrigin);
      var groupLeft = groupable ? left : 0;
      var groupTop = groupable ? top : 0;
      var nextMatrix = getNextMatrix(offsetMatrix, targetMatrix, nextOrigin, n);
      var dist = getDist$1(fixedPosition, nextMatrix, width, height, n, direction);
      return minus(dist, [groupLeft, groupTop]);
    }
    function getStartDirection(moveable, direction) {
      if (!direction[0] && !direction[1]) {
        return [0, 0];
      }

      var _a = moveable.props.baseDirection,
          baseDirection = _a === void 0 ? [-1, -1] : _a;
      return [direction[0] ? direction[0] : baseDirection[0] * -1, direction[1] ? direction[1] : baseDirection[1] * -1];
    }
    function getAbsoluteFixedPosition(moveable, direction) {
      return getStartPos(getAbsolutePosesByState(moveable.state), direction);
    }

    function directionCondition(e) {
      if (e.isRequest) {
        return e.parentDirection;
      }

      return hasClass(e.inputEvent.target, prefix("direction"));
    }

    function getGapGuidelines(guidelines, type, snapThreshold, index, _a, _b) {
      var start = _a[0],
          end = _a[1];
      var otherStart = _b[0],
          otherEnd = _b[1];
      var totalGuidelines = [];
      var otherIndex = index ? 0 : 1;
      var otherType = type === "vertical" ? "horizontal" : "vertical";
      var elementGuidelines = groupBy(guidelines.filter(function (_a) {
        var guidelineType = _a.type;
        return guidelineType === type;
      }), function (_a) {
        var element = _a.element;
        return element;
      }).map(function (group) {
        return group[0];
      }).filter(function (_a) {
        var pos = _a.pos,
            sizes = _a.sizes;
        return pos[otherIndex] <= otherEnd && otherStart <= pos[otherIndex] + sizes[otherIndex];
      });
      elementGuidelines.forEach(function (guideline1) {
        var elementStart = guideline1.pos[index];
        var elementEnd = elementStart + guideline1.sizes[index];
        elementGuidelines.forEach(function (_a) {
          var guideline2Pos = _a.pos,
              guideline2Sizes = _a.sizes,
              guideline2Element = _a.element;
          var targetStart = guideline2Pos[index];
          var targetEnd = targetStart + guideline2Sizes[index];
          var pos = 0;
          var gap = 0;
          var canSnap = true;

          if (elementEnd <= targetStart) {
            // gap -
            gap = elementEnd - targetStart;
            pos = targetEnd - gap;

            if (start < pos - snapThreshold) {
              canSnap = false;
            } // element target moveable

          } else if (targetEnd <= elementStart) {
            // gap +
            gap = elementStart - targetEnd;
            pos = targetStart - gap;

            if (end > pos + snapThreshold) {
              canSnap = false;
            } // moveable target element

          } else {
            return;
          }

          if (canSnap) {
            totalGuidelines.push({
              pos: otherType === "vertical" ? [pos, guideline2Pos[1]] : [guideline2Pos[0], pos],
              element: guideline2Element,
              sizes: guideline2Sizes,
              size: 0,
              type: otherType,
              gap: gap,
              gapGuidelines: elementGuidelines
            });
          }

          if (elementEnd <= start && end <= targetStart) {
            // elementEnd   moveable   target
            var centerPos = (targetStart + elementEnd - (end - start)) / 2;

            if (throttle(start - (centerPos - snapThreshold), 0.1) >= 0) {
              totalGuidelines.push({
                pos: otherType === "vertical" ? [centerPos, guideline2Pos[1]] : [guideline2Pos[0], centerPos],
                element: guideline2Element,
                sizes: guideline2Sizes,
                size: 0,
                type: otherType,
                gap: elementEnd - start,
                gapGuidelines: elementGuidelines
              });
            }
          }
        });
      });
      return totalGuidelines;
    }
    function getTotalGuidelines(moveable) {
      var _a = moveable.state,
          guidelines = _a.guidelines,
          _b = _a.containerClientRect,
          containerHeight = _b.scrollHeight,
          containerWidth = _b.scrollWidth;
      var props = moveable.props;
      var _c = props.snapHorizontal,
          snapHorizontal = _c === void 0 ? true : _c,
          _d = props.snapVertical,
          snapVertical = _d === void 0 ? true : _d,
          _e = props.snapGap,
          snapGap = _e === void 0 ? true : _e,
          verticalGuidelines = props.verticalGuidelines,
          horizontalGuidelines = props.horizontalGuidelines,
          _f = props.snapThreshold,
          snapThreshold = _f === void 0 ? 5 : _f;
      var totalGuidelines = guidelines.slice();

      if (snapGap) {
        var _g = getRect(getAbsolutePosesByState(moveable.state)),
            top = _g.top,
            left = _g.left,
            bottom = _g.bottom,
            right = _g.right;

        var elementGuidelines = guidelines.filter(function (_a) {
          var element = _a.element;
          return element;
        });
        totalGuidelines.push.apply(totalGuidelines, getGapGuidelines(elementGuidelines, "horizontal", snapThreshold, 0, [left, right], [top, bottom]).concat(getGapGuidelines(elementGuidelines, "vertical", snapThreshold, 1, [top, bottom], [left, right])));
      }

      if (snapHorizontal && horizontalGuidelines) {
        horizontalGuidelines.forEach(function (pos) {
          totalGuidelines.push({
            type: "horizontal",
            pos: [0, throttle(pos, 0.1)],
            size: containerWidth
          });
        });
      }

      if (snapVertical && verticalGuidelines) {
        verticalGuidelines.forEach(function (pos) {
          totalGuidelines.push({
            type: "vertical",
            pos: [throttle(pos, 0.1), 0],
            size: containerHeight
          });
        });
      }

      return totalGuidelines;
    }
    function checkSnapPoses(moveable, posesX, posesY, snapCenter, customSnapThreshold) {
      var totalGuidelines = getTotalGuidelines(moveable);
      var props = moveable.props;
      var _a = props.snapElement,
          snapElement = _a === void 0 ? true : _a;
      var snapThreshold = selectValue(customSnapThreshold, props.snapThreshold, 5);
      return {
        vertical: checkSnap(totalGuidelines, "vertical", posesX, snapThreshold, snapCenter, snapElement),
        horizontal: checkSnap(totalGuidelines, "horizontal", posesY, snapThreshold, snapCenter, snapElement)
      };
    }
    function checkSnapKeepRatio(moveable, startPos, endPos) {
      var endX = endPos[0],
          endY = endPos[1];
      var startX = startPos[0],
          startY = startPos[1];

      var _a = minus(endPos, startPos),
          dx = _a[0],
          dy = _a[1];

      var isBottom = dy > 0;
      var isRight = dx > 0;
      var verticalInfo = {
        isSnap: false,
        offset: 0,
        pos: 0
      };
      var horizontalInfo = {
        isSnap: false,
        offset: 0,
        pos: 0
      };

      if (dx === 0 && dy === 0) {
        return {
          vertical: verticalInfo,
          horizontal: horizontalInfo
        };
      }

      var _b = checkSnapPoses(moveable, dx ? [endX] : [], dy ? [endY] : []),
          verticalSnapInfo = _b.vertical,
          horizontalSnapInfo = _b.horizontal;

      verticalSnapInfo.posInfos.filter(function (_a) {
        var pos = _a.pos;
        return isRight ? pos >= startX : pos <= startX;
      });
      horizontalSnapInfo.posInfos.filter(function (_a) {
        var pos = _a.pos;
        return isBottom ? pos >= startY : pos <= startY;
      });
      verticalSnapInfo.isSnap = verticalSnapInfo.posInfos.length > 0;
      horizontalSnapInfo.isSnap = horizontalSnapInfo.posInfos.length > 0;

      var _c = getNearestSnapGuidelineInfo(verticalSnapInfo),
          isVerticalSnap = _c.isSnap,
          verticalGuideline = _c.guideline;

      var _d = getNearestSnapGuidelineInfo(horizontalSnapInfo),
          isHorizontalSnap = _d.isSnap,
          horizontalGuideline = _d.guideline;

      var horizontalPos = isHorizontalSnap ? horizontalGuideline.pos[1] : 0;
      var verticalPos = isVerticalSnap ? verticalGuideline.pos[0] : 0;

      if (dx === 0) {
        if (isHorizontalSnap) {
          horizontalInfo.isSnap = true;
          horizontalInfo.pos = horizontalGuideline.pos[1];
          horizontalInfo.offset = endY - horizontalInfo.pos;
        }
      } else if (dy === 0) {
        if (isVerticalSnap) {
          verticalInfo.isSnap = true;
          verticalInfo.pos = verticalPos;
          verticalInfo.offset = endX - verticalPos;
        }
      } else {
        // y - y1 = a * (x - x1)
        var a = dy / dx;
        var b = endPos[1] - a * endX;
        var y = 0;
        var x = 0;
        var isSnap = false;

        if (isVerticalSnap) {
          x = verticalPos;
          y = a * x + b;
          isSnap = true;
        } else if (isHorizontalSnap) {
          y = horizontalPos;
          x = (y - b) / a;
          isSnap = true;
        }

        if (isSnap) {
          verticalInfo.isSnap = true;
          verticalInfo.pos = x;
          verticalInfo.offset = endX - x;
          horizontalInfo.isSnap = true;
          horizontalInfo.pos = y;
          horizontalInfo.offset = endY - y;
        }
      }

      return {
        vertical: verticalInfo,
        horizontal: horizontalInfo
      };
    }
    function checkSnaps(moveable, rect, isCenter, customSnapThreshold) {
      var snapCenter = moveable.props.snapCenter;
      var isSnapCenter = snapCenter && isCenter;
      var verticalNames = ["left", "right"];
      var horizontalNames = ["top", "bottom"];

      if (isSnapCenter) {
        verticalNames.push("center");
        horizontalNames.push("middle");
      }

      verticalNames = verticalNames.filter(function (name) {
        return name in rect;
      });
      horizontalNames = horizontalNames.filter(function (name) {
        return name in rect;
      });
      return checkSnapPoses(moveable, verticalNames.map(function (name) {
        return rect[name];
      }), horizontalNames.map(function (name) {
        return rect[name];
      }), isSnapCenter, customSnapThreshold);
    }
    function getNearestSnapGuidelineInfo(snapInfo) {
      var isSnap = snapInfo.isSnap;

      if (!isSnap) {
        return {
          isSnap: false,
          offset: 0,
          dist: -1,
          pos: 0,
          guideline: null
        };
      }

      var posInfo = snapInfo.posInfos[0];
      var guidelineInfo = posInfo.guidelineInfos[0];
      var offset = guidelineInfo.offset;
      var dist = guidelineInfo.dist;
      var guideline = guidelineInfo.guideline;
      return {
        isSnap: isSnap,
        offset: offset,
        dist: dist,
        pos: posInfo.pos,
        guideline: guideline
      };
    }

    function checkSnap(guidelines, targetType, targetPoses, snapThreshold, snapCenter, snapElement) {
      if (!guidelines || !guidelines.length) {
        return {
          isSnap: false,
          posInfos: []
        };
      }

      var isVertical = targetType === "vertical";
      var posType = isVertical ? 0 : 1;
      var snapPosInfos = targetPoses.map(function (targetPos) {
        var guidelineInfos = guidelines.map(function (guideline) {
          var pos = guideline.pos;
          var offset = targetPos - pos[posType];
          return {
            offset: offset,
            dist: Math.abs(offset),
            guideline: guideline
          };
        }).filter(function (_a) {
          var guideline = _a.guideline,
              dist = _a.dist;
          var type = guideline.type,
              center = guideline.center,
              element = guideline.element;

          if (!snapElement && element || !snapCenter && center || type !== targetType || dist > snapThreshold) {
            return false;
          }

          return true;
        }).sort(function (a, b) {
          return a.dist - b.dist;
        });
        return {
          pos: targetPos,
          guidelineInfos: guidelineInfos
        };
      }).filter(function (snapPosInfo) {
        return snapPosInfo.guidelineInfos.length > 0;
      }).sort(function (a, b) {
        return a.guidelineInfos[0].dist - b.guidelineInfos[0].dist;
      });
      return {
        isSnap: snapPosInfos.length > 0,
        posInfos: snapPosInfos
      };
    }

    function getSnapInfosByDirection(moveable, poses, snapDirection) {
      var nextPoses = [];

      if (snapDirection[0] && snapDirection[1]) {
        nextPoses = [snapDirection, [-snapDirection[0], snapDirection[1]], [snapDirection[0], -snapDirection[1]]].map(function (direction) {
          return getPosByDirection(poses, direction);
        });
      } else if (!snapDirection[0] && !snapDirection[1]) {
        var alignPoses = [poses[0], poses[1], poses[3], poses[2], poses[0]];

        for (var i = 0; i < 4; ++i) {
          nextPoses.push(alignPoses[i]);
          nextPoses.push([(alignPoses[i][0] + alignPoses[i + 1][0]) / 2, (alignPoses[i][1] + alignPoses[i + 1][1]) / 2]);
        }
      } else {
        if (moveable.props.keepRatio) {
          nextPoses = [[-1, -1], [-1, 1], [1, -1], [1, 1], snapDirection].map(function (dir) {
            return getPosByDirection(poses, dir);
          });
        } else {
          nextPoses = getPosesByDirection(poses, snapDirection);

          if (nextPoses.length > 1) {
            nextPoses.push([(nextPoses[0][0] + nextPoses[1][0]) / 2, (nextPoses[0][1] + nextPoses[1][1]) / 2]);
          }
        }
      }

      return checkSnapPoses(moveable, nextPoses.map(function (pos) {
        return pos[0];
      }), nextPoses.map(function (pos) {
        return pos[1];
      }), true, 1);
    }
    function getNearOffsetInfo(offsets, index) {
      return offsets.slice().sort(function (a, b) {
        var aSign = a.sign[index];
        var bSign = b.sign[index];
        var aOffset = a.offset[index];
        var bOffset = b.offset[index];
        var aDist = Math.abs(aOffset);
        var bDist = Math.abs(bOffset); // -1 The positions of a and b do not change.
        // 1 The positions of a and b are reversed.

        if (!aSign) {
          return 1;
        } else if (!bSign) {
          return -1;
        } else if (a.isBound && b.isBound) {
          return bDist - aDist;
        } else if (a.isBound) {
          return -1;
        } else if (b.isBound) {
          return 1;
        } else if (a.isSnap && b.isSnap) {
          return aDist - bDist;
        } else if (a.isSnap) {
          return -1;
        } else if (b.isSnap) {
          return 1;
        } else if (aDist < TINY_NUM) {
          return 1;
        } else if (bDist < TINY_NUM) {
          return -1;
        }

        return aDist - bDist;
      })[0];
    }

    function isStartLine(dot, line) {
      // l    o     => true
      // o    l    => false
      var cx = average(line[0][0], line[1][0]);
      var cy = average(line[0][1], line[1][1]);
      return {
        vertical: cx <= dot[0],
        horizontal: cy <= dot[1]
      };
    }

    function hitTestLine(dot, _a) {
      var pos1 = _a[0],
          pos2 = _a[1];
      var dx = pos2[0] - pos1[0];
      var dy = pos2[1] - pos1[1];
      var test1;
      var test2;

      if (!dx) {
        test1 = pos1[0];
        test2 = dot[0];
      } else if (!dy) {
        test1 = pos1[1];
        test2 = dot[1];
      } else {
        var a = dy / dx; // y = a * (x - pos1) + pos1

        test1 = a * (dot[0] - pos1[0]) + pos1[1];
        test2 = dot[1];
      }

      return test1 - test2;
    }

    function isSameStartLine(dots, line, error) {
      if (error === void 0) {
        error = TINY_NUM;
      }

      var centerSign = hitTestLine(dots[0], line) <= 0;
      return dots.slice(1).every(function (dot) {
        var value = hitTestLine(dot, line);
        var sign = value <= 0;
        return sign === centerSign || Math.abs(value) <= error;
      });
    }

    function checkInnerBoundDot(pos, start, end, isStart, threshold) {
      if (threshold === void 0) {
        threshold = 0;
      }

      if (isStart && start - threshold <= pos || !isStart && pos <= end + threshold) {
        // false 402 565 602 => 37 ([0, 37])
        // true 400 524.9712603540036 600 => 124 ([124, 0])
        // true 400 410 600 => 10 ([10, 0])
        return {
          isBound: true,
          offset: isStart ? start - pos : end - pos
        };
      }

      return {
        isBound: false,
        offset: 0
      };
    }

    function checkInnerBound(moveable, line, center) {
      var bounds = moveable.props.innerBounds;

      if (!bounds) {
        return {
          isAllBound: false,
          isBound: false,
          isVerticalBound: false,
          isHorizontalBound: false,
          offset: [0, 0]
        };
      }

      var left = bounds.left,
          top = bounds.top,
          width = bounds.width,
          height = bounds.height;
      var leftLine = [[left, top], [left, top + height]];
      var topLine = [[left, top], [left + width, top]];
      var rightLine = [[left + width, top], [left + width, top + height]];
      var bottomLine = [[left, top + height], [left + width, top + height]];

      var _a = isStartLine(center, line),
          isHorizontalStart = _a.horizontal,
          isVerticalStart = _a.vertical;

      if (isSameStartLine([center, [left, top], [left + width, top], [left, top + height], [left + width, top + height]], line)) {
        return {
          isAllBound: false,
          isBound: false,
          isVerticalBound: false,
          isHorizontalBound: false,
          offset: [0, 0]
        };
      } // test vertical


      var topBoundInfo = checkLineBoundCollision(line, topLine, isVerticalStart);
      var bottomBoundInfo = checkLineBoundCollision(line, bottomLine, isVerticalStart); // test horizontal

      var leftBoundInfo = checkLineBoundCollision(line, leftLine, isHorizontalStart);
      var rightBoundInfo = checkLineBoundCollision(line, rightLine, isHorizontalStart);
      var isAllVerticalBound = topBoundInfo.isBound && bottomBoundInfo.isBound;
      var isVerticalBound = topBoundInfo.isBound || bottomBoundInfo.isBound;
      var isAllHorizontalBound = leftBoundInfo.isBound && rightBoundInfo.isBound;
      var isHorizontalBound = leftBoundInfo.isBound || rightBoundInfo.isBound;
      var verticalOffset = maxOffset(topBoundInfo.offset, bottomBoundInfo.offset);
      var horizontalOffset = maxOffset(leftBoundInfo.offset, rightBoundInfo.offset);
      var offset = [0, 0];
      var isBound = false;
      var isAllBound = false;

      if (Math.abs(horizontalOffset) < Math.abs(verticalOffset)) {
        offset = [verticalOffset, 0];
        isBound = isVerticalBound;
        isAllBound = isAllVerticalBound;
      } else {
        offset = [0, horizontalOffset];
        isBound = isHorizontalBound;
        isAllBound = isAllHorizontalBound;
      }

      return {
        isAllBound: isAllBound,
        isVerticalBound: isVerticalBound,
        isHorizontalBound: isHorizontalBound,
        isBound: isBound,
        offset: offset
      };
    }

    function checkLineBoundCollision(line, boundLine, isStart, threshold) {
      var dot1 = line[0];
      var dot2 = line[1];
      var boundDot1 = boundLine[0];
      var boundDot2 = boundLine[1];
      var dy1 = dot2[1] - dot1[1];
      var dx1 = dot2[0] - dot1[0];
      var dy2 = boundDot2[1] - boundDot1[1];
      var dx2 = boundDot2[0] - boundDot1[0]; // dx2 or dy2 is zero

      if (!dx2) {
        // vertical
        if (dx1) {
          var y = dy1 ? dy1 / dx1 * (boundDot1[0] - dot1[0]) + dot1[1] : dot1[1]; // boundDot1[1] <= y  <= boundDot2[1]

          return checkInnerBoundDot(y, boundDot1[1], boundDot2[1], isStart, threshold);
        }
      } else if (!dy2) {
        // horizontal
        if (dy1) {
          // y = a * (x - x1) + y1
          // x = (y - y1) / a + x1
          var a = dy1 / dx1;
          var x = dx1 ? (boundDot1[1] - dot1[1]) / a + dot1[0] : dot1[0]; // boundDot1[0] <= x && x <= boundDot2[0]

          return checkInnerBoundDot(x, boundDot1[0], boundDot2[0], isStart, threshold);
        }
      }

      return {
        isBound: false,
        offset: 0
      };
    }

    function getInnerBoundInfo(moveable, lines, center, datas) {
      return lines.map(function (_a) {
        var multiple = _a[0],
            pos1 = _a[1],
            pos2 = _a[2];

        var _b = checkInnerBound(moveable, [pos1, pos2], center),
            isBound = _b.isBound,
            offset = _b.offset,
            isVerticalBound = _b.isVerticalBound,
            isHorizontalBound = _b.isHorizontalBound;

        var sizeOffset = getDragDist({
          datas: datas,
          distX: offset[0],
          distY: offset[1]
        }).map(function (size, i) {
          return size * (multiple[i] ? 2 / multiple[i] : 0);
        });
        return {
          sign: multiple,
          isBound: isBound,
          isVerticalBound: isVerticalBound,
          isHorizontalBound: isHorizontalBound,
          isSnap: false,
          offset: sizeOffset
        };
      });
    }
    function getInnerBoundDragInfo(moveable, poses, datas) {
      var _a;

      var lines = getCheckSnapLines(poses, [0, 0], false).map(function (_a) {
        var sign = _a[0],
            pos1 = _a[1],
            pos2 = _a[2];
        return [sign.map(function (dir) {
          return Math.abs(dir) * 2;
        }), pos1, pos2];
      });
      var innerBoundInfo = getInnerBoundInfo(moveable, lines, getPosByDirection(poses, [0, 0]), datas);
      var widthOffsetInfo = getNearOffsetInfo(innerBoundInfo, 0);
      var heightOffsetInfo = getNearOffsetInfo(innerBoundInfo, 1);
      var verticalOffset = 0;
      var horizontalOffset = 0;
      var isVerticalBound = widthOffsetInfo.isVerticalBound || heightOffsetInfo.isVerticalBound;
      var isHorizontalBound = widthOffsetInfo.isHorizontalBound || heightOffsetInfo.isHorizontalBound;

      if (isVerticalBound || isHorizontalBound) {
        _a = getInverseDragDist({
          datas: datas,
          distX: -widthOffsetInfo.offset[0],
          distY: -heightOffsetInfo.offset[1]
        }), verticalOffset = _a[0], horizontalOffset = _a[1];
      }

      return {
        vertical: {
          isBound: isVerticalBound,
          offset: verticalOffset
        },
        horizontal: {
          isBound: isHorizontalBound,
          offset: horizontalOffset
        }
      };
    }
    function getCheckSnapLineDirections(direction, keepRatio) {
      var lineDirections = [];
      var x = direction[0];
      var y = direction[1];

      if (x && y) {
        lineDirections.push([[0, y * 2], direction, [-x, y]], [[x * 2, 0], direction, [x, -y]]);
      } else if (x) {
        // vertcal
        lineDirections.push([[x * 2, 0], [x, 1], [x, -1]]);

        if (keepRatio) {
          lineDirections.push([[0, -1], [x, -1], [-x, -1]], [[0, 1], [x, 1], [-x, 1]]);
        }
      } else if (y) {
        // horizontal
        lineDirections.push([[0, y * 2], [1, y], [-1, y]]);

        if (keepRatio) {
          lineDirections.push([[-1, 0], [-1, y], [-1, -y]], [[1, 0], [1, y], [1, -y]]);
        }
      } else {
        // [0, 0] to all direction
        lineDirections.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]);
      }

      return lineDirections;
    }
    function getCheckSnapLines(poses, direction, keepRatio) {
      return getCheckSnapLineDirections(direction, keepRatio).map(function (_a) {
        var sign = _a[0],
            dir1 = _a[1],
            dir2 = _a[2];
        return [sign, getPosByDirection(poses, dir1), getPosByDirection(poses, dir2)];
      });
    }

    function isBoundRotate(relativePoses, boundDots, center, rad) {
      var nextPoses = rad ? relativePoses.map(function (pos) {
        return rotate(pos, rad);
      }) : relativePoses;
      var dots = [center].concat(boundDots);
      return [[nextPoses[0], nextPoses[1]], [nextPoses[1], nextPoses[3]], [nextPoses[3], nextPoses[2]], [nextPoses[2], nextPoses[0]]].some(function (line, i) {
        return !isSameStartLine(dots, line);
      });
    }

    function getDistPointLine(_a) {
      // x = 0, y = 0
      // d = (ax + by + c) / root(a2 + b2)
      var pos1 = _a[0],
          pos2 = _a[1];
      var dx = pos2[0] - pos1[0];
      var dy = pos2[1] - pos1[1];

      if (!dx) {
        return Math.abs(pos1[0]);
      }

      if (!dy) {
        return Math.abs(pos1[1]);
      } // y - y1 = a(x - x1)
      // 0 = ax -y + -a * x1 + y1


      var a = dy / dx;
      return Math.abs((-a * pos1[0] + pos1[1]) / Math.sqrt(Math.pow(a, 2) + 1));
    }

    function solveReverseLine(_a) {
      var pos1 = _a[0],
          pos2 = _a[1];
      var dx = pos2[0] - pos1[0];
      var dy = pos2[1] - pos1[1];

      if (!dx) {
        return [pos1[0], 0];
      }

      if (!dy) {
        return [0, pos1[1]];
      }

      var a = dy / dx; // y - y1 = a (x  - x1)
      // y = ax - a * x1 + y1

      var b = -a * pos1[0] + pos1[1]; // y = ax + b = -1/a x
      // x = -b / (a + 1 / a)
      // y = b / (1 + 1 / a^2)

      return [-b / (a + 1 / a), b / (a * a + 1)];
    }

    function checkRotateInnerBounds(moveable, prevPoses, nextPoses, origin, rotation) {
      var bounds = moveable.props.innerBounds;
      var rad = rotation * Math.PI / 180;

      if (!bounds) {
        return [];
      }

      var left = bounds.left,
          top = bounds.top,
          width = bounds.width,
          height = bounds.height;
      var relativeLeft = left - origin[0];
      var relativeRight = left + width - origin[0];
      var relativeTop = top - origin[1];
      var relativeBottom = top + height - origin[1];
      var dots = [[relativeLeft, relativeTop], [relativeRight, relativeTop], [relativeLeft, relativeBottom], [relativeRight, relativeBottom]];
      var center = getPosByDirection(nextPoses, [0, 0]);

      if (!isBoundRotate(nextPoses, dots, center, 0)) {
        return [];
      }

      var result = [];
      var dotInfos = dots.map(function (dot) {
        return [getDistSize(dot), getRad([0, 0], dot)];
      });
      [[nextPoses[0], nextPoses[1]], [nextPoses[1], nextPoses[3]], [nextPoses[3], nextPoses[2]], [nextPoses[2], nextPoses[0]]].forEach(function (line) {
        var lineRad = getRad([0, 0], solveReverseLine(line));
        var lineDist = getDistPointLine(line);
        result.push.apply(result, dotInfos.filter(function (_a) {
          var dotDist = _a[0];
          return dotDist && lineDist <= dotDist;
        }).map(function (_a) {
          var dotDist = _a[0],
              dotRad = _a[1];
          var distRad = Math.acos(dotDist ? lineDist / dotDist : 0);
          var nextRad1 = dotRad + distRad;
          var nextRad2 = dotRad - distRad;
          return [rad + nextRad1 - lineRad, rad + nextRad2 - lineRad];
        }).reduce(function (prev, cur) {
          prev.push.apply(prev, cur);
          return prev;
        }, []).filter(function (nextRad) {
          return !isBoundRotate(prevPoses, dots, center, nextRad);
        }).map(function (nextRad) {
          return throttle(nextRad * 180 / Math.PI, TINY_NUM);
        }));
      });
      return result;
    }
    function checkInnerBoundPoses(moveable) {
      var innerBounds = moveable.props.innerBounds;

      if (!innerBounds) {
        return {
          vertical: [],
          horizontal: []
        };
      }

      var _a = moveable.getRect(),
          pos1 = _a.pos1,
          pos2 = _a.pos2,
          pos3 = _a.pos3,
          pos4 = _a.pos4;

      var poses = [pos1, pos2, pos3, pos4];
      var center = getPosByDirection(poses, [0, 0]);
      var left = innerBounds.left,
          top = innerBounds.top,
          width = innerBounds.width,
          height = innerBounds.height;
      var leftLine = [[left, top], [left, top + height]];
      var topLine = [[left, top], [left + width, top]];
      var rightLine = [[left + width, top], [left + width, top + height]];
      var bottomLine = [[left, top + height], [left + width, top + height]];
      var lines = [[pos1, pos2], [pos2, pos4], [pos4, pos3], [pos3, pos1]];
      var horizontalPoses = [];
      var verticalPoses = [];
      var boundMap = {
        top: false,
        bottom: false,
        left: false,
        right: false
      };
      lines.forEach(function (line) {
        var _a = isStartLine(center, line),
            isHorizontalStart = _a.horizontal,
            isVerticalStart = _a.vertical; // test vertical


        var topBoundInfo = checkLineBoundCollision(line, topLine, isVerticalStart, 1);
        var bottomBoundInfo = checkLineBoundCollision(line, bottomLine, isVerticalStart, 1); // test horizontal

        var leftBoundInfo = checkLineBoundCollision(line, leftLine, isHorizontalStart, 1);
        var rightBoundInfo = checkLineBoundCollision(line, rightLine, isHorizontalStart, 1);

        if (topBoundInfo.isBound && !boundMap.top) {
          horizontalPoses.push(top);
          boundMap.top = true;
        }

        if (bottomBoundInfo.isBound && !boundMap.bottom) {
          horizontalPoses.push(top + height);
          boundMap.bottom = true;
        }

        if (leftBoundInfo.isBound && !boundMap.left) {
          verticalPoses.push(left);
          boundMap.left = true;
        }

        if (rightBoundInfo.isBound && !boundMap.right) {
          verticalPoses.push(left + width);
          boundMap.right = true;
        }
      });
      return {
        horizontal: horizontalPoses,
        vertical: verticalPoses
      };
    }

    function checkBoundPoses(moveable, verticalPoses, horizontalPoses) {
      var _a = moveable.props.bounds || {},
          _b = _a.left,
          left = _b === void 0 ? -Infinity : _b,
          _c = _a.top,
          top = _c === void 0 ? -Infinity : _c,
          _d = _a.right,
          right = _d === void 0 ? Infinity : _d,
          _e = _a.bottom,
          bottom = _e === void 0 ? Infinity : _e;

      var bounds = {
        left: left,
        top: top,
        right: right,
        bottom: bottom
      };
      return {
        vertical: checkBound(bounds, verticalPoses, true),
        horizontal: checkBound(bounds, horizontalPoses, false)
      };
    }
    function checkBoundKeepRatio(moveable, startPos, endPos) {
      var _a = moveable.props.bounds || {},
          _b = _a.left,
          left = _b === void 0 ? -Infinity : _b,
          _c = _a.top,
          top = _c === void 0 ? -Infinity : _c,
          _d = _a.right,
          right = _d === void 0 ? Infinity : _d,
          _e = _a.bottom,
          bottom = _e === void 0 ? Infinity : _e;

      var endX = endPos[0],
          endY = endPos[1];

      var _f = minus(endPos, startPos),
          dx = _f[0],
          dy = _f[1];

      var isBottom = dy > 0;
      var isRight = dx > 0;
      var verticalInfo = {
        isBound: false,
        offset: 0,
        pos: 0
      };
      var horizontalInfo = {
        isBound: false,
        offset: 0,
        pos: 0
      };

      if (dx === 0 && dy === 0) {
        return {
          vertical: verticalInfo,
          horizontal: horizontalInfo
        };
      } else if (dx === 0) {
        if (isBottom) {
          if (bottom < endY) {
            horizontalInfo.pos = bottom;
            horizontalInfo.offset = endY - bottom;
          }
        } else {
          if (top > endY) {
            horizontalInfo.pos = top;
            horizontalInfo.offset = endY - top;
          }
        }
      } else if (dy === 0) {
        if (isRight) {
          if (right < endX) {
            verticalInfo.pos = right;
            verticalInfo.offset = endX - right;
          }
        } else {
          if (left > endX) {
            verticalInfo.pos = left;
            verticalInfo.offset = endX - left;
          }
        }
      } else {
        // y - y1 = a * (x - x1)
        var a = dy / dx;
        var b = endPos[1] - a * endX;
        var y = 0;
        var x = 0;
        var isBound = false;

        if (isRight && right <= endX) {
          y = a * right + b;
          x = right;
          isBound = true;
        } else if (!isRight && endX <= left) {
          y = a * left + b;
          x = left;
          isBound = true;
        } else if (isBottom && bottom <= endY) {
          y = bottom;
          x = (y - b) / a;
          isBound = true;
        } else if (!isBottom && endY <= top) {
          y = top;
          x = (y - b) / a;
          isBound = true;
        }

        if (isBound) {
          verticalInfo.isBound = true;
          verticalInfo.pos = x;
          verticalInfo.offset = endX - x;
          horizontalInfo.isBound = true;
          horizontalInfo.pos = y;
          horizontalInfo.offset = endY - y;
        }
      }

      return {
        vertical: verticalInfo,
        horizontal: horizontalInfo
      };
    }

    function checkBound(bounds, poses, isVertical) {
      // 0   [100 - 200]  300
      var startBoundPos = bounds[isVertical ? "left" : "top"];
      var endBoundPos = bounds[isVertical ? "right" : "bottom"]; // 450

      var minPos = Math.min.apply(Math, poses);
      var maxPos = Math.max.apply(Math, poses);

      if (startBoundPos + 1 > minPos) {
        return {
          isBound: true,
          offset: minPos - startBoundPos,
          pos: startBoundPos
        };
      }

      if (endBoundPos - 1 < maxPos) {
        return {
          isBound: true,
          offset: maxPos - endBoundPos,
          pos: endBoundPos
        };
      }

      return {
        isBound: false,
        offset: 0,
        pos: 0
      };
    }

    function isBoundRotate$1(relativePoses, boundRect, rad) {
      var nextPoses = rad ? relativePoses.map(function (pos) {
        return rotate(pos, rad);
      }) : relativePoses;
      return nextPoses.some(function (pos) {
        return pos[0] < boundRect.left && Math.abs(pos[0] - boundRect.left) > 0.1 || pos[0] > boundRect.right && Math.abs(pos[0] - boundRect.right) > 0.1 || pos[1] < boundRect.top && Math.abs(pos[1] - boundRect.top) > 0.1 || pos[1] > boundRect.bottom && Math.abs(pos[1] - boundRect.bottom) > 0.1;
      });
    }
    function boundRotate(vec, boundPos, index) {
      var r = getDistSize(vec);
      var nextPos = Math.sqrt(r * r - boundPos * boundPos) || 0;
      return [nextPos, -nextPos].sort(function (a, b) {
        return Math.abs(a - vec[index ? 0 : 1]) - Math.abs(b - vec[index ? 0 : 1]);
      }).map(function (pos) {
        return getRad([0, 0], index ? [pos, boundPos] : [boundPos, pos]);
      });
    }
    function checkRotateBounds(moveable, prevPoses, nextPoses, origin, rotation) {
      var bounds = moveable.props.bounds;
      var rad = rotation * Math.PI / 180;

      if (!bounds) {
        return [];
      }

      var _a = bounds.left,
          left = _a === void 0 ? -Infinity : _a,
          _b = bounds.top,
          top = _b === void 0 ? -Infinity : _b,
          _c = bounds.right,
          right = _c === void 0 ? Infinity : _c,
          _d = bounds.bottom,
          bottom = _d === void 0 ? Infinity : _d;
      var relativeLeft = left - origin[0];
      var relativeRight = right - origin[0];
      var relativeTop = top - origin[1];
      var relativeBottom = bottom - origin[1];
      var boundRect = {
        left: relativeLeft,
        top: relativeTop,
        right: relativeRight,
        bottom: relativeBottom
      };

      if (!isBoundRotate$1(nextPoses, boundRect, 0)) {
        return [];
      }

      var result = [];
      [[relativeLeft, 0], [relativeRight, 0], [relativeTop, 1], [relativeBottom, 1]].forEach(function (_a, i) {
        var boundPos = _a[0],
            index = _a[1];
        nextPoses.forEach(function (nextPos) {
          var relativeRad1 = getRad([0, 0], nextPos);
          result.push.apply(result, boundRotate(nextPos, boundPos, index).map(function (relativeRad2) {
            return rad + relativeRad2 - relativeRad1;
          }).filter(function (nextRad) {
            return !isBoundRotate$1(prevPoses, boundRect, nextRad);
          }).map(function (nextRad) {
            return throttle(nextRad * 180 / Math.PI, TINY_NUM);
          }));
        });
      });
      return result;
    }

    function caculateContainerPos(rootMatrix, containerRect, n) {
      var clientPos = caculatePosition(rootMatrix, [containerRect.clientLeft, containerRect.clientTop], n);
      return [containerRect.left + clientPos[0], containerRect.top + clientPos[1]];
    }
    function snapStart(moveable) {
      var state = moveable.state;

      if (state.guidelines && state.guidelines.length) {
        return;
      }

      var _a = moveable.props,
          _b = _a.horizontalGuidelines,
          horizontalGuidelines = _b === void 0 ? [] : _b,
          _c = _a.verticalGuidelines,
          verticalGuidelines = _c === void 0 ? [] : _c,
          _d = _a.elementGuidelines,
          elementGuidelines = _d === void 0 ? [] : _d,
          bounds = _a.bounds,
          snapCenter = _a.snapCenter;

      if (!bounds && !horizontalGuidelines.length && !verticalGuidelines.length && !elementGuidelines.length) {
        return;
      }

      var containerClientRect = state.containerClientRect,
          _e = state.targetClientRect,
          clientTop = _e.top,
          clientLeft = _e.left,
          rootMatrix = state.rootMatrix,
          is3d = state.is3d;
      var n = is3d ? 4 : 3;

      var _f = caculateContainerPos(rootMatrix, containerClientRect, n),
          containerLeft = _f[0],
          containerTop = _f[1];

      var poses = getAbsolutePosesByState(state);
      var targetLeft = Math.min.apply(Math, poses.map(function (pos) {
        return pos[0];
      }));
      var targetTop = Math.min.apply(Math, poses.map(function (pos) {
        return pos[1];
      }));

      var _g = minus([targetLeft, targetTop], caculateInversePosition(rootMatrix, [clientLeft - containerLeft, clientTop - containerTop], n)).map(function (pos) {
        return roundSign(pos);
      }),
          distLeft = _g[0],
          distTop = _g[1];

      var guidelines = [];
      elementGuidelines.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var left = rect.left - containerLeft;
        var top = rect.top - containerTop;
        var bottom = top + rect.height;
        var right = left + rect.width;

        var _a = caculateInversePosition(rootMatrix, [left, top], n),
            elementLeft = _a[0],
            elementTop = _a[1];

        var _b = caculateInversePosition(rootMatrix, [right, bottom], n),
            elementRight = _b[0],
            elementBottom = _b[1];

        var width = elementRight - elementLeft;
        var height = elementBottom - elementTop;
        var sizes = [width, height];
        guidelines.push({
          type: "vertical",
          element: el,
          pos: [throttle(elementLeft + distLeft, 0.1), elementTop],
          size: height,
          sizes: sizes
        });
        guidelines.push({
          type: "vertical",
          element: el,
          pos: [throttle(elementRight + distLeft, 0.1), elementTop],
          size: height,
          sizes: sizes
        });
        guidelines.push({
          type: "horizontal",
          element: el,
          pos: [elementLeft, throttle(elementTop + distTop, 0.1)],
          size: width,
          sizes: sizes
        });
        guidelines.push({
          type: "horizontal",
          element: el,
          pos: [elementLeft, throttle(elementBottom + distTop, 0.1)],
          size: width,
          sizes: sizes
        });

        if (snapCenter) {
          guidelines.push({
            type: "vertical",
            element: el,
            pos: [throttle((elementLeft + elementRight) / 2 + distLeft, 0.1), elementTop],
            size: height,
            sizes: sizes,
            center: true
          });
          guidelines.push({
            type: "horizontal",
            element: el,
            pos: [elementLeft, throttle((elementTop + elementBottom) / 2 + distTop, 0.1)],
            size: width,
            sizes: sizes,
            center: true
          });
        }
      });
      state.guidelines = guidelines;
      state.enableSnap = true;
    }
    function hasGuidelines(moveable, ableName) {
      var _a = moveable.props,
          snappable = _a.snappable,
          bounds = _a.bounds,
          verticalGuidelines = _a.verticalGuidelines,
          horizontalGuidelines = _a.horizontalGuidelines,
          _b = moveable.state,
          guidelines = _b.guidelines,
          enableSnap = _b.enableSnap;

      if (!snappable || !enableSnap || ableName && snappable !== true && snappable.indexOf(ableName) < 0) {
        return false;
      }

      if (bounds || guidelines && guidelines.length || verticalGuidelines && verticalGuidelines.length || horizontalGuidelines && horizontalGuidelines.length) {
        return true;
      }

      return false;
    }

    function solveNextOffset(pos1, pos2, offset, isVertical, datas) {
      var sizeOffset = solveEquation(pos1, pos2, -offset, isVertical);

      if (!sizeOffset) {
        return [0, 0];
      }

      var _a = getDragDist({
        datas: datas,
        distX: sizeOffset[0],
        distY: sizeOffset[1]
      }),
          widthOffset = _a[0],
          heightOffset = _a[1];

      return [widthOffset, heightOffset];
    }

    function getNextFixedPoses(matrix, width, height, fixedPos, direction, is3d) {
      var nextPoses = caculatePoses(matrix, width, height, is3d ? 4 : 3);
      var nextPos = getPosByReverseDirection(nextPoses, direction);
      return getAbsolutePoses(nextPoses, minus(fixedPos, nextPos));
    }

    function getSnapBoundOffset(boundInfo, snapInfo) {
      if (boundInfo.isBound) {
        return boundInfo.offset;
      } else if (snapInfo.isSnap) {
        return snapInfo.offset;
      }

      return 0;
    }

    function getSnapBound(boundInfo, snapInfo) {
      if (boundInfo.isBound) {
        return boundInfo.offset;
      } else if (snapInfo.isSnap) {
        return getNearestSnapGuidelineInfo(snapInfo).offset;
      }

      return 0;
    }

    function checkSnapBoundsKeepRatio(moveable, startPos, endPos, isRequest) {
      var _a = checkBoundKeepRatio(moveable, startPos, endPos),
          horizontalBoundInfo = _a.horizontal,
          verticalBoundInfo = _a.vertical;

      var _b = isRequest ? {
        horizontal: {
          isSnap: false
        },
        vertical: {
          isSnap: false
        }
      } : checkSnapKeepRatio(moveable, startPos, endPos),
          horizontalSnapInfo = _b.horizontal,
          verticalSnapInfo = _b.vertical;

      var horizontalOffset = getSnapBoundOffset(horizontalBoundInfo, horizontalSnapInfo);
      var verticalOffset = getSnapBoundOffset(verticalBoundInfo, verticalSnapInfo);
      var horizontalDist = Math.abs(horizontalOffset);
      var verticalDist = Math.abs(verticalOffset);
      return {
        horizontal: {
          isBound: horizontalBoundInfo.isBound,
          isSnap: horizontalSnapInfo.isSnap,
          offset: horizontalOffset,
          dist: horizontalDist
        },
        vertical: {
          isBound: verticalBoundInfo.isBound,
          isSnap: verticalSnapInfo.isSnap,
          offset: verticalOffset,
          dist: verticalDist
        }
      };
    }
    function checkSnapBounds(moveable, isRequest, poses, boundPoses) {
      if (boundPoses === void 0) {
        boundPoses = poses;
      }

      var _a = checkBoundPoses(moveable, boundPoses.map(function (pos) {
        return pos[0];
      }), boundPoses.map(function (pos) {
        return pos[1];
      })),
          horizontalBoundInfo = _a.horizontal,
          verticalBoundInfo = _a.vertical;

      var _b = isRequest ? {
        horizontal: {
          isSnap: false
        },
        vertical: {
          isSnap: false
        }
      } : checkSnapPoses(moveable, poses.map(function (pos) {
        return pos[0];
      }), poses.map(function (pos) {
        return pos[1];
      })),
          horizontalSnapInfo = _b.horizontal,
          verticalSnapInfo = _b.vertical;

      var horizontalOffset = getSnapBound(horizontalBoundInfo, horizontalSnapInfo);
      var verticalOffset = getSnapBound(verticalBoundInfo, verticalSnapInfo);
      var horizontalDist = Math.abs(horizontalOffset);
      var verticalDist = Math.abs(verticalOffset);
      return {
        horizontal: {
          isBound: horizontalBoundInfo.isBound,
          isSnap: horizontalSnapInfo.isSnap,
          offset: horizontalOffset,
          dist: horizontalDist
        },
        vertical: {
          isBound: verticalBoundInfo.isBound,
          isSnap: verticalSnapInfo.isSnap,
          offset: verticalOffset,
          dist: verticalDist
        }
      };
    }
    function checkMaxBounds(moveable, width, height, poses, direction, fixedPos, datas) {
      var fixedDirection = [-direction[0], -direction[1]];
      var bounds = moveable.props.bounds;
      var maxWidth = Infinity;
      var maxHeight = Infinity;

      if (bounds) {
        var directions = [[direction[0], -direction[1]], [-direction[0], direction[1]]];
        var _a = bounds.left,
            left_1 = _a === void 0 ? -Infinity : _a,
            _b = bounds.top,
            top_1 = _b === void 0 ? -Infinity : _b,
            _c = bounds.right,
            right_1 = _c === void 0 ? Infinity : _c,
            _d = bounds.bottom,
            bottom_1 = _d === void 0 ? Infinity : _d;
        directions.forEach(function (otherDirection) {
          var isCheckVertical = otherDirection[0] !== fixedDirection[0];
          var isCheckHorizontal = otherDirection[1] !== fixedDirection[1];
          var otherPos = getPosByDirection(poses, otherDirection);

          if (isCheckHorizontal) {
            var _a = solveNextOffset(fixedPos, otherPos, (fixedPos[1] < otherPos[1] ? bottom_1 : top_1) - otherPos[1], false, datas),
                heightOffset = _a[1];

            if (!isNaN(heightOffset)) {
              maxHeight = height + heightOffset;
            }
          }

          if (isCheckVertical) {
            var widthOffset = solveNextOffset(fixedPos, otherPos, (fixedPos[0] < otherPos[0] ? right_1 : left_1) - otherPos[0], true, datas)[0];

            if (!isNaN(widthOffset)) {
              maxWidth = width + widthOffset;
            }
          }
        });
      }

      return {
        maxWidth: maxWidth,
        maxHeight: maxHeight
      };
    }

    function getSnapBoundInfo(moveable, poses, directions, keepRatio, isRequest, datas) {
      return directions.map(function (_a) {
        var startDirection = _a[0],
            endDirection = _a[1];
        var otherStartPos = getPosByDirection(poses, startDirection);
        var otherEndPos = getPosByDirection(poses, endDirection);
        var snapBoundInfo = keepRatio ? checkSnapBoundsKeepRatio(moveable, otherStartPos, otherEndPos, isRequest) : checkSnapBounds(moveable, isRequest, [otherEndPos]);
        var _b = snapBoundInfo.horizontal,
            otherHorizontalDist = _b.dist,
            otherHorizontalOffset = _b.offset,
            isOtherHorizontalBound = _b.isBound,
            isOtherHorizontalSnap = _b.isSnap,
            _c = snapBoundInfo.vertical,
            otherVerticalDist = _c.dist,
            otherVerticalOffset = _c.offset,
            isOtherVerticalBound = _c.isBound,
            isOtherVerticalSnap = _c.isSnap;
        var multiple = minus(endDirection, startDirection);

        if (!otherVerticalOffset && !otherHorizontalOffset) {
          return {
            isBound: isOtherVerticalBound || isOtherHorizontalBound,
            isSnap: isOtherVerticalSnap || isOtherHorizontalSnap,
            sign: multiple,
            offset: [0, 0]
          };
        }

        var isVertical = otherHorizontalDist < otherVerticalDist;
        var sizeOffset = solveNextOffset(otherStartPos, otherEndPos, isVertical ? otherVerticalOffset : otherHorizontalOffset, isVertical, datas).map(function (size, i) {
          return size * (multiple[i] ? 2 / multiple[i] : 0);
        });
        return {
          sign: multiple,
          isBound: isVertical ? isOtherVerticalBound : isOtherHorizontalBound,
          isSnap: isVertical ? isOtherVerticalSnap : isOtherHorizontalSnap,
          offset: sizeOffset
        };
      });
    }

    function getCheckSnapDirections(direction, keepRatio) {
      var directions = [];
      var fixedDirection = [-direction[0], -direction[1]];

      if (direction[0] && direction[1]) {
        directions.push([fixedDirection, [direction[0], -direction[1]]], [fixedDirection, [-direction[0], direction[1]]]);

        if (keepRatio) {
          // pass two direction condition
          directions.push([fixedDirection, direction]);
        }
      } else if (direction[0]) {
        // vertcal
        if (keepRatio) {
          directions.push([fixedDirection, [fixedDirection[0], -1]], [fixedDirection, [fixedDirection[0], 1]], [fixedDirection, [direction[0], -1]], [fixedDirection, direction], [fixedDirection, [direction[0], 1]]);
        } else {
          directions.push([[fixedDirection[0], -1], [direction[0], -1]], [[fixedDirection[0], 0], [direction[0], 0]], [[fixedDirection[0], 1], [direction[0], 1]]);
        }
      } else if (direction[1]) {
        // horizontal
        if (keepRatio) {
          directions.push([fixedDirection, [-1, fixedDirection[1]]], [fixedDirection, [1, fixedDirection[1]]], [fixedDirection, [-1, direction[1]]], [fixedDirection, [1, direction[1]]], [fixedDirection, direction]);
        } else {
          directions.push([[-1, fixedDirection[1]], [-1, direction[1]]], [[0, fixedDirection[1]], [0, direction[1]]], [[1, fixedDirection[1]], [1, direction[1]]]);
        }
      } else {
        // [0, 0] to all direction
        directions.push([fixedDirection, [1, 0]], [fixedDirection, [-1, 0]], [fixedDirection, [0, -1]], [fixedDirection, [0, 1]], [[1, 0], [1, -1]], [[1, 0], [1, 1]], [[0, 1], [1, 1]], [[0, 1], [-1, 1]], [[-1, 0], [-1, -1]], [[-1, 0], [-1, 1]], [[0, -1], [1, -1]], [[0, -1], [-1, -1]]);
      }

      return directions;
    }
    function getSizeOffsetInfo(moveable, poses, direction, keepRatio, isRequest, datas) {
      var directions = getCheckSnapDirections(direction, keepRatio);
      var lines = getCheckSnapLines(poses, direction, keepRatio);
      var offsets = getSnapBoundInfo(moveable, poses, directions, keepRatio, isRequest, datas).concat(getInnerBoundInfo(moveable, lines, getPosByDirection(poses, [0, 0]), datas));
      var widthOffsetInfo = getNearOffsetInfo(offsets, 0);
      var heightOffsetInfo = getNearOffsetInfo(offsets, 1);
      return {
        width: {
          isBound: widthOffsetInfo.isBound,
          offset: widthOffsetInfo.offset[0]
        },
        height: {
          isBound: heightOffsetInfo.isBound,
          offset: heightOffsetInfo.offset[1]
        }
      };
    }
    function recheckSizeByTwoDirection(moveable, poses, width, height, maxWidth, maxHeight, direction, isRequest, datas) {
      var snapPos = getPosByDirection(poses, direction);

      var _a = checkSnapBounds(moveable, isRequest, [snapPos]),
          horizontalOffset = _a.horizontal.offset,
          verticalOffset = _a.vertical.offset;

      if (verticalOffset || horizontalOffset) {
        var _b = getDragDist({
          datas: datas,
          distX: -verticalOffset,
          distY: -horizontalOffset
        }),
            nextWidthOffset = _b[0],
            nextHeightOffset = _b[1];

        var nextWidth = Math.min(maxWidth || Infinity, width + direction[0] * nextWidthOffset);
        var nextHeight = Math.min(maxHeight || Infinity, height + direction[1] * nextHeightOffset);
        return [nextWidth - width, nextHeight - height];
      }

      return [0, 0];
    }
    function checkSizeDist(moveable, getNextPoses, width, height, direction, fixedPos, isRequest, datas) {
      var poses = getAbsolutePosesByState(moveable.state);
      var keepRatio = moveable.props.keepRatio;
      var widthOffset = 0;
      var heightOffset = 0;

      for (var i = 0; i < 2; ++i) {
        var nextPoses = getNextPoses(widthOffset, heightOffset);

        var _a = getSizeOffsetInfo(moveable, nextPoses, direction, keepRatio, isRequest, datas),
            widthOffsetInfo = _a.width,
            heightOffsetInfo = _a.height;

        var isWidthBound = widthOffsetInfo.isBound;
        var isHeightBound = heightOffsetInfo.isBound;
        var nextWidthOffset = widthOffsetInfo.offset;
        var nextHeightOffset = heightOffsetInfo.offset;

        if (i === 1) {
          if (!isWidthBound) {
            nextWidthOffset = 0;
          }

          if (!isHeightBound) {
            nextHeightOffset = 0;
          }
        }

        if (i === 0 && isRequest && !isWidthBound && !isHeightBound) {
          return [0, 0];
        }

        if (keepRatio) {
          var widthDist = Math.abs(nextWidthOffset) * (width ? 1 / width : 1);
          var heightDist = Math.abs(nextHeightOffset) * (height ? 1 / height : 1);
          var isGetWidthOffset = isWidthBound && isHeightBound ? widthDist < heightDist : isHeightBound || !isWidthBound && widthDist < heightDist; // height * widthOffset = width * heighOffset

          if (isGetWidthOffset) {
            // width : height = ? : heightOffset
            nextWidthOffset = width * nextHeightOffset / height;
          } else {
            // width : height = widthOffset : ?
            nextHeightOffset = height * nextWidthOffset / width;
          }
        }

        widthOffset += nextWidthOffset;
        heightOffset += nextHeightOffset;
      }

      if (direction[0] && direction[1]) {
        var _b = checkMaxBounds(moveable, width, height, poses, direction, fixedPos, datas),
            maxWidth = _b.maxWidth,
            maxHeight = _b.maxHeight;

        var _c = recheckSizeByTwoDirection(moveable, getNextPoses(widthOffset, heightOffset), width + widthOffset, height + heightOffset, maxWidth, maxHeight, direction, isRequest, datas),
            nextWidthOffset = _c[0],
            nextHeightOffset = _c[1];

        widthOffset += nextWidthOffset;
        heightOffset += nextHeightOffset;
      }

      return [widthOffset, heightOffset];
    }
    function checkSnapRotate(moveable, rect, origin, rotation) {
      if (!hasGuidelines(moveable, "rotatable")) {
        return rotation;
      }

      var pos1 = rect.pos1,
          pos2 = rect.pos2,
          pos3 = rect.pos3,
          pos4 = rect.pos4;
      var rad = rotation * Math.PI / 180;
      var prevPoses = [pos1, pos2, pos3, pos4].map(function (pos) {
        return minus(pos, origin);
      });
      var nextPoses = prevPoses.map(function (pos) {
        return rotate(pos, rad);
      });
      var result = checkRotateBounds(moveable, prevPoses, nextPoses, origin, rotation).concat(checkRotateInnerBounds(moveable, prevPoses, nextPoses, origin, rotation));
      result.sort(function (a, b) {
        return Math.abs(a - rotation) - Math.abs(b - rotation);
      });

      if (result.length) {
        return result[0];
      } else {
        return rotation;
      }
    }
    function checkSnapSize(moveable, width, height, direction, fixedPos, isRequest, datas) {
      if (!hasGuidelines(moveable, "resizable")) {
        return [0, 0];
      }

      var _a = moveable.state,
          matrix = _a.matrix,
          is3d = _a.is3d;
      return checkSizeDist(moveable, function (widthOffset, heightOffset) {
        return getNextFixedPoses(matrix, width + widthOffset, height + heightOffset, fixedPos, direction, is3d);
      }, width, height, direction, fixedPos, isRequest, datas);
    }
    function checkSnapScale(moveable, scale, direction, fixedPos, isRequest, datas) {
      var width = datas.width,
          height = datas.height;

      if (!hasGuidelines(moveable, "scalable")) {
        return [0, 0];
      }

      var is3d = datas.is3d;
      var sizeDist = checkSizeDist(moveable, function (widthOffset, heightOffset) {
        return getNextFixedPoses(scaleMatrix(datas, plus(scale, [widthOffset / width, heightOffset / height])), width, height, fixedPos, direction, is3d);
      }, width, height, direction, fixedPos, isRequest, datas);
      return [sizeDist[0] / width, sizeDist[1] / height];
    }
    function solveEquation(pos1, pos2, snapOffset, isVertical) {
      var dx = pos2[0] - pos1[0];
      var dy = pos2[1] - pos1[1];

      if (Math.abs(dx) < TINY_NUM) {
        dx = 0;
      }

      if (Math.abs(dy) < TINY_NUM) {
        dy = 0;
      }

      if (!dx) {
        // y = 0 * x + b
        // only horizontal
        if (!isVertical) {
          return [0, snapOffset];
        }

        return [0, 0];
      }

      if (!dy) {
        // only vertical
        if (isVertical) {
          return [snapOffset, 0];
        }

        return [0, 0];
      } // y = ax + b


      var a = dy / dx;
      var b = pos1[1] - a * pos1[0];

      if (isVertical) {
        // y = a * x + b
        var y = a * (pos2[0] + snapOffset) + b;
        return [snapOffset, y - pos2[1]];
      } else {
        // x = (y - b) / a
        var x = (pos2[1] + snapOffset - b) / a;
        return [x - pos2[0], snapOffset];
      }
    }
    function startCheckSnapDrag(moveable, datas) {
      datas.absolutePoses = getAbsolutePosesByState(moveable.state);
    }
    function checkThrottleDragRotate(throttleDragRotate, _a, _b, _c, _d) {
      var distX = _a[0],
          distY = _a[1];
      var isVerticalBound = _b[0],
          isHorizontalBound = _b[1];
      var isVerticalSnap = _c[0],
          isHorizontalSnap = _c[1];
      var verticalOffset = _d[0],
          horizontalOffset = _d[1];
      var offsetX = -verticalOffset;
      var offsetY = -horizontalOffset;

      if (throttleDragRotate && distX && distY) {
        offsetX = 0;
        offsetY = 0;
        var adjustPoses = [];

        if (isVerticalBound && isHorizontalBound) {
          adjustPoses.push([0, horizontalOffset], [verticalOffset, 0]);
        } else if (isVerticalBound) {
          adjustPoses.push([verticalOffset, 0]);
        } else if (isHorizontalBound) {
          adjustPoses.push([0, horizontalOffset]);
        } else if (isVerticalSnap && isHorizontalSnap) {
          adjustPoses.push([0, horizontalOffset], [verticalOffset, 0]);
        } else if (isVerticalSnap) {
          adjustPoses.push([verticalOffset, 0]);
        } else if (isHorizontalSnap) {
          adjustPoses.push([0, horizontalOffset]);
        }

        if (adjustPoses.length) {
          adjustPoses.sort(function (a, b) {
            return getDistSize(minus([distX, distY], a)) - getDistSize(minus([distX, distY], b));
          });
          var adjustPos = adjustPoses[0];

          if (adjustPos[0] && Math.abs(distX) > TINY_NUM) {
            offsetX = -adjustPos[0];
            offsetY = distY * Math.abs(distX + offsetX) / Math.abs(distX) - distY;
          } else if (adjustPos[1] && Math.abs(distY) > TINY_NUM) {
            var prevDistY = distY;
            offsetY = -adjustPos[1];
            offsetX = distX * Math.abs(distY + offsetY) / Math.abs(prevDistY) - distX;
          }

          if (throttleDragRotate && isHorizontalBound && isVerticalBound) {
            if (Math.abs(offsetX) > TINY_NUM && Math.abs(offsetX) < Math.abs(verticalOffset)) {
              var scale = Math.abs(verticalOffset) / Math.abs(offsetX);
              offsetX *= scale;
              offsetY *= scale;
            } else if (Math.abs(offsetY) > TINY_NUM && Math.abs(offsetY) < Math.abs(horizontalOffset)) {
              var scale = Math.abs(horizontalOffset) / Math.abs(offsetY);
              offsetX *= scale;
              offsetY *= scale;
            } else {
              offsetX = maxOffset(-verticalOffset, offsetX);
              offsetY = maxOffset(-horizontalOffset, offsetY);
            }
          }
        }
      } else {
        offsetX = distX || isVerticalBound ? -verticalOffset : 0;
        offsetY = distY || isHorizontalBound ? -horizontalOffset : 0;
      }

      return [offsetX, offsetY];
    }
    function checkSnapDrag(moveable, distX, distY, throttleDragRotate, isRequest, datas) {
      if (!hasGuidelines(moveable, "draggable")) {
        return [{
          isSnap: false,
          isBound: false,
          offset: 0
        }, {
          isSnap: false,
          isBound: false,
          offset: 0
        }];
      }

      var poses = getAbsolutePoses(datas.absolutePoses, [distX, distY]);

      var _a = getRect(poses),
          left = _a.left,
          right = _a.right,
          top = _a.top,
          bottom = _a.bottom;

      var snapCenter = moveable.props.snapCenter;
      var snapPoses = [[left, top], [right, top], [left, bottom], [right, bottom]];

      if (snapCenter) {
        snapPoses.push([(left + right) / 2, (top + bottom) / 2]);
      }

      var _b = checkSnapBounds(moveable, isRequest, snapPoses, poses),
          verticalSnapBoundInfo = _b.vertical,
          horizontalSnapBoundInfo = _b.horizontal;

      var _c = getInnerBoundDragInfo(moveable, poses, datas),
          verticalInnerBoundInfo = _c.vertical,
          horizontalInnerBoundInfo = _c.horizontal;

      var isVerticalSnap = verticalSnapBoundInfo.isSnap;
      var isHorizontalSnap = horizontalSnapBoundInfo.isSnap;
      var isVerticalBound = verticalSnapBoundInfo.isBound || verticalInnerBoundInfo.isBound;
      var isHorizontalBound = horizontalSnapBoundInfo.isBound || horizontalInnerBoundInfo.isBound;
      var verticalOffset = maxOffset(verticalSnapBoundInfo.offset, verticalInnerBoundInfo.offset);
      var horizontalOffset = maxOffset(horizontalSnapBoundInfo.offset, horizontalInnerBoundInfo.offset);

      var _d = checkThrottleDragRotate(throttleDragRotate, [distX, distY], [isVerticalBound, isHorizontalBound], [isVerticalSnap, isHorizontalSnap], [verticalOffset, horizontalOffset]),
          offsetX = _d[0],
          offsetY = _d[1];

      return [{
        isBound: isVerticalBound,
        isSnap: isVerticalSnap,
        offset: offsetX
      }, {
        isBound: isHorizontalBound,
        isSnap: isHorizontalSnap,
        offset: offsetY
      }];
    }

    function getSnapGuidelines(posInfos) {
      var guidelines = [];
      posInfos.forEach(function (posInfo) {
        posInfo.guidelineInfos.forEach(function (_a) {
          var guideline = _a.guideline;

          if (guidelines.indexOf(guideline) > -1) {
            return;
          }

          guidelines.push(guideline);
        });
      });
      return guidelines;
    }

    function getElementGuidelineDist(elementPos, elementSize, targetPos, targetSize) {
      // relativePos < 0  => element(l)  ---  (r)target
      // relativePos > 0  => target(l)   ---  (r)element
      var relativePos = elementPos - targetPos;
      var startPos = relativePos < 0 ? relativePos + elementSize : targetSize;
      var endPos = relativePos < 0 ? 0 : relativePos;
      var size = endPos - startPos;
      return {
        size: size,
        pos: startPos
      };
    }

    function groupByElementGuidelines(guidelines, clientPos, size, index) {
      var groupInfos = [];
      var group = groupBy(guidelines.filter(function (_a) {
        var element = _a.element,
            gap = _a.gap;
        return element && !gap;
      }), function (_a) {
        var element = _a.element,
            pos = _a.pos;
        var elementPos = pos[index];
        var sign = Math.min(0, elementPos - clientPos) < 0 ? -1 : 1;
        var groupKey = sign + "_" + pos[index ? 0 : 1];
        var groupInfo = find(groupInfos, function (_a) {
          var groupElement = _a[0],
              groupPos = _a[1];
          return element === groupElement && elementPos === groupPos;
        });

        if (groupInfo) {
          return groupInfo[2];
        }

        groupInfos.push([element, elementPos, groupKey]);
        return groupKey;
      });
      group.forEach(function (elementGuidelines) {
        elementGuidelines.sort(function (a, b) {
          var result = getElementGuidelineDist(a.pos[index], a.size, clientPos, size).size - getElementGuidelineDist(b.pos[index], a.size, clientPos, size).size;
          return result || a.pos[index ? 0 : 1] - b.pos[index ? 0 : 1];
        });
      });
      return group;
    }

    function renderElementGroup(group, _a, minPos, clientPos, clientSize, targetPos, snapThreshold, isDisplaySnapDigit, snapDigit, index, snapDistFormat, React) {
      var directionName = _a[0],
          posName1 = _a[1],
          posName2 = _a[2],
          sizeName = _a[3];
      return flat$1(group.map(function (elementGuidelines, i) {
        var isFirstRenderSize = true;
        return elementGuidelines.map(function (_a, j) {
          var _b;

          var pos = _a.pos,
              size = _a.size;

          var _c = getElementGuidelineDist(pos[index], size, clientPos, clientSize),
              linePos = _c.pos,
              lineSize = _c.size;

          if (lineSize < snapThreshold) {
            return null;
          }

          var isRenderSize = isFirstRenderSize;
          isFirstRenderSize = false;
          var snapSize = isDisplaySnapDigit && isRenderSize ? parseFloat(lineSize.toFixed(snapDigit)) : 0;
          return React.createElement("div", {
            className: prefix("line", directionName, "guideline", "dashed"),
            "data-size": snapSize > 0 ? snapDistFormat(snapSize) : "",
            key: directionName + "LinkGuidline" + i + "-" + j,
            style: (_b = {}, _b[posName1] = minPos + linePos + "px", _b[posName2] = -targetPos + pos[index ? 0 : 1] + "px", _b[sizeName] = lineSize + "px", _b)
          });
        });
      }));
    }

    function renderSnapPoses(snapPoses, _a, minPos, targetPos, size, React) {
      var directionName = _a[0],
          posName1 = _a[1],
          posName2 = _a[2],
          sizeName = _a[3];
      return snapPoses.map(function (pos, i) {
        var _a;

        return React.createElement("div", {
          className: prefix("line", directionName, "guideline", "target", "bold"),
          key: directionName + "TargetGuidline" + i,
          style: (_a = {}, _a[posName1] = minPos + "px", _a[posName2] = -targetPos + pos + "px", _a[sizeName] = size + "px", _a)
        });
      });
    }

    function renderGuidelines(guidelines, _a, targetPos1, targetPos2, index, React) {
      var directionName = _a[0],
          posName1 = _a[1],
          posName2 = _a[2],
          sizeName = _a[3];
      return guidelines.map(function (guideline, i) {
        var _a;

        var pos = guideline.pos,
            size = guideline.size,
            element = guideline.element;
        return React.createElement("div", {
          className: prefix("line", directionName, "guideline", element ? "bold" : ""),
          key: directionName + "Guidline" + i,
          style: (_a = {}, _a[posName1] = -targetPos1 + pos[index] + "px", _a[posName2] = -targetPos2 + pos[index ? 0 : 1] + "px", _a[sizeName] = size + "px", _a)
        });
      });
    }

    function getGapGuidelinesToStart(guidelines, index, targetPos, targetSizes, guidelinePos, gap, otherPos) {
      var absGap = Math.abs(gap);
      var start = guidelinePos[index] + (gap > 0 ? targetSizes[0] : 0);
      return guidelines.filter(function (_a) {
        var gapPos = _a.pos;
        return gapPos[index] <= targetPos[index];
      }).sort(function (_a, _b) {
        var aPos = _a.pos;
        var bPos = _b.pos;
        return bPos[index] - aPos[index];
      }).filter(function (_a) {
        var gapPos = _a.pos,
            gapSizes = _a.sizes;
        var nextPos = gapPos[index];

        if (throttle(nextPos + gapSizes[index], 0.0001) === throttle(start - absGap, 0.0001)) {
          start = nextPos;
          return true;
        }

        return false;
      }).map(function (gapGuideline) {
        var renderPos = -targetPos[index] + gapGuideline.pos[index] + gapGuideline.sizes[index];
        return __assign$4({}, gapGuideline, {
          gap: gap,
          renderPos: index ? [otherPos, renderPos] : [renderPos, otherPos]
        });
      });
    }

    function getGapGuidelinesToEnd(guidelines, index, targetPos, targetSizes, guidelinePos, gap, otherPos) {
      var absGap = Math.abs(gap);
      var start = guidelinePos[index] + (gap < 0 ? targetSizes[index] : 0);
      return guidelines.filter(function (_a) {
        var gapPos = _a.pos;
        return gapPos[index] > targetPos[index];
      }).sort(function (_a, _b) {
        var aPos = _a.pos;
        var bPos = _b.pos;
        return aPos[index] - bPos[index];
      }).filter(function (_a) {
        var gapPos = _a.pos,
            gapSizes = _a.sizes;
        var nextPos = gapPos[index];

        if (throttle(nextPos, 0.0001) === throttle(start + absGap, 0.0001)) {
          start = nextPos + gapSizes[index];
          return true;
        }

        return false;
      }).map(function (gapGuideline) {
        var renderPos = -targetPos[index] + gapGuideline.pos[index] - absGap;
        return __assign$4({}, gapGuideline, {
          gap: gap,
          renderPos: index ? [otherPos, renderPos] : [renderPos, otherPos]
        });
      });
    }

    function getGapGuidelines$1(guidelines, type, targetPos, targetSizes) {
      var elementGuidelines = guidelines.filter(function (_a) {
        var element = _a.element,
            gap = _a.gap,
            guidelineType = _a.type;
        return element && gap && guidelineType === type;
      });

      var _a = type === "vertical" ? [0, 1] : [1, 0],
          index = _a[0],
          otherIndex = _a[1];

      return flat$1(elementGuidelines.map(function (guideline, i) {
        var pos = guideline.pos;
        var gap = guideline.gap;
        var gapGuidelines = guideline.gapGuidelines;
        var sizes = guideline.sizes;
        var offset = minOffset(pos[otherIndex] + sizes[otherIndex] - targetPos[otherIndex], pos[otherIndex] - targetPos[otherIndex] - targetSizes[otherIndex]);
        var minSize = Math.min(sizes[otherIndex], targetSizes[otherIndex]);

        if (offset > 0 && offset > minSize) {
          offset = (offset - minSize / 2) * 2;
        } else if (offset < 0 && offset < -minSize) {
          offset = (offset + minSize / 2) * 2;
        }

        var otherPos = (offset > 0 ? 0 : targetSizes[otherIndex]) + offset / 2;
        return getGapGuidelinesToStart(gapGuidelines, index, targetPos, targetSizes, pos, gap, otherPos).concat(getGapGuidelinesToEnd(gapGuidelines, index, targetPos, targetSizes, pos, gap, otherPos));
      }));
    }

    function renderGapGuidelines(moveable, gapGuidelines, type, _a, snapDistFormat, React) {
      var directionName = _a[0],
          posName1 = _a[1],
          posName2 = _a[2],
          sizeName = _a[3];
      var _b = moveable.props,
          _c = _b.snapDigit,
          snapDigit = _c === void 0 ? 0 : _c,
          _d = _b.isDisplaySnapDigit,
          isDisplaySnapDigit = _d === void 0 ? true : _d;
      var otherType = type === "vertical" ? "horizontal" : "vertical";

      var _e = type === "vertical" ? [0, 1] : [1, 0],
          index = _e[0],
          otherIndex = _e[1];

      return gapGuidelines.map(function (_a, i) {
        var _b;

        var renderPos = _a.renderPos,
            gap = _a.gap;
        var absGap = Math.abs(gap);
        var snapSize = isDisplaySnapDigit ? parseFloat(absGap.toFixed(snapDigit)) : 0;
        return React.createElement("div", {
          className: prefix("line", directionName, "guideline", "gap"),
          "data-size": snapSize > 0 ? snapDistFormat(snapSize) : "",
          key: otherType + "GapGuideline" + i,
          style: (_b = {}, _b[posName1] = renderPos[index] + "px", _b[posName2] = renderPos[otherIndex] + "px", _b[sizeName] = absGap + "px", _b)
        });
      });
    }

    function addBoundGuidelines(moveable, verticalPoses, horizontalPoses, verticalSnapPoses, horizontalSnapPoses) {
      var _a = checkBoundPoses(moveable, verticalPoses, horizontalPoses),
          _b = _a.vertical,
          isVerticalBound = _b.isBound,
          verticalBoundPos = _b.pos,
          _c = _a.horizontal,
          isHorizontalBound = _c.isBound,
          horizontalBoundPos = _c.pos;

      if (isVerticalBound && verticalSnapPoses.indexOf(verticalBoundPos) < 0) {
        verticalSnapPoses.push(verticalBoundPos);
      }

      if (isHorizontalBound && horizontalSnapPoses.indexOf(horizontalBoundPos) < 0) {
        horizontalSnapPoses.push(horizontalBoundPos);
      }

      var _d = checkInnerBoundPoses(moveable),
          verticalInnerBoundPoses = _d.vertical,
          horizontalInnerBoundPoses = _d.horizontal;

      verticalSnapPoses.push.apply(verticalSnapPoses, verticalInnerBoundPoses.filter(function (pos) {
        return verticalSnapPoses.indexOf(pos) < 0;
      }));
      horizontalSnapPoses.push.apply(horizontalSnapPoses, horizontalInnerBoundPoses.filter(function (pos) {
        return horizontalSnapPoses.indexOf(pos) < 0;
      }));
    }

    var Snappable = {
      name: "snappable",
      props: {
        snappable: [Boolean, Array],
        snapCenter: Boolean,
        snapHorizontal: Boolean,
        snapVertical: Boolean,
        snapElement: Boolean,
        snapGap: Boolean,
        isDisplaySnapDigit: Boolean,
        snapDigit: Number,
        snapThreshold: Number,
        horizontalGuidelines: Array,
        verticalGuidelines: Array,
        elementGuidelines: Array,
        bounds: Object,
        innerBounds: Object
      },
      render: function (moveable, React) {
        var _a = moveable.state,
            targetTop = _a.top,
            targetLeft = _a.left,
            pos1 = _a.pos1,
            pos2 = _a.pos2,
            pos3 = _a.pos3,
            pos4 = _a.pos4,
            snapRenderInfo = _a.snapRenderInfo,
            targetClientRect = _a.targetClientRect,
            containerClientRect = _a.containerClientRect,
            is3d = _a.is3d,
            rootMatrix = _a.rootMatrix;

        if (!snapRenderInfo || !hasGuidelines(moveable, "")) {
          return [];
        }

        var n = is3d ? 4 : 3;
        var minLeft = Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
        var minTop = Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
        var containerPos = caculateContainerPos(rootMatrix, containerClientRect, n);

        var _b = caculateInversePosition(rootMatrix, [targetClientRect.left - containerPos[0], targetClientRect.top - containerPos[1]], n),
            clientLeft = _b[0],
            clientTop = _b[1];

        var _c = moveable.props,
            _d = _c.snapThreshold,
            snapThreshold = _d === void 0 ? 5 : _d,
            _e = _c.snapDigit,
            snapDigit = _e === void 0 ? 0 : _e,
            _f = _c.isDisplaySnapDigit,
            isDisplaySnapDigit = _f === void 0 ? true : _f,
            _g = _c.snapDistFormat,
            snapDistFormat = _g === void 0 ? function (v) {
          return v;
        } : _g;
        var poses = getAbsolutePosesByState(moveable.state);

        var _h = getRect(poses),
            width = _h.width,
            height = _h.height,
            top = _h.top,
            left = _h.left,
            bottom = _h.bottom,
            right = _h.right;

        var verticalSnapPoses = [];
        var horizontalSnapPoses = [];
        var verticalGuidelines = [];
        var horizontalGuidelines = [];
        var snapInfos = [];

        if (!snapRenderInfo.request) {
          if (snapRenderInfo.direction) {
            snapInfos.push(getSnapInfosByDirection(moveable, poses, snapRenderInfo.direction));
          }

          if (snapRenderInfo.snap) {
            var rect = getRect(poses);

            if (snapRenderInfo.center) {
              rect.middle = (rect.top + rect.bottom) / 2;
              rect.center = (rect.left + rect.right) / 2;
            }

            snapInfos.push(checkSnaps(moveable, rect, true, 1));
          }

          snapInfos.forEach(function (snapInfo) {
            var verticalPosInfos = snapInfo.vertical.posInfos,
                horizontalPosInfos = snapInfo.horizontal.posInfos;
            verticalSnapPoses.push.apply(verticalSnapPoses, verticalPosInfos.map(function (posInfo) {
              return posInfo.pos;
            }));
            horizontalSnapPoses.push.apply(horizontalSnapPoses, horizontalPosInfos.map(function (posInfo) {
              return posInfo.pos;
            }));
            verticalGuidelines.push.apply(verticalGuidelines, getSnapGuidelines(verticalPosInfos));
            horizontalGuidelines.push.apply(horizontalGuidelines, getSnapGuidelines(horizontalPosInfos));
          });
        }

        addBoundGuidelines(moveable, [left, right], [top, bottom], verticalSnapPoses, horizontalSnapPoses);
        var elementHorizontalGroup = groupByElementGuidelines(horizontalGuidelines, clientLeft, width, 0);
        var elementVerticalGroup = groupByElementGuidelines(verticalGuidelines, clientTop, height, 1);
        var horizontalNames = ["horizontal", "left", "top", "width"];
        var verticalNames = ["vertical", "top", "left", "height"];
        var gapVerticalGuidelines = getGapGuidelines$1(verticalGuidelines, "vertical", [targetLeft, targetTop], [width, height]);
        var gapHorizontalGuidelines = getGapGuidelines$1(horizontalGuidelines, "horizontal", [targetLeft, targetTop], [width, height]);
        var allGuidelines = verticalGuidelines.concat(horizontalGuidelines);
        triggerEvent(moveable, "onSnap", {
          guidelines: allGuidelines.filter(function (_a) {
            var element = _a.element;
            return !element;
          }),
          elements: groupBy(allGuidelines.filter(function (_a) {
            var element = _a.element;
            return element;
          }), function (_a) {
            var element = _a.element;
            return element;
          }),
          gaps: gapVerticalGuidelines.concat(gapHorizontalGuidelines)
        }, true);
        return renderGapGuidelines(moveable, gapVerticalGuidelines, "vertical", horizontalNames, snapDistFormat, React).concat(renderGapGuidelines(moveable, gapHorizontalGuidelines, "horizontal", verticalNames, snapDistFormat, React), renderElementGroup(elementHorizontalGroup, horizontalNames, minLeft, clientLeft, width, targetTop, snapThreshold, isDisplaySnapDigit, snapDigit, 0, snapDistFormat, React), renderElementGroup(elementVerticalGroup, verticalNames, minTop, clientTop, height, targetLeft, snapThreshold, isDisplaySnapDigit, snapDigit, 1, snapDistFormat, React), renderSnapPoses(horizontalSnapPoses, horizontalNames, minLeft, targetTop, width, React), renderSnapPoses(verticalSnapPoses, verticalNames, minTop, targetLeft, height, React), renderGuidelines(horizontalGuidelines, horizontalNames, targetLeft, targetTop, 0, React), renderGuidelines(verticalGuidelines, verticalNames, targetTop, targetLeft, 1, React));
      },
      dragStart: function (moveable, e) {
        moveable.state.snapRenderInfo = {
          request: e.isRequest,
          snap: true,
          center: true
        };
        snapStart(moveable);
      },
      pinchStart: function (moveable) {
        this.unset(moveable);
      },
      dragEnd: function (moveable) {
        this.unset(moveable);
      },
      dragControlCondition: function (e) {
        return directionCondition(e) || dragControlCondition(e);
      },
      dragControlStart: function (moveable, e) {
        moveable.state.snapRenderInfo = null;
        snapStart(moveable);
      },
      dragControlEnd: function (moveable) {
        this.unset(moveable);
      },
      dragGroupStart: function (moveable, e) {
        this.dragStart(moveable, e);
      },
      dragGroupEnd: function (moveable) {
        this.unset(moveable);
      },
      dragGroupControlStart: function (moveable, e) {
        moveable.state.snapRenderInfo = null;
        snapStart(moveable);
      },
      dragGroupControlEnd: function (moveable) {
        this.unset(moveable);
      },
      unset: function (moveable) {
        var state = moveable.state;
        state.enableSnap = false;
        state.guidelines = [];
        state.snapRenderInfo = null;
      }
    };

    /**
     * @namespace Draggable
     * @memberof Moveable
     */

    var Draggable = {
      name: "draggable",
      props: {
        draggable: Boolean,
        throttleDrag: Number,
        throttleDragRotate: Number
      },
      render: function (moveable, React) {
        var throttleDragRotate = moveable.props.throttleDragRotate;
        var _a = moveable.state,
            dragInfo = _a.dragInfo,
            beforeOrigin = _a.beforeOrigin;

        if (!throttleDragRotate || !dragInfo) {
          return;
        }

        var dist = dragInfo.dist;

        if (!dist[0] && !dist[1]) {
          return;
        }

        var width = getDistSize(dist);
        var rad = getRad(dist, [0, 0]);
        return React.createElement("div", {
          className: prefix("line", "horizontal", "dragline", "dashed"),
          key: "dragRotateGuideline",
          style: {
            width: width + "px",
            transform: "translate(" + beforeOrigin[0] + "px, " + beforeOrigin[1] + "px) rotate(" + rad + "rad)"
          }
        });
      },
      dragStart: function (moveable, e) {
        var datas = e.datas,
            parentEvent = e.parentEvent,
            parentDragger = e.parentDragger;
        var state = moveable.state;
        var targetTransform = state.targetTransform,
            target = state.target,
            dragger = state.dragger;

        if (dragger) {
          return false;
        }

        state.dragger = parentDragger || moveable.targetDragger;
        var style = window.getComputedStyle(target);
        datas.datas = {};
        datas.left = parseFloat(style.left || "") || 0;
        datas.top = parseFloat(style.top || "") || 0;
        datas.bottom = parseFloat(style.bottom || "") || 0;
        datas.right = parseFloat(style.right || "") || 0;
        datas.transform = targetTransform;
        datas.startTranslate = [0, 0];
        setDragStart(moveable, {
          datas: datas
        });
        datas.prevDist = [0, 0];
        datas.prevBeforeDist = [0, 0];
        datas.isDrag = false;
        startCheckSnapDrag(moveable, datas);
        var params = fillParams(moveable, e, {
          set: function (translate) {
            datas.startTranslate = translate;
          }
        });
        var result = parentEvent || triggerEvent(moveable, "onDragStart", params);

        if (result !== false) {
          datas.isDrag = true;
          moveable.state.dragInfo = {
            startRect: moveable.getRect(),
            dist: [0, 0]
          };
        } else {
          state.dragger = null;
          datas.isPinch = false;
        }

        return datas.isDrag ? params : false;
      },
      drag: function (moveable, e) {
        var datas = e.datas,
            parentEvent = e.parentEvent,
            parentFlag = e.parentFlag,
            isPinch = e.isPinch,
            isRequest = e.isRequest;
        var distX = e.distX,
            distY = e.distY;
        var isDrag = datas.isDrag,
            prevDist = datas.prevDist,
            prevBeforeDist = datas.prevBeforeDist,
            transform = datas.transform,
            startTranslate = datas.startTranslate;

        if (!isDrag) {
          return;
        }

        var props = moveable.props;
        var parentMoveable = props.parentMoveable;
        var throttleDrag = parentEvent ? 0 : props.throttleDrag || 0;
        var throttleDragRotate = parentEvent ? 0 : props.throttleDragRotate || 0;
        var isSnap = false;
        var dragRotateRad = 0;

        if (throttleDragRotate > 0 && (distX || distY)) {
          var deg = throttle(getRad([0, 0], [distX, distY]) * 180 / Math.PI, throttleDragRotate);
          var r = getDistSize([distX, distY]);
          dragRotateRad = deg * Math.PI / 180;
          distX = r * Math.cos(dragRotateRad);
          distY = r * Math.sin(dragRotateRad);
        }

        if (!isPinch && !parentEvent && !parentFlag && (distX || distY)) {
          var _a = checkSnapDrag(moveable, distX, distY, throttleDragRotate, isRequest, datas),
              verticalInfo = _a[0],
              horizontalInfo = _a[1];

          var isVerticalSnap = verticalInfo.isSnap,
              isVerticalBound = verticalInfo.isBound,
              verticalOffset = verticalInfo.offset;
          var isHorizontalSnap = horizontalInfo.isSnap,
              isHorizontalBound = horizontalInfo.isBound,
              horizontalOffset = horizontalInfo.offset;
          isSnap = isVerticalSnap || isHorizontalSnap || isVerticalBound || isHorizontalBound;
          distX += verticalOffset;
          distY += horizontalOffset;
        }

        datas.passDeltaX = distX - (datas.passDistX || 0);
        datas.passDeltaY = distY - (datas.passDistY || 0);
        datas.passDistX = distX;
        datas.passDistY = distY;
        var beforeTranslate = plus(getDragDist({
          datas: datas,
          distX: distX,
          distY: distY
        }, true), startTranslate);
        var translate = plus(getDragDist({
          datas: datas,
          distX: distX,
          distY: distY
        }, false), startTranslate);

        if (!throttleDragRotate && !isSnap) {
          throttleArray(translate, throttleDrag);
          throttleArray(beforeTranslate, throttleDrag);
        }

        var beforeDist = minus(beforeTranslate, startTranslate);
        var dist = minus(translate, startTranslate);
        var delta = minus(dist, prevDist);
        var beforeDelta = minus(beforeDist, prevBeforeDist);
        datas.prevDist = dist;
        datas.prevBeforeDist = beforeDist;
        var left = datas.left + beforeDist[0];
        var top = datas.top + beforeDist[1];
        var right = datas.right - beforeDist[0];
        var bottom = datas.bottom - beforeDist[1];
        var nextTransform = transform + " translate(" + dist[0] + "px, " + dist[1] + "px)";
        moveable.state.dragInfo.dist = parentEvent ? [0, 0] : dist;

        if (!parentEvent && !parentMoveable && delta.every(function (num) {
          return !num;
        }) && beforeDelta.some(function (num) {
          return !num;
        })) {
          return;
        }

        var params = fillParams(moveable, e, {
          transform: nextTransform,
          dist: dist,
          delta: delta,
          translate: translate,
          beforeDist: beforeDist,
          beforeDelta: beforeDelta,
          beforeTranslate: beforeTranslate,
          left: left,
          top: top,
          right: right,
          bottom: bottom,
          isPinch: isPinch
        });
        !parentEvent && triggerEvent(moveable, "onDrag", params);
        return params;
      },
      dragEnd: function (moveable, e) {
        var parentEvent = e.parentEvent,
            datas = e.datas,
            isDrag = e.isDrag;
        moveable.state.dragger = null;
        moveable.state.dragInfo = null;

        if (!datas.isDrag) {
          return;
        }

        datas.isDrag = false;
        !parentEvent && triggerEvent(moveable, "onDragEnd", fillParams(moveable, e, {
          isDrag: isDrag
        }));
        return isDrag;
      },
      dragGroupStart: function (moveable, e) {
        var datas = e.datas,
            clientX = e.clientX,
            clientY = e.clientY;
        var params = this.dragStart(moveable, e);

        if (!params) {
          return false;
        }

        var events = triggerChildDragger(moveable, this, "dragStart", [clientX, clientY], e, false);

        var nextParams = __assign$4({}, params, {
          targets: moveable.props.targets,
          events: events
        });

        var result = triggerEvent(moveable, "onDragGroupStart", nextParams);
        datas.isDrag = result !== false;
        return datas.isDrag ? params : false;
      },
      dragGroup: function (moveable, e) {
        var datas = e.datas;

        if (!datas.isDrag) {
          return;
        }

        var params = this.drag(moveable, e);
        var _a = e.datas,
            passDeltaX = _a.passDeltaX,
            passDeltaY = _a.passDeltaY;
        var events = triggerChildDragger(moveable, this, "drag", [passDeltaX, passDeltaY], e, false);

        if (!params) {
          return;
        }

        var nextParams = __assign$4({
          targets: moveable.props.targets,
          events: events
        }, params);

        triggerEvent(moveable, "onDragGroup", nextParams);
        return nextParams;
      },
      dragGroupEnd: function (moveable, e) {
        var isDrag = e.isDrag,
            datas = e.datas;

        if (!datas.isDrag) {
          return;
        }

        this.dragEnd(moveable, e);
        triggerChildDragger(moveable, this, "dragEnd", [0, 0], e, false);
        triggerEvent(moveable, "onDragGroupEnd", fillParams(moveable, e, {
          targets: moveable.props.targets,
          isDrag: isDrag
        }));
        return isDrag;
      },

      /**
       * @method Moveable.Draggable#request
       * @param {object} [e] - the draggable's request parameter
       * @param {number} [e.x] - x position
       * @param {number} [e.y] - y position
       * @param {number} [e.deltaX] - X number to move
       * @param {number} [e.deltaY] - Y number to move
       * @param {number} [e.isInstant] - Whether to execute the request instantly
       * @return {Moveable.Requester} Moveable Requester
       * @example
        * // Instantly Request (requestStart - request - requestEnd)
       * // Use Relative Value
       * moveable.request("draggable", { deltaX: 10, deltaY: 10, isInstant: true });
       * // Use Absolute Value
       * moveable.request("draggable", { x: 200, y: 100, isInstant: true });
       *
       * // requestStart
       * const requester = moveable.request("draggable");
       *
       * // request
       * // Use Relative Value
       * requester.request({ deltaX: 10, deltaY: 10 });
       * requester.request({ deltaX: 10, deltaY: 10 });
       * requester.request({ deltaX: 10, deltaY: 10 });
       * // Use Absolute Value
       * moveable.request("draggable", { x: 200, y: 100, isInstant: true });
       * moveable.request("draggable", { x: 220, y: 100, isInstant: true });
       * moveable.request("draggable", { x: 240, y: 100, isInstant: true });
       *
       * // requestEnd
       * requester.requestEnd();
       */
      request: function (moveable) {
        var datas = {};
        var rect = moveable.getRect();
        var distX = 0;
        var distY = 0;
        return {
          isControl: false,
          requestStart: function (e) {
            return {
              datas: datas
            };
          },
          request: function (e) {
            if ("x" in e) {
              distX = e.x - rect.left;
            } else if ("deltaX" in e) {
              distX += e.deltaX;
            }

            if ("y" in e) {
              distY = e.y - rect.top;
            } else if ("deltaY" in e) {
              distY += e.deltaY;
            }

            return {
              datas: datas,
              distX: distX,
              distY: distY
            };
          },
          requestEnd: function () {
            return {
              datas: datas,
              isDrag: true
            };
          }
        };
      },
      unset: function (moveable) {
        moveable.state.dragInfo = null;
      }
    };

    /**
     * @namespace Rotatable
     * @memberof Moveable
     */

    function setRotateStartInfo(moveable, datas, clientX, clientY, origin, rect) {
      var n = moveable.state.is3d ? 4 : 3;
      var nextOrigin = caculatePosition(moveable.state.rootMatrix, origin, n);
      var startAbsoluteOrigin = plus([rect.left, rect.top], nextOrigin);
      datas.startAbsoluteOrigin = startAbsoluteOrigin;
      datas.prevDeg = getRad(startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180;
      datas.prevSnapDeg = datas.prevDeg;
      datas.startDeg = datas.prevDeg;
      datas.loop = 0;
    }

    function getParentDeg(moveable, moveableRect, datas, parentDist, direction, startRotate) {
      var prevDeg = datas.prevDeg;
      var absoluteDeg = startRotate + parentDist;
      var dist = checkSnapRotate(moveable, moveableRect, datas.origin, parentDist);
      datas.prevDeg = dist;
      var delta = direction * (dist - prevDeg);
      return [delta, dist, absoluteDeg];
    }

    function getDeg(moveable, moveableRect, datas, deg, direction, startRotate, throttleRotate, isSnap) {
      var prevDeg = datas.prevDeg,
          prevSnapDeg = datas.prevSnapDeg,
          startDeg = datas.startDeg,
          prevLoop = datas.loop;

      if (prevDeg > deg && prevDeg > 270 && deg < 90) {
        // 360 => 0
        ++datas.loop;
      } else if (prevDeg < deg && prevDeg < 90 && deg > 270) {
        // 0 => 360
        --datas.loop;
      }

      var loop = datas.loop;
      var absolutePrevSnapDeg = prevLoop * 360 + prevSnapDeg - startDeg + startRotate;
      var absoluteDeg = loop * 360 + deg - startDeg + startRotate;
      datas.prevDeg = absoluteDeg - loop * 360 + startDeg - startRotate;
      absoluteDeg = throttle(absoluteDeg, throttleRotate);
      var dist = direction * (absoluteDeg - startRotate);

      if (isSnap) {
        dist = checkSnapRotate(moveable, moveableRect, datas.origin, dist);
        absoluteDeg = dist / direction + startRotate;
      }

      datas.prevSnapDeg = absoluteDeg - loop * 360 + startDeg - startRotate;
      var delta = direction * (absoluteDeg - absolutePrevSnapDeg);
      return [delta, dist, absoluteDeg];
    }

    function getRotateInfo(moveable, moveableRect, datas, direction, clientX, clientY, startRotate, throttleRotate) {
      return getDeg(moveable, moveableRect, datas, getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180, direction, startRotate, throttleRotate, true);
    }

    function getPositions$1(rotationPosition, _a) {
      var pos1 = _a[0],
          pos2 = _a[1],
          pos3 = _a[2],
          pos4 = _a[3];

      if (rotationPosition === "left") {
        return [pos3, pos1];
      } else if (rotationPosition === "right") {
        return [pos2, pos4];
      } else if (rotationPosition === "bottom") {
        return [pos4, pos3];
      }

      return [pos1, pos2];
    }
    function dragControlCondition(e) {
      if (e.isRequest) {
        return true;
      }

      return hasClass(e.inputEvent.target, prefix("rotation"));
    }
    var Rotatable = {
      name: "rotatable",
      canPinch: true,
      props: {
        rotatable: Boolean,
        rotationPosition: String,
        throttleRotate: Number
      },
      render: function (moveable, React) {
        var _a = moveable.props,
            rotatable = _a.rotatable,
            rotationPosition = _a.rotationPosition;

        if (!rotatable) {
          return null;
        }

        var _b = moveable.state,
            renderPoses = _b.renderPoses,
            direction = _b.direction;
        var poses = getPositions$1(rotationPosition, renderPoses);
        var rotationRad = getRotationRad(poses, direction);
        return React.createElement("div", {
          key: "rotation",
          className: prefix("line rotation-line"),
          style: {
            // tslint:disable-next-line: max-line-length
            transform: "translate(-50%) translate(" + (poses[0][0] + poses[1][0]) / 2 + "px, " + (poses[0][1] + poses[1][1]) / 2 + "px) rotate(" + rotationRad + "rad)"
          }
        }, React.createElement("div", {
          className: prefix("control", "rotation")
        }));
      },
      dragControlCondition: dragControlCondition,
      dragControlStart: function (moveable, e) {
        var datas = e.datas,
            clientX = e.clientX,
            clientY = e.clientY,
            parentRotate = e.parentRotate,
            parentFlag = e.parentFlag,
            isPinch = e.isPinch,
            isRequest = e.isRequest;
        var _a = moveable.state,
            target = _a.target,
            left = _a.left,
            top = _a.top,
            origin = _a.origin,
            beforeOrigin = _a.beforeOrigin,
            direction = _a.direction,
            beforeDirection = _a.beforeDirection,
            targetTransform = _a.targetTransform;

        if (!isRequest && !target) {
          return false;
        }

        var rect = moveable.getRect();
        datas.rect = rect;
        datas.transform = targetTransform;
        datas.left = left;
        datas.top = top;

        if (isRequest || isPinch || parentFlag) {
          var externalRotate = parentRotate || 0;
          datas.beforeInfo = {
            origin: rect.beforeOrigin,
            prevDeg: externalRotate,
            startDeg: externalRotate,
            prevSnapDeg: externalRotate,
            loop: 0
          };
          datas.afterInfo = {
            origin: rect.origin,
            prevDeg: externalRotate,
            startDeg: externalRotate,
            prevSnapDeg: externalRotate,
            loop: 0
          };
        } else {
          datas.beforeInfo = {
            origin: rect.beforeOrigin
          };
          datas.afterInfo = {
            origin: rect.origin
          };
          var controlRect = getClientRect(moveable.controlBox.getElement());
          setRotateStartInfo(moveable, datas.beforeInfo, clientX, clientY, beforeOrigin, controlRect);
          setRotateStartInfo(moveable, datas.afterInfo, clientX, clientY, origin, controlRect);
        }

        datas.direction = direction;
        datas.beforeDirection = beforeDirection;
        datas.startRotate = 0;
        datas.datas = {};
        var params = fillParams(moveable, e, {
          set: function (rotatation) {
            datas.startRotate = rotatation;
          }
        });
        var result = triggerEvent(moveable, "onRotateStart", params);
        datas.isRotate = result !== false;
        moveable.state.snapRenderInfo = {
          request: e.isRequest
        };
        return datas.isRotate ? params : false;
      },
      dragControl: function (moveable, e) {
        var _a, _b, _c, _d, _e, _f;

        var datas = e.datas,
            clientX = e.clientX,
            clientY = e.clientY,
            parentRotate = e.parentRotate,
            parentFlag = e.parentFlag,
            isPinch = e.isPinch;
        var direction = datas.direction,
            beforeDirection = datas.beforeDirection,
            beforeInfo = datas.beforeInfo,
            afterInfo = datas.afterInfo,
            isRotate = datas.isRotate,
            startRotate = datas.startRotate,
            rect = datas.rect;

        if (!isRotate) {
          return;
        }

        var _g = moveable.props,
            _h = _g.throttleRotate,
            throttleRotate = _h === void 0 ? 0 : _h,
            parentMoveable = _g.parentMoveable;
        var delta;
        var dist;
        var rotate;
        var beforeDelta;
        var beforeDist;
        var beforeRotate;

        if ("parentDist" in e) {
          var parentDist = e.parentDist;
          _a = getParentDeg(moveable, rect, afterInfo, parentDist, direction, startRotate), delta = _a[0], dist = _a[1], rotate = _a[2];
          _b = getParentDeg(moveable, rect, beforeInfo, parentDist, direction, startRotate), beforeDelta = _b[0], beforeDist = _b[1], beforeRotate = _b[2];
        } else if (isPinch || parentFlag) {
          _c = getDeg(moveable, rect, afterInfo, parentRotate, direction, startRotate, throttleRotate), delta = _c[0], dist = _c[1], rotate = _c[2];
          _d = getDeg(moveable, rect, beforeInfo, parentRotate, direction, startRotate, throttleRotate), beforeDelta = _d[0], beforeDist = _d[1], beforeRotate = _d[2];
        } else {
          _e = getRotateInfo(moveable, rect, afterInfo, direction, clientX, clientY, startRotate, throttleRotate), delta = _e[0], dist = _e[1], rotate = _e[2];
          _f = getRotateInfo(moveable, rect, beforeInfo, beforeDirection, clientX, clientY, startRotate, throttleRotate), beforeDelta = _f[0], beforeDist = _f[1], beforeRotate = _f[2];
        }

        if (!delta && !beforeDelta && !parentMoveable) {
          return;
        }

        var params = fillParams(moveable, e, {
          delta: delta,
          dist: dist,
          rotate: rotate,
          beforeDist: beforeDist,
          beforeDelta: beforeDelta,
          beforeRotate: beforeRotate,
          transform: datas.transform + " rotate(" + dist + "deg)",
          isPinch: !!isPinch
        });
        triggerEvent(moveable, "onRotate", params);
        return params;
      },
      dragControlEnd: function (moveable, e) {
        var datas = e.datas,
            isDrag = e.isDrag;

        if (!datas.isRotate) {
          return false;
        }

        datas.isRotate = false;
        triggerEvent(moveable, "onRotateEnd", fillParams(moveable, e, {
          isDrag: isDrag
        }));
        return isDrag;
      },
      dragGroupControlCondition: dragControlCondition,
      dragGroupControlStart: function (moveable, e) {
        var datas = e.datas,
            inputEvent = e.inputEvent;
        var _a = moveable.state,
            parentLeft = _a.left,
            parentTop = _a.top,
            parentBeforeOrigin = _a.beforeOrigin;
        var params = this.dragControlStart(moveable, e);

        if (!params) {
          return false;
        }

        params.set(moveable.rotation);
        var events = triggerChildAble(moveable, this, "dragControlStart", datas, __assign$4({}, e, {
          parentRotate: 0
        }), function (child, childDatas, eventParams) {
          var _a = child.state,
              left = _a.left,
              top = _a.top,
              beforeOrigin = _a.beforeOrigin;
          var childClient = plus(minus([left, top], [parentLeft, parentTop]), minus(beforeOrigin, parentBeforeOrigin));
          childDatas.prevClient = childClient;
          eventParams.dragStart = Draggable.dragStart(child, new CustomDragger().dragStart(childClient, inputEvent));
        });

        var nextParams = __assign$4({}, params, {
          targets: moveable.props.targets,
          events: events
        });

        var result = triggerEvent(moveable, "onRotateGroupStart", nextParams);
        datas.isRotate = result !== false;
        return datas.isRotate ? params : false;
      },
      dragGroupControl: function (moveable, e) {
        var inputEvent = e.inputEvent,
            datas = e.datas;

        if (!datas.isRotate) {
          return;
        }

        var params = this.dragControl(moveable, e);

        if (!params) {
          return;
        }

        var parentRotate = params.beforeDist;
        var deg = params.beforeDelta;
        var rad = deg / 180 * Math.PI;
        var events = triggerChildAble(moveable, this, "dragControl", datas, __assign$4({}, e, {
          parentRotate: parentRotate
        }), function (child, childDatas, result, i) {
          var _a = childDatas.prevClient,
              prevX = _a[0],
              prevY = _a[1];

          var _b = rotate([prevX, prevY], rad),
              clientX = _b[0],
              clientY = _b[1];

          var delta = [clientX - prevX, clientY - prevY];
          childDatas.prevClient = [clientX, clientY];
          var dragResult = Draggable.drag(child, setCustomDrag(child.state, delta, inputEvent, !!e.isPinch, false));
          result.drag = dragResult;
        });
        moveable.rotation = params.beforeRotate;

        var nextParams = __assign$4({
          targets: moveable.props.targets,
          events: events,
          set: function (rotation) {
            moveable.rotation = rotation;
          }
        }, params);

        triggerEvent(moveable, "onRotateGroup", nextParams);
        return nextParams;
      },
      dragGroupControlEnd: function (moveable, e) {
        var isDrag = e.isDrag,
            datas = e.datas;

        if (!datas.isRotate) {
          return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);
        var nextParams = fillParams(moveable, e, {
          targets: moveable.props.targets,
          isDrag: isDrag
        });
        triggerEvent(moveable, "onRotateGroupEnd", nextParams);
        return isDrag;
      },

      /**
       * @method Moveable.Rotatable#request
       * @param {object} [e] - the Resizable's request parameter
       * @param {number} [e.deltaRotate=0] -  delta number of rotation
       * @param {number} [e.isInstant] - Whether to execute the request instantly
       * @return {Moveable.Requester} Moveable Requester
       * @example
        * // Instantly Request (requestStart - request - requestEnd)
       * moveable.request("rotatable", { deltaRotate: 10, isInstant: true });
       *
       * // requestStart
       * const requester = moveable.request("rotatable");
       *
       * // request
       * requester.request({ deltaRotate: 10 });
       * requester.request({ deltaRotate: 10 });
       * requester.request({ deltaRotate: 10 });
       *
       * // requestEnd
       * requester.requestEnd();
       */
      request: function () {
        var datas = {};
        var distRotate = 0;
        return {
          isControl: true,
          requestStart: function (e) {
            return {
              datas: datas
            };
          },
          request: function (e) {
            distRotate += e.deltaRotate;
            return {
              datas: datas,
              parentDist: distRotate
            };
          },
          requestEnd: function () {
            return {
              datas: datas,
              isDrag: true
            };
          }
        };
      }
    };

    function renderControls(moveable, defaultDirections, React) {
      var _a = moveable.state,
          renderPoses = _a.renderPoses,
          rotation = _a.rotation;
      var _b = moveable.props.renderDirections,
          directions = _b === void 0 ? defaultDirections : _b;
      var directionMap = {};
      directions.forEach(function (direction) {
        directionMap[direction] = true;
      });
      return directions.map(function (direction) {
        var indexes = DIRECTION_INDEXES[direction];

        if (!indexes || !directionMap[direction]) {
          return null;
        }

        var directionRotation = (throttle(rotation / Math.PI * 180, 15) + DIRECTION_ROTATIONS[direction]) % 180;
        return React.createElement("div", {
          className: prefix("control", "direction", direction),
          "data-rotation": directionRotation,
          "data-direction": direction,
          key: "direction-" + direction,
          style: getControlTransform.apply(void 0, [rotation].concat(indexes.map(function (index) {
            return renderPoses[index];
          })))
        });
      });
    }
    function renderAllDirections(moveable, React) {
      return renderControls(moveable, ["nw", "ne", "sw", "se", "n", "w", "s", "e"], React);
    }
    function renderDiagonalDirections(moveable, React) {
      return renderControls(moveable, ["nw", "ne", "sw", "se"], React);
    }

    /**
     * @namespace Resizable
     * @memberof Moveable
     */

    var Resizable = {
      name: "resizable",
      ableGroup: "size",
      updateRect: true,
      canPinch: true,
      props: {
        resizable: Boolean,
        throttleResize: Number,
        renderDirections: Array,
        baseDirection: Array,
        keepRatio: Boolean
      },
      render: function (moveable, React) {
        var _a = moveable.props,
            resizable = _a.resizable,
            edge = _a.edge;

        if (resizable) {
          if (edge) {
            return renderDiagonalDirections(moveable, React);
          }

          return renderAllDirections(moveable, React);
        }
      },
      dragControlCondition: directionCondition,
      dragControlStart: function (moveable, e) {
        var _a;

        var inputEvent = e.inputEvent,
            isPinch = e.isPinch,
            parentDirection = e.parentDirection,
            datas = e.datas;
        var direction = parentDirection || (isPinch ? [0, 0] : getDirection(inputEvent.target));
        var _b = moveable.state,
            target = _b.target,
            width = _b.width,
            height = _b.height;

        if (!direction || !target) {
          return false;
        }

        !isPinch && setDragStart(moveable, {
          datas: datas
        });
        datas.datas = {};
        datas.direction = direction;
        datas.startOffsetWidth = width;
        datas.startOffsetHeight = height;
        datas.prevWidth = 0;
        datas.prevHeight = 0;
        _a = getCSSSize(target), datas.startWidth = _a[0], datas.startHeight = _a[1];
        datas.transformOrigin = moveable.props.transformOrigin;
        datas.startDirection = getStartDirection(moveable, direction);
        datas.fixedPosition = getAbsoluteFixedPosition(moveable, datas.startDirection);
        datas.fixedOriginalPosition = getAbsoluteFixedPosition(moveable, direction);
        var params = fillParams(moveable, e, {
          direction: direction,
          set: function (_a) {
            var startWidth = _a[0],
                startHeight = _a[1];
            datas.startWidth = startWidth;
            datas.startHeight = startHeight;
          },
          setOrigin: function (origin) {
            datas.transformOrigin = origin;
          },
          dragStart: Draggable.dragStart(moveable, new CustomDragger().dragStart([0, 0], inputEvent))
        });
        var result = triggerEvent(moveable, "onResizeStart", params);

        if (result !== false) {
          datas.isResize = true;
          moveable.state.snapRenderInfo = {
            request: e.isRequest,
            direction: direction
          };
        }

        return datas.isResize ? params : false;
      },
      dragControl: function (moveable, e) {
        var datas = e.datas,
            distX = e.distX,
            distY = e.distY,
            parentFlag = e.parentFlag,
            isPinch = e.isPinch,
            parentDistance = e.parentDistance,
            parentScale = e.parentScale,
            inputEvent = e.inputEvent,
            parentKeepRatio = e.parentKeepRatio,
            dragClient = e.dragClient,
            parentDist = e.parentDist,
            isRequest = e.isRequest;
        var direction = datas.direction,
            isResize = datas.isResize,
            transformOrigin = datas.transformOrigin;

        if (!isResize) {
          return;
        }

        var startWidth = datas.startWidth,
            startHeight = datas.startHeight,
            startOffsetWidth = datas.startOffsetWidth,
            startOffsetHeight = datas.startOffsetHeight,
            prevWidth = datas.prevWidth,
            prevHeight = datas.prevHeight;
        var _a = moveable.props,
            _b = _a.throttleResize,
            throttleResize = _b === void 0 ? 0 : _b,
            parentMoveable = _a.parentMoveable;
        var sizeDirection = direction;

        if (!direction[0] && !direction[1]) {
          sizeDirection = [1, 1];
        }

        var keepRatio = moveable.props.keepRatio || parentKeepRatio;
        var isWidth = sizeDirection[0] || !sizeDirection[1];
        var ratio = isWidth ? startOffsetHeight / startOffsetWidth : startOffsetWidth / startOffsetHeight;
        var startDirection = keepRatio || parentFlag ? direction : datas.startDirection;
        var fixedPosition = dragClient;
        var distWidth = 0;
        var distHeight = 0;

        if (!dragClient) {
          if (!parentFlag && isPinch) {
            fixedPosition = getAbsoluteFixedPosition(moveable, [0, 0]);
          } else {
            fixedPosition = keepRatio ? datas.fixedOriginalPosition : datas.fixedPosition;
          }
        }

        if (parentDist) {
          distWidth = parentDist[0];
          distHeight = parentDist[1];
        } else if (parentScale) {
          distWidth = (parentScale[0] - 1) * startOffsetWidth;
          distHeight = (parentScale[1] - 1) * startOffsetHeight;
        } else if (isPinch) {
          if (parentDistance) {
            distWidth = parentDistance;
            distHeight = parentDistance * startOffsetHeight / startOffsetWidth;
          }
        } else {
          var dist = getDragDist({
            datas: datas,
            distX: distX,
            distY: distY
          });
          distWidth = sizeDirection[0] * dist[0];
          distHeight = sizeDirection[1] * dist[1];

          if (keepRatio && startOffsetWidth && startOffsetHeight) {
            var rad = getRad([0, 0], dist);
            var standardRad = getRad([0, 0], sizeDirection);
            var ratioRad = getRad([0, 0], [startOffsetWidth, startOffsetHeight]);
            var size = getDistSize([distWidth, distHeight]);
            var signSize = Math.cos(rad - standardRad) * size;

            if (!sizeDirection[0]) {
              // top, bottom
              distHeight = signSize;
              distWidth = getKeepRatioWidth(distHeight, isWidth, ratio);
            } else if (!sizeDirection[1]) {
              // left, right
              distWidth = signSize;
              distHeight = getKeepRatioHeight(distWidth, isWidth, ratio);
            } else {
              // two-way
              distWidth = Math.cos(ratioRad) * signSize;
              distHeight = Math.sin(ratioRad) * signSize;
            }
          }
        }

        var nextWidth = sizeDirection[0] || keepRatio ? Math.max(startOffsetWidth + distWidth, TINY_NUM) : startOffsetWidth;
        var nextHeight = sizeDirection[1] || keepRatio ? Math.max(startOffsetHeight + distHeight, TINY_NUM) : startOffsetHeight;

        if (keepRatio && startOffsetWidth && startOffsetHeight) {
          // startOffsetWidth : startOffsetHeight = nextWidth : nextHeight
          nextHeight = nextWidth * startOffsetHeight / startOffsetWidth;
        }

        var snapDist = [0, 0];

        if (!isPinch) {
          snapDist = checkSnapSize(moveable, nextWidth, nextHeight, direction, datas.fixedOriginalPosition, isRequest, datas);
        }

        if (parentDist) {
          !parentDist[0] && (snapDist[0] = 0);
          !parentDist[1] && (snapDist[1] = 0);
        }

        if (keepRatio) {
          if (sizeDirection[0] && sizeDirection[1] && snapDist[0] && snapDist[1]) {
            if (Math.abs(snapDist[0]) > Math.abs(snapDist[1])) {
              snapDist[1] = 0;
            } else {
              snapDist[0] = 0;
            }
          }

          var isNoSnap = !snapDist[0] && !snapDist[1];

          if (isNoSnap) {
            if (isWidth) {
              nextWidth = throttle(nextWidth, throttleResize);
            } else {
              nextHeight = throttle(nextHeight, throttleResize);
            }
          }

          if (sizeDirection[0] && !sizeDirection[1] || snapDist[0] && !snapDist[1] || isNoSnap && isWidth) {
            nextWidth += snapDist[0];
            nextHeight = getKeepRatioHeight(nextWidth, isWidth, ratio);
          } else if (!sizeDirection[0] && sizeDirection[1] || !snapDist[0] && snapDist[1] || isNoSnap && !isWidth) {
            nextHeight += snapDist[1];
            nextWidth = getKeepRatioWidth(nextHeight, isWidth, ratio);
          }
        } else {
          nextWidth += snapDist[0];
          nextHeight += snapDist[1];

          if (!snapDist[0]) {
            nextWidth = throttle(nextWidth, throttleResize);
          }

          if (!snapDist[1]) {
            nextHeight = throttle(nextHeight, throttleResize);
          }
        }

        nextWidth = Math.round(nextWidth);
        nextHeight = Math.round(nextHeight);
        distWidth = nextWidth - startOffsetWidth;
        distHeight = nextHeight - startOffsetHeight;
        var delta = [distWidth - prevWidth, distHeight - prevHeight];
        datas.prevWidth = distWidth;
        datas.prevHeight = distHeight;

        if (!parentMoveable && delta.every(function (num) {
          return !num;
        })) {
          return;
        }

        var inverseDelta = getResizeDist(moveable, nextWidth, nextHeight, startDirection, fixedPosition, transformOrigin);
        var params = fillParams(moveable, e, {
          width: startWidth + distWidth,
          height: startHeight + distHeight,
          offsetWidth: nextWidth,
          offsetHeight: nextHeight,
          direction: direction,
          dist: [distWidth, distHeight],
          delta: delta,
          isPinch: !!isPinch,
          drag: Draggable.drag(moveable, setCustomDrag(moveable.state, inverseDelta, inputEvent, !!isPinch, false))
        });
        triggerEvent(moveable, "onResize", params);
        return params;
      },
      dragControlAfter: function (moveable, e) {
        var datas = e.datas;
        var isResize = datas.isResize,
            startOffsetWidth = datas.startOffsetWidth,
            startOffsetHeight = datas.startOffsetHeight,
            prevWidth = datas.prevWidth,
            prevHeight = datas.prevHeight;

        if (!isResize) {
          return;
        }

        var _a = moveable.state,
            width = _a.width,
            height = _a.height;
        var errorWidth = width - (startOffsetWidth + prevWidth);
        var errorHeight = height - (startOffsetHeight + prevHeight);
        var isErrorWidth = Math.abs(errorWidth) > 3;
        var isErrorHeight = Math.abs(errorHeight) > 3;

        if (isErrorWidth) {
          datas.startWidth += errorWidth;
          datas.startOffsetWidth += errorWidth;
          datas.prevWidth += errorWidth;
        }

        if (isErrorHeight) {
          datas.startHeight += errorHeight;
          datas.startOffsetHeight += errorHeight;
          datas.prevHeight += errorHeight;
        }

        if (isErrorWidth || isErrorHeight) {
          this.dragControl(moveable, e);
          return true;
        }
      },
      dragControlEnd: function (moveable, e) {
        var datas = e.datas,
            isDrag = e.isDrag;

        if (!datas.isResize) {
          return false;
        }

        datas.isResize = false;
        var params = fillParams(moveable, e, {
          isDrag: isDrag
        });
        triggerEvent(moveable, "onResizeEnd", params);
        return isDrag;
      },
      dragGroupControlCondition: directionCondition,
      dragGroupControlStart: function (moveable, e) {
        var datas = e.datas;
        var params = this.dragControlStart(moveable, e);

        if (!params) {
          return false;
        }

        var direction = params.direction;
        var startPos = getAbsoluteFixedPosition(moveable, direction);
        var events = triggerChildAble(moveable, this, "dragControlStart", datas, function (child, childDatas) {
          var pos = getAbsoluteFixedPosition(child, direction);

          var _a = caculate(createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3), [pos[0] - startPos[0], pos[1] - startPos[1], 1], 3),
              originalX = _a[0],
              originalY = _a[1];

          childDatas.originalX = originalX;
          childDatas.originalY = originalY;
          return e;
        });

        var nextParams = __assign$4({}, params, {
          targets: moveable.props.targets,
          events: events
        });

        var result = triggerEvent(moveable, "onResizeGroupStart", nextParams);
        datas.isResize = result !== false;
        return datas.isResize ? params : false;
      },
      dragGroupControl: function (moveable, e) {
        var datas = e.datas;

        if (!datas.isResize) {
          return;
        }

        var params = this.dragControl(moveable, e);

        if (!params) {
          return;
        }

        var offsetWidth = params.offsetWidth,
            offsetHeight = params.offsetHeight,
            dist = params.dist;
        var keepRatio = moveable.props.keepRatio;
        var parentScale = [offsetWidth / (offsetWidth - dist[0]), offsetHeight / (offsetHeight - dist[1])];
        var fixedPosition = getAbsoluteFixedPosition(moveable, datas.direction);
        var events = triggerChildAble(moveable, this, "dragControl", datas, function (_, childDatas) {
          var _a = caculate(createRotateMatrix(moveable.rotation / 180 * Math.PI, 3), [childDatas.originalX * parentScale[0], childDatas.originalY * parentScale[1], 1], 3),
              clientX = _a[0],
              clientY = _a[1];

          return __assign$4({}, e, {
            parentDist: null,
            parentScale: parentScale,
            dragClient: plus(fixedPosition, [clientX, clientY]),
            parentKeepRatio: keepRatio
          });
        });

        var nextParams = __assign$4({
          targets: moveable.props.targets,
          events: events
        }, params);

        triggerEvent(moveable, "onResizeGroup", nextParams);
        return nextParams;
      },
      dragGroupControlEnd: function (moveable, e) {
        var isDrag = e.isDrag,
            datas = e.datas;

        if (!datas.isResize) {
          return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);
        var nextParams = fillParams(moveable, e, {
          targets: moveable.props.targets,
          isDrag: isDrag
        });
        triggerEvent(moveable, "onResizeGroupEnd", nextParams);
        return isDrag;
      },

      /**
       * @method Moveable.Resizable#request
       * @param {object} [e] - the Resizable's request parameter
       * @param {number} [e.direction=[1, 1]] - Direction to resize
       * @param {number} [e.deltaWidth] - delta number of width
       * @param {number} [e.deltaHeight] - delta number of height
       * @param {number} [e.isInstant] - Whether to execute the request instantly
       * @return {Moveable.Requester} Moveable Requester
       * @example
        * // Instantly Request (requestStart - request - requestEnd)
       * // Use Relative Value
       * moveable.request("resizable", { deltaWidth: 10, deltaHeight: 10, isInstant: true });
       *
       * // Use Absolute Value
       * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100, isInstant: true });
       *
       * // requestStart
       * const requester = moveable.request("resizable");
       *
       * // request
       * // Use Relative Value
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       *
       * // Use Absolute Value
       * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100, isInstant: true });
       * moveable.request("resizable", { offsetWidth: 110, offsetHeight: 100, isInstant: true });
       * moveable.request("resizable", { offsetWidth: 120, offsetHeight: 100, isInstant: true });
       *
       * // requestEnd
       * requester.requestEnd();
       */
      request: function (moveable) {
        var datas = {};
        var distWidth = 0;
        var distHeight = 0;
        var rect = moveable.getRect();
        return {
          isControl: true,
          requestStart: function (e) {
            return {
              datas: datas,
              parentDirection: e.direction || [1, 1]
            };
          },
          request: function (e) {
            if ("offsetWidth" in e) {
              distWidth = e.offsetWidth - rect.offsetWidth;
            } else if ("deltaWidth" in e) {
              distWidth += e.deltaWidth;
            }

            if ("offsetHeight" in e) {
              distHeight = e.offsetHeight - rect.offsetHeight;
            } else if ("deltaHeight" in e) {
              distHeight += e.deltaHeight;
            }

            return {
              datas: datas,
              parentDist: [distWidth, distHeight]
            };
          },
          requestEnd: function () {
            return {
              datas: datas,
              isDrag: true
            };
          }
        };
      }
    };

    /**
     * @namespace Scalable
     * @memberof Moveable
     */

    var Scalable = {
      name: "scalable",
      ableGroup: "size",
      canPinch: true,
      props: {
        scalable: Boolean,
        throttleScale: Number,
        renderDirections: String,
        keepRatio: Boolean
      },
      render: function (moveable, React) {
        var _a = moveable.props,
            resizable = _a.resizable,
            scalable = _a.scalable,
            edge = _a.edge;

        if (!resizable && scalable) {
          if (edge) {
            return renderDiagonalDirections(moveable, React);
          }

          return renderAllDirections(moveable, React);
        }
      },
      dragControlCondition: directionCondition,
      dragControlStart: function (moveable, e) {
        var datas = e.datas,
            isPinch = e.isPinch,
            inputEvent = e.inputEvent,
            parentDirection = e.parentDirection;
        var direction = parentDirection || (isPinch ? [0, 0] : getDirection(inputEvent.target));
        var _a = moveable.state,
            width = _a.width,
            height = _a.height,
            targetTransform = _a.targetTransform,
            target = _a.target;

        if (!direction || !target) {
          return false;
        }

        if (!isPinch) {
          setDragStart(moveable, {
            datas: datas
          });
        }

        datas.datas = {};
        datas.transform = targetTransform;
        datas.prevDist = [1, 1];
        datas.direction = direction;
        datas.width = width;
        datas.height = height;
        datas.startScale = [1, 1];
        datas.fixedPosition = getAbsoluteFixedPosition(moveable, direction);
        var params = fillParams(moveable, e, {
          direction: direction,
          set: function (scale) {
            datas.startScale = scale;
          },
          dragStart: Draggable.dragStart(moveable, new CustomDragger().dragStart([0, 0], inputEvent))
        });
        var result = triggerEvent(moveable, "onScaleStart", params);

        if (result !== false) {
          datas.isScale = true;
          moveable.state.snapRenderInfo = {
            request: e.isRequest,
            direction: direction
          };
        }

        return datas.isScale ? params : false;
      },
      dragControl: function (moveable, e) {
        var datas = e.datas,
            distX = e.distX,
            distY = e.distY,
            parentScale = e.parentScale,
            parentDistance = e.parentDistance,
            parentKeepRatio = e.parentKeepRatio,
            parentFlag = e.parentFlag,
            isPinch = e.isPinch,
            inputEvent = e.inputEvent,
            dragClient = e.dragClient,
            parentDist = e.parentDist,
            isRequest = e.isRequest;
        var prevDist = datas.prevDist,
            direction = datas.direction,
            width = datas.width,
            height = datas.height,
            transform = datas.transform,
            isScale = datas.isScale,
            startScale = datas.startScale;

        if (!isScale) {
          return false;
        }

        var _a = moveable.props,
            throttleScale = _a.throttleScale,
            parentMoveable = _a.parentMoveable;
        var sizeDirection = direction;

        if (!direction[0] && !direction[1]) {
          sizeDirection = [1, 1];
        }

        var keepRatio = moveable.props.keepRatio || parentKeepRatio;
        var state = moveable.state;
        var isWidth = sizeDirection[0] || !sizeDirection[1];
        var startWidth = width * startScale[0];
        var startHeight = height * startScale[1];
        var ratio = isWidth ? startHeight / startWidth : startWidth / startHeight;
        var scaleX = 1;
        var scaleY = 1;
        var fixedPosition = dragClient;

        if (!dragClient) {
          if (!parentFlag && isPinch) {
            fixedPosition = getAbsoluteFixedPosition(moveable, [0, 0]);
          } else {
            fixedPosition = datas.fixedPosition;
          }
        }

        if (parentDist) {
          scaleX = (width + parentDist[0]) / width;
          scaleY = (height + parentDist[1]) / height;
        } else if (parentScale) {
          scaleX = parentScale[0];
          scaleY = parentScale[1];
        } else if (isPinch) {
          if (parentDistance) {
            scaleX = (width + parentDistance) / width;
            scaleY = (height + parentDistance * height / width) / height;
          }
        } else {
          var dist = getDragDist({
            datas: datas,
            distX: distX,
            distY: distY
          });
          var distWidth = sizeDirection[0] * dist[0];
          var distHeight = sizeDirection[1] * dist[1];

          if (keepRatio && width && height) {
            var rad = getRad([0, 0], dist);
            var standardRad = getRad([0, 0], sizeDirection);
            var ratioRad = getRad([0, 0], [startWidth, startHeight]);
            var size = getDistSize([distWidth, distHeight]);
            var signSize = Math.cos(rad - standardRad) * size;

            if (!sizeDirection[0]) {
              // top, bottom
              distHeight = signSize;
              distWidth = getKeepRatioWidth(distHeight, isWidth, ratio);
            } else if (!sizeDirection[1]) {
              // left, right
              distWidth = signSize;
              distHeight = getKeepRatioHeight(distWidth, isWidth, ratio);
            } else {
              // two-way
              distWidth = Math.cos(ratioRad) * signSize;
              distHeight = Math.sin(ratioRad) * signSize;
            }
          }

          scaleX = (width + distWidth) / width;
          scaleY = (height + distHeight) / height;
        }

        scaleX = sizeDirection[0] || keepRatio ? scaleX * startScale[0] : startScale[0];
        scaleY = sizeDirection[1] || keepRatio ? scaleY * startScale[1] : startScale[1];

        if (scaleX === 0) {
          scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }

        if (scaleY === 0) {
          scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }

        var nowDist = [scaleX / startScale[0], scaleY / startScale[1]];
        var scale = [scaleX, scaleY];

        if (!isPinch && moveable.props.groupable) {
          var snapRenderInfo = state.snapRenderInfo || {};
          var stateDirection = snapRenderInfo.direction;

          if (isArray(stateDirection) && (stateDirection[0] || stateDirection[1])) {
            state.snapRenderInfo = {
              direction: direction,
              request: e.isRequest
            };
          }
        }

        var snapDist = [0, 0];

        if (!isPinch) {
          snapDist = checkSnapScale(moveable, nowDist, direction, datas.fixedPosition, isRequest, datas);
        }

        if (keepRatio) {
          if (sizeDirection[0] && sizeDirection[1] && snapDist[0] && snapDist[1]) {
            if (Math.abs(snapDist[0]) > Math.abs(snapDist[1])) {
              snapDist[1] = 0;
            } else {
              snapDist[0] = 0;
            }
          }

          var isNoSnap = !snapDist[0] && !snapDist[1];

          if (isNoSnap) {
            if (isWidth) {
              nowDist[0] = throttle(nowDist[0] * startScale[0], throttleScale) / startScale[0];
            } else {
              nowDist[1] = throttle(nowDist[1] * startScale[1], throttleScale) / startScale[1];
            }
          }

          if (sizeDirection[0] && !sizeDirection[1] || snapDist[0] && !snapDist[1] || isNoSnap && isWidth) {
            nowDist[0] += snapDist[0];
            var snapHeight = getKeepRatioHeight(width * nowDist[0] * startScale[0], isWidth, ratio);
            nowDist[1] = snapHeight / height / startScale[1];
          } else if (!sizeDirection[0] && sizeDirection[1] || !snapDist[0] && snapDist[1] || isNoSnap && !isWidth) {
            nowDist[1] += snapDist[1];
            var snapWidth = getKeepRatioWidth(height * nowDist[1] * startScale[1], isWidth, ratio);
            nowDist[0] = snapWidth / width / startScale[0];
          }
        } else {
          nowDist[0] += snapDist[0];
          nowDist[1] += snapDist[1];

          if (!snapDist[0]) {
            nowDist[0] = throttle(nowDist[0] * startScale[0], throttleScale) / startScale[0];
          }

          if (!snapDist[1]) {
            nowDist[1] = throttle(nowDist[1] * startScale[1], throttleScale) / startScale[1];
          }
        }

        if (nowDist[0] === 0) {
          nowDist[0] = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }

        if (nowDist[1] === 0) {
          nowDist[1] = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }

        var delta = [nowDist[0] / prevDist[0], nowDist[1] / prevDist[1]];
        scale = multiply2(nowDist, startScale);
        datas.prevDist = nowDist;

        if (scaleX === prevDist[0] && scaleY === prevDist[1] && !parentMoveable) {
          return false;
        }

        var inverseDelta = getScaleDist(moveable, delta, direction, fixedPosition);
        var params = fillParams(moveable, e, {
          scale: scale,
          direction: direction,
          dist: nowDist,
          delta: delta,
          transform: transform + " scale(" + scaleX + ", " + scaleY + ")",
          isPinch: !!isPinch,
          drag: Draggable.drag(moveable, setCustomDrag(moveable.state, inverseDelta, inputEvent, isPinch, false))
        });
        triggerEvent(moveable, "onScale", params);
        return params;
      },
      dragControlEnd: function (moveable, e) {
        var datas = e.datas,
            isDrag = e.isDrag;

        if (!datas.isScale) {
          return false;
        }

        datas.isScale = false;
        triggerEvent(moveable, "onScaleEnd", fillParams(moveable, e, {
          isDrag: isDrag
        }));
        return isDrag;
      },
      dragGroupControlCondition: directionCondition,
      dragGroupControlStart: function (moveable, e) {
        var datas = e.datas;
        var params = this.dragControlStart(moveable, e);

        if (!params) {
          return false;
        }

        var direction = params.direction;
        var startPos = getAbsoluteFixedPosition(moveable, direction);
        var events = triggerChildAble(moveable, this, "dragControlStart", datas, function (child, childDatas) {
          var pos = getAbsoluteFixedPosition(child, direction);

          var _a = caculate(createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3), [pos[0] - startPos[0], pos[1] - startPos[1], 1], 3),
              originalX = _a[0],
              originalY = _a[1];

          childDatas.originalX = originalX;
          childDatas.originalY = originalY;
          return e;
        });

        var nextParams = __assign$4({}, params, {
          targets: moveable.props.targets,
          events: events
        });

        var result = triggerEvent(moveable, "onScaleGroupStart", nextParams);
        datas.isScale = result !== false;
        return datas.isScale ? nextParams : false;
      },
      dragGroupControl: function (moveable, e) {
        var datas = e.datas;

        if (!datas.isScale) {
          return;
        }

        var params = this.dragControl(moveable, e);

        if (!params) {
          return;
        }

        var keepRatio = moveable.props.keepRatio;
        var scale = params.scale;
        var startPos = getAbsoluteFixedPosition(moveable, datas.direction);
        var events = triggerChildAble(moveable, this, "dragControl", datas, function (_, childDatas) {
          var _a = caculate(createRotateMatrix(moveable.rotation / 180 * Math.PI, 3), [childDatas.originalX * scale[0], childDatas.originalY * scale[1], 1], 3),
              clientX = _a[0],
              clientY = _a[1];

          return __assign$4({}, e, {
            parentDist: null,
            parentScale: scale,
            parentKeepRatio: keepRatio,
            dragClient: plus(startPos, [clientX, clientY])
          });
        });

        var nextParams = __assign$4({
          targets: moveable.props.targets,
          events: events
        }, params);

        triggerEvent(moveable, "onScaleGroup", nextParams);
        return nextParams;
      },
      dragGroupControlEnd: function (moveable, e) {
        var isDrag = e.isDrag,
            datas = e.datas;

        if (!datas.isScale) {
          return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);
        var nextParams = fillParams(moveable, e, {
          targets: moveable.props.targets,
          isDrag: isDrag
        });
        triggerEvent(moveable, "onScaleGroupEnd", nextParams);
        return isDrag;
      },

      /**
       * @method Moveable.Scalable#request
       * @param {object} [e] - the Resizable's request parameter
       * @param {number} [e.direction=[1, 1]] - Direction to scale
       * @param {number} [e.deltaWidth] - delta number of width
       * @param {number} [e.deltaHeight] - delta number of height
       * @param {number} [e.isInstant] - Whether to execute the request instantly
       * @return {Moveable.Requester} Moveable Requester
       * @example
        * // Instantly Request (requestStart - request - requestEnd)
       * moveable.request("scalable", { deltaWidth: 10, deltaHeight: 10, isInstant: true });
       *
       * // requestStart
       * const requester = moveable.request("scalable");
       *
       * // request
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       *
       * // requestEnd
       * requester.requestEnd();
       */
      request: function () {
        var datas = {};
        var distWidth = 0;
        var distHeight = 0;
        return {
          isControl: true,
          requestStart: function (e) {
            return {
              datas: datas,
              parentDirection: e.direction || [1, 1]
            };
          },
          request: function (e) {
            distWidth += e.deltaWidth;
            distHeight += e.deltaHeight;
            return {
              datas: datas,
              parentDist: [distWidth, distHeight]
            };
          },
          requestEnd: function () {
            return {
              datas: datas,
              isDrag: true
            };
          }
        };
      }
    };

    function getMiddleLinePos(pos1, pos2) {
      return pos1.map(function (pos, i) {
        return dot(pos, pos2[i], 1, 2);
      });
    }

    function getTriangleRad(pos1, pos2, pos3) {
      // pos1 Rad
      var rad1 = getRad(pos1, pos2);
      var rad2 = getRad(pos1, pos3);
      var rad = rad2 - rad1;
      return rad >= 0 ? rad : rad + 2 * Math.PI;
    }

    function isValidPos(poses1, poses2) {
      var rad1 = getTriangleRad(poses1[0], poses1[1], poses1[2]);
      var rad2 = getTriangleRad(poses2[0], poses2[1], poses2[2]);
      var pi = Math.PI;

      if (rad1 >= pi && rad2 <= pi || rad1 <= pi && rad2 >= pi) {
        return false;
      }

      return true;
    }

    var Warpable = {
      name: "warpable",
      ableGroup: "size",
      props: {
        warpable: Boolean,
        renderDirections: Array
      },
      render: function (moveable, React) {
        var _a = moveable.props,
            resizable = _a.resizable,
            scalable = _a.scalable,
            warpable = _a.warpable;

        if (resizable || scalable || !warpable) {
          return;
        }

        var _b = moveable.state,
            pos1 = _b.pos1,
            pos2 = _b.pos2,
            pos3 = _b.pos3,
            pos4 = _b.pos4;
        var linePosFrom1 = getMiddleLinePos(pos1, pos2);
        var linePosFrom2 = getMiddleLinePos(pos2, pos1);
        var linePosFrom3 = getMiddleLinePos(pos1, pos3);
        var linePosFrom4 = getMiddleLinePos(pos3, pos1);
        var linePosTo1 = getMiddleLinePos(pos3, pos4);
        var linePosTo2 = getMiddleLinePos(pos4, pos3);
        var linePosTo3 = getMiddleLinePos(pos2, pos4);
        var linePosTo4 = getMiddleLinePos(pos4, pos2);
        return [React.createElement("div", {
          className: prefix("line"),
          key: "middeLine1",
          style: getLineStyle(linePosFrom1, linePosTo1)
        }), React.createElement("div", {
          className: prefix("line"),
          key: "middeLine2",
          style: getLineStyle(linePosFrom2, linePosTo2)
        }), React.createElement("div", {
          className: prefix("line"),
          key: "middeLine3",
          style: getLineStyle(linePosFrom3, linePosTo3)
        }), React.createElement("div", {
          className: prefix("line"),
          key: "middeLine4",
          style: getLineStyle(linePosFrom4, linePosTo4)
        })].concat(renderAllDirections(moveable, React));
      },
      dragControlCondition: function (e) {
        if (e.isRequest) {
          return false;
        }

        return hasClass(e.inputEvent.target, prefix("direction"));
      },
      dragControlStart: function (moveable, e) {
        var datas = e.datas,
            inputEvent = e.inputEvent;
        var target = moveable.props.target;
        var inputTarget = inputEvent.target;
        var direction = getDirection(inputTarget);

        if (!direction || !target) {
          return false;
        }

        var state = moveable.state;
        var transformOrigin = state.transformOrigin,
            is3d = state.is3d,
            targetTransform = state.targetTransform,
            targetMatrix = state.targetMatrix,
            width = state.width,
            height = state.height,
            left = state.left,
            top = state.top;
        datas.datas = {};
        datas.targetTransform = targetTransform;
        datas.warpTargetMatrix = is3d ? targetMatrix : convertDimension(targetMatrix, 3, 4);
        datas.targetInverseMatrix = ignoreDimension(invert(datas.warpTargetMatrix, 4), 3, 4);
        datas.direction = direction;
        datas.left = left;
        datas.top = top;
        setDragStart(moveable, {
          datas: datas
        });
        datas.poses = [[0, 0], [width, 0], [0, height], [width, height]].map(function (p) {
          return minus(p, transformOrigin);
        });
        datas.nextPoses = datas.poses.map(function (_a) {
          var x = _a[0],
              y = _a[1];
          return caculate(datas.warpTargetMatrix, [x, y, 0, 1], 4);
        });
        datas.startMatrix = createIdentityMatrix(4);
        datas.prevMatrix = createIdentityMatrix(4);
        datas.absolutePoses = getAbsolutePosesByState(state);
        datas.posIndexes = getPosIndexesByDirection(direction);
        state.snapRenderInfo = {
          request: e.isRequest,
          direction: direction
        };
        var params = fillParams(moveable, e, {
          set: function (matrix) {
            datas.startMatrix = matrix;
          }
        });
        var result = triggerEvent(moveable, "onWarpStart", params);

        if (result !== false) {
          datas.isWarp = true;
        }

        return datas.isWarp;
      },
      dragControl: function (moveable, e) {
        var datas = e.datas,
            isRequest = e.isRequest;
        var distX = e.distX,
            distY = e.distY;
        var targetInverseMatrix = datas.targetInverseMatrix,
            prevMatrix = datas.prevMatrix,
            isWarp = datas.isWarp,
            startMatrix = datas.startMatrix,
            poses = datas.poses,
            posIndexes = datas.posIndexes,
            absolutePoses = datas.absolutePoses;

        if (!isWarp) {
          return false;
        }

        if (hasGuidelines(moveable, "warpable")) {
          var selectedPoses = posIndexes.map(function (index) {
            return absolutePoses[index];
          });

          if (selectedPoses.length > 1) {
            selectedPoses.push([(selectedPoses[0][0] + selectedPoses[1][0]) / 2, (selectedPoses[0][1] + selectedPoses[1][1]) / 2]);
          }

          var _a = checkSnapBounds(moveable, isRequest, selectedPoses.map(function (pos) {
            return [pos[0] + distX, pos[1] + distY];
          })),
              horizontalSnapInfo = _a.horizontal,
              verticalSnapInfo = _a.vertical;

          distY -= horizontalSnapInfo.offset;
          distX -= verticalSnapInfo.offset;
        }

        var dist = getDragDist({
          datas: datas,
          distX: distX,
          distY: distY
        }, true);
        var nextPoses = datas.nextPoses.slice();
        posIndexes.forEach(function (index) {
          nextPoses[index] = plus(nextPoses[index], dist);
        });

        if (!NEARBY_POS.every(function (nearByPoses) {
          return isValidPos(nearByPoses.map(function (i) {
            return poses[i];
          }), nearByPoses.map(function (i) {
            return nextPoses[i];
          }));
        })) {
          return false;
        }

        var h = createWarpMatrix(poses[0], poses[1], poses[2], poses[3], nextPoses[0], nextPoses[1], nextPoses[2], nextPoses[3]);

        if (!h.length) {
          return false;
        }

        var matrix = convertMatrixtoCSS(multiply(targetInverseMatrix, h, 4));
        var transform = datas.targetTransform + " matrix3d(" + matrix.join(",") + ")";
        var delta = multiplyCSS(invert(prevMatrix, 4), matrix, 4);
        datas.prevMatrix = matrix;
        triggerEvent(moveable, "onWarp", fillParams(moveable, e, {
          delta: delta,
          matrix: multiplyCSS(startMatrix, matrix, 4),
          multiply: multiplyCSS,
          dist: matrix,
          transform: transform
        }));
        return true;
      },
      dragControlEnd: function (moveable, e) {
        var datas = e.datas,
            isDrag = e.isDrag;

        if (!datas.isWarp) {
          return false;
        }

        datas.isWarp = false;
        triggerEvent(moveable, "onWarpEnd", fillParams(moveable, e, {
          isDrag: isDrag
        }));
        return isDrag;
      }
    };

    var AREA = prefix("area");
    var AREA_PIECES = prefix("area-pieces");
    var AREA_PIECE = prefix("area-piece");
    var AVOID = prefix("avoid");

    function restoreStyle(moveable) {
      var el = moveable.areaElement;
      var _a = moveable.state,
          width = _a.width,
          height = _a.height;
      removeClass(el, AVOID);
      el.style.cssText += "left: 0px; top: 0px; width: " + width + "px; height: " + height + "px";
    }

    function renderPieces(React) {
      return React.createElement("div", {
        key: "area_pieces",
        className: AREA_PIECES
      }, React.createElement("div", {
        className: AREA_PIECE
      }), React.createElement("div", {
        className: AREA_PIECE
      }), React.createElement("div", {
        className: AREA_PIECE
      }), React.createElement("div", {
        className: AREA_PIECE
      }));
    }

    var DragArea = {
      name: "dragArea",
      props: {
        dragArea: Boolean
      },
      render: function (moveable, React) {
        var _a = moveable.props,
            target = _a.target,
            dragArea = _a.dragArea,
            groupable = _a.groupable;
        var _b = moveable.state,
            width = _b.width,
            height = _b.height,
            pos1 = _b.pos1,
            pos2 = _b.pos2,
            pos3 = _b.pos3,
            pos4 = _b.pos4;

        if (groupable) {
          return [React.createElement("div", {
            key: "area",
            ref: ref(moveable, "areaElement"),
            className: AREA
          }), renderPieces(React)];
        }

        if (!target || !dragArea) {
          return [];
        }

        var h = createWarpMatrix([0, 0], [width, 0], [0, height], [width, height], pos1, pos2, pos3, pos4);
        var transform = h.length ? "matrix3d(" + convertMatrixtoCSS(h).join(",") + ")" : "none";
        return [React.createElement("div", {
          key: "area",
          ref: ref(moveable, "areaElement"),
          className: AREA,
          style: {
            top: "0px",
            left: "0px",
            width: width + "px",
            height: height + "px",
            transformOrigin: "0 0",
            transform: transform
          }
        }), renderPieces(React)];
      },
      dragStart: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            inputEvent = _a.inputEvent;

        if (!inputEvent) {
          return false;
        }

        datas.isDragArea = false;
        datas.inputTarget = inputEvent.target;
        var areaElement = moveable.areaElement;
        var _b = moveable.state,
            targetClientRect = _b.targetClientRect,
            pos1 = _b.pos1,
            pos2 = _b.pos2,
            pos3 = _b.pos3,
            pos4 = _b.pos4,
            width = _b.width,
            height = _b.height,
            rootMatrix = _b.rootMatrix,
            is3d = _b.is3d;
        var left = targetClientRect.left,
            top = targetClientRect.top;

        var _c = getRect([pos1, pos2, pos3, pos4]),
            relativeLeft = _c.left,
            relativeTop = _c.top;

        var n = is3d ? 4 : 3;
        var poses = caculatePoses(rootMatrix, width, height, n);

        var _d = getRect(poses),
            rootLeft = _d.left,
            rootTop = _d.top;

        var rootRelativePos = minus([clientX, clientY], plus([left - rootLeft, top - rootTop], poses[0]));

        var _e = caculate(invert(rootMatrix, n), convertPositionMatrix(rootRelativePos, n), n),
            posX = _e[0],
            posY = _e[1];

        var rects = [{
          left: relativeLeft,
          top: relativeTop,
          width: width,
          height: posY - 10
        }, {
          left: relativeLeft,
          top: relativeTop,
          width: posX - 10,
          height: height
        }, {
          left: relativeLeft,
          top: relativeTop + posY + 10,
          width: width,
          height: height - posY - 10
        }, {
          left: relativeLeft + posX + 10,
          top: relativeTop,
          width: width - posX - 10,
          height: height
        }];
        var children = [].slice.call(areaElement.nextElementSibling.children);
        rects.forEach(function (rect, i) {
          children[i].style.cssText = "left: " + rect.left + "px;top: " + rect.top + "px; width: " + rect.width + "px; height: " + rect.height + "px;";
        });
        addClass(areaElement, AVOID);
      },
      drag: function (moveable, _a) {
        var datas = _a.datas,
            inputEvent = _a.inputEvent;

        if (!inputEvent) {
          return false;
        }

        if (!datas.isDragArea) {
          datas.isDragArea = true;
          restoreStyle(moveable);
        }
      },
      dragEnd: function (moveable, e) {
        if (!e.inputEvent) {
          return false;
        }

        var inputEvent = e.inputEvent,
            isDragArea = e.isDragArea,
            datas = e.datas;

        if (!datas.isDragArea) {
          restoreStyle(moveable);
        }

        var target = moveable.state.target;
        var inputTarget = inputEvent.target;

        if (isDragArea || moveable.isMoveableElement(inputTarget)) {
          return;
        }

        var containsTarget = target.contains(inputTarget);
        triggerEvent(moveable, "onClick", fillParams(moveable, e, {
          inputTarget: inputTarget,
          isTarget: target === inputTarget,
          containsTarget: containsTarget
        }));
      },
      dragGroupStart: function (moveable, e) {
        return this.dragStart(moveable, e);
      },
      dragGroup: function (moveable, e) {
        return this.drag(moveable, e);
      },
      dragGroupEnd: function (moveable, e) {
        var inputEvent = e.inputEvent,
            isDragArea = e.isDragArea,
            datas = e.datas;

        if (!inputEvent) {
          return false;
        }

        if (!isDragArea) {
          restoreStyle(moveable);
        }

        var prevInputTarget = datas.inputTarget;
        var inputTarget = inputEvent.target;

        if (isDragArea || moveable.isMoveableElement(inputTarget) || prevInputTarget === inputTarget) {
          return;
        }

        var targets = moveable.props.targets;
        var targetIndex = targets.indexOf(inputTarget);
        var isTarget = targetIndex > -1;
        var containsTarget = false;

        if (targetIndex === -1) {
          targetIndex = findIndex(targets, function (parentTarget) {
            return parentTarget.contains(inputTarget);
          });
          containsTarget = targetIndex > -1;
        }

        triggerEvent(moveable, "onClickGroup", fillParams(moveable, e, {
          targets: targets,
          inputTarget: inputTarget,
          targetIndex: targetIndex,
          isTarget: isTarget,
          containsTarget: containsTarget
        }));
      }
    };

    var Origin = {
      name: "origin",
      props: {
        origin: Boolean
      },
      render: function (moveable, React) {
        if (!moveable.props.origin) {
          return null;
        }

        var _a = moveable.state,
            beforeOrigin = _a.beforeOrigin,
            rotation = _a.rotation;
        return [React.createElement("div", {
          className: prefix("control", "origin"),
          style: getControlTransform(rotation, beforeOrigin),
          key: "beforeOrigin"
        })];
      }
    };

    function getDefaultScrollPosition$1(e) {
      var scrollContainer = e.scrollContainer;
      return [scrollContainer.scrollLeft, scrollContainer.scrollTop];
    }

    var Scrollable = {
      name: "scrollable",
      canPinch: true,
      props: {
        scrollable: Boolean,
        scrollContainer: Object,
        scrollThreshold: Number
      },
      dragStart: function (moveable, e) {
        var props = moveable.props;
        var _a = props.scrollContainer,
            scrollContainer = _a === void 0 ? moveable.getContainer() : _a;
        var dragScroll = new DragScroll();
        e.datas.dragScroll = dragScroll;
        var draggerName = e.isControl ? "controlDragger" : "targetDragger";
        var targets = e.targets;
        dragScroll.on("scroll", function (_a) {
          var container = _a.container,
              direction = _a.direction;
          var params = fillParams(moveable, e, {
            scrollContainer: container,
            direction: direction
          });
          var eventName = targets ? "onScrollGroup" : "onScroll";

          if (targets) {
            params.targets = targets;
          }

          triggerEvent(moveable, eventName, params);
        }).on("move", function (_a) {
          var offsetX = _a.offsetX,
              offsetY = _a.offsetY;
          moveable[draggerName].scrollBy(offsetX, offsetY, e.inputEvent, false);
        });
        dragScroll.dragStart(e, {
          container: scrollContainer
        });
      },
      checkScroll: function (moveable, e) {
        var dragScroll = e.datas.dragScroll;

        if (!dragScroll) {
          return;
        }

        var _a = moveable.props,
            _b = _a.scrollContainer,
            scrollContainer = _b === void 0 ? moveable.getContainer() : _b,
            _c = _a.scrollThreshold,
            scrollThreshold = _c === void 0 ? 0 : _c,
            _d = _a.getScrollPosition,
            getScrollPosition = _d === void 0 ? getDefaultScrollPosition$1 : _d;
        dragScroll.drag(e, {
          container: scrollContainer,
          threshold: scrollThreshold,
          getScrollPosition: function (ev) {
            return getScrollPosition({
              scrollContainer: ev.container,
              direction: ev.direction
            });
          }
        });
        return true;
      },
      drag: function (moveable, e) {
        return this.checkScroll(moveable, e);
      },
      dragEnd: function (moveable, e) {
        e.datas.dragScroll.dragEnd();
        e.datas.dragScroll = null;
      },
      dragControlStart: function (moveable, e) {
        return this.dragStart(moveable, __assign$4({}, e, {
          isControl: true
        }));
      },
      dragControl: function (moveable, e) {
        return this.drag(moveable, e);
      },
      dragControlEnd: function (moveable, e) {
        return this.dragEnd(moveable, e);
      },
      dragGroupStart: function (moveable, e) {
        return this.dragStart(moveable, __assign$4({}, e, {
          targets: moveable.props.targets
        }));
      },
      dragGroup: function (moveable, e) {
        return this.drag(moveable, __assign$4({}, e, {
          targets: moveable.props.targets
        }));
      },
      dragGroupEnd: function (moveable, e) {
        return this.dragEnd(moveable, __assign$4({}, e, {
          targets: moveable.props.targets
        }));
      },
      dragGroupControlStart: function (moveable, e) {
        return this.dragStart(moveable, __assign$4({}, e, {
          targets: moveable.props.targets,
          isControl: true
        }));
      },
      dragGroupContro: function (moveable, e) {
        return this.drag(moveable, __assign$4({}, e, {
          targets: moveable.props.targets
        }));
      },
      dragGroupControEnd: function (moveable, e) {
        return this.dragEnd(moveable, __assign$4({}, e, {
          targets: moveable.props.targets
        }));
      }
    };

    var Default = {
      name: "",
      props: {
        target: Object,
        container: Object,
        dragArea: Boolean,
        origin: Boolean,
        transformOrigin: Array,
        edge: Boolean,
        ables: Array,
        className: String,
        pinchThreshold: Number
      }
    };

    var Padding = {
      name: "padding",
      props: {
        padding: Object
      },
      render: function (moveable, React) {
        var padding = moveable.props.padding || {};
        var _a = padding.left,
            left = _a === void 0 ? 0 : _a,
            _b = padding.top,
            top = _b === void 0 ? 0 : _b,
            _c = padding.right,
            right = _c === void 0 ? 0 : _c,
            _d = padding.bottom,
            bottom = _d === void 0 ? 0 : _d;
        var _e = moveable.state,
            renderPoses = _e.renderPoses,
            pos1 = _e.pos1,
            pos2 = _e.pos2,
            pos3 = _e.pos3,
            pos4 = _e.pos4;
        var poses = [pos1, pos2, pos3, pos4];
        var paddingDirections = [];

        if (left > 0) {
          paddingDirections.push([0, 2]);
        }

        if (top > 0) {
          paddingDirections.push([0, 1]);
        }

        if (right > 0) {
          paddingDirections.push([1, 3]);
        }

        if (bottom > 0) {
          paddingDirections.push([2, 3]);
        }

        return paddingDirections.map(function (_a, i) {
          var dir1 = _a[0],
              dir2 = _a[1];
          var paddingPos1 = poses[dir1];
          var paddingPos2 = poses[dir2];
          var paddingPos3 = renderPoses[dir1];
          var paddingPos4 = renderPoses[dir2];
          var h = createWarpMatrix([0, 0], [100, 0], [0, 100], [100, 100], paddingPos1, paddingPos2, paddingPos3, paddingPos4);

          if (!h.length) {
            return undefined;
          }

          return React.createElement("div", {
            key: "padding" + i,
            className: prefix("padding"),
            style: {
              transform: "matrix3d(" + convertMatrixtoCSS(h).join(",") + ")"
            }
          });
        });
      }
    };

    var MOVEABLE_ABLES = [Default, Snappable, Pinchable, Draggable, Rotatable, Resizable, Scalable, Warpable, Scrollable, DragArea, Padding, Origin];

    var Groupable = {
      name: "groupable",
      props: {
        defaultGroupRotate: Number,
        groupable: Boolean
      },
      render: function (moveable, React) {
        var targets = moveable.props.targets || [];
        moveable.moveables = [];
        var _a = moveable.state,
            left = _a.left,
            top = _a.top;
        var position = {
          left: left,
          top: top
        };
        return targets.map(function (target, i) {
          return React.createElement(MoveableManager, {
            key: "moveable" + i,
            ref: refs(moveable, "moveables", i),
            target: target,
            origin: false,
            parentMoveable: moveable,
            parentPosition: position
          });
        });
      }
    };

    function getMaxPos(poses, index) {
      return Math.max.apply(Math, poses.map(function (_a) {
        var pos1 = _a[0],
            pos2 = _a[1],
            pos3 = _a[2],
            pos4 = _a[3];
        return Math.max(pos1[index], pos2[index], pos3[index], pos4[index]);
      }));
    }

    function getMinPos(poses, index) {
      return Math.min.apply(Math, poses.map(function (_a) {
        var pos1 = _a[0],
            pos2 = _a[1],
            pos3 = _a[2],
            pos4 = _a[3];
        return Math.min(pos1[index], pos2[index], pos3[index], pos4[index]);
      }));
    }

    function getGroupRect(moveables, rotation) {
      if (!moveables.length) {
        return [0, 0, 0, 0];
      }

      var moveablePoses = moveables.map(function (_a) {
        var state = _a.state;
        return getAbsolutePosesByState(state);
      });
      var minX = MAX_NUM;
      var minY = MAX_NUM;
      var groupWidth = 0;
      var groupHeight = 0;
      var fixedRotation = throttle(rotation, TINY_NUM);

      if (fixedRotation % 90) {
        var rad_1 = rotation / 180 * Math.PI;
        var a1_1 = Math.tan(rad_1);
        var a2_1 = -1 / a1_1;
        var b1s_1 = [MIN_NUM, MAX_NUM];
        var b2s_1 = [MIN_NUM, MAX_NUM];
        moveablePoses.forEach(function (poses) {
          poses.forEach(function (pos) {
            // ax + b = y
            // ㅠ = y - ax
            var b1 = pos[1] - a1_1 * pos[0];
            var b2 = pos[1] - a2_1 * pos[0];
            b1s_1[0] = Math.max(b1s_1[0], b1);
            b1s_1[1] = Math.min(b1s_1[1], b1);
            b2s_1[0] = Math.max(b2s_1[0], b2);
            b2s_1[1] = Math.min(b2s_1[1], b2);
          });
        });
        b1s_1.forEach(function (b1) {
          // a1x + b1 = a2x + b2
          b2s_1.forEach(function (b2) {
            // (a1 - a2)x = b2 - b1
            var x = (b2 - b1) / (a1_1 - a2_1);
            var y = a1_1 * x + b1;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
          });
        });
        var rotatePoses = moveablePoses.map(function (_a) {
          var pos1 = _a[0],
              pos2 = _a[1],
              pos3 = _a[2],
              pos4 = _a[3];
          return [rotate(pos1, -rad_1), rotate(pos2, -rad_1), rotate(pos3, -rad_1), rotate(pos4, -rad_1)];
        });
        groupWidth = getMaxPos(rotatePoses, 0) - getMinPos(rotatePoses, 0);
        groupHeight = getMaxPos(rotatePoses, 1) - getMinPos(rotatePoses, 1);
      } else {
        minX = getMinPos(moveablePoses, 0);
        minY = getMinPos(moveablePoses, 1);
        groupWidth = getMaxPos(moveablePoses, 0) - minX;
        groupHeight = getMaxPos(moveablePoses, 1) - minY;

        if (fixedRotation % 180) {
          var changedWidth = groupWidth;
          groupWidth = groupHeight;
          groupHeight = changedWidth;
        }
      }

      return [minX, minY, groupWidth, groupHeight];
    }

    var MoveableGroup =
    /*#__PURE__*/
    function (_super) {
      __extends$5(MoveableGroup, _super);

      function MoveableGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.differ = new ChildrenDiffer();
        _this.moveables = [];
        _this.rotation = 0;
        return _this;
      }

      var __proto = MoveableGroup.prototype;

      __proto.updateEvent = function (prevProps) {
        var state = this.state;
        var props = this.props;

        if (!state.target) {
          state.target = this.areaElement;
          this.controlBox.getElement().style.display = "block";
          this.targetDragger = getTargetAbleDragger(this, state.target, "Group");
          this.controlDragger = getAbleDragger(this, this.controlBox.getElement(), "controlAbles", "GroupControl");
        }

        var isContainerChanged = !equals(prevProps.container, props.container);

        if (isContainerChanged) {
          state.container = props.container;
        }

        var _a = this.differ.update(props.targets),
            added = _a.added,
            changed = _a.changed,
            removed = _a.removed;

        if (isContainerChanged || added.length || changed.length || removed.length) {
          this.updateRect();
        }
      };

      __proto.checkUpdate = function () {
        this.updateRenderPoses();
        this.updateAbles();
      };

      __proto.updateRect = function (type, isTarget, isSetState) {
        var _a;

        if (isSetState === void 0) {
          isSetState = true;
        }

        if (!this.controlBox) {
          return;
        }

        this.moveables.forEach(function (moveable) {
          moveable.updateRect(type, false, false);
        });
        var state = this.state;
        var props = this.props;
        var target = state.target || props.target;

        if (!isTarget || type !== "" && props.updateGroup) {
          // reset rotataion
          this.rotation = props.defaultGroupRotate;
        }

        var rotation = this.rotation;

        var _b = getGroupRect(this.moveables, rotation),
            left = _b[0],
            top = _b[1],
            width = _b[2],
            height = _b[3]; // tslint:disable-next-line: max-line-length


        target.style.cssText += "left:0px;top:0px;width:" + width + "px; height:" + height + "px;transform:rotate(" + rotation + "deg)";
        state.width = width;
        state.height = height;
        var container = this.getContainer();
        var info = getTargetInfo(target, this.controlBox.getElement(), this.getContainer(), this.props.rootContainer || container, state);
        var pos = [info.left, info.top];
        _a = getAbsolutePosesByState(info), info.pos1 = _a[0], info.pos2 = _a[1], info.pos3 = _a[2], info.pos4 = _a[3];
        info.origin = plus(pos, info.origin);
        info.beforeOrigin = plus(pos, info.beforeOrigin);
        var clientRect = info.targetClientRect;
        clientRect.top += top - info.top - state.top;
        clientRect.left += left - info.left - state.left;
        this.updateState(__assign$4({}, info, {
          left: left - info.left,
          top: top - info.top
        }), isSetState);
      };

      __proto.triggerEvent = function (name, e) {
        if (name.indexOf("Group") > -1) {
          return _super.prototype.triggerEvent.call(this, name, e);
        }
      };

      __proto.updateAbles = function () {
        _super.prototype.updateAbles.call(this, this.props.ables.concat([Groupable]), "Group");
      };

      MoveableGroup.defaultProps = __assign$4({}, MoveableManager.defaultProps, {
        transformOrigin: ["50%", "50%"],
        groupable: true,
        dragArea: true,
        keepRatio: true,
        targets: [],
        defaultGroupRotate: 0
      });
      return MoveableGroup;
    }(MoveableManager);

    var Moveable =
    /*#__PURE__*/
    function (_super) {
      __extends$5(Moveable, _super);

      function Moveable() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = Moveable.prototype;

      __proto.render = function () {
        var props = this.props;
        var ables = props.ables || [];
        var target = this.props.target || this.props.targets;
        var isArr = isArray(target);
        var isGroup = isArr && target.length > 1;

        if (isGroup) {
          var nextProps = __assign$4({}, this.props, {
            target: null,
            targets: target,
            ables: MOVEABLE_ABLES.concat([Groupable], ables)
          });

          return createElement(MoveableGroup, __assign$4({
            key: "group",
            ref: ref(this, "moveable")
          }, nextProps));
        } else {
          var moveableTarget = isArr ? target[0] : target;
          return createElement(MoveableManager, __assign$4({
            key: "single",
            ref: ref(this, "moveable")
          }, __assign$4({}, this.props, {
            target: moveableTarget,
            ables: MOVEABLE_ABLES.concat(ables)
          })));
        }
      };
      /**
       * Check if the target is an element included in the moveable.
       * @method Moveable#isMoveableElement
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


      __proto.isMoveableElement = function (target) {
        return this.moveable.isMoveableElement(target);
      };
      /**
       * You can drag start the Moveable through the external `MouseEvent`or `TouchEvent`. (Angular: ngDragStart)
       * @method Moveable#dragStart
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
        this.moveable.dragStart(e);
      };
      /**
       * Whether the coordinates are inside Moveable
       * @method Moveable#isInside
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
        return this.moveable.isInside(clientX, clientY);
      };
      /**
       * Hit test an element or rect on a moveable target.
       * @method Moveable#hitTest
       * @param - element or rect to test
       * @return - Get hit test rate (rate > 0 is hitted)
       * @example
       * import Moveable from "moveable";
       *
       * const moveable = new Moveable(document.body);
       *
       * document.body.addEventListener("mousedown", e => {
       *     if (moveable.hitTest(e.target) > 0) {
       *          console.log("hiited");
       *     }
       * });
       */


      __proto.hitTest = function (el) {
        return this.moveable.hitTest(el);
      };
      /**
       * If the width, height, left, and top of all elements change, update the shape of the moveable.
       * @method Moveable#updateRect
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
        this.moveable.updateRect();
      };
      /**
       * If the width, height, left, and top of the only target change, update the shape of the moveable.
       * @method Moveable#updateTarget
       * @example
       * import Moveable from "moveable";
       *
       * const moveable = new Moveable(document.body);
       *
       * moveable.updateTarget();
       */


      __proto.updateTarget = function () {
        this.moveable.updateTarget();
      };
      /**
       * Check if the moveable state is being dragged.
       * @method Moveable#isDragging
       * @example
       * import Moveable from "moveable";
       *
       * const moveable = new Moveable(document.body);
       *
       * // false
       * console.log(moveable.isDragging());
       *
       * moveable.on("drag", () => {
       *   // true
       *   console.log(moveable.isDragging());
       * });
       */


      __proto.isDragging = function () {
        return this.moveable.isDragging();
      };
      /**
       * You can get the vertex information, position and offset size information of the target based on the container.
       * @method Moveable#getRect
       * @return - The Rect Info
       * @example
       * import Moveable from "moveable";
       *
       * const moveable = new Moveable(document.body);
       *
       * const rectInfo = moveable.getRect();
       */


      __proto.getRect = function () {
        return this.moveable.getRect();
      };
      /**
       * Request able through a method rather than an event.
       * At the moment of execution, requestStart is executed,
       * and then request and requestEnd can be executed through Requester.
       * @method Moveable#request
       * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Draggable.html#request|Draggable Requester}
       * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Resizable.html#request|Resizable Requester}
       * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Scalable.html#request|Scalable Requester}
       * @see {@link https://daybrush.com/moveable/release/latest/doc/Moveable.Rotatable.html#request|Rotatable Requester}
       * @param - ableName
       * @param - request to be able params. If isInstant is true, request and requestEnd are executed immediately.
       * @return - Able Requester. If there is no request in able, nothing will work.
       * @example
       * import Moveable from "moveable";
       *
       * const moveable = new Moveable(document.body);
       *
       * // Instantly Request (requestStart - request - requestEnd)
       * moveable.request("draggable", { deltaX: 10, deltaY: 10, isInstant: true });
       *
       * // Start move
       * const requester = moveable.request("draggable");
       * requester.request({ deltaX: 10, deltaY: 10 });
       * requester.request({ deltaX: 10, deltaY: 10 });
       * requester.request({ deltaX: 10, deltaY: 10 });
       * requester.requestEnd();
       */


      __proto.request = function (ableName, params) {
        return this.moveable.request(ableName, params);
      };
      /**
       * Remove the Moveable object and the events.
       * @method Moveable#destroy
       * @example
       * import Moveable from "moveable";
       *
       * const moveable = new Moveable(document.body);
       *
       * moveable.destroy();
       */


      __proto.destroy = function () {
        this.moveable.componentWillUnmount();
      };

      return Moveable;
    }(PureComponent);

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
        return createPortal(createElement(Moveable, __assign({
          ref: ref(this, "moveable")
        }, this.state)), this.state.parentElement);
      };

      return InnerMoveable;
    }(Component$1);

    var PROPERTIES = ["draggable", "resizable", "scalable", "rotatable", "warpable", "pinchable", "snappable", "origin", "target", "edge", "throttleDrag", "throttleDragRotate", "throttleResize", "throttleScale", "throttleRotate", "keepRatio", "dragArea", "pinchThreshold", "snapCenter", "snapThreshold", "horizontalGuidelines", "verticalGuidelines", "elementGuidelines", "bounds", "innerBounds", "className", "renderDirections", "scrollable", "getScrollPosition", "scrollContainer", "scrollThreshold", "baseDirection", "snapElement", "snapVertical", "snapHorizontal", "snapGap", "isDisplaySnapDigit", "snapDigit", "zoom", "triggerAblesSimultaneously", "padding", "snapDistFormat", "dragTarget"];
    var EVENTS = ["dragStart", "drag", "dragEnd", "resizeStart", "resize", "resizeEnd", "scaleStart", "scale", "scaleEnd", "rotateStart", "rotate", "rotateEnd", "warpStart", "warp", "warpEnd", "pinchStart", "pinch", "pinchEnd", "dragGroupStart", "dragGroup", "dragGroupEnd", "resizeGroupStart", "resizeGroup", "resizeGroupEnd", "scaleGroupStart", "scaleGroup", "scaleGroupEnd", "rotateGroupStart", "rotateGroup", "rotateGroupEnd", "pinchGroupStart", "pinchGroup", "pinchGroupEnd", "click", "clickGroup", "scroll", "scrollGroup", "renderStart", "render", "renderEnd", "renderGroupStart", "renderGroup", "renderGroupEnd", "snap"];
    var METHODS = ["isMoveableElement", "updateRect", "updateTarget", "destroy", "dragStart", "isInside", "hitTest", "setState", "getRect", "request", "isDragging"];

    /**
     * Moveable is Draggable! Resizable! Scalable! Rotatable!
     * @sort 1
     * @extends eg.Component
     */

    var Moveable$1 =
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

      var __proto = Moveable.prototype;

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

      Moveable = __decorate([Properties(METHODS, function (prototype, property) {
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
      })], Moveable);
      return Moveable;
    }(Component);



    var modules = {
        __proto__: null,
        'default': Moveable$1,
        PROPERTIES: PROPERTIES,
        EVENTS: EVENTS,
        METHODS: METHODS
    };

    for (var name in modules) {
      Moveable$1[name] = modules[name];
    }

    return Moveable$1;

})));
//# sourceMappingURL=moveable.js.map
