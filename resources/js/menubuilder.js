// Build a dynamic menu based on an arbitrary JSON object.

// Establish MenuBuilder object.
var MenuBuilder = function(optionsHash) {
  // -- PRIVATE FUNCTIONS --
  // Element maker utility.
  function _makeEl(type, className, id) {
    var el = document.createElement(type);
    if (className) { el.classList.add(className); }
    if (id) { el.id = id; }
    return el;
  }
      // parentMenu : A `ul` or `ol` dom element.
    // menuItems  : An array of JSON objects with keys: { label: ..., href: ..., childMenuItems: ...(optional) }. 
  function _menuLoopRecursive(parentMenu, menuItems) {
    parentMenu.innerHTML = ''; // Clean the div in case it was pre-existing.

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
        
        _menuLoopRecursive(childMenu, item.childMenuItems);
      }
    }
  }

  // -- PRIVATE VARIABLES --
  // Use the passed options or establish defaults.
  var _menuJSON = optionsHash.menuJSON || { menuItems : [{ label : 'Example', href  : '#example' }] };

  var options = {
    menuId :       optionsHash.menuId        || 'menu-button',
    hashChangeId : optionsHash.hashChangeIdl || 'hash-change-notifier'
  };

  var _menuContainerEl = document.getElementById(options.menuId)       || _makeEl('div', '', options.menuId);
  var _hashChangeEl    = document.getElementById(options.hashChangeId) || _makeEl('div', '', options.hashChangeId);

  // Helper boolean to prevent adding multiple event handlers if `.build()` is called multiple times.
  var _hashChangeHandlerInitialized = false;

  // Helper id to prevent adding multiple dom elements.
  var _topMenuId = 'top-menu-' + (Math.floor(Math.random()*1000));

  return {
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
      var topMenu = document.getElementById(_topMenuId) || _makeEl('ul', 'top-menu', _topMenuId);
      _menuLoopRecursive(topMenu, _menuJSON.menuItems);

      this.menuEl().appendChild(topMenu);
      this.initHashChangeHandler(this.hashChangeEl());

      return this;
    },

    initHashChangeHandler : function(hashChangeEl) {
      if (!_hashChangeHandlerInitialized) {
        _hashChangeHandlerInitialized = true;

        var prevHashChangeHandler;
        if (window.onhashchange) {
          // Make sure we don't prevent any other onhashchange handlers
          // from doing their job by storing and calling previous handlers.
          prevHashChangeHandler = window.onhashchange;
        }

        window.onhashchange = function() {
          var newHash = window.location.valueOf().hash;

          hashChangeEl.textContent = '';
          hashChangeEl.appendChild(document.createTextNode('Navigated to: ' + newHash));

          if (prevHashChangeHandler !== undefined) {
            prevHashChangeHandler();
          }
        };
      }

      return this;
    },


  };
};
