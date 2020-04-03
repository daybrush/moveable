
(function () {
  var nav = document.querySelector("nav");
  var searchBar = nav.querySelector(".search");
  var input = searchBar.querySelector("input");
  // var submit = searchBar.querySelector("button");
  var groups = Array.prototype.slice.call(document.querySelectorAll("nav>ul .parent")).map(function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll("a"));
    var strings = items.map(function (a) {
      return a.innerText.toLowerCase();
    });

    return {el: group, items: items, strings, strings};
  });
  input.addEventListener("keyup", function (e) {
    var value = input.value.toLowerCase();

    if (value) {
      utils.addClass(nav, "searching");
    } else {
      utils.removeClass(nav, "searching");
      return;
    }
    groups.forEach(function (group) {
      var isSearch = false;
      var items = group.items;

      group.strings.forEach(function (v, i) {
        var item = items[i];
        if (utils.hasClass(item.parentNode, "parent")) {
          item = item.parentNode;
        }
        if (v.indexOf(value) > -1) {
          utils.addClass(item, "targeting");
          isSearch = true;
        } else {
          utils.removeClass(item, "targeting");
        }
      });
      if (isSearch) {
        utils.addClass(group.el, "module-targeting");
      } else {
        utils.removeClass(group.el, "module-targeting");
      }
    });
  });
})();