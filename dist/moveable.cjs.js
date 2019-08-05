/*
Copyright (c) 2019 Daybrush
name: moveable
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/moveable.git
version: 0.6.0
*/
'use strict';

var EgComponent = require('@egjs/component');
var frameworkUtils = require('framework-utils');
var getAgent = require('@egjs/agent');
var utils = require('@daybrush/utils');
var Dragger = require('@daybrush/drag');

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

/*
Copyright (c) 2019 Daybrush
name: preact-compat2
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/preact-compat2.git
version: 0.1.0
*/

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

var ContextProvider = function () {};

ContextProvider.prototype.getChildContext = function () {
	return this.props.context;
};
ContextProvider.prototype.render = function (props) {
	return props.children[0];
};

var ARR = [];

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

/*
Copyright (c) 2019 Daybrush
name: preact-css-styler
license: MIT
author: Daybrush
repository: https://github.com/daybrush/css-styler/tree/master/preact-css-styler
version: 0.4.0
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
    }(Component$1)
  );
}

/*
Copyright (c) 2019 Daybrush
name: preact-moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/preact-moveable
version: 0.8.1
*/

/*
Copyright (c) 2019 Daybrush
name: react-moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/react-moveable
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

var agent = getAgent();
var isNotSupportTransformOrigin = agent.os.name.indexOf("ios") > -1 || agent.browser.name.indexOf("safari") > -1;
var PREFIX = "moveable-";
var MOVEABLE_CSS = frameworkUtils.prefixCSS(PREFIX, "\n{\n    position: fixed;\n    width: 0;\n    height: 0;\n    left: 0;\n    top: 0;\n    z-index: 3000;\n}\n.line, .control {\n    left: 0;\n    top: 0;\n}\n.control {\n    position: absolute;\n    width: 14px;\n    height: 14px;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    box-sizing: border-box;\n    background: #4af;\n    margin-top: -7px;\n    margin-left: -7px;\n}\n.line {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    background: #4af;\n    transform-origin: 0px 0.5px;\n}\n.line.rotation {\n    height: 40px;\n    width: 1px;\n    transform-origin: 0.5px 39.5px;\n}\n.line.rotation .control {\n    border-color: #4af;\n    background:#fff;\n    cursor: alias;\n}\n.control.origin {\n    border-color: #f55;\n    background: #fff;\n    width: 12px;\n    height: 12px;\n    margin-top: -6px;\n    margin-left: -6px;\n    pointer-events: none;\n}\n.control.e, .control.w {\n    cursor: ew-resize;\n}\n.control.s, .control.n {\n    cursor: ns-resize;\n}\n.control.nw, .control.se, :host.reverse .control.ne, :host.reverse .control.sw {\n    cursor: nwse-resize;\n}\n.control.ne, .control.sw, :host.reverse .control.nw, :host.reverse .control.se {\n    cursor: nesw-resize;\n}\n" + (isNotSupportTransformOrigin ? ":global svg *:before {\n    content:\"\";\n    transform-origin: inherit;\n}" : "") + "\n");
var NEARBY_POS = [[0, 1, 2], [1, 0, 3], [2, 0, 3], [3, 1, 2]];
var MIN_SCALE = 0.000000001;

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

function prefix() {
  var classNames = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    classNames[_i] = arguments[_i];
  }

  return frameworkUtils.prefixNames.apply(void 0, [PREFIX].concat(classNames));
}
function createIdentityMatrix3() {
  return createIdentityMatrix(3);
}
function getTransformMatrix(transform) {
  if (transform === "none") {
    return [1, 0, 0, 1, 0, 0];
  }

  if (utils.isObject(transform)) {
    return transform;
  }

  var value = utils.splitBracket(transform).value;
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
    var _a = utils.splitUnit(o),
        value = _a.value,
        unit = _a.unit;

    return value * measureSVGSize(el, unit, i === 0);
  });
}
function getTransformOrigin(style) {
  return style.transformOrigin.split(" ");
}
function caculateMatrixStack(target, container, isContainer, prevMatrix, prevN) {
  var _a;

  if (isContainer === void 0) {
    isContainer = target === container;
  }

  var el = target;
  var matrixes = [];
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

    var hasNotOffset = utils.isUndefined(offsetLeft);
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

    el = el.parentElement;
  }

  var mat = prevMatrix ? convertDimension(prevMatrix, prevN, n) : createIdentityMatrix(n);
  var beforeMatrix = createIdentityMatrix(n);
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

    if (utils.isObject(matrix[n - 1])) {
      _a = getSVGOffset(matrix[n - 1], container, n, matrix[2 * n - 1], mat, matrixes[i + 1]), matrix[n - 1] = _a[0], matrix[2 * n - 1] = _a[1];
    }

    mat = multiply(mat, matrix, n);
  });
  var transform = (is3d ? "matrix3d" : "matrix") + "(" + convertMatrixtoCSS(targetMatrix) + ")";
  return [beforeMatrix, offsetMatrix, mat, targetMatrix, transform, transformOrigin];
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
function rotateMatrix(matrix, rad) {
  var cos = Math.cos(rad);
  var sin = Math.sin(rad);
  return multiply([cos, -sin, 0, sin, cos, 0, 0, 0, 1], matrix, 3);
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
  var hasOffset = !utils.isUndefined(width);

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
  var relativeRotationPos = rotateMatrix([0, -40, 0], rotationRad);
  var rotationPos = [(pos1[0] + pos2[0]) / 2 + relativeRotationPos[0], (pos1[1] + pos2[1]) / 2 + relativeRotationPos[1]];
  return [rotationRad, rotationPos];
}
function getTargetInfo(target, container) {
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

  if (target) {
    var style = window.getComputedStyle(target);
    width = target.offsetWidth;
    height = target.offsetHeight;

    if (utils.isUndefined(width)) {
      _a = getSize(target, style, true), width = _a[0], height = _a[1];
    }

    var offsetMatrix = void 0;
    _b = caculateMatrixStack(target, container), beforeMatrix = _b[0], offsetMatrix = _b[1], matrix = _b[2], targetMatrix = _b[3], targetTransform = _b[4], transformOrigin = _b[5];
    is3d = matrix.length === 16;
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
function getMiddleLinePos(pos1, pos2) {
  return pos1.map(function (pos, i) {
    return utils.dot(pos, pos2[i], 1, 2);
  });
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
function unset(self, name) {
  if (self[name]) {
    self[name].unset();
    self[name] = null;
  }
}

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
  datas.startDragBeforeDist = caculate(datas.inverseBeforeMatrix, datas.absoluteOrigin, is3d ? 4 : 3);
  datas.startDragDist = caculate(datas.inverseMatrix, datas.absoluteOrigin, is3d ? 4 : 3);
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

function dragStart(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY;
  var target = moveable.props.target;
  var style = window.getComputedStyle(target);
  var state = moveable.state;
  var targetTransform = state.targetTransform;
  datas.datas = {};
  datas.left = parseFloat(style.left || "") || 0;
  datas.top = parseFloat(style.top || "") || 0;
  datas.bottom = parseFloat(style.bottom || "") || 0;
  datas.right = parseFloat(style.right || "") || 0;
  datas.transform = targetTransform;
  setDragStart(moveable, {
    datas: datas
  });
  datas.prevDist = [0, 0];
  datas.prevBeforeDist = [0, 0];
  var result = moveable.props.onDragStart({
    datas: datas.datas,
    target: target,
    clientX: clientX,
    clientY: clientY
  });

  if (result !== false) {
    state.isDrag = true;
  } else {
    state.isPinch = false;
  }

  return result;
}
function drag(moveable, _a) {
  var datas = _a.datas,
      distX = _a.distX,
      distY = _a.distY,
      clientX = _a.clientX,
      clientY = _a.clientY,
      inputEvent = _a.inputEvent;
  inputEvent.preventDefault();
  inputEvent.stopPropagation();
  var target = moveable.props.target;
  var throttleDrag = moveable.props.throttleDrag;
  var prevDist = datas.prevDist,
      prevBeforeDist = datas.prevBeforeDist,
      transform = datas.transform;
  var beforeDist = getDragDist({
    datas: datas,
    distX: distX,
    distY: distY
  }, true);
  var dist = getDragDist({
    datas: datas,
    distX: distX,
    distY: distY
  }, false);
  throttleArray(dist, throttleDrag);
  throttleArray(beforeDist, throttleDrag);
  var delta = minus(dist, prevDist);
  var beforeDelta = minus(beforeDist, prevBeforeDist);
  datas.prevDist = dist;
  datas.prevBeforeDist = beforeDist;
  var left = datas.left + beforeDist[0];
  var top = datas.top + beforeDist[1];
  var right = datas.right - beforeDist[0];
  var bottom = datas.bottom - beforeDist[1];
  var nextTransform = transform + " translate(" + dist[0] + "px, " + dist[1] + "px)";

  if (delta.every(function (num) {
    return !num;
  }) && beforeDelta.some(function (num) {
    return !num;
  })) {
    return;
  }

  moveable.props.onDrag({
    datas: datas.datas,
    target: target,
    transform: nextTransform,
    dist: dist,
    delta: delta,
    beforeDist: beforeDist,
    beforeDelta: beforeDelta,
    left: left,
    top: top,
    right: right,
    bottom: bottom,
    clientX: clientX,
    clientY: clientY,
    isPinch: moveable.state.isPinch
  });
  moveable.updateTarget();
}
function dragEnd(moveable, _a) {
  var datas = _a.datas,
      isDrag = _a.isDrag,
      clientX = _a.clientX,
      clientY = _a.clientY;
  var _b = moveable.props,
      target = _b.target,
      onDragEnd = _b.onDragEnd;
  moveable.state.isDrag = false;
  onDragEnd({
    target: target,
    isDrag: isDrag,
    clientX: clientX,
    clientY: clientY,
    datas: datas.datas
  });

  if (isDrag) {
    moveable.updateRect();
  }
}

function scaleStart(moveable, position, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      pinchFlag = _a.pinchFlag;
  var target = moveable.props.target;

  if (!position || !target) {
    return false;
  }

  var _b = moveable.state,
      width = _b.width,
      height = _b.height,
      targetTransform = _b.targetTransform;

  if (!pinchFlag) {
    setDragStart(moveable, {
      datas: datas
    });
  }

  datas.datas = {};
  datas.transform = targetTransform;
  datas.prevDist = [1, 1];
  datas.position = position;
  datas.width = width;
  datas.height = height;
  var result = moveable.props.onScaleStart({
    target: target,
    clientX: clientX,
    clientY: clientY,
    datas: datas.datas
  });

  if (result !== false) {
    moveable.state.isScale = true;
  }

  return result;
}
function scale(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      distX = _a.distX,
      distY = _a.distY,
      pinchDistance = _a.pinchDistance,
      pinchFlag = _a.pinchFlag;
  var prevDist = datas.prevDist,
      position = datas.position,
      width = datas.width,
      height = datas.height,
      transform = datas.transform;
  var _b = moveable.props,
      keepRatio = _b.keepRatio,
      target = _b.target,
      throttleScale = _b.throttleScale,
      onScale = _b.onScale;
  var scaleX;
  var scaleY;

  if (pinchFlag) {
    scaleX = (width + pinchDistance) / width;
    scaleY = (height + pinchDistance * height / width) / height;
  } else {
    var dist = getDragDist({
      datas: datas,
      distX: distX,
      distY: distY
    });
    var distWidth = position[0] * dist[0];
    var distHeight = position[1] * dist[1]; // diagonal

    if (keepRatio && position[0] && position[1] && width && height) {
      var size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
      var rad = getRad([0, 0], dist);
      var standardRad = getRad([0, 0], position);
      var distDiagonal = Math.cos(rad - standardRad) * size;
      distWidth = distDiagonal;
      distHeight = distDiagonal * height / width;
    }

    var nextWidth = width + distWidth;
    var nextHeight = height + distHeight;
    scaleX = nextWidth / width;
    scaleY = nextHeight / height;
  }

  scaleX = throttle(scaleX, throttleScale);
  scaleY = throttle(scaleY, throttleScale);

  if (scaleX === 0) {
    scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
  }

  if (scaleY === 0) {
    scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
  }

  var nowScale = [scaleX, scaleY];
  datas.prevDist = nowScale;

  if (scaleX === prevDist[0] && scaleY === prevDist[1]) {
    return;
  }

  onScale({
    target: target,
    scale: nowScale,
    dist: [scaleX / prevDist[0], scaleY / prevDist[1]],
    delta: minus(nowScale, prevDist),
    transform: transform + " scale(" + scaleX + ", " + scaleY + ")",
    clientX: clientX,
    clientY: clientY,
    datas: datas.datas,
    isPinch: !!pinchFlag
  });
  !pinchFlag && moveable.updateTarget();
}
function scaleEnd(moveable, _a) {
  var datas = _a.datas,
      isDrag = _a.isDrag,
      clientX = _a.clientX,
      clientY = _a.clientY,
      pinchFlag = _a.pinchFlag;
  moveable.state.isScale = false;
  moveable.props.onScaleEnd({
    target: moveable.props.target,
    isDrag: isDrag,
    clientX: clientX,
    clientY: clientY,
    datas: datas.datas
  });

  if (isDrag && !pinchFlag) {
    moveable.updateRect();
  }
}

function setRotateStartInfo(datas, clientX, clientY, origin, rotationPos) {
  datas.startAbsoluteOrigin = [clientX - rotationPos[0] + origin[0], clientY - rotationPos[1] + origin[1]];
  datas.prevDeg = getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180;
  datas.startDeg = datas.prevDeg;
  datas.loop = 0;
}

function getDeg(datas, deg, direction, throttleRotate) {
  var prevDeg = datas.prevDeg,
      startDeg = datas.startDeg,
      prevLoop = datas.loop;
  deg = throttle(deg, throttleRotate);

  if (prevDeg > deg && prevDeg > 270 && deg < 90) {
    // 360 => 0
    ++datas.loop;
  } else if (prevDeg < deg && prevDeg < 90 && deg > 270) {
    // 0 => 360
    --datas.loop;
  }

  var absolutePrevDeg = prevLoop * 360 + prevDeg;
  var absoluteDeg = datas.loop * 360 + deg;
  var delta = direction * (absoluteDeg - absolutePrevDeg);
  var dist = direction * (absoluteDeg - startDeg);
  datas.prevDeg = deg;
  return [delta, dist];
}

function getRotateInfo(datas, direction, clientX, clientY, throttleRotate) {
  return getDeg(datas, getRad(datas.startAbsoluteOrigin, [clientX, clientY]) / Math.PI * 180, direction, throttleRotate);
}

function rotateStart(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      pinchRotate = _a.pinchRotate,
      pinchFlag = _a.pinchFlag;
  var target = moveable.props.target;

  if (!target) {
    return false;
  }

  var state = moveable.state;
  var left = state.left,
      top = state.top,
      origin = state.origin,
      beforeOrigin = state.beforeOrigin,
      rotationPos = state.rotationPos,
      direction = state.direction,
      beforeDirection = state.beforeDirection,
      targetTransform = state.targetTransform;
  datas.transform = targetTransform;
  datas.left = left;
  datas.top = top;

  if (pinchFlag) {
    datas.beforeInfo = {
      prevDeg: pinchRotate,
      startDeg: pinchRotate,
      loop: 0
    };
    datas.afterInfo = {
      prevDeg: pinchRotate,
      startDeg: pinchRotate,
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
  datas.datas = {};
  var result = moveable.props.onRotateStart({
    datas: datas.datas,
    target: target,
    clientX: clientX,
    clientY: clientY
  });

  if (result !== false) {
    state.isRotate = true;
  }

  return result;
}
function rotate(moveable, _a) {
  var _b, _c, _d, _e;

  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      pinchRotate = _a.pinchRotate,
      pinchFlag = _a.pinchFlag;
  var direction = datas.direction,
      beforeDirection = datas.beforeDirection,
      beforeInfo = datas.beforeInfo,
      afterInfo = datas.afterInfo;
  var throttleRotate = moveable.props.throttleRotate;
  var delta;
  var dist;
  var beforeDelta;
  var beforeDist;

  if (pinchFlag) {
    _b = getDeg(afterInfo, pinchRotate, direction, throttleRotate), delta = _b[0], dist = _b[1];
    _c = getDeg(beforeInfo, pinchRotate, direction, throttleRotate), beforeDelta = _c[0], beforeDist = _c[1];
  } else {
    _d = getRotateInfo(afterInfo, direction, clientX, clientY, throttleRotate), delta = _d[0], dist = _d[1];
    _e = getRotateInfo(beforeInfo, beforeDirection, clientX, clientY, throttleRotate), beforeDelta = _e[0], beforeDist = _e[1];
  }

  if (!delta && !beforeDelta) {
    return;
  }

  moveable.props.onRotate({
    target: moveable.props.target,
    datas: datas.datas,
    delta: delta,
    dist: dist,
    clientX: clientX,
    clientY: clientY,
    beforeDist: beforeDist,
    beforeDelta: beforeDelta,
    transform: datas.transform + " rotate(" + dist + "deg)",
    isPinch: !!pinchFlag
  });
  !pinchFlag && moveable.updateTarget();
}
function rotateEnd(moveable, _a) {
  var datas = _a.datas,
      isDrag = _a.isDrag,
      clientX = _a.clientX,
      clientY = _a.clientY,
      pinchFlag = _a.pinchFlag;
  moveable.state.isRotate = false;
  moveable.props.onRotateEnd({
    datas: datas.datas,
    clientX: clientX,
    clientY: clientY,
    target: moveable.props.target,
    isDrag: isDrag
  });

  if (isDrag && !pinchFlag) {
    moveable.updateRect();
  }
}

function resizeStart(moveable, position, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      pinchFlag = _a.pinchFlag;
  var target = moveable.props.target;

  if (!target || !position) {
    return false;
  }

  var _b = moveable.state,
      width = _b.width,
      height = _b.height;
  !pinchFlag && setDragStart(moveable, {
    datas: datas
  });
  datas.datas = {};
  datas.position = position;
  datas.width = width;
  datas.height = height;
  datas.prevWidth = 0;
  datas.prevHeight = 0;
  var result = moveable.props.onResizeStart({
    datas: datas.datas,
    target: target,
    clientX: clientX,
    clientY: clientY
  });

  if (result !== false) {
    moveable.state.isResize = true;
  }

  return result;
}
function resize(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      distX = _a.distX,
      distY = _a.distY,
      pinchFlag = _a.pinchFlag,
      pinchDistance = _a.pinchDistance;
  var position = datas.position,
      width = datas.width,
      height = datas.height,
      prevWidth = datas.prevWidth,
      prevHeight = datas.prevHeight;
  var _b = moveable.props,
      target = _b.target,
      keepRatio = _b.keepRatio,
      throttleResize = _b.throttleResize,
      onResize = _b.onResize;
  var distWidth;
  var distHeight; // diagonal

  if (pinchFlag) {
    distWidth = pinchDistance;
    distHeight = pinchDistance * height / width;
  } else {
    var dist = getDragDist({
      datas: datas,
      distX: distX,
      distY: distY
    });
    distWidth = position[0] * dist[0];
    distHeight = position[1] * dist[1];

    if (keepRatio && position[0] && position[1] && width && height) {
      var size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
      var rad = getRad([0, 0], dist);
      var standardRad = getRad([0, 0], position);
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

  if (delta.every(function (num) {
    return !num;
  })) {
    return;
  }

  onResize({
    target: target,
    width: nextWidth,
    height: nextHeight,
    dist: [distWidth, distHeight],
    datas: datas.datas,
    delta: delta,
    clientX: clientX,
    clientY: clientY,
    isPinch: !!pinchFlag
  });
  !pinchFlag && moveable.updateRect();
}
function resizeEnd(moveable, _a) {
  var datas = _a.datas,
      isDrag = _a.isDrag,
      clientX = _a.clientX,
      clientY = _a.clientY,
      pinchFlag = _a.pinchFlag;
  moveable.state.isResize = false;
  moveable.props.onScaleEnd({
    target: moveable.props.target,
    datas: datas.datas,
    clientX: clientX,
    clientY: clientY,
    isDrag: isDrag
  });

  if (isDrag && !pinchFlag) {
    moveable.updateRect();
  }
}

function getRotatiion(touches) {
  return getRad([touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]) / Math.PI * 180;
}

function pinchStart(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      touches = _a.touches;
  datas.scaleDatas = {};
  datas.rotateDatas = {};
  datas.pinchDatas = {};
  var _b = moveable.props,
      pinchable = _b.pinchable,
      rotatable = _b.rotatable,
      scalable = _b.scalable,
      resizable = _b.resizable,
      target = _b.target;
  var isRotatable = pinchable && (pinchable === true ? rotatable : pinchable.indexOf("rotatable") > -1);
  var isResizable = pinchable && (pinchable === true ? resizable : pinchable.indexOf("resizable") > -1);
  var isScalable = isResizable ? false : pinchable && (pinchable === true ? scalable : pinchable.indexOf("scalable") > -1);
  moveable.state.isPinch = true;
  moveable.props.onPinchStart({
    target: target,
    clientX: clientX,
    clientY: clientY,
    datas: datas.pinchDatas
  });

  if (isRotatable) {
    rotateStart(moveable, {
      datas: datas.rotateDatas,
      clientX: clientX,
      clientY: clientY,
      pinchFlag: true,
      pinchRotate: getRotatiion(touches)
    });
  }

  if (isResizable) {
    resizeStart(moveable, [1, 1], {
      datas: datas.scaleDatas,
      clientX: clientX,
      clientY: clientY,
      pinchFlag: true
    });
  }

  if (isScalable) {
    scaleStart(moveable, [1, 1], {
      datas: datas.scaleDatas,
      clientX: clientX,
      clientY: clientY,
      pinchFlag: true
    });
  }

  moveable.state.isPinch = true;
}
function pinch(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      pinchScale = _a.scale,
      distance = _a.distance,
      touches = _a.touches,
      inputEvent = _a.inputEvent;
  var _b = moveable.state,
      isRotate = _b.isRotate,
      isScale = _b.isScale,
      isResize = _b.isResize;
  inputEvent.preventDefault();
  inputEvent.stopPropagation();
  moveable.props.onPinch({
    target: moveable.props.target,
    clientX: clientX,
    clientY: clientY,
    datas: datas.pinchDatas
  });

  if (isRotate) {
    rotate(moveable, {
      datas: datas.rotateDatas,
      pinchRotate: getRotatiion(touches),
      pinchFlag: true
    });
  }

  if (isResize) {
    var pinchDistance = distance * (1 - 1 / pinchScale);
    resize(moveable, {
      datas: datas.scaleDatas,
      clientX: clientX,
      clientY: clientY,
      pinchDistance: pinchDistance,
      pinchFlag: true
    });
  }

  if (isScale) {
    var pinchDistance = distance * (1 - 1 / pinchScale);
    scale(moveable, {
      datas: datas.scaleDatas,
      clientX: clientX,
      clientY: clientY,
      pinchDistance: pinchDistance,
      pinchFlag: true
    });
  }

  moveable.updateRect();
}
function pinchEnd(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      isPinch = _a.isPinch;
  var _b = moveable.state,
      isRotate = _b.isRotate,
      isScale = _b.isScale,
      isResize = _b.isResize;
  moveable.state.isPinch = false;
  moveable.props.onPinchEnd({
    target: moveable.props.target,
    isDrag: isPinch,
    clientX: clientX,
    clientY: clientY,
    datas: datas.pinchDatas
  });

  if (isRotate) {
    rotateEnd(moveable, {
      datas: datas.rotateDatas,
      clientX: clientX,
      clientY: clientY,
      isDrag: isPinch,
      pinchFlag: true
    });
  }

  if (isResize) {
    resizeEnd(moveable, {
      datas: datas.scaleDatas,
      clientX: clientX,
      clientY: clientY,
      isDrag: isPinch,
      pinchFlag: true
    });
  }

  if (isScale) {
    scaleEnd(moveable, {
      datas: datas.scaleDatas,
      clientX: clientX,
      clientY: clientY,
      isDrag: isPinch,
      pinchFlag: true
    });
  }

  moveable.updateRect();
}

function getDraggableDragger(moveable, target, draggable, pinchable) {
  var options = {
    container: window
  };

  if (draggable) {
    options.dragstart = function (e) {
      return dragStart(moveable, e);
    };

    options.drag = function (e) {
      return drag(moveable, e);
    };

    options.dragend = function (e) {
      return dragEnd(moveable, e);
    };
  }

  if (pinchable) {
    options.pinchstart = function (e) {
      return pinchStart(moveable, e);
    };

    options.pinch = function (e) {
      return pinch(moveable, e);
    };

    options.pinchend = function (e) {
      return pinchEnd(moveable, e);
    };
  }

  return new Dragger(target, options);
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

function warpStart(moveable, position, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY;
  var target = moveable.props.target;

  if (!position || !target) {
    return false;
  }

  var _b = moveable.state,
      transformOrigin = _b.transformOrigin,
      is3d = _b.is3d,
      targetTransform = _b.targetTransform,
      targetMatrix = _b.targetMatrix,
      width = _b.width,
      height = _b.height;
  datas.datas = {};
  datas.targetTransform = targetTransform;
  datas.targetMatrix = is3d ? targetMatrix : convertDimension(targetMatrix, 3, 4);
  datas.targetInverseMatrix = ignoreDimension(invert(datas.targetMatrix, 4), 3, 4);
  datas.position = position;
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
  datas.posNum = (position[0] === -1 ? 0 : 1) + (position[1] === -1 ? 0 : 2);
  datas.prevMatrix = createIdentityMatrix(4);
  var result = moveable.props.onWarpStart({
    target: target,
    clientX: clientX,
    clientY: clientY,
    datas: datas.datas
  });

  if (result !== false) {
    moveable.state.isWarp = true;
  }

  return result;
}
function warp$1(moveable, _a) {
  var datas = _a.datas,
      clientX = _a.clientX,
      clientY = _a.clientY,
      distX = _a.distX,
      distY = _a.distY;
  var posNum = datas.posNum,
      poses = datas.poses,
      targetInverseMatrix = datas.targetInverseMatrix,
      prevMatrix = datas.prevMatrix;
  var target = moveable.props.target;
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
    return;
  }

  var h = warp(poses[0], poses[1], poses[2], poses[3], nextPoses[0], nextPoses[1], nextPoses[2], nextPoses[3]);

  if (!h.length) {
    return;
  }

  var matrix = convertMatrixtoCSS(multiply(targetInverseMatrix, h, 4));
  var transform = datas.targetTransform + " matrix3d(" + matrix.join(",") + ")";
  var delta = multiply(invert(prevMatrix, 4), matrix, 4);
  datas.prevMatrix = matrix;
  moveable.props.onWarp({
    target: target,
    clientX: clientX,
    clientY: clientY,
    delta: delta,
    multiply: multiplyCSS,
    dist: matrix,
    transform: transform,
    datas: datas.datas
  });
  moveable.updateRect();
}
function warpEnd(moveable, _a) {
  var datas = _a.datas,
      isDrag = _a.isDrag,
      clientX = _a.clientX,
      clientY = _a.clientY;
  moveable.state.isWarp = false;
  moveable.props.onWarpEnd({
    target: moveable.props.target,
    clientX: clientX,
    clientY: clientY,
    isDrag: isDrag,
    datas: datas.datas
  });

  if (isDrag) {
    moveable.updateRect();
  }
}

function getMoveableDragger(moveable, target) {
  var type;
  return new Dragger(target, {
    container: window,
    dragstart: function (e) {
      var inputTarget = e.inputEvent.target;
      var _a = moveable.props,
          scalable = _a.scalable,
          resizable = _a.resizable,
          warpable = _a.warpable;
      type = "";

      if (!utils.hasClass(inputTarget, prefix("control"))) {
        return false;
      }

      if (utils.hasClass(inputTarget, prefix("rotation"))) {
        type = "rotate";
        return rotateStart(moveable, e);
      } else {
        var position = getPosition(inputTarget);

        if (scalable) {
          type = "scale";
          return scaleStart(moveable, position, e);
        } else if (resizable) {
          type = "resize";
          return resizeStart(moveable, position, e);
        } else if (warpable) {
          type = "warp";
          return warpStart(moveable, position, e);
        }
      }

      return false;
    },
    drag: function (e) {
      e.inputEvent.preventDefault();
      e.inputEvent.stopPropagation();

      if (!type) {
        return;
      } else if (type === "rotate") {
        return rotate(moveable, e);
      } else if (type === "scale") {
        return scale(moveable, e);
      } else if (type === "resize") {
        return resize(moveable, e);
      } else if (type === "warp") {
        return warp$1(moveable, e);
      }
    },
    dragend: function (e) {
      if (!type) {
        return;
      } else if (type === "rotate") {
        return rotateEnd(moveable, e);
      } else if (type === "scale") {
        return scaleEnd(moveable, e);
      } else if (type === "resize") {
        return resizeEnd(moveable, e);
      } else if (type === "warp") {
        return warpEnd(moveable, e);
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
      pos4: [0, 0],
      isDrag: false,
      isRotate: false,
      isScale: false,
      isResize: false,
      isPinch: false,
      isWarp: false
    };
    return _this;
  }

  var __proto = Moveable.prototype;

  __proto.isMoveableElement = function (target) {
    return target && (target.getAttribute("class") || "").indexOf(PREFIX) > -1;
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
        direction = _a.direction;
    return createElement(ControlBoxElement, {
      ref: frameworkUtils.ref(this, "controlBox"),
      className: prefix("control-box", direction === -1 ? "reverse" : ""),
      style: {
        position: this.props.container ? "absolute" : "fixed",
        display: target ? "block" : "none",
        transform: "translate(" + left + "px, " + top + "px) translateZ(50px)"
      }
    }, createElement("div", {
      className: prefix("line"),
      style: getLineStyle(pos1, pos2)
    }), createElement("div", {
      className: prefix("line"),
      style: getLineStyle(pos2, pos4)
    }), createElement("div", {
      className: prefix("line"),
      style: getLineStyle(pos1, pos3)
    }), createElement("div", {
      className: prefix("line"),
      style: getLineStyle(pos3, pos4)
    }), this.renderRotation(), this.renderPosition(), this.renderMiddleLine(), this.renderDiagonalPosition(), this.renderOrigin());
  };

  __proto.componentDidMount = function () {
    /* rotatable */

    /* resizable */

    /* scalable */

    /* warpable */
    this.moveableDragger = getMoveableDragger(this, this.controlBox.getElement());
  };

  __proto.componentWillUnmount = function () {
    unset(this, "draggableDragger");
    unset(this, "moveableDragger");
  };

  __proto.renderRotation = function () {
    if (!this.props.rotatable) {
      return null;
    }

    var _a = this.state,
        pos1 = _a.pos1,
        pos2 = _a.pos2,
        rotationRad = _a.rotationRad;
    return createElement("div", {
      className: prefix("line rotation"),
      style: {
        // tslint:disable-next-line: max-line-length
        transform: "translate(" + (pos1[0] + pos2[0]) / 2 + "px, " + (pos1[1] + pos2[1]) / 2 + "px) translateY(-40px) rotate(" + rotationRad + "rad)"
      }
    }, createElement("div", {
      className: prefix("control", "rotation"),
      ref: frameworkUtils.ref(this, "rotationElement")
    }));
  };

  __proto.renderOrigin = function () {
    if (!this.props.origin) {
      return null;
    }

    var beforeOrigin = this.state.beforeOrigin;
    return [// <div className={prefix("control", "origin")} style={getControlTransform(origin)} key="origin"></div>,
    createElement("div", {
      className: prefix("control", "origin"),
      style: getControlTransform(beforeOrigin),
      key: "beforeOrigin"
    })];
  };

  __proto.renderDiagonalPosition = function () {
    var _a = this.props,
        resizable = _a.resizable,
        scalable = _a.scalable,
        warpable = _a.warpable;

    if (!resizable && !scalable && !warpable) {
      return null;
    }

    var _b = this.state,
        pos1 = _b.pos1,
        pos2 = _b.pos2,
        pos3 = _b.pos3,
        pos4 = _b.pos4;
    return [createElement("div", {
      className: prefix("control", "nw"),
      "data-position": "nw",
      key: "nw",
      style: getControlTransform(pos1)
    }), createElement("div", {
      className: prefix("control", "ne"),
      "data-position": "ne",
      key: "ne",
      style: getControlTransform(pos2)
    }), createElement("div", {
      className: prefix("control", "sw"),
      "data-position": "sw",
      key: "sw",
      style: getControlTransform(pos3)
    }), createElement("div", {
      className: prefix("control", "se"),
      "data-position": "se",
      key: "se",
      style: getControlTransform(pos4)
    })];
  };

  __proto.renderMiddleLine = function () {
    var _a = this.props,
        resizable = _a.resizable,
        scalable = _a.scalable,
        warpable = _a.warpable;

    if (resizable || scalable || !warpable) {
      return;
    }

    var _b = this.state,
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
    return [createElement("div", {
      className: prefix("line"),
      key: "middeLine1",
      style: getLineStyle(linePosFrom1, linePosTo1)
    }), createElement("div", {
      className: prefix("line"),
      key: "middeLine2",
      style: getLineStyle(linePosFrom2, linePosTo2)
    }), createElement("div", {
      className: prefix("line"),
      style: getLineStyle(linePosFrom3, linePosTo3)
    }), createElement("div", {
      className: prefix("line"),
      style: getLineStyle(linePosFrom4, linePosTo4)
    })];
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
      className: prefix("control", "n"),
      "data-position": "n",
      key: "n",
      style: getControlTransform(pos1, pos2)
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
      className: prefix("control", "s"),
      "data-position": "s",
      key: "s",
      style: getControlTransform(pos3, pos4)
    })];
  };

  __proto.dragstart = function (e) {
    if (this.draggableDragger) {
      this.draggableDragger.onDragStart(e);
    }
  };

  __proto.updateRect = function (isNotSetState) {
    var _a = this.props,
        target = _a.target,
        container = _a.container,
        draggable = _a.draggable,
        pinchable = _a.pinchable;
    var state = this.state;

    if (state.target !== target) {
      unset(this, "draggableDragger");
      this.updateState({
        isDrag: false,
        isRotate: false,
        isScale: false,
        isResize: false,
        isWarp: false,
        isPinch: false
      }, true);

      if (target && (draggable || pinchable)) {
        this.draggableDragger = getDraggableDragger(this, target, draggable, pinchable);
      }
    }

    this.updateState(getTargetInfo(target, container), isNotSetState);
  };

  __proto.updateTarget = function () {
    var _a = this.state,
        width = _a.width,
        height = _a.height,
        beforeMatrix = _a.beforeMatrix,
        is3d = _a.is3d;
    var _b = this.props,
        target = _b.target,
        container = _b.container;
    var n = is3d ? 4 : 3;

    var _c = caculateMatrixStack(target, container, true, beforeMatrix, n),
        offsetMatrix = _c[1],
        matrix = _c[2],
        targetMatrix = _c[3],
        targetTransform = _c[4],
        transformOrigin = _c[5];

    var _d = caculateMoveablePosition(matrix, transformOrigin, width, height),
        _e = _d[0],
        left = _e[0],
        top = _e[1],
        nextOrigin = _d[1],
        pos1 = _d[2],
        pos2 = _d[3],
        pos3 = _d[4],
        pos4 = _d[5],
        direction = _d[6];

    n = offsetMatrix.length === 16 ? 4 : 3;
    var beforeOrigin = minus(caculatePosition(offsetMatrix, sum(transformOrigin, getOrigin(targetMatrix, n)), n), [left, top]);

    var _f = getRotationInfo(pos1, pos2, direction),
        rotationRad = _f[0],
        rotationPos = _f[1];

    this.setState({
      direction: direction,
      beforeOrigin: beforeOrigin,
      rotationRad: rotationRad,
      rotationPos: rotationPos,
      pos1: pos1,
      pos2: pos2,
      pos3: pos3,
      pos4: pos4,
      origin: nextOrigin,
      beforeMatrix: beforeMatrix,
      targetMatrix: targetMatrix,
      matrix: matrix,
      transformOrigin: transformOrigin,
      targetTransform: targetTransform,
      left: left,
      top: top
    });
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
    target: null,
    container: null,
    rotatable: false,
    draggable: false,
    scalable: false,
    resizable: false,
    warpable: false,
    pinchable: false,
    keepRatio: true,
    origin: true,
    throttleDrag: 0,
    throttleResize: 0,
    throttleScale: 0,
    throttleRotate: 0,
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
    onResizeEnd: function () {},
    onWarpStart: function () {},
    onWarp: function () {},
    onWarpEnd: function () {},
    onPinchStart: function () {},
    onPinch: function () {},
    onPinchEnd: function () {}
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
      ref: frameworkUtils.ref(this, "preactMoveable")
    }, this.state));
  };

  return InnerMoveable;
}(Component);

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

    _this.onDragStart = function (e) {
      _this.trigger("dragStart", e);
    };

    _this.onDrag = function (e) {
      _this.trigger("drag", e);
    };

    _this.onDragEnd = function (e) {
      _this.trigger("dragEnd", e);
    };

    _this.onResizeStart = function (e) {
      _this.trigger("resizeStart", e);
    };

    _this.onResize = function (e) {
      _this.trigger("resize", e);
    };

    _this.onResizeEnd = function (e) {
      _this.trigger("resizeEnd", e);
    };

    _this.onScaleStart = function (e) {
      _this.trigger("scaleStart", e);
    };

    _this.onScale = function (e) {
      _this.trigger("scale", e);
    };

    _this.onScaleEnd = function (e) {
      _this.trigger("scaleEnd", e);
    };

    _this.onRotateStart = function (e) {
      _this.trigger("rotateStart", e);
    };

    _this.onRotate = function (e) {
      _this.trigger("rotate", e);
    };

    _this.onRotateEnd = function (e) {
      _this.trigger("rotateEnd", e);
    };

    _this.onWarpStart = function (e) {
      _this.trigger("warpStart", e);
    };

    _this.onWarp = function (e) {
      _this.trigger("warp", e);
    };

    _this.onWarpEnd = function (e) {
      _this.trigger("warpEnd", e);
    };

    _this.onPinchStart = function (e) {
      _this.trigger("pinchStart", e);
    };

    _this.onPinch = function (e) {
      _this.trigger("pinch", e);
    };

    _this.onPinchEnd = function (e) {
      _this.trigger("pinchEnd", e);
    };

    var element = document.createElement("div");

    var nextOptions = __assign({
      container: parentElement
    }, options);

    render(h(InnerMoveable, __assign({
      ref: frameworkUtils.ref(_this, "innerMoveable")
    }, nextOptions, {
      onDragStart: _this.onDragStart,
      onDrag: _this.onDrag,
      onDragEnd: _this.onDragEnd,
      onResizeStart: _this.onResizeStart,
      onResize: _this.onResize,
      onResizeEnd: _this.onResizeEnd,
      onScaleStart: _this.onScaleStart,
      onScale: _this.onScale,
      onScaleEnd: _this.onScaleEnd,
      onRotateStart: _this.onRotateStart,
      onRotate: _this.onRotate,
      onRotateEnd: _this.onRotateEnd,
      onWarpStart: _this.onWarpStart,
      onWarp: _this.onWarp,
      onWarpEnd: _this.onWarpEnd,
      onPinchStart: _this.onPinchStart,
      onPinch: _this.onPinch,
      onPinchEnd: _this.onPinchEnd
    })), element);
    parentElement.appendChild(element.children[0]);
    return _this;
  }

  var __proto = Moveable.prototype;
  Object.defineProperty(__proto, "origin", {
    /**
     * Whether or not the origin controlbox will be visible or not
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.origin = true;
     */
    get: function () {
      return this.getMoveableProps().origin;
    },
    set: function (origin) {
      this.innerMoveable.setState({
        origin: origin
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "target", {
    /**
     * The target to indicate Moveable Control Box.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     * moveable.target = document.querySelector(".target");
     */
    get: function () {
      return this.getMoveableProps().target;
    },
    set: function (target) {
      if (target !== this.target) {
        this.innerMoveable.setState({
          target: target
        });
      } else {
        this.updateRect();
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "draggable", {
    /**
     * Whether or not target can be dragged.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.draggable = true;
     */
    get: function () {
      return this.getMoveableProps().draggable || false;
    },
    set: function (draggable) {
      this.innerMoveable.setState({
        draggable: draggable
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "resizable", {
    /**
     * Whether or not target can be resized.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.resizable = true;
     */
    get: function () {
      return this.getMoveableProps().resizable;
    },
    set: function (resizable) {
      this.innerMoveable.setState({
        resizable: resizable
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "scalable", {
    /**
     * Whether or not target can scaled.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.scalable = true;
     */
    get: function () {
      return this.getMoveableProps().scalable;
    },
    set: function (scalable) {
      this.innerMoveable.setState({
        scalable: scalable
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "rotatable", {
    /**
     * Whether or not target can be rotated.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.rotatable = true;
     */
    get: function () {
      return this.getMoveableProps().rotatable;
    },
    set: function (rotatable) {
      this.innerMoveable.setState({
        rotatable: rotatable
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "warpable", {
    /**
     * Whether or not target can be warped.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.warpable = true;
     */
    get: function () {
      return this.getMoveableProps().warpable;
    },
    set: function (warpable) {
      this.innerMoveable.setState({
        warpable: warpable
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "pinchable", {
    /**
     * Whether or not target can be pinched with draggable, resizable, scalable, rotatable
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.pinchable = true;
     */
    get: function () {
      return this.getMoveableProps().pinchable;
    },
    set: function (pinchable) {
      this.innerMoveable.setState({
        pinchable: pinchable
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "keepRatio", {
    /**
     * When resize or scale, keeps a ratio of the width, height.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.keepRatio = true;
     */
    get: function () {
      return this.getMoveable().props.keepRatio;
    },
    set: function (keepRatio) {
      this.innerMoveable.setState({
        keepRatio: keepRatio
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "throttleDrag", {
    /**
     * throttle of x, y when drag.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.throttleDrag = 1;
     */
    get: function () {
      return this.getMoveable().props.throttleDrag;
    },
    set: function (throttleDrag) {
      this.innerMoveable.setState({
        throttleDrag: throttleDrag
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "throttleResize", {
    /**
     * throttle of width, height when resize.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.throttleResize = 1;
     */
    get: function () {
      return this.getMoveable().props.throttleResize;
    },
    set: function (throttleResize) {
      this.innerMoveable.setState({
        throttleResize: throttleResize
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "throttleScale", {
    /**
     * throttle of scaleX, scaleY when scale.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.throttleScale = 0.1;
     */
    get: function () {
      return this.getMoveable().props.throttleScale;
    },
    set: function (throttleScale) {
      this.innerMoveable.setState({
        throttleScale: throttleScale
      });
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(__proto, "throttleRotate", {
    /**
     * hrottle of angle(degree) when rotate.
     * @example
     * import Moveable from "moveable";
     *
     * const moveable = new Moveable(document.body);
     *
     * moveable.throttleRotate = 1;
     */
    get: function () {
      return this.getMoveable().props.throttleRotate;
    },
    set: function (throttleRotate) {
      this.innerMoveable.setState({
        throttleRotate: throttleRotate
      });
    },
    enumerable: true,
    configurable: true
  });
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
    this.innerMoveable = null;
    this.getMoveable().componentWillUnmount();
  };

  __proto.getMoveable = function () {
    return this.innerMoveable.preactMoveable;
  };

  __proto.getMoveableProps = function () {
    return this.getMoveable().props;
  };

  return Moveable;
}(EgComponent);

exports.default = Moveable$1;
//# sourceMappingURL=moveable.cjs.js.map
