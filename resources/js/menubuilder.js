// Build a dynamic menu based on an arbitrary JSON object.

// Establish MenuBuilder object.
var MenuBuilder = function(optionsHash) {
  // -- PRIVATE FUNCTIONS --
  // Element maker utility.
  function _makeEl(type, opt_className, opt_id) {
    var el = document.createElement(type);
    if (opt_className) { el.classList.add(opt_className); }
    if (opt_id) { el.id = opt_id; }
    return el;
  }
  
  // parentMenu : A `ul` or `ol` dom element.
  // menuItems  : An array of JSON objects with keys: { label: ..., href: ..., childMenuItems: ...(optional) }. 
  function _menuLoopRecursive(parentMenu, menuItems) {
    parentMenu.innerHTML = ''; // Clean the div in case it was pre-existing.

    for (var i = 0; i < menuItems.length; i++) {
      var item = menuItems[i];

      var liEl = _makeEl('li', 'menu-item');
      var anchorEl = _makeEl('a', 'menu-label');
      anchorEl.href = item.href;

      var anchorText = document.createTextNode(item.label);
      anchorEl.appendChild(anchorText);

      liEl.appendChild(anchorEl);
      parentMenu.appendChild(liEl);

      if (item.childMenuItems) {
        // If this menu has childMenuItems, add a <ul> element
        // then recursively run _menuLoopRecursive to populate the childMenu.

        var childMenuMark = _makeEl('span', 'child-menu-mark');
        liEl.appendChild(childMenuMark);

        var childMenu = _makeEl('ul', 'child-menu');
        liEl.appendChild(childMenu);
        
        _menuLoopRecursive(childMenu, item.childMenuItems);
      }
    }
  }

  function _setActiveMenuItem(hash) {
    var labelEls = document.getElementsByClassName('menu-label');
    var currActiveEl;
    var newActiveEl;

    for (var i = 0; i < labelEls.length; i++) {
      if (!currActiveEl && !newActiveEl) {
        var currLabelHash = labelEls[i].href.substr(labelEls[i].href.indexOf('#'));
        if (currLabelHash === hash) {
          newActiveEl = labelEls[i];
        }

        if (labelEls[i].classList.contains('active')) {
          currActiveEl = labelEls[i];
        }
      }
    }

    if (currActiveEl) {
      currActiveEl.classList.remove('active');
    }
    newActiveEl.classList.add('active');
  }

  // -- PRIVATE VARIABLES --
  // Use the passed options or establish defaults.
  var docUtil = new DocumentUtility();

  var _menuJSON = optionsHash.menuJSON || { menuItems : [{ label : 'Example', href  : '#example' }] };

  var options = {
    menuContainerId : optionsHash.menuContainerId || 'menu-button',
    hashChangeId :    optionsHash.hashChangeIdl   || 'hash-change-notifier'
  };


  // TODO : Make DocumentUtility
  // var _menuContainerEl = DocumentUtility.getOrCreate(options.menuContainerId);

  var _menuContainerEl = document.getElementById(options.menuContainerId) || _makeEl('div', '', options.menuContainerId);
  var _hashChangeEl    = document.getElementById(options.hashChangeId)    || _makeEl('div', '', options.hashChangeId);
  _hashChangeEl.classList.add('pulse');

  // Helper boolean to prevent adding multiple event handlers for one menu if `.build()` is called multiple times.
  var _hashChangeHandlerInitialized = false;

  // Helper id to prevent adding multiple dom elements.
  var _topMenuId = 'top-menu-' + (Math.floor(Math.random()*1000));

  return {
    menuContainerEl : function(opt_id, opt_newEl) {
      if (opt_id) {
        _menuContainerEl = docUtil.getOrCreateById(opt_id);
        return this;
      } else if (opt_newEl) {
        _hashChangeEl = opt_newEl;
        return this;
      } else {
        return _menuContainerEl;
      }
    },

    hashChangeEl : function(opt_id, opt_newEl) {
      if (opt_id) {
        _hashChangeEl = docUtil.getOrCreateById(opt_id);
        _hashChangeEl.classList.add('pulse');
        return this;
      } else if (opt_newEl) {
        _hashChangeEl = opt_newEl;
        return this;
      } else {
        return _hashChangeEl;
      }
    },
    
    build : function() {
      var topMenu = docUtil.getOrCreateById(_topMenuId, 'ul', 'top-menu');
      _menuLoopRecursive(topMenu, _menuJSON.menuItems);

      this.menuContainerEl().appendChild(topMenu);
      this.initHashChangeHandler();

      if (window.location.valueOf().hash) {
        this._setActiveMenuItem(window.location.valueOf().hash);
      }

      return this;
    },

    initHashChangeHandler : function() {
      if (!_hashChangeHandlerInitialized) {
        _hashChangeHandlerInitialized = true;

        var _this = this;

        var prevHashChangeHandler;
        if (window.onhashchange) {
          // Make sure we don't prevent any other onhashchange handlers
          // from doing their job by storing and calling previous handlers.
          prevHashChangeHandler = window.onhashchange;
        }

        window.onhashchange = function() {
          var newHash = this.getHashPath();

          // Do some DOM Element gymnastics to re-trigger the CSS animation:
          // Clone, then replace the hashChangeEl, then re-set the MenuBuilder's reference.
          
          var oldEl = _this.hashChangeEl(); // Scoped to MenuBuilder
          oldEl.textContent = ''; // Clear it out.

          var newEl = oldEl.cloneNode(true); // Clone it
          newEl.appendChild(document.createTextNode('Navigated to: ' + newHash));

          oldEl.parentNode.replaceChild(newEl, oldEl); // Replace it
          _this.hashChangeEl(null, newEl); // Re-set the MenuBuilder's reference to the new El.

          _setActiveMenuItem(newHash);

          if (prevHashChangeHandler !== undefined) {
            prevHashChangeHandler();
          }
        };
      }

      return this;
    }
  };
};

