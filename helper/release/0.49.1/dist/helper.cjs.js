/*
Copyright (c) Daybrush
name: @moveable/helper
license: MIT
author: Daybrush
repository: https://github.com/daybrush/moveable/blob/master/packages/helper
version: 0.1.3
*/
'use strict';

var utils = require('@daybrush/utils');

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

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var Child = /*#__PURE__*/ (function () {
    function Child(parent) {
        this.parent = parent;
        this.type = "single";
        this.depth = 0;
        this._scope = [];
        if (parent) {
            this.depth = parent.depth + 1;
        }
    }
    Object.defineProperty(Child.prototype, "scope", {
        get: function () {
            var parent = this.parent;
            if (!parent || parent.type === "root") {
                return [];
            }
            return __spreadArray(__spreadArray([], __read(parent.scope), false), [parent.id], false);
        },
        enumerable: false,
        configurable: true
    });
    return Child;
}());
var SingleChild = /*#__PURE__*/ (function (_super) {
    __extends(SingleChild, _super);
    function SingleChild(parent, value) {
        var _this = _super.call(this, parent) || this;
        _this.value = value;
        _this.type = "single";
        _this.isGroupElement = false;
        return _this;
    }
    return SingleChild;
}(Child));
var ArrayChild = /*#__PURE__*/ (function (_super) {
    __extends(ArrayChild, _super);
    function ArrayChild() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "group";
        _this.value = [];
        _this.id = "";
        _this.groupElement = null;
        _this.map = new Map();
        return _this;
    }
    ArrayChild.prototype.compare = function (groups, checker) {
        if (checker === void 0) { checker = 0; }
        var elements = utils.deepFlat(groups);
        var map = this.map;
        var elementsLength = elements.length;
        var mapSize = map.size;
        var sizeDiff = mapSize - elementsLength;
        // 1 this > groups
        // 0 this = groups
        // -1 this < groups
        var count = elements.filter(function (element) { return map.has(element); }).length;
        if ((checker > 0 && sizeDiff >= 0) || (checker === 0 && sizeDiff === 0)) {
            return elementsLength === count;
        }
        else if (checker < 0 && sizeDiff <= 0) {
            return mapSize === count;
        }
        return false;
    };
    ArrayChild.prototype.has = function (target) {
        return this.map.has(target);
    };
    ArrayChild.prototype.contains = function (element) {
        if (this.has(element)) {
            return true;
        }
        return this.value.some(function (child) {
            if (child.type === "group") {
                return child.contains(element);
            }
            else {
                return false;
            }
        });
    };
    ArrayChild.prototype.findContainedChild = function (element) {
        return utils.find(this.value, function (child) {
            if (child.type === "single") {
                return child.value === element;
            }
            else {
                return child.contains(element);
            }
        });
    };
    /**
     * Exact group containing targets
     */
    ArrayChild.prototype.findExactChild = function (target) {
        var map = this.map;
        if (!utils.isArray(target)) {
            return map.get(target);
        }
        var flatted = utils.deepFlat(target);
        var length = flatted.length;
        var single = map.get(flatted[0]);
        if (!single) {
            return;
        }
        var parent = single.parent;
        while (parent) {
            if (parent.map.size >= length) {
                return parent;
            }
            parent = parent.parent;
        }
        return;
    };
    ArrayChild.prototype.findCommonParent = function (targets) {
        var _this = this;
        var depth = Infinity;
        var childs = targets.map(function (target) { return _this.findExactChild(target); });
        childs.forEach(function (child) {
            if (!child) {
                return;
            }
            depth = Math.min(child.depth, depth);
        });
        var _loop_1 = function () {
            --depth;
            childs = childs.map(function (child) {
                var parent = child;
                while (parent && parent.depth !== depth) {
                    parent = parent.parent;
                }
                return parent;
            });
            var firstChild = childs.find(function (child) { return child; });
            if (!firstChild) {
                return { value: this_1 };
            }
            if (childs.every(function (child) { return !child || child === firstChild; })) {
                return "break";
            }
        };
        var this_1 = this;
        while (depth) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
            if (state_1 === "break")
                break;
        }
        var commonParent = childs.find(function (child) { return child; });
        return commonParent || this;
    };
    ArrayChild.prototype.findNextChild = function (target, range, isExact) {
        var _this = this;
        if (range === void 0) { range = this.toTargetGroups(); }
        if (isExact === void 0) { isExact = true; }
        var nextChild = null;
        var length = range.length;
        range.some(function (child) {
            if (!isExact && length === 1 && utils.isArray(child)) {
                nextChild = _this.findNextChild(target, child);
                return nextChild;
            }
            var nextGroupChild = _this.findExactChild(child);
            if (!nextGroupChild) {
                return;
            }
            if ("map" in nextGroupChild) {
                if (nextGroupChild.map.has(target)) {
                    nextChild = nextGroupChild;
                    return true;
                }
            }
        });
        return nextChild;
    };
    ArrayChild.prototype.findNextExactChild = function (target, selected, range) {
        if (range === void 0) { range = this.toTargetGroups(); }
        // [[1, 2]] => group([1, 2]) exact
        // [[[1, 2], 3]] => group([1, 2])
        var nextChild = this.findNextChild(target, range, true);
        if (!nextChild) {
            return null;
        }
        if (nextChild.compare(selected, -1)) {
            return nextChild;
        }
        return null;
    };
    /**
     * Finds a group that does not overlap within the range and includes the target.
     */
    ArrayChild.prototype.findPureChild = function (target, range) {
        var _this = this;
        var nextGroupChild = null;
        var childSelected = range.filter(function (element) { return _this.has(element); });
        if (!childSelected.length) {
            return this;
        }
        this.value.some(function (nextChild) {
            if (nextChild.type !== "single" && nextChild.has(target)) {
                nextGroupChild = nextChild.findPureChild(target, childSelected);
                if (nextGroupChild) {
                    return true;
                }
            }
        });
        return nextGroupChild;
    };
    ArrayChild.prototype.findNextPureChild = function (target, range) {
        var nextChild = this.findNextChild(target);
        if (nextChild) {
            return nextChild.findPureChild(target, range);
        }
        return null;
    };
    ArrayChild.prototype.getSingleChild = function () {
        var _a;
        var groupElement = this.groupElement;
        if (groupElement) {
            var singleChild = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.value.find(function (t) { return t.value === groupElement; });
            if (singleChild) {
                return singleChild;
            }
        }
        return null;
    };
    ArrayChild.prototype.toTargetGroups = function () {
        return this.value.map(function (child) {
            if (child.type === "single") {
                return child.value;
            }
            else {
                return child.toTargetGroups();
            }
        });
    };
    ArrayChild.prototype.findArrayChild = function (targets) {
        var value = this.value;
        var result = false;
        if (this.type !== "root") {
            result = value.every(function (child) {
                if (child.type === "single") {
                    return targets.some(function (target) { return child.value === target; });
                }
                else {
                    return targets.some(function (target) {
                        return utils.isArray(target) && child.findArrayChild(target);
                    });
                }
            });
            // result = targets.every(target => {
            //     if (isArray(target)) {
            //         return value.some(child => {
            //             return child.type === "group" && child.findArrayChild(target);
            //         });
            //     } else {
            //         return map.get(target);
            //     }
            // });
        }
        if (result && targets.length === value.length) {
            return this;
        }
        else {
            var childResult_1 = null;
            value.some(function (child) {
                if (child.type === "group") {
                    childResult_1 = child.findArrayChild(targets);
                    return childResult_1;
                }
            });
            return childResult_1;
        }
    };
    ArrayChild.prototype.groupByPerfect = function (selected) {
        return this.value.filter(function (child) {
            if (child.type !== "single") {
                return child.compare(selected, -1);
            }
            return selected.indexOf(child.value) > -1;
        }).map(function (child) {
            if (child.type !== "single") {
                var singleChild = child.getSingleChild();
                if (singleChild) {
                    return singleChild;
                }
            }
            return child;
        });
    };
    ArrayChild.prototype.add = function (targets) {
        var _this = this;
        var _a = this, value = _a.value, map = _a.map;
        targets.forEach(function (child) {
            if ("groupId" in child) {
                var group = new ArrayChild(_this);
                group.id = child.groupId;
                value.push(group);
                group.add(child.children);
            }
            else if (utils.isArray(child)) {
                var group = new ArrayChild(_this);
                value.push(group);
                group.add(child);
            }
            else {
                var element = "current" in child ? child.current : child;
                var single = new SingleChild(_this, element);
                value.push(single);
                map.set(element, single);
            }
        });
        value.forEach(function (child) {
            if (child.type === "single") {
                map.set(child.value, child);
            }
            else {
                child.map.forEach(function (nextChild, element) {
                    map.set(element, nextChild);
                });
            }
        });
        value.forEach(function (child) {
            if (child.type !== "single") {
                return;
            }
            // single
            var singleElement = child.value;
            var groupChild = value.find(function (child2) {
                if (child2.type === "single") {
                    return;
                }
                var firstElement = __spreadArray([], __read(child2.map.keys()), false)[0];
                if (!firstElement) {
                    return;
                }
                return singleElement.contains(firstElement);
            });
            child.isGroupElement = !!groupChild;
            if (groupChild) {
                groupChild.groupElement = child.value;
            }
        });
        return parent;
    };
    return ArrayChild;
}(Child));

