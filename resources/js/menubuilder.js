// Build a dynamic menu based on an arbitrary JSON object.

// MenuBuilder also has a prototype.
var MenuBuilder = function(optionsHash) {
  // -----------------------
  // -- PRIVATE VARIABLES --
  // -----------------------
  // Use the provided options from `optionsHash` or fall back to defaults.
  var _menuJSON = optionsHash.menuJSON; // menuJSON is required.
  var _options = {
    menuContainerId : optionsHash.menuContainerId || 'menu-button',
    hashChangeId :    optionsHash.hashChangeIdl   || 'hash-change-notifier'
  };
  // Helpers
  var _hashChangeHandlerInitialized = false;  // Help prevent redundant/multiple event handlers
  var _topMenuElId = this.docUtil.makeUniqueId('top-menu-'); // Prevent redundant els

  // Elements: Create the top <ul> element.
  var _topMenuEl       = this.docUtil.makeElWithIdAndClass('ul', _topMenuElId, 'top-menu'); // Created new 

  // Elements: Get existing container elements or create new elements
  var _menuContainerEl = this.docUtil.getOrCreateById(_options.menuContainerId, 'div');
  var _hashChangeEl    = this.docUtil.getOrCreateById(_options.hashChangeId, 'div', 'pulse');

  // --------------------
  // -- SETTER/GETTERS --
  // ---------------------
  this.menuJSON = function() {
    return _menuJSON;
  };

  this.isHashChangeHandlerInitialized = function(opt_setTo) {
    if (opt_setTo) {
      _hashChangeHandlerInitialized = opt_setTo;
    } else {
      return _hashChangeHandlerInitialized;
    }
  };

  this.el = function() {
    return _topMenuEl;
  };

  this.menuContainerEl = function(opt_el) {
    if (opt_el) {
      _menuContainerEl = opt_el;
      return this; // For chaining.
    } else {
      return _menuContainerEl;
    }
  };

  this.hashChangeEl = function(opt_el) {
    if (opt_el) {
      _hashChangeEl = opt_el;
      return this; // For chaining.
    } else {
      return _hashChangeEl;
    }
  };
};

MenuBuilder.prototype = {
  docUtil: new DocumentUtility(),
    
  build: function() {
    // Create the menu from the JSON object, and append it to the container.
    this.menuLoopRecursive(this.el(), this.menuJSON().menuItems);
    this.menuContainerEl().appendChild(this.el());

    // If we currently have a hash path, set the active menu item.
    if (this.docUtil.getHashPath()) {
      this.setActiveMenuItem(this.docUtil.getHashPath());
    }

    // Add the hash change handler for to being fancy.
    this.initHashChangeHandler();

    return this;
  },

  menuLoopRecursive: function(parentMenuEl, menuItems) {
    parentMenuEl.innerHTML = ''; // Clean the div in case it was pre-existing.

    for (var i = 0; i < menuItems.length; i++) {
      var currItem = menuItems[i];
      var menuItemEl = this.makeMenuItemEl(currItem);
      parentMenuEl.appendChild(menuItemEl);

      if (currItem.childMenuItems) {
        var childMenuEl = this.setupChildMenuEl(menuItemEl);        
        this.menuLoopRecursive(childMenuEl, currItem.childMenuItems); // Run recursively for childMenuItems
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
    var childMenuEl   = this.docUtil.makeElWithClass('ul', 'child-menu');
    var childMenuMark = this.docUtil.makeElWithClass('span', 'child-menu-mark');

    parentMenuItemEl.appendChild(childMenuMark); // Add a UI marker
    parentMenuItemEl.appendChild(childMenuEl);   // Add a <ul> element

    return childMenuEl; // Return <ul> element
  },

  setActiveMenuItem: function(searchHash) {
    var labelEls = this.docUtil.getByClassName('menu-label');
    var prevActiveEl;
    var newActiveEl;

    // Find the `newActiveEl` and `currentActiveEl`
    for (var i = 0; i < labelEls.length; i++) {
      if (!newActiveEl) { // If we haven't found it yet.
        newActiveEl = this.isNewActiveEl(labelEls[i], searchHash);
      }
      if (!prevActiveEl) { // If we haven't found it yet.
        prevActiveEl = this.isPrevActiveEl(labelEls[i]);
      }
    }

    if (prevActiveEl) {
      prevActiveEl.classList.remove('active');
    }
    newActiveEl.classList.add('active');
  },

  isNewActiveEl: function(labelEl, searchHash) {
    if (labelEl.hash === searchHash) {
      return labelEl;
    }
    return;
  },

  isPrevActiveEl: function(labelEl) {
    if (labelEl.classList.contains('active')) {
      return labelEl;
    }
    return;
  },

  initHashChangeHandler: function() {
    // Only do the work if needed, no redundant handlers.
    if (this.isHashChangeHandlerInitialized()) {
      return;
    }
    this.isHashChangeHandlerInitialized(true);

    // Don't prevent any other onhashchange handlers from doing their job.
    var prevHashChangeHandler;
    if (window.onhashchange) {
      prevHashChangeHandler = window.onhashchange;
    }

    var _this = this;
    window.onhashchange = function() {      
      _this.cloneAndReplaceHashChangeEl(); // Re-trigger CSS Animation on notifier.
      _this.setActiveMenuItem(_this.docUtil.getHashPath()); // Set css for 'active' menu item.

      if (prevHashChangeHandler !== undefined) {
        prevHashChangeHandler(); // If we have a previous handler, call that too.
      }
    };

    return this;
  },

  cloneAndReplaceHashChangeEl: function() {
    // Do some DOM Element gymnastics so we can re-trigger the CSS animation:
    var oldEl = this.hashChangeEl(); // Get it
    var newEl = oldEl.cloneNode(true); // Clone it
    newEl.textContent = ''; // Clear out the Clone, then change contents
    newEl.appendChild(document.createTextNode('Navigated to: ' + this.docUtil.getHashPath()));

    oldEl.parentNode.replaceChild(newEl, oldEl); // Replace old with new.
    this.hashChangeEl(newEl); // Re-set the MenuBuilder's reference to the newEl.
    return this;
  }
};
