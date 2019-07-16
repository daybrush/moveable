/*
Copyright (c) 2019 Daybrush
name: moveable
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/moveable.git
version: 0.2.0
*/
import EgComponent from '@egjs/component';
import { prefixCSS, prefixNames, ref } from 'framework-utils';
import { hasClass, splitBracket, isUndefined } from '@daybrush/utils';
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
version: 0.3.3
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
version: 0.3.2
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
version: 0.4.0
*/

/*
Copyright (c) 2019 Daybrush
name: react-moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/react-moveable
version: 0.5.0
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
var MOVEABLE_CSS = prefixCSS(PREFIX, "\n{\n    position: fixed;\n    width: 0;\n    height: 0;\n    left: 0;\n    top: 0;\n    z-index: 3000;\n}\n.line, .control {\n    left: 0;\n    top: 0;\n}\n.control {\n    position: absolute;\n    width: 14px;\n    height: 14px;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    box-sizing: border-box;\n    background: #4af;\n    margin-top: -7px;\n    margin-left: -7px;\n}\n.line {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    background: #4af;\n    transform-origin: 0px 0.5px;\n}\n.line.rotation {\n    height: 40px;\n    width: 1px;\n    transform-origin: 0.5px 39.5px;\n}\n.line.rotation .control {\n    border-color: #4af;\n    background:#fff;\n    cursor: alias;\n}\n.control.origin {\n    border-color: #f55;\n    background: #fff;\n    width: 12px;\n    height: 12px;\n    margin-top: -6px;\n    margin-left: -6px;\n}\n.control.e, .control.w {\n    cursor: ew-resize;\n}\n.control.s, .control.n {\n    cursor: ns-resize;\n}\n.control.nw, .control.se, :host.reverse .control.ne, :host.reverse .control.sw {\n    cursor: nwse-resize;\n}\n.control.ne, .control.sw, :host.reverse .control.nw, :host.reverse .control.se {\n    cursor: nesw-resize;\n}\n");

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
function getTransform(target, isInit) {
  var transform = window.getComputedStyle(target).transform;

  if (transform === "none") {
    if (isInit) {
      return [1, 0, 0, 1, 0, 0];
    }

    return "none";
  } else {
    var value = splitBracket(transform).value;
    return value.split(/s*,\s*/g).map(function (v) {
      return parseFloat(v);
    });
  }
}
function caculateMatrixStack(target) {
  var el = target;
  var matrixes = [];

  while (el) {
    matrixes.push(getTransform(el));
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
function getRotationInfo(origin, pos1, pos2) {
  var pos1Rad = getRad(origin, pos1);
  var pos2Rad = getRad(origin, pos2);
  var direction = pos1Rad < pos2Rad && pos2Rad - pos1Rad < Math.PI || pos1Rad > pos2Rad && pos2Rad - pos1Rad < -Math.PI ? 1 : -1;
  var rotationRad = getRad(direction > 0 ? pos1 : pos2, direction > 0 ? pos2 : pos1);
  var relativeRotationPos = caculateRotationMatrix([0, -40, 0], rotationRad);
  var rotationPos = [(pos1[0] + pos2[0]) / 2 + relativeRotationPos[0], (pos1[1] + pos2[1]) / 2 + relativeRotationPos[1]];
  return [direction, rotationRad, rotationPos];
}
function getTargetInfo(target, container) {
  var _a, _b, _c, _d;

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
    } // 1 : clockwise
    // -1 : counterclockwise


    _d = getRotationInfo(origin, pos1, pos2), direction = _d[0], rotationRad = _d[1], rotationPos = _d[2];
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
      beforeMatrix = _b.beforeMatrix,
      width = _b.width,
      height = _b.height,
      left = _b.left,
      top = _b.top,
      transformOrigin = _b.transformOrigin,
      origin = _b.origin;
  datas.matrix = invert3x2(matrix.slice());
  datas.beforeMatrix = beforeMatrix;
  datas.transform = style.transform;
  datas.prevDist = [1, 1];
  datas.position = position;
  datas.width = width;
  datas.height = height;
  datas.transformOrigin = transformOrigin;
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
  var matrix = datas.matrix,
      beforeMatrix = datas.beforeMatrix,
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
  var target = moveable.props.target;
  datas.prevDist = [scaleX, scaleY];
  moveable.props.onScale({
    target: target,
    scale: [scaleX, scaleY],
    dist: [scaleX / prevDist[0], scaleY / prevDist[1]],
    delta: [scaleX - prevDist[0], scaleY - prevDist[1]],
    transform: transform + " scale(" + scaleX + ", " + scaleY + ")"
  });
  moveable.updateTargetRect(target, {
    beforeMatrix: beforeMatrix,
    transformOrigin: transformOrigin,
    origin: originalOrigin,
    width: width,
    height: height,
    left: left,
    top: top
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

function getRotateInfo(datas, clientX, clientY) {
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
  datas.prevRad = rad;
  return {
    delta: direction * (absoluteRad - absolutePrevRad) / Math.PI * 180,
    dist: direction * (absolutePrevRad - startRad) / Math.PI * 180,
    beforeDelta: (absoluteRad - absolutePrevRad) / Math.PI * 180,
    beforeDist: (absolutePrevRad - startRad) / Math.PI * 180,
    origin: origin
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

  var _b = getRotateInfo(datas, clientX, clientY),
      delta = _b.delta,
      dist = _b.dist,
      beforeDist = _b.beforeDist,
      beforeDelta = _b.beforeDelta;

  moveable.props.onRotate({
    target: moveable.props.target,
    delta: delta,
    dist: dist,
    beforeDist: beforeDist,
    beforeDelta: beforeDelta,
    transform: datas.transform + " rotate(" + dist + "deg)"
  });
  moveable.updateTargetRect(moveable.props.target, moveable.state);
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

  var matrix = moveable.state.matrix;

  var _b = getSize(target),
      width = _b[0],
      height = _b[1];

  datas.matrix = invert3x2(matrix.slice());
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

  __proto.updateTargetRect = function (target, nextState) {
    var beforeMatrix = nextState.beforeMatrix,
        transformOrigin = nextState.transformOrigin,
        width = nextState.width,
        height = nextState.height,
        left = nextState.left,
        top = nextState.top,
        originalOrigin = nextState.origin;
    var nextTransform = getTransform(target, true);

    var _a = caculatePosition(multiple3x2(beforeMatrix.slice(), nextTransform), transformOrigin, width, height),
        origin = _a[0],
        pos1 = _a[1],
        pos2 = _a[2],
        pos3 = _a[3],
        pos4 = _a[4];

    var nextLeft = left + originalOrigin[0] - origin[0];
    var nextTop = top + originalOrigin[1] - origin[1];

    var _b = getRotationInfo(origin, pos1, pos2),
        direction = _b[0],
        rotationRad = _b[1],
        rotationPos = _b[2];

    this.setState({
      direction: direction,
      rotationRad: rotationRad,
      rotationPos: rotationPos,
      origin: origin,
      pos1: pos1,
      pos2: pos2,
      pos3: pos3,
      pos4: pos4,
      left: nextLeft,
      top: nextTop
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

    var element = document.createElement("div");
    render(h(InnerMoveable, __assign({
      ref: ref(_this, "innerMoveable")
    }, options, {
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
      onRotateEnd: _this.onRotateEnd
    })), element);
    parentElement.appendChild(element.children[0]);
    return _this;
  }

  var __proto = Moveable.prototype;
  Object.defineProperty(__proto, "origin", {
    /**
     * target is target
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
     * target is target
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
  /**
   * Move the moveable as much as the `pos`.
   * @param - the values of x and y to move moveable.
   * @example
   * import Moveable from "moveable";
   *
   * const moveable = new Moveable(document.body);
   *
   * moveable.move([0, -10]);
   */

  __proto.move = function (pos) {
    this.getMoveable().move(pos);
  };
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
   * If the width, height, left, and top of the target change, update the shape of the moveable.
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

  __proto.getMoveable = function () {
    return this.innerMoveable.preactMoveable;
  };

  __proto.getMoveableProps = function () {
    return this.getMoveable().props;
  };

  return Moveable;
}(EgComponent);

export default Moveable$1;
//# sourceMappingURL=moveable.esm.js.map
