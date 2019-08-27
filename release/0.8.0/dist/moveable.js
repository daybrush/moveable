/*
Copyright (c) 2019 Daybrush
name: moveable
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/moveable.git
version: 0.8.0
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Moveable = factory());
}(this, function () { 'use strict';

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
    version: 0.2.0
    */
    /* react */

    function ref(target, name) {
      return function (e) {
        e && (target[name] = e);
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

    var VNode = function VNode() {};

    var options = {};

    var stack = [];

    var EMPTY_CHILDREN = [];

    function h(nodeName, attributes) {
    	var children = EMPTY_CHILDREN,
    	    lastSimple,
    	    child,
    	    simple,
    	    i;
    	for (i = arguments.length; i-- > 2;) {
    		stack.push(arguments[i]);
    	}
    	if (attributes && attributes.children != null) {
    		if (!stack.length) stack.push(attributes.children);
    		delete attributes.children;
    	}
    	while (stack.length) {
    		if ((child = stack.pop()) && child.pop !== undefined) {
    			for (i = child.length; i--;) {
    				stack.push(child[i]);
    			}
    		} else {
    			if (typeof child === 'boolean') child = null;

    			if (simple = typeof nodeName !== 'function') {
    				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
    			}

    			if (simple && lastSimple) {
    				children[children.length - 1] += child;
    			} else if (children === EMPTY_CHILDREN) {
    				children = [child];
    			} else {
    				children.push(child);
    			}

    			lastSimple = simple;
    		}
    	}

    	var p = new VNode();
    	p.nodeName = nodeName;
    	p.children = children;
    	p.attributes = attributes == null ? undefined : attributes;
    	p.key = attributes == null ? undefined : attributes.key;

    	if (options.vnode !== undefined) options.vnode(p);

    	return p;
    }

    function extend(obj, props) {
      for (var i in props) {
        obj[i] = props[i];
      }return obj;
    }

    function applyRef(ref, value) {
      if (ref) {
        if (typeof ref == 'function') ref(value);else ref.current = value;
      }
    }

    var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

    function cloneElement(vnode, props) {
      return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
    }

    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

    var items = [];

    function enqueueRender(component) {
    	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
    		( defer)(rerender);
    	}
    }

    function rerender() {
    	var p;
    	while (p = items.pop()) {
    		if (p._dirty) renderComponent(p);
    	}
    }

    function isSameNodeType(node, vnode, hydrating) {
    	if (typeof vnode === 'string' || typeof vnode === 'number') {
    		return node.splitText !== undefined;
    	}
    	if (typeof vnode.nodeName === 'string') {
    		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
    	}
    	return hydrating || node._componentConstructor === vnode.nodeName;
    }

    function isNamedNode(node, nodeName) {
    	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
    }

    function getNodeProps(vnode) {
    	var props = extend({}, vnode.attributes);
    	props.children = vnode.children;

    	var defaultProps = vnode.nodeName.defaultProps;
    	if (defaultProps !== undefined) {
    		for (var i in defaultProps) {
    			if (props[i] === undefined) {
    				props[i] = defaultProps[i];
    			}
    		}
    	}

    	return props;
    }

    function createNode(nodeName, isSvg) {
    	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
    	node.normalizedNodeName = nodeName;
    	return node;
    }

    function removeNode(node) {
    	var parentNode = node.parentNode;
    	if (parentNode) parentNode.removeChild(node);
    }

    function setAccessor(node, name, old, value, isSvg) {
    	if (name === 'className') name = 'class';

    	if (name === 'key') ; else if (name === 'ref') {
    		applyRef(old, null);
    		applyRef(value, node);
    	} else if (name === 'class' && !isSvg) {
    		node.className = value || '';
    	} else if (name === 'style') {
    		if (!value || typeof value === 'string' || typeof old === 'string') {
    			node.style.cssText = value || '';
    		}
    		if (value && typeof value === 'object') {
    			if (typeof old !== 'string') {
    				for (var i in old) {
    					if (!(i in value)) node.style[i] = '';
    				}
    			}
    			for (var i in value) {
    				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
    			}
    		}
    	} else if (name === 'dangerouslySetInnerHTML') {
    		if (value) node.innerHTML = value.__html || '';
    	} else if (name[0] == 'o' && name[1] == 'n') {
    		var useCapture = name !== (name = name.replace(/Capture$/, ''));
    		name = name.toLowerCase().substring(2);
    		if (value) {
    			if (!old) node.addEventListener(name, eventProxy, useCapture);
    		} else {
    			node.removeEventListener(name, eventProxy, useCapture);
    		}
    		(node._listeners || (node._listeners = {}))[name] = value;
    	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
    		try {
    			node[name] = value == null ? '' : value;
    		} catch (e) {}
    		if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
    	} else {
    		var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

    		if (value == null || value === false) {
    			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
    		} else if (typeof value !== 'function') {
    			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
    		}
    	}
    }

    function eventProxy(e) {
    	return this._listeners[e.type](options.event && options.event(e) || e);
    }

    var mounts = [];

    var diffLevel = 0;

    var isSvgMode = false;

    var hydrating = false;

    function flushMounts() {
    	var c;
    	while (c = mounts.shift()) {
    		if (c.componentDidMount) c.componentDidMount();
    	}
    }

    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
    	if (!diffLevel++) {
    		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

    		hydrating = dom != null && !('__preactattr_' in dom);
    	}

    	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

    	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

    	if (! --diffLevel) {
    		hydrating = false;

    		if (!componentRoot) flushMounts();
    	}

    	return ret;
    }

    function idiff(dom, vnode, context, mountAll, componentRoot) {
    	var out = dom,
    	    prevSvgMode = isSvgMode;

    	if (vnode == null || typeof vnode === 'boolean') vnode = '';

    	if (typeof vnode === 'string' || typeof vnode === 'number') {
    		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
    			if (dom.nodeValue != vnode) {
    				dom.nodeValue = vnode;
    			}
    		} else {
    			out = document.createTextNode(vnode);
    			if (dom) {
    				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
    				recollectNodeTree(dom, true);
    			}
    		}

    		out['__preactattr_'] = true;

    		return out;
    	}

    	var vnodeName = vnode.nodeName;
    	if (typeof vnodeName === 'function') {
    		return buildComponentFromVNode(dom, vnode, context, mountAll);
    	}

    	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

    	vnodeName = String(vnodeName);
    	if (!dom || !isNamedNode(dom, vnodeName)) {
    		out = createNode(vnodeName, isSvgMode);

    		if (dom) {
    			while (dom.firstChild) {
    				out.appendChild(dom.firstChild);
    			}
    			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

    			recollectNodeTree(dom, true);
    		}
    	}

    	var fc = out.firstChild,
    	    props = out['__preactattr_'],
    	    vchildren = vnode.children;

    	if (props == null) {
    		props = out['__preactattr_'] = {};
    		for (var a = out.attributes, i = a.length; i--;) {
    			props[a[i].name] = a[i].value;
    		}
    	}

    	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
    		if (fc.nodeValue != vchildren[0]) {
    			fc.nodeValue = vchildren[0];
    		}
    	} else if (vchildren && vchildren.length || fc != null) {
    			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
    		}

    	diffAttributes(out, vnode.attributes, props);

    	isSvgMode = prevSvgMode;

    	return out;
    }

    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
    	var originalChildren = dom.childNodes,
    	    children = [],
    	    keyed = {},
    	    keyedLen = 0,
    	    min = 0,
    	    len = originalChildren.length,
    	    childrenLen = 0,
    	    vlen = vchildren ? vchildren.length : 0,
    	    j,
    	    c,
    	    f,
    	    vchild,
    	    child;

    	if (len !== 0) {
    		for (var i = 0; i < len; i++) {
    			var _child = originalChildren[i],
    			    props = _child['__preactattr_'],
    			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
    			if (key != null) {
    				keyedLen++;
    				keyed[key] = _child;
    			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
    				children[childrenLen++] = _child;
    			}
    		}
    	}

    	if (vlen !== 0) {
    		for (var i = 0; i < vlen; i++) {
    			vchild = vchildren[i];
    			child = null;

    			var key = vchild.key;
    			if (key != null) {
    				if (keyedLen && keyed[key] !== undefined) {
    					child = keyed[key];
    					keyed[key] = undefined;
    					keyedLen--;
    				}
    			} else if (min < childrenLen) {
    					for (j = min; j < childrenLen; j++) {
    						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
    							child = c;
    							children[j] = undefined;
    							if (j === childrenLen - 1) childrenLen--;
    							if (j === min) min++;
    							break;
    						}
    					}
    				}

    			child = idiff(child, vchild, context, mountAll);

    			f = originalChildren[i];
    			if (child && child !== dom && child !== f) {
    				if (f == null) {
    					dom.appendChild(child);
    				} else if (child === f.nextSibling) {
    					removeNode(f);
    				} else {
    					dom.insertBefore(child, f);
    				}
    			}
    		}
    	}

    	if (keyedLen) {
    		for (var i in keyed) {
    			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
    		}
    	}

    	while (min <= childrenLen) {
    		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
    	}
    }

    function recollectNodeTree(node, unmountOnly) {
    	var component = node._component;
    	if (component) {
    		unmountComponent(component);
    	} else {
    		if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

    		if (unmountOnly === false || node['__preactattr_'] == null) {
    			removeNode(node);
    		}

    		removeChildren(node);
    	}
    }

    function removeChildren(node) {
    	node = node.lastChild;
    	while (node) {
    		var next = node.previousSibling;
    		recollectNodeTree(node, true);
    		node = next;
    	}
    }

    function diffAttributes(dom, attrs, old) {
    	var name;

    	for (name in old) {
    		if (!(attrs && attrs[name] != null) && old[name] != null) {
    			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
    		}
    	}

    	for (name in attrs) {
    		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
    			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    		}
    	}
    }

    var recyclerComponents = [];

    function createComponent(Ctor, props, context) {
    	var inst,
    	    i = recyclerComponents.length;

    	if (Ctor.prototype && Ctor.prototype.render) {
    		inst = new Ctor(props, context);
    		Component$1.call(inst, props, context);
    	} else {
    		inst = new Component$1(props, context);
    		inst.constructor = Ctor;
    		inst.render = doRender;
    	}

    	while (i--) {
    		if (recyclerComponents[i].constructor === Ctor) {
    			inst.nextBase = recyclerComponents[i].nextBase;
    			recyclerComponents.splice(i, 1);
    			return inst;
    		}
    	}

    	return inst;
    }

    function doRender(props, state, context) {
    	return this.constructor(props, context);
    }

    function setComponentProps(component, props, renderMode, context, mountAll) {
    	if (component._disable) return;
    	component._disable = true;

    	component.__ref = props.ref;
    	component.__key = props.key;
    	delete props.ref;
    	delete props.key;

    	if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
    		if (!component.base || mountAll) {
    			if (component.componentWillMount) component.componentWillMount();
    		} else if (component.componentWillReceiveProps) {
    			component.componentWillReceiveProps(props, context);
    		}
    	}

    	if (context && context !== component.context) {
    		if (!component.prevContext) component.prevContext = component.context;
    		component.context = context;
    	}

    	if (!component.prevProps) component.prevProps = component.props;
    	component.props = props;

    	component._disable = false;

    	if (renderMode !== 0) {
    		if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
    			renderComponent(component, 1, mountAll);
    		} else {
    			enqueueRender(component);
    		}
    	}

    	applyRef(component.__ref, component);
    }

    function renderComponent(component, renderMode, mountAll, isChild) {
    	if (component._disable) return;

    	var props = component.props,
    	    state = component.state,
    	    context = component.context,
    	    previousProps = component.prevProps || props,
    	    previousState = component.prevState || state,
    	    previousContext = component.prevContext || context,
    	    isUpdate = component.base,
    	    nextBase = component.nextBase,
    	    initialBase = isUpdate || nextBase,
    	    initialChildComponent = component._component,
    	    skip = false,
    	    snapshot = previousContext,
    	    rendered,
    	    inst,
    	    cbase;

    	if (component.constructor.getDerivedStateFromProps) {
    		state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
    		component.state = state;
    	}

    	if (isUpdate) {
    		component.props = previousProps;
    		component.state = previousState;
    		component.context = previousContext;
    		if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
    			skip = true;
    		} else if (component.componentWillUpdate) {
    			component.componentWillUpdate(props, state, context);
    		}
    		component.props = props;
    		component.state = state;
    		component.context = context;
    	}

    	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
    	component._dirty = false;

    	if (!skip) {
    		rendered = component.render(props, state, context);

    		if (component.getChildContext) {
    			context = extend(extend({}, context), component.getChildContext());
    		}

    		if (isUpdate && component.getSnapshotBeforeUpdate) {
    			snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
    		}

    		var childComponent = rendered && rendered.nodeName,
    		    toUnmount,
    		    base;

    		if (typeof childComponent === 'function') {

    			var childProps = getNodeProps(rendered);
    			inst = initialChildComponent;

    			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
    				setComponentProps(inst, childProps, 1, context, false);
    			} else {
    				toUnmount = inst;

    				component._component = inst = createComponent(childComponent, childProps, context);
    				inst.nextBase = inst.nextBase || nextBase;
    				inst._parentComponent = component;
    				setComponentProps(inst, childProps, 0, context, false);
    				renderComponent(inst, 1, mountAll, true);
    			}

    			base = inst.base;
    		} else {
    			cbase = initialBase;

    			toUnmount = initialChildComponent;
    			if (toUnmount) {
    				cbase = component._component = null;
    			}

    			if (initialBase || renderMode === 1) {
    				if (cbase) cbase._component = null;
    				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
    			}
    		}

    		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
    			var baseParent = initialBase.parentNode;
    			if (baseParent && base !== baseParent) {
    				baseParent.replaceChild(base, initialBase);

    				if (!toUnmount) {
    					initialBase._component = null;
    					recollectNodeTree(initialBase, false);
    				}
    			}
    		}

    		if (toUnmount) {
    			unmountComponent(toUnmount);
    		}

    		component.base = base;
    		if (base && !isChild) {
    			var componentRef = component,
    			    t = component;
    			while (t = t._parentComponent) {
    				(componentRef = t).base = base;
    			}
    			base._component = componentRef;
    			base._componentConstructor = componentRef.constructor;
    		}
    	}

    	if (!isUpdate || mountAll) {
    		mounts.push(component);
    	} else if (!skip) {

    		if (component.componentDidUpdate) {
    			component.componentDidUpdate(previousProps, previousState, snapshot);
    		}
    	}

    	while (component._renderCallbacks.length) {
    		component._renderCallbacks.pop().call(component);
    	}if (!diffLevel && !isChild) flushMounts();
    }

    function buildComponentFromVNode(dom, vnode, context, mountAll) {
    	var c = dom && dom._component,
    	    originalComponent = c,
    	    oldDom = dom,
    	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
    	    isOwner = isDirectOwner,
    	    props = getNodeProps(vnode);
    	while (c && !isOwner && (c = c._parentComponent)) {
    		isOwner = c.constructor === vnode.nodeName;
    	}

    	if (c && isOwner && (!mountAll || c._component)) {
    		setComponentProps(c, props, 3, context, mountAll);
    		dom = c.base;
    	} else {
    		if (originalComponent && !isDirectOwner) {
    			unmountComponent(originalComponent);
    			dom = oldDom = null;
    		}

    		c = createComponent(vnode.nodeName, props, context);
    		if (dom && !c.nextBase) {
    			c.nextBase = dom;

    			oldDom = null;
    		}
    		setComponentProps(c, props, 1, context, mountAll);
    		dom = c.base;

    		if (oldDom && dom !== oldDom) {
    			oldDom._component = null;
    			recollectNodeTree(oldDom, false);
    		}
    	}

    	return dom;
    }

    function unmountComponent(component) {

    	var base = component.base;

    	component._disable = true;

    	if (component.componentWillUnmount) component.componentWillUnmount();

    	component.base = null;

    	var inner = component._component;
    	if (inner) {
    		unmountComponent(inner);
    	} else if (base) {
    		if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);

    		component.nextBase = base;

    		removeNode(base);
    		recyclerComponents.push(component);

    		removeChildren(base);
    	}

    	applyRef(component.__ref, null);
    }

    function Component$1(props, context) {
    	this._dirty = true;

    	this.context = context;

    	this.props = props;

    	this.state = this.state || {};

    	this._renderCallbacks = [];
    }

    extend(Component$1.prototype, {
    	setState: function setState(state, callback) {
    		if (!this.prevState) this.prevState = this.state;
    		this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
    		if (callback) this._renderCallbacks.push(callback);
    		enqueueRender(this);
    	},
    	forceUpdate: function forceUpdate(callback) {
    		if (callback) this._renderCallbacks.push(callback);
    		renderComponent(this, 2);
    	},
    	render: function render() {}
    });

    function render(vnode, parent, merge) {
      return diff(merge, vnode, {}, false, parent, false);
    }

    function createRef() {
    	return {};
    }

    var PropTypes = {
        checkPropTypes: function () {}
    };

    function createEmitter(initialValue, bitmaskFactory) {
        var registeredUpdaters = [];
        var value = initialValue;
        var diff = function (newValue) { return bitmaskFactory(value, newValue) | 0; };
        return {
            register: function (updater) {
                registeredUpdaters.push(updater);
                updater(value, diff(value));
            },
            unregister: function (updater) {
                registeredUpdaters = registeredUpdaters.filter(function (i) { return i !== updater; });
            },
            val: function (newValue) {
                if (newValue === undefined || newValue == value) {
                    return value;
                }
                var bitmask = diff(newValue);
                value = newValue;
                registeredUpdaters.forEach(function (up) { return up(newValue, bitmask); });
                return value;
            }
        };
    }
    var noopEmitter = {
        register: function (_) {
            console.warn("Consumer used without a Provider");
        },
        unregister: function (_) {
            // do nothing
        },
        val: function (_) {
            //do nothing;
        }
    };

    /*
     * Extracts the children from the props and returns an object containing the
     * only element of the given array (preact always passes children as an array)
     * or null otherwise. The result contains always a reference to the original
     * array of children
     *
     * @param {RenderableProps<*>} props - the component's properties
     * @return {{ child: JSX.Element | null, children: JSX.Element[]}}
     */
    function getOnlyChildAndChildren(props) {
        var children = props.children;
        var child = children.length === 1 ? children[0] : null;
        return { child: child, children: children };
    }

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    function getRenderer(props) {
        var child = getOnlyChildAndChildren(props).child;
        // TODO: "render" in props check is only done to make TS happy
        return child || ("render" in props && props.render);
    }
    var MAX_SIGNED_31_BIT_INT = 1073741823;
    var defaultBitmaskFactory = function () { return MAX_SIGNED_31_BIT_INT; };
    var ids = 0;
    function _createContext(value, bitmaskFactory) {
        var key = "_preactContextProvider-" + ids++;
        var Provider = /*#__PURE__*/ (function (_super) {
            __extends$1(Provider, _super);
            function Provider(props) {
                var _this = _super.call(this, props) || this;
                _this._emitter = createEmitter(props.value, bitmaskFactory || defaultBitmaskFactory);
                return _this;
            }
            Provider.prototype.getChildContext = function () {
                var _a;
                return _a = {}, _a[key] = this._emitter, _a;
            };
            Provider.prototype.componentDidUpdate = function () {
                this._emitter.val(this.props.value);
            };
            Provider.prototype.render = function () {
                var _a = getOnlyChildAndChildren(this.props), child = _a.child, children = _a.children;
                if (child) {
                    return child;
                }
                // preact does not support fragments,
                // therefore we wrap the children in a span
                return h("span", null, children);
            };
            return Provider;
        }(Component$1));
        var Consumer = /*#__PURE__*/ (function (_super) {
            __extends$1(Consumer, _super);
            function Consumer(props, ctx) {
                var _this = _super.call(this, props, ctx) || this;
                _this._updateContext = function (value, bitmask) {
                    var unstable_observedBits = _this.props.unstable_observedBits;
                    var observed = unstable_observedBits === undefined || unstable_observedBits === null
                        ? MAX_SIGNED_31_BIT_INT
                        : unstable_observedBits;
                    observed = observed | 0;
                    if ((observed & bitmask) === 0) {
                        return;
                    }
                    _this.setState({ value: value });
                };
                _this.state = { value: _this._getEmitter().val() || value };
                return _this;
            }
            Consumer.prototype.componentDidMount = function () {
                this._getEmitter().register(this._updateContext);
            };
            Consumer.prototype.shouldComponentUpdate = function (nextProps, nextState) {
                return (this.state.value !== nextState.value ||
                    getRenderer(this.props) !== getRenderer(nextProps));
            };
            Consumer.prototype.componentWillUnmount = function () {
                this._getEmitter().unregister(this._updateContext);
            };
            Consumer.prototype.componentDidUpdate = function (_, __, prevCtx) {
                var previousProvider = prevCtx[key];
                if (previousProvider === this.context[key]) {
                    return;
                }
                (previousProvider || noopEmitter).unregister(this._updateContext);
                this.componentDidMount();
            };
            Consumer.prototype.render = function () {
                // TODO: "render" in props check is only done to make TS happy
                var render = "render" in this.props && this.props.render;
                var r = getRenderer(this.props);
                if (render && render !== r) {
                    console.warn("Both children and a render function are defined. Children will be used");
                }
                if (typeof r === "function") {
                    return r(this.state.value);
                }
                console.warn("Consumer is expecting a function as one and only child but didn't find any");
            };
            Consumer.prototype._getEmitter = function () {
                return this.context[key] || noopEmitter;
            };
            return Consumer;
        }(Component$1));
        return {
            Provider: Provider,
            Consumer: Consumer
        };
    }
    var createContext = _createContext;

    var version = '15.1.0'; // trick libraries to think we are react

    var ELEMENTS = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan'.split(
    	' '
    );

    var REACT_ELEMENT_TYPE = (typeof Symbol !== 'undefined' && Symbol.for && Symbol.for('react.element')) || 0xeac7;

    var COMPONENT_WRAPPER_KEY =
    	typeof Symbol !== 'undefined' && Symbol.for ? Symbol.for('__preactCompatWrapper') : '__preactCompatWrapper';

    // don't autobind these methods since they already have guaranteed context.
    var AUTOBIND_BLACKLIST = {
    	constructor: 1,
    	render: 1,
    	shouldComponentUpdate: 1,
    	componentWillReceiveProps: 1,
    	componentWillUpdate: 1,
    	componentDidUpdate: 1,
    	componentWillMount: 1,
    	componentDidMount: 1,
    	componentWillUnmount: 1,
    	componentDidUnmount: 1
    };

    var CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/;

    var BYPASS_HOOK = {};

    /*global process*/
    var DEV = false;
    try {
    	DEV = process.env.NODE_ENV !== 'production';
    }
    catch (e) { }

    // a component that renders nothing. Used to replace components for unmountComponentAtNode.
    function EmptyComponent() {
    	return null;
    }

    // make react think we're react.
    var VNode$1 = h('a', null).constructor;
    VNode$1.prototype.$$typeof = REACT_ELEMENT_TYPE;
    VNode$1.prototype.preactCompatUpgraded = false;
    VNode$1.prototype.preactCompatNormalized = false;

    Object.defineProperty(VNode$1.prototype, 'type', {
    	get: function() {
    		return this.nodeName;
    	},
    	set: function(v) {
    		this.nodeName = v;
    	},
    	configurable: true
    });

    Object.defineProperty(VNode$1.prototype, 'props', {
    	get: function() {
    		return this.attributes;
    	},
    	set: function(v) {
    		this.attributes = v;
    	},
    	configurable: true
    });

    var oldEventHook = options.event;
    options.event = function (e) {
    	if (oldEventHook) { e = oldEventHook(e); }
    	e.persist = Object;
    	e.nativeEvent = e;
    	return e;
    };

    var oldVnodeHook = options.vnode;
    options.vnode = function (vnode) {
    	if (!vnode.preactCompatUpgraded) {
    		vnode.preactCompatUpgraded = true;

    		var tag = vnode.nodeName,
    			attrs = (vnode.attributes = vnode.attributes == null ? {} : extend$1({}, vnode.attributes));

    		if (typeof tag === 'function') {
    			if (tag[COMPONENT_WRAPPER_KEY] === true || (tag.prototype && 'isReactComponent' in tag.prototype)) {
    				if (vnode.children && String(vnode.children) === '') { vnode.children = undefined; }
    				if (vnode.children) { attrs.children = vnode.children; }

    				if (!vnode.preactCompatNormalized) {
    					normalizeVNode(vnode);
    				}
    				handleComponentVNode(vnode);
    			}
    		}
    		else {
    			if (vnode.children && String(vnode.children) === '') { vnode.children = undefined; }
    			if (vnode.children) { attrs.children = vnode.children; }

    			if (attrs.defaultValue) {
    				if (!attrs.value && attrs.value !== 0) {
    					attrs.value = attrs.defaultValue;
    				}
    				delete attrs.defaultValue;
    			}

    			handleElementVNode(vnode, attrs);
    		}
    	}

    	if (oldVnodeHook) { oldVnodeHook(vnode); }
    };

    function handleComponentVNode(vnode) {
    	var tag = vnode.nodeName,
    		a = vnode.attributes;

    	vnode.attributes = {};
    	if (tag.defaultProps) { extend$1(vnode.attributes, tag.defaultProps); }
    	if (a) { extend$1(vnode.attributes, a); }
    }

    function handleElementVNode(vnode, a) {
    	var shouldSanitize, attrs, i;
    	if (a) {
    		for (i in a) { if ((shouldSanitize = CAMEL_PROPS.test(i))) { break; } }
    		if (shouldSanitize) {
    			attrs = vnode.attributes = {};
    			for (i in a) {
    				if (a.hasOwnProperty(i)) {
    					attrs[CAMEL_PROPS.test(i) ? i.replace(/([A-Z0-9])/, '-$1').toLowerCase() : i] = a[i];
    				}
    			}
    		}
    	}
    }

    // proxy render() since React returns a Component reference.
    function render$1(vnode, parent, callback) {
    	var prev = parent && parent._preactCompatRendered && parent._preactCompatRendered.base;

    	// ignore impossible previous renders
    	if (prev && prev.parentNode !== parent) { prev = null; }

    	// default to first Element child
    	if (!prev && parent) { prev = parent.firstElementChild; }

    	// remove unaffected siblings
    	for (var i = parent.childNodes.length; i--;) {
    		if (parent.childNodes[i] !== prev) {
    			parent.removeChild(parent.childNodes[i]);
    		}
    	}

    	var out = render(vnode, parent, prev);
    	if (parent) { parent._preactCompatRendered = out && (out._component || { base: out }); }
    	if (typeof callback === 'function') { callback(); }
    	return (out && out._component) || out;
    }

    var ContextProvider = function () {};

    ContextProvider.prototype.getChildContext = function () {
    	return this.props.context;
    };
    ContextProvider.prototype.render = function (props) {
    	return props.children[0];
    };

    function renderSubtreeIntoContainer(parentComponent, vnode, container, callback) {
    	var wrap = h(ContextProvider, { context: parentComponent.context }, vnode);
    	var renderContainer = render$1(wrap, container);
    	var component = renderContainer._component || renderContainer.base;
    	if (callback) { callback.call(component, renderContainer); }
    	return component;
    }

    function Portal(props) {
    	renderSubtreeIntoContainer(this, props.vnode, props.container);
    }

    function createPortal(vnode, container) {
    	return h(Portal, { vnode: vnode, container: container });
    }

    function unmountComponentAtNode(container) {
    	var existing = container._preactCompatRendered && container._preactCompatRendered.base;
    	if (existing && existing.parentNode === container) {
    		render(h(EmptyComponent), container, existing);
    		return true;
    	}
    	return false;
    }

    var ARR = [];

    // This API is completely unnecessary for Preact, so it's basically passthrough.
    var Children = {
    	map: function(children, fn, ctx) {
    		if (children == null) { return null; }
    		children = Children.toArray(children);
    		if (ctx && ctx !== children) { fn = fn.bind(ctx); }
    		return children.map(fn);
    	},
    	forEach: function(children, fn, ctx) {
    		if (children == null) { return null; }
    		children = Children.toArray(children);
    		if (ctx && ctx !== children) { fn = fn.bind(ctx); }
    		children.forEach(fn);
    	},
    	count: function(children) {
    		return (children && children.length) || 0;
    	},
    	only: function(children) {
    		children = Children.toArray(children);
    		if (children.length !== 1) { throw new Error('Children.only() expects only one child.'); }
    		return children[0];
    	},
    	toArray: function(children) {
    		if (children == null) { return []; }
    		return ARR.concat(children);
    	}
    };

    /** Track current render() component for ref assignment */
    var currentComponent;

    function createFactory(type) {
    	return createElement.bind(null, type);
    }

    var DOM = {};
    for (var i = ELEMENTS.length; i--;) {
    	DOM[ELEMENTS[i]] = createFactory(ELEMENTS[i]);
    }

    function upgradeToVNodes(arr, offset) {
    	for (var i = offset || 0; i < arr.length; i++) {
    		var obj = arr[i];
    		if (Array.isArray(obj)) {
    			upgradeToVNodes(obj);
    		}
    		else if (
    			obj &&
    			typeof obj === 'object' &&
    			!isValidElement(obj) &&
    			((obj.props && obj.type) || (obj.attributes && obj.nodeName) || obj.children)
    		) {
    			arr[i] = createElement(obj.type || obj.nodeName, obj.props || obj.attributes, obj.children);
    		}
    	}
    }

    function isStatelessComponent(c) {
    	return typeof c === 'function' && !(c.prototype && c.prototype.render);
    }

    // wraps stateless functional components in a PropTypes validator
    function wrapStatelessComponent(WrappedComponent) {
    	return createClass({
    		displayName: WrappedComponent.displayName || WrappedComponent.name,
    		render: function() {
    			return WrappedComponent(this.props, this.context);
    		}
    	});
    }

    function statelessComponentHook(Ctor) {
    	var Wrapped = Ctor[COMPONENT_WRAPPER_KEY];
    	if (Wrapped) { return Wrapped === true ? Ctor : Wrapped; }

    	Wrapped = wrapStatelessComponent(Ctor);

    	Object.defineProperty(Wrapped, COMPONENT_WRAPPER_KEY, { configurable: true, value: true });
    	Wrapped.displayName = Ctor.displayName;
    	Wrapped.propTypes = Ctor.propTypes;
    	Wrapped.defaultProps = Ctor.defaultProps;

    	Object.defineProperty(Ctor, COMPONENT_WRAPPER_KEY, { configurable: true, value: Wrapped });

    	return Wrapped;
    }

    function createElement() {
    	var args = [], len = arguments.length;
    	while ( len-- ) args[ len ] = arguments[ len ];

    	upgradeToVNodes(args, 2);
    	return normalizeVNode(h.apply(void 0, args));
    }

    function normalizeVNode(vnode) {
    	vnode.preactCompatNormalized = true;

    	applyClassName(vnode);

    	if (isStatelessComponent(vnode.nodeName)) {
    		vnode.nodeName = statelessComponentHook(vnode.nodeName);
    	}

    	var ref = vnode.attributes.ref,
    		type = ref && typeof ref;
    	if (currentComponent && (type === 'string' || type === 'number')) {
    		vnode.attributes.ref = createStringRefProxy(ref, currentComponent);
    	}

    	applyEventNormalization(vnode);

    	return vnode;
    }

    function cloneElement$1(element, props) {
    	var children = [], len = arguments.length - 2;
    	while ( len-- > 0 ) children[ len ] = arguments[ len + 2 ];

    	if (!isValidElement(element)) { return element; }
    	var elementProps = element.attributes || element.props;
    	var node = h(
    		element.nodeName || element.type,
    		extend$1({}, elementProps),
    		element.children || (elementProps && elementProps.children)
    	);
    	// Only provide the 3rd argument if needed.
    	// Arguments 3+ overwrite element.children in preactCloneElement
    	var cloneArgs = [node, props];
    	if (children && children.length) {
    		cloneArgs.push(children);
    	}
    	else if (props && props.children) {
    		cloneArgs.push(props.children);
    	}
    	return normalizeVNode(cloneElement.apply(void 0, cloneArgs));
    }

    function isValidElement(element) {
    	return element && (element instanceof VNode$1 || element.$$typeof === REACT_ELEMENT_TYPE);
    }

    function createStringRefProxy(name, component) {
    	return (
    		component._refProxies[name] ||
    		(component._refProxies[name] = function (resolved) {
    			if (component && component.refs) {
    				component.refs[name] = resolved;
    				if (resolved === null) {
    					delete component._refProxies[name];
    					component = null;
    				}
    			}
    		})
    	);
    }

    function applyEventNormalization(ref) {
    	var nodeName = ref.nodeName;
    	var attributes = ref.attributes;

    	if (!attributes || typeof nodeName !== 'string') { return; }
    	var props = {};
    	for (var i in attributes) {
    		props[i.toLowerCase()] = i;
    	}
    	if (props.ondoubleclick) {
    		attributes.ondblclick = attributes[props.ondoubleclick];
    		delete attributes[props.ondoubleclick];
    	}
    	// for *textual inputs* (incl textarea), normalize `onChange` -> `onInput`:
    	if (
    		props.onchange &&
    		(nodeName === 'textarea' || (nodeName.toLowerCase() === 'input' && !/^fil|che|rad/i.test(attributes.type)))
    	) {
    		var normalized = props.oninput || 'oninput';
    		if (!attributes[normalized]) {
    			attributes[normalized] = multihook([attributes[normalized], attributes[props.onchange]]);
    			delete attributes[props.onchange];
    		}
    	}
    }

    function applyClassName(vnode) {
    	var a = vnode.attributes || (vnode.attributes = {});
    	classNameDescriptor.enumerable = 'className' in a;
    	if (a.className) { a.class = a.className; }
    	Object.defineProperty(a, 'className', classNameDescriptor);
    }

    var classNameDescriptor = {
    	configurable: true,
    	get: function() {
    		return this.class;
    	},
    	set: function(v) {
    		this.class = v;
    	}
    };

    function extend$1(base, props) {
    	var arguments$1 = arguments;

    	for (var i = 1, obj = (void 0); i < arguments.length; i++) {
    		if ((obj = arguments$1[i])) {
    			for (var key in obj) {
    				if (obj.hasOwnProperty(key)) {
    					base[key] = obj[key];
    				}
    			}
    		}
    	}
    	return base;
    }

    function shallowDiffers(a, b) {
    	for (var i in a) { if (!(i in b)) { return true; } }
    	for (var i$1 in b) { if (a[i$1] !== b[i$1]) { return true; } }
    	return false;
    }

    function findDOMNode(component) {
    	return (component && (component.base || (component.nodeType === 1 && component))) || null;
    }

    function F() { }

    function createClass(obj) {
    	function cl(props, context) {
    		bindAll(this);
    		Component$1$1.call(this, props, context, BYPASS_HOOK);
    		newComponentHook.call(this, props, context);
    	}

    	obj = extend$1({ constructor: cl }, obj);

    	// We need to apply mixins here so that getDefaultProps is correctly mixed
    	if (obj.mixins) {
    		applyMixins(obj, collateMixins(obj.mixins));
    	}
    	if (obj.statics) {
    		extend$1(cl, obj.statics);
    	}
    	if (obj.propTypes) {
    		cl.propTypes = obj.propTypes;
    	}
    	if (obj.defaultProps) {
    		cl.defaultProps = obj.defaultProps;
    	}
    	if (obj.getDefaultProps) {
    		cl.defaultProps = obj.getDefaultProps.call(cl);
    	}

    	F.prototype = Component$1$1.prototype;
    	cl.prototype = extend$1(new F(), obj);

    	cl.displayName = obj.displayName || 'Component';

    	return cl;
    }

    // Flatten an Array of mixins to a map of method name to mixin implementations
    function collateMixins(mixins) {
    	var keyed = {};
    	for (var i = 0; i < mixins.length; i++) {
    		var mixin = mixins[i];
    		for (var key in mixin) {
    			if (mixin.hasOwnProperty(key) && typeof mixin[key] === 'function') {
    				(keyed[key] || (keyed[key] = [])).push(mixin[key]);
    			}
    		}
    	}
    	return keyed;
    }

    // apply a mapping of Arrays of mixin methods to a component prototype
    function applyMixins(proto, mixins) {
    	for (var key in mixins)
    		{ if (mixins.hasOwnProperty(key)) {
    			proto[key] = multihook(
    				mixins[key].concat(proto[key] || ARR),
    				key === 'getDefaultProps' || key === 'getInitialState' || key === 'getChildContext'
    			);
    		} }
    }

    function bindAll(ctx) {
    	for (var i in ctx) {
    		var v = ctx[i];
    		if (typeof v === 'function' && !v.__bound && !AUTOBIND_BLACKLIST.hasOwnProperty(i)) {
    			(ctx[i] = v.bind(ctx)).__bound = true;
    		}
    	}
    }

    function callMethod(ctx, m, args) {
    	if (typeof m === 'string') {
    		m = ctx.constructor.prototype[m];
    	}
    	if (typeof m === 'function') {
    		return m.apply(ctx, args);
    	}
    }

    function multihook(hooks, skipDuplicates) {
    	return function () {
    		var arguments$1 = arguments;
    		var this$1 = this;

    		var ret;
    		for (var i = 0; i < hooks.length; i++) {
    			var r = callMethod(this$1, hooks[i], arguments$1);

    			if (skipDuplicates && r != null) {
    				if (!ret) { ret = {}; }
    				for (var key in r)
    					{ if (r.hasOwnProperty(key)) {
    						ret[key] = r[key];
    					} }
    			}
    			else if (typeof r !== 'undefined') { ret = r; }
    		}
    		return ret;
    	};
    }

    function newComponentHook(props, context) {
    	propsHook.call(this, props, context);
    	this.componentWillReceiveProps = multihook([
    		propsHook,
    		this.componentWillReceiveProps || 'componentWillReceiveProps'
    	]);
    	this.render = multihook([propsHook, beforeRender, this.render || 'render', afterRender]);
    }

    function propsHook(props, context) {
    	if (!props) { return; }

    	// React annoyingly special-cases single children, and some react components are ridiculously strict about this.
    	var c = props.children;
    	if (
    		c &&
    		Array.isArray(c) &&
    		c.length === 1 &&
    		(typeof c[0] === 'string' || typeof c[0] === 'function' || c[0] instanceof VNode$1)
    	) {
    		props.children = c[0];

    		// but its totally still going to be an Array.
    		if (props.children && typeof props.children === 'object') {
    			props.children.length = 1;
    			props.children[0] = props.children;
    		}
    	}

    	// add proptype checking
    	if (DEV) {
    		var ctor = typeof this === 'function' ? this : this.constructor,
    			propTypes = this.propTypes || ctor.propTypes;
    		var displayName = this.displayName || ctor.name;

    		if (propTypes) {
    			PropTypes.checkPropTypes(propTypes, props, 'prop', displayName);
    		}
    	}
    }

    function beforeRender(props) {
    	currentComponent = this;
    }

    function afterRender() {
    	if (currentComponent === this) {
    		currentComponent = null;
    	}
    }

    function Component$1$1(props, context, opts) {
    	Component$1.call(this, props, context);
    	this.state = this.getInitialState ? this.getInitialState() : {};
    	this.refs = {};
    	this._refProxies = {};
    	if (opts !== BYPASS_HOOK) {
    		newComponentHook.call(this, props, context);
    	}
    }
    extend$1((Component$1$1.prototype = new Component$1()), {
    	constructor: Component$1$1,

    	isReactComponent: {},

    	replaceState: function(state, callback) {
    		var this$1 = this;

    		this.setState(state, callback);
    		for (var i in this$1.state) {
    			if (!(i in state)) {
    				delete this$1.state[i];
    			}
    		}
    	},

    	getDOMNode: function() {
    		return this.base;
    	},

    	isMounted: function() {
    		return !!this.base;
    	}
    });

    function PureComponent(props, context) {
    	Component$1$1.call(this, props, context);
    }
    F.prototype = Component$1$1.prototype;
    PureComponent.prototype = new F();
    PureComponent.prototype.isPureReactComponent = true;
    PureComponent.prototype.shouldComponentUpdate = function (props, state) {
    	return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
    };

    function unstable_batchedUpdates(callback) {
    	callback();
    }

    var index = {
    	version: version,
    	DOM: DOM,
    	PropTypes: PropTypes,
    	Children: Children,
    	render: render$1,
    	hydrate: render$1,
    	createClass: createClass,
    	createContext: createContext,
    	createPortal: createPortal,
    	createFactory: createFactory,
    	createElement: createElement,
    	cloneElement: cloneElement$1,
    	createRef: createRef,
    	isValidElement: isValidElement,
    	findDOMNode: findDOMNode,
    	unmountComponentAtNode: unmountComponentAtNode,
    	Component: Component$1$1,
    	PureComponent: PureComponent,
    	unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer,
    	unstable_batchedUpdates: unstable_batchedUpdates,
    	__spread: extend$1
    };

    var React = ({
        'default': index,
        version: version,
        DOM: DOM,
        Children: Children,
        render: render$1,
        hydrate: render$1,
        createClass: createClass,
        createPortal: createPortal,
        createFactory: createFactory,
        createElement: createElement,
        cloneElement: cloneElement$1,
        isValidElement: isValidElement,
        findDOMNode: findDOMNode,
        unmountComponentAtNode: unmountComponentAtNode,
        Component: Component$1$1,
        PureComponent: PureComponent,
        unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer,
        unstable_batchedUpdates: unstable_batchedUpdates,
        __spread: extend$1,
        PropTypes: PropTypes,
        createRef: createRef,
        createContext: createContext
    });

    /*
    Copyright (c) 2019 Daybrush
    name: framework-utils
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/framework-utils.git
    version: 0.2.1
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
      return css.replace(/\.([^{,\s\d.]+)/g, "." + prefix + "$1");
    }
    /* react */

    function ref$1(target, name) {
      return function (e) {
        e && (target[name] = e);
      };
    }
    function refs(target, name, i) {
      return function (e) {
        e && (target[name][i] = e);
      };
    }

    /*
    Copyright (c) 2017 NAVER Corp.
    @egjs/agent project is licensed under the MIT license

    @egjs/agent JavaScript library


    @version 2.1.5
    */
    var win = typeof window !== "undefined" && window || {};
    var RegExp$1 = win.RegExp;
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
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 0.10.1
    */
    /**
    * get string "object"
    * @memberof Consts
    * @example
    import {OBJECT} from "@daybrush/utils";

    console.log(OBJECT); // "object"
    */

    var OBJECT = "object";
    /**
    * get string "undefined"
    * @memberof Consts
    * @example
    import {UNDEFINED} from "@daybrush/utils";

    console.log(UNDEFINED); // "undefined"
    */

    var UNDEFINED = "undefined";

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
    Copyright (c) 2019 Daybrush
    name: preact-css-styler
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/css-styler/tree/master/preact-css-styler
    version: 0.4.1
    */

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 0.10.0
    */
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
      var matches = text.match(/("[^"]*"|'[^']*'|[^,\s()]*\((?:[^()]*|\([^()]*\))*\)[^,\s()]*|[^,])+/g);
      return matches ? matches.map(function (str) {
        return str.trim();
      }) : [];
    }

    /*
    Copyright (c) 2019 Daybrush
    name: react-css-styler
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/css-styler/tree/master/react-css-styler
    version: 0.4.0
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

    function __extends$2(d, b) {
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
    function injectStyle(className, css) {
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
      (document.head || document.body).appendChild(style);
      return style;
    }

    function styled(Tag, css) {
      var injectClassName = "rCS" + getHash(css);
      var injectCount = 0;
      var injectElement;
      return (
        /*#__PURE__*/
        function (_super) {
          __extends$2(Styler, _super);

          function Styler(props) {
            return _super.call(this, props) || this;
          }

          Styler.prototype.render = function () {
            var _a = this.props,
                className = _a.className,
                attributes = __rest(_a, ["className"]);

            return createElement(Tag, __assign$1({
              className: className + " " + injectClassName
            }, attributes));
          };

          Styler.prototype.componentDidMount = function () {
            if (injectCount === 0) {
              injectElement = injectStyle(injectClassName, css);
            }

            ++injectCount;
          };

          Styler.prototype.componentWillUnmount = function () {
            --injectCount;

            if (injectCount === 0 && injectElement) {
              injectElement.parentNode.removeChild(injectElement);
            }
          };

          Styler.prototype.getElement = function () {
            return this.element || (this.element = findDOMNode(this));
          };

          return Styler;
        }(Component$1$1)
      );
    }

    /*
    Copyright (c) 2019 Daybrush
    name: @daybrush/drag
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/drag.git
    version: 0.9.1
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

    function getPinchDragPosition(clients, prevClients, startClients, startPinchClients) {
      var nowCenter = getAverageClient(clients);
      var prevCenter = getAverageClient(prevClients);
      var startCenter = getAverageClient(startPinchClients);
      var pinchClient = getAddClient(startPinchClients[0], getMinusClient(nowCenter, startCenter));
      var pinchPrevClient = getAddClient(startPinchClients[0], getMinusClient(prevCenter, startCenter));
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
      return {
        clientX: (clients[0].clientX + clients[1].clientX) / 2,
        clientY: (clients[0].clientY + clients[1].clientY) / 2
      };
    }
    function getAddClient(client1, client2) {
      return {
        clientX: client1.clientX + client2.clientX,
        clientY: client1.clientY + client2.clientY
      };
    }
    function getMinusClient(client1, client2) {
      return {
        clientX: client1.clientX - client2.clientX,
        clientY: client1.clientY - client2.clientY
      };
    }

    var Dragger =
    /*#__PURE__*/
    function () {
      function Dragger(el, options) {
        var _this = this;

        if (options === void 0) {
          options = {};
        }

        this.el = el;
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

        this.onDragStart = function (e) {
          if (!_this.flag && e.cancelable === false) {
            return;
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
          _this.flag = true;
          _this.isDrag = false;
          _this.startClients = clients;
          _this.prevClients = clients;
          _this.datas = {};
          _this.movement = 0;
          var position = getPosition(clients[0], _this.prevClients[0], _this.startClients[0]);
          var _a = _this.options,
              dragstart = _a.dragstart,
              preventRightClick = _a.preventRightClick;

          if (preventRightClick && e.which === 3 || (dragstart && dragstart(__assign$2({
            datas: _this.datas,
            inputEvent: e
          }, position))) === false) {
            _this.startClients = [];
            _this.prevClients = [];
            _this.flag = false;
          }

          _this.flag && e.preventDefault();
        };

        this.onDrag = function (e) {
          if (!_this.flag) {
            return;
          }

          var clients = getPositionEvent(e);

          if (_this.pinchFlag) {
            _this.onPinch(e, clients);
          }

          var prevClients = _this.prevClients;
          var startClients = _this.startClients;
          var position = _this.pinchFlag ? getPinchDragPosition(clients, prevClients, startClients, _this.startPinchClients) : getPosition(clients[0], prevClients[0], startClients[0]);
          var deltaX = position.deltaX,
              deltaY = position.deltaY;

          if (!deltaX && !deltaY) {
            return;
          }

          _this.movement += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          _this.isDrag = true;
          var drag = _this.options.drag;
          drag && drag(__assign$2({
            datas: _this.datas
          }, position, {
            inputEvent: e
          }));
          _this.prevClients = clients;
        };

        this.onDragEnd = function (e) {
          if (!_this.flag) {
            return;
          }

          if (_this.pinchFlag) {
            _this.onPinchEnd(e);
          }

          _this.flag = false;
          var dragend = _this.options.dragend;
          var prevClients = _this.prevClients;
          var startClients = _this.startClients;
          var position = _this.pinchFlag ? getPinchDragPosition(prevClients, prevClients, startClients, _this.startPinchClients) : getPosition(prevClients[0], prevClients[0], startClients[0]);
          _this.startClients = [];
          _this.prevClients = [];
          dragend && dragend(__assign$2({
            datas: _this.datas,
            isDrag: _this.isDrag,
            inputEvent: e
          }, position));
        };

        this.options = __assign$2({
          container: el,
          preventRightClick: true,
          pinchThreshold: 0,
          events: ["touch", "mouse"]
        }, options);
        var _a = this.options,
            container = _a.container,
            events = _a.events;
        this.isTouch = events.indexOf("touch") > -1;
        this.isMouse = events.indexOf("mouse") > -1;

        if (this.isMouse) {
          addEvent(el, "mousedown", this.onDragStart);
          addEvent(container, "mousemove", this.onDrag);
          addEvent(container, "mouseup", this.onDragEnd);
        }

        if (this.isTouch) {
          addEvent(el, "touchstart", this.onDragStart);
          addEvent(container, "touchmove", this.onDrag);
          addEvent(container, "touchend", this.onDragEnd);
        }
      }

      var __proto = Dragger.prototype;

      __proto.isDragging = function () {
        return this.isDrag;
      };

      __proto.isPinching = function () {
        return this.isPinch;
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
        pinchstart(__assign$2({
          datas: this.datas,
          touches: getPositions(startClients, startClients, startClients)
        }, centerPosition, {
          inputEvent: e
        }));
      };

      __proto.onPinch = function (e, clients) {
        if (!this.flag || !this.pinchFlag) {
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
        pinch(__assign$2({
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
        pinchend(__assign$2({
          datas: this.datas,
          isPinch: isPinch,
          touches: getPositions(prevClients, prevClients, startClients)
        }, centerPosition, {
          inputEvent: e
        }));
        this.isPinch = false;
        this.pinchFlag = false;
      };

      __proto.unset = function () {
        var el = this.el;
        var container = this.options.container;

        if (this.isMouse) {
          removeEvent(el, "mousedown", this.onDragStart);
          removeEvent(container, "mousemove", this.onDrag);
          removeEvent(container, "mouseup", this.onDragEnd);
        }

        if (this.isTouch) {
          removeEvent(el, "touchstart", this.onDragStart);
          removeEvent(container, "touchmove", this.onDrag);
          removeEvent(container, "touchend", this.onDragEnd);
        }
      };

      return Dragger;
    }();

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

    function diff$1(prevList, list, findKeyCallback) {
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
        var result = diff$1(this.list, newData, this.findKeyCallback);
        this.list = newData;
        return result;
      };

      return ListDiffer;
    }();

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

    function __extends$3(d, b) {
      extendStatics$2(d, b);

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
      __extends$3(ChildrenDiffer, _super);
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
    name: preact-moveable
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/moveable/blob/master/packages/preact-moveable
    version: 0.10.1
    */

    /*
    Copyright (c) 2019 Daybrush
    name: react-moveable
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/moveable/blob/master/packages/react-moveable
    version: 0.11.0
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

    function __extends$4(d, b) {
      extendStatics$3(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
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
    window.b = convertDimension;
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
    function sum(pos1, pos2) {
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
    function getRotateMatrix(rad) {
      var cos = Math.cos(rad);
      var sin = Math.sin(rad);
      return [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
    }
    function rotate(pos, deg) {
      return caculate(getRotateMatrix(deg * Math.PI / 180), convertPositionMatrix(pos, 3));
    }
    function warp(pos0, pos1, pos2, pos3, nextPos0, nextPos1, nextPos2, nextPos3) {
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
        var viewBox = el.ownerSVGElement.viewBox.baseVal;
        return viewBox[isHorizontal ? "width" : "height"] / 100;
      }

      return 1;
    }
    function getBeforeTransformOrigin(el) {
      var relativeOrigin = getTransformOrigin(window.getComputedStyle(el, ":before"));
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
    function caculateMatrixStack(target, container, prevMatrix, prevN) {
      var _a;

      var el = target;
      var matrixes = [];
      var isContainer = !!prevMatrix || target === container;
      var isSVGGraphicElement = el.tagName.toLowerCase() !== "svg" || "ownerSVGElement" in el;
      var is3d = false;
      var n = 3;
      var transformOrigin;
      var targetMatrix;

      while (el && (isContainer || el !== container)) {
        var tagName = el.tagName.toLowerCase();
        var style = window.getComputedStyle(el);
        var matrix = convertCSStoMatrix(getTransformMatrix(style.transform));

        if (!is3d && matrix.length === 16) {
          is3d = true;
          n = 4;
          var matrixesLength = matrixes.length;

          for (var i = 0; i < matrixesLength; ++i) {
            matrixes[i] = convertDimension(matrixes[i], 3, 4);
          }
        }

        if (is3d && matrix.length === 9) {
          matrix = convertDimension(matrix, 3, 4);
        }

        var offsetLeft = el.offsetLeft;
        var offsetTop = el.offsetTop; // svg

        var isSVG = isUndefined$1(offsetLeft);
        var hasNotOffset = isSVG;
        var origin = void 0; // inner svg element

        if (hasNotOffset && tagName !== "svg") {
          origin = isNotSupportTransformOrigin ? getBeforeTransformOrigin(el) : getTransformOrigin(style).map(function (pos) {
            return parseFloat(pos);
          });
          hasNotOffset = false;

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

        if (tagName === "svg" && targetMatrix) {
          matrixes.push(getSVGMatrix(el, n), createIdentityMatrix(n));
        }

        matrixes.push(getAbsoluteMatrix(matrix, n, origin), createOriginMatrix([hasNotOffset ? el : offsetLeft, hasNotOffset ? origin : offsetTop], n));

        if (!targetMatrix) {
          targetMatrix = matrix;
        }

        if (!transformOrigin) {
          transformOrigin = origin;
        }

        if (isContainer) {
          break;
        }

        if (isSVG) {
          el = el.parentElement;
          continue;
        }

        var offsetParent = el.offsetParent;

        if (!offsetParent) {
          break;
        }

        while (el && el !== container && el !== offsetParent) {
          el = el.parentElement;
        }
      }

      var mat = prevMatrix ? convertDimension(prevMatrix, prevN, n) : createIdentityMatrix(n);
      var beforeMatrix = prevMatrix ? convertDimension(prevMatrix, prevN, n) : createIdentityMatrix(n);
      var offsetMatrix = createIdentityMatrix(n);
      var length = matrixes.length;
      matrixes.reverse();
      matrixes.forEach(function (matrix, i) {
        var _a;

        if (length - 2 === i) {
          beforeMatrix = mat.slice();
        }

        if (length - 1 === i) {
          offsetMatrix = mat.slice();
        }

        if (isObject(matrix[n - 1])) {
          _a = getSVGOffset(matrix[n - 1], container, n, matrix[2 * n - 1], mat, matrixes[i + 1]), matrix[n - 1] = _a[0], matrix[2 * n - 1] = _a[1];
        }

        mat = multiply(mat, matrix, n);
      });
      var isMatrix3d = !isSVGGraphicElement && is3d;
      var transform = (isMatrix3d ? "matrix3d" : "matrix") + "(" + convertMatrixtoCSS(isSVGGraphicElement && targetMatrix.length === 16 ? convertDimension(targetMatrix, 4, 3) : targetMatrix) + ")";
      return [beforeMatrix, offsetMatrix, mat, targetMatrix, transform, transformOrigin, is3d];
    }
    function getSVGMatrix(el, n) {
      var clientWidth = el.clientWidth;
      var clientHeight = el.clientHeight;
      var viewBox = el.viewBox.baseVal;
      var viewBoxWidth = viewBox.width || clientWidth;
      var viewBoxHeight = viewBox.height || clientHeight;
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
      var svgElement = el.ownerSVGElement;
      var viewBox = svgElement.viewBox.baseVal;
      var left = bbox.x - viewBox.x;
      var top = bbox.y - viewBox.y;
      return [left, top, origin[0] - left, origin[1] - top];
    }
    function caculatePosition(matrix, pos, n) {
      return caculate(matrix, convertPositionMatrix(pos, n), n);
    }
    function caculateRect(matrix, width, height, n) {
      var pos1 = caculatePosition(matrix, [0, 0], n);
      var pos2 = caculatePosition(matrix, [width, 0], n);
      var pos3 = caculatePosition(matrix, [0, height], n);
      var pos4 = caculatePosition(matrix, [width, height], n);
      return [pos1, pos2, pos3, pos4];
    }
    function getSVGOffset(el, container, n, origin, beforeMatrix, absoluteMatrix) {
      var _a;

      var _b = getSize(el),
          width = _b[0],
          height = _b[1];

      var containerRect = (container || document.documentElement).getBoundingClientRect();
      var rect = el.getBoundingClientRect();
      var rectLeft = rect.left - containerRect.left;
      var rectTop = rect.top - containerRect.top;
      var rectWidth = rect.width;
      var rectHeight = rect.height;
      var mat = multiplies(n, beforeMatrix, absoluteMatrix);
      var poses = caculateRect(mat, width, height, n);
      var posesX = poses.map(function (pos) {
        return pos[0];
      });
      var posesY = poses.map(function (pos) {
        return pos[1];
      });
      var posOrigin = caculatePosition(mat, origin, n);
      var prevLeft = Math.min.apply(Math, posesX);
      var prevTop = Math.min.apply(Math, posesY);
      var prevOrigin = minus(posOrigin, [prevLeft, prevTop]);
      var prevWidth = Math.max.apply(Math, posesX) - prevLeft;
      var prevHeight = Math.max.apply(Math, posesY) - prevTop;
      var rectOrigin = [rectLeft + prevOrigin[0] * rectWidth / prevWidth, rectTop + prevOrigin[1] * rectHeight / prevHeight];
      var offset = [0, 0];
      var count = 0;

      while (++count < 10) {
        var inverseBeforeMatrix = invert(beforeMatrix, n);
        _a = minus(caculatePosition(inverseBeforeMatrix, rectOrigin, n), caculatePosition(inverseBeforeMatrix, posOrigin, n)), offset[0] = _a[0], offset[1] = _a[1];
        var mat2 = multiplies(n, beforeMatrix, createOriginMatrix(offset, n), absoluteMatrix);
        var nextPoses = caculateRect(mat2, width, height, n);
        var nextLeft = Math.min.apply(Math, nextPoses.map(function (pos) {
          return pos[0];
        }));
        var nextTop = Math.min.apply(Math, nextPoses.map(function (pos) {
          return pos[1];
        }));
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

      var _a = caculateRect(matrix, width, height, n),
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
      var center = [(x1 + x2 + x3 + x4) / 4, (y1 + y2 + y3 + y4) / 4];
      var pos1Rad = getRad(center, [x1, y1]);
      var pos2Rad = getRad(center, [x2, y2]);
      var direction = pos1Rad < pos2Rad && pos2Rad - pos1Rad < Math.PI || pos1Rad > pos2Rad && pos2Rad - pos1Rad < -Math.PI ? 1 : -1;
      return [[minX, minY], [originX, originY], [x1, y1], [x2, y2], [x3, y3], [x4, y4], direction];
    }
    function getRad(pos1, pos2) {
      var distX = pos2[0] - pos1[0];
      var distY = pos2[1] - pos1[1];
      var rad = Math.atan2(distY, distX);
      return rad > 0 ? rad : rad + Math.PI * 2;
    }
    function getLineStyle(pos1, pos2) {
      var distX = pos2[0] - pos1[0];
      var distY = pos2[1] - pos1[1];
      var width = Math.sqrt(distX * distX + distY * distY);
      var rad = getRad(pos1, pos2);
      return {
        transform: "translate(" + pos1[0] + "px, " + pos1[1] + "px) rotate(" + rad + "rad)",
        width: width + "px"
      };
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
    function getRotationInfo(pos1, pos2, direction) {
      var rotationRad = getRad(direction > 0 ? pos1 : pos2, direction > 0 ? pos2 : pos1);
      var relativeRotationPos = multiply(getRotateMatrix(rotationRad), [0, -40, 1], 3);
      var rotationPos = [(pos1[0] + pos2[0]) / 2 + relativeRotationPos[0], (pos1[1] + pos2[1]) / 2 + relativeRotationPos[1]];
      return [rotationRad, rotationPos];
    }
    function getTargetInfo(target, container, state) {
      var _a, _b, _c, _d, _e, _f;

      var left = 0;
      var top = 0;
      var origin = [0, 0];
      var pos1 = [0, 0];
      var pos2 = [0, 0];
      var pos3 = [0, 0];
      var pos4 = [0, 0];
      var beforeMatrix = createIdentityMatrix3();
      var matrix = createIdentityMatrix3();
      var targetMatrix = createIdentityMatrix3();
      var width = 0;
      var height = 0;
      var transformOrigin = [0, 0];
      var direction = 1;
      var beforeDirection = 1;
      var rotationPos = [0, 0];
      var rotationRad = 0;
      var is3d = false;
      var targetTransform = "";
      var beforeOrigin = [0, 0];
      var prevMatrix = state ? state.beforeMatrix : undefined;
      var prevN = state ? state.is3d ? 4 : 3 : undefined;

      if (target) {
        if (state) {
          width = state.width;
          height = state.height;
        } else {
          var style = window.getComputedStyle(target);
          width = target.offsetWidth;
          height = target.offsetHeight;

          if (isUndefined$1(width)) {
            _a = getSize(target, style, true), width = _a[0], height = _a[1];
          }
        }

        var offsetMatrix = void 0;
        _b = caculateMatrixStack(target, container, prevMatrix, prevN), beforeMatrix = _b[0], offsetMatrix = _b[1], matrix = _b[2], targetMatrix = _b[3], targetTransform = _b[4], transformOrigin = _b[5], is3d = _b[6];
        _c = caculateMoveablePosition(matrix, transformOrigin, width, height), _d = _c[0], left = _d[0], top = _d[1], origin = _c[1], pos1 = _c[2], pos2 = _c[3], pos3 = _c[4], pos4 = _c[5], direction = _c[6];
        var n = is3d ? 4 : 3;
        var beforePos = [0, 0];
        _e = caculateMoveablePosition(offsetMatrix, sum(transformOrigin, getOrigin(targetMatrix, n)), width, height), beforePos = _e[0], beforeOrigin = _e[1], beforeDirection = _e[6];
        beforeOrigin = [beforeOrigin[0] + beforePos[0] - left, beforeOrigin[1] + beforePos[1] - top]; // 1 : clockwise
        // -1 : counterclockwise

        _f = getRotationInfo(pos1, pos2, direction), rotationRad = _f[0], rotationPos = _f[1];
      }

      return {
        beforeDirection: beforeDirection,
        direction: direction,
        rotationRad: rotationRad,
        rotationPos: rotationPos,
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
        targetTransform: targetTransform,
        targetMatrix: targetMatrix,
        is3d: is3d,
        beforeOrigin: beforeOrigin,
        origin: origin,
        transformOrigin: transformOrigin
      };
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
      var k2 = getOrientationDirection(pos, pos2, pos4);
      var k3 = getOrientationDirection(pos, pos4, pos1);
      var k4 = getOrientationDirection(pos, pos2, pos4);
      var k5 = getOrientationDirection(pos, pos4, pos3);
      var k6 = getOrientationDirection(pos, pos3, pos2);
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
    function triggerEvent(moveable, name, e) {
      return moveable.triggerEvent(name, e);
    }

    function getRotatiion(touches) {
      return getRad([touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]) / Math.PI * 180;
    }

    var Pinchable = {
      name: "pinchable",
      updateRect: true,
      pinchStart: function (moveable, _a) {
        var _b;

        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            touches = _a.touches,
            inputEvent = _a.inputEvent,
            targets = _a.targets;
        var _c = moveable.props,
            pinchable = _c.pinchable,
            ables = _c.ables;

        if (!pinchable) {
          return false;
        }

        var state = moveable.state;
        var eventName = "onPinch" + (targets ? "Group" : "") + "Start";
        var controlEventName = "drag" + (targets ? "Group" : "") + "ControlStart";
        var pinchAbles = (pinchable === true ? moveable.controlAbles : ables.filter(function (able) {
          return pinchable.indexOf(able.name) > -1;
        })).filter(function (able) {
          return able.canPinch && able[controlEventName];
        });
        datas.pinchableDatas = {};
        var result = triggerEvent(moveable, eventName, (_b = {}, _b[targets ? "targets" : "target"] = targets ? targets : state.target, _b.clientX = clientX, _b.clientY = clientY, _b.datas = datas.pinchableDatas, _b));
        datas.isPinch = result !== false;
        datas.ables = pinchAbles;
        var isPinch = datas.isPinch;

        if (!isPinch) {
          return false;
        }

        var parentRotate = getRotatiion(touches);
        pinchAbles.forEach(function (able) {
          datas[able.name + "Datas"] = {};
          var e = {
            datas: datas[able.name + "Datas"],
            clientX: clientX,
            clientY: clientY,
            inputEvent: inputEvent,
            parentRotate: parentRotate,
            pinchFlag: true
          };
          able[controlEventName](moveable, e);
        });
        return isPinch;
      },
      pinch: function (moveable, _a) {
        var _b;

        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            pinchScale = _a.scale,
            distance = _a.distance,
            touches = _a.touches,
            inputEvent = _a.inputEvent,
            targets = _a.targets;

        if (!datas.isPinch) {
          return;
        }

        var parentRotate = getRotatiion(touches);
        var parentDistance = distance * (1 - 1 / pinchScale);
        var target = moveable.state.target;
        var params = (_b = {}, _b[targets ? "targets" : "target"] = targets ? targets : target, _b.clientX = clientX, _b.clientY = clientY, _b.datas = datas.pinchableDatas, _b);
        var eventName = "onPinch" + (targets ? "Group" : "");
        triggerEvent(moveable, eventName, params);
        var ables = datas.ables;
        var controlEventName = "drag" + (targets ? "Group" : "") + "Control";
        ables.forEach(function (able) {
          able[controlEventName](moveable, {
            clientX: clientX,
            clientY: clientY,
            datas: datas[able.name + "Datas"],
            inputEvent: inputEvent,
            parentDistance: parentDistance,
            parentRotate: parentRotate,
            pinchFlag: true
          });
        });
        return params;
      },
      pinchEnd: function (moveable, _a) {
        var _b;

        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            isPinch = _a.isPinch,
            inputEvent = _a.inputEvent,
            targets = _a.targets;

        if (!datas.isPinch) {
          return;
        }

        var target = moveable.state.target;
        var eventName = "onPinch" + (targets ? "Group" : "") + "End";
        triggerEvent(moveable, eventName, (_b = {}, _b[targets ? "targets" : "target"] = targets ? targets : target, _b.isDrag = isPinch, _b.clientX = clientX, _b.clientY = clientY, _b.datas = datas.pinchableDatas, _b));
        var ables = datas.ables;
        var controlEventName = "drag" + (targets ? "Group" : "") + "ControlEnd";
        ables.forEach(function (able) {
          able[controlEventName](moveable, {
            clientX: clientX,
            clientY: clientY,
            isDrag: isPinch,
            datas: datas[able.name + "Datas"],
            inputEvent: inputEvent,
            pinchFlag: true
          });
        });
        return isPinch;
      },
      pinchGroupStart: function (moveable, e) {
        return this.pinchStart(moveable, __assign$3({}, e, {
          targets: moveable.props.targets
        }));
      },
      pinchGroup: function (moveable, e) {
        return this.pinch(moveable, __assign$3({}, e, {
          targets: moveable.props.targets
        }));
      },
      pinchGroupEnd: function (moveable, e) {
        return this.pinchEnd(moveable, __assign$3({}, e, {
          targets: moveable.props.targets
        }));
      }
    };

    function setDragStart(moveable, _a) {
      var datas = _a.datas;
      var _b = moveable.state,
          matrix = _b.matrix,
          beforeMatrix = _b.beforeMatrix,
          is3d = _b.is3d,
          left = _b.left,
          top = _b.top,
          origin = _b.origin;
      var n = is3d ? 4 : 3;
      datas.is3d = is3d;
      datas.matrix = matrix;
      datas.inverseMatrix = invert(matrix, n);
      datas.beforeMatrix = beforeMatrix;
      datas.inverseBeforeMatrix = invert(beforeMatrix, n);
      datas.absoluteOrigin = convertPositionMatrix(sum([left, top], origin), n);
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
      return minus(caculate(isBefore ? inverseBeforeMatrix : inverseMatrix, sum(absoluteOrigin, [distX, distY]), n), isBefore ? startDragBeforeDist : startDragDist);
    }

    function triggerChildAble(moveable, able, type, e, callback) {
      var name = able.name;
      var datas = e.datas;
      var ableDatas = datas[name] || (datas[name] = []);
      return moveable.moveables.map(function (child, i) {
        var childDatas = ableDatas[i] || (ableDatas[i] = {});
        var result = able[type](child, __assign$3({}, e, {
          datas: childDatas,
          parentFlag: true
        }));
        result && callback && callback(child, childDatas, result, i);
        return result;
      });
    }
    function getCustomEvent(datas) {
      return datas.custom;
    }
    function setCustomEvent(clientX, clientY, datas, inputEvent) {
      var e = datas.custom || (datas.custom = {
        startX: clientX,
        startY: clientY,
        prevX: clientX,
        prevY: clientY,
        isDrag: false
      });
      var prevX = e.prevX,
          prevY = e.prevY,
          startX = e.startX,
          startY = e.startY;
      e.prevX = clientX;
      e.prevY = clientY;

      if (clientX !== prevX || clientY !== prevY) {
        e.isDrag = true;
      }

      return {
        clientX: clientX,
        clientY: clientY,
        distX: clientX - startX,
        distY: clientY - startY,
        deltaX: clientX - prevX,
        deltaY: clientY - prevY,
        isDrag: e.isDrag,
        datas: datas,
        inputEvent: inputEvent
      };
    }
    function directionCondition(target) {
      return hasClass(target, prefix("direction"));
    }

    var Draggable = {
      name: "draggable",
      dragStart: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY;
        var _b = moveable.state,
            targetTransform = _b.targetTransform,
            target = _b.target;
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
        var params = {
          datas: datas.datas,
          target: target,
          clientX: clientX,
          clientY: clientY,
          set: function (translate) {
            datas.startTranslate = translate;
          }
        };
        var result = triggerEvent(moveable, "onDragStart", params);

        if (result !== false) {
          datas.isDrag = true;
        } else {
          datas.isPinch = false;
        }

        return datas.isDrag ? params : false;
      },
      drag: function (moveable, _a) {
        var datas = _a.datas,
            distX = _a.distX,
            distY = _a.distY,
            clientX = _a.clientX,
            clientY = _a.clientY;
        var isPinch = datas.isPinch,
            isDrag = datas.isDrag,
            prevDist = datas.prevDist,
            prevBeforeDist = datas.prevBeforeDist,
            transform = datas.transform,
            startTranslate = datas.startTranslate;

        if (!isDrag) {
          return;
        }

        var _b = moveable.props,
            _c = _b.throttleDrag,
            throttleDrag = _c === void 0 ? 0 : _c,
            parentMoveable = _b.parentMoveable;
        var target = moveable.state.target;
        var beforeTranslate = sum(getDragDist({
          datas: datas,
          distX: distX,
          distY: distY
        }, true), startTranslate);
        var translate = sum(getDragDist({
          datas: datas,
          distX: distX,
          distY: distY
        }, false), startTranslate);
        throttleArray(translate, throttleDrag);
        throttleArray(beforeTranslate, throttleDrag);
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

        if (!parentMoveable && delta.every(function (num) {
          return !num;
        }) && beforeDelta.some(function (num) {
          return !num;
        })) {
          return;
        }

        var params = {
          datas: datas.datas,
          target: target,
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
          clientX: clientX,
          clientY: clientY,
          isPinch: isPinch
        };
        triggerEvent(moveable, "onDrag", params);
        return params;
      },
      dragEnd: function (moveable, _a) {
        var datas = _a.datas,
            isDrag = _a.isDrag,
            clientX = _a.clientX,
            clientY = _a.clientY;

        if (!datas.isDrag) {
          return;
        }

        datas.isDrag = false;
        triggerEvent(moveable, "onDragEnd", {
          target: moveable.state.target,
          isDrag: isDrag,
          clientX: clientX,
          clientY: clientY,
          datas: datas.datas
        });
        return isDrag;
      },
      dragGroupCondition: function (target) {
        return hasClass(target, prefix("group"));
      },
      dragGroupStart: function (moveable, e) {
        var datas = e.datas;
        var params = this.dragStart(moveable, e);

        if (!params) {
          return false;
        }

        var events = triggerChildAble(moveable, this, "dragStart", e);

        var nextParams = __assign$3({}, params, {
          targets: moveable.props.targets,
          events: events
        });

        var result = triggerEvent(moveable, "onDragGroupStart", nextParams);
        datas.isDrag = result !== false;
        return datas.isDrag ? params : false;
      },
      dragGroup: function (moveable, e) {
        if (!e.datas.isDrag) {
          return;
        }

        var events = triggerChildAble(moveable, this, "drag", e);
        var params = this.drag(moveable, e);

        if (!params) {
          return;
        }

        var nextParams = __assign$3({
          targets: moveable.props.targets,
          events: events
        }, params);

        triggerEvent(moveable, "onDragGroup", nextParams);
        return nextParams;
      },
      dragGroupEnd: function (moveable, e) {
        var clientX = e.clientX,
            clientY = e.clientY,
            isDrag = e.isDrag,
            datas = e.datas;

        if (!datas.isDrag) {
          return;
        }

        triggerChildAble(moveable, this, "dragEnd", e);
        triggerEvent(moveable, "onDragGroupEnd", {
          targets: moveable.props.targets,
          isDrag: isDrag,
          clientX: clientX,
          clientY: clientY,
          datas: datas.datas
        });
        return isDrag;
      }
    };

    function setRotateStartInfo(datas, clientX, clientY, origin, rotationPos) {
      datas.startAbsoluteOrigin = [clientX - rotationPos[0] + origin[0], clientY - rotationPos[1] + origin[1]];
      datas.prevDeg = getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180;
      datas.startDeg = datas.prevDeg;
      datas.loop = 0;
    }

    function getDeg(datas, deg, direction, startRotate, throttleRotate) {
      var prevDeg = datas.prevDeg,
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
      var absolutePrevDeg = prevLoop * 360 + prevDeg - startDeg + startRotate;
      var absoluteDeg = loop * 360 + deg - startDeg + startRotate;
      absoluteDeg = throttle(absoluteDeg, throttleRotate);
      var delta = direction * (absoluteDeg - absolutePrevDeg);
      var dist = direction * (absoluteDeg - startRotate);
      datas.prevDeg = absoluteDeg - loop * 360 + startDeg - startRotate;
      return [delta, dist, absoluteDeg];
    }

    function getRotateInfo(datas, direction, clientX, clientY, startRotate, throttleRotate) {
      return getDeg(datas, getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180, direction, startRotate, throttleRotate);
    }

    function dragControlCondition(target) {
      return hasClass(target, prefix("rotation"));
    }

    var Rotatable = {
      name: "rotatable",
      canPinch: true,
      render: function (moveable, React) {
        if (!moveable.props.rotatable) {
          return null;
        }

        var _a = moveable.state,
            pos1 = _a.pos1,
            pos2 = _a.pos2,
            rotationRad = _a.rotationRad;
        return React.createElement("div", {
          className: prefix("line rotation-line"),
          style: {
            // tslint:disable-next-line: max-line-length
            transform: "translate(" + (pos1[0] + pos2[0]) / 2 + "px, " + (pos1[1] + pos2[1]) / 2 + "px) translateY(-40px) rotate(" + rotationRad + "rad)"
          }
        }, React.createElement("div", {
          className: prefix("control", "rotation")
        }));
      },
      dragControlCondition: dragControlCondition,
      dragControlStart: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            parentRotate = _a.parentRotate,
            parentFlag = _a.parentFlag,
            pinchFlag = _a.pinchFlag;
        var _b = moveable.state,
            target = _b.target,
            left = _b.left,
            top = _b.top,
            origin = _b.origin,
            beforeOrigin = _b.beforeOrigin,
            rotationPos = _b.rotationPos,
            direction = _b.direction,
            beforeDirection = _b.beforeDirection,
            targetTransform = _b.targetTransform;

        if (!target) {
          return false;
        }

        datas.transform = targetTransform;
        datas.left = left;
        datas.top = top;

        if (pinchFlag || parentFlag) {
          datas.beforeInfo = {
            prevDeg: parentRotate,
            startDeg: parentRotate,
            loop: 0
          };
          datas.afterInfo = {
            prevDeg: parentRotate,
            startDeg: parentRotate,
            loop: 0
          };
        } else {
          datas.afterInfo = {};
          datas.beforeInfo = {};
          setRotateStartInfo(datas.afterInfo, clientX, clientY, origin, rotationPos);
          setRotateStartInfo(datas.beforeInfo, clientX, clientY, beforeOrigin, rotationPos);
        }

        datas.direction = direction;
        datas.beforeDirection = beforeDirection;
        datas.startRotate = 0;
        datas.datas = {};
        var params = {
          datas: datas.datas,
          target: target,
          clientX: clientX,
          clientY: clientY,
          set: function (rotatation) {
            datas.startRotate = rotatation;
          }
        };
        var result = triggerEvent(moveable, "onRotateStart", params);
        datas.isRotate = result !== false;
        return datas.isRotate ? params : false;
      },
      dragControl: function (moveable, _a) {
        var _b, _c, _d, _e;

        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            parentRotate = _a.parentRotate,
            parentFlag = _a.parentFlag,
            pinchFlag = _a.pinchFlag;
        var direction = datas.direction,
            beforeDirection = datas.beforeDirection,
            beforeInfo = datas.beforeInfo,
            afterInfo = datas.afterInfo,
            isRotate = datas.isRotate,
            startRotate = datas.startRotate;

        if (!isRotate) {
          return;
        }

        var _f = moveable.props,
            _g = _f.throttleRotate,
            throttleRotate = _g === void 0 ? 0 : _g,
            parentMoveable = _f.parentMoveable;
        var delta;
        var dist;
        var rotate;
        var beforeDelta;
        var beforeDist;
        var beforeRotate;

        if (pinchFlag || parentFlag) {
          _b = getDeg(afterInfo, parentRotate, direction, startRotate, throttleRotate), delta = _b[0], dist = _b[1], rotate = _b[2];
          _c = getDeg(beforeInfo, parentRotate, direction, startRotate, throttleRotate), beforeDelta = _c[0], beforeDist = _c[1], beforeRotate = _c[2];
        } else {
          _d = getRotateInfo(afterInfo, direction, clientX, clientY, startRotate, throttleRotate), delta = _d[0], dist = _d[1], rotate = _d[2];
          _e = getRotateInfo(beforeInfo, beforeDirection, clientX, clientY, startRotate, throttleRotate), beforeDelta = _e[0], beforeDist = _e[1], beforeRotate = _e[2];
        }

        if (!delta && !beforeDelta && !parentMoveable) {
          return;
        }

        var params = {
          target: moveable.props.target,
          datas: datas.datas,
          clientX: clientX,
          clientY: clientY,
          delta: delta,
          dist: dist,
          rotate: rotate,
          beforeDist: beforeDist,
          beforeDelta: beforeDelta,
          beforeRotate: beforeRotate,
          transform: datas.transform + " rotate(" + dist + "deg)",
          isPinch: !!pinchFlag
        };
        triggerEvent(moveable, "onRotate", params);
        return params;
      },
      dragControlEnd: function (moveable, _a) {
        var datas = _a.datas,
            isDrag = _a.isDrag,
            clientX = _a.clientX,
            clientY = _a.clientY;

        if (!datas.isRotate) {
          return false;
        }

        datas.isRotate = false;
        triggerEvent(moveable, "onRotateEnd", {
          datas: datas.datas,
          clientX: clientX,
          clientY: clientY,
          target: moveable.state.target,
          isDrag: isDrag
        });
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

        var events = triggerChildAble(moveable, this, "dragControlStart", __assign$3({}, e, {
          parentRotate: 0
        }), function (child, childDatas, eventParams) {
          var _a = child.state,
              left = _a.left,
              top = _a.top,
              beforeOrigin = _a.beforeOrigin;
          var childClient = sum(minus([left, top], [parentLeft, parentTop]), minus(beforeOrigin, parentBeforeOrigin));
          var dragDatas = childDatas.drag || (childDatas.drag = {});
          eventParams.dragStart = Draggable.dragStart(child, setCustomEvent(childClient[0], childClient[1], dragDatas, inputEvent));
        });

        var nextParams = __assign$3({}, params, {
          targets: moveable.props.targets,
          events: events
        });

        var result = triggerEvent(moveable, "onRotateGroupStart", nextParams);
        datas.isRotate = result !== false;
        return datas.isDrag ? params : false;
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
        var events = triggerChildAble(moveable, this, "dragControl", __assign$3({}, e, {
          parentRotate: parentRotate
        }), function (child, childDatas, result, i) {
          var dragDatas = childDatas.drag || (childDatas.drag = {});

          var _a = getCustomEvent(dragDatas),
              prevX = _a.prevX,
              prevY = _a.prevY;

          var _b = rotate([prevX, prevY], deg),
              clientX = _b[0],
              clientY = _b[1];

          var dragResult = Draggable.drag(child, setCustomEvent(clientX, clientY, dragDatas, inputEvent));
          result.drag = dragResult;
        });

        var nextParams = __assign$3({
          targets: moveable.props.targets,
          events: events
        }, params);

        moveable.rotation += params.beforeDelta;
        triggerEvent(moveable, "onRotateGroup", nextParams);
        return nextParams;
      },
      dragGroupControlEnd: function (moveable, e) {
        var clientX = e.clientX,
            clientY = e.clientY,
            isDrag = e.isDrag,
            datas = e.datas;

        if (!datas.isRotate) {
          return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", e);
        var nextParams = {
          targets: moveable.props.targets,
          clientX: clientX,
          clientY: clientY,
          isDrag: isDrag,
          datas: datas.datas
        };
        triggerEvent(moveable, "onRotateGroupEnd", nextParams);
        return isDrag;
      }
    };

    function renderAllDirection(moveable, React) {
      return renderDiagonalDirection(moveable, React).concat(renderDirection(moveable, React));
    }
    function renderDiagonalDirection(moveable, React) {
      var _a = moveable.props,
          resizable = _a.resizable,
          scalable = _a.scalable,
          warpable = _a.warpable;

      if (!resizable && !scalable && !warpable) {
        return [];
      }

      var _b = moveable.state,
          pos1 = _b.pos1,
          pos2 = _b.pos2,
          pos3 = _b.pos3,
          pos4 = _b.pos4;
      return [React.createElement("div", {
        className: prefix("control", "direction", "nw"),
        "data-direction": "nw",
        key: "nw",
        style: getControlTransform(pos1)
      }), React.createElement("div", {
        className: prefix("control", "direction", "ne"),
        "data-direction": "ne",
        key: "ne",
        style: getControlTransform(pos2)
      }), React.createElement("div", {
        className: prefix("control", "direction", "sw"),
        "data-direction": "sw",
        key: "sw",
        style: getControlTransform(pos3)
      }), React.createElement("div", {
        className: prefix("control", "direction", "se"),
        "data-direction": "se",
        key: "se",
        style: getControlTransform(pos4)
      })];
    }
    function renderDirection(moveable, React) {
      var _a = moveable.props,
          resizable = _a.resizable,
          scalable = _a.scalable;

      if (!resizable && !scalable) {
        return [];
      }

      var _b = moveable.state,
          pos1 = _b.pos1,
          pos2 = _b.pos2,
          pos3 = _b.pos3,
          pos4 = _b.pos4;
      return [React.createElement("div", {
        className: prefix("control", "direction", "n"),
        "data-direction": "n",
        key: "n",
        style: getControlTransform(pos1, pos2)
      }), React.createElement("div", {
        className: prefix("control", "direction", "w"),
        "data-direction": "w",
        key: "w",
        style: getControlTransform(pos1, pos3)
      }), React.createElement("div", {
        className: prefix("control", "direction", "e"),
        "data-direction": "e",
        key: "e",
        style: getControlTransform(pos2, pos4)
      }), React.createElement("div", {
        className: prefix("control", "direction", "s"),
        "data-direction": "s",
        key: "s",
        style: getControlTransform(pos3, pos4)
      })];
    }

    var Resizable = {
      name: "resizable",
      dragControlOnly: true,
      updateRect: true,
      canPinch: true,
      render: function (moveable, React) {
        var _a = moveable.props,
            resizable = _a.resizable,
            edge = _a.edge;

        if (resizable) {
          if (edge) {
            return renderDiagonalDirection(moveable, React);
          }

          return renderAllDirection(moveable, React);
        }
      },
      dragControlCondition: directionCondition,
      dragControlStart: function (moveable, e) {
        var inputTarget = e.inputEvent.target,
            pinchFlag = e.pinchFlag;
        var direction = pinchFlag ? [1, 1] : getDirection(inputTarget);
        var _a = moveable.state,
            target = _a.target,
            width = _a.width,
            height = _a.height;
        var clientX = e.clientX,
            clientY = e.clientY,
            datas = e.datas;

        if (!direction || !target) {
          return false;
        }

        !pinchFlag && setDragStart(moveable, {
          datas: datas
        });
        datas.datas = {};
        datas.direction = direction;
        datas.width = width;
        datas.height = height;
        datas.prevWidth = 0;
        datas.prevHeight = 0;
        var params = {
          datas: datas.datas,
          target: target,
          clientX: clientX,
          clientY: clientY
        };
        var result = triggerEvent(moveable, "onResizeStart", params);

        if (result !== false) {
          datas.isResize = true;
        }

        return datas.isResize ? params : false;
      },
      dragControl: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            distX = _a.distX,
            distY = _a.distY,
            pinchFlag = _a.pinchFlag,
            parentDistance = _a.parentDistance,
            parentScale = _a.parentScale;
        var direction = datas.direction,
            width = datas.width,
            height = datas.height,
            prevWidth = datas.prevWidth,
            prevHeight = datas.prevHeight,
            isResize = datas.isResize;

        if (!isResize) {
          return;
        }

        var _b = moveable.props,
            keepRatio = _b.keepRatio,
            _c = _b.throttleResize,
            throttleResize = _c === void 0 ? 0 : _c,
            parentMoveable = _b.parentMoveable;
        var target = moveable.state.target;
        var distWidth = 0;
        var distHeight = 0; // diagonal

        if (parentScale) {
          distWidth = (parentScale - 1) * width;
          distHeight = (parentScale - 1) * height;
        } else if (pinchFlag) {
          if (parentDistance) {
            distWidth = parentDistance;
            distHeight = parentDistance * height / width;
          }
        } else {
          var dist = getDragDist({
            datas: datas,
            distX: distX,
            distY: distY
          });
          distWidth = direction[0] * dist[0];
          distHeight = direction[1] * dist[1];

          if (keepRatio && direction[0] && direction[1] && width && height) {
            var size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
            var rad = getRad([0, 0], dist);
            var standardRad = getRad([0, 0], direction);
            var distDiagonal = Math.cos(rad - standardRad) * size;
            distWidth = distDiagonal;
            distHeight = distDiagonal * height / width;
          }
        }

        distWidth = throttle(distWidth, throttleResize);
        distHeight = throttle(distHeight, throttleResize);
        var nextWidth = width + distWidth;
        var nextHeight = height + distHeight;
        var delta = [distWidth - prevWidth, distHeight - prevHeight];
        datas.prevWidth = distWidth;
        datas.prevHeight = distHeight;

        if (!parentMoveable && delta.every(function (num) {
          return !num;
        })) {
          return;
        }

        var params = {
          target: target,
          width: nextWidth,
          height: nextHeight,
          direction: direction,
          dist: [distWidth, distHeight],
          datas: datas.datas,
          delta: delta,
          clientX: clientX,
          clientY: clientY,
          isPinch: !!pinchFlag
        };
        triggerEvent(moveable, "onResize", params);
        return params;
      },
      dragControlEnd: function (moveable, _a) {
        var datas = _a.datas,
            isDrag = _a.isDrag,
            clientX = _a.clientX,
            clientY = _a.clientY;

        if (!datas.isResize) {
          return false;
        }

        datas.isResize = false;
        triggerEvent(moveable, "onResizeEnd", {
          target: moveable.state.target,
          datas: datas.datas,
          clientX: clientX,
          clientY: clientY,
          isDrag: isDrag
        });
        return isDrag;
      },
      dragGroupControlCondition: directionCondition,
      dragGroupControlStart: function (moveable, e) {
        var datas = e.datas,
            inputEvent = e.inputEvent;
        var _a = moveable.state,
            parentLeft = _a.left,
            parentTop = _a.top;
        var params = this.dragControlStart(moveable, e);

        if (!params) {
          return false;
        }

        var events = triggerChildAble(moveable, this, "dragControlStart", __assign$3({}, e, {
          parentRotate: 0
        }), function (child, childDatas, eventParams) {
          var _a = child.state,
              left = _a.left,
              top = _a.top;
          var dragDatas = childDatas.drag || (childDatas.drag = {});
          eventParams.dragStart = Draggable.dragStart(child, setCustomEvent(left - parentLeft, top - parentTop, dragDatas, inputEvent));
        });

        var nextParams = __assign$3({}, params, {
          targets: moveable.props.targets,
          events: events
        });

        var result = triggerEvent(moveable, "onResizeGroupStart", nextParams);
        datas.isResize = result !== false;
        return datas.isResize ? params : false;
      },
      dragGroupControl: function (moveable, e) {
        var inputEvent = e.inputEvent,
            datas = e.datas;

        if (!datas.isResize) {
          return;
        }

        var params = this.dragControl(moveable, e);

        if (!params) {
          return;
        }

        var width = params.width,
            height = params.height,
            dist = params.dist;
        var parentScale = [width / (width - dist[0]), height / (height - dist[1])];
        var events = triggerChildAble(moveable, this, "dragControl", __assign$3({}, e, {
          parentScale: parentScale
        }), function (child, childDatas, result) {
          var dragDatas = childDatas.drag || (childDatas.drag = {});

          var _a = getCustomEvent(dragDatas),
              startX = _a.startX,
              startY = _a.startY;

          var clientX = parentScale[0] * startX;
          var clientY = parentScale[1] * startY;
          var dragResult = Draggable.drag(child, setCustomEvent(clientX, clientY, dragDatas, inputEvent));
          result.drag = dragResult;
        });

        var nextParams = __assign$3({
          targets: moveable.props.targets,
          events: events
        }, params);

        triggerEvent(moveable, "onResizeGroup", nextParams);
        return nextParams;
      },
      dragGroupControlEnd: function (moveable, e) {
        var clientX = e.clientX,
            clientY = e.clientY,
            isDrag = e.isDrag,
            datas = e.datas;

        if (!datas.isResize) {
          return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", e);
        var nextParams = {
          targets: moveable.props.targets,
          clientX: clientX,
          clientY: clientY,
          isDrag: isDrag,
          datas: datas.datas
        };
        triggerEvent(moveable, "onResizeGroupEnd", nextParams);
        return isDrag;
      }
    };

    var Scalable = {
      name: "scalable",
      dragControlOnly: true,
      canPinch: true,
      render: function (moveable, React) {
        var _a = moveable.props,
            resizable = _a.resizable,
            scalable = _a.scalable,
            edge = _a.edge;

        if (!resizable && scalable) {
          if (edge) {
            return renderDiagonalDirection(moveable, React);
          }

          return renderAllDirection(moveable, React);
        }
      },
      dragControlCondition: directionCondition,
      dragControlStart: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            pinchFlag = _a.pinchFlag,
            inputTarget = _a.inputEvent.target;
        var direction = pinchFlag ? [1, 1] : getDirection(inputTarget);
        var _b = moveable.state,
            width = _b.width,
            height = _b.height,
            targetTransform = _b.targetTransform,
            target = _b.target;

        if (!direction || !target) {
          return false;
        }

        if (!pinchFlag) {
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
        var params = {
          target: target,
          clientX: clientX,
          clientY: clientY,
          datas: datas.datas,
          set: function (scale) {
            datas.startScale = scale;
          }
        };
        var result = triggerEvent(moveable, "onScaleStart", params);

        if (result !== false) {
          datas.isScale = true;
        }

        return datas.isScale ? params : false;
      },
      dragControl: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            distX = _a.distX,
            distY = _a.distY,
            parentScale = _a.parentScale,
            parentDistance = _a.parentDistance,
            pinchFlag = _a.pinchFlag;
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

        var _b = moveable.props,
            keepRatio = _b.keepRatio,
            throttleScale = _b.throttleScale,
            parentMoveable = _b.parentMoveable;
        var target = moveable.state.target;
        var scaleX = 1;
        var scaleY = 1;

        if (parentScale) {
          scaleX = parentScale[0];
          scaleY = parentScale[1];
        } else if (pinchFlag) {
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
          var distWidth = direction[0] * dist[0];
          var distHeight = direction[1] * dist[1]; // diagonal

          if (keepRatio && direction[0] && direction[1] && width && height) {
            var size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
            var rad = getRad([0, 0], dist);
            var standardRad = getRad([0, 0], direction);
            var distDiagonal = Math.cos(rad - standardRad) * size;
            distWidth = distDiagonal;
            distHeight = distDiagonal * height / width;
          }

          var nextWidth = width + distWidth;
          var nextHeight = height + distHeight;
          scaleX = nextWidth / width;
          scaleY = nextHeight / height;
        }

        scaleX = throttle(scaleX * startScale[0], throttleScale);
        scaleY = throttle(scaleY * startScale[1], throttleScale);

        if (scaleX === 0) {
          scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }

        if (scaleY === 0) {
          scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }

        var nowDist = [scaleX / startScale[0], scaleY / startScale[1]];
        var nowScale = [scaleX, scaleY];
        datas.prevDist = nowScale;

        if (scaleX === prevDist[0] && scaleY === prevDist[1] && !parentMoveable) {
          return false;
        }

        var params = {
          target: target,
          scale: [scaleX, scaleY],
          direction: direction,
          dist: nowDist,
          delta: [scaleX / prevDist[0], scaleY / prevDist[1]],
          transform: transform + " scale(" + scaleX + ", " + scaleY + ")",
          clientX: clientX,
          clientY: clientY,
          datas: datas.datas,
          isPinch: !!pinchFlag
        };
        triggerEvent(moveable, "onScale", params);
        return params;
      },
      dragControlEnd: function (moveable, _a) {
        var datas = _a.datas,
            isDrag = _a.isDrag,
            clientX = _a.clientX,
            clientY = _a.clientY,
            pinchFlag = _a.pinchFlag;

        if (!datas.isScale) {
          return false;
        }

        datas.isScale = false;
        triggerEvent(moveable, "onScaleEnd", {
          target: moveable.state.target,
          isDrag: isDrag,
          clientX: clientX,
          clientY: clientY,
          datas: datas.datas
        });
        return isDrag;
      },
      dragGroupControlCondition: directionCondition,
      dragGroupControlStart: function (moveable, e) {
        var datas = e.datas,
            inputEvent = e.inputEvent;
        var params = this.dragControlStart(moveable, e);

        if (!params) {
          return false;
        }

        var _a = moveable.state,
            parentLeft = _a.left,
            parentTop = _a.top,
            parentOrigin = _a.origin;
        var parentAbsoluteOrigin = [parentLeft + parentOrigin[0], parentTop + parentOrigin[1]];
        datas.rotation = moveable.rotation;
        var events = triggerChildAble(moveable, this, "dragControlStart", e, function (child, childDatas, eventParams) {
          var _a = child.state,
              left = _a.left,
              top = _a.top,
              origin = _a.origin;
          var dragDatas = childDatas.drag || (childDatas.drag = {});
          eventParams.dragStart = Draggable.dragStart(child, setCustomEvent(left + origin[0] - parentAbsoluteOrigin[0], top + origin[1] - parentAbsoluteOrigin[1], dragDatas, inputEvent));
        });

        var nextParams = __assign$3({}, params, {
          targets: moveable.props.targets,
          events: events
        });

        var result = triggerEvent(moveable, "onScaleGroupStart", nextParams);
        datas.isScale = result !== false;
        return datas.isScale ? nextParams : false;
      },
      dragGroupControl: function (moveable, e) {
        var inputEvent = e.inputEvent,
            datas = e.datas;

        if (!datas.isScale) {
          return;
        }

        var params = this.dragControl(moveable, e);

        if (!params) {
          return;
        }

        var scale = params.scale;
        var events = triggerChildAble(moveable, this, "dragControl", __assign$3({}, e, {
          parentScale: scale
        }), function (child, childDatas, result) {
          var dragDatas = childDatas.drag || (childDatas.drag = {});

          var _a = getCustomEvent(dragDatas),
              startX = _a.startX,
              startY = _a.startY;

          var startPos = rotate([startX, startY], -datas.rotation);

          var _b = rotate([startPos[0] * scale[0], startPos[1] * scale[1]], moveable.rotation),
              clientX = _b[0],
              clientY = _b[1];

          var dragResult = Draggable.drag(child, setCustomEvent(clientX, clientY, dragDatas, inputEvent));
          result.drag = dragResult;
        });

        var nextParams = __assign$3({
          targets: moveable.props.targets,
          events: events
        }, params);

        triggerEvent(moveable, "onScaleGroup", nextParams);
        return nextParams;
      },
      dragGroupControlEnd: function (moveable, e) {
        var clientX = e.clientX,
            clientY = e.clientY,
            isDrag = e.isDrag,
            datas = e.datas;

        if (!datas.isScale) {
          return;
        }

        this.dragControlEnd(moveable, e);
        triggerChildAble(moveable, this, "dragControlEnd", e);
        var nextParams = {
          targets: moveable.props.targets,
          clientX: clientX,
          clientY: clientY,
          isDrag: isDrag,
          datas: datas.datas
        };
        triggerEvent(moveable, "onScaleGroupEnd", nextParams);
        return isDrag;
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
      dragControlOnly: true,
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
        })].concat(renderDiagonalDirection(moveable, React));
      },
      dragControlCondition: function (target) {
        return hasClass(target, prefix("direction"));
      },
      dragControlStart: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            inputTarget = _a.inputEvent.target;
        var _b = moveable.props,
            target = _b.target,
            onWarpStart = _b.onWarpStart;
        var direction = getDirection(inputTarget);

        if (!direction || !target) {
          return false;
        }

        var _c = moveable.state,
            transformOrigin = _c.transformOrigin,
            is3d = _c.is3d,
            targetTransform = _c.targetTransform,
            targetMatrix = _c.targetMatrix,
            width = _c.width,
            height = _c.height;
        datas.datas = {};
        datas.targetTransform = targetTransform;
        datas.targetMatrix = is3d ? targetMatrix : convertDimension(targetMatrix, 3, 4);
        datas.targetInverseMatrix = ignoreDimension(invert(datas.targetMatrix, 4), 3, 4);
        datas.direction = direction;
        setDragStart(moveable, {
          datas: datas
        });
        datas.poses = [[0, 0], [width, 0], [0, height], [width, height]].map(function (p, i) {
          return minus(p, transformOrigin);
        });
        datas.nextPoses = datas.poses.map(function (_a) {
          var x = _a[0],
              y = _a[1];
          return caculate(datas.targetMatrix, [x, y, 0, 1], 4);
        });
        datas.posNum = (direction[0] === -1 ? 0 : 1) + (direction[1] === -1 ? 0 : 2);
        datas.prevMatrix = createIdentityMatrix(4);
        var result = onWarpStart && onWarpStart({
          target: target,
          clientX: clientX,
          clientY: clientY,
          datas: datas.datas
        });

        if (result !== false) {
          datas.isWarp = true;
        }

        return result;
      },
      dragControl: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            distX = _a.distX,
            distY = _a.distY;
        var posNum = datas.posNum,
            poses = datas.poses,
            targetInverseMatrix = datas.targetInverseMatrix,
            prevMatrix = datas.prevMatrix,
            isWarp = datas.isWarp;

        if (!isWarp) {
          return false;
        }

        var _b = moveable.props,
            target = _b.target,
            onWarp = _b.onWarp;
        var dist = getDragDist({
          datas: datas,
          distX: distX,
          distY: distY
        }, true);
        var nextPoses = datas.nextPoses.slice();
        nextPoses[posNum] = [nextPoses[posNum][0] + dist[0], nextPoses[posNum][1] + dist[1]];

        if (!NEARBY_POS.every(function (nearByPoses) {
          return isValidPos(nearByPoses.map(function (i) {
            return poses[i];
          }), nearByPoses.map(function (i) {
            return nextPoses[i];
          }));
        })) {
          return false;
        }

        var h = warp(poses[0], poses[1], poses[2], poses[3], nextPoses[0], nextPoses[1], nextPoses[2], nextPoses[3]);

        if (!h.length) {
          return false;
        }

        var matrix = convertMatrixtoCSS(multiply(targetInverseMatrix, h, 4));
        var transform = datas.targetTransform + " matrix3d(" + matrix.join(",") + ")";
        var delta = multiply(invert(prevMatrix, 4), matrix, 4);
        datas.prevMatrix = matrix;
        onWarp && onWarp({
          target: target,
          clientX: clientX,
          clientY: clientY,
          delta: delta,
          multiply: multiplyCSS,
          dist: matrix,
          transform: transform,
          datas: datas.datas
        });
        return true;
      },
      dragControlEnd: function (moveable, _a) {
        var datas = _a.datas,
            isDrag = _a.isDrag,
            clientX = _a.clientX,
            clientY = _a.clientY;

        if (!datas.isWarp) {
          return false;
        }

        datas.isWarp = false;
        var _b = moveable.props,
            target = _b.target,
            onWarpEnd = _b.onWarpEnd;
        onWarpEnd && onWarpEnd({
          target: target,
          clientX: clientX,
          clientY: clientY,
          isDrag: isDrag,
          datas: datas.datas
        });
        return isDrag;
      }
    };

    var agent$1 = agent();
    var isNotSupportTransformOrigin = agent$1.os.name.indexOf("ios") > -1 || agent$1.browser.name.indexOf("safari") > -1;
    var PREFIX = "moveable-";
    var MOVEABLE_CSS = prefixCSS(PREFIX, "\n{\n\tposition: fixed;\n\twidth: 0;\n\theight: 0;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 3000;\n}\n.control-box {\n    z-index: 0;\n}\n.line, .control {\n\tleft: 0;\n\ttop: 0;\n}\n.control {\n\tposition: absolute;\n\twidth: 14px;\n\theight: 14px;\n\tborder-radius: 50%;\n\tborder: 2px solid #fff;\n\tbox-sizing: border-box;\n\tbackground: #4af;\n\tmargin-top: -7px;\n    margin-left: -7px;\n    z-index: 10;\n}\n.line {\n\tposition: absolute;\n\twidth: 1px;\n\theight: 1px;\n\tbackground: #4af;\n\ttransform-origin: 0px 0.5px;\n}\n.line.rotation-line {\n\theight: 40px;\n\twidth: 1px;\n\ttransform-origin: 0.5px 39.5px;\n}\n.line.rotation-line .control {\n\tborder-color: #4af;\n\tbackground:#fff;\n\tcursor: alias;\n}\n.control.origin {\n\tborder-color: #f55;\n\tbackground: #fff;\n\twidth: 12px;\n\theight: 12px;\n\tmargin-top: -6px;\n\tmargin-left: -6px;\n\tpointer-events: none;\n}\n.direction.e, .direction.w {\n\tcursor: ew-resize;\n}\n.direction.s, .direction.n {\n\tcursor: ns-resize;\n}\n.direction.nw, .direction.se, :host.reverse .direction.ne, :host.reverse .direction.sw {\n\tcursor: nwse-resize;\n}\n.direction.ne, .direction.sw, :host.reverse .direction.nw, :host.reverse .direction.se {\n\tcursor: nesw-resize;\n}\n.group {\n    z-index: -1;\n}\n" + (isNotSupportTransformOrigin ? ":global svg *:before {\n\tcontent:\"\";\n\ttransform-origin: inherit;\n}" : "") + "\n");
    var NEARBY_POS = [[0, 1, 2], [1, 0, 3], [2, 0, 3], [3, 1, 2]];
    var TINY_NUM = 0.0000001;
    var MIN_SCALE = 0.000000001;
    var MOVEABLE_ABLES = [Pinchable, Draggable, Rotatable, Resizable, Scalable, Warpable];
    var MAX_NUM = Math.pow(10, 10);
    var MIN_NUM = -MAX_NUM;

    var Origin = {
      name: "origin",
      render: function (moveable, React) {
        if (!moveable.props.origin) {
          return null;
        }

        var beforeOrigin = moveable.state.beforeOrigin;
        return [// <div className={prefix("control", "origin")} style={getControlTransform(origin)} key="origin"></div>,
        React.createElement("div", {
          className: prefix("control", "origin"),
          style: getControlTransform(beforeOrigin),
          key: "beforeOrigin"
        })];
      }
    };

    function triggerAble(moveable, ableType, eventOperation, eventAffix, eventType, e) {
      var eventName = "" + eventOperation + eventAffix + eventType;
      var conditionName = "" + eventOperation + eventAffix + "Condition";
      var isStart = eventType === "Start";
      var isGroup = eventAffix.indexOf("Group") > -1;
      var ables = moveable[ableType];
      var results = ables.filter(function (able) {
        var condition = isStart && able[conditionName];

        if (able[eventName] && (!condition || condition(e.inputEvent.target))) {
          return able[eventName](moveable, e);
        }

        return false;
      });

      if (!isStart && results.length) {
        if (results.some(function (able) {
          return able.updateRect;
        }) && !isGroup) {
          moveable.updateRect(eventType);
        } else {
          moveable.updateTarget(eventType);
        }
      }
    }

    function getAbleDragger(moveable, target, ableType, eventAffix) {
      var options = {
        container: window,
        pinchThreshold: moveable.props.pinchThreshold
      };
      ["drag", "pinch"].forEach(function (eventOperation) {
        ["Start", "", "End"].forEach(function (eventType) {
          options["" + eventOperation + eventType.toLowerCase()] = function (e) {
            return triggerAble(moveable, ableType, eventOperation, eventAffix, eventType, e);
          };
        });
      });
      return new Dragger(target, options);
    }

    var ControlBoxElement = styled("div", MOVEABLE_CSS);

    function renderLine(direction, pos1, pos2) {
      return createElement("div", {
        className: prefix("line", "direction", direction),
        "data-direction": direction,
        style: getLineStyle(pos1, pos2)
      });
    }

    var MoveableManager =
    /*#__PURE__*/
    function (_super) {
      __extends$4(MoveableManager, _super);

      function MoveableManager(props) {
        var _this = _super.call(this, props) || this;

        _this.state = {
          target: null,
          beforeMatrix: createIdentityMatrix3(),
          matrix: createIdentityMatrix3(),
          targetMatrix: createIdentityMatrix3(),
          targetTransform: "",
          is3d: false,
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transformOrigin: [0, 0],
          direction: 1,
          beforeDirection: 1,
          rotationRad: 0,
          rotationPos: [0, 0],
          beforeOrigin: [0, 0],
          origin: [0, 0],
          pos1: [0, 0],
          pos2: [0, 0],
          pos3: [0, 0],
          pos4: [0, 0]
        };
        _this.targetAbles = [];
        _this.controlAbles = [];

        _this.updateAbles();

        return _this;
      }

      var __proto = MoveableManager.prototype;

      __proto.render = function () {
        this.update(false);
        var _a = this.props,
            edge = _a.edge,
            parentPosition = _a.parentPosition;

        var _b = parentPosition || {
          left: 0,
          top: 0
        },
            parentLeft = _b.left,
            parentTop = _b.top;

        var _c = this.state,
            left = _c.left,
            top = _c.top,
            pos1 = _c.pos1,
            pos2 = _c.pos2,
            pos3 = _c.pos3,
            pos4 = _c.pos4,
            target = _c.target,
            direction = _c.direction;
        return createElement(ControlBoxElement, {
          ref: ref$1(this, "controlBox"),
          className: prefix("control-box", direction === -1 ? "reverse" : ""),
          style: {
            position: "absolute",
            display: target ? "block" : "none",
            transform: "translate(" + (left - parentLeft) + "px, " + (top - parentTop) + "px) translateZ(50px)"
          }
        }, this.renderAbles(), renderLine(edge ? "n" : "", pos1, pos2), renderLine(edge ? "e" : "", pos2, pos4), renderLine(edge ? "w" : "", pos1, pos3), renderLine(edge ? "s" : "", pos3, pos4));
      };

      __proto.componentDidMount = function () {
        this.controlBox.getElement();
        this.update(true);
      };

      __proto.componentWillUnmount = function () {
        unset(this, "targetDragger");
        unset(this, "controlDragger");
      };

      __proto.getContainer = function () {
        var _a = this.props,
            parentMoveable = _a.parentMoveable,
            container = _a.container;
        return container || parentMoveable && parentMoveable.getContainer() || this.controlBox.getElement().offsetParent;
      };

      __proto.isMoveableElement = function (target) {
        return target && (target.getAttribute("class") || "").indexOf(PREFIX) > -1;
      };

      __proto.dragStart = function (e) {
        this.targetDragger.onDragStart(e);
      };

      __proto.isInside = function (clientX, clientY) {
        var _a = this.state,
            pos1 = _a.pos1,
            pos2 = _a.pos2,
            pos3 = _a.pos3,
            pos4 = _a.pos4,
            target = _a.target;

        if (!target) {
          return false;
        }

        var _b = target.getBoundingClientRect(),
            left = _b.left,
            top = _b.top;

        var pos = [clientX - left, clientY - top];
        return isInside(pos, pos1, pos2, pos3, pos4);
      };

      __proto.updateRect = function (type, isTarget, isSetState) {
        if (isSetState === void 0) {
          isSetState = true;
        }

        var parentMoveable = this.props.parentMoveable;
        var state = this.state;
        var target = state.target || this.props.target;
        this.updateState(getTargetInfo(target, this.getContainer(), isTarget ? state : undefined), parentMoveable ? false : isSetState);
      };

      __proto.updateTarget = function (type) {
        this.updateRect(type, true);
      };

      __proto.update = function (isSetState) {
        var props = this.props;
        var target = props.target,
            parentMoveable = props.parentMoveable;
        var stateTarget = this.state.target;
        var controlBox = this.controlBox;

        if (!controlBox || !stateTarget && !target) {
          return;
        }

        this.updateAbles();
        var controlBoxElement = controlBox.getElement();
        var hasTargetAble = this.targetAbles.length;
        var hasControlAble = this.controlAbles.length;
        var isTargetChanged = stateTarget !== target;

        if (isTargetChanged) {
          this.updateState({
            target: target
          });
        }

        if (!hasTargetAble || isTargetChanged) {
          unset(this, "targetDragger");
        }

        if (!hasControlAble) {
          unset(this, "controlDragger");
        }

        if (target && (!this.targetDragger && hasTargetAble || isTargetChanged)) {
          this.targetDragger = getAbleDragger(this, target, "targetAbles", "");
        }

        if (!this.controlDragger && hasControlAble) {
          this.controlDragger = getAbleDragger(this, controlBoxElement, "controlAbles", "Control");
        }

        if (isTargetChanged && !parentMoveable) {
          this.updateRect("End", false, isSetState);
        }

        return isTargetChanged;
      };

      __proto.triggerEvent = function (name, e) {
        var callback = this.props[name];
        return callback && callback(e);
      };

      __proto.updateAbles = function (ables, eventAffix) {
        if (ables === void 0) {
          ables = this.props.ables;
        }

        if (eventAffix === void 0) {
          eventAffix = "";
        }

        var props = this.props;
        var enabledAbles = ables.filter(function (able) {
          return props[able.name];
        });
        var controlAbleOnly = false;
        var dragStart = "drag" + eventAffix + "Start";
        var pinchStart = "pinchStart" + eventAffix + "Start";
        var dragControlStart = "drag" + eventAffix + "ControlStart";
        var targetAbles = enabledAbles.filter(function (able) {
          return able[dragStart] || able[pinchStart];
        });
        var controlAbles = enabledAbles.filter(function (e) {
          var dragControlOnly = e.dragControlOnly;

          if (!e[dragControlStart] || dragControlOnly && controlAbleOnly) {
            return false;
          }

          if (dragControlOnly) {
            controlAbleOnly = true;
          }

          return true;
        });
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

        var ables = this.targetAbles.concat(this.controlAbles, [Origin]);
        return ables.map(function (_a) {
          var render = _a.render;
          return render && render(_this, React);
        });
      };

      MoveableManager.defaultProps = {
        target: null,
        container: null,
        origin: true,
        keepRatio: true,
        edge: false,
        parentMoveable: null,
        parentPosition: null,
        ables: [],
        pinchThreshold: 20
      };
      return MoveableManager;
    }(PureComponent);

    var Groupable = {
      name: "groupable",
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
            key: i,
            ref: refs(moveable, "moveables", i),
            target: target,
            origin: false,
            parentMoveable: moveable,
            parentPosition: position
          });
        }).concat([React.createElement("div", {
          key: "groupTarget",
          ref: ref$1(moveable, "groupTargetElement"),
          className: prefix("group")
        })]);
      },
      dragGroupStart: function (moveable) {
        moveable.groupTargetElement.style.pointerEvents = "none";
      },
      dragGroup: function (moveable) {
        moveable.groupTargetElement.style.pointerEvents = "auto";
      },
      dragGroupEnd: function (moveable, _a) {
        var inputEvent = _a.inputEvent,
            isDrag = _a.isDrag;
        !isDrag && (moveable.groupTargetElement.style.pointerEvents = "auto");
        var target = inputEvent.target;

        if (isDrag || moveable.isMoveableElement(target)) {
          return;
        }

        var targets = moveable.props.targets;
        var targetIndex = targets.indexOf(target);
        var hasTarget = targetIndex > -1;
        var containsTarget = false;

        if (targetIndex === -1) {
          targetIndex = findIndex(targets, function (parentTarget) {
            return parentTarget.contains(target);
          });
          containsTarget = targetIndex > -1;
        }

        triggerEvent(moveable, "onClickGroup", {
          targets: targets,
          target: target,
          targetIndex: targetIndex,
          hasTarget: hasTarget,
          containsTarget: containsTarget
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
        var _b = _a.state,
            left = _b.left,
            top = _b.top,
            pos1 = _b.pos1,
            pos2 = _b.pos2,
            pos3 = _b.pos3,
            pos4 = _b.pos4;
        var pos = [left, top];
        return [sum(pos, pos1), sum(pos, pos2), sum(pos, pos3), sum(pos, pos4)];
      });
      var minX = MAX_NUM;
      var minY = MAX_NUM;
      var groupWidth = 0;
      var groupHeight = 0;
      var fixedRotation = throttle(rotation, TINY_NUM);

      if (fixedRotation % 90) {
        var rad = rotation / 180 * Math.PI;
        var a1_1 = Math.tan(rad);
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
          return [rotate(pos1, -rotation), rotate(pos2, -rotation), rotate(pos3, -rotation), rotate(pos4, -rotation)];
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
      __extends$4(MoveableGroup, _super);

      function MoveableGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.differ = new ChildrenDiffer();
        _this.moveables = [];
        _this.rotation = 0;
        return _this;
      }

      var __proto = MoveableGroup.prototype;

      __proto.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
      };

      __proto.componentDidUpdate = function () {
        this.update(true);
      };

      __proto.update = function (isSetState) {
        if (!isSetState) {
          return;
        }

        var state = this.state;

        if (!state.target) {
          state.target = this.groupTargetElement;
          this.controlBox.getElement().style.display = "block";
          this.targetDragger = getAbleDragger(this, state.target, "targetAbles", "Group");
          this.controlDragger = getAbleDragger(this, this.controlBox.getElement(), "controlAbles", "GroupControl");
        }

        this.updateAbles();
        this.moveables.forEach(function (moveable) {
          return moveable.update(false);
        });

        var _a = this.differ.update(this.props.targets),
            added = _a.added,
            changed = _a.changed,
            removed = _a.removed;

        if (added.length || changed.length || removed.length) {
          this.updateRect();
        }

        return true;
      };

      __proto.updateRect = function (type, isTarget, isSetState) {

        if (!this.controlBox) {
          return;
        }

        this.moveables.forEach(function (moveable) {
          moveable.updateRect(type, false, false);
        });
        var state = this.state;
        var target = state.target || this.props.target;

        if (!isTarget || type !== "" && this.props.updateGroup) {
          // reset rotataion
          this.rotation = 0;
        }

        var rotation = this.rotation;

        var _a = getGroupRect(this.moveables, rotation),
            left = _a[0],
            top = _a[1],
            width = _a[2],
            height = _a[3];

        target.style.cssText += "width:" + width + "px; height:" + height + "px;transform:rotate(" + rotation + "deg)";
        state.width = width;
        state.height = height;
        var info = getTargetInfo(target, this.controlBox.getElement(), state);
        target.style.cssText += "transform: translate(" + -info.left + "px, " + -info.top + "px) rotate(" + rotation + "deg)";
        this.updateState(__assign$3({}, info, {
          left: left,
          top: top
        }), true);
      };

      __proto.triggerEvent = function (name, e) {
        if (name.indexOf("Group") > -1) {
          return _super.prototype.triggerEvent.call(this, name, e);
        }
      };

      __proto.updateAbles = function () {
        _super.prototype.updateAbles.call(this, this.props.ables.concat([Groupable]), "Group");
      };

      MoveableGroup.defaultProps = __assign$3({}, MoveableManager.defaultProps, {
        groupable: true,
        ables: MOVEABLE_ABLES,
        targets: []
      });
      return MoveableGroup;
    }(MoveableManager);

    var Moveable =
    /*#__PURE__*/
    function (_super) {
      __extends$4(Moveable, _super);

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
          return createElement(MoveableGroup, __assign$3({
            key: "group",
            ref: ref$1(this, "moveable")
          }, __assign$3({}, this.props, {
            target: null,
            targets: target,
            ables: MOVEABLE_ABLES.concat(ables)
          })));
        } else {
          var moveableTarget = isArr ? target[0] : target;
          return createElement(MoveableManager, __assign$3({
            key: "single",
            ref: ref$1(this, "moveable")
          }, __assign$3({}, this.props, {
            target: moveableTarget,
            ables: MOVEABLE_ABLES.concat(ables)
          })));
        }
      };

      __proto.isMoveableElement = function (target) {
        return this.moveable.isMoveableElement(target);
      };

      __proto.dragStart = function (e) {
        this.moveable.dragStart(e);
      };

      __proto.isInside = function (clientX, clientY) {
        return this.moveable.isInside(clientX, clientY);
      };

      __proto.updateRect = function () {
        this.moveable.updateRect();
      };

      __proto.updateTarget = function () {
        this.moveable.updateTarget();
      };

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
        return h(Moveable, __assign({
          ref: ref(this, "preactMoveable")
        }, this.state));
      };

      return InnerMoveable;
    }(Component$1);

    var PROPERTIES = ["draggable", "resizable", "scalable", "rotatable", "warpable", "pinchable", "origin", "target", "edge", "throttleDrag", "throttleResize", "throttleScale", "throttleRotate", "keepRatio", "pinchThreshold"];
    var EVENTS = ["dragStart", "drag", "dragEnd", "resizeStart", "resize", "resizeEnd", "scaleStart", "scale", "scaleEnd", "rotateStart", "rotate", "rotateEnd", "warpStart", "warp", "warpEnd", "pinchStart", "pinch", "pinchEnd", "dragGroupStart", "dragGroup", "dragGroupEnd", "resizeGroupStart", "resizeGroup", "resizeGroupEnd", "scaleGroupStart", "scaleGroup", "scaleGroupEnd", "rotateGroupStart", "rotateGroup", "rotateGroupEnd", "pinchGroupStart", "pinchGroup", "pinchGroupEnd", "clickGroup"];

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

        var element = document.createElement("div");

        var nextOptions = __assign({
          container: parentElement
        }, options);

        var events = {};
        EVENTS.forEach(function (name) {
          events[camelize("on " + name)] = function (e) {
            return _this.trigger(name, e);
          };
        });
        render(h(InnerMoveable, __assign({
          ref: ref(_this, "innerMoveable")
        }, nextOptions, events)), element);
        parentElement.appendChild(element.children[0]);
        var target = nextOptions.target;

        if (isArray(target) && target.length > 1) {
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
       * You can move the Moveable through the external `MouseEvent`or `TouchEvent`.
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
        var el = this.getMoveable().base;
        el.remove ? el.remove() : el.parentElement.removeChild(el);
        this.off();
        this.getMoveable().destroy();
        this.innerMoveable = null;
      };

      __proto.getMoveable = function () {
        return this.innerMoveable.preactMoveable;
      };

      Moveable = __decorate([Properties(PROPERTIES, function (prototype, property) {
        Object.defineProperty(prototype, property, {
          get: function () {
            return this.getMoveable().props[property];
          },
          set: function (value) {
            var _a;

            this.innerMoveable.setState((_a = {}, _a[property] = value, _a));
          },
          enumerable: true,
          configurable: true
        });
      })], Moveable);
      return Moveable;
    }(Component);

    Moveable$1.PROPERTIES = PROPERTIES;
    Moveable$1.EVENTS = EVENTS;

    return Moveable$1;

}));
//# sourceMappingURL=moveable.js.map