MenuBuilder.prototype = {
  getHashPath: function() {
    return window.location.valueOf().hash;
  },

  _setActiveMenuItem: function(hash) {
    var labelEls = docUtil.getByClassName('menu-label');
    var currActiveEl;
    var newActiveEl;

    for (var i = 0; i < labelEls.length; i++) {
      if (!currActiveEl && !newActiveEl) {
        var currLabelHash = labelEls[i].href.substr(labelEls[i].href.indexOf('#'));
        if (currLabelHash === hash) {
          newActiveEl = labelEls[i];
        }

        if (labelEls[i].classList.contains('active')) {
          currActiveEl = labelEls[i];
        }
      }
    }

    if (currActiveEl) {
      currActiveEl.classList.remove('active');
    }
    newActiveEl.classList.add('active');
  },

  _menuLoopRecursive: function(parentMenu, menuItems) {
    parentMenu.innerHTML = ''; // Clean the div in case it was pre-existing.

    for (var i = 0; i < menuItems.length; i++) {
      var item = menuItems[i];

      var liEl = _makeEl('li', 'menu-item');
      var anchorEl = _makeEl('a', 'menu-label');
      anchorEl.href = item.href;

      var anchorText = document.createTextNode(item.label);
      anchorEl.appendChild(anchorText);

      liEl.appendChild(anchorEl);
      parentMenu.appendChild(liEl);

      if (item.childMenuItems) {
        // If this menu has childMenuItems, add a <ul> element
        // then recursively run _menuLoopRecursive to populate the childMenu.

        var childMenuMark = _makeEl('span', 'child-menu-mark');
        liEl.appendChild(childMenuMark);

        var childMenu = _makeEl('ul', 'child-menu');
        liEl.appendChild(childMenu);
        
        _menuLoopRecursive(childMenu, item.childMenuItems);
      }
    }
  }
};
