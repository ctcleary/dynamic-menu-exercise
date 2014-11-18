// Build a dynamic menu based on an arbitrary JSON object.

// Establish MenuBuilder object.
var MenuBuilder = function(optionsHash) {
  // -----------------------
  // -- PRIVATE VARIABLES --
  // -----------------------
  // Use the provided options from `optionsHash` or fall back to defaults.
  var _menuJSON = optionsHash.menuJSON; // menuJSON is required.
  var options = {
    menuContainerId : optionsHash.menuContainerId || 'menu-button',
    hashChangeId :    optionsHash.hashChangeIdl   || 'hash-change-notifier'
  };

  // Get existing elements or create new elements
  var _menuContainerEl = this.docUtil.getOrCreateById(options.menuContainerId, 'div');
  var _hashChangeEl    = this.docUtil.getOrCreateById(options.hashChangeId, 'div', 'pulse');

  // Helpers
  var _hashChangeHandlerInitialized = false;  // Helper boolean to prevent adding multiple event handler
  var _topMenuElId = 'top-menu-' + (Math.floor(Math.random()*10000)); // Randomized to prevent redundant els

  // ----------------------
  // -- PUBLIC FUNCTIONS --
  // ----------------------
  // Set an el using a passed element, or return existing element.
  this.menuContainerEl = function(opt_el) {
    if (opt_el) {
      _menuContainerEl = opt_el;
      return this; // For chaining.
    } else {
      return _menuContainerEl;
    }
  };

  // Set an el using a passed element, or return existing element.
  this.hashChangeEl = function(opt_el) {
    if (opt_el) {
      _hashChangeEl = opt_el;
      return this; // For chaining.
    } else {
      return _hashChangeEl;
    }
  };
    
  this.build = function() {
    // Create the menu from the JSON object.
    var topMenu = this.docUtil.getOrCreateById(_topMenuElId, 'ul', 'top-menu');
    this.menuLoopRecursive(topMenu, _menuJSON.menuItems);

    // Append it to the container and add the hash change handler.
    this.menuContainerEl().appendChild(topMenu);
    this.initHashChangeHandler();

    // If we currently have a hash path, set the active menu item.
    if (this.getHashPath()) {
      this.setActiveMenuItem(this.getHashPath());
    }

    return this;
  };

  this.initHashChangeHandler = function() {
    if (_hashChangeHandlerInitialized) {
      return;
    }

    _hashChangeHandlerInitialized = true;

    var prevHashChangeHandler;
    if (window.onhashchange) {
      // Don't prevent any other onhashchange handlers from doing their job.
      prevHashChangeHandler = window.onhashchange;
    }

    var _this = this;
    window.onhashchange = function() {
      // Do some DOM Element gymnastics to re-trigger the CSS animation:
      var oldEl = _this.hashChangeEl(); // Get it
      var newEl = oldEl.cloneNode(true); // Clone it
      newEl.textContent = ''; // Clear out the Clone, then change contents
      newEl.appendChild(document.createTextNode('Navigated to: ' + _this.getHashPath()));

      oldEl.parentNode.replaceChild(newEl, oldEl); // Replace old with new.
      _this.hashChangeEl(newEl); // Re-set the MenuBuilder's reference to the newEl.
      
      // Set css for 'active' menu item.
      _this.setActiveMenuItem(_this.getHashPath());

      if (prevHashChangeHandler !== undefined) {
        prevHashChangeHandler(); // Call it if we have a previous handler.
      }
    };

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

    // Find the `newActiveEl` and `currentActiveEl`
    for (var i = 0; i < labelEls.length; i++) {
      if (!newActiveEl) { // If we haven't found it yet.
        newActiveEl = this.isNewActiveEl(labelEls[i]);
      }
      if (!currActiveEl) { // If we haven't found it yet.
        currActiveEl = this.isCurrActiveEl(labelEls[i]);
      }
    }

    if (currActiveEl) {
      currActiveEl.classList.remove('active');
    }
    newActiveEl.classList.add('active');
  },

  isNewActiveEl: function(labelEl, searchHash) {
    if (labelEl.hash === searchHash) {
      return labelEl;
    }
    return;
  },

  isCurrActiveEl: function(labelEl) {
    if (labelEls[i].classList.contains('active')) {
      return labelEl;
    }
    return;
  },

  menuLoopRecursive: function(parentMenu, menuItems) {
    parentMenu.innerHTML = ''; // Clean the div in case it was pre-existing.

    for (var i = 0; i < menuItems.length; i++) {
      var item = menuItems[i];
      var menuItemEl = this.makeMenuItemEl(item);
      parentMenu.appendChild(menuItemEl);

      if (item.childMenuItems) {
        var childMenu = this.setupChildMenuEl(menuItemEl);        
        this.menuLoopRecursive(childMenu, item.childMenuItems); // Run recursively for childMenuItems
      }
    }
  },

  makeMenuItemEl: function(item) {
    // <li class="menu-item"> 
    //    <a class="menu-label" href="{{ item.href }}"> 
    //      {{ item.label }} 
    //    </a> 
    // </li>
    var liEl      = this.docUtil.makeElWithClass('li', 'menu-item');
    var anchorEl  = this.docUtil.makeElWithClass('a', 'menu-label');
    
    anchorEl.href = item.href;
    anchorEl.appendChild(document.createTextNode(item.label));

    liEl.appendChild(anchorEl);
    return liEl;
  },

  setupChildMenuEl: function(parentMenuItemEl) {
    var childMenu = this.docUtil.makeElWithClass('ul', 'child-menu');
    var childMenuMark = this.docUtil.makeElWithClass('span', 'child-menu-mark');

    parentMenuItemEl.appendChild(childMenuMark); // Add a UI marker
    parentMenuItemEl.appendChild(childMenu);     // Add a <ul> element

    return childMenu; // Return <ul> element
  }
};
