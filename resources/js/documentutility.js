var DocumentUtility = function() {};

DocumentUtility.prototype = {

  makeUniqueId: function(idPrefix) {
    var prefix = (idPrefix) ? idPrefix : 'uid-';
    return prefix + Date.now() + Math.floor(Math.random()*1000);
  },

  makeEl: function(type) {
    return document.createElement(type);
  },

  makeElWithId: function(type, id) {
    var el = this.makeEl(type);
    el.id = id;
    return el;
  },

  makeElWithClass: function(type, classNames) {
    var el = this.makeEl(type);
    el.classList.add(classNames);
    return el;
  },

  makeElWithIdAndClass: function(type, id, classNames) {
    var el = this.makeEl(type);
    el.classList.add(classNames);
    el.id = id;
    return el;
  },

  getElById: function(id) {
    return document.getElementById(id);
  },

  getByClassName: function(className) {
    return document.getElementsByClassName(className);
  },

  getChildrenByClassName: function(parentEl, className) {
    var result = [];
    var children = parentEl.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].classList.contains(className)) {
        result.push(children[i]);
      }
    }
    return result;
  },

  getDescendantsByClassName: function(parentEl, className) {
    var result = [];
    var children = parentEl.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].classList.contains(className)) {
        result.push(children[i]);
      }
      // Also search recursively all the way down.
      var subResult = this.getDescendantsByClassName(children[i], className);
      result = result.concat(subResult);
    }
    return result;
  },

  getOrCreateById: function(id, type, opt_classNames) {
    if (this.getElById(id)) {
      return this.getElById(id);

    } else {
      if (opt_classNames) {
        return this.makeElWithIdAndClass(type, id, opt_classNames);

      } else {
        return this.makeElWithId(type, id);
      }
    }
  },

  getHashPath: function() {
    return window.location.valueOf().hash;
  }
};