function toTargetList(raw) {
    function targets(childs) {
        if (childs === void 0) { childs = []; }
        var arr = [];
        childs.forEach(function (child) {
            if (child.type === "single") {
                arr.push(child.value);
            }
            else {
                arr.push(targets(child.value));
            }
        });
        return arr;
    }
    return {
        raw: function () { return raw; },
        targets: function () {
            return targets(this.raw());
        },
        flatten: function () {
            return utils.deepFlat(this.targets());
        },
    };
}
var GroupManager = /*#__PURE__*/ (function (_super) {
    __extends(GroupManager, _super);
    function GroupManager(targetGroups, targets) {
        var _this = _super.call(this) || this;
        _this.type = "root";
        _this._targets = [];
        _this.set(targetGroups, targets);
        return _this;
    }
    GroupManager.prototype.set = function (targetGroups, targets) {
        var _this = this;
        if (targets === void 0) { targets = []; }
        this.map = new Map();
        this.value = [];
        var map = this.map;
        var value = this.value;
        this.add(targetGroups);
        targets.forEach(function (target) {
            if (map.has(target)) {
                return;
            }
            var single = new SingleChild(_this, target);
            single.depth = 1;
            value.push(single);
            map.set(target, single);
        });
        this._targets = targets;
    };
    GroupManager.prototype.selectSubChilds = function (targets, target) {
        var root = this;
        var nextChild = root.findNextChild(target, targets, false);
        var targetChild = root.map.get(target);
        var nextChilds = [];
        if (nextChild) {
            nextChilds = [nextChild];
        }
        else if (targetChild) {
            nextChilds = [targetChild];
        }
        else {
            nextChilds = [];
        }
        return toTargetList(nextChilds);
    };
    GroupManager.prototype.selectSingleChilds = function (targets, added, removed) {
        var nextTargets = __spreadArray([], __read(targets), false);
        // group can't be added, removed.
        removed.forEach(function (element) {
            var index = nextTargets.indexOf(element);
            if (index > -1) {
                nextTargets.splice(index, 1);
            }
        });
        // Targets can be added one by one
        added.forEach(function (element) {
            nextTargets.push(element);
        });
        return toTargetList(this.toChilds(nextTargets));
    };
    GroupManager.prototype.selectCompletedChilds = function (targets, added, removed, continueSelect) {
        var _this = this;
        var nextTargets = __spreadArray([], __read(targets), false);
        var startSelected = utils.deepFlat(nextTargets);
        // group can be added, removed.
        removed.forEach(function (element) {
            // Single Target
            var index = nextTargets.indexOf(element);
            if (index > -1) {
                // single target or group
                nextTargets.splice(index, 1);
                return;
            }
            // Group Target
            var removedChild = continueSelect
                // Finds the nearest child for element and nextTargets.
                ? _this.findNextChild(element, nextTargets)
                // Find the nearest exact child for element, all removed and nextTargets.
                : _this.findNextExactChild(element, removed, nextTargets);
            if (removedChild) {
                var groupIndex = nextTargets.findIndex(function (target) {
                    return utils.isArray(target) && removedChild.compare(target);
                });
                if (groupIndex > -1) {
                    nextTargets.splice(groupIndex, 1);
                }
            }
        });
        added.forEach(function (element) {
            var parentGroup = _this._findParentGroup(element, startSelected);
            var nextChild = parentGroup.findContainedChild(element);
            if ((nextChild === null || nextChild === void 0 ? void 0 : nextChild.type) === "group") {
                var singleChild = nextChild.getSingleChild();
                if (singleChild) {
                    nextTargets.push(singleChild.value);
                }
                else {
                    nextTargets.push(nextChild.toTargetGroups());
                }
                return;
            }
            nextTargets.push(element);
        });
        return toTargetList(this.toChilds(nextTargets));
    };
    GroupManager.prototype.selectSameDepthChilds = function (targets, added, removed, continueSelect) {
        var nextTargets = __spreadArray([], __read(targets), false);
        var commonParent = this.findCommonParent(nextTargets);
        removed.forEach(function (element) {
            // Single Target
            var index = nextTargets.indexOf(element);
            if (index > -1) {
                // single target or group
                nextTargets.splice(index, 1);
                return;
            }
            var removedChild = continueSelect
                // Find the nearest exact child for element, all removed and nextTargets.
                ? commonParent.findNextExactChild(element, removed, nextTargets)
                // Finds the nearest child for element and nextTargets.
                : commonParent.findNextChild(element, nextTargets, true);
            if (removedChild) {
                var groupIndex = nextTargets.findIndex(function (target) {
                    return utils.isArray(target) && removedChild.compare(target);
                });
                if (groupIndex > -1) {
                    nextTargets.splice(groupIndex, 1);
                }
            }
        });
        var addedChildren = commonParent.groupByPerfect(added);
        addedChildren.forEach(function (child) {
            if (child.type === "single") {
                nextTargets.push(child.value);
            }
            else {
                var groupIndex = nextTargets.findIndex(function (target) {
                    return utils.isArray(target) && child.compare(target, 1);
                });
                if (groupIndex > -1) {
                    nextTargets.splice(groupIndex, 1);
                }
                nextTargets.push(child.toTargetGroups());
            }
        });
        return toTargetList(this.toChilds(nextTargets));
    };
    GroupManager.prototype.toChilds = function (targets) {
        var _this = this;
        var childs = [];
        targets.forEach(function (target) {
            if (utils.isArray(target)) {
                var arrayChild = _this.findArrayChild(target);
                if (arrayChild) {
                    var singleChild = arrayChild.getSingleChild();
                    if (singleChild) {
                        return singleChild;
                    }
                    childs.push(arrayChild);
                }
            }
            else {
                var single = _this.map.get(target);
                if (single) {
                    childs.push(single);
                }
                else {
                    childs.push(new SingleChild(_this, target));
                }
            }
        });
        return childs;
    };
    GroupManager.prototype.findChild = function (element, isAuto) {
        var value = this.map.get(element);
        if (isAuto) {
            return value || new SingleChild(this, element);
        }
        return value;
    };
    GroupManager.prototype.findArrayChildById = function (id) {
        var value = null;
        this.value.some(function find(child) {
            if (child.type !== "single") {
                if (child.id === id) {
                    value = child;
                    return true;
                }
                else {
                    return child.value.some(find);
                }
            }
        });
        return value;
    };
    GroupManager.prototype.group = function (targets, flatten) {
        var _this = this;
        var commonParent = this.findCommonParent(targets);
        var groupChilds = targets.map(function (target) {
            if (utils.isArray(target)) {
                return _this.findArrayChild(target);
            }
            return _this.findChild(target);
        });
        var isGroupable = groupChilds.every(function (child) { return (child === null || child === void 0 ? void 0 : child.parent) === commonParent; });
        if (!isGroupable) {
            return null;
        }
        var group = new ArrayChild(commonParent);
        var nextChilds = commonParent.value.filter(function (target) { return groupChilds.indexOf(target) === -1; });
        if (!nextChilds.length) {
            return null;
        }
        nextChilds.unshift(group);
        group.add(flatten ? utils.deepFlat(targets) : targets);
        commonParent.value = nextChilds;
        this.set(this.toTargetGroups(), this._targets);
        return group.toTargetGroups();
    };
    GroupManager.prototype.ungroup = function (targets) {
        var _this = this;
        if (targets.length === 1 && utils.isArray(targets[0])) {
            targets = targets[0];
        }
        var commonParent = this.findCommonParent(targets);
        var groupChilds = targets.map(function (target) {
            if (utils.isArray(target)) {
                return _this.findArrayChild(target);
            }
            return _this.findChild(target);
        });
        if (commonParent.groupElement) {
            return null;
        }
        // all children is targets
        var isGroupable = commonParent.value.every(function (child) { return groupChilds.indexOf(child) > -1; });
        if (!isGroupable || commonParent === this) {
            // has no group
            return null;
        }
        var parent = commonParent.parent;
        if (!parent) {
            return null;
        }
        var nextChilds = parent.value.filter(function (target) { return target !== commonParent; });
        nextChilds.push.apply(nextChilds, __spreadArray([], __read(commonParent.value), false));
        parent.value = nextChilds;
        this.set(this.toTargetGroups(), this._targets);
        return commonParent.toTargetGroups();
    };
    GroupManager.prototype._findParentGroup = function (element, range) {
        if (!range.length) {
            return this;
        }
        var single = this.map.get(element);
        if (!single) {
            return this;
        }
        var parent = single.parent;
        while (parent) {
            if (range.some(function (element) { return parent.contains(element); })) {
                return parent;
            }
            parent = parent.parent;
        }
        return this;
    };
    return GroupManager;
}(ArrayChild));

var modules = {
    __proto__: null,
    ArrayChild: ArrayChild,
    Child: Child,
    GroupManager: GroupManager,
    SingleChild: SingleChild,
    toTargetList: toTargetList
};

module.exports = modules;

exports.ArrayChild = ArrayChild;
exports.Child = Child;
exports.GroupManager = GroupManager;
exports.SingleChild = SingleChild;
exports.default = modules;
exports.toTargetList = toTargetList;
//# sourceMappingURL=helper.cjs.js.map
