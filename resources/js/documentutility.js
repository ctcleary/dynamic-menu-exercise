var DocumentUtility = function() {

};

DocumentUtility.prototype = {
  makeEl: function(type) {
    return document.createElement('div');
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

  getEl: function(id) {
    return document.getElementById(id);
  },

  getByClassName: function(className) {
    return document.getElementsByClassName(className);
  },

  getOrCreateById: function(id, opt_type, opt_classNames) {
    if (this.getEl(id)) {
      return this.getEl(id);
    } else {
      var elType = (opt_type) ? opt_type : 'div';

      if (opt_classNames) {
        return this.makeElWithIdAndClass(elType, id, opt_classNames);

      } else {
        return this.makeElWithId(elType, id);
      }
    }
  }
};
