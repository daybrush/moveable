/*
Copyright (c) 2019 Daybrush
name: moveable
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/moveable.git
version: 0.13.4
*/
'use strict';

var EgComponent = require('@egjs/component');
var frameworkUtils = require('framework-utils');
var getAgent = require('@egjs/agent');
var utils = require('@daybrush/utils');
var cssStyled = require('css-styled');
var Dragger = require('@daybrush/drag');
var ChildrenDiffer = require('@egjs/children-differ');

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

var n,u,i,t,o,f,r={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n);}function h(n,l,u){var i,t,o,f,r=arguments;if(l=s({},l),arguments.length>3)for(u=[u],i=3;i<arguments.length;i++)u.push(r[i]);if(null!=u&&(l.children=u),null!=n&&null!=n.defaultProps)for(t in n.defaultProps)void 0===l[t]&&(l[t]=n.defaultProps[t]);return f=l.key,null!=(o=l.ref)&&delete l.ref,null!=f&&delete l.key,v(n,l,f,o)}function v(l,u,i,t){var o={type:l,props:u,key:i,ref:t,__k:null,__p:null,__b:0,__e:null,__d:null,__c:null,constructor:void 0};return n.vnode&&n.vnode(o),o}function p(){return {}}function d(n){return n.children}function y(n,l){this.props=n,this.context=l;}function m(n,l){if(null==l)return n.__p?m(n.__p,n.__p.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?m(n):null}function w(n){var l,u;if(null!=(n=n.__p)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return w(n)}}function g(l){(!l.__d&&(l.__d=!0)&&1===u.push(l)||t!==n.debounceRendering)&&(t=n.debounceRendering,(n.debounceRendering||i)(k));}function k(){var n,l,i,t,o,f,r;for(u.sort(function(n,l){return l.__v.__b-n.__v.__b});n=u.pop();)n.__d&&(i=void 0,t=void 0,f=(o=(l=n).__v).__e,(r=l.__P)&&(i=[],t=T(r,o,s({},o),l.__n,void 0!==r.ownerSVGElement,null,i,null==f?m(o):f),$(i,o),t!=f&&w(o)));}function _(n,l,u,i,t,o,f,c,s){var h,v,p,d,y,w,g,k=u&&u.__k||e,_=k.length;if(c==r&&(c=null!=o?o[0]:_?m(u,0):null),h=0,l.__k=b(l.__k,function(u){if(null!=u){if(u.__p=l,u.__b=l.__b+1,null===(p=k[h])||p&&u.key==p.key&&u.type===p.type)k[h]=void 0;else for(v=0;v<_;v++){if((p=k[v])&&u.key==p.key&&u.type===p.type){k[v]=void 0;break}p=null;}if(d=T(n,u,p=p||r,i,t,o,f,c,s),(v=u.ref)&&p.ref!=v&&(g||(g=[])).push(v,u.__c||d,u),null!=d){if(null==w&&(w=d),null!=u.__d)d=u.__d,u.__d=null;else if(o==p||d!=c||null==d.parentNode){n:if(null==c||c.parentNode!==n)n.appendChild(d);else{for(y=c,v=0;(y=y.nextSibling)&&v<_;v+=2)if(y==d)break n;n.insertBefore(d,c);}"option"==l.type&&(n.value="");}c=d.nextSibling,"function"==typeof l.type&&(l.__d=d);}}return h++,u}),l.__e=w,null!=o&&"function"!=typeof l.type)for(h=o.length;h--;)null!=o[h]&&a(o[h]);for(h=_;h--;)null!=k[h]&&A(k[h],k[h]);if(g)for(h=0;h<g.length;h++)z(g[h],g[++h],g[++h]);}function b(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var i=0;i<n.length;i++)b(n[i],l,u);else u.push(l?l("string"==typeof n||"number"==typeof n?v(null,n,null,null):null!=n.__e||null!=n.__c?v(n.type,n.props,n.key,null):n):n);return u}function x(n,l,u,i,t){var o;for(o in u)o in l||P(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"value"===o||"checked"===o||u[o]===l[o]||P(n,o,l[o],u[o],i);}function C(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===c.test(l)?u+"px":null==u?"":u;}function P(n,l,u,i,t){var o,f,r,e,c;if("key"===(l=t?"className"===l?"class":l:"class"===l?"className":l)||"children"===l);else if("style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else{if("string"==typeof i&&(o.cssText="",i=null),i)for(f in i)u&&f in u||C(o,f,"");if(u)for(r in u)i&&u[r]===i[r]||C(o,r,u[r]);}else"o"===l[0]&&"n"===l[1]?(e=l!==(l=l.replace(/Capture$/,"")),c=l.toLowerCase(),l=(c in n?c:l).slice(2),u?(i||n.addEventListener(l,N,e),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,N,e)):"list"!==l&&"tagName"!==l&&"form"!==l&&!t&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u?n.removeAttribute(l):n.setAttribute(l,u));}function N(l){this.l[l.type](n.event?n.event(l):l);}function T(l,u,i,t,o,f,r,e,c){var a,h,v,p,m,w,g,k,x,C,P=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(k=u.props,x=(a=P.contextType)&&t[a.__c],C=a?x?x.props.value:a.__p:t,i.__c?g=(h=u.__c=i.__c).__p=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(k,C):(u.__c=h=new y(k,C),h.constructor=P,h.render=D),x&&x.sub(h),h.props=k,h.state||(h.state={}),h.context=C,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&s(h.__s==h.state?h.__s=s({},h.__s):h.__s,P.getDerivedStateFromProps(k,h.__s)),p=h.props,m=h.state,v)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else{if(null==P.getDerivedStateFromProps&&null==h.__e&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(k,C),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(k,h.__s,C)){for(h.props=k,h.state=h.__s,h.__d=!1,h.__v=u,u.__e=i.__e,u.__k=i.__k,a=0;a<u.__k.length;a++)u.__k[a]&&(u.__k[a].__p=u);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(k,h.__s,C),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(p,m,w);});}h.context=C,h.props=k,h.state=h.__s,(a=n.__r)&&a(u),h.__d=!1,h.__v=u,h.__P=l,a=h.render(h.props,h.state,h.context),u.__k=b(null!=a&&a.type==d&&null==a.key?a.props.children:a),null!=h.getChildContext&&(t=s(s({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(w=h.getSnapshotBeforeUpdate(p,m)),_(l,u,i,t,o,f,r,e,c),h.base=u.__e,h.__h.length&&r.push(h),g&&(h.__E=h.__p=null),h.__e=null;}else u.__e=j(i.__e,u,i,t,o,f,r,c);(a=n.diffed)&&a(u);}catch(l){n.__e(l,u,i);}return u.__e}function $(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n.__e(l,u.__v);}});}function j(n,l,u,i,t,o,f,c){var s,a,h,v,p,d=u.props,y=l.props;if(t="svg"===l.type||t,null==n&&null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&(null===l.type?3===a.nodeType:a.localName===l.type)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(y);n=t?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type),o=null;}if(null===l.type)null!=o&&(o[o.indexOf(n)]=null),d!==y&&(n.data=y);else if(l!==u){if(null!=o&&(o=e.slice.call(n.childNodes)),h=(d=u.props||r).dangerouslySetInnerHTML,v=y.dangerouslySetInnerHTML,!c){if(d===r)for(d={},p=0;p<n.attributes.length;p++)d[n.attributes[p].name]=n.attributes[p].value;(v||h)&&(v&&h&&v.__html==h.__html||(n.innerHTML=v&&v.__html||""));}x(n,y,d,t,c),l.__k=l.props.children,v||_(n,l,u,i,"foreignObject"!==l.type&&t,o,f,r,c),c||("value"in y&&void 0!==y.value&&y.value!==n.value&&(n.value=null==y.value?"":y.value),"checked"in y&&void 0!==y.checked&&y.checked!==n.checked&&(n.checked=y.checked));}return n}function z(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,i);}}function A(l,u,i){var t,o,f;if(n.unmount&&n.unmount(l),(t=l.ref)&&z(t,null,u),i||"function"==typeof l.type||(i=null!=(o=l.__e)),l.__e=l.__d=null,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(f=0;f<t.length;f++)t[f]&&A(t[f],u,i);null!=o&&a(o);}function D(n,l,u){return this.constructor(n,u)}function H(l,u,i){var t,f,c;n.__p&&n.__p(l,u),f=(t=i===o)?null:i&&i.__k||u.__k,l=h(d,null,[l]),c=[],T(u,(t?u:i||u).__k=l,f||r,r,void 0!==u.ownerSVGElement,i&&!t?[i]:f?null:e.slice.call(u.childNodes),c,i||r,t),$(c,l);}function I(n,l){H(n,l,o);}function L(n,l){return l=s(s({},n.props),l),arguments.length>2&&(l.children=e.slice.call(arguments,2)),v(n.type,l,l.key||n.key,l.ref||n.ref)}function M(n){var l={},u={__c:"__cC"+f++,__p:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var i,t=this;return this.getChildContext||(i=[],this.getChildContext=function(){return l[u.__c]=t,l},this.shouldComponentUpdate=function(l){n.value!==l.value&&i.some(function(n){n.context=l.value,g(n);});},this.sub=function(n){i.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){i.splice(i.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Consumer.contextType=u,u}n={},y.prototype.setState=function(n,l){var u=this.__s!==this.state&&this.__s||(this.__s=s({},this.state));("function"!=typeof n||(n=n(u,this.props)))&&s(u,n),null!=n&&this.__v&&(this.__e=!1,l&&this.__h.push(l),g(this));},y.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),g(this));},y.prototype.render=d,u=[],i="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,t=n.debounceRendering,n.__e=function(n,l,u){for(var i;l=l.__p;)if((i=l.__c)&&!i.__p)try{if(i.constructor&&null!=i.constructor.getDerivedStateFromError)i.setState(i.constructor.getDerivedStateFromError(n));else{if(null==i.componentDidCatch)continue;i.componentDidCatch(n);}return g(i.__E=i)}catch(l){n=l;}throw n},o=r,f=0;

var t$1,r$1,u$1=[],i$1=n.__r;n.__r=function(n){i$1&&i$1(n),t$1=0,(r$1=n.__c).__H&&(r$1.__H.t.forEach(g$1),r$1.__H.t.forEach(q),r$1.__H.t=[]);};var o$1=n.diffed;n.diffed=function(n){o$1&&o$1(n);var t=n.__c;if(t){var r=t.__H;r&&r.t.length&&A$1(u$1.push(t));}};var f$1=n.__c;n.__c=function(n,t){t.some(function(n){n.__h.forEach(g$1),n.__h=n.__h.filter(function(n){return !n.u||q(n)});}),f$1&&f$1(n,t);};var c$1=n.unmount;function e$1(t){n.__h&&n.__h(r$1);var u=r$1.__H||(r$1.__H={i:[],t:[]});return t>=u.i.length&&u.i.push({}),u.i[t]}function a$1(n){return v$1(E,n)}function v$1(n,u,i){var o=e$1(t$1++);return o.__c||(o.__c=r$1,o.u=[i?i(u):E(void 0,u),function(t){var r=n(o.u[0],t);o.u[0]!==r&&(o.u[0]=r,o.__c.setState({}));}]),o.u}function m$1(n,u){var i=e$1(t$1++);x$1(i.o,u)&&(i.u=n,i.o=u,r$1.__H.t.push(i));}function p$1(n,u){var i=e$1(t$1++);x$1(i.o,u)&&(i.u=n,i.o=u,r$1.__h.push(i));}function l(n){return s$1(function(){return {current:n}},[])}function d$1(n,t,r){p$1(function(){"function"==typeof n?n(t()):n&&(n.current=t());},null==r?r:r.concat(n));}function s$1(n,r){var u=e$1(t$1++);return x$1(u.o,r)?(u.o=r,u.v=n,u.u=n()):u.u}function y$1(n,t){return s$1(function(){return n},t)}function T$1(n){var u=r$1.context[n.__c];if(!u)return n.__p;var i=e$1(t$1++);return null==i.u&&(i.u=!0,u.sub(r$1)),u.props.value}function w$1(t,r){n.useDebugValue&&n.useDebugValue(r?r(t):t);}n.unmount=function(n){c$1&&c$1(n);var t=n.__c;if(t){var r=t.__H;r&&r.i.forEach(function(n){return n.m&&n.m()});}};var A$1=function(){};function F(){u$1.some(function(n){n.__P&&(n.__H.t.forEach(g$1),n.__H.t.forEach(q),n.__H.t=[]);}),u$1=[];}if("undefined"!=typeof window){var _$1=n.requestAnimationFrame;A$1=function(t){1!==t&&_$1===n.requestAnimationFrame||((_$1=n.requestAnimationFrame)||function(n){var t=function(){clearTimeout(r),cancelAnimationFrame(u),setTimeout(n);},r=setTimeout(t,100),u=requestAnimationFrame(t);})(F);};}function g$1(n){n.m&&n.m();}function q(n){var t=n.u();"function"==typeof t&&(n.m=t);}function x$1(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function E(n,t){return "function"==typeof t?t(n):t}

function E$1(n){var t=n.parentNode;t&&t.removeChild(n);}var _$2=n.__e;function k$1(n){this.__u=[],this.__f=n.fallback;}function w$2(n){var t,e,r;function o(o){if(t||(t=n()).then(function(n){e=n.default;},function(n){r=n;}),r)throw r;if(!e)throw t;return h(e,o)}return o.displayName="Lazy",o.t=!0,o}n.__e=function(n,t,e){if(n.then&&e)for(var r,o=t;o=o.__p;)if((r=o.__c)&&r.o)return e&&(t.__e=e.__e,t.__k=e.__k),void r.o(n);_$2(n,t,e);},(k$1.prototype=new y).o=function(n){var t=this;t.__u.push(n);var e=function(){t.__u[t.__u.indexOf(n)]=t.__u[t.__u.length-1],t.__u.pop(),0==t.__u.length&&(t.__f&&A(t.__f),t.__v.__e=null,t.__v.__k=t.state.u,t.setState({u:null}));};null==t.state.u&&(t.__f=t.__f&&L(t.__f),t.setState({u:t.__v.__k}),function n(t){for(var e=0;e<t.length;e++){var r=t[e];null!=r&&("function"!=typeof r.type&&r.__e?E$1(r.__e):r.__k&&n(r.__k));}}(t.__v.__k),t.__v.__k=[]),n.then(e,e);},k$1.prototype.render=function(n,t){return t.u?this.__f:n.children};var A$2="16.8.0",S="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,F$1=/^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/,N$1=n.event;function R(n){return W.bind(null,n)}function U(n,t,e){if(null==t.__k)for(;t.firstChild;)E$1(t.firstChild);return H(n,t),"function"==typeof e&&e(),n?n.__c:null}n.event=function(n){return N$1&&(n=N$1(n)),n.persist=function(){},n.nativeEvent=n};var M$1=function(){};function O(n){var t=this,e=n.container,r=h(M$1,{context:t.context},n.vnode);return t.i&&t.i!==e&&(t.l.parentNode&&t.i.removeChild(t.l),A(t.s),t.v=!1),n.vnode?t.v?(e.__k=t.__k,H(r,e),t.__k=e.__k):(t.l=document.createTextNode(""),I("",e),e.appendChild(t.l),t.v=!0,t.i=e,H(r,e,t.l),t.__k=this.l.__k):t.v&&(t.l.parentNode&&t.i.removeChild(t.l),A(t.s)),t.s=r,t.componentWillUnmount=function(){t.l.parentNode&&t.i.removeChild(t.l),A(t.s);},null}function j$1(n,t){return h(O,{vnode:n,container:t})}M$1.prototype.getChildContext=function(){return this.props.context},M$1.prototype.render=function(n){return n.children};var z$1=function(n,t){return n?b(n).map(t):null},P$1={map:z$1,forEach:z$1,count:function(n){return n?b(n).length:0},only:function(n){if(1!==(n=b(n)).length)throw new Error("Children.only() expects only one child.");return n[0]},toArray:b};function W(){for(var n=[],t=arguments.length;t--;)n[t]=arguments[t];var e=h.apply(void 0,n),r=e.type,o=e.props;return "function"!=typeof r&&(o.defaultValue&&(o.value||0===o.value||(o.value=o.defaultValue),delete o.defaultValue),Array.isArray(o.value)&&o.multiple&&"select"===r&&(b(o.children).forEach(function(n){-1!=o.value.indexOf(n.props.value)&&(n.props.selected=!0);}),delete o.value),function(n,t){var e,r,o;for(o in t)if(e=F$1.test(o))break;if(e)for(o in r=n.props={},t)r[F$1.test(o)?o.replace(/([A-Z0-9])/,"-$1").toLowerCase():o]=t[o];}(e,o)),e.preactCompatNormalized=!1,D$1(e)}function D$1(n){return n.preactCompatNormalized=!0,function(n){var t=n.props;(t.class||t.className)&&(H$1.enumerable="className"in t,t.className&&(t.class=t.className),Object.defineProperty(t,"className",H$1));}(n),n}function L$1(n){return V(n)?D$1(L.apply(null,arguments)):n}function V(n){return !!n&&n.$$typeof===S}function Z(n){return !!n.__k&&(H(null,n),!0)}var H$1={configurable:!0,get:function(){return this.class}};function I$1(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}function T$2(n){return n&&(n.base||1===n.nodeType&&n)||null}var $$1=function(n){function t(t){n.call(this,t),this.isPureReactComponent=!0;}return n&&(t.__proto__=n),(t.prototype=Object.create(n&&n.prototype)).constructor=t,t.prototype.shouldComponentUpdate=function(n,t){return I$1(this.props,n)||I$1(this.state,t)},t}(y);function q$1(n,t){function e(n){var e=this.props.ref,r=e==n.ref;return !r&&e&&(e.call?e(null):e.current=null),(t?!t(this.props,n):I$1(this.props,n))||!r}function r(t){return this.shouldComponentUpdate=e,h(n,function(n,t){for(var e in t)n[e]=t[e];return n}({},t))}return r.prototype.isReactComponent=!0,r.displayName="Memo("+(n.displayName||n.name)+")",r.t=!0,r}function B(n){function t(t){var e=t.ref;return delete t.ref,n(t,e)}return t.prototype.isReactComponent=!0,t.t=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}function G(n,t){n["UNSAFE_"+t]&&!n[t]&&Object.defineProperty(n,t,{configurable:!1,get:function(){return this["UNSAFE_"+t]},set:function(n){this["UNSAFE_"+t]=n;}});}y.prototype.isReactComponent={};var J=n.vnode;n.vnode=function(n){n.$$typeof=S,function(t){var e=n.type,r=n.props;if(r&&"string"==typeof e){var o={};for(var u in r)/^on(Ani|Tra)/.test(u)&&(r[u.toLowerCase()]=r[u],delete r[u]),o[u.toLowerCase()]=u;if(o.ondoubleclick&&(r.ondblclick=r[o.ondoubleclick],delete r[o.ondoubleclick]),o.onbeforeinput&&(r.onbeforeinput=r[o.onbeforeinput],delete r[o.onbeforeinput]),o.onchange&&("textarea"===e||"input"===e.toLowerCase()&&!/^fil|che|ra/i.test(r.type))){var i=o.oninput||"oninput";r[i]||(r[i]=r[o.onchange],delete r[o.onchange]);}}}();var t=n.type;t&&t.t&&n.ref&&(n.props.ref=n.ref,n.ref=null),"function"==typeof t&&!t.p&&t.prototype&&(G(t.prototype,"componentWillMount"),G(t.prototype,"componentWillReceiveProps"),G(t.prototype,"componentWillUpdate"),t.p=!0),J&&J(n);};var K=function(n,t){return n(t)};var compat_module = {useState:a$1,useReducer:v$1,useEffect:m$1,useLayoutEffect:p$1,useRef:l,useImperativeHandle:d$1,useMemo:s$1,useCallback:y$1,useContext:T$1,useDebugValue:w$1,version:"16.8.0",Children:P$1,render:U,hydrate:U,unmountComponentAtNode:Z,createPortal:j$1,createElement:W,createContext:M,createFactory:R,cloneElement:L$1,createRef:p,Fragment:d,isValidElement:V,findDOMNode:T$2,Component:y,PureComponent:$$1,memo:q$1,forwardRef:B,unstable_batchedUpdates:K,Suspense:k$1,lazy:w$2};

var React = ({
    __proto__: null,
    'default': compat_module,
    version: A$2,
    Children: P$1,
    render: U,
    hydrate: U,
    unmountComponentAtNode: Z,
    createPortal: j$1,
    createElement: W,
    createFactory: R,
    cloneElement: L$1,
    isValidElement: V,
    findDOMNode: T$2,
    PureComponent: $$1,
    memo: q$1,
    forwardRef: B,
    unstable_batchedUpdates: K,
    Suspense: k$1,
    lazy: w$2,
    createContext: M,
    createRef: p,
    Fragment: d,
    Component: y,
    useState: a$1,
    useReducer: v$1,
    useEffect: m$1,
    useLayoutEffect: p$1,
    useRef: l,
    useImperativeHandle: d$1,
    useMemo: s$1,
    useCallback: y$1,
    useContext: T$1,
    useDebugValue: w$1
});

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
name: preact-css-styled
license: MIT
author: Daybrush
repository: https://github.com/daybrush/css-styled/tree/master/packages/preact-css-styled
version: 0.1.2
*/

/*
Copyright (c) 2019 Daybrush
name: react-css-styled
license: MIT
author: Daybrush
repository: https://github.com/daybrush/css-styled/tree/master/packages/react-css-styled
version: 0.1.3
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

function styled(Tag, css) {
  var injector = cssStyled(css);
  return (
    /*#__PURE__*/
    function (_super) {
      __extends$1(Styled, _super);

      function Styled() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      Styled.prototype.render = function () {
        var _a = this.props,
            _b = _a.className,
            className = _b === void 0 ? "" : _b,
            attributes = __rest(_a, ["className"]);

        return W(Tag, __assign$1({
          ref: frameworkUtils.ref(this, "element"),
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
    }(y)
  );
}

/*
Copyright (c) 2019 Daybrush
name: preact-moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/preact-moveable
version: 0.15.5
*/

/*
Copyright (c) 2019 Daybrush
name: react-moveable
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/react-moveable
version: 0.16.6
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

var agent = getAgent();
var isWebkit = agent.os.name.indexOf("ios") > -1 || agent.browser.name.indexOf("safari") > -1;
var PREFIX = "moveable-";
var MOVEABLE_CSS = frameworkUtils.prefixCSS(PREFIX, "\n{\n\tposition: fixed;\n\twidth: 0;\n\theight: 0;\n\tleft: 0;\n\ttop: 0;\n\tz-index: 3000;\n}\n.control-box {\n    z-index: 0;\n}\n.line, .control {\n\tleft: 0;\n\ttop: 0;\n}\n.control {\n\tposition: absolute;\n\twidth: 14px;\n\theight: 14px;\n\tborder-radius: 50%;\n\tborder: 2px solid #fff;\n\tbox-sizing: border-box;\n\tbackground: #4af;\n\tmargin-top: -7px;\n    margin-left: -7px;\n    z-index: 10;\n    will-change: transform;\n}\n.line {\n\tposition: absolute;\n\twidth: 1px;\n\theight: 1px;\n\tbackground: #4af;\n\ttransform-origin: 0px 0.5px;\n}\n.line.dashed {\n    box-sizing: border-box;\n    background: transparent;\n}\n.line.dashed.horizontal {\n    border-top: 1px dashed #4af;\n}\n.line.dashed.vertical {\n    border-left: 1px dashed #4af;\n}\n.line.rotation-line {\n\theight: 40px;\n\twidth: 1px;\n\ttransform-origin: 0.5px 39.5px;\n}\n.line.rotation-line .control {\n\tborder-color: #4af;\n\tbackground:#fff;\n\tcursor: alias;\n}\n.line.vertical {\n    transform: translateX(-50%);\n}\n.line.horizontal {\n    transform: translateY(-50%);\n}\n.line.vertical.bold {\n    width: 2px;\n}\n.line.horizontal.bold {\n    height: 2px;\n}\n.control.origin {\n\tborder-color: #f55;\n\tbackground: #fff;\n\twidth: 12px;\n\theight: 12px;\n\tmargin-top: -6px;\n\tmargin-left: -6px;\n\tpointer-events: none;\n}\n" + [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map(function (degree) {
  return "\n.direction[data-rotation=\"" + degree + "\"] {\n\t" + getCursorCSS(degree) + "\n}\n";
}).join("\n") + "\n.group {\n    z-index: -1;\n}\n.area {\n    position: absolute;\n}\n.area-pieces {\n    position: absolute;\n    top: 0;\n    left: 0;\n    display: none;\n}\n.area.avoid {\n    pointer-events: none;\n}\n.area.avoid+.area-pieces {\n    display: block;\n}\n.area-piece {\n    position: absolute;\n}\n" + (isWebkit ? ":global svg *:before {\n\tcontent:\"\";\n\ttransform-origin: inherit;\n}" : "") + "\n");
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

  return frameworkUtils.prefixNames.apply(void 0, [PREFIX].concat(classNames));
}
function createIdentityMatrix3() {
  return createIdentityMatrix(3);
}
function getTransformMatrix(transform) {
  if (!transform || transform === "none") {
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
  var relativeOrigin = getTransformOrigin(getComputedStyle(el, ":before"));
  return relativeOrigin.map(function (o, i) {
    var _a = utils.splitUnit(o),
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
function caculateMatrixStack(target, container, prevMatrix, prevN) {
  var _a;

  var el = target;
  var matrixes = [];
  var isSVGGraphicElement = el.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in el;
  var originalContainer = container || document.body;
  var isEnd = false;
  var is3d = false;
  var n = 3;
  var transformOrigin;
  var targetMatrix;
  var offsetContainer = getOffsetInfo(container, container, true).offsetParent;

  if (prevMatrix) {
    container = target.parentElement;
  }

  while (el && !isEnd) {
    var style = getComputedStyle(el);
    var tagName = el.tagName.toLowerCase();
    var position = style.position;
    var isFixed = position === "fixed";
    var styleTransform = style.transform;
    var matrix = convertCSStoMatrix(getTransformMatrix(styleTransform));

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


    var isSVG = utils.isUndefined(offsetLeft);
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

    var _b = getOffsetInfo(el, container),
        offsetParent = _b.offsetParent,
        isOffsetEnd = _b.isEnd,
        isStatic = _b.isStatic;

    if (isWebkit && !hasNotOffset && !isSVG && isStatic && position === "relative") {
      offsetLeft -= offsetParent.offsetLeft;
      offsetTop -= offsetParent.offsetTop;
      isEnd = isEnd || isOffsetEnd;
    }

    var parentClientLeft = 0;
    var parentClientTop = 0;

    if (!hasNotOffset && offsetContainer !== offsetParent) {
      parentClientLeft = offsetParent.clientLeft;
      parentClientTop = offsetParent.clientTop;
    }

    matrixes.push(getAbsoluteMatrix(matrix, n, origin), createOriginMatrix([hasNotOffset ? el : offsetLeft - el.scrollLeft + parentClientLeft, hasNotOffset ? origin : offsetTop - el.scrollTop + parentClientTop], n));

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

  var mat = prevMatrix ? convertDimension(prevMatrix, prevN, n) : createIdentityMatrix(n);
  var beforeMatrix = prevMatrix ? convertDimension(prevMatrix, prevN, n) : createIdentityMatrix(n);
  var offsetMatrix = createIdentityMatrix(n);
  var length = matrixes.length;
  var endContainer = getOffsetInfo(originalContainer, originalContainer, true).offsetParent;
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
      _a = getSVGOffset(matrix[n - 1], endContainer, n, matrix[2 * n - 1], mat, matrixes[i + 1]), matrix[n - 1] = _a[0], matrix[2 * n - 1] = _a[1];
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

  var containerRect = container.getBoundingClientRect();
  var rect = el.getBoundingClientRect();
  var rectLeft = rect.left - containerRect.left + container.scrollLeft;
  var rectTop = rect.top - containerRect.top + container.scrollTop;
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
function getLineStyle(pos1, pos2, rad) {
  if (rad === void 0) {
    rad = getRad(pos1, pos2);
  }

  var distX = pos2[0] - pos1[0];
  var distY = pos2[1] - pos1[1];
  var width = Math.sqrt(distX * distX + distY * distY);
  return {
    transform: "translate(" + pos1[0] + "px, " + pos1[1] + "px) rotate(" + rad + "rad)",
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
function getRotationRad(poses, direction) {
  return getRad(direction > 0 ? poses[0] : poses[1], direction > 0 ? poses[1] : poses[0]);
}
function getTargetInfo(target, container, parentContainer, state) {
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
  var clientRect = resetClientRect();
  var containerRect = resetClientRect();
  var rotation = 0;
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

      if (utils.isUndefined(width)) {
        _a = getSize(target, style, true), width = _a[0], height = _a[1];
      }
    }

    _b = caculateMatrixStack(target, container, prevMatrix, prevN), beforeMatrix = _b[0], offsetMatrix = _b[1], matrix = _b[2], targetMatrix = _b[3], targetTransform = _b[4], transformOrigin = _b[5], is3d = _b[6];
    _c = caculateMoveablePosition(matrix, transformOrigin, width, height), _d = _c[0], left = _d[0], top = _d[1], right = _d[2], bottom = _d[3], origin = _c[1], pos1 = _c[2], pos2 = _c[3], pos3 = _c[4], pos4 = _c[5], direction = _c[6];
    var n = is3d ? 4 : 3;
    var beforePos = [0, 0];
    _e = caculateMoveablePosition(offsetMatrix, plus(transformOrigin, getOrigin(targetMatrix, n)), width, height), beforePos = _e[0], beforeOrigin = _e[1], beforeDirection = _e[6];
    beforeOrigin = [beforeOrigin[0] + beforePos[0] - left, beforeOrigin[1] + beforePos[1] - top];
    clientRect = getClientRect(target);
    containerRect = getClientRect(getOffsetInfo(parentContainer, parentContainer, true).offsetParent || document.body);
    rotation = getRotationRad([pos1, pos2], direction);
  }

  return {
    rotation: rotation,
    containerRect: containerRect,
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
    transformOrigin: transformOrigin,
    clientRect: clientRect
  };
}
function resetClientRect() {
  return {
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0
  };
}
function getClientRect(el) {
  var _a = el.getBoundingClientRect(),
      left = _a.left,
      width = _a.width,
      top = _a.top,
      bottom = _a.bottom,
      right = _a.right,
      height = _a.height;

  return {
    left: left,
    right: right,
    top: top,
    bottom: bottom,
    width: width,
    height: height
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
function fillParams(moveable, e, params) {
  var datas = e.datas;

  if (!datas.datas) {
    datas.datas = {};
  }

  return __assign$2({}, params, {
    target: moveable.state.target,
    clientX: e.clientX,
    clientY: e.clientY,
    inputEvent: e.inputEvent,
    currentTarget: moveable,
    datas: datas.datas
  });
}
function triggerEvent(moveable, name, params) {
  return moveable.triggerEvent(name, params);
}
function getComputedStyle(el, pseudoElt) {
  return window.getComputedStyle(el, pseudoElt);
}
function filterAbles(ables, methods) {
  var enabledAbles = {};
  var ableGroups = {};
  return ables.filter(function (able) {
    var name = able.name;

    if (enabledAbles[name] || !methods.some(function (method) {
      return able[method];
    })) {
      return false;
    }

    if (able.ableGroup) {
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

    if (!utils.isUndefined(value)) {
      return value;
    }
  }

  return values[length];
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

function triggerAble(moveable, ableType, eventOperation, eventAffix, eventType, e) {
  var isStart = eventType === "Start";

  if (isStart && eventAffix.indexOf("Control") > -1 && moveable.areaElement === e.inputEvent.target) {
    return false;
  }

  var eventName = "" + eventOperation + eventAffix + eventType;
  var conditionName = "" + eventOperation + eventAffix + "Condition";
  var isEnd = eventType === "End";
  var isAfter = eventType.indexOf("After") > -1;

  if (isStart) {
    moveable.updateRect(eventType, true, false);
  }

  var isGroup = eventAffix.indexOf("Group") > -1;
  var ables = moveable[ableType];
  var events = ables.filter(function (able) {
    return able[eventName];
  });
  var results = events.filter(function (able) {
    var condition = isStart && able[conditionName];

    if (!condition || condition(e.inputEvent.target, moveable)) {
      return able[eventName](moveable, e);
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

    triggerRenderStart(moveable, isGroup, e);
  } else if (isEnd) {
    triggerRenderEnd(moveable, isGroup, e);
  } else if (isUpdate) {
    triggerRender(moveable, isGroup, e);
  }

  if (isEnd) {
    moveable.state.dragger = null;
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

  if (!isStart && isUpdate || isEnd && !isUpdate) {
    moveable.forceUpdate();
  }

  if (!isStart && !isEnd && !isAfter && isUpdate) {
    triggerAble(moveable, ableType, eventOperation, eventAffix, eventType + "After", e);
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

function renderLine(direction, pos1, pos2, index) {
  var rad = getRad(pos1, pos2);
  var rotation = direction ? throttle(rad / Math.PI * 180, 15) % 180 : -1;
  return W("div", {
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
  __extends$2(MoveableManager, _super);

  function MoveableManager() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.state = {
      conatainer: null,
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
      pos4: [0, 0],
      clientRect: resetClientRect(),
      containerRect: resetClientRect(),
      rotation: 0
    };
    _this.targetAbles = [];
    _this.controlAbles = [];
    return _this;
  }

  var __proto = MoveableManager.prototype;

  __proto.render = function () {
    var _a = this.props,
        edge = _a.edge,
        parentPosition = _a.parentPosition,
        className = _a.className,
        propsTarget = _a.target;
    this.checkUpdate();

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
        stateTarget = _c.target,
        direction = _c.direction;
    return W(ControlBoxElement, {
      ref: frameworkUtils.ref(this, "controlBox"),
      className: prefix("control-box", direction === -1 ? "reverse" : "") + " " + className,
      style: {
        position: "absolute",
        display: !propsTarget || !stateTarget ? "none" : "block",
        transform: "translate(" + (left - parentLeft) + "px, " + (top - parentTop) + "px) translateZ(50px)"
      }
    }, this.renderAbles(), renderLine(edge ? "n" : "", pos1, pos2, 0), renderLine(edge ? "e" : "", pos2, pos4, 1), renderLine(edge ? "w" : "", pos1, pos3, 2), renderLine(edge ? "s" : "", pos3, pos4, 3));
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
    var container = this.getContainer();
    this.updateState(getTargetInfo(target, container, container, isTarget ? state : undefined), parentMoveable ? false : isSetState);
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
      offsetHeight: offsetHeight
    };
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
    var enabledAbles = ables.filter(function (able) {
      return able && props[able.name];
    });
    var dragStart = "drag" + eventAffix + "Start";
    var pinchStart = "pinch" + eventAffix + "Start";
    var dragControlStart = "drag" + eventAffix + "ControlStart";
    var targetAbles = filterAbles(enabledAbles, [dragStart, pinchStart]);
    var controlAbles = filterAbles(enabledAbles, [dragControlStart]);
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
    var enabledAbles = ables.filter(function (able) {
      return able && props[able.name];
    });
    return filterAbles(enabledAbles, ["render"]).map(function (_a) {
      var render = _a.render;
      return render(_this, React);
    });
  };

  MoveableManager.defaultProps = {
    target: null,
    container: null,
    origin: true,
    edge: false,
    parentMoveable: null,
    parentPosition: null,
    ables: [],
    pinchThreshold: 20,
    dragArea: false,
    transformOrigin: "",
    className: ""
  };
  return MoveableManager;
}($$1);

function getRotatiion(touches) {
  return getRad([touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]) / Math.PI * 180;
}

var Pinchable = {
  name: "pinchable",
  updateRect: true,
  props: {
    pinchable: Boolean,
    pinchThreshold: Number
  },
  pinchStart: function (moveable, e) {
    var datas = e.datas,
        clientX = e.clientX,
        clientY = e.clientY,
        touches = e.touches,
        inputEvent = e.inputEvent,
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
      var ableEvent = {
        datas: datas[able.name + "Datas"],
        clientX: clientX,
        clientY: clientY,
        inputEvent: inputEvent,
        parentRotate: parentRotate,
        pinchFlag: true
      };
      able[controlEventName](moveable, ableEvent);
    });
    moveable.state.snapDirection = [0, 0];
    return isPinch;
  },
  pinch: function (moveable, e) {
    var datas = e.datas,
        clientX = e.clientX,
        clientY = e.clientY,
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
  pinchEnd: function (moveable, e) {
    var datas = e.datas,
        clientX = e.clientX,
        clientY = e.clientY,
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
    return this.pinchStart(moveable, __assign$2({}, e, {
      targets: moveable.props.targets
    }));
  },
  pinchGroup: function (moveable, e) {
    return this.pinch(moveable, __assign$2({}, e, {
      targets: moveable.props.targets
    }));
  },
  pinchGroupEnd: function (moveable, e) {
    return this.pinchEnd(moveable, __assign$2({}, e, {
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
    var childEvent = utils.isFunction(eachEvent) ? eachEvent(child, childDatas) : eachEvent;
    var result = able[type](child, __assign$2({}, childEvent, {
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
  return utils.hasClass(target, prefix("direction"));
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
    var _a = utils.splitUnit(pos),
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

function getDist(startPos, matrix, width, height, n, direction) {
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
  var dist = getDist(startPos, nextMatrix, width, height, n, direction);
  return minus(dist, [groupLeft, groupTop]);
}
function getResizeDist(moveable, width, height, // prevWidth: number,
// prevHeight: number,
direction, fixedPosition, transformOrigin) {
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
  var dist = getDist(fixedPosition, nextMatrix, width, height, n, direction);
  return minus(dist, [groupLeft, groupTop]);
}
function getStartDirection(moveable, direction) {
  var _a = moveable.props.baseDirection,
      baseDirection = _a === void 0 ? [-1, -1] : _a;
  return [direction[0] ? direction[0] : baseDirection[0] * -1, direction[1] ? direction[1] : baseDirection[1] * -1];
}
function getFixedPosition(moveable, direction) {
  return getStartPos(getAbsolutePosesByState(moveable.state), direction);
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

  var _e = state.containerRect,
      containerTop = _e.top,
      containerLeft = _e.left,
      _f = state.clientRect,
      clientTop = _f.top,
      clientLeft = _f.left;
  var poses = getAbsolutePosesByState(state);
  var targetLeft = Math.min.apply(Math, poses.map(function (pos) {
    return pos[0];
  }));
  var targetTop = Math.min.apply(Math, poses.map(function (pos) {
    return pos[1];
  }));
  var distLeft = roundSign(targetLeft - (clientLeft - containerLeft));
  var distTop = roundSign(targetTop - (clientTop - containerTop));
  var guidelines = [];
  elementGuidelines.forEach(function (el) {
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
      pos: [throttle(elementLeft + distLeft, 0.1), elementTop],
      size: height
    });
    guidelines.push({
      type: "vertical",
      element: el,
      pos: [throttle(elementRight + distLeft, 0.1), elementTop],
      size: height
    });
    guidelines.push({
      type: "horizontal",
      element: el,
      pos: [elementLeft, throttle(elementTop + distTop, 0.1)],
      size: width
    });
    guidelines.push({
      type: "horizontal",
      element: el,
      pos: [elementLeft, throttle(elementBottom + distTop, 0.1)],
      size: width
    });

    if (snapCenter) {
      guidelines.push({
        type: "vertical",
        element: el,
        pos: [throttle((elementLeft + elementRight) / 2 + distLeft, 0.1), elementTop],
        size: height,
        center: true
      });
      guidelines.push({
        type: "horizontal",
        element: el,
        pos: [elementLeft, throttle((elementTop + elementBottom) / 2 + distTop, 0.1)],
        size: width,
        center: true
      });
    }
  });
  state.guidelines = guidelines;
  state.enableSnap = true;
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

    if (!utils.isUndefined(startPos) && startPos + snapThreshold > minPos) {
      return {
        isBound: true,
        offset: minPos - startPos,
        pos: startPos
      };
    }

    if (!utils.isUndefined(endPos) && endPos - snapThreshold < maxPos) {
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

function hasGuidelines(moveable, ableName) {
  var _a = moveable.props,
      snappable = _a.snappable,
      bounds = _a.bounds,
      verticalGuidelines = _a.verticalGuidelines,
      horizontalGuidelines = _a.horizontalGuidelines,
      _b = moveable.state,
      guidelines = _b.guidelines,
      enableSnap = _b.enableSnap;

  if (!snappable || !enableSnap || ableName && snappable !== true && snappable.indexOf(ableName)) {
    return false;
  }

  if (bounds || guidelines && guidelines.length || verticalGuidelines && verticalGuidelines.length || horizontalGuidelines && horizontalGuidelines.length) {
    return true;
  }

  return false;
}
function checkSnapPoses(moveable, posesX, posesY, snapCenter, customSnapThreshold) {
  var _a = moveable.state,
      guidelines = _a.guidelines,
      _b = _a.containerRect,
      containerHeight = _b.height,
      containerWidth = _b.width;
  var props = moveable.props;
  var snapThreshold = selectValue(customSnapThreshold, props.snapThreshold, 5);
  var _c = props.snapElement,
      snapElement = _c === void 0 ? true : _c,
      _d = props.snapHorizontal,
      snapHorizontal = _d === void 0 ? true : _d,
      _e = props.snapVertical,
      snapVertical = _e === void 0 ? true : _e,
      verticalGuidelines = props.verticalGuidelines,
      horizontalGuidelines = props.horizontalGuidelines;
  var totalGuidelines = guidelines.slice();

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

  return {
    vertical: checkSnap(totalGuidelines, "vertical", posesX, snapThreshold, snapCenter, snapElement),
    horizontal: checkSnap(totalGuidelines, "horizontal", posesY, snapThreshold, snapCenter, snapElement)
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

function checkBoundOneWayDist(moveable, pos) {
  var _a = checkBounds(moveable, [pos[0]], [pos[1]]),
      _b = _a.horizontal,
      isHorizontalBound = _b.isBound,
      horizontalBoundOffset = _b.offset,
      _c = _a.vertical,
      isVerticalBound = _c.isBound,
      verticalBoundOffset = _c.offset;

  if (isHorizontalBound || isVerticalBound) {
    var isVertical = void 0;

    if (isHorizontalBound && isVerticalBound) {
      isVertical = Math.abs(horizontalBoundOffset) < Math.abs(verticalBoundOffset);
    } else {
      isVertical = isVerticalBound;
    }

    var offset = isVertical ? verticalBoundOffset : horizontalBoundOffset;
    return {
      isVertical: isVertical,
      offset: offset,
      dist: Math.abs(offset)
    };
  }

  return;
}

function solveNextDist(pos1, pos2, offset, isVertical, isDirectionVertical, datas) {
  var sizeOffset = solveEquation(pos1, pos2, -offset, isVertical);

  if (!sizeOffset) {
    return NaN;
  }

  var _a = getDragDist({
    datas: datas,
    distX: sizeOffset[0],
    distY: sizeOffset[1]
  }),
      widthDist = _a[0],
      heightDist = _a[1];

  return isDirectionVertical ? heightDist : widthDist;
}

function getFixedPoses(matrix, width, height, fixedPos, direction, is3d) {
  var nextPoses = caculatePoses(matrix, width, height, is3d ? 4 : 3);
  var nextPos = getPosByReverseDirection(nextPoses, direction);
  return getAbsolutePoses(nextPoses, minus(fixedPos, nextPos));
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

function checkSnapOneWayPos(moveable, pos, reversePos, isDirectionVertical, datas) {
  var _a = checkSnapPoses(moveable, [pos[0]], [pos[1]]),
      horizontalSnapInfo = _a.horizontal,
      verticalSnapInfo = _a.vertical;

  var fixedHorizontal = Math.abs(reversePos[1] - pos[1]) < TINY_NUM;
  var fixedVertical = Math.abs(reversePos[0] - pos[0]) < TINY_NUM;
  var isVertical;

  var _b = getNearestSnapGuidelineInfo(horizontalSnapInfo),
      isHorizontalSnap = _b.isSnap,
      horizontalDist = _b.dist,
      horizontalOffset = _b.offset;

  var _c = getNearestSnapGuidelineInfo(verticalSnapInfo),
      isVerticalSnap = _c.isSnap,
      verticalDist = _c.dist,
      verticalOffset = _c.offset;

  if (!isHorizontalSnap && !isVerticalSnap) {
    // no snap
    return NaN;
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

  return solveNextDist(reversePos, pos, isVertical ? verticalOffset : horizontalOffset, isVertical, isDirectionVertical, datas);
}

function checkOneWayPos(moveable, poses, reversePoses, isDirectionVertical, datas) {
  var posOffset = 0;
  var boundInfo;
  var boundIndex = -1;
  var boundInfos = poses.map(function (pos) {
    return checkBoundOneWayDist(moveable, pos);
  });
  boundInfos.forEach(function (info, i) {
    if (!info) {
      return;
    }

    if (!boundInfo || boundInfo.dist < info.dist) {
      boundInfo = info;
      boundIndex = i;
    }
  });

  if (boundInfo) {
    var nextDist = solveNextDist(reversePoses[boundIndex], poses[boundIndex], boundInfo.offset, boundInfo.isVertical, isDirectionVertical, datas);

    if (!isNaN(nextDist)) {
      posOffset = nextDist;
    }
  } else {
    poses.some(function (pos, i) {
      var nextDist = checkSnapOneWayPos(moveable, pos, reversePoses[i], isDirectionVertical, datas);

      if (isNaN(nextDist)) {
        return false;
      }

      posOffset = nextDist;
      return true;
    });
  }

  return posOffset;
}
function checkOneWayDist(moveable, poses, direction, datas) {
  var directionIndex = direction[0] !== 0 ? 0 : 1;
  var isDirectionVertical = directionIndex > 0;
  var reversePoses = poses.slice().reverse();
  var directionPoses;
  var reverseDirectionPoses;

  if (moveable.props.keepRatio) {
    directionPoses = [getPosByDirection(poses, direction)];
    reverseDirectionPoses = [getPosByDirection(reversePoses, direction)];
  } else {
    directionPoses = getPosesByDirection(poses, direction);
    reverseDirectionPoses = getPosesByDirection(reversePoses, direction);
    directionPoses.push([(directionPoses[0][0] + directionPoses[1][0]) / 2, (directionPoses[0][1] + directionPoses[1][1]) / 2]);
    reverseDirectionPoses.reverse();
    reverseDirectionPoses.push([(reverseDirectionPoses[0][0] + reverseDirectionPoses[1][0]) / 2, (reverseDirectionPoses[0][1] + reverseDirectionPoses[1][1]) / 2]);
  }

  var posOffset = checkOneWayPos(moveable, directionPoses, reverseDirectionPoses, isDirectionVertical, datas);
  var offset = [0, 0];
  offset[directionIndex] = direction[directionIndex] * posOffset;
  return offset;
}
function checkTwoWayDist(moveable, poses, direction, datas, matrix, width, height, fixedPos, is3d) {
  var _a;

  var directionPoses = getPosesByDirection(poses, direction);
  var verticalDirection = [direction[0], direction[1] * -1];
  var horizontalDirection = [direction[0] * -1, direction[1]];
  var verticalPos = getPosByDirection(poses, verticalDirection);
  var horizontalPos = getPosByDirection(poses, horizontalDirection);

  var _b = checkBounds(moveable, [directionPoses[0][0]], [directionPoses[0][1]]),
      _c = _b.horizontal,
      isHorizontalBound = _c.isBound,
      horizontalBoundOffset = _c.offset,
      _d = _b.vertical,
      isVerticalBound = _d.isBound,
      verticalBoundOffset = _d.offset; // share drag event


  var widthDist = 0;
  var heightDist = 0;
  var verticalBoundInfo = checkBoundOneWayDist(moveable, verticalPos);
  var horizontalBoundInfo = checkBoundOneWayDist(moveable, horizontalPos);
  var isVeritcalDirectionBound = verticalBoundInfo && verticalBoundInfo.dist > Math.abs(verticalBoundOffset);
  var isHorizontalDirectionBound = horizontalBoundInfo && horizontalBoundInfo.dist > Math.abs(horizontalBoundOffset);

  if (!isVeritcalDirectionBound && !isHorizontalDirectionBound) {
    var _e = checkSnapPoses(moveable, [directionPoses[0][0]], [directionPoses[0][1]]),
        horizontalSnapInfo = _e.horizontal,
        verticalSnapInfo = _e.vertical;

    var horizontalOffset = getNearestSnapGuidelineInfo(horizontalSnapInfo).offset;
    var verticalOffset = getNearestSnapGuidelineInfo(verticalSnapInfo).offset;
    _a = getDragDist({
      datas: datas,
      distX: -(isVerticalBound ? verticalBoundOffset : verticalOffset),
      distY: -(isHorizontalBound ? horizontalBoundOffset : horizontalOffset)
    }), widthDist = _a[0], heightDist = _a[1];
  } else if (isVeritcalDirectionBound) {
    // left to right, right to left
    var reversePos = getPosByDirection(poses, [verticalDirection[0] * -1, verticalDirection[1]]);
    var nextDist = solveNextDist(reversePos, verticalPos, verticalBoundInfo.offset, verticalBoundInfo.isVertical, false, datas);

    if (!isNaN(nextDist)) {
      widthDist = nextDist;
    }

    var nextPoses = getFixedPoses(matrix, width + direction[0] * widthDist, height + direction[1] * heightDist, fixedPos, direction, is3d);
    heightDist = checkOneWayPos(moveable, [getPosByDirection(nextPoses, direction)], [getPosByDirection(nextPoses, verticalDirection)], true, datas);
  } else {
    // top to bottom, bottom to top
    var reversePos = getPosByDirection(poses, [horizontalDirection[0] * -1, horizontalDirection[1]]);
    var nextDist = solveNextDist(reversePos, verticalPos, horizontalBoundInfo.offset, horizontalBoundInfo.isVertical, true, datas);

    if (!isNaN(nextDist)) {
      heightDist = nextDist;
    }

    var nextPoses = getFixedPoses(matrix, width + direction[0] * widthDist, height + direction[1] * heightDist, fixedPos, direction, is3d);
    widthDist = checkOneWayPos(moveable, [getPosByDirection(nextPoses, direction)], [getPosByDirection(nextPoses, horizontalDirection)], false, datas);
  }

  return [direction[0] * widthDist, direction[1] * heightDist];
}
function checkSizeDist(moveable, matrix, width, height, direction, snapDirection, datas, is3d) {
  var poses = getAbsolutePosesByState(moveable.state);
  var fixedPos = getPosByReverseDirection(poses, snapDirection);
  var nextPoses = getFixedPoses(matrix, width, height, fixedPos, direction, is3d);

  if (direction[0] && direction[1]) {
    return checkTwoWayDist(moveable, nextPoses, direction, datas, matrix, width, height, fixedPos, is3d);
  } else {
    return checkOneWayDist(moveable, nextPoses, direction, datas);
  }
}
function checkSnapSize(moveable, width, height, direction, datas) {
  if (!hasGuidelines(moveable, "resizable")) {
    return [0, 0];
  }

  var _a = moveable.state,
      matrix = _a.matrix,
      is3d = _a.is3d;
  return checkSizeDist(moveable, matrix, width, height, direction, direction, datas, is3d);
}
function checkSnapScale(moveable, scale, direction, snapDirection, datas) {
  var width = datas.width,
      height = datas.height;

  if (!hasGuidelines(moveable, "scalable")) {
    return [0, 0];
  }

  var sizeDist = checkSizeDist(moveable, scaleMatrix(datas, scale), width, height, direction, snapDirection, datas, datas.is3d);
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
    var nextPoses = void 0;

    if (moveable.props.keepRatio) {
      nextPoses = [getPosByDirection(poses, snapDirection)];
    } else {
      nextPoses = getPosesByDirection(poses, snapDirection);

      if (nextPoses.length > 1) {
        nextPoses.push([(nextPoses[0][0] + nextPoses[1][0]) / 2, (nextPoses[0][1] + nextPoses[1][1]) / 2]);
      }
    }

    return checkSnapPoses(moveable, nextPoses.map(function (pos) {
      return pos[0];
    }), nextPoses.map(function (pos) {
      return pos[1];
    }), true, 1);
  }
}
function startCheckSnapDrag(moveable, datas) {
  datas.absolutePoses = getAbsolutePosesByState(moveable.state);
}
function checkSnapDrag(moveable, distX, distY, datas) {
  var snapVerticalInfo = {
    isSnap: false,
    offset: 0
  };
  var snapHorizontalInfo = {
    isSnap: false,
    offset: 0
  };

  if (!hasGuidelines(moveable, "draggable")) {
    return [snapVerticalInfo, snapHorizontalInfo];
  }

  var poses = getAbsolutePoses(datas.absolutePoses, [distX, distY]);

  var _a = getRect(poses),
      left = _a.left,
      right = _a.right,
      top = _a.top,
      bottom = _a.bottom;

  var snapInfos = checkSnaps(moveable, {
    left: left,
    right: right,
    top: top,
    bottom: bottom,
    center: (left + right) / 2,
    middle: (top + bottom) / 2
  }, true);
  var boundInfos = checkBounds(moveable, [left, right], [top, bottom]);

  if (boundInfos.vertical.isBound) {
    snapVerticalInfo.offset = boundInfos.vertical.offset;
    snapVerticalInfo.isSnap = true;
  } else if (snapInfos.vertical.isSnap) {
    // has vertical guidelines
    snapVerticalInfo.offset = snapInfos.vertical.posInfos[0].guidelineInfos[0].offset;
    snapVerticalInfo.isSnap = true;
  }

  if (boundInfos.horizontal.isBound) {
    snapHorizontalInfo.offset = boundInfos.horizontal.offset;
    snapHorizontalInfo.isSnap = true;
  } else if (snapInfos.horizontal.isSnap) {
    // has horizontal guidelines
    snapHorizontalInfo.offset = snapInfos.horizontal.posInfos[0].guidelineInfos[0].offset;
    snapHorizontalInfo.isSnap = true;
  }

  return [snapVerticalInfo, snapHorizontalInfo];
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

var Snappable = {
  name: "snappable",
  props: {
    snappable: [Boolean, Array],
    snapCenter: Boolean,
    snapHorizontal: Boolean,
    snapVertical: Boolean,
    snapElement: Boolean,
    snapThreshold: Number,
    horizontalGuidelines: Array,
    verticalGuidelines: Array,
    elementGuidelines: Array,
    bounds: Object
  },
  render: function (moveable, React) {
    var _a = moveable.state,
        targetTop = _a.top,
        targetLeft = _a.left,
        pos1 = _a.pos1,
        pos2 = _a.pos2,
        pos3 = _a.pos3,
        pos4 = _a.pos4,
        snapDirection = _a.snapDirection,
        clientRect = _a.clientRect,
        containerRect = _a.containerRect;
    var clientLeft = clientRect.left - containerRect.left;
    var clientTop = clientRect.top - containerRect.top;
    var minLeft = Math.min(pos1[0], pos2[0], pos3[0], pos4[0]);
    var minTop = Math.min(pos1[1], pos2[1], pos3[1], pos4[1]);

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
        verticalPosInfos = _c.vertical.posInfos,
        horizontalPosInfos = _c.horizontal.posInfos;

    var _d = checkBounds(moveable, [left, right], [top, bottom], 1),
        _e = _d.vertical,
        isVerticalBound = _e.isBound,
        verticalBoundPos = _e.pos,
        _f = _d.horizontal,
        isHorizontalBound = _f.isBound,
        horizontalBoundPos = _f.pos;

    var verticalSnapPoses = verticalPosInfos.map(function (posInfo) {
      return posInfo.pos;
    });
    var horizontalSnapPoses = horizontalPosInfos.map(function (posInfo) {
      return posInfo.pos;
    });
    var verticalGuildelines = getSnapGuidelines(verticalPosInfos);
    var horizontalGuidelines = getSnapGuidelines(horizontalPosInfos);

    if (isVerticalBound && verticalSnapPoses.indexOf(verticalBoundPos) < 0) {
      verticalSnapPoses.push(verticalBoundPos);
    }

    if (isHorizontalBound && horizontalSnapPoses.indexOf(horizontalBoundPos) < 0) {
      horizontalSnapPoses.push(horizontalBoundPos);
    }

    var elementVerticalGuidelines = verticalGuildelines.filter(function (_a) {
      var element = _a.element;
      return element;
    });
    var elementHorizontalGuidelines = horizontalGuidelines.filter(function (_a) {
      var element = _a.element;
      return element;
    });
    return elementHorizontalGuidelines.map(function (_a, i) {
      var pos = _a.pos,
          size = _a.size;
      var lineLeft = Math.min(0, pos[0] - clientLeft);
      var lineRight = Math.max(width, pos[0] - clientLeft + size);
      return React.createElement("div", {
        className: prefix("line", "horizontal", "guideline", "dashed"),
        key: "horizontalLinkGuidline" + i,
        style: {
          left: minLeft + lineLeft + "px",
          top: -targetTop + pos[1] + "px",
          width: lineRight - lineLeft + "px"
        }
      });
    }).concat(elementVerticalGuidelines.map(function (_a, i) {
      var pos = _a.pos,
          size = _a.size;
      var lineTop = Math.min(0, pos[1] - clientTop);
      var lineBottom = Math.max(height, pos[1] - clientTop + size);
      return React.createElement("div", {
        className: prefix("line", "vertical", "guideline", "dashed"),
        key: "verticalDashedGuidline" + i,
        style: {
          top: minTop + lineTop + "px",
          left: -targetLeft + pos[0] + "px",
          height: lineBottom - lineTop + "px"
        }
      });
    }), verticalSnapPoses.map(function (pos, i) {
      return React.createElement("div", {
        className: prefix("line", "vertical", "guideline", "target", "bold"),
        key: "verticalTargetGuidline" + i,
        style: {
          top: minTop + "px",
          left: -targetLeft + pos + "px",
          height: height + "px"
        }
      });
    }), horizontalSnapPoses.map(function (pos, i) {
      return React.createElement("div", {
        className: prefix("line", "horizontal", "guideline", "target", "bold"),
        key: "horizontalTargetGuidline" + i,
        style: {
          top: -targetTop + pos + "px",
          left: minLeft + "px",
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
          top: minTop - clientTop + pos[1] + "px",
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
          left: minLeft - clientLeft + pos[0] + "px",
          width: size + "px"
        }
      });
    }));
  },
  dragStart: function (moveable, e) {
    moveable.state.snapDirection = true;
    snapStart(moveable);
  },
  pinchStart: function (moveable) {
    this.unset(moveable);
  },
  dragEnd: function (moveable) {
    this.unset(moveable);
  },
  dragControlCondition: directionCondition,
  dragControlStart: function (moveable, e) {
    moveable.state.snapDirection = null;
    snapStart(moveable);
  },
  dragControlEnd: function (moveable) {
    this.unset(moveable);
  },
  dragGroupStart: function (moveable, e) {
    moveable.state.snapDirection = true;
    snapStart(moveable);
  },
  dragGroupEnd: function (moveable) {
    this.unset(moveable);
  },
  dragGroupControlStart: function (moveable, e) {
    moveable.state.snapDirection = null;
    snapStart(moveable);
  },
  dragGroupControlEnd: function (moveable) {
    this.unset(moveable);
  },
  unset: function (moveable) {
    var state = moveable.state;
    state.enableSnap = false;
    state.guidelines = [];
    state.snapDirection = null;
  }
};

var Draggable = {
  name: "draggable",
  props: {
    draggable: Boolean,
    throttleDrag: Number
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
    } else {
      state.dragger = null;
      datas.isPinch = false;
    }

    return datas.isDrag ? params : false;
  },
  drag: function (moveable, e) {
    var datas = e.datas,
        parentEvent = e.parentEvent,
        parentFlag = e.parentFlag;
    var distX = e.distX,
        distY = e.distY;
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
    var isSnap = false;

    if (!isPinch && !parentEvent && !parentFlag) {
      var _a = checkSnapDrag(moveable, distX, distY, datas),
          verticalInfo = _a[0],
          horizontalInfo = _a[1];

      isSnap = verticalInfo.isSnap || horizontalInfo.isSnap;
      distX -= verticalInfo.offset;
      distY -= horizontalInfo.offset;
    }

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

    if (!isSnap) {
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
    var datas = e.datas;
    var params = this.dragStart(moveable, e);

    if (!params) {
      return false;
    }

    var events = triggerChildAble(moveable, this, "dragStart", datas, e);

    var nextParams = __assign$2({}, params, {
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
        passDistX = _a.passDistX,
        passDistY = _a.passDistY;
    var events = triggerChildAble(moveable, this, "drag", datas, __assign$2({}, e, {
      distX: passDistX,
      distY: passDistY
    }));

    if (!params) {
      return;
    }

    var nextParams = __assign$2({
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
    triggerChildAble(moveable, this, "dragEnd", datas, e);
    triggerEvent(moveable, "onDragGroupEnd", fillParams(moveable, e, {
      targets: moveable.props.targets,
      isDrag: isDrag
    }));
    return isDrag;
  }
};

function setCustomDrag(state, delta, inputEvent) {
  return __assign$2({}, state.dragger.move(delta, inputEvent), {
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

function getPositions(rotationPosition, pos1, pos2, pos3, pos4) {
  if (rotationPosition === "left") {
    return [pos3, pos1];
  } else if (rotationPosition === "right") {
    return [pos2, pos4];
  } else if (rotationPosition === "bottom") {
    return [pos4, pos3];
  }

  return [pos1, pos2];
}
function getRotationPosition(_a, rad) {
  var pos1 = _a[0],
      pos2 = _a[1];
  var relativeRotationPos = rotate([0, -40, 1], rad);
  var rotationPos = [(pos1[0] + pos2[0]) / 2 + relativeRotationPos[0], (pos1[1] + pos2[1]) / 2 + relativeRotationPos[1]];
  return rotationPos;
}

function dragControlCondition(target) {
  return utils.hasClass(target, prefix("rotation"));
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
        pos1 = _b.pos1,
        pos2 = _b.pos2,
        pos3 = _b.pos3,
        pos4 = _b.pos4,
        direction = _b.direction;
    var poses = getPositions(rotationPosition, pos1, pos2, pos3, pos4);
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
  dragControlStart: function (moveable, e) {
    var datas = e.datas,
        clientX = e.clientX,
        clientY = e.clientY,
        parentRotate = e.parentRotate,
        parentFlag = e.parentFlag,
        pinchFlag = e.pinchFlag;
    var _a = moveable.state,
        target = _a.target,
        left = _a.left,
        top = _a.top,
        origin = _a.origin,
        beforeOrigin = _a.beforeOrigin,
        direction = _a.direction,
        beforeDirection = _a.beforeDirection,
        targetTransform = _a.targetTransform,
        pos1 = _a.pos1,
        pos2 = _a.pos2,
        pos3 = _a.pos3,
        pos4 = _a.pos4;

    if (!target) {
      return false;
    }

    datas.transform = targetTransform;
    datas.left = left;
    datas.top = top;
    var poses = getPositions(moveable.props.rotationPosition, pos1, pos2, pos3, pos4);
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
    var params = fillParams(moveable, e, {
      set: function (rotatation) {
        datas.startRotate = rotatation;
      }
    });
    var result = triggerEvent(moveable, "onRotateStart", params);
    datas.isRotate = result !== false;
    return datas.isRotate ? params : false;
  },
  dragControl: function (moveable, e) {
    var _a, _b, _c, _d;

    var datas = e.datas,
        clientX = e.clientX,
        clientY = e.clientY,
        parentRotate = e.parentRotate,
        parentFlag = e.parentFlag,
        pinchFlag = e.pinchFlag;
    var direction = datas.direction,
        beforeDirection = datas.beforeDirection,
        beforeInfo = datas.beforeInfo,
        afterInfo = datas.afterInfo,
        isRotate = datas.isRotate,
        startRotate = datas.startRotate;

    if (!isRotate) {
      return;
    }

    var _e = moveable.props,
        _f = _e.throttleRotate,
        throttleRotate = _f === void 0 ? 0 : _f,
        parentMoveable = _e.parentMoveable;
    var delta;
    var dist;
    var rotate;
    var beforeDelta;
    var beforeDist;
    var beforeRotate;

    if (pinchFlag || parentFlag) {
      _a = getDeg(afterInfo, parentRotate, direction, startRotate, throttleRotate), delta = _a[0], dist = _a[1], rotate = _a[2];
      _b = getDeg(beforeInfo, parentRotate, direction, startRotate, throttleRotate), beforeDelta = _b[0], beforeDist = _b[1], beforeRotate = _b[2];
    } else {
      _c = getRotateInfo(afterInfo, direction, clientX, clientY, startRotate, throttleRotate), delta = _c[0], dist = _c[1], rotate = _c[2];
      _d = getRotateInfo(beforeInfo, beforeDirection, clientX, clientY, startRotate, throttleRotate), beforeDelta = _d[0], beforeDist = _d[1], beforeRotate = _d[2];
    } // let snapDist = [0, 0];
    // if (!pinchFlag) {
    //     snapDist = checkSnapRotate(moveable, nowDist, direction, snapDirection, datas);
    // }


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
      isPinch: !!pinchFlag
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
    var events = triggerChildAble(moveable, this, "dragControlStart", datas, __assign$2({}, e, {
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

    var nextParams = __assign$2({}, params, {
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
    var events = triggerChildAble(moveable, this, "dragControl", datas, __assign$2({}, e, {
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
    moveable.rotation = params.beforeRotate;

    var nextParams = __assign$2({
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
  }
};

function renderControls(moveable, defaultDirections, React) {
  var _a = moveable.state,
      pos1 = _a.pos1,
      pos2 = _a.pos2,
      pos3 = _a.pos3,
      pos4 = _a.pos4,
      rotation = _a.rotation;
  var _b = moveable.props.renderDirections,
      directions = _b === void 0 ? defaultDirections : _b;
  var poses = [pos1, pos2, pos3, pos4];
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
      key: direction,
      style: getControlTransform.apply(void 0, [rotation].concat(indexes.map(function (index) {
        return poses[index];
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
        pinchFlag = e.pinchFlag,
        datas = e.datas;
    var inputTarget = inputEvent.target;
    var direction = pinchFlag ? [1, 1] : getDirection(inputTarget);
    var _b = moveable.state,
        target = _b.target,
        width = _b.width,
        height = _b.height;

    if (!direction || !target) {
      return false;
    }

    !pinchFlag && setDragStart(moveable, {
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
    datas.fixedPosition = getFixedPosition(moveable, datas.startDirection);
    datas.fixedOriginalPosition = getFixedPosition(moveable, direction);
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
      moveable.state.snapDirection = direction;
    }

    return datas.isResize ? params : false;
  },
  dragControl: function (moveable, e) {
    var datas = e.datas,
        distX = e.distX,
        distY = e.distY,
        parentFlag = e.parentFlag,
        pinchFlag = e.pinchFlag,
        parentDistance = e.parentDistance,
        parentScale = e.parentScale,
        inputEvent = e.inputEvent,
        parentKeepRatio = e.parentKeepRatio,
        dragClient = e.dragClient;
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
    var keepRatio = moveable.props.keepRatio || parentKeepRatio;
    var isWidth = direction[0] || !direction[1];
    var ratio = isWidth ? startOffsetHeight / startOffsetWidth : startOffsetWidth / startOffsetHeight;
    var distWidth = 0;
    var distHeight = 0;

    if (parentScale) {
      distWidth = (parentScale[0] - 1) * startOffsetWidth;
      distHeight = (parentScale[1] - 1) * startOffsetHeight;
    } else if (pinchFlag) {
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
      distWidth = direction[0] * dist[0];
      distHeight = direction[1] * dist[1];

      if (keepRatio && startOffsetWidth && startOffsetHeight) {
        var rad = getRad([0, 0], dist);
        var standardRad = getRad([0, 0], direction);
        var ratioRad = getRad([0, 0], [startOffsetWidth, startOffsetHeight]);
        var size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
        var signSize = Math.cos(rad - standardRad) * size;

        if (!direction[0]) {
          // top, bottom
          distHeight = signSize;
          distWidth = getKeepRatioWidth(distHeight, isWidth, ratio);
        } else if (!direction[1]) {
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

    var nextWidth = direction[0] || keepRatio ? Math.max(startOffsetWidth + distWidth, 0) : startOffsetWidth;
    var nextHeight = direction[1] || keepRatio ? Math.max(startOffsetHeight + distHeight, 0) : startOffsetHeight;
    var snapDist = [0, 0];

    if (!pinchFlag) {
      snapDist = checkSnapSize(moveable, nextWidth, nextHeight, direction, datas);
    }

    if (keepRatio) {
      if (direction[0] && direction[1] && snapDist[0] && snapDist[1]) {
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

      if (direction[0] && !direction[1] || snapDist[0] && !snapDist[1] || isNoSnap && isWidth) {
        nextWidth += snapDist[0];
        nextHeight = getKeepRatioHeight(nextWidth, isWidth, ratio);
      } else if (!direction[0] && direction[1] || !snapDist[0] && snapDist[1] || isNoSnap && !isWidth) {
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

    var startDirection = keepRatio || parentFlag ? direction : datas.startDirection;
    var fixedPosition = dragClient || (keepRatio ? datas.fixedOriginalPosition : datas.fixedPosition);
    var inverseDelta = !parentFlag && pinchFlag ? [0, 0] : getResizeDist(moveable, nextWidth, nextHeight, startDirection, fixedPosition, transformOrigin);
    var params = fillParams(moveable, e, {
      width: startWidth + distWidth,
      height: startHeight + distHeight,
      offsetWidth: nextWidth,
      offsetHeight: nextHeight,
      direction: direction,
      dist: [distWidth, distHeight],
      delta: delta,
      isPinch: !!pinchFlag,
      drag: Draggable.drag(moveable, setCustomDrag(moveable.state, inverseDelta, inputEvent))
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

    var nextParams = __assign$2({}, params, {
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
    var fixedPosition = datas.fixedOriginalPosition;
    var events = triggerChildAble(moveable, this, "dragControl", datas, function (_, childDatas) {
      var _a = caculate(createRotateMatrix(moveable.rotation / 180 * Math.PI, 3), [childDatas.originalX * parentScale[0], childDatas.originalY * parentScale[1], 1], 3),
          clientX = _a[0],
          clientY = _a[1];

      return __assign$2({}, e, {
        parentScale: parentScale,
        dragClient: plus(fixedPosition, [clientX, clientY]),
        parentKeepRatio: keepRatio
      });
    });

    var nextParams = __assign$2({
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
  }
};

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
      moveable.state.snapDirection = direction;
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
        throttleScale = _a.throttleScale,
        parentMoveable = _a.parentMoveable;
    var keepRatio = moveable.props.keepRatio || parentKeepRatio;
    var state = moveable.state;
    var isWidth = direction[0] || !direction[1];
    var scaleX = 1;
    var scaleY = 1;
    var startWidth = width * startScale[0];
    var startHeight = height * startScale[1];
    var ratio = isWidth ? startHeight / startWidth : startWidth / startHeight;

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
      var distHeight = direction[1] * dist[1];

      if (keepRatio && width && height) {
        var rad = getRad([0, 0], dist);
        var standardRad = getRad([0, 0], direction);
        var ratioRad = getRad([0, 0], [startWidth, startHeight]);
        var size = Math.sqrt(distWidth * distWidth + distHeight * distHeight);
        var signSize = Math.cos(rad - standardRad) * size;

        if (!direction[0]) {
          // top, bottom
          distHeight = signSize;
          distWidth = getKeepRatioWidth(distHeight, isWidth, ratio);
        } else if (!direction[1]) {
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

    scaleX = direction[0] ? scaleX * startScale[0] : startScale[0];
    scaleY = direction[1] ? scaleY * startScale[1] : startScale[1];

    if (scaleX === 0) {
      scaleX = (prevDist[0] > 0 ? 1 : -1) * MIN_SCALE;
    }

    if (scaleY === 0) {
      scaleY = (prevDist[1] > 0 ? 1 : -1) * MIN_SCALE;
    }

    var nowDist = [scaleX / startScale[0], scaleY / startScale[1]];
    var scale = [scaleX, scaleY];
    var snapDirection = direction;

    if (moveable.props.groupable) {
      snapDirection = [(nowDist[0] >= 0 ? 1 : -1) * direction[0], (nowDist[1] >= 0 ? 1 : -1) * direction[1]];
      var stateDirection = state.snapDirection;

      if (utils.isArray(stateDirection) && (stateDirection[0] || stateDirection[1])) {
        state.snapDirection = snapDirection;
      }
    }

    var snapDist = [0, 0];

    if (!pinchFlag) {
      snapDist = checkSnapScale(moveable, nowDist, direction, snapDirection, datas);
    }

    if (keepRatio) {
      if (direction[0] && direction[1] && snapDist[0] && snapDist[1]) {
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

      if (direction[0] && !direction[1] || snapDist[0] && !snapDist[1] || isNoSnap && isWidth) {
        nowDist[0] += snapDist[0];
        var snapHeight = getKeepRatioHeight(width * nowDist[0] * startScale[0], isWidth, ratio);
        nowDist[1] = snapHeight / height / startScale[1];
      } else if (!direction[0] && direction[1] || !snapDist[0] && snapDist[1] || isNoSnap && !isWidth) {
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

    var inverseDelta = !parentFlag && pinchFlag ? [0, 0] : getScaleDist(moveable, delta, direction, dragClient);
    var params = fillParams(moveable, e, {
      scale: scale,
      direction: direction,
      dist: nowDist,
      delta: delta,
      transform: transform + " scale(" + scaleX + ", " + scaleY + ")",
      isPinch: !!pinchFlag,
      drag: Draggable.drag(moveable, setCustomDrag(moveable.state, inverseDelta, inputEvent))
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

    var nextParams = __assign$2({}, params, {
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
    var scale = params.scale,
        direction = params.direction,
        dist = params.dist;
    var prevPos = getPosByReverseDirection(getAbsolutePosesByState(moveable.state), multiply2(direction, dist));
    var events = triggerChildAble(moveable, this, "dragControl", datas, function (_, childDatas) {
      var _a = caculate(createRotateMatrix(moveable.rotation / 180 * Math.PI, 3), [childDatas.originalX * scale[0], childDatas.originalY * scale[1], 1], 3),
          clientX = _a[0],
          clientY = _a[1];

      return __assign$2({}, e, {
        parentScale: scale,
        parentKeepRatio: keepRatio,
        dragClient: plus(prevPos, [clientX, clientY])
      });
    });

    var nextParams = __assign$2({
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
  }
};

function getMiddleLinePos(pos1, pos2) {
  return pos1.map(function (pos, i) {
    return utils.dot(pos, pos2[i], 1, 2);
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
  dragControlCondition: function (target) {
    return utils.hasClass(target, prefix("direction"));
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
    datas.poses = [[0, 0], [width, 0], [0, height], [width, height]].map(function (p, i) {
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
    state.snapDirection = direction;
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
    var datas = e.datas;
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

      var _a = checkSnapPoses(moveable, selectedPoses.map(function (pos) {
        return pos[0] + distX;
      }), selectedPoses.map(function (pos) {
        return pos[1] + distY;
      })),
          horizontalSnapInfo = _a.horizontal,
          verticalSnapInfo = _a.vertical;

      distY -= getNearestSnapGuidelineInfo(horizontalSnapInfo).offset;
      distX -= getNearestSnapGuidelineInfo(verticalSnapInfo).offset;
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
  utils.removeClass(el, AVOID);
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
        ref: frameworkUtils.ref(moveable, "areaElement"),
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
      ref: frameworkUtils.ref(moveable, "areaElement"),
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
    datas.isDragArea = false;
    datas.inputTarget = inputEvent.target;
    var areaElement = moveable.areaElement;
    var _b = moveable.state,
        clientRect = _b.clientRect,
        pos1 = _b.pos1,
        pos2 = _b.pos2,
        pos3 = _b.pos3,
        pos4 = _b.pos4;
    var left = clientRect.left,
        top = clientRect.top,
        width = clientRect.width,
        height = clientRect.height;

    var _c = getRect([pos1, pos2, pos3, pos4]),
        relativeLeft = _c.left,
        relativeTop = _c.top;

    var posX = clientX - left;
    var posY = clientY - top;
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
    utils.addClass(areaElement, AVOID);
  },
  drag: function (moveable, _a) {
    var datas = _a.datas;

    if (!datas.isDragArea) {
      datas.isDragArea = true;
      restoreStyle(moveable);
    }
  },
  dragEnd: function (moveable, e) {
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
    this.dragStart(moveable, e);
  },
  dragGroup: function (moveable, e) {
    this.drag(moveable, e);
  },
  dragGroupEnd: function (moveable, e) {
    var inputEvent = e.inputEvent,
        isDragArea = e.isDragArea,
        datas = e.datas;

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
      targetIndex = utils.findIndex(targets, function (parentTarget) {
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

function getDefaultScrollPosition(e) {
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
    var scrollClientRect = scrollContainer.getBoundingClientRect();
    var datas = e.datas;
    datas.scrollContainer = scrollContainer;
    datas.scrollRect = {
      left: scrollClientRect.left,
      top: scrollClientRect.top,
      width: scrollClientRect.width,
      height: scrollClientRect.height
    };
    datas.isScroll = true;
  },
  drag: function (moveable, e) {
    return this.checkScroll(moveable, e);
  },
  dragAfter: function (moveable, e) {
    this.checkScrollAfter(moveable, e);
  },
  dragEnd: function (moveable, e) {
    e.datas.isScroll = false;
  },
  dragGroupStart: function (moveable, e) {
    this.dragStart(moveable, e);
  },
  dragGroup: function (moveable, e) {
    return this.drag(moveable, __assign$2({}, e, {
      targets: moveable.props.targets
    }));
  },
  dragGroupAfter: function (moveable, e) {
    this.checkScrollAfter(moveable, e);
  },
  dragGroupEnd: function (moveable, e) {
    this.dragEnd(moveable, e);
  },
  checkScroll: function (moveable, e) {
    var datas = e.datas,
        clientX = e.clientX,
        clientY = e.clientY,
        isScroll = e.isScroll,
        targets = e.targets;
    datas.direction = null;

    if (!datas.isScroll) {
      return;
    }

    if (!isScroll) {
      datas.prevClientX = clientX;
      datas.prevClientY = clientY;
    }

    var _a = moveable.props,
        _b = _a.scrollThreshold,
        scrollThreshold = _b === void 0 ? 0 : _b,
        _c = _a.getScrollPosition,
        getScrollPosition = _c === void 0 ? getDefaultScrollPosition : _c;
    var scrollContainer = datas.scrollContainer,
        scrollRect = datas.scrollRect;
    var direction = [0, 0];

    if (scrollRect.top > clientY - scrollThreshold) {
      direction[1] = -1;
    } else if (scrollRect.top + scrollRect.height < clientY + scrollThreshold) {
      direction[1] = 1;
    }

    if (scrollRect.left > clientX - scrollThreshold) {
      direction[0] = -1;
    } else if (scrollRect.left + scrollRect.width < clientX + scrollThreshold) {
      direction[0] = 1;
    }

    if (!direction[0] && !direction[1]) {
      return;
    }

    datas.direction = direction;
    datas.prevPos = getScrollPosition({
      scrollContainer: scrollContainer,
      direction: direction
    });
    var params = fillParams(moveable, e, {
      scrollContainer: scrollContainer,
      direction: direction
    });
    var eventName = targets ? "onScrollGroup" : "onScroll";

    if (targets) {
      params.targets = targets;
    }

    triggerEvent(moveable, eventName, params);
    return true;
  },
  checkScrollAfter: function (moveable, e) {
    var datas = e.datas,
        inputEvent = e.inputEvent;
    var direction = datas.direction,
        prevPos = datas.prevPos;

    if (!datas.isScroll || !datas.direction) {
      return;
    }

    var _a = moveable.props.getScrollPosition,
        getScrollPosition = _a === void 0 ? getDefaultScrollPosition : _a;
    var scrollContainer = datas.scrollContainer;
    var nextPos = getScrollPosition({
      scrollContainer: scrollContainer,
      direction: direction
    });
    var offsetX = nextPos[0] - prevPos[0];
    var offsetY = nextPos[1] - prevPos[1];

    if (!offsetX && !offsetY) {
      return;
    }

    moveable.targetDragger.scrollBy(direction[0] ? offsetX : 0, direction[1] ? offsetY : 0, inputEvent, false);
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

var MOVEABLE_ABLES = [Default, Snappable, Pinchable, Draggable, Rotatable, Resizable, Scalable, Warpable, Scrollable, DragArea, Origin];

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
        key: i,
        ref: frameworkUtils.refs(moveable, "moveables", i),
        target: target,
        origin: false,
        parentMoveable: moveable,
        parentPosition: position
      });
    }).slice();
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
  __extends$2(MoveableGroup, _super);

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
      this.targetDragger = getAbleDragger(this, state.target, "targetAbles", "Group");
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
    var info = getTargetInfo(target, this.controlBox.getElement(), this.getContainer(), state);
    var pos = [info.left, info.top];
    _a = getAbsolutePosesByState(info), info.pos1 = _a[0], info.pos2 = _a[1], info.pos3 = _a[2], info.pos4 = _a[3];
    info.origin = plus(pos, info.origin);
    info.beforeOrigin = plus(pos, info.beforeOrigin);
    var clientRect = info.clientRect;
    clientRect.top += top - info.top - state.top;
    clientRect.left += left - info.left - state.left;
    this.updateState(__assign$2({}, info, {
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

  MoveableGroup.defaultProps = __assign$2({}, MoveableManager.defaultProps, {
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
  __extends$2(Moveable, _super);

  function Moveable() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = Moveable.prototype;

  __proto.render = function () {
    var props = this.props;
    var ables = props.ables || [];
    var target = this.props.target || this.props.targets;
    var isArr = utils.isArray(target);
    var isGroup = isArr && target.length > 1;

    if (isGroup) {
      var nextProps = __assign$2({}, this.props, {
        target: null,
        targets: target,
        ables: MOVEABLE_ABLES.concat([Groupable], ables)
      });

      return W(MoveableGroup, __assign$2({
        key: "group",
        ref: frameworkUtils.ref(this, "moveable")
      }, nextProps));
    } else {
      var moveableTarget = isArr ? target[0] : target;
      return W(MoveableManager, __assign$2({
        key: "single",
        ref: frameworkUtils.ref(this, "moveable")
      }, __assign$2({}, this.props, {
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

  __proto.getRect = function () {
    return this.moveable.getRect();
  };

  __proto.destroy = function () {
    this.moveable.componentWillUnmount();
  };

  return Moveable;
}($$1);

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
    return j$1(h(Moveable, __assign({
      ref: frameworkUtils.ref(this, "preactMoveable")
    }, this.state)), this.state.parentElement);
  };

  return InnerMoveable;
}(y);

var PROPERTIES = ["draggable", "resizable", "scalable", "rotatable", "warpable", "pinchable", "snappable", "origin", "target", "edge", "throttleDrag", "throttleResize", "throttleScale", "throttleRotate", "keepRatio", "dragArea", "pinchThreshold", "snapCenter", "snapThreshold", "horizontalGuidelines", "verticalGuidelines", "elementGuidelines", "bounds", "className", "renderDirections", "scrollable", "getScrollPosition", "scrollContainer", "scrollThreshold", "baseDirection", "snapElement", "snapVertical", "snapHorizontal"];
var EVENTS = ["dragStart", "drag", "dragEnd", "resizeStart", "resize", "resizeEnd", "scaleStart", "scale", "scaleEnd", "rotateStart", "rotate", "rotateEnd", "warpStart", "warp", "warpEnd", "pinchStart", "pinch", "pinchEnd", "dragGroupStart", "dragGroup", "dragGroupEnd", "resizeGroupStart", "resizeGroup", "resizeGroupEnd", "scaleGroupStart", "scaleGroup", "scaleGroupEnd", "rotateGroupStart", "rotateGroup", "rotateGroupEnd", "pinchGroupStart", "pinchGroup", "pinchGroupEnd", "clickGroup", "scroll", "scrollGroup", "renderStart", "render", "renderEnd", "renderGroupStart", "renderGroup", "renderGroupEnd"];
var METHODS = ["isMoveableElement", "updateRect", "updateTarget", "destroy", "dragStart", "isInside", "setState"];

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
      events[utils.camelize("on " + name)] = function (e) {
        return _this.trigger(name, e);
      };
    });
    H(h(InnerMoveable, __assign({
      ref: frameworkUtils.ref(_this, "innerMoveable"),
      parentElement: parentElement
    }, nextOptions, events)), _this.tempElement);
    var target = nextOptions.target;

    if (utils.isArray(target) && target.length > 1) {
      _this.updateRect();
    }

    return _this;
  }

  var __proto = Moveable.prototype;

  __proto.setState = function (state, callback) {
    this.innerMoveable.setState(state, callback);
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
    H("", this.tempElement);
    this.off();
    this.tempElement = null;
    this.innerMoveable = null;
  };

  __proto.getMoveable = function () {
    return this.innerMoveable.preactMoveable;
  };

  Moveable = __decorate([frameworkUtils.Properties(METHODS, function (prototype, property) {
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
  }), frameworkUtils.Properties(PROPERTIES, function (prototype, property) {
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



var modules = ({
    __proto__: null,
    'default': Moveable$1,
    PROPERTIES: PROPERTIES,
    EVENTS: EVENTS,
    METHODS: METHODS
});

for (var name in modules) {
  Moveable$1[name] = modules[name];
}

module.exports = Moveable$1;
//# sourceMappingURL=moveable.cjs.js.map
