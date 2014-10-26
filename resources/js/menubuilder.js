// Build a dynamic menu based on an arbitrary JSON object.

// Establish MenuBuilder object.
var MenuBuilder = function(optionsHash) {
  // -- PRIVATE VARIABLES --
  // Use the passed options or establish defaults.
  var docUtil = new DocumentUtility();

  var _menuJSON = optionsHash.menuJSON || { menuItems : [{ label : 'Example', href  : '#example' }] };

  var options = {
    menuContainerId : optionsHash.menuContainerId || 'menu-button',
    hashChangeId :    optionsHash.hashChangeIdl   || 'hash-change-notifier'
  };

  var _menuContainerEl = docUtil.getOrCreateById(options.menuContainerId, 'div');
  var _hashChangeEl    = docUtil.getOrCreateById(options.hashChangeId, 'div', 'pulse');

  var _hashChangeHandlerInitialized = false;  // Helper boolean to prevent adding multiple event handler
  var _topMenuId = 'top-menu-' + (Math.floor(Math.random()*1000)); // Helper id to prevent adding multiple dom elements

  this.menuContainerEl = function(opt_id, opt_newEl) {
    if (opt_id) {
      _menuContainerEl = docUtil.getOrCreateById(opt_id, 'div');
      return this;

    } else if (opt_newEl) {
      _hashChangeEl = opt_newEl;
      return this;

    } else {
      return _menuContainerEl;
    }
  };

  this.hashChangeEl = function(opt_id, opt_newEl) {
    if (opt_id) {
      _hashChangeEl = docUtil.getOrCreateById(opt_id, 'div', 'pulse');
      _hashChangeEl.classList.add('pulse');
      return this;

    } else if (opt_newEl) {
      _hashChangeEl = opt_newEl;
      return this;

    } else {
      return _hashChangeEl;
    }
  };
    
  this.build = function() {
    var topMenu = docUtil.getOrCreateById(_topMenuId, 'ul', 'top-menu');
    this.menuLoopRecursive(topMenu, _menuJSON.menuItems);

    this.menuContainerEl().appendChild(topMenu);
    this.initHashChangeHandler();

    if (this.getHashPath()) {
      this.setActiveMenuItem(this.getHashPath());
    }

    return this;
  };

  this.initHashChangeHandler = function() {
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
        // Do some DOM Element gymnastics to re-trigger the CSS animation:
        // Clone, then replace the hashChangeEl, then re-set the MenuBuilder's reference.
        
        var oldEl = _this.hashChangeEl(); // Scoped to MenuBuilder
        oldEl.textContent = ''; // Clear it out.

        var newEl = oldEl.cloneNode(true); // Clone it
        newEl.appendChild(document.createTextNode('Navigated to: ' + _this.getHashPath()));

        oldEl.parentNode.replaceChild(newEl, oldEl); // Replace it
        _this.hashChangeEl(null, newEl); // Re-set the MenuBuilder's reference to the new El.

        _this.setActiveMenuItem(_this.getHashPath());

        if (prevHashChangeHandler !== undefined) {
          prevHashChangeHandler();
        }
      };
    }

    return this;
  };
};

MenuBuilder.prototype = {
  docUtil: new DocumentUtility(),

  getHashPath: function() {
    return window.location.valueOf().hash;
  },

  setActiveMenuItem: function(searchHash) {
    var labelEls = this.docUtil.getByClassName('menu-label');
    var currActiveEl;
    var newActiveEl;

    for (var i = 0; i < labelEls.length; i++) {
      if (!newActiveEl) {
        if (labelEls[i].hash === searchHash) {
          newActiveEl = labelEls[i];
        }
      }

      if (!currActiveEl) {
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

  menuLoopRecursive: function(parentMenu, menuItems) {
    parentMenu.innerHTML = ''; // Clean the div in case it was pre-existing.

    for (var i = 0; i < menuItems.length; i++) {
      var item = menuItems[i];

      var liEl      = this.docUtil.makeElWithClass('li', 'menu-item');
      var anchorEl  = this.docUtil.makeElWithClass('a', 'menu-label');
      var anchorText = document.createTextNode(item.label);
      
      anchorEl.href = item.href;
      anchorEl.appendChild(anchorText);

      liEl.appendChild(anchorEl);
      parentMenu.appendChild(liEl);

      if (item.childMenuItems) {
        var childMenuMark = this.docUtil.makeElWithClass('span', 'child-menu-mark');
        var childMenu = this.docUtil.makeElWithClass('ul', 'child-menu');

        liEl.appendChild(childMenuMark); // Add a UI marker
        liEl.appendChild(childMenu);     // Add a <ul> element
        
        this.menuLoopRecursive(childMenu, item.childMenuItems); // Run recursively for childMenuItems
      }
    }
  }
};
