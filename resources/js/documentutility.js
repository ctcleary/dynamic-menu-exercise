var DocumentUtility = function() {};

DocumentUtility.prototype = {
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
  }
};
