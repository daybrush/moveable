/*
Copyright (c) 2019 Daybrush
name: moveable
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/moveable.git
version: 0.9.0
*/
(function () {
    'use strict';

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
    //# sourceMappingURL=component.esm.js.map

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
    //# sourceMappingURL=utils.esm.js.map

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
    //# sourceMappingURL=preact.mjs.map

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
    //# sourceMappingURL=preact-compat.es.js.map

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
    //# sourceMappingURL=utils.esm.js.map

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
    //# sourceMappingURL=agent.esm.js.map

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 0.10.1
    */
    /**
    * @namespace
    * @name Consts
    */

    /**
    * get string "rgb"
    * @memberof Color
    * @example
    import {RGB} from "@daybrush/utils";

    console.log(RGB); // "rgb"
    */
    var RGB = "rgb";
    /**
    * get string "rgba"
    * @memberof Color
    * @example
    import {RGBA} from "@daybrush/utils";

    console.log(RGBA); // "rgba"
    */

    var RGBA = "rgba";
    /**
    * get string "hsl"
    * @memberof Color
    * @example
    import {HSL} from "@daybrush/utils";

    console.log(HSL); // "hsl"
    */

    var HSL = "hsl";
    /**
    * get string "hsla"
    * @memberof Color
    * @example
    import {HSLA} from "@daybrush/utils";

    console.log(HSLA); // "hsla"
    */

    var HSLA = "hsla";
    /**
    * gets an array of color models.
    * @memberof Color
    * @example
    import {COLOR_MODELS} from "@daybrush/utils";

    console.log(COLOR_MODELS); // ["rgb", "rgba", "hsl", "hsla"];
    */

    var COLOR_MODELS = [RGB, RGBA, HSL, HSLA];
    /**
    * get string "function"
    * @memberof Consts
    * @example
    import {FUNCTION} from "@daybrush/utils";

    console.log(FUNCTION); // "function"
    */

    var FUNCTION = "function";
    /**
    * get string "property"
    * @memberof Consts
    * @example
    import {PROPERTY} from "@daybrush/utils";

    console.log(PROPERTY); // "property"
    */

    var PROPERTY = "property";
    /**
    * get string "array"
    * @memberof Consts
    * @example
    import {ARRAY} from "@daybrush/utils";

    console.log(ARRAY); // "array"
    */

    var ARRAY = "array";
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
    * get string "number"
    * @memberof Consts
    * @example
    import {NUMBER} from "@daybrush/utils";

    console.log(NUMBER); // "number"
    */

    var NUMBER = "number";
    /**
    * get string "undefined"
    * @memberof Consts
    * @example
    import {UNDEFINED} from "@daybrush/utils";

    console.log(UNDEFINED); // "undefined"
    */

    var UNDEFINED = "undefined";
    /**
    * Check whether the environment is window or node.js.
    * @memberof Consts
    * @name document
    * @example
    import {IS_WINDOW} from "@daybrush/utils";

    console.log(IS_WINDOW); // false in node.js
    console.log(IS_WINDOW); // true in browser
    */

    var doc = typeof document !== UNDEFINED && document;
    var prefixes = ["webkit", "ms", "moz", "o"];
    /**
     * @namespace CrossBrowser
     */

    /**
    * Get a CSS property with a vendor prefix that supports cross browser.
    * @function
    * @param {string} property - A CSS property
    * @return {string} CSS property with cross-browser vendor prefix
    * @memberof CrossBrowser
    * @example
    import {getCrossBrowserProperty} from "@daybrush/utils";

    console.log(getCrossBrowserProperty("transform")); // "transform", "-ms-transform", "-webkit-transform"
    console.log(getCrossBrowserProperty("filter")); // "filter", "-webkit-filter"
    */

    var getCrossBrowserProperty =
    /*#__PURE__*/
    function (property) {
      if (!doc) {
        return "";
      }

      var styles = (doc.body || doc.documentElement).style;
      var length = prefixes.length;

      if (typeof styles[property] !== UNDEFINED) {
        return property;
      }

      for (var i = 0; i < length; ++i) {
        var name = "-" + prefixes[i] + "-" + property;

        if (typeof styles[name] !== UNDEFINED) {
          return name;
        }
      }

      return "";
    };
    /**
    * get string "transfrom" with the vendor prefix.
    * @memberof CrossBrowser
    * @example
    import {TRANSFORM} from "@daybrush/utils";

    console.log(TRANSFORM); // "transform", "-ms-transform", "-webkit-transform"
    */

    var TRANSFORM =
    /*#__PURE__*/
    getCrossBrowserProperty("transform");
    /**
    * get string "filter" with the vendor prefix.
    * @memberof CrossBrowser
    * @example
    import {FILTER} from "@daybrush/utils";

    console.log(FILTER); // "filter", "-ms-filter", "-webkit-filter"
    */

    var FILTER =
    /*#__PURE__*/
    getCrossBrowserProperty("filter");
    /**
    * get string "animation" with the vendor prefix.
    * @memberof CrossBrowser
    * @example
    import {ANIMATION} from "@daybrush/utils";

    console.log(ANIMATION); // "animation", "-ms-animation", "-webkit-animation"
    */

    var ANIMATION =
    /*#__PURE__*/
    getCrossBrowserProperty("animation");

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
    /**
    * divide text by space.
    * @memberof Utils
    * @param {string} text - text to divide
    * @return {Array} divided texts
    * @example
    import {spliceSpace} from "@daybrush/utils";

    console.log(splitSpace("a b c d e f g"));
    // ["a", "b", "c", "d", "e", "f", "g"]
    console.log(splitSpace("'a,b' c 'd,e' f g"));
    // ["'a,b'", "c", "'d,e'", "f", "g"]
    */

    function splitSpace(text) {
      // divide comma(,)
      var matches = text.match(/("[^"]*")|('[^']*')|([^\s()]*(?:\((?:[^()]*|\([^()]*\))*\))[^\s()]*)|\S+/g);
      return matches || [];
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
      var matches = text.match(/("[^"]*"|'[^']*'|[^,\s()]*\((?:[^()]*|\([^()]*\))*\)[^,\s()]*|[^,])+/g);
      return matches ? matches.map(function (str) {
        return str.trim();
      }) : [];
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
    * @namespace
    * @name Color
    */

    /**
    * Remove the # from the hex color.
    * @memberof Color
    * @param {} hex - hex color
    * @return {} hex color
    * @example
    import {cutHex} from "@daybrush/utils";

    console.log(cutHex("#000000")) // "000000"
    */

    function cutHex(hex) {
      return hex.replace("#", "");
    }
    /**
    * convert hex color to rgb color.
    * @memberof Color
    * @param {} hex - hex color
    * @return {} rgb color
    * @example
    import {hexToRGBA} from "@daybrush/utils";

    console.log(hexToRGBA("#00000005"));
    // [0, 0, 0, 1]
    console.log(hexToRGBA("#201045"));
    // [32, 16, 69, 1]
    */

    function hexToRGBA(hex) {
      var h = cutHex(hex);
      var r = parseInt(h.substring(0, 2), 16);
      var g = parseInt(h.substring(2, 4), 16);
      var b = parseInt(h.substring(4, 6), 16);
      var a = parseInt(h.substring(6, 8), 16) / 255;

      if (isNaN(a)) {
        a = 1;
      }

      return [r, g, b, a];
    }
    /**
    * convert 3(or 4)-digit hex color to 6(or 8)-digit hex color.
    * @memberof Color
    * @param {} hex - 3(or 4)-digit hex color
    * @return {} 6(or 8)-digit hex color
    * @example
    import {toFullHex} from "@daybrush/utils";

    console.log(toFullHex("#123")); // "#112233"
    console.log(toFullHex("#123a")); // "#112233aa"
    */

    function toFullHex(h) {
      var r = h.charAt(1);
      var g = h.charAt(2);
      var b = h.charAt(3);
      var a = h.charAt(4);
      var arr = ["#", r, r, g, g, b, b, a, a];
      return arr.join("");
    }
    /**
    * convert hsl color to rgba color.
    * @memberof Color
    * @param {} hsl - hsl color(hue: 0 ~ 360, saturation: 0 ~ 1, lightness: 0 ~ 1, alpha: 0 ~ 1)
    * @return {} rgba color
    * @example
    import {hslToRGBA} from "@daybrush/utils";

    console.log(hslToRGBA([150, 0.5, 0.4]));
    // [51, 153, 102, 1]
    */

    function hslToRGBA(hsl) {
      var h = hsl[0];
      var s = hsl[1];
      var l = hsl[2];

      if (h < 0) {
        h += Math.floor((Math.abs(h) + 360) / 360) * 360;
      }

      h %= 360;
      var c = (1 - Math.abs(2 * l - 1)) * s;
      var x = c * (1 - Math.abs(h / 60 % 2 - 1));
      var m = l - c / 2;
      var rgb;

      if (h < 60) {
        rgb = [c, x, 0];
      } else if (h < 120) {
        rgb = [x, c, 0];
      } else if (h < 180) {
        rgb = [0, c, x];
      } else if (h < 240) {
        rgb = [0, x, c];
      } else if (h < 300) {
        rgb = [x, 0, c];
      } else if (h < 360) {
        rgb = [c, 0, x];
      }

      var result = [Math.round((rgb[0] + m) * 255), Math.round((rgb[1] + m) * 255), Math.round((rgb[2] + m) * 255), hsl.length > 3 ? hsl[3] : 1];
      return result;
    }
    /**
    * convert string to rgba color.
    * @memberof Color
    * @param {} - 3-hex(#000), 4-hex(#0000) 6-hex(#000000), 8-hex(#00000000) or RGB(A), or HSL(A)
    * @return {} rgba color
    * @example
    import {stringToRGBA} from "@daybrush/utils";

    console.log(stringToRGBA("#000000")); // [0, 0, 0, 1]
    console.log(stringToRGBA("rgb(100, 100, 100)")); // [100, 100, 100, 1]
    console.log(stringToRGBA("hsl(150, 0.5, 0.4)")); // [51, 153, 102, 1]
    */

    function stringToRGBA(color) {
      if (color.charAt(0) === "#") {
        if (color.length === 4 || color.length === 5) {
          return hexToRGBA(toFullHex(color));
        } else {
          return hexToRGBA(color);
        }
      } else if (color.indexOf("(") !== -1) {
        // in bracket.
        var _a = splitBracket(color),
            prefix = _a.prefix,
            value = _a.value;

        if (!prefix || !value) {
          return;
        }

        var arr = splitComma(value);
        var colorArr = [];
        var length = arr.length;

        switch (prefix) {
          case RGB:
          case RGBA:
            for (var i = 0; i < length; ++i) {
              colorArr[i] = parseFloat(arr[i]);
            }

            return colorArr;

          case HSL:
          case HSLA:
            for (var i = 0; i < length; ++i) {
              if (arr[i].indexOf("%") !== -1) {
                colorArr[i] = parseFloat(arr[i]) / 100;
              } else {
                colorArr[i] = parseFloat(arr[i]);
              }
            } // hsl, hsla to rgba


            return hslToRGBA(colorArr);
        }
      }

      return;
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
    //# sourceMappingURL=utils.esm.js.map

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

    function splitComma$1(text) {
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
        return splitComma$1(selector).map(function (subSelector) {
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
    //# sourceMappingURL=styler.esm.js.map

    /*
    Copyright (c) 2019 Daybrush
    name: @daybrush/drag
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/drag.git
    version: 0.10.1
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
        this.customDist = [0, 0];

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
          _this.customDist = [0, 0];
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

          var result = _this.move([0, 0], e, clients);

          if (!result || !result.deltaX && !result.deltaY) {
            return;
          }

          var drag = _this.options.drag;
          drag && drag(__assign$2({}, result, {
            inputEvent: e
          }));
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
        this.customDist = [0, 0];

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
        return __assign$2({
          datas: this.datas
        }, position, {
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
    //# sourceMappingURL=drag.esm.js.map

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
    //# sourceMappingURL=list-differ.esm.js.map

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
    //# sourceMappingURL=children-differ.esm.js.map

    /*
    Copyright (c) 2019 Daybrush
    name: preact-moveable
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/moveable/blob/master/packages/preact-moveable
    version: 0.11.1
    */

    /*
    Copyright (c) 2019 Daybrush
    name: @moveable/matrix
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/moveable.git
    version: 0.3.0
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
      return rad > 0 ? rad : rad + Math.PI * 2;
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
    name: react-moveable
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/moveable/blob/master/packages/react-moveable
    version: 0.12.1
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

    var agent$1 = agent();
    var isWebkit = agent$1.os.name.indexOf("ios") > -1 || agent$1.browser.name.indexOf("safari") > -1;
    var PREFIX = "moveable-";
    var MOVEABLE_CSS = prefixCSS(PREFIX, "\n{\n\tposition: fixed;\n\twidth: 0;\n\theight: 0;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 3000;\n}\n.control-box {\n    z-index: 0;\n}\n.line, .control {\n\tleft: 0;\n\ttop: 0;\n}\n.control {\n\tposition: absolute;\n\twidth: 14px;\n\theight: 14px;\n\tborder-radius: 50%;\n\tborder: 2px solid #fff;\n\tbox-sizing: border-box;\n\tbackground: #4af;\n\tmargin-top: -7px;\n    margin-left: -7px;\n    z-index: 10;\n}\n.line {\n\tposition: absolute;\n\twidth: 1px;\n\theight: 1px;\n\tbackground: #4af;\n\ttransform-origin: 0px 0.5px;\n}\n.line.rotation-line {\n\theight: 40px;\n\twidth: 1px;\n\ttransform-origin: 0.5px 39.5px;\n}\n.line.rotation-line .control {\n\tborder-color: #4af;\n\tbackground:#fff;\n\tcursor: alias;\n}\n.line.vertical.bold {\n    width: 2px;\n    margin-left: -1px;\n}\n.line.horizontal.bold {\n    height: 2px;\n    margin-top: -1px;\n}\n.control.origin {\n\tborder-color: #f55;\n\tbackground: #fff;\n\twidth: 12px;\n\theight: 12px;\n\tmargin-top: -6px;\n\tmargin-left: -6px;\n\tpointer-events: none;\n}\n.direction.e, .direction.w {\n\tcursor: ew-resize;\n}\n.direction.s, .direction.n {\n\tcursor: ns-resize;\n}\n.direction.nw, .direction.se, :host.reverse .direction.ne, :host.reverse .direction.sw {\n\tcursor: nwse-resize;\n}\n.direction.ne, .direction.sw, :host.reverse .direction.nw, :host.reverse .direction.se {\n\tcursor: nesw-resize;\n}\n.group {\n    z-index: -1;\n}\n.area {\n    position: absolute;\n}\n.area.avoid, .area.avoid:before, .area.avoid:after {\n    transform-origin: 50% calc(100% + 20px);\n}\n.area.avoid:before, .area.avoid:after {\n    content: \"\";\n    top: 0px;\n    left: 0px;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n}\n\n.area.avoid:before {\n    transform: rotate(120deg);\n}\n.area.avoid:after {\n    transform: rotate(-120deg);\n}\n" + (isWebkit ? ":global svg *:before {\n\tcontent:\"\";\n\ttransform-origin: inherit;\n}" : "") + "\n");
    var NEARBY_POS = [[0, 1, 2], [1, 0, 3], [2, 0, 3], [3, 1, 2]];
    var TINY_NUM = 0.0000001;
    var MIN_SCALE = 0.000000001;
    var MAX_NUM = Math.pow(10, 10);
    var MIN_NUM = -MAX_NUM;

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
        var viewBox = el.ownerSVGElement.viewBox.baseVal;
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
    function caculateMatrixStack(target, container, prevMatrix, prevN) {
      var _a;

      var el = target;
      var matrixes = [];
      var isContainer = !!prevMatrix || target === container;
      var isSVGGraphicElement = el.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in el;
      var is3d = false;
      var n = 3;
      var transformOrigin;
      var targetMatrix;
      var style = getComputedStyle(el);

      while (el && (isContainer || el !== container)) {
        var tagName = el.tagName.toLowerCase();
        var position = style.position;
        var isFixed = position === "fixed";
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
        var offsetTop = el.offsetTop;

        if (isFixed) {
          var containerRect = (container || document.documentElement).getBoundingClientRect();
          offsetLeft -= containerRect.left;
          offsetTop -= containerRect.top;
        } // svg


        var isSVG = isUndefined$1(offsetLeft);
        var hasNotOffset = isSVG;
        var origin = void 0; // inner svg element

        if (hasNotOffset && tagName !== "svg") {
          origin = isWebkit ? getBeforeTransformOrigin(el) : getTransformOrigin(style).map(function (pos) {
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

        var parentElement = el.parentElement;

        if (isWebkit && !hasNotOffset && !isSVG) {
          var offsetParent = el.offsetParent;

          if (offsetParent && offsetParent !== parentElement) {
            offsetLeft -= parentElement.offsetLeft;
            offsetTop -= parentElement.offsetTop;
          }
        }

        matrixes.push(getAbsoluteMatrix(matrix, n, origin), createOriginMatrix([hasNotOffset ? el : offsetLeft, hasNotOffset ? origin : offsetTop], n));

        if (!targetMatrix) {
          targetMatrix = matrix;
        }

        if (!transformOrigin) {
          transformOrigin = origin;
        }

        if (isContainer || isFixed) {
          break;
        }

        el = parentElement;

        if (isSVG) {
          continue;
        }

        while (el) {
          style = getComputedStyle(el);
          var nextPosition = style.position,
              nextTransform = style.transform;

          if (nextPosition !== "static" || nextTransform && nextTransform !== "none") {
            break;
          }

          el = el.parentElement;
        }

        if (el) {
          style = getComputedStyle(el);
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
    function caculatePoses(matrix, width, height, n) {
      var pos1 = caculatePosition(matrix, [0, 0], n);
      var pos2 = caculatePosition(matrix, [width, 0], n);
      var pos3 = caculatePosition(matrix, [0, height], n);
      var pos4 = caculatePosition(matrix, [width, height], n);
      return [pos1, pos2, pos3, pos4];
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

      var containerRect = (container || document.documentElement).getBoundingClientRect();
      var rect = el.getBoundingClientRect();
      var rectLeft = rect.left - containerRect.left;
      var rectTop = rect.top - containerRect.top;
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
      return [[left, top, right, bottom], [originX, originY], [x1, y1], [x2, y2], [x3, y3], [x4, y4], direction];
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
        style = getComputedStyle(target);
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
    function getTargetInfo(target, container, state) {
      var _a, _b, _c, _d, _e;

      var left = 0;
      var top = 0;
      var right = 0;
      var bottom = 0;
      var origin = [0, 0];
      var pos1 = [0, 0];
      var pos2 = [0, 0];
      var pos3 = [0, 0];
      var pos4 = [0, 0];
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
      var prevMatrix = state ? state.beforeMatrix : undefined;
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

        _b = caculateMatrixStack(target, container, prevMatrix, prevN), beforeMatrix = _b[0], offsetMatrix = _b[1], matrix = _b[2], targetMatrix = _b[3], targetTransform = _b[4], transformOrigin = _b[5], is3d = _b[6];
        _c = caculateMoveablePosition(matrix, transformOrigin, width, height), _d = _c[0], left = _d[0], top = _d[1], right = _d[2], bottom = _d[3], origin = _c[1], pos1 = _c[2], pos2 = _c[3], pos3 = _c[4], pos4 = _c[5], direction = _c[6];
        var n = is3d ? 4 : 3;
        var beforePos = [0, 0];
        _e = caculateMoveablePosition(offsetMatrix, plus(transformOrigin, getOrigin(targetMatrix, n)), width, height), beforePos = _e[0], beforeOrigin = _e[1], beforeDirection = _e[6];
        beforeOrigin = [beforeOrigin[0] + beforePos[0] - left, beforeOrigin[1] + beforePos[1] - top];
      }

      return {
        beforeDirection: beforeDirection,
        direction: direction,
        target: target,
        left: left,
        top: top,
        right: right,
        bottom: bottom,
        pos1: pos1,
        pos2: pos2,
        pos3: pos3,
        pos4: pos4,
        width: width,
        height: height,
        beforeMatrix: beforeMatrix,
        matrix: matrix,
        targetTransform: targetTransform,
        offsetMatrix: offsetMatrix,
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
    function getComputedStyle(el, pseudoElt) {
      return window.getComputedStyle(el, pseudoElt);
    }

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
      var isEnd = eventType === "End";
      var isGroup = eventAffix.indexOf("Group") > -1;
      var ables = moveable[ableType];
      var results = ables.filter(function (able) {
        var condition = isStart && able[conditionName];

        if (able[eventName] && (!condition || condition(e.inputEvent.target, moveable))) {
          return able[eventName](moveable, e);
        }

        return false;
      });
      var isUpdate = results.length;

      if (isEnd) {
        moveable.state.dragger = null;
      }

      if (!isStart && isUpdate) {
        if (results.some(function (able) {
          return able.updateRect;
        }) && !isGroup) {
          moveable.updateRect(eventType);
        } else {
          moveable.updateTarget(eventType);
        }
      } else if (isEnd && !isUpdate) {
        moveable.forceUpdate();
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

    var DragArea = {
      name: "dragArea",
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
            ref: ref$1(moveable, "areaElement"),
            className: prefix("area")
          })];
        }

        if (!target || !dragArea) {
          return [];
        }

        var h = createWarpMatrix([0, 0], [width, 0], [0, height], [width, height], pos1, pos2, pos3, pos4);

        if (!h.length) {
          return [];
        }

        return [React.createElement("div", {
          key: "area",
          ref: ref$1(moveable, "areaElement"),
          className: prefix("area"),
          style: {
            top: "0px",
            left: "0px",
            width: width + "px",
            height: height + "px",
            transform: "matrix3d(" + convertMatrixtoCSS(h).join(",") + ")"
          }
        })];
      }
    };

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

      function MoveableManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

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
          beforeOrigin: [0, 0],
          origin: [0, 0],
          pos1: [0, 0],
          pos2: [0, 0],
          pos3: [0, 0],
          pos4: [0, 0]
        };
        _this.targetAbles = [];
        _this.controlAbles = [];
        return _this;
      }

      var __proto = MoveableManager.prototype;

      __proto.render = function () {
        this.checkUpdate();
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
        this.updateEvent(this.props);
      };

      __proto.componentDidUpdate = function (prevProps, prevState) {
        this.updateEvent(prevProps);
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
        return isInside(pos, pos1, pos2, pos4, pos3);
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

      __proto.updateEvent = function (prevProps) {
        var controlBoxElement = this.controlBox.getElement();
        var hasTargetAble = this.targetAbles.length;
        var hasControlAble = this.controlAbles.length;
        var target = this.props.target;
        var prevTarget = prevProps.target;
        var dragArea = this.props.dragArea;
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
          if (dragArea) {
            this.targetDragger = getAbleDragger(this, this.areaElement, "targetAbles", "");
          } else {
            this.targetDragger = getAbleDragger(this, target, "targetAbles", "");
          }
        }

        if (!this.controlDragger && hasControlAble) {
          this.controlDragger = getAbleDragger(this, controlBoxElement, "controlAbles", "Control");
        }

        if (isUnset) {
          this.unsetAbles();
        }
      };

      __proto.updateTarget = function (type) {
        this.updateRect(type, true);
      };

      __proto.checkUpdate = function () {
        var props = this.props;
        var target = props.target,
            parentMoveable = props.parentMoveable;
        var stateTarget = this.state.target;

        if (!stateTarget && !target) {
          return;
        }

        this.updateAbles();
        var isTargetChanged = stateTarget !== target;

        if (!isTargetChanged) {
          return;
        }

        this.updateState({
          target: target
        });

        if (!parentMoveable) {
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
        var enabledAbles = ables.filter(function (able) {
          return able && props[able.name];
        });
        var controlAbleOnly = false;
        var dragStart = "drag" + eventAffix + "Start";
        var pinchStart = "pinch" + eventAffix + "Start";
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

        var ables = this.targetAbles.concat(this.controlAbles, [Origin, DragArea]);
        var enabledAbles = {};
        return ables.map(function (able) {
          if (enabledAbles[able.name] || !able.render) {
            return undefined;
          }

          enabledAbles[able.name] = true;
          return able.render(_this, React);
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
        pinchThreshold: 20,
        dragArea: false,
        transformOrigin: ""
      };
      return MoveableManager;
    }(PureComponent);

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
        moveable.state.snapDirection = [0, 0];
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

    function triggerChildAble(moveable, able, type, datas, eachEvent, callback) {
      var name = able.name;
      var ableDatas = datas[name] || (datas[name] = []);
      var isEnd = !!type.match(/End$/g);
      var childs = moveable.moveables.map(function (child, i) {
        var childDatas = ableDatas[i] || (ableDatas[i] = {});
        var childEvent = isFunction(eachEvent) ? eachEvent(child, childDatas) : eachEvent;
        var result = able[type](child, __assign$3({}, childEvent, {
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
    function directionCondition(target) {
      return hasClass(target, prefix("direction"));
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
    function getPosesByDirection(_a, direction) {
      var pos1 = _a[0],
          pos2 = _a[1],
          pos3 = _a[2],
          pos4 = _a[3];
      /*
      [-1, -1](pos1)       [0, -1](pos1,pos2)       [1, -1](pos2)
      [-1, 0](pos1, pos3)                           [1, 0](pos2, pos4)
      [-1, 1](pos3)        [0, 1](pos3, pos4)       [1, 1](pos4)
      */

      var poses = [];

      if (direction[1] >= 0) {
        if (direction[0] >= 0) {
          poses.push(pos4);
        }

        if (direction[0] <= 0) {
          poses.push(pos3);
        }
      }

      if (direction[1] <= 0) {
        if (direction[0] >= 0) {
          poses.push(pos2);
        }

        if (direction[0] <= 0) {
          poses.push(pos1);
        }
      }

      return poses;
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
    function getScaleDist(moveable, scale, direction, dragClient) {
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
      var startPos = dragClient ? dragClient : getStartPos(getAbsolutePosesByState(moveable.state), direction);
      var dist = getDist$1(startPos, nextMatrix, width, height, n, direction);
      return minus(dist, [groupLeft, groupTop]);
    }
    function getResizeDist(moveable, width, height, direction, transformOrigin, dragClient) {
      var groupable = moveable.props.groupable;
      var _a = moveable.state,
          prevOrigin = _a.transformOrigin,
          targetMatrix = _a.targetMatrix,
          offsetMatrix = _a.offsetMatrix,
          is3d = _a.is3d,
          prevWidth = _a.width,
          prevheight = _a.height,
          left = _a.left,
          top = _a.top;
      var n = is3d ? 4 : 3;
      var nextOrigin = caculateTransformOrigin(transformOrigin, width, height, prevWidth, prevheight, prevOrigin);
      var groupLeft = groupable ? left : 0;
      var groupTop = groupable ? top : 0;
      var nextMatrix = getNextMatrix(offsetMatrix, targetMatrix, nextOrigin, n);
      var startPos = dragClient ? dragClient : getStartPos(getAbsolutePosesByState(moveable.state), direction);
      var dist = getDist$1(startPos, nextMatrix, width, height, n, direction);
      return minus(dist, [groupLeft, groupTop]);
    }

    var Draggable = {
      name: "draggable",
      dragStart: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY,
            parentEvent = _a.parentEvent,
            parentDragger = _a.parentDragger;
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
        var params = {
          datas: datas.datas,
          target: target,
          clientX: clientX,
          clientY: clientY,
          set: function (translate) {
            datas.startTranslate = translate;
          }
        };
        var result = parentEvent || triggerEvent(moveable, "onDragStart", params);

        if (result !== false) {
          datas.isDrag = true;
        } else {
          state.dragger = null;
          datas.isPinch = false;
        }

        return datas.isDrag ? params : false;
      },
      drag: function (moveable, _a) {
        var datas = _a.datas,
            distX = _a.distX,
            distY = _a.distY,
            clientX = _a.clientX,
            clientY = _a.clientY,
            parentEvent = _a.parentEvent;
        var isPinch = datas.isPinch,
            isDrag = datas.isDrag,
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
        var target = moveable.state.target;
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

        if (!parentEvent && !parentMoveable && delta.every(function (num) {
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
        !parentEvent && triggerEvent(moveable, "onDrag", params);
        return params;
      },
      dragEnd: function (moveable, _a) {
        var parentEvent = _a.parentEvent,
            datas = _a.datas,
            isDrag = _a.isDrag,
            clientX = _a.clientX,
            clientY = _a.clientY;

        if (!datas.isDrag) {
          return;
        }

        moveable.state.dragger = null;
        datas.isDrag = false;
        !parentEvent && triggerEvent(moveable, "onDragEnd", {
          target: moveable.state.target,
          isDrag: isDrag,
          clientX: clientX,
          clientY: clientY,
          datas: datas.datas
        });
        return isDrag;
      },
      dragGroupCondition: function (target) {
        return hasClass(target, prefix("area"));
      },
      dragGroupStart: function (moveable, e) {
        var datas = e.datas;
        var params = this.dragStart(moveable, e);

        if (!params) {
          return false;
        }

        var events = triggerChildAble(moveable, this, "dragStart", datas, e);

        var nextParams = __assign$3({}, params, {
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

        var events = triggerChildAble(moveable, this, "drag", datas, e);
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

        this.dragEnd(moveable, e);
        triggerChildAble(moveable, this, "dragEnd", datas, e);
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

    function setCustomDrag(state, delta, inputEvent) {
      return __assign$3({}, state.dragger.move(delta, inputEvent), {
        parentEvent: true
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
        this.datas = {};
      }

      var __proto = CustomDragger.prototype;

      __proto.dragStart = function (client, inputEvent) {
        this.isDrag = false;
        this.isFlag = false;
        this.datas = {};
        return this.move(client, inputEvent);
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
          clientX: clientX,
          clientY: clientY,
          inputEvent: inputEvent,
          isDrag: this.isDrag,
          distX: clientX - this.startX,
          distY: clientY - this.startY,
          deltaX: delta[0],
          deltaY: delta[1],
          datas: this.datas,
          parentEvent: true,
          parentDragger: this
        };
      };

      return CustomDragger;
    }();

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

    function getPositions$1(rotationPosition, pos1, pos2, pos3, pos4) {
      if (rotationPosition === "left") {
        return [pos3, pos1];
      } else if (rotationPosition === "right") {
        return [pos2, pos4];
      } else if (rotationPosition === "bottom") {
        return [pos4, pos3];
      }

      return [pos1, pos2];
    }
    function getRotationRad(poses, direction) {
      return getRad(direction > 0 ? poses[0] : poses[1], direction > 0 ? poses[1] : poses[0]);
    }
    function getRotationPosition(_a, rad) {
      var pos1 = _a[0],
          pos2 = _a[1];
      var relativeRotationPos = rotate([0, -40, 1], rad);
      var rotationPos = [(pos1[0] + pos2[0]) / 2 + relativeRotationPos[0], (pos1[1] + pos2[1]) / 2 + relativeRotationPos[1]];
      return rotationPos;
    }

    function dragControlCondition(target) {
      return hasClass(target, prefix("rotation"));
    }

    var Rotatable = {
      name: "rotatable",
      canPinch: true,
      render: function (moveable, React) {
        var _a = moveable.props,
            rotatable = _a.rotatable,
            rotationPosition = _a.rotationPosition;

        if (!rotatable) {
          return null;
        }

        var _b = moveable.state,
            pos1 = _b.pos1,
            pos2 = _b.pos2,
            pos3 = _b.pos3,
            pos4 = _b.pos4,
            direction = _b.direction;
        var poses = getPositions$1(rotationPosition, pos1, pos2, pos3, pos4);
        var rotationRad = getRotationRad(poses, direction);
        return React.createElement("div", {
          key: "rotation",
          className: prefix("line rotation-line"),
          style: {
            // tslint:disable-next-line: max-line-length
            transform: "translate(" + (poses[0][0] + poses[1][0]) / 2 + "px, " + (poses[0][1] + poses[1][1]) / 2 + "px) translateY(-40px) rotate(" + rotationRad + "rad)"
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
            direction = _b.direction,
            beforeDirection = _b.beforeDirection,
            targetTransform = _b.targetTransform,
            pos1 = _b.pos1,
            pos2 = _b.pos2,
            pos3 = _b.pos3,
            pos4 = _b.pos4;

        if (!target) {
          return false;
        }

        datas.transform = targetTransform;
        datas.left = left;
        datas.top = top;
        var poses = getPositions$1(moveable.props.rotationPosition, pos1, pos2, pos3, pos4);
        var rotationPos = getRotationPosition(poses, getRotationRad(poses, direction));

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

        var events = triggerChildAble(moveable, this, "dragControlStart", datas, __assign$3({}, e, {
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
        var rad = deg / 180 * Math.PI;
        var events = triggerChildAble(moveable, this, "dragControl", datas, __assign$3({}, e, {
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
          var dragResult = Draggable.drag(child, setCustomDrag(child.state, delta, inputEvent));
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
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);
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

    function snapStart(moveable, _a) {
      var datas = _a.datas;
      var state = moveable.state;

      if (state.guidelines && state.guidelines.length) {
        return;
      }

      var _b = moveable.props,
          _c = _b.horizontalGuidelines,
          horizontalGuidelines = _c === void 0 ? [] : _c,
          _d = _b.verticalGuidelines,
          verticalGuidelines = _d === void 0 ? [] : _d,
          _e = _b.elementGuildelines,
          elementGuildelines = _e === void 0 ? [] : _e,
          bounds = _b.bounds,
          container = _b.container,
          snapCenter = _b.snapCenter;

      if (!bounds && !horizontalGuidelines.length && !verticalGuidelines.length && !elementGuildelines.length) {
        return;
      }

      var containerRect = (container || document.documentElement).getBoundingClientRect();
      var containerTop = containerRect.top,
          containerLeft = containerRect.left,
          containerWidth = containerRect.width,
          containerHeight = containerRect.height;
      var guidelines = [];
      horizontalGuidelines.forEach(function (pos) {
        guidelines.push({
          type: "horizontal",
          pos: [0, pos],
          size: containerWidth
        });
      });
      verticalGuidelines.forEach(function (pos) {
        guidelines.push({
          type: "vertical",
          pos: [pos, 0],
          size: containerHeight
        });
      });
      elementGuildelines.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var top = rect.top,
            left = rect.left,
            width = rect.width,
            height = rect.height;
        var elementTop = top - containerTop;
        var elementBottom = elementTop + height;
        var elementLeft = left - containerLeft;
        var elementRight = elementLeft + width;
        guidelines.push({
          type: "vertical",
          element: el,
          pos: [elementLeft, elementTop],
          size: height
        });
        guidelines.push({
          type: "vertical",
          element: el,
          pos: [elementRight, elementTop],
          size: height
        });
        guidelines.push({
          type: "horizontal",
          element: el,
          pos: [elementLeft, elementTop],
          size: width
        });
        guidelines.push({
          type: "horizontal",
          element: el,
          pos: [elementLeft, elementBottom],
          size: width
        });

        if (snapCenter) {
          guidelines.push({
            type: "vertical",
            element: el,
            pos: [(elementLeft + elementRight) / 2, elementTop],
            size: height,
            center: true
          });
          guidelines.push({
            type: "horizontal",
            element: el,
            pos: [elementLeft, (elementTop + elementBottom) / 2],
            size: width,
            center: true
          });
        }
      });
      var pos1 = state.pos1,
          pos2 = state.pos2,
          pos3 = state.pos3,
          pos4 = state.pos4,
          targetLeft = state.left,
          targetTop = state.top;
      var startLeft = targetLeft + Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
      var startRight = targetLeft + Math.max(pos1[0], pos2[0], pos3[0], pos4[0]);
      var startTop = targetTop + Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);
      var startBottom = targetTop + Math.max(pos1[1], pos2[1], pos3[1], pos4[1]);
      state.guidelines = guidelines;
      state.startLeft = startLeft;
      state.startRight = startRight;
      state.startTop = startTop;
      state.startBottom = startBottom;
    }

    function checkBounds(moveable, verticalPoses, horizontalPoses, snapThreshold) {
      return {
        vertical: checkBound(moveable, verticalPoses, true, snapThreshold),
        horizontal: checkBound(moveable, horizontalPoses, false, snapThreshold)
      };
    }

    function checkBound(moveable, poses, isVertical, snapThreshold) {
      if (snapThreshold === void 0) {
        snapThreshold = 0;
      }

      var bounds = moveable.props.bounds;

      if (bounds) {
        var startPos = bounds[isVertical ? "left" : "top"];
        var endPos = bounds[isVertical ? "right" : "bottom"];
        var minPos = Math.min.apply(Math, poses);
        var maxPos = Math.max.apply(Math, poses);

        if (!isUndefined$1(startPos) && startPos + snapThreshold > minPos) {
          return {
            isBound: true,
            offset: minPos - startPos,
            pos: startPos
          };
        }

        if (!isUndefined$1(endPos) && endPos - snapThreshold < maxPos) {
          return {
            isBound: true,
            offset: maxPos - endPos,
            pos: endPos
          };
        }
      }

      return {
        isBound: false,
        offset: 0,
        pos: 0
      };
    }

    function checkSnap(guidelines, targetType, targetPoses, isSnapCenter, snapThreshold) {
      if (!guidelines) {
        return {
          isSnap: false,
          dist: -1,
          offset: 0,
          guidelines: [],
          snapPoses: []
        };
      }

      var snapGuidelines = [];
      var snapDist = Infinity;
      var snapOffset = 0;
      var isVertical = targetType === "vertical";
      var posType = isVertical ? 0 : 1;
      var snapPoses = targetPoses.filter(function (targetPos) {
        return guidelines.filter(function (guideline) {
          var type = guideline.type,
              pos = guideline.pos,
              center = guideline.center;

          if (!isSnapCenter && center || type !== targetType) {
            return false;
          }

          var offset = targetPos - pos[posType];
          var dist = Math.abs(offset);

          if (dist > snapThreshold) {
            return false;
          }

          if (snapDist > dist) {
            snapDist = dist;
            snapGuidelines = [];
          }

          if (snapDist === dist) {
            snapOffset = offset;
            snapGuidelines.push(guideline);
          }

          return true;
        }).length;
      });
      return {
        isSnap: !!snapGuidelines.length,
        dist: isFinite(snapDist) ? snapDist : -1,
        offset: snapOffset,
        guidelines: snapGuidelines,
        snapPoses: snapPoses
      };
    }

    function hasGuidelines(moveable, ableName) {
      var _a = moveable.props,
          snappable = _a.snappable,
          bounds = _a.bounds,
          guidelines = moveable.state.guidelines;

      if (!snappable || ableName && snappable !== true && snappable.indexOf(ableName) || !bounds && (!guidelines || !guidelines.length)) {
        return false;
      }

      return true;
    }
    function checkSnapPoses(moveable, posesX, posesY, isSnapCenter, customSnapThreshold) {
      var guidelines = moveable.state.guidelines;
      var snapThreshold = !isUndefined$1(customSnapThreshold) ? customSnapThreshold : !isUndefined$1(moveable.props.snapThreshold) ? moveable.props.snapThreshold : 5;
      return {
        vertical: checkSnap(guidelines, "vertical", posesX, isSnapCenter, snapThreshold),
        horizontal: checkSnap(guidelines, "horizontal", posesY, isSnapCenter, snapThreshold)
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
    function checkSizeDist(moveable, matrix, width, height, direction, snapDirection, datas, is3d) {
      var poses = getAbsolutePosesByState(moveable.state);
      var fixedPos = getPosByReverseDirection(poses, snapDirection);
      var nextPoses = caculatePoses(matrix, width, height, is3d ? 4 : 3);
      var nextPos = getPosByReverseDirection(nextPoses, direction);

      var _a = getAbsolutePoses(nextPoses, minus(fixedPos, nextPos)),
          pos1 = _a[0],
          pos2 = _a[1],
          pos3 = _a[2],
          pos4 = _a[3];

      var directionPoses = getPosesByDirection([pos1, pos2, pos3, pos4], direction);

      if (direction[0] && direction[1]) {
        var _b = checkSnapPoses(moveable, [directionPoses[0][0]], [directionPoses[0][1]]),
            horizontalOffset = _b.horizontal.offset,
            verticalOffset = _b.vertical.offset;

        var _c = checkBounds(moveable, [directionPoses[0][0]], [directionPoses[0][1]]),
            _d = _c.horizontal,
            isHorizontalBound = _d.isBound,
            horizontalBoundOffset = _d.offset,
            _e = _c.vertical,
            isVerticalBound = _e.isBound,
            verticalBoundOffset = _e.offset; // share drag event


        var _f = getDragDist({
          datas: datas,
          distX: isVerticalBound ? verticalBoundOffset : verticalOffset,
          distY: isHorizontalBound ? horizontalBoundOffset : horizontalOffset
        }),
            widthDist = _f[0],
            heightDist = _f[1];

        return [-direction[0] * widthDist, -direction[1] * heightDist];
      } else {
        var directionIndex_1 = direction[0] !== 0 ? 0 : 1;
        var reverseDirectionPoses_1 = getPosesByDirection([pos4, pos3, pos2, pos1], direction);
        var posOffset_1 = 0;
        directionPoses.push([(directionPoses[0][0] + directionPoses[1][0]) / 2, (directionPoses[0][1] + directionPoses[1][1]) / 2]);
        reverseDirectionPoses_1.reverse();
        reverseDirectionPoses_1.push([(reverseDirectionPoses_1[0][0] + reverseDirectionPoses_1[1][0]) / 2, (reverseDirectionPoses_1[0][1] + reverseDirectionPoses_1[1][1]) / 2]);
        directionPoses.some(function (directionPos, i) {
          var snapInfos = checkSnapPoses(moveable, [directionPos[0]], [directionPos[1]]);
          var _a = snapInfos.horizontal,
              isHorizontalSnap = _a.isSnap,
              horizontalSnapOffset = _a.offset,
              horizontalDist = _a.dist,
              _b = snapInfos.vertical,
              isVerticalSnap = _b.isSnap,
              verticalSnapOffset = _b.offset,
              verticalDist = _b.dist;

          var _c = checkBounds(moveable, [directionPos[0]], [directionPos[1]]),
              _d = _c.horizontal,
              isHorizontalBound = _d.isBound,
              horizontalBoundOffset = _d.offset,
              _e = _c.vertical,
              isVerticalBound = _e.isBound,
              verticalBoundOffset = _e.offset;

          var fixedHorizontal = reverseDirectionPoses_1[i][1] === directionPos[1];
          var fixedVertical = reverseDirectionPoses_1[i][0] === directionPos[0];
          var isVertical;
          var horizontalOffset = isHorizontalBound || isVerticalBound ? horizontalBoundOffset : horizontalSnapOffset;
          var verticalOffset = isHorizontalBound || isVerticalBound ? verticalBoundOffset : verticalSnapOffset;

          if (isHorizontalBound && isVerticalBound) {
            if (fixedHorizontal) {
              isVertical = true;
            } else if (fixedVertical) {
              isVertical = false;
            } else {
              isVertical = Math.abs(horizontalBoundOffset) < Math.abs(verticalBoundOffset);
            }
          } else if (isHorizontalBound || isVerticalBound) {
            isVertical = isVerticalBound;
          } else if (!isHorizontalSnap && !isVerticalSnap) {
            // no snap
            return false;
          } else if (isHorizontalSnap && isVerticalSnap) {
            if (horizontalDist === 0 && fixedHorizontal) {
              isVertical = true;
            } else if (verticalOffset === 0 && fixedVertical) {
              isVertical = false;
            } else {
              isVertical = horizontalDist > verticalDist;
            }
          } else {
            isVertical = isVerticalSnap;
          }

          var sizeOffset = solveEquation(reverseDirectionPoses_1[i], directionPos, -(isVertical ? verticalOffset : horizontalOffset), isVertical);

          if (!sizeOffset) {
            return false;
          }

          var _f = getDragDist({
            datas: datas,
            distX: sizeOffset[0],
            distY: sizeOffset[1]
          }),
              widthDist = _f[0],
              heightDist = _f[1];

          posOffset_1 = direction[directionIndex_1] * (directionIndex_1 ? heightDist : widthDist);
          return true;
        });
        var offset = [0, 0];
        offset[directionIndex_1] = posOffset_1;
        return offset;
      }
    }
    function checkSnapSize(moveable, width, height, direction, datas) {
      var nextSizes = [width, height];

      if (!hasGuidelines(moveable, "resizable")) {
        return nextSizes;
      }

      var _a = moveable.state,
          matrix = _a.matrix,
          is3d = _a.is3d;
      return plus(nextSizes, checkSizeDist(moveable, matrix, width, height, direction, direction, datas, is3d));
    }
    function checkSnapScale(moveable, scale, direction, snapDirection, datas) {
      var width = datas.width,
          height = datas.height;
      var nextScale = scale.slice();

      if (!hasGuidelines(moveable, "scalable")) {
        return nextScale;
      }

      var sizeDist = checkSizeDist(moveable, scaleMatrix(datas, scale), width, height, direction, snapDirection, datas, datas.is3d);
      return [scale[0] + sizeDist[0] / width, scale[1] + sizeDist[1] / height];
    }
    function solveEquation(pos1, pos2, snapOffset, isVertical) {
      var dx = pos2[0] - pos1[0];
      var dy = pos2[1] - pos1[1];

      if (!dx) {
        // y = 0 * x + b
        // only horizontal
        if (!isVertical) {
          return [0, snapOffset];
        }

        return;
      }

      if (!dy) {
        // only vertical
        if (isVertical) {
          return [snapOffset, 0];
        }

        return;
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
    function getSnapInfosByDirection(moveable, poses, snapDirection) {
      if (snapDirection === true) {
        var rect = getRect(poses);
        rect.middle = (rect.top + rect.bottom) / 2;
        rect.center = (rect.left + rect.right) / 2;
        return checkSnaps(moveable, rect, true, 1);
      } else if (!snapDirection[0] && !snapDirection[1]) {
        var alignPoses = [poses[0], poses[1], poses[3], poses[2], poses[0]];
        var nextPoses = [];

        for (var i = 0; i < 4; ++i) {
          nextPoses.push(alignPoses[i]);
          poses.push([(alignPoses[i][0] + alignPoses[i + 1][0]) / 2, (alignPoses[i][1] + alignPoses[i + 1][1]) / 2]);
        }

        return checkSnapPoses(moveable, nextPoses.map(function (pos) {
          return pos[0];
        }), nextPoses.map(function (pos) {
          return pos[1];
        }), true, 1);
      } else {
        var nextPoses = getPosesByDirection(poses, snapDirection);

        if (nextPoses.length > 1) {
          nextPoses.push([(nextPoses[0][0] + nextPoses[1][0]) / 2, (nextPoses[0][1] + nextPoses[1][1]) / 2]);
        }

        return checkSnapPoses(moveable, nextPoses.map(function (pos) {
          return pos[0];
        }), nextPoses.map(function (pos) {
          return pos[1];
        }), true, 1);
      }
    }
    var Snappable = {
      name: "snappable",
      render: function (moveable, React) {
        var _a = moveable.state,
            targetLeft = _a.left,
            targetTop = _a.top,
            snapDirection = _a.snapDirection;

        if (!snapDirection || !hasGuidelines(moveable, "")) {
          return [];
        }

        var poses = getAbsolutePosesByState(moveable.state);

        var _b = getRect(poses),
            width = _b.width,
            height = _b.height,
            top = _b.top,
            left = _b.left,
            bottom = _b.bottom,
            right = _b.right;

        var _c = getSnapInfosByDirection(moveable, poses, snapDirection),
            _d = _c.vertical,
            verticalGuildelines = _d.guidelines,
            verticalSnapPoses = _d.snapPoses,
            _e = _c.horizontal,
            horizontalGuidelines = _e.guidelines,
            horizontalSnapPoses = _e.snapPoses;

        var _f = checkBounds(moveable, [left, right], [top, bottom], 1),
            _g = _f.vertical,
            isVerticalBound = _g.isBound,
            verticalBoundPos = _g.pos,
            _h = _f.horizontal,
            isHorizontalBound = _h.isBound,
            horizontalBoundPos = _h.pos;

        if (isVerticalBound && verticalSnapPoses.indexOf(verticalBoundPos) < 0) {
          verticalGuildelines.push({
            type: "vertical",
            pos: [verticalBoundPos, top],
            size: height
          });
          verticalSnapPoses.push(verticalBoundPos);
        }

        if (isHorizontalBound && horizontalSnapPoses.indexOf(horizontalBoundPos) < 0) {
          horizontalGuidelines.push({
            type: "horizontal",
            pos: [top, verticalBoundPos],
            size: width
          });
          horizontalSnapPoses.push(horizontalBoundPos);
        }

        return verticalSnapPoses.map(function (pos, i) {
          return React.createElement("div", {
            className: prefix("line", "vertical", "guideline", "target", "bold"),
            key: "verticalTargetGuidline" + i,
            style: {
              top: 0 + "px",
              left: -targetLeft + pos + "px",
              height: height + "px"
            }
          });
        }).concat(horizontalSnapPoses.map(function (pos, i) {
          return React.createElement("div", {
            className: prefix("line", "horizontal", "guideline", "target", "bold"),
            key: "horizontalTargetGuidline" + i,
            style: {
              top: -targetTop + pos + "px",
              left: 0 + "px",
              width: width + "px"
            }
          });
        }), verticalGuildelines.map(function (guideline, i) {
          var pos = guideline.pos,
              size = guideline.size,
              element = guideline.element;
          return React.createElement("div", {
            className: prefix("line", "vertical", "guideline", element ? "bold" : ""),
            key: "verticalGuidline" + i,
            style: {
              top: -targetTop + pos[1] + "px",
              left: -targetLeft + pos[0] + "px",
              height: size + "px"
            }
          });
        }), horizontalGuidelines.map(function (guideline, i) {
          var pos = guideline.pos,
              size = guideline.size,
              element = guideline.element;
          return React.createElement("div", {
            className: prefix("line", "horizontal", "guideline", element ? "bold" : ""),
            key: "horizontalGuidline" + i,
            style: {
              top: -targetTop + pos[1] + "px",
              left: -targetLeft + pos[0] + "px",
              width: size + "px"
            }
          });
        }));
      },
      dragStart: function (moveable, e) {
        moveable.state.snapDirection = true;
        snapStart(moveable, e);
      },
      drag: function (moveable, e) {
        var clientX = e.clientX,
            clientY = e.clientY,
            distX = e.distX,
            distY = e.distY;
        var _a = moveable.state,
            startLeft = _a.startLeft,
            startTop = _a.startTop,
            startBottom = _a.startBottom,
            startRight = _a.startRight;

        if (!hasGuidelines(moveable, "draggable")) {
          return false;
        }

        var left = startLeft + distX;
        var right = startRight + distX;
        var center = (left + right) / 2;
        var top = startTop + distY;
        var bottom = startBottom + distY;
        var middle = (top + bottom) / 2;
        var snapInfos = checkSnaps(moveable, {
          left: left,
          right: right,
          top: top,
          bottom: bottom,
          center: center,
          middle: middle
        }, true);
        var boundInfos = checkBounds(moveable, [left, right], [top, bottom]);
        var offsetX = 0;
        var offsetY = 0;
        console.log(checkBounds(moveable, [left, right], [top, bottom]).vertical.isBound);

        if (boundInfos.vertical.isBound) {
          offsetX = boundInfos.vertical.offset;
        } else if (snapInfos.vertical.isSnap) {
          // has vertical guidelines
          offsetX = snapInfos.vertical.offset;
        }

        if (boundInfos.horizontal.isBound) {
          offsetY = boundInfos.horizontal.offset;
        } else if (snapInfos.horizontal.isSnap) {
          // has horizontal guidelines
          offsetY = snapInfos.horizontal.offset;
        }

        e.clientX = clientX - offsetX;
        e.clientY = clientY - offsetY;
        e.distX = distX - offsetX;
        e.distY = distY - offsetY;
      },
      dragEnd: function (moveable) {
        moveable.state.guidelines = [];
        moveable.state.snapDirection = null;
      },
      dragControlCondition: directionCondition,
      dragControlStart: function (moveable, e) {
        moveable.state.snapDirection = null;
        snapStart(moveable, e);
      },
      dragControlEnd: function (moveable) {
        this.dragEnd(moveable);
      },
      dragGroupStart: function (moveable, e) {
        moveable.state.snapDirection = true;
        snapStart(moveable, e);
      },
      dragGroup: function (moveable, e) {
        this.drag(moveable, e);
      },
      dragGroupEnd: function (moveable) {
        this.dragEnd(moveable);
      },
      dragGroupControlStart: function (moveable, e) {
        moveable.state.snapDirection = null;
        snapStart(moveable, e);
      },
      dragGroupControlEnd: function (moveable) {
        this.dragEnd(moveable);
      },
      unset: function (moveable) {
        this.dragEnd(moveable);
      }
    };

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
        var inputEvent = e.inputEvent,
            pinchFlag = e.pinchFlag,
            clientX = e.clientX,
            clientY = e.clientY,
            datas = e.datas;
        var inputTarget = inputEvent.target;
        var direction = pinchFlag ? [1, 1] : getDirection(inputTarget);
        var _a = moveable.state,
            target = _a.target,
            width = _a.width,
            height = _a.height;

        if (!direction || !target) {
          return false;
        }

        !pinchFlag && setDragStart(moveable, {
          datas: datas
        });
        datas.datas = {};
        datas.direction = direction;
        datas.offsetWidth = width;
        datas.offsetHeight = height;
        datas.prevWidth = 0;
        datas.prevHeight = 0;
        datas.width = width;
        datas.height = height;
        datas.transformOrigin = moveable.props.transformOrigin;
        var params = {
          datas: datas.datas,
          target: target,
          clientX: clientX,
          clientY: clientY,
          direction: direction,
          set: function (_a) {
            var startWidth = _a[0],
                startHeight = _a[1];
            datas.width = startWidth;
            datas.height = startHeight;
          },
          setOrigin: function (origin) {
            datas.transformOrigin = origin;
          },
          dragStart: Draggable.dragStart(moveable, new CustomDragger().dragStart([0, 0], inputEvent))
        };
        var result = triggerEvent(moveable, "onResizeStart", params);

        if (result !== false) {
          datas.isResize = true;
          moveable.state.snapDirection = direction;
        }

        return datas.isResize ? params : false;
      },
      dragControl: function (moveable, e) {
        var _a;

        var datas = e.datas,
            clientX = e.clientX,
            clientY = e.clientY,
            distX = e.distX,
            distY = e.distY,
            parentFlag = e.parentFlag,
            pinchFlag = e.pinchFlag,
            parentDistance = e.parentDistance,
            parentScale = e.parentScale,
            inputEvent = e.inputEvent,
            dragClient = e.dragClient;
        var direction = datas.direction,
            width = datas.width,
            height = datas.height,
            offsetWidth = datas.offsetWidth,
            offsetHeight = datas.offsetHeight,
            prevWidth = datas.prevWidth,
            prevHeight = datas.prevHeight,
            isResize = datas.isResize,
            transformOrigin = datas.transformOrigin;

        if (!isResize) {
          return;
        }

        var _b = moveable.props,
            keepRatio = _b.keepRatio,
            _c = _b.throttleResize,
            throttleResize = _c === void 0 ? 0 : _c,
            parentMoveable = _b.parentMoveable;
        var target = moveable.state.target; // checkSnapSize(moveable as any, e, 1);

        var distWidth = 0;
        var distHeight = 0; // diagonal

        if (parentScale) {
          distWidth = (parentScale[0] - 1) * offsetWidth;
          distHeight = (parentScale[1] - 1) * offsetHeight;
        } else if (pinchFlag) {
          if (parentDistance) {
            distWidth = parentDistance;
            distHeight = parentDistance * offsetHeight / offsetWidth;
          }
        } else {
          var dist = getDragDist({
            datas: datas,
            distX: distX,
            distY: distY
          });
          distWidth = direction[0] * dist[0];
          distHeight = direction[1] * dist[1];

          if (keepRatio && direction[0] && direction[1] && offsetWidth && offsetHeight) {
            var size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
            var rad = getRad([0, 0], dist);
            var standardRad = getRad([0, 0], direction);
            var distDiagonal = Math.cos(rad - standardRad) * size;
            distWidth = distDiagonal;
            distHeight = distDiagonal * offsetHeight / offsetWidth;
          }
        }

        var nextWidth = direction[0] ? Math.round(throttle(Math.max(offsetWidth + distWidth, 0), throttleResize)) : offsetWidth;
        var nextHeight = direction[1] ? Math.round(throttle(Math.max(offsetHeight + distHeight, 0), throttleResize)) : offsetHeight;
        _a = checkSnapSize(moveable, nextWidth, nextHeight, direction, datas), nextWidth = _a[0], nextHeight = _a[1];
        distWidth = nextWidth - offsetWidth;
        distHeight = nextHeight - offsetHeight;
        var delta = [distWidth - prevWidth, distHeight - prevHeight];
        datas.prevWidth = distWidth;
        datas.prevHeight = distHeight;

        if (!parentMoveable && delta.every(function (num) {
          return !num;
        })) {
          return;
        }

        var inverseDelta = !parentFlag && pinchFlag ? [0, 0] : getResizeDist(moveable, nextWidth, nextHeight, direction, transformOrigin, dragClient);
        var params = {
          target: target,
          width: width + distWidth,
          height: height + distHeight,
          offsetWidth: nextWidth,
          offsetHeight: nextHeight,
          direction: direction,
          dist: [distWidth, distHeight],
          datas: datas.datas,
          delta: delta,
          clientX: clientX,
          clientY: clientY,
          isPinch: !!pinchFlag,
          drag: Draggable.drag(moveable, setCustomDrag(moveable.state, inverseDelta, inputEvent))
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
        var datas = e.datas;
        var params = this.dragControlStart(moveable, e);

        if (!params) {
          return false;
        }

        var direction = params.direction;
        var startPos = getPosByReverseDirection(getAbsolutePosesByState(moveable.state), direction);
        var events = triggerChildAble(moveable, this, "dragControlStart", datas, function (child, childDatas) {
          var pos = getPosByReverseDirection(getAbsolutePosesByState(child.state), direction);

          var _a = caculate(createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3), [pos[0] - startPos[0], pos[1] - startPos[1], 1], 3),
              originalX = _a[0],
              originalY = _a[1];

          childDatas.originalX = originalX;
          childDatas.originalY = originalY;
          return e;
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
            dist = params.dist,
            direction = params.direction;
        var parentScale = [offsetWidth / (offsetWidth - dist[0]), offsetHeight / (offsetHeight - dist[1])];
        var prevPos = getPosByReverseDirection(getAbsolutePosesByState(moveable.state), direction);
        var events = triggerChildAble(moveable, this, "dragControl", datas, function (_, childDatas) {
          var _a = caculate(createRotateMatrix(moveable.rotation / 180 * Math.PI, 3), [childDatas.originalX * parentScale[0], childDatas.originalY * parentScale[1], 1], 3),
              clientX = _a[0],
              clientY = _a[1];

          return __assign$3({}, e, {
            parentScale: parentScale,
            dragClient: plus(prevPos, [clientX, clientY])
          });
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
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);
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
      dragControlStart: function (moveable, e) {
        var datas = e.datas,
            clientX = e.clientX,
            clientY = e.clientY,
            pinchFlag = e.pinchFlag,
            inputEvent = e.inputEvent;
        var inputTarget = inputEvent.target;
        var direction = pinchFlag ? [1, 1] : getDirection(inputTarget);
        var _a = moveable.state,
            width = _a.width,
            height = _a.height,
            targetTransform = _a.targetTransform,
            target = _a.target;

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
          direction: direction,
          set: function (scale) {
            datas.startScale = scale;
          },
          dragStart: Draggable.dragStart(moveable, new CustomDragger().dragStart([0, 0], inputEvent))
        };
        var result = triggerEvent(moveable, "onScaleStart", params);

        if (result !== false) {
          datas.isScale = true;
          moveable.state.snapDirection = direction;
        }

        return datas.isScale ? params : false;
      },
      dragControl: function (moveable, e) {
        var datas = e.datas,
            clientX = e.clientX,
            clientY = e.clientY,
            distX = e.distX,
            distY = e.distY,
            parentScale = e.parentScale,
            parentDistance = e.parentDistance,
            parentFlag = e.parentFlag,
            pinchFlag = e.pinchFlag,
            inputEvent = e.inputEvent,
            dragClient = e.dragClient;
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
            keepRatio = _a.keepRatio,
            throttleScale = _a.throttleScale,
            parentMoveable = _a.parentMoveable;
        var state = moveable.state;
        var target = state.target;
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

          scaleX = (width + distWidth) / width;
          scaleY = (height + distHeight) / height;
        }

        scaleX = direction[0] ? throttle(scaleX * startScale[0], throttleScale) : startScale[0];
        scaleY = direction[1] ? throttle(scaleY * startScale[1], throttleScale) : startScale[1];

        if (scaleX === 0) {
          scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
        }

        if (scaleY === 0) {
          scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
        }

        var scale = [scaleX, scaleY];
        var nowDist = [scaleX / startScale[0], scaleY / startScale[1]];
        var snapDirection = direction;

        if (moveable.props.groupable) {
          snapDirection = [(nowDist[0] >= 0 ? 1 : -1) * direction[0], (nowDist[1] >= 0 ? 1 : -1) * direction[1]];
          var stateDirection = state.snapDirection;

          if (isArray(stateDirection) && (stateDirection[0] || stateDirection[1])) {
            state.snapDirection = snapDirection;
          }
        }

        nowDist = checkSnapScale(moveable, nowDist, direction, snapDirection, datas);
        var delta = [nowDist[0] / prevDist[0], nowDist[1] / prevDist[1]]; // const prevScale = scale;

        scale = multiply2(nowDist, startScale);
        datas.prevDist = nowDist;

        if (scaleX === prevDist[0] && scaleY === prevDist[1] && !parentMoveable) {
          return false;
        }

        var inverseDelta = !parentFlag && pinchFlag ? [0, 0] : getScaleDist(moveable, delta, direction, dragClient);
        var params = {
          target: target,
          scale: scale,
          direction: direction,
          dist: nowDist,
          delta: delta,
          transform: transform + " scale(" + scaleX + ", " + scaleY + ")",
          clientX: clientX,
          clientY: clientY,
          datas: datas.datas,
          isPinch: !!pinchFlag,
          drag: Draggable.drag(moveable, setCustomDrag(moveable.state, inverseDelta, inputEvent))
        };
        triggerEvent(moveable, "onScale", params);
        return params;
      },
      dragControlEnd: function (moveable, _a) {
        var datas = _a.datas,
            isDrag = _a.isDrag,
            clientX = _a.clientX,
            clientY = _a.clientY;

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
        var datas = e.datas;
        var params = this.dragControlStart(moveable, e);

        if (!params) {
          return false;
        }

        var direction = params.direction;
        var startPos = getPosByReverseDirection(getAbsolutePosesByState(moveable.state), direction);
        var events = triggerChildAble(moveable, this, "dragControlStart", datas, function (child, childDatas) {
          var pos = getPosByReverseDirection(getAbsolutePosesByState(child.state), direction);

          var _a = caculate(createRotateMatrix(-moveable.rotation / 180 * Math.PI, 3), [pos[0] - startPos[0], pos[1] - startPos[1], 1], 3),
              originalX = _a[0],
              originalY = _a[1];

          childDatas.originalX = originalX;
          childDatas.originalY = originalY;
          return e;
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
        var datas = e.datas;

        if (!datas.isScale) {
          return;
        }

        var params = this.dragControl(moveable, e);

        if (!params) {
          return;
        }

        var scale = params.scale,
            direction = params.direction,
            dist = params.dist;
        var prevPos = getPosByReverseDirection(getAbsolutePosesByState(moveable.state), multiply2(direction, dist));
        var events = triggerChildAble(moveable, this, "dragControl", datas, function (_, childDatas) {
          var _a = caculate(createRotateMatrix(moveable.rotation / 180 * Math.PI, 3), [childDatas.originalX * scale[0], childDatas.originalY * scale[1], 1], 3),
              clientX = _a[0],
              clientY = _a[1];

          return __assign$3({}, e, {
            parentScale: scale,
            dragClient: plus(prevPos, [clientX, clientY])
          });
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
        triggerChildAble(moveable, this, "dragControlEnd", datas, e);
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
        var target = moveable.props.target;
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
        datas.poses = [[0, 0], [width, 0], [0, height], [width, height]].map(function (p, i) {
          return minus(p, transformOrigin);
        });
        datas.nextPoses = datas.poses.map(function (_a) {
          var x = _a[0],
              y = _a[1];
          return caculate(datas.warpTargetMatrix, [x, y, 0, 1], 4);
        });
        datas.posNum = (direction[0] === -1 ? 0 : 1) + (direction[1] === -1 ? 0 : 2);
        datas.startMatrix = createIdentityMatrix(4);
        datas.prevMatrix = createIdentityMatrix(4);
        datas.absolutePos = getAbsolutePosesByState(state)[datas.posNum];
        state.snapDirection = direction;
        var result = triggerEvent(moveable, "onWarpStart", {
          target: target,
          clientX: clientX,
          clientY: clientY,
          datas: datas.datas,
          set: function (matrix) {
            datas.startMatrix = matrix;
          }
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
            isWarp = datas.isWarp,
            absolutePos = datas.absolutePos,
            startMatrix = datas.startMatrix;

        if (!isWarp) {
          return false;
        }

        var target = moveable.props.target;

        if (hasGuidelines(moveable, "warpable")) {
          var snapInfos = checkSnapPoses(moveable, [absolutePos[0] + distX], [absolutePos[1] + distY]);
          var horizontalOffset = snapInfos.horizontal.offset,
              verticalOffset = snapInfos.vertical.offset;
          distY -= horizontalOffset;
          distX -= verticalOffset;
        }

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

        var h = createWarpMatrix(poses[0], poses[1], poses[2], poses[3], nextPoses[0], nextPoses[1], nextPoses[2], nextPoses[3]);

        if (!h.length) {
          return false;
        }

        var matrix = convertMatrixtoCSS(multiply(targetInverseMatrix, h, 4));
        var transform = datas.targetTransform + " matrix3d(" + matrix.join(",") + ")";
        var delta = multiply(invert(prevMatrix, 4), matrix, 4);
        datas.prevMatrix = matrix;
        triggerEvent(moveable, "onWarp", {
          target: target,
          clientX: clientX,
          clientY: clientY,
          delta: delta,
          matrix: multiplyCSS(startMatrix, matrix, 4),
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
        var target = moveable.props.target;
        triggerEvent(moveable, "onWarpEnd", {
          target: target,
          clientX: clientX,
          clientY: clientY,
          isDrag: isDrag,
          datas: datas.datas
        });
        return isDrag;
      }
    };

    var MOVEABLE_ABLES = [Snappable, Pinchable, Draggable, Rotatable, Resizable, Scalable, Warpable];

    function restoreStyle(moveable) {
      var el = moveable.areaElement;
      var _a = moveable.state,
          width = _a.width,
          height = _a.height;
      removeClass(el, prefix("avoid"));
      el.style.cssText += "left: 0px; top: 0px; width: " + width + "px; height: " + height + "px";
    }

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
        }).slice();
      },
      dragGroupStart: function (moveable, _a) {
        var datas = _a.datas,
            clientX = _a.clientX,
            clientY = _a.clientY;
        datas.isDrag = false;
        var areaElement = moveable.areaElement;
        var moveableElement = moveable.controlBox.getElement();

        var _b = moveableElement.getBoundingClientRect(),
            left = _b.left,
            top = _b.top;

        var _c = moveable.state,
            width = _c.width,
            height = _c.height;
        var size = Math.max(width, height) * 2;
        var posX = clientX - left - size / 2;
        var posY = clientY - top - size - 10;
        areaElement.style.cssText += "width: " + size + "px; height: " + size + "px;left: " + posX + "px;top: " + posY + "px;";
        addClass(areaElement, prefix("avoid"));
      },
      dragGroup: function (moveable, _a) {
        var datas = _a.datas;

        if (!datas.isDrag) {
          datas.isDrag = true;
          restoreStyle(moveable);
        }
      },
      dragGroupEnd: function (moveable, _a) {
        var inputEvent = _a.inputEvent,
            isDrag = _a.isDrag,
            datas = _a.datas;

        if (!datas.isDrag) {
          restoreStyle(moveable);
        }

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
      __extends$4(MoveableGroup, _super);

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

        if (!state.target) {
          state.target = this.areaElement;
          this.controlBox.getElement().style.display = "block";
          this.targetDragger = getAbleDragger(this, state.target, "targetAbles", "Group");
          this.controlDragger = getAbleDragger(this, this.controlBox.getElement(), "controlAbles", "GroupControl");
        }

        var _a = this.differ.update(this.props.targets),
            added = _a.added,
            changed = _a.changed,
            removed = _a.removed;

        if (added.length || changed.length || removed.length) {
          this.updateRect();
        }
      };

      __proto.checkUpdate = function () {
        this.updateAbles();
      };

      __proto.updateRect = function (type, isTarget) {
        var _a;

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

        var _b = getGroupRect(this.moveables, rotation),
            left = _b[0],
            top = _b[1],
            width = _b[2],
            height = _b[3]; // tslint:disable-next-line: max-line-length


        target.style.cssText += "left:0px;top:0px;width:" + width + "px; height:" + height + "px;transform:rotate(" + rotation + "deg)";
        state.width = width;
        state.height = height;
        var info = getTargetInfo(target, this.controlBox.getElement(), state);
        var pos = [info.left, info.top];
        _a = getAbsolutePosesByState(info), info.pos1 = _a[0], info.pos2 = _a[1], info.pos3 = _a[2], info.pos4 = _a[3];
        info.origin = plus(pos, info.origin);
        info.beforeOrigin = plus(pos, info.beforeOrigin);
        this.updateState(__assign$3({}, info, {
          left: left - info.left,
          top: top - info.top
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
        transformOrigin: ["50%", "50%"],
        groupable: true,
        dragArea: true,
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
    //# sourceMappingURL=moveable.esm.js.map

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
     //# sourceMappingURL=InnerMoveable.js.map

    var PROPERTIES = ["draggable", "resizable", "scalable", "rotatable", "warpable", "pinchable", "snappable", "origin", "target", "edge", "throttleDrag", "throttleResize", "throttleScale", "throttleRotate", "keepRatio", "dragArea", "pinchThreshold", "snapCenter", "snapThreshold", "horizontalGuidelines", "verticalGuidelines", "elementGuidelines", "bounds"];
    var EVENTS = ["dragStart", "drag", "dragEnd", "resizeStart", "resize", "resizeEnd", "scaleStart", "scale", "scaleEnd", "rotateStart", "rotate", "rotateEnd", "warpStart", "warp", "warpEnd", "pinchStart", "pinch", "pinchEnd", "dragGroupStart", "dragGroup", "dragGroupEnd", "resizeGroupStart", "resizeGroup", "resizeGroupEnd", "scaleGroupStart", "scaleGroup", "scaleGroupEnd", "rotateGroupStart", "rotateGroup", "rotateGroupEnd", "pinchGroupStart", "pinchGroup", "pinchGroupEnd", "clickGroup"]; //# sourceMappingURL=consts.js.map

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
     //# sourceMappingURL=Moveable.js.map

    var codes = {
      draggable: {
        vanilla: "\nimport Moveable from \"moveable\";\n\n/* const translate = [0, 0]; */\nconst draggable = new Moveable(document.body, {\n    target: document.querySelector(\".draggable\"),\n    draggable: true,\n    throttleDrag: 0,\n}).on(\"drag\", ({ target, left, top, beforeDelta }) => {\n    target.style.left = left + \"px\";\n    target.style.top = top + \"px\";\n\n    /* translate[0] += beforeDelta[0]; */\n    /* translate[1] += beforeDelta[1]; */\n    /* target.style.transform\n        = \"translateX(\" + translate[0] + \"px) \"\n        + \"translateY(\" + translate[1] + \"px)\"; */\n});\n        ",
        react: "\nimport Moveable from \"react-moveable\";\nthis.translate = [0, 0];\nreturn (\n    <Moveable\n        target={document.querySelector(\".draggable\")}\n        draggable={true}\n        throttleDrag={0}\n        onDrag={({ target, left, top, beforeDelta }) => {\n            target.style.left = left + \"px\";\n            target.style.top = top + \"px\";\n\n            /* const translate = this.translate */\n            /* translate[0] += beforeDelta[0]; */\n            /* translate[1] += beforeDelta[1]; */\n            /* target.style.transform\n                = \"translateX(\" + translate[0] + \"px) \"\n                + \"translateY(\" + translate[1] + \"px)\"; */\n        }}\n    />\n);\n        ",
        angular: "\nimport {\n    NgxMoveableModule,\n    NgxMoveableComponent,\n} from \"ngx-moveable\";\n\n@Component({\n    selector: 'AppComponent',\n    template: " + "`" + "\n<div #target class=\"target\">target</div>\n<ngx-moveable\n    [target]=\"target\"\n    [draggable]=\"true\"\n    [throttleDrag]=\"0\"\n    (drag)=\"onDrag($event)\n    />\n" + "`" + ",\n})\nexport class AppComponent {\n    translate = [0, 0];\n    onDrag({ target, left, top, beforeDelta }) {\n        target.style.left = left + \"px\";\n        target.style.top = top + \"px\";\n\n        /* const translate = this.translate */\n        /* translate[0] += beforeDelta[0]; */\n        /* translate[1] += beforeDelta[1]; */\n        /* target.style.transform\n            = \"translateX(\" + translate[0] + \"px) \"\n            + \"translateY(\" + translate[1] + \"px)\"; */\n    }\n}\n"
      },
      resizable: {
        vanilla: "\nimport Moveable from \"moveable\";\n\nconst resizable = new Moveable(document.body, {\n    target: document.querySelector(\".resizable\"),\n    resizable: true,\n    throttleResize: 0,\n    keepRatio: true,\n}).on(\"resize\", ({ target, width, height, dist }) => {\n    console.log(width, height, dist);\n    target.style.width = width + \"px\";\n    target.style.height = height + \"px\";\n});\n        ",
        react: "\nimport Moveable from \"react-moveable\";\n\nreturn (\n    <Moveable\n        target={document.querySelector(\".resizable\")}\n        resizable={true}\n        throttleResize={0}\n        keepRatio={true}\n        onResize={({ target, width, height, dist }) => {\n            console.log(width, height, dist);\n            target.style.width = width + \"px\";\n            target.style.height = height + \"px\";\n        }}\n    />\n);\n        ",
        angular: "\nimport {\n    NgxMoveableModule,\n    NgxMoveableComponent,\n} from \"ngx-moveable\";\n\n@Component({\n    selector: 'AppComponent',\n    template: " + "`" + "\n<div #target class=\"target\">target</div>\n<ngx-moveable\n    [target]=\"target\"\n    [resizable]=\"true\"\n    [throttleResize]=\"0\"\n    [keepRatio]=\"true\"\n    (resize)=\"onResize($event)\n    />\n" + "`" + ",\n})\nexport class AppComponent {\n    onResize({ target, width, height, dist }) {\n        console.log(width, height, dist);\n        target.style.width = width + \"px\";\n        target.style.height = height + \"px\";\n    }\n}\n        "
      },
      scalable: {
        vanilla: "\nimport Moveable from \"moveable\";\n\nconst scale = [1, 1];\nconst scalable = new Moveable(document.body, {\n    target: document.querySelector(\".scalable\"),\n    scalable: true,\n    throttleScale: 0,\n    keepRatio: true,\n}).on(\"scale\", ({ target, delta }) => {\n    scale[0] *= delta[0];\n    scale[1] *= delta[1];\n    target.style.transform = \"scale(\" + scale[0] +  \",\" + scale[1] + \")\";\n});\n        ",
        react: "\nimport Moveable from \"react-moveable\";\n\nthis.scale = [1, 1];\nreturn (\n    <Moveable\n        target={document.querySelector(\".scalable\")}\n        scalable={true}\n        throttleScale={0}\n        keepRatio={true}\n        onScale={({ target, delta }) => {\n            const scale = this.scale;\n            scale[0] *= delta[0];\n            scale[1] *= delta[1];\n            target.style.transform\n                = \"scale(\" + scale[0] +  \",\" + scale[1] + \")\";\n        }}\n    />\n);\n        ",
        angular: "\nimport {\n    NgxMoveableModule,\n    NgxMoveableComponent,\n} from \"ngx-moveable\";\n\n@Component({\n    selector: 'AppComponent',\n    template: " + "`" + "\n<div #target class=\"target\">target</div>\n<ngx-moveable\n    [target]=\"target\"\n    [scalable]=\"true\"\n    [throttleScale]=\"0\"\n    [keepRatio]=\"true\"\n    (scale)=\"onScale($event)\n    />\n" + "`" + ",\n})\nexport class AppComponent {\n    scale = [1, 1];\n    onScale({ target, delta }) {\n        const scale = this.scale;\n        scale[0] *= delta[0];\n        scale[1] *= delta[1];\n        target.style.transform\n            = \"scale(\" + scale[0] +  \",\" + scale[1] + \")\";\n    }\n}\n        "
      },
      rotatable: {
        vanilla: "\nimport Moveable from \"moveable\";\n\nlet rotate = 0;\n\nconst rotatable = new Moveable(document.body, {\n    target: document.querySelector(\".rotatable\"),\n    rotatable: true,\n    throttleRotate: 0,\n}).on(\"rotate\", ({ target, beforeDelta, delta }) => {\n    rotate += delta;\n    target.style.transform\n        = \"rotate(\" + rotate +  \"deg)\";\n});\n        ",
        react: "\nimport Moveable from \"react-moveable\";\n\nthis.rotate = 0;\n\nreturn (\n    <Moveable\n        target={document.querySelector(\".rotatable\")}\n        rotatable={true}\n        throttleRotate={0}\n        onRotate={({ target, beforeDelta, delta }) => {\n            this.rotate += delta;\n            target.style.transform\n                = \"rotate(\" + this.rotate +  \"deg)\";\n        }}\n    />\n);\n        ",
        angular: "\nimport {\n    NgxMoveableModule,\n    NgxMoveableComponent,\n} from \"ngx-moveable\";\n\n@Component({\n    selector: 'AppComponent',\n    template: " + "`" + "\n<div #target class=\"target\">target</div>\n<ngx-moveable\n    [target]=\"target\"\n    [rotatable]=\"true\"\n    [throttleRotate]=\"0\"\n    [keepRatio]=\"true\"\n    (rotate)=\"onRotate($event)\n    />\n" + "`" + ",\n})\nexport class AppComponent {\n    rotate = 0;\n    onRotate({ target, delta }) {\n        this.rotate += delta;\n        target.style.transform\n            = \"rotate(\" + this.rotate +  \"deg)\";\n    }\n}\n        "
      },
      warpable: {
        vanilla: "\nimport Moveable from \"moveable\";\n\nlet matrix = [\n    1, 0, 0, 0,\n    0, 1, 0, 0,\n    0, 0, 1, 0,\n    0, 0, 0, 1,\n];\n\nconst warpable = new Moveable(document.body, {\n    target: document.querySelector(\".warpable\"),\n    warpable: true,\n    throttleRotate: 0,\n}).on(\"warp\", ({ target, multiply, delta }) => {\n    matrix = multiply(matrix, delta);\n    target.style.transform\n        = \"matrix3d(\" + matrix.join(\",\") +  \")\";\n});\n        ",
        react: "\nimport Moveable from \"react-moveable\";\n\nthis.matrix = [\n    1, 0, 0, 0,\n    0, 1, 0, 0,\n    0, 0, 1, 0,\n    0, 0, 0, 1,\n];\n\nreturn (\n    <Moveable\n        target={document.querySelector(\".warpable\")}\n        warpable={true}\n        onWarp={({ target, multiply, delta }) => {\n            this.matrix = multiply(this.matrix, delta);\n            target.style.transform\n                = \"matrix3d(\" + matrix.join(\",\") +  \")\";\n        }}\n    />\n);\n        ",
        angular: "\nimport {\n    NgxMoveableModule,\n    NgxMoveableComponent,\n} from \"ngx-moveable\";\n\n@Component({\n    selector: 'AppComponent',\n    template: " + "`" + "\n<div #target class=\"target\">target</div>\n<ngx-moveable\n    [target]=\"target\"\n    [warpable]=\"true\"\n    (warp)=\"onWarp($event)\n    />\n" + "`" + ",\n})\nexport class AppComponent {\n    matrix = [\n        1, 0, 0, 0,\n        0, 1, 0, 0,\n        0, 0, 1, 0,\n        0, 0, 0, 1,\n    ];\n    onWarp({ target, dist }) {\n        this.matrix = multiply(this.matrix, delta);\n        target.style.transform\n            = \"matrix3d(\" + matrix.join(\",\") +  \")\";\n    }\n}\n        "
      },
      pinchable: {
        vanilla: "\nimport Moveable from \"moveable\";\nconst scale = [1, 1];\nlet rotate = 0;\n\nconst pinchable = new Moveable(document.body, {\n    target: document.querySelector(\".pinchable\"),\n    pinchable: [\"rotatable\", \"scalable\"],\n}).on(\"rotate\", ({ target, beforeDelta }) => {\n    rotate += beforeDelta;\n    target.style.transform = \"scale(\" + scale.join(\", \") + \") rotate(\" + rotate + \"deg)\";\n}).on(\"scale\", ({ target, delta }) => {\n    scale[0] *= delta[0];\n    scale[1] *= delta[1];\n    target.style.transform = \"scale(\" + scale.join(\", \") + \") rotate(\" + rotate + \"deg)\";\n});",
        react: "\nimport Moveable from \"react-moveable\";\nthis.scale = [1, 1];\nthis.rotate = 0;\n\nreturn (\n    <Moveable\n        target={document.querySelector(\".pinchable\")}\n        pinchable={[\"rotatable\", \"scalable\"]},\n        onRotate={({ target, beforeDelta }) => {\n            this.rotate += beforeDelta;\n            target.style.transform\n                = \"scale(\" + this.scale.join(\", \") + \") \"\n                + \"rotate(\" + this.rotate + \"deg)\";\n        }}\n        onScale={({ target, beforeDelta }) => {\n            this.scale[0] *= delta[0];\n            this.scale[1] *= delta[1];\n            target.style.transform\n                = \"scale(\" + this.scale.join(\", \") + \") \"\n                + \"rotate(\" + this.rotate + \"deg)\";\n        }}\n    />\n);",
        angular: "\nimport {\n    NgxMoveableModule,\n    NgxMoveableComponent,\n} from \"ngx-moveable\";\n\n@Component({\n    selector: 'AppComponent',\n    template: " + "`" + "\n    <div #target class=\"target\">target</div>\n    <ngx-moveable\n        [target]=\"target\"\n        [pinchable]=\"['rotatable', 'scalable']\"\n        [rotate]=\"onRotate($event)\"\n        [scale]=\"onScale($event)\"\n/>\n" + "`" + ",\n})\nexport class AppComponent {\n    scale = [1, 1];\n    rotate = 0;\n    onRotate({ target, beforeDelta }) {\n        this.rotate += beforeDelta;\n        target.style.transform\n            = \"scale(\" + this.scale.join(\", \") + \") \"\n            + \"rotate(\" + this.rotate + \"deg)\";\n    }\n    onScale({ target, beforeDelta }) {\n        this.scale[0] *= delta[0];\n        this.scale[1] *= delta[1];\n        target.style.transform\n            = \"scale(\" + this.scale.join(\", \") + \") \"\n            + \"rotate(\" + this.rotate + \"deg)\";\n    }\n}\n"
      },
      origin: {
        vanilla: "\nimport Moveable from \"moveable\";\n\nconst rotatable = new Moveable(document.body, {\n    target: document.querySelector(\".origin\"),\n    origin: true,\n});\n        ",
        react: "\nimport Moveable from \"react-moveable\";\n\nreturn (\n    <Moveable\n        target={document.querySelector(\".origin\")}\n        origin={true}\n    />\n);\n        ",
        angular: "\nimport {\n    NgxMoveableModule,\n    NgxMoveableComponent,\n} from \"ngx-moveable\";\n\n@Component({\n    selector: 'AppComponent',\n    template: " + "`" + "\n<div #target class=\"target\">target</div>\n<ngx-moveable\n    [target]=\"target\"\n    [origin]=\"true\"\n    />\n" + "`" + ",\n})\nexport class AppComponent {\n}\n"
      },
      groupable: {
        vanilla: "\nimport Moveable from \"moveable\";\nconst poses = [\n    [0, 0],\n    [0, 0],\n    [0, 0],\n];\nconst target = [].slice.call(\n    document.querySelectorAll(\".target\"),\n);\nconst groupable = new Moveable(document.body, {\n    target,\n    draggable: true,\n}).on(\"dragGroup\", ({ events }) => {\n    events.forEach(({ target, beforeDelta }, i) => {\n        poses[i][0] += beforeDelta[0];\n        poses[i][1] += beforeDelta[1];\n\n        target.style.transform\n            = \"translate(\"\n            + poses[i][0] + \"px, \"\n            + poses[i][1] + \"px)\";\n    });\n});\n        ",
        react: "\nimport Moveable from \"react-moveable\";\n\nthis.poses = [\n    [0, 0],\n    [0, 0],\n    [0, 0],\n];\n\nconst target = [].slice.call(\n    document.querySelectorAll(\".target\"),\n);\nreturn (\n    <Moveable\n        target={target}\n        draggable={true}\n        onDragGroup={({ events }) => {\n            events.forEach(({ target, beforeDelta }, i) => {\n                this.poses[i][0] += beforeDelta[0];\n                this.poses[i][1] += beforeDelta[1];\n\n                target.style.transform\n                    = \"translate(\"\n                    + this.poses[i][0] + \"px, \"\n                    + this.poses[i][1] + \"px)\";\n            });\n        }}\n    />\n);\n        ",
        angular: "\nimport {\n    NgxMoveableModule,\n    NgxMoveableComponent,\n} from \"ngx-moveable\";\n\n@Component({\n    selector: 'AppComponent',\n    template: " + "`" + "\n<div #target1 class=\"target\">target1</div>\n<div #target2 class=\"target\">target2</div>\n<div #target3 class=\"target\">target3</div>\n<ngx-moveable\n    [target]=\"[target1, target2, target3]\"\n    [draggable]=\"true\"\n    (dragGroup)=\"onDragGroup($event)\n    />\n" + "`" + ",\n})\nexport class AppComponent {\n    poses = [\n        [0, 0],\n        [0, 0],\n        [0, 0],\n    ];\n    onDragGroup({ events }) {\n        events.forEach(({ target, beforeDelta }, i) => {\n            this.poses[i][0] += beforeDelta[0];\n            this.poses[i][1] += beforeDelta[1];\n\n            target.style.transform\n                = \"translate(\"\n                + this.poses[i][0] + \"px, \"\n                + this.poses[i][1] + \"px)\";\n        });\n    }\n}\n        "
      }
    }; //# sourceMappingURL=consts.js.map

    /*
    Copyright (c) 2016 Daybrush
    name: scenejs
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/scenejs.git
    version: 1.1.4
    */

    function cubic(y1, y2, t) {
      var t2 = 1 - t; // Bezier Curve Formula

      return t * t * t + 3 * t * t * t2 * y2 + 3 * t * t2 * t2 * y1;
    }

    function solveFromX(x1, x2, x) {
      // x  0 ~ 1
      // t 0 ~ 1
      var t = x;
      var solveX = x;
      var dx = 1;

      while (Math.abs(dx) > 1 / 1000) {
        // 예상 t초에 의한 _x값
        solveX = cubic(x1, x2, t);
        dx = solveX - x; // 차이가 미세하면 그 값을 t로 지정

        if (Math.abs(dx) < 1 / 1000) {
          return t;
        }

        t -= dx / 2;
      }

      return t;
    }
    /**
     * @namespace easing
     */

    /**
    * Cubic Bezier curve.
    * @memberof easing
    * @func bezier
    * @param {number} [x1] - point1's x
    * @param {number} [y1] - point1's y
    * @param {number} [x2] - point2's x
    * @param {number} [y2] - point2's y
    * @return {function} the curve function
    * @example
    import {bezier} from "scenejs";
    Scene.bezier(0, 0, 1, 1) // LINEAR
    Scene.bezier(0.25, 0.1, 0.25, 1) // EASE
    */


    function bezier(x1, y1, x2, y2) {
      /*
            x = f(t)
            calculate inverse function by x
            t = f-1(x)
        */
      var func = function (x) {
        var t = solveFromX(x1, x2, Math.max(Math.min(1, x), 0));
        return cubic(y1, y2, t);
      };

      func.easingName = "cubic-bezier(" + x1 + "," + y1 + "," + x2 + "," + y2 + ")";
      return func;
    }
    /**
    * Specifies a stepping function
    * @see {@link https://www.w3schools.com/cssref/css3_pr_animation-timing-function.asp|CSS3 Timing Function}
    * @memberof easing
    * @func steps
    * @param {number} count - point1's x
    * @param {"start" | "end"} postion - point1's y
    * @return {function} the curve function
    * @example
    import {steps} from "scenejs";
    Scene.steps(1, "start") // Scene.STEP_START
    Scene.steps(1, "end") // Scene.STEP_END
    */

    function steps(count, position) {
      var func = function (time) {
        var level = 1 / count;

        if (time >= 1) {
          return 1;
        }

        return (position === "start" ? level : 0) + Math.floor(time / level) * level;
      };

      func.easingName = "steps(" + count + ", " + position + ")";
      return func;
    }
    /**
    * Equivalent to steps(1, start)
    * @memberof easing
    * @name STEP_START
    * @static
    * @type {function}
    * @example
    import {STEP_START} from "scenejs";
    Scene.STEP_START // steps(1, start)
    */

    var STEP_START =
    /*#__PURE__#*/
    steps(1, "start");
    /**
    * Equivalent to steps(1, end)
    * @memberof easing
    * @name STEP_END
    * @static
    * @type {function}
    * @example
    import {STEP_END} from "scenejs";
    Scene.STEP_END // steps(1, end)
    */

    var STEP_END =
    /*#__PURE__#*/
    steps(1, "end");
    /**
    * Linear Speed (0, 0, 1, 1)
    * @memberof easing
    * @name LINEAR
    * @static
    * @type {function}
    * @example
    import {LINEAR} from "scenejs";
    Scene.LINEAR
    */

    var LINEAR =
    /*#__PURE__#*/
    bezier(0, 0, 1, 1);
    /**
    * Ease Speed (0.25, 0.1, 0.25, 1)
    * @memberof easing
    * @name EASE
    * @static
    * @type {function}
    * @example
    import {EASE} from "scenejs";
    Scene.EASE
    */

    var EASE =
    /*#__PURE__#*/
    bezier(0.25, 0.1, 0.25, 1);
    /**
    * Ease In Speed (0.42, 0, 1, 1)
    * @memberof easing
    * @name EASE_IN
    * @static
    * @type {function}
    * @example
    import {EASE_IN} from "scenejs";
    Scene.EASE_IN
    */

    var EASE_IN =
    /*#__PURE__#*/
    bezier(0.42, 0, 1, 1);
    /**
    * Ease Out Speed (0, 0, 0.58, 1)
    * @memberof easing
    * @name EASE_OUT
    * @static
    * @type {function}
    * @example
    import {EASE_OUT} from "scenejs";
    Scene.EASE_OUT
    */

    var EASE_OUT =
    /*#__PURE__#*/
    bezier(0, 0, 0.58, 1);
    /**
    * Ease In Out Speed (0.42, 0, 0.58, 1)
    * @memberof easing
    * @name EASE_IN_OUT
    * @static
    * @type {function}
    * @example
    import {EASE_IN_OUT} from "scenejs";
    Scene.EASE_IN_OUT
    */

    var EASE_IN_OUT =
    /*#__PURE__#*/
    bezier(0.42, 0, 0.58, 1);

    var _a;
    var TIMING_FUNCTION = "animation-timing-function";
    var ROLES = {
      transform: {},
      filter: {},
      attribute: {},
      html: true
    };
    var ALIAS = {
      easing: [TIMING_FUNCTION]
    };
    var FIXED = (_a = {}, _a[TIMING_FUNCTION] = true, _a.contents = true, _a.html = true, _a);
    var EASING_NAME = "easingName";
    var TRANSFORM_NAME = "transform";
    var EASINGS = {
      "linear": LINEAR,
      "ease": EASE,
      "ease-in": EASE_IN,
      "ease-out": EASE_OUT,
      "ease-in-out": EASE_IN_OUT,
      "step-start": STEP_START,
      "step-end": STEP_END
    };

    /**
    * Make string, array to PropertyObject for the dot product
    */

    var PropertyObject =
    /*#__PURE__*/
    function () {
      /**
        * @param - This value is in the array format.
        * @param - options
        * @example
      var obj = new PropertyObject([100,100,100,0.5], {
        "separator" : ",",
        "prefix" : "rgba(",
        "suffix" : ")"
      });
         */
      function PropertyObject(value, options) {
        this.prefix = "";
        this.suffix = "";
        this.model = "";
        this.type = "";
        this.separator = ",";
        options && this.setOptions(options);
        this.value = isString(value) ? value.split(this.separator) : value;
      }

      var __proto = PropertyObject.prototype;

      __proto.setOptions = function (newOptions) {
        for (var name in newOptions) {
          this[name] = newOptions[name];
        }

        return this;
      };
      /**
        * the number of values.
        * @example
      const obj1 = new PropertyObject("1,2,3", ",");
      console.log(obj1.length);
      // 3
         */


      __proto.size = function () {
        return this.value.length;
      };
      /**
        * retrieve one of values at the index
        * @param {Number} index - index
        * @return {Object} one of values at the index
        * @example
      const obj1 = new PropertyObject("1,2,3", ",");
      console.log(obj1.get(0));
      // 1
         */


      __proto.get = function (index) {
        return this.value[index];
      };
      /**
        * Set the value at that index
        * @param {Number} index - index
        * @param {Object} value - text, a number, object to set
        * @return {PropertyObject} An instance itself
        * @example
      const obj1 = new PropertyObject("1,2,3", ",");
      obj1.set(0, 2);
      console.log(obj1.toValue());
      // 2,2,3
         */


      __proto.set = function (index, value) {
        this.value[index] = value;
        return this;
      };
      /**
        * create a copy of an instance itself.
        * @return {PropertyObject} clone
        * @example
      const obj1 = new PropertyObject("1,2,3", ",");
      const obj2 = obj1.clone();
         */


      __proto.clone = function () {
        var _a = this,
            separator = _a.separator,
            prefix = _a.prefix,
            suffix = _a.suffix,
            model = _a.model,
            type = _a.type;

        var arr = this.value.map(function (v) {
          return v instanceof PropertyObject ? v.clone() : v;
        });
        return new PropertyObject(arr, {
          separator: separator,
          prefix: prefix,
          suffix: suffix,
          model: model,
          type: type
        });
      };
      /**
        * Make Property Object to String
        * @return {String} Make Property Object to String
        * @example
      //rgba(100, 100, 100, 0.5)
      const obj4 = new PropertyObject([100,100,100,0.5], {
        "separator" : ",",
        "prefix" : "rgba(",
        "suffix" : ")",
      });
      console.log(obj4.toValue());
      // "rgba(100,100,100,0.5)"
        */


      __proto.toValue = function () {
        return this.prefix + this.join() + this.suffix;
      };
      /**
        * Make Property Object's array to String
        * @return {String} Join the elements of an array into a string
        * @example
        //rgba(100, 100, 100, 0.5)
        var obj4 = new PropertyObject([100,100,100,0.5], {
            "separator" : ",",
            "prefix" : "rgba(",
            "suffix" : ")"
        });
        obj4.join();  // =>   "100,100,100,0.5"
         */


      __proto.join = function () {
        return this.value.map(function (v) {
          return v instanceof PropertyObject ? v.toValue() : v;
        }).join(this.separator);
      };
      /**
        * executes a provided function once per array element.
        * @param {Function} callback - Function to execute for each element, taking three arguments
        * @param {All} [callback.currentValue] The current element being processed in the array.
        * @param {Number} [callback.index] The index of the current element being processed in the array.
        * @param {Array} [callback.array] the array.
        * @return {PropertyObject} An instance itself
        * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach|MDN Array.forEach()} reference to MDN document.
        * @example
      //rgba(100, 100, 100, 0.5)
      var obj4 = new PropertyObject([100,100,100,0.5], {
        "separator" : ",",
        "prefix" : "rgba(",
        "suffix" : ")"
      });
      obj4.forEach(t => {
        console.log(t);
      });  // =>   "100,100,100,0.5"
        */


      __proto.forEach = function (func) {
        this.value.forEach(func);
        return this;
      };

      return PropertyObject;
    }();

    /**
    * @namespace
    * @name Property
    */
    function splitStyle(str) {
      var properties = str.split(";");
      var obj = {};
      var length = properties.length;

      for (var i = 0; i < length; ++i) {
        var matches = /([^:]*):([\S\s]*)/g.exec(properties[i]);

        if (!matches || matches.length < 3 || !matches[1]) {
          --length;
          continue;
        }

        obj[matches[1].trim()] = toPropertyObject(matches[2].trim());
      }

      return {
        styles: obj,
        length: length
      };
    }
    /**
    * convert array to PropertyObject[type=color].
    * default model "rgba"
    * @memberof Property
    * @function arrayToColorObject
    * @param {Array|PropertyObject} value ex) [0, 0, 0, 1]
    * @return {PropertyObject} PropertyObject[type=color]
    * @example
    arrayToColorObject([0, 0, 0])
    // => PropertyObject(type="color", model="rgba", value=[0, 0, 0, 1], separator=",")
    */

    function arrayToColorObject(arr) {
      var model = RGBA;

      if (arr.length === 3) {
        arr[3] = 1;
      }

      return new PropertyObject(arr, {
        model: model,
        separator: ",",
        type: "color",
        prefix: model + "(",
        suffix: ")"
      });
    }
    /**
    * convert text with parentheses to object.
    * @memberof Property
    * @function stringToBracketObject
    * @param {String} value ex) "rgba(0,0,0,1)"
    * @return {PropertyObject} PropertyObject
    * @example
    stringToBracketObject("abcde(0, 0, 0,1)")
    // => PropertyObject(model="abcde", value=[0, 0, 0,1], separator=",")
    */

    function stringToBracketObject(text) {
      // [prefix, value, other]
      var _a = splitBracket(text),
          model = _a.prefix,
          value = _a.value,
          afterModel = _a.suffix;

      if (typeof value === "undefined") {
        return text;
      }

      if (COLOR_MODELS.indexOf(model) !== -1) {
        return arrayToColorObject(stringToRGBA(text));
      } // divide comma(,)


      var obj = toPropertyObject(value);
      var arr = [value];
      var separator = ",";
      var prefix = model + "(";
      var suffix = ")" + afterModel;

      if (obj instanceof PropertyObject) {
        separator = obj.separator;
        arr = obj.value;
        prefix += obj.prefix;
        suffix = obj.suffix + suffix;
      }

      return new PropertyObject(arr, {
        separator: separator,
        model: model,
        prefix: prefix,
        suffix: suffix
      });
    }
    function arrayToPropertyObject(arr, separator) {
      return new PropertyObject(arr, {
        type: "array",
        separator: separator
      });
    }
    /**
    * convert text with parentheses to PropertyObject[type=color].
    * If the values are not RGBA model, change them RGBA mdoel.
    * @memberof Property
    * @function stringToColorObject
    * @param {String|PropertyObject} value ex) "rgba(0,0,0,1)"
    * @return {PropertyObject} PropertyObject[type=color]
    * @example
    stringToColorObject("rgba(0, 0, 0,1)")
    // => PropertyObject(type="color", model="rgba", value=[0, 0, 0,1], separator=",")
    */

    function stringToColorObject(value) {
      var result = stringToRGBA(value);
      return result ? arrayToColorObject(result) : value;
    }
    function toPropertyObject(value) {
      if (!isString(value)) {
        if (isArray(value)) {
          return arrayToPropertyObject(value, ",");
        }

        return value;
      }

      var values = splitComma(value);

      if (values.length > 1) {
        return arrayToPropertyObject(values.map(function (v) {
          return toPropertyObject(v);
        }), ",");
      }

      values = splitSpace(value);

      if (values.length > 1) {
        return arrayToPropertyObject(values.map(function (v) {
          return toPropertyObject(v);
        }), " ");
      }

      values = /^(['"])([^'"]*)(['"])$/g.exec(value);

      if (values && values[1] === values[3]) {
        // Quotes
        return new PropertyObject([toPropertyObject(values[2])], {
          prefix: values[1],
          suffix: values[1]
        });
      } else if (value.indexOf("(") !== -1) {
        // color
        return stringToBracketObject(value);
      } else if (value.charAt(0) === "#") {
        return stringToColorObject(value);
      }

      return value;
    }
    function toObject(object, result) {
      if (result === void 0) {
        result = {};
      }

      var model = object.model;

      if (model) {
        object.setOptions({
          model: "",
          suffix: "",
          prefix: ""
        });
        var value = object.size() > 1 ? object : object.get(0);
        result[model] = value;
      } else {
        object.forEach(function (obj) {
          toObject(obj, result);
        });
      }

      return result;
    }

    function isPropertyObject(value) {
      return value instanceof PropertyObject;
    }
    function getType(value) {
      var type = typeof value;

      if (type === OBJECT) {
        if (isArray(value)) {
          return ARRAY;
        } else if (isPropertyObject(value)) {
          return PROPERTY;
        }
      } else if (type === STRING || type === NUMBER) {
        return "value";
      }

      return type;
    }
    function isPureObject(obj) {
      return isObject(obj) && obj.constructor === Object;
    }
    function getNames(names, stack) {
      var arr = [];

      if (isPureObject(names)) {
        for (var name in names) {
          stack.push(name);
          arr = arr.concat(getNames(names[name], stack));
          stack.pop();
        }
      } else {
        arr.push(stack.slice());
      }

      return arr;
    }
    function getValueByNames(names, properties, length) {
      if (length === void 0) {
        length = names.length;
      }

      var value = properties;

      for (var i = 0; i < length; ++i) {
        if (!isObject(value)) {
          return undefined;
        }

        value = value[names[i]];
      }

      return value;
    }
    function isInProperties(roles, args, isCheckTrue) {
      var length = args.length;
      var role = roles;

      if (length === 0) {
        return false;
      }

      for (var i = 0; i < length; ++i) {
        if (role === true) {
          return false;
        }

        role = role[args[i]];

        if (!role || !isCheckTrue && role === true) {
          return false;
        }
      }

      return true;
    }
    function isRole(args, isCheckTrue) {
      return isInProperties(ROLES, args, isCheckTrue);
    }
    function isFixed(args) {
      return isInProperties(FIXED, args, true);
    }
    function getEasing(curveArray) {
      var easing;

      if (isString(curveArray)) {
        if (curveArray in EASINGS) {
          easing = EASINGS[curveArray];
        } else {
          var obj = toPropertyObject(curveArray);

          if (isString(obj)) {
            return 0;
          } else {
            if (obj.model === "cubic-bezier") {
              curveArray = obj.value.map(function (v) {
                return parseFloat(v);
              });
              easing = bezier(curveArray[0], curveArray[1], curveArray[2], curveArray[3]);
            } else if (obj.model === "steps") {
              easing = steps(parseFloat(obj.value[0]), obj.value[1]);
            } else {
              return 0;
            }
          }
        }
      } else if (isArray(curveArray)) {
        easing = bezier(curveArray[0], curveArray[1], curveArray[2], curveArray[3]);
      } else {
        easing = curveArray;
      }

      return easing;
    }

    function toInnerProperties(obj) {
      if (!obj) {
        return "";
      }

      var arrObj = [];

      for (var name in obj) {
        arrObj.push(name.replace(/\d$/g, "") + "(" + obj[name] + ")");
      }

      return arrObj.join(" ");
    }
    /* eslint-disable */


    function clone(target, toValue) {
      if (toValue === void 0) {
        toValue = false;
      }

      return merge({}, target, toValue);
    }

    function merge(to, from, toValue) {
      if (toValue === void 0) {
        toValue = false;
      }

      for (var name in from) {
        var value = from[name];
        var type = getType(value);

        if (type === PROPERTY) {
          to[name] = toValue ? value.toValue() : value.clone();
        } else if (type === FUNCTION) {
          to[name] = toValue ? getValue([name], value) : value;
        } else if (type === ARRAY) {
          to[name] = value.slice();
        } else if (type === OBJECT) {
          if (isObject(to[name]) && !isPropertyObject(to[name])) {
            merge(to[name], value, toValue);
          } else {
            to[name] = clone(value, toValue);
          }
        } else {
          to[name] = from[name];
        }
      }

      return to;
    }
    /* eslint-enable */


    function getPropertyName(args) {
      return args[0] in ALIAS ? ALIAS[args[0]] : args;
    }

    function getValue(names, value) {
      var type = getType(value);

      if (type === PROPERTY) {
        return value.toValue();
      } else if (type === FUNCTION) {
        if (names[0] !== TIMING_FUNCTION) {
          return getValue(names, value());
        }
      } else if (type === OBJECT) {
        return clone(value, true);
      }

      return value;
    }
    /**
    * Animation's Frame
    */


    var Frame =
    /*#__PURE__*/
    function () {
      /**
       * @param - properties
       * @example
      const frame = new Scene.Frame({
        display: "none"
        transform: {
            translate: "50px",
            scale: "5, 5",
        }
      });
       */
      function Frame(properties) {
        if (properties === void 0) {
          properties = {};
        }

        this.properties = {};
        this.set(properties);
      }
      /**
        * get property value
        * @param {...Number|String|PropertyObject} args - property name or value
        * @example
        frame.get("display") // => "none", "block", ....
        frame.get("transform", "translate") // => "10px,10px"
        */


      var __proto = Frame.prototype;

      __proto.get = function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        var value = this.raw.apply(this, args);
        return getValue(getPropertyName(args), value);
      };

      __proto.raw = function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        return getValueByNames(getPropertyName(args), this.properties);
      };
      /**
        * remove property value
        * @param {...String} args - property name
        * @return {Frame} An instance itself
        * @example
        frame.remove("display")
        */


      __proto.remove = function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        var params = getPropertyName(args);
        var length = params.length;

        if (!length) {
          return this;
        }

        var value = getValueByNames(params, this.properties, length - 1);

        if (isObject(value)) {
          delete value[params[length - 1]];
        }

        return this;
      };
      /**
        * set property
        * @param {...Number|String|PropertyObject} args - property names or values
        * @return {Frame} An instance itself
        * @example
      // one parameter
      frame.set({
        display: "none",
        transform: {
            translate: "10px, 10px",
            scale: "1",
        },
        filter: {
            brightness: "50%",
            grayscale: "100%"
        }
      });
      // two parameters
      frame.set("transform", {
        translate: "10px, 10px",
        scale: "1",
      });
      // three parameters
      frame.set("transform", "translate", "50px");
      */


      __proto.set = function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        var self = this;
        var length = args.length;
        var params = args.slice(0, -1);
        var value = args[length - 1];
        var firstParam = params[0];

        if (length === 1 && value instanceof Frame) {
          self.merge(value);
        } else if (firstParam in ALIAS) {
          self._set(ALIAS[firstParam], value);
        } else if (length === 2 && isArray(firstParam)) {
          self._set(firstParam, value);
        } else if (isPropertyObject(value)) {
          if (isRole(params)) {
            self.set.apply(self, params.concat([toObject(value)]));
          } else {
            self._set(params, value);
          }
        } else if (isArray(value)) {
          self._set(params, value);
        } else if (isObject(value)) {
          if (!self.has.apply(self, params) && isRole(params)) {
            self._set(params, {});
          }

          for (var name in value) {
            self.set.apply(self, params.concat([name, value[name]]));
          }
        } else if (isString(value)) {
          if (isRole(params, true)) {
            if (isFixed(params) || !isRole(params)) {
              this._set(params, value);
            } else {
              var obj = toPropertyObject(value);

              if (isObject(obj)) {
                self.set.apply(self, params.concat([obj]));
              }
            }

            return this;
          } else {
            var _a = splitStyle(value),
                styles = _a.styles,
                stylesLength = _a.length;

            for (var name in styles) {
              self.set.apply(self, params.concat([name, styles[name]]));
            }

            if (stylesLength) {
              return this;
            }
          }

          self._set(params, value);
        } else {
          self._set(params, value);
        }

        return self;
      };
      /**
        * Gets the names of properties.
        * @return the names of properties.
        * @example
      // one parameter
      frame.set({
        display: "none",
        transform: {
            translate: "10px, 10px",
            scale: "1",
        },
      });
      // [["display"], ["transform", "translate"], ["transform", "scale"]]
      console.log(frame.getNames());
      */


      __proto.getNames = function () {
        return getNames(this.properties, []);
      };
      /**
        * check that has property.
        * @param {...String} args - property name
        * @example
        frame.has("property", "display") // => true or false
        */


      __proto.has = function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        var params = getPropertyName(args);
        var length = params.length;

        if (!length) {
          return false;
        }

        return !isUndefined$1(getValueByNames(params, this.properties, length));
      };
      /**
        * clone frame.
        * @return {Frame} An instance of clone
        * @example
        frame.clone();
        */


      __proto.clone = function () {
        var frame = new Frame();
        return frame.merge(this);
      };
      /**
        * merge one frame to other frame.
        * @param - target frame.
        * @return {Frame} An instance itself
        * @example
        frame.merge(frame2);
        */


      __proto.merge = function (frame) {
        var properties = this.properties;
        var frameProperties = frame.properties;

        if (frameProperties) {
          merge(properties, frameProperties);
        }

        return this;
      };
      /**
        * Specifies an css object that coverted the frame.
        * @return {object} cssObject
        */


      __proto.toCSSObject = function () {
        var properties = this.get();
        var cssObject = {};

        for (var name in properties) {
          if (isRole([name], true)) {
            continue;
          }

          var value = properties[name];

          if (name === TIMING_FUNCTION) {
            cssObject[TIMING_FUNCTION.replace("animation", ANIMATION)] = (isString(value) ? value : value[EASING_NAME]) || "initial";
          } else {
            cssObject[name] = value;
          }
        }

        var transform = toInnerProperties(properties[TRANSFORM_NAME]);
        var filter = toInnerProperties(properties.filter);
        TRANSFORM && transform && (cssObject[TRANSFORM] = transform);
        FILTER && filter && (cssObject[FILTER] = filter);
        return cssObject;
      };
      /**
        * Specifies an css text that coverted the frame.
        * @return {string} cssText
        */


      __proto.toCSS = function () {
        var cssObject = this.toCSSObject();
        var cssArray = [];

        for (var name in cssObject) {
          cssArray.push(name + ":" + cssObject[name] + ";");
        }

        return cssArray.join("");
      };

      __proto._set = function (args, value) {
        var properties = this.properties;
        var length = args.length;

        for (var i = 0; i < length - 1; ++i) {
          var name = args[i];
          !(name in properties) && (properties[name] = {});
          properties = properties[name];
        }

        if (!length) {
          return;
        }

        if (args.length === 1 && args[0] === TIMING_FUNCTION) {
          properties[TIMING_FUNCTION] = getEasing(value);
        } else {
          properties[args[length - 1]] = isString(value) ? toPropertyObject(value) : value;
        }
      };

      return Frame;
    }();
    //# sourceMappingURL=scene.esm.js.map

    var moveableElement = document.querySelector(".moveable");
    var labelElement = document.querySelector(".label");
    var frame = new Frame({
      width: "250px",
      height: "200px",
      left: "0px",
      top: "0px",
      transform: {
        rotate: "0deg",
        scaleX: 1,
        scaleY: 1,
        matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
      }
    });

    function setTransform(target) {
      target.style.cssText = frame.toCSS();
    }

    function setLabel(clientX, clientY, text) {
      // tslint:disable-next-line: max-line-length
      labelElement.style.cssText = "\n    display: block; transform: translate(" + clientX + "px, " + (clientY - 10) + "px) translate(-100%, -100%);";
      labelElement.innerHTML = text;
    }

    var moveable = new Moveable$1(moveableElement.parentElement, {
      target: moveableElement,
      origin: false,
      draggable: true,
      rotatable: true,
      scalable: true,
      pinchable: true,
      keepRatio: false,
      throttleDrag: 1,
      throttleScale: 0.01,
      throttleRotate: 0.2,
      throttleResize: 1
    }).on("pinch", function (_a) {
      var clientX = _a.clientX,
          clientY = _a.clientY;
      setTimeout(function () {
        setLabel(clientX, clientY, "X: " + frame.get("left") + "\n        <br/>Y: " + frame.get("top") + "\n        <br/>W: " + frame.get("width") + "\n        <br/>H: " + frame.get("height") + "\n        <br/>S: " + frame.get("transform", "scaleX").toFixed(2) + ", " + frame.get("transform", "scaleY").toFixed(2) + "\n        <br/>R: " + parseFloat(frame.get("transform", "rotate")).toFixed(1) + "deg\n        ");
      });
    }).on("drag", function (_a) {
      var target = _a.target,
          left = _a.left,
          top = _a.top,
          clientX = _a.clientX,
          clientY = _a.clientY,
          isPinch = _a.isPinch;
      frame.set("left", left + "px");
      frame.set("top", top + "px");
      setTransform(target);
      !isPinch && setLabel(clientX, clientY, "X: " + left + "px<br/>Y: " + top + "px");
    }).on("scale", function (_a) {
      var target = _a.target,
          delta = _a.delta,
          clientX = _a.clientX,
          clientY = _a.clientY,
          isPinch = _a.isPinch;
      var scaleX = frame.get("transform", "scaleX") * delta[0];
      var scaleY = frame.get("transform", "scaleY") * delta[1];
      frame.set("transform", "scaleX", scaleX);
      frame.set("transform", "scaleY", scaleY);
      setTransform(target);
      !isPinch && setLabel(clientX, clientY, "S: " + scaleX.toFixed(2) + ", " + scaleY.toFixed(2));
    }).on("rotate", function (_a) {
      var target = _a.target,
          beforeDelta = _a.beforeDelta,
          clientX = _a.clientX,
          clientY = _a.clientY,
          isPinch = _a.isPinch;
      var deg = parseFloat(frame.get("transform", "rotate")) + beforeDelta;
      frame.set("transform", "rotate", deg + "deg");
      setTransform(target);
      !isPinch && setLabel(clientX, clientY, "R: " + deg.toFixed(1));
    }).on("resize", function (_a) {
      var target = _a.target,
          width = _a.width,
          height = _a.height,
          clientX = _a.clientX,
          clientY = _a.clientY,
          isPinch = _a.isPinch;
      frame.set("width", width + "px");
      frame.set("height", height + "px");
      setTransform(target);
      !isPinch && setLabel(clientX, clientY, "W: " + width + "px<br/>H: " + height + "px");
    }).on("warp", function (_a) {
      var target = _a.target,
          multiply = _a.multiply,
          delta = _a.delta,
          clientX = _a.clientX,
          clientY = _a.clientY;
      frame.set("transform", "matrix3d", multiply(frame.get("transform", "matrix3d"), delta));
      setTransform(target);
      setLabel(clientX, clientY, "X: " + clientX + "px<br/>Y: " + clientY + "px");
    }).on("dragEnd", function () {
      labelElement.style.display = "none";
    }).on("scaleEnd", function () {
      labelElement.style.display = "none";
    }).on("rotateEnd", function () {
      labelElement.style.display = "none";
    }).on("resizeEnd", function () {
      labelElement.style.display = "none";
    }).on("warpEnd", function () {
      labelElement.style.display = "none";
    });
    var draggableElement = document.querySelector(".draggable");
    var draggable = new Moveable$1(draggableElement.parentElement, {
      target: draggableElement,
      origin: false,
      draggable: true
    }).on("drag", function (_a) {
      var target = _a.target,
          transform = _a.transform;
      target.style.transform = transform;
    });
    var resizableElement = document.querySelector(".resizable");
    var resizable = new Moveable$1(resizableElement.parentElement, {
      target: resizableElement,
      origin: false,
      resizable: true
    }).on("resize", function (_a) {
      var target = _a.target,
          width = _a.width,
          height = _a.height;
      target.style.width = width + "px";
      target.style.height = height + "px";
    });
    var scalableElement = document.querySelector(".scalable");
    var scalable = new Moveable$1(scalableElement.parentElement, {
      target: scalableElement,
      origin: false,
      scalable: true
    }).on("scale", function (_a) {
      var target = _a.target,
          transform = _a.transform;
      target.style.transform = transform;
    });
    var rotatableElement = document.querySelector(".rotatable");
    var rotatable = new Moveable$1(rotatableElement.parentElement, {
      target: rotatableElement,
      origin: false,
      rotatable: true
    }).on("rotate", function (_a) {
      var target = _a.target,
          transform = _a.transform;
      target.style.transform = transform;
    });
    var warpableElement = document.querySelector(".warpable");
    var warpable = new Moveable$1(warpableElement.parentElement, {
      target: warpableElement,
      warpable: true,
      origin: false
    }).on("warp", function (_a) {
      var target = _a.target,
          transform = _a.transform;
      target.style.transform = transform;
    });
    var originElement = document.querySelector(".origin");
    var origin = new Moveable$1(originElement.parentElement, {
      target: originElement,
      origin: true,
      draggable: true,
      rotatable: true
    }).on("drag", function (_a) {
      var target = _a.target,
          left = _a.left,
          top = _a.top;
      target.style.left = left + "px";
      target.style.top = top + "px";
    }).on("rotate", function (_a) {
      var target = _a.target,
          transform = _a.transform;
      target.style.transform = transform;
    });
    var pinchableElement = document.querySelector(".pinchable");
    var scale = [1, 1];
    var rotate$1 = 0;
    var pinchable = new Moveable$1(pinchableElement.parentElement, {
      target: pinchableElement,
      pinchable: ["rotatable", "scalable"],
      origin: false
    }).on("rotate", function (_a) {
      var beforeDelta = _a.beforeDelta;
      rotate$1 += beforeDelta;
      pinchableElement.style.transform = "scale(" + scale.join(", ") + ") rotate(" + rotate$1 + "deg)";
    }).on("scale", function (_a) {
      var delta = _a.delta;
      scale[0] *= delta[0];
      scale[1] *= delta[1];
      pinchableElement.style.transform = "scale(" + scale.join(", ") + ") rotate(" + rotate$1 + "deg)";
    });
    var groupableElement = document.querySelector(".groupable");
    var poses = [[0, 0], [0, 0], [0, 0]];
    var groupable = new Moveable$1(groupableElement.parentElement, {
      target: [].slice.call(groupableElement.querySelectorAll("span")),
      origin: false,
      draggable: true
    }).on("dragGroup", function (_a) {
      var events = _a.events;
      events.forEach(function (_a, i) {
        var target = _a.target,
            beforeDelta = _a.beforeDelta;
        poses[i][0] += beforeDelta[0];
        poses[i][1] += beforeDelta[1];
        target.style.transform = "translate(" + poses[i][0] + "px, " + poses[i][1] + "px)";
      });
    });
    window.addEventListener("resize", function () {
      moveable.updateRect();
      draggable.updateRect();
      resizable.updateRect();
      scalable.updateRect();
      rotatable.updateRect();
      warpable.updateRect();
      pinchable.updateRect();
      groupable.updateRect();
    });
    document.addEventListener("DOMContentLoaded", function () {
      document.querySelectorAll("pre").forEach(function (pre) {
        var group = pre.getAttribute("data-group");
        var panel = pre.getAttribute("data-panel");
        var block = pre.querySelector("code");
        var code = codes[group][panel === "preact" ? "react" : panel].trim();

        if (panel === "preact") {
          code = code.replace(/react/g, "preact");
        }

        block.innerText = code;
        hljs.highlightBlock(block);
      });
    });
    var ableElement = document.querySelector(".buttons.able");
    var ableButtonElements = [].slice.call(ableElement.children);
    ableElement.addEventListener("click", function (e) {
      var target = e.target;
      var able = target.getAttribute("data-able");

      if (!able) {
        return;
      }

      ableButtonElements.forEach(function (el) {
        el.classList.remove("selected");
      });
      target.classList.add("selected");

      if (able === "warpable") {
        moveable.resizable = false;
        moveable.scalable = false;
        moveable.warpable = true;
      } else if (able === "scalable") {
        moveable.resizable = false;
        moveable.scalable = true;
        moveable.warpable = false;
      } else if (able === "resizable") {
        moveable.resizable = true;
        moveable.scalable = false;
        moveable.warpable = false;
      }
    });
    var tabGroups = {};
    [].slice.call(document.querySelectorAll("[data-tab]")).forEach(function (tabElement) {
      var group = tabElement.getAttribute("data-group");
      var tab = tabElement.getAttribute("data-tab");
      var panelElement = document.querySelector("[data-group=\"" + group + "\"][data-panel=\"" + tab + "\"]");
      !tabGroups[group] && (tabGroups[group] = []);
      tabGroups[group].push([tabElement, panelElement]);
      tabElement.addEventListener("click", function () {
        tabGroups[group].forEach(function (_a) {
          var otherTabElement = _a[0],
              otherPanelElement = _a[1];

          if (tabElement === otherTabElement) {
            return;
          }

          otherTabElement.classList.remove("selected");
          otherPanelElement.classList.remove("selected");
        });
        tabElement.classList.add("selected");
        panelElement.classList.add("selected");
      });
    });

}());
//# sourceMappingURL=index.js.map
