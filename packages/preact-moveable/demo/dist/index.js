/*
Copyright (c) 2019 Daybrush
name: preact-moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/preact-moveable
version: 0.2.0
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('react-moveable/declaration/types')) :
	typeof define === 'function' && define.amd ? define(['react-moveable/declaration/types'], factory) :
	(global = global || self, factory(global.types));
}(this, function (types) { 'use strict';

	var process = { env: {NODE_ENV: "production"} };

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
	  if (ref != null) {
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
			Component.call(inst, props, context);
		} else {
			inst = new Component(props, context);
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

	function Component(props, context) {
		this._dirty = true;

		this.context = context;

		this.props = props;

		this.state = this.state || {};

		this._renderCallbacks = [];
	}

	extend(Component.prototype, {
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
	    }(Component));
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
	    }(Component));
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
			Component$1.call(this, props, context, BYPASS_HOOK);
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

		F.prototype = Component$1.prototype;
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

	function Component$1(props, context, opts) {
		Component.call(this, props, context);
		this.state = this.getInitialState ? this.getInitialState() : {};
		this.refs = {};
		this._refProxies = {};
		if (opts !== BYPASS_HOOK) {
			newComponentHook.call(this, props, context);
		}
	}
	extend$1((Component$1.prototype = new Component()), {
		constructor: Component$1,

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
		Component$1.call(this, props, context);
	}
	F.prototype = Component$1.prototype;
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
		Component: Component$1,
		PureComponent: PureComponent,
		unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer,
		unstable_batchedUpdates: unstable_batchedUpdates,
		__spread: extend$1
	};

	/*
	Copyright (c) 2019 Daybrush
	name: framework-utils
	license: MIT
	author: Daybrush
	repository: git+https://github.com/daybrush/framework-utils.git
	version: 0.1.0
	*/
	function prefixNames(prefix) {
	  var classNames = [];

	  for (var _i = 1; _i < arguments.length; _i++) {
	    classNames[_i - 1] = arguments[_i];
	  }

	  return classNames.map(function (className) {
	    return className.split(" ").map(function (name) {
	      return "" + prefix + name;
	    }).join(" ");
	  }).join(" ");
	}
	/* react */

	function ref(target, name) {
	  return function (e) {
	    e && (target[name] = e);
	  };
	}
	function prefixCSS(prefix, css) {
	  return css.replace(/\.([^{,\s\d.]+)/g, "." + prefix + "$1");
	}

	/*
	Copyright (c) 2018 Daybrush
	@name: @daybrush/utils
	license: MIT
	author: Daybrush
	repository: https://github.com/daybrush/utils
	@version 0.10.0
	*/
	/**
	* get string "undefined"
	* @memberof Consts
	* @example
	import {UNDEFINED} from "@daybrush/utils";

	console.log(UNDEFINED); // "undefined"
	*/

	var UNDEFINED = "undefined";
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

	function isUndefined(value) {
	  return typeof value === UNDEFINED;
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

	/*
	Copyright (c) 2019 Daybrush
	name: react-css-styler
	license: MIT
	author: Daybrush
	repository: git+https://github.com/daybrush/react-css-styler.git
	version: 0.3.0
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
	var __assign = function () {
	  __assign = Object.assign || function __assign(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	      s = arguments[i];

	      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	    }

	    return t;
	  };

	  return __assign.apply(this, arguments);
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
	      return subSelector.indexOf(":host") > -1 ? "" + subSelector.replace(/\:host/g, "." + className) : "." + className + " " + subSelector;
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

	        return index.createElement(Tag, __assign({
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
	        return this.element || (this.element = index.findDOMNode(this));
	      };

	      return Styler;
	    }(index.Component)
	  );
	}

	/*
	Copyright (c) Daybrush
	name: @daybrush/drag
	license: MIT
	author: Daybrush
	repository: git+https://github.com/daybrush/drag.git
	version: 0.5.0
	*/
	function setDrag(el, options) {
	  var flag = false;
	  var startX = 0;
	  var startY = 0;
	  var prevX = 0;
	  var prevY = 0;
	  var datas = {};
	  var isDrag = false;
	  var _a = options.container,
	      container = _a === void 0 ? el : _a,
	      dragstart = options.dragstart,
	      drag = options.drag,
	      dragend = options.dragend,
	      _b = options.events,
	      events = _b === void 0 ? ["touch", "mouse"] : _b;
	  var isTouch = events.indexOf("touch") > -1;
	  var isMouse = events.indexOf("mouse") > -1;

	  function getPosition(e) {
	    return e.touches && e.touches.length ? e.touches[0] : e;
	  }

	  function onDragStart(e) {
	    flag = true;
	    isDrag = false;

	    var _a = getPosition(e),
	        clientX = _a.clientX,
	        clientY = _a.clientY;

	    startX = clientX;
	    startY = clientY;
	    prevX = clientX;
	    prevY = clientY;
	    datas = {};
	    (dragstart && dragstart({
	      datas: datas,
	      inputEvent: e,
	      clientX: clientX,
	      clientY: clientY
	    })) === false && (flag = false);
	    flag && e.preventDefault();
	  }

	  function onDrag(e) {
	    if (!flag) {
	      return;
	    }

	    var _a = getPosition(e),
	        clientX = _a.clientX,
	        clientY = _a.clientY;

	    var deltaX = clientX - prevX;
	    var deltaY = clientY - prevY;

	    if (!deltaX && !deltaY) {
	      return;
	    }

	    isDrag = true;
	    drag && drag({
	      datas: datas,
	      clientX: clientX,
	      clientY: clientY,
	      deltaX: deltaX,
	      deltaY: deltaY,
	      distX: clientX - startX,
	      distY: clientY - startY,
	      inputEvent: e
	    });
	    prevX = clientX;
	    prevY = clientY;
	  }

	  function onDragEnd(e) {
	    if (!flag) {
	      return;
	    }

	    flag = false;
	    dragend && dragend({
	      datas: datas,
	      isDrag: isDrag,
	      inputEvent: e,
	      clientX: prevX,
	      clientY: prevY,
	      distX: prevX - startX,
	      distY: prevY - startY
	    });
	  }

	  if (isMouse) {
	    el.addEventListener("mousedown", onDragStart);
	    container.addEventListener("mousemove", onDrag);
	    container.addEventListener("mouseup", onDragEnd);
	  }

	  if (isTouch) {
	    el.addEventListener("touchstart", onDragStart);
	    container.addEventListener("touchmove", onDrag);
	    container.addEventListener("touchend", onDragEnd);
	  }

	  return {
	    unset: function () {
	      if (isMouse) {
	        el.removeEventListener("mousedown", onDragStart);
	        container.removeEventListener("mousemove", onDrag);
	        container.removeEventListener("mouseup", onDragEnd);
	      }

	      if (isTouch) {
	        el.removeEventListener("touchstart", onDragStart);
	        container.removeEventListener("touchmove", onDrag);
	        container.removeEventListener("touchend", onDragEnd);
	      }
	    }
	  };
	}

	/*
	Copyright (c) 2019 Daybrush
	name: react-moveable
	license: MIT
	author: Daybrush
	repository: https://github.com/daybrush/moveable/blob/master/packages/react-moveable
	version: 0.2.2
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

	var PREFIX = "moveable-";
	var MOVEABLE_CSS = prefixCSS(PREFIX, "\n{\n    position: fixed;\n    width: 0;\n    height: 0;\n    left: 0;\n    top: 0;\n    z-index: 3000;\n}\n.control {\n    position: absolute;\n    width: 14px;\n    height: 14px;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    box-sizing: border-box;\n    background: #4af;\n    margin-top: -7px;\n    margin-left: -7px;\n}\n.line {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    background: #4af;\n    transform-origin: 0px 0.5px;\n}\n.line.rotation {\n    width: 40px;\n}\n.line.rotation .control {\n    left: 100%;\n    border-color: #4af;\n    background:#fff;\n    cursor: alias;\n}\n.control.e, .control.w {\n    cursor: ew-resize;\n}\n.control.s, .control.n {\n    cursor: ns-resize;\n}\n.control.nw, .control.se, :host.reverse .control.ne, :host.reverse .control.sw {\n    cursor: nwse-resize;\n}\n.control.ne, .control.sw, :host.reverse .control.nw, :host.reverse .control.se {\n    cursor: nesw-resize;\n}\n");

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
	function caculateRotationMatrix(matrix, rad) {
	  var mat = matrix.slice();
	  var cos = Math.cos(rad);
	  var sin = Math.sin(rad);
	  var rotationMatrix = [cos, sin, -sin, cos, 0, 0];
	  return multiple3x2(mat, rotationMatrix);
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
	function getTargetInfo(target) {
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
	  }

	  return {
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
	  return setDrag(target, {
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
	  var startRad = datas.startRad;
	  var prevRad = datas.prevRad;
	  var prevLoop = datas.loop;
	  var rad = moveable.getRadByPos([clientX, clientY]);

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
	  var direction = datas.direction;
	  var matrix = caculateRotationMatrix(datas.matrix, direction * (rad - startRad));
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
	      top = _b.top;
	  datas.transform = window.getComputedStyle(target).transform;
	  datas.matrix = matrix;
	  datas.left = left;
	  datas.top = top;
	  datas.prevRad = moveable.getRadByPos([clientX, clientY]);
	  datas.startRad = datas.prevRad;
	  datas.loop = 0;
	  datas.direction = moveable.getDirection();

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
	  var datas = _a.datas,
	      inputEvent = _a.inputEvent;
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
	  return setDrag(target, {
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

	var ControlBoxElement = styled("div", MOVEABLE_CSS);

	var Moveable =
	/*#__PURE__*/
	function (_super) {
	  __extends$3(Moveable, _super);

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
	        origin = _a.origin,
	        left = _a.left,
	        top = _a.top,
	        pos1 = _a.pos1,
	        pos2 = _a.pos2,
	        pos3 = _a.pos3,
	        pos4 = _a.pos4,
	        target = _a.target,
	        transform = _a.transform;
	    var direction = this.getDirection();
	    var rotationRad = getRad(pos1, pos2) - direction * Math.PI / 2;
	    return createElement(ControlBoxElement, {
	      ref: ref(this, "controlBox"),
	      className: prefix("control-box", direction === -1 ? "reverse" : ""),
	      style: {
	        position: "fixed",
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
	    }), createElement("div", {
	      className: prefix("line rotation"),
	      style: {
	        // tslint:disable-next-line: max-line-length
	        transform: "translate(" + (pos1[0] + pos2[0]) / 2 + "px, " + (pos1[1] + pos2[1]) / 2 + "px) rotate(" + rotationRad + "rad)"
	      }
	    }, createElement("div", {
	      className: prefix("control", "rotation"),
	      ref: ref(this, "rotationElement")
	    })), createElement("div", {
	      className: prefix("control", "origin"),
	      style: getControlTransform(origin)
	    }), createElement("div", {
	      className: prefix("control", "nw"),
	      "data-position": "nw",
	      style: getControlTransform(pos1)
	    }), createElement("div", {
	      className: prefix("control", "n"),
	      "data-position": "n",
	      style: getControlTransform(pos1, pos2)
	    }), createElement("div", {
	      className: prefix("control", "ne"),
	      "data-position": "ne",
	      style: getControlTransform(pos2)
	    }), createElement("div", {
	      className: prefix("control", "w"),
	      "data-position": "w",
	      style: getControlTransform(pos1, pos3)
	    }), createElement("div", {
	      className: prefix("control", "e"),
	      "data-position": "e",
	      style: getControlTransform(pos2, pos4)
	    }), createElement("div", {
	      className: prefix("control", "sw"),
	      "data-position": "sw",
	      style: getControlTransform(pos3)
	    }), createElement("div", {
	      className: prefix("control", "s"),
	      "data-position": "s",
	      style: getControlTransform(pos3, pos4)
	    }), createElement("div", {
	      className: prefix("control", "se"),
	      "data-position": "se",
	      style: getControlTransform(pos4)
	    }));
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

	  __proto.getRadByPos = function (pos) {
	    var _a = this.state,
	        left = _a.left,
	        top = _a.top,
	        origin = _a.origin;
	    var center = [left + origin[0], top + origin[1]];
	    return getRad(center, pos);
	  };

	  __proto.getDirection = function () {
	    var _a = this.state,
	        pos1 = _a.pos1,
	        pos2 = _a.pos2,
	        origin = _a.origin;
	    var pi = Math.PI;
	    var pos1Rad = getRad(origin, pos1);
	    var pos2Rad = getRad(origin, pos2); // 1 : clockwise
	    // -1 : counterclockwise

	    return pos1Rad < pos2Rad && pos2Rad - pos1Rad < pi || pos1Rad > pos2Rad && pos2Rad - pos1Rad < -pi ? 1 : -1;
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

	    this.updateState(getTargetInfo(target), isNotSetState);
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
	    rotatable: true,
	    draggable: true,
	    scalable: true,
	    resizable: false,
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
	function isUndefined$1(value) {
	  return typeof value === "undefined";
	}
	/**
	 * A class used to manage events in a component
	 * @ko 컴포넌트의 이벤트을 관리할 수 있게 하는 클래스
	 * @alias eg.Component
	 */


	var Component$2 =
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
	      if (typeof eventName === "object" && isUndefined$1(handlerToAttach)) {
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
	      if (typeof eventName === "object" && isUndefined$1(handlerToAttach)) {
	        var eventHash = eventName;
	        var name;

	        for (name in eventHash) {
	          this.on(name, eventHash[name]);
	        }

	        return this;
	      } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
	        var handlerList = this._eventHandler[eventName];

	        if (isUndefined$1(handlerList)) {
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
	      if (isUndefined$1(eventName)) {
	        this._eventHandler = {};
	        return this;
	      } // All handler of specific event detach.


	      if (isUndefined$1(handlerToDetach)) {
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
	Copyright (c) Daybrush
	name: keycon
	license: MIT
	author: Daybrush
	repository: git+https://github.com/daybrush/keycon.git
	version: 0.3.0
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

	function createCommonjsModule(fn, module) {
	  return module = {
	    exports: {}
	  }, fn(module, module.exports), module.exports;
	}

	var keycode = createCommonjsModule(function (module, exports) {
	// Source: http://jsfiddle.net/vWx8V/
	// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

	/**
	 * Conenience method returns corresponding value for given keyName or keyCode.
	 *
	 * @param {Mixed} keyCode {Number} or keyName {String}
	 * @return {Mixed}
	 * @api public
	 */

	function keyCode(searchInput) {
	  // Keyboard Events
	  if (searchInput && 'object' === typeof searchInput) {
	    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
	    if (hasKeyCode) searchInput = hasKeyCode;
	  }

	  // Numbers
	  if ('number' === typeof searchInput) return names[searchInput]

	  // Everything else (cast to string)
	  var search = String(searchInput);

	  // check codes
	  var foundNamedKey = codes[search.toLowerCase()];
	  if (foundNamedKey) return foundNamedKey

	  // check aliases
	  var foundNamedKey = aliases[search.toLowerCase()];
	  if (foundNamedKey) return foundNamedKey

	  // weird character?
	  if (search.length === 1) return search.charCodeAt(0)

	  return undefined
	}

	/**
	 * Compares a keyboard event with a given keyCode or keyName.
	 *
	 * @param {Event} event Keyboard event that should be tested
	 * @param {Mixed} keyCode {Number} or keyName {String}
	 * @return {Boolean}
	 * @api public
	 */
	keyCode.isEventKey = function isEventKey(event, nameOrCode) {
	  if (event && 'object' === typeof event) {
	    var keyCode = event.which || event.keyCode || event.charCode;
	    if (keyCode === null || keyCode === undefined) { return false; }
	    if (typeof nameOrCode === 'string') {
	      // check codes
	      var foundNamedKey = codes[nameOrCode.toLowerCase()];
	      if (foundNamedKey) { return foundNamedKey === keyCode; }

	      // check aliases
	      var foundNamedKey = aliases[nameOrCode.toLowerCase()];
	      if (foundNamedKey) { return foundNamedKey === keyCode; }
	    } else if (typeof nameOrCode === 'number') {
	      return nameOrCode === keyCode;
	    }
	    return false;
	  }
	};

	exports = module.exports = keyCode;

	/**
	 * Get by name
	 *
	 *   exports.code['enter'] // => 13
	 */

	var codes = exports.code = exports.codes = {
	  'backspace': 8,
	  'tab': 9,
	  'enter': 13,
	  'shift': 16,
	  'ctrl': 17,
	  'alt': 18,
	  'pause/break': 19,
	  'caps lock': 20,
	  'esc': 27,
	  'space': 32,
	  'page up': 33,
	  'page down': 34,
	  'end': 35,
	  'home': 36,
	  'left': 37,
	  'up': 38,
	  'right': 39,
	  'down': 40,
	  'insert': 45,
	  'delete': 46,
	  'command': 91,
	  'left command': 91,
	  'right command': 93,
	  'numpad *': 106,
	  'numpad +': 107,
	  'numpad -': 109,
	  'numpad .': 110,
	  'numpad /': 111,
	  'num lock': 144,
	  'scroll lock': 145,
	  'my computer': 182,
	  'my calculator': 183,
	  ';': 186,
	  '=': 187,
	  ',': 188,
	  '-': 189,
	  '.': 190,
	  '/': 191,
	  '`': 192,
	  '[': 219,
	  '\\': 220,
	  ']': 221,
	  "'": 222
	};

	// Helper aliases

	var aliases = exports.aliases = {
	  'windows': 91,
	  '⇧': 16,
	  '⌥': 18,
	  '⌃': 17,
	  '⌘': 91,
	  'ctl': 17,
	  'control': 17,
	  'option': 18,
	  'pause': 19,
	  'break': 19,
	  'caps': 20,
	  'return': 13,
	  'escape': 27,
	  'spc': 32,
	  'spacebar': 32,
	  'pgup': 33,
	  'pgdn': 34,
	  'ins': 45,
	  'del': 46,
	  'cmd': 91
	};

	/*!
	 * Programatically add the following
	 */

	// lower case chars
	for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32;

	// numbers
	for (var i = 48; i < 58; i++) codes[i - 48] = i;

	// function keys
	for (i = 1; i < 13; i++) codes['f'+i] = i + 111;

	// numpad keys
	for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96;

	/**
	 * Get by code
	 *
	 *   exports.name[13] // => 'Enter'
	 */

	var names = exports.names = exports.title = {}; // title for backward compat

	// Create reverse mapping
	for (i in codes) names[codes[i]] = i;

	// Add aliases
	for (var alias in aliases) {
	  codes[alias] = aliases[alias];
	}
	});
	var keycode_1 = keycode.code;
	var keycode_2 = keycode.codes;
	var keycode_3 = keycode.aliases;
	var keycode_4 = keycode.names;
	var keycode_5 = keycode.title;

	/*
	Copyright (c) 2018 Daybrush
	@name: @daybrush/utils
	license: MIT
	author: Daybrush
	repository: https://github.com/daybrush/utils
	@version 0.7.1
	*/
	/**
	* get string "string"
	* @memberof Consts
	* @example
	import {STRING} from "@daybrush/utils";

	console.log(STRING); // "string"
	*/

	var STRING = "string";
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

	var codeData = {
	  "+": "plus",
	  "left command": "meta",
	  "right command": "meta"
	};
	var keysSort = {
	  shift: 1,
	  ctrl: 2,
	  alt: 3,
	  meta: 4
	};
	/**
	 * @memberof KeyController
	 */

	function getKey(keyCode) {
	  var key = keycode_4[keyCode] || "";

	  for (var name in codeData) {
	    key = key.replace(name, codeData[name]);
	  }

	  return key.replace(/\s/g, "");
	}
	/**
	 * @memberof KeyController
	 */

	function getCombi(e, key) {
	  if (key === void 0) {
	    key = getKey(e.keyCode);
	  }

	  var keys = [e.shiftKey && "shift", e.ctrlKey && "ctrl", e.altKey && "alt", e.metaKey && "meta"];
	  keys.indexOf(key) === -1 && keys.push(key);
	  return keys.filter(Boolean);
	}

	function getArrangeCombi(keys) {
	  var arrangeKeys = keys.slice();
	  arrangeKeys.sort(function (prev, next) {
	    var prevScore = keysSort[prev] || 5;
	    var nextScore = keysSort[next] || 5;
	    return prevScore - nextScore;
	  });
	  return arrangeKeys;
	}
	/**
	 */


	var KeyController =
	/*#__PURE__*/
	function (_super) {
	  __extends$4(KeyController, _super);
	  /**
	   *
	   */


	  function KeyController(container) {
	    if (container === void 0) {
	      container = window;
	    }

	    var _this = _super.call(this) || this;
	    /**
	     */


	    _this.ctrlKey = false;
	    /**
	     */

	    _this.altKey = false;
	    /**
	     *
	     */

	    _this.shiftKey = false;
	    /**
	     *
	     */

	    _this.metaKey = false;

	    _this.clear = function () {
	      _this.ctrlKey = false;
	      _this.altKey = false;
	      _this.shiftKey = false;
	      _this.metaKey = false;
	      return _this;
	    };

	    _this.keydownEvent = function (e) {
	      _this.triggerEvent("keydown", e);
	    };

	    _this.keyupEvent = function (e) {
	      _this.triggerEvent("keyup", e);
	    };

	    addEvent(container, "blur", _this.clear);
	    addEvent(container, "keydown", _this.keydownEvent);
	    addEvent(container, "keyup", _this.keyupEvent);
	    return _this;
	  }
	  /**
	   *
	   */


	  var __proto = KeyController.prototype;

	  __proto.keydown = function (comb, callback) {
	    return this.addEvent("keydown", comb, callback);
	  };
	  /**
	   *
	   */


	  __proto.keyup = function (comb, callback) {
	    return this.addEvent("keyup", comb, callback);
	  };

	  __proto.addEvent = function (type, comb, callback) {
	    if (isArray(comb)) {
	      this.on(type + "." + getArrangeCombi(comb).join("."), callback);
	    } else if (isString(comb)) {
	      this.on(type + "." + comb, callback);
	    } else {
	      this.on(type, comb);
	    }

	    return this;
	  };

	  __proto.triggerEvent = function (type, e) {
	    this.ctrlKey = e.ctrlKey;
	    this.shiftKey = e.shiftKey;
	    this.altKey = e.altKey;
	    this.metaKey = e.metaKey;
	    var key = getKey(e.keyCode);
	    var isToggle = key === "ctrl" || key === "shift" || key === "meta" || key === "alt";
	    var param = {
	      key: key,
	      isToggle: isToggle,
	      inputEvent: e,
	      keyCode: e.keyCode,
	      ctrlKey: e.ctrlKey,
	      altKey: e.altKey,
	      shiftKey: e.shiftKey,
	      metaKey: e.metaKey
	    };
	    this.trigger(type, param);
	    this.trigger(type + "." + key, param);
	    var combi = getCombi(e, key);
	    combi.length > 1 && this.trigger(type + "." + combi.join("."), param);
	  };

	  return KeyController;
	}(Component$2);

	var App =
	/*#__PURE__*/
	function (_super) {
	  __extends(App, _super);

	  function App() {
	    var _this = _super !== null && _super.apply(this, arguments) || this;

	    _this.state = {
	      target: null,
	      isResizable: true
	    };
	    _this.deg = 18;

	    _this.onClick = function (e) {
	      console.log("?", e.target.className);
	      e.preventDefault();
	      var keycon = new KeyController(window);
	      keycon.keydown("shift", function () {
	        _this.setState({
	          isResizable: false
	        });
	      }).keyup("shift", function () {
	        _this.setState({
	          isResizable: true
	        });
	      });

	      if (!_this.moveable.isMoveableElement(e.target)) {
	        if (_this.state.target === e.target) {
	          _this.moveable.updateRect();
	        } else {
	          _this.setState({
	            target: e.target
	          });
	        }
	      }
	    };

	    return _this;
	  }

	  var __proto = App.prototype;

	  __proto.render = function () {
	    var selectedTarget = this.state.target;
	    var isResizable = this.state.isResizable;
	    return h("div", null, h(Moveable, {
	      target: selectedTarget,
	      ref: ref(this, "moveable"),
	      scalable: !isResizable,
	      resizable: isResizable,
	      onRotate: function (_a) {
	        var target = _a.target,
	            transform = _a.transform;
	        target.style.transform = transform;
	      },
	      onDrag: function (_a) {
	        var target = _a.target,
	            transform = _a.transform; // target!.style.left = `${left}px`;
	        // target!.style.top = `${top}px`;

	        target.style.transform = transform;
	      },
	      onScale: function (_a) {
	        var target = _a.target,
	            transform = _a.transform;
	        target.style.transform = transform;
	      },
	      onResize: function (_a) {
	        var target = _a.target,
	            width = _a.width,
	            height = _a.height,
	            delta = _a.delta;
	        delta[0] && (target.style.width = width + "px");
	        delta[1] && (target.style.height = height + "px");
	      }
	    }), h("div", {
	      className: "App",
	      onMouseDown: this.onClick
	    }, h("header", {
	      className: "App-header"
	    }, h("img", {
	      src: "./logo.svg",
	      className: "App-logo",
	      alt: "logo"
	    }), h("p", null, "Edit ", h("code", null, "src/App.tsx"), " and save to reload."), h("a", {
	      className: "App-link",
	      rel: "noopener noreferrer"
	    }, "Learn React"))));
	  };

	  return App;
	}(Component);

	render(h(App, null), document.getElementById("root"));

}));
