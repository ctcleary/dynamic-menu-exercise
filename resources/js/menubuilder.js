// Build a dynamic menu based on an arbitrary JSON object.

// Establish MenuBuilder object.
var MenuBuilder = function(optionsHash) {
  // Utility function.
  function _makeEl(type, className, id) {
    var el = document.createElement(type);
    if (className) { el.classList.add(className); }
    if (id) { el.id = id; }
    return el;
  }

  // Use the passed options or defaults.
  var options = {
    menuId :       optionsHash.menuId        || 'menu-button',
    hashChangeId : optionsHash.hashChangeIdl || 'hash-change-notifier'
  };
  var _menuJSON = optionsHash.menuJSON      || { menuItems : [{ label : 'Example', href  : '#example' }] };

  var _menuContainerEl = document.getElementById(options.menuId)       || _makeEl('div', '', options.menuId);
  var _hashChangeEl    = document.getElementById(options.hashChangeId) || _makeEl('div', '', options.hashChangeId);

  return {

    // Must set a container element -- a menu button, most likely --
    // before building the menu.
    menuEl : function(id) {
      if (id) {
        _menuContainerEl = document.getElementById(id) || _makeEl('div', '', id);
        return this;
      } else {
        return _menuContainerEl;
      }
    },

    hashChangeEl : function(id) {
      if (id) {
        _hashChangeEl = document.getElementById(id) || _makeEl('div', '', id);
        return this;
      } else {
        return _hashChangeEl;
      }
    },
    
    build : function() {
      var topMenu = _makeEl('ul', 'topMenu', 'topMenu');
      this._menuLoopRecursive(topMenu, _menuJSON.menuItems);
      this.menuEl().appendChild(topMenu);
      this.initHashChangeHandler(this.hashChangeEl());
    },

    initHashChangeHandler : function(hashChangeEl) {
      var prevHashChangeHandler;
      if (window.onhashchange) {
        // Make sure we don't prevent any other onhashchange handlers
        // from doing their job by storing and calling previous handlers.
        prevHashChangeHandler = window.onhashchange;
      }
      window.onhashchange = function() {
        var newHash = window.location.valueOf().hash;

        var hashChangeEl = hashChangeEl;
        hashChangeEl.textContent = '';
        hashChangeEl.appendChild(document.createTextNode('Navigated to: ' + newHash));

        if (prevHashChangeHandler !== undefined) {
          prevHashChangeHandler();
        }
      };
    },

    // Private Function(s)

    // parentMenu : A `ul` or `ol` dom element.
    // menuItems  : An array of JSON objects with keys: { label: ..., href: ..., childMenuItems: ...(optional) }. 
    _menuLoopRecursive : function(parentMenu, menuItems) {
      for (var i = 0; i < menuItems.length; i++) {
        var item = menuItems[i];

        var liEl = _makeEl('li', 'menuItem');
        var anchorEl = _makeEl('a', 'menuLabel');
        anchorEl.href = item.href;

        var anchorText = document.createTextNode(item.label);
        anchorEl.appendChild(anchorText);

        liEl.appendChild(anchorEl);
        parentMenu.appendChild(liEl);

        if (item.childMenuItems) {
          // If this menu has childMenuItems, add a <ul> element
          // then recursively run _menuLoopRecursive to populate the childMenu.

          var childMenuMark = _makeEl('span', 'childMenuMark');
          liEl.appendChild(childMenuMark);

          var childMenu = _makeEl('ul', 'childMenu');
          liEl.appendChild(childMenu);
          
          this._menuLoopRecursive(childMenu, item.childMenuItems);
        }
      }
    }
  };
};
