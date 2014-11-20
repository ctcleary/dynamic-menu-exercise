// Build a dynamic menu based on an arbitrary JSON object.

// MenuBuilder also has a prototype.
var MenuBuilder = function(optionsHash) {

  // -- PRIVATE VARIABLES --

  // OPTIONS
  // Use the provided options from `optionsHash` or fall back to defaults.
  var _menuJSON = optionsHash.menuJSON; // menuJSON is required.
  var _options = {
    menuContainerId : optionsHash.menuContainerId || this.DocUtil.makeUniqueId('menu-button-'),
    hashChangeId :    optionsHash.hashChangeId    || this.DocUtil.makeUniqueId('hash-change-notifier-')
  };

  // ELEMENTS
  // Get existing container elements OR create new elements dynamically
  var _menuContainerEl = this.DocUtil.getOrCreateById(_options.menuContainerId, 'div', 'menu-button');
  var _hashChangeEl    = this.DocUtil.getOrCreateById(_options.hashChangeId, 'div', 'pulse');

  // Make sure container has an icon.
  if (!this.hasIconTag(_menuContainerEl)) {
    _menuContainerEl.appendChild(this.DocUtil.makeEl('i'));
  }

  // Create the top <ul> element.
  var _topMenuElId     = this.DocUtil.makeUniqueId('top-menu-'); // Prevent redundant els
  var _topMenuEl       = this.DocUtil.makeElWithIdAndClass('ul', _topMenuElId, 'top-menu'); // Created new 

  // HELPER(S)
  var _hashChangeHandlerInitialized = false;  // Helper: prevent redundant/multiple event handlers
  var _labelEls = []; // Optimization


  // -- SETTER/GETTERS --

  this.el = function() {
    return _topMenuEl;
  };

  this.menuJSON = function() {
    return _menuJSON;
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

  this.labelEls = function(opt_reassess) {
    // Gather this array only when needed.
    if (opt_reassess || _labelEls.length === 0) {
      _labelEls = this.DocUtil.getDescendantsByClassName(this.el(), 'menu-label');
    }
    return _labelEls;
  };

  this.isHashChangeHandlerInitialized = function(opt_setTo) {
    if (opt_setTo) {
      _hashChangeHandlerInitialized = opt_setTo;
    } else {
      return _hashChangeHandlerInitialized;
    }
  };
};

MenuBuilder.prototype = {
  DocUtil: new DocumentUtility(),
    
  build: function() {
    // Create the menu from the JSON object, and append it to the container.
    this.menuLoopRecursive(this.el(), this.menuJSON().menuItems);
    this.menuContainerEl().appendChild(this.el());

    // If we currently have a hash path, set the active menu item.
    if (this.DocUtil.getHashPath()) {
      this.setActiveMenuItem(this.DocUtil.getHashPath());
    }

    // Add the hash change handler for to being fancy.
    this.initHashChangeHandler();

    // Re-assess our labelEls array
    this.labelEls(true);

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
    var liEl      = this.DocUtil.makeElWithClass('li', 'menu-item');
    var anchorEl  = this.DocUtil.makeElWithClass('a', 'menu-label');
    
    anchorEl.href = item.href;
    anchorEl.appendChild(document.createTextNode(item.label));

    liEl.appendChild(anchorEl);
    return liEl;
  },

  setupChildMenuEl: function(parentMenuItemEl) {
    var childMenuMarkEl = this.DocUtil.makeElWithClass('span', 'child-menu-mark');
    parentMenuItemEl.appendChild(childMenuMarkEl); // Add a UI marker

    var childMenuEl   = this.DocUtil.makeElWithClass('ul', 'child-menu'); // Create the <ul> el
    parentMenuItemEl.appendChild(childMenuEl); // Add the <ul> el
    return childMenuEl; // Return the <ul> el
  },

  setActiveMenuItem: function(searchHash) {
    var labelEls = this.labelEls();
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
    if (newActiveEl) { // In case current hash is on another MenuBuilder instance
      newActiveEl.classList.add('active');
      return true;
    }
    return false;
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
    if (this.isHashChangeHandlerInitialized()) {
      return; // Only do the work if needed, no redundant handlers.
    }
    this.isHashChangeHandlerInitialized(true);

    var prevHashChangeHandler; // Don't prevent any other onhashchange handlers from doing their job.
    if (window.onhashchange) {
      prevHashChangeHandler = window.onhashchange;
    }

    var _this = this;
    window.onhashchange = function() {      
      var thisHasNewActive = _this.setActiveMenuItem(_this.DocUtil.getHashPath()); // Set css for 'active' menu item.
      if (thisHasNewActive) {
        _this.cloneAndReplaceHashChangeEl(); // Re-trigger CSS Animation on notifier.
      }

      if (prevHashChangeHandler !== undefined) {
        prevHashChangeHandler(); // If we have a previous handler, call that too.
      }
    };

    return this;
  },

  cloneAndReplaceHashChangeEl: function() {
    var oldEl = this.hashChangeEl(); // Get it
    if (!oldEl.parentNode) {
      // This MenuBuilder's hashChangeEl was never appended to the document.
      return;
    }

    // Do some DOM Element gymnastics so we can re-trigger the CSS animation:
    // Remove the el and remove the 'pulse' class, 
    var parentNode = oldEl.parentNode;
    parentNode.removeChild(oldEl);
    oldEl.classList.remove('pulse');

    oldEl.textContent = ''; // Clear out the Clone, then change contents
    oldEl.appendChild(document.createTextNode('Navigated to: ' + this.DocUtil.getHashPath()));
    
    // Then re-add the el and the 'pulse' class to re-trigger the animation.
    parentNode.appendChild(oldEl);
    oldEl.classList.add('pulse');

    return this;
  },

  hasIconTag: function(menuContainerEl) {
    return menuContainerEl.children[0] &&
      menuContainerEl.children[0].tagName.toLowerCase() === "i";
  }
};
