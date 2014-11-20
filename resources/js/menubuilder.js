// Build a dynamic menu based on an arbitrary JSON object.

// MenuBuilder also has a prototype.
var MenuBuilder = function(optionsHash) {

  // -- PRIVATE VARIABLES --

  // OPTIONS
  // Use the provided options from `optionsHash` or fall back to defaults.
  var _menuJSON = optionsHash.menuJSON; // menuJSON is required.
  var _options = {
    menuContainerId: optionsHash.menuContainerId || this.DocUtil.makeUniqueId('menu-button-'),
    hashChangeId: optionsHash.hashChangeId || this.DocUtil.makeUniqueId('hash-change-notifier-')
  };

  // ELEMENTS
  // Get existing container elements OR create new elements dynamically
  var _menuContainerEl = this.DocUtil.getOrCreateById(_options.menuContainerId, 'div', 'menu-button');
  var _hashChangeEl = this.DocUtil.getOrCreateById(_options.hashChangeId, 'div', 'pulse');

  // Make sure container has an icon.
  if (!this.hasIconTag(_menuContainerEl)) {
    _menuContainerEl.appendChild(this.DocUtil.makeEl('i'));
  }

  // Create the top <ul> element.
  var _topMenuElId = this.DocUtil.makeUniqueId('top-menu-'); // Prevent redundant els
  var _topMenuEl = this.DocUtil.makeElWithIdAndClass('ul', _topMenuElId, 'top-menu'); // Created new 

  // HELPER(S)
  var _hashChangeHandlerInitialized = false; // Helper: prevent redundant/multiple event handlers
  var _labelEls = []; // Optimization, gather array of labelEls only when needed


  // -- GETTERS and SETTER/GETTERS --

  this.el = function() {
    return _topMenuEl;
  };

  this.menuJSON = function(opt_newMenuJSON) {
    if (opt_newMenuJSON) {
      _menuJSON = opt_newMenuJSON;
      return this; // For chaining.
    }
    return _menuJSON;
  };

  this.menuContainerEl = function(opt_el) {
    if (opt_el) {
      _menuContainerEl = opt_el;
      return this; // For chaining.
    }

    return _menuContainerEl;
  };

  this.hashChangeEl = function(opt_el) {
    if (opt_el) {
      _hashChangeEl = opt_el;
      return this; // For chaining.
    }

    return _hashChangeEl;
  };

  this.isHashChangeHandlerInitialized = function(opt_isInitialized) {
    if (opt_isInitialized) {
      _hashChangeHandlerInitialized = opt_isInitialized;
      return this;
    }

    return _hashChangeHandlerInitialized;
  };

  this.labelEls = function(opt_forceNewGet) {
    // Gather this array only when needed.
    if (opt_forceNewGet || _labelEls.length === 0) {
      _labelEls = this.DocUtil.getDescendantsByClassName(this.el(), 'menu-label');
    }
    return _labelEls;
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

    // Add the hash change handler for being fancy.
    this.initHashChangeHandler();

    // Re-assess our labelEls array
    this.labelEls(true);

    return this;
  },

  menuLoopRecursive: function(parentMenuEl, menuItems) {
    parentMenuEl.innerHTML = ''; // Clean the <ul> in case it was pre-existing.

    for (var i = 0; i < menuItems.length; i++) {
      var currItem = menuItems[i];
      var menuItemEl = this.makeMenuItemEl(currItem); // <li>
      parentMenuEl.appendChild(menuItemEl);

      if (currItem.childMenuItems) {
        var childMenuEl = this.setupChildMenuEl(menuItemEl); // <ul>
        this.menuLoopRecursive(childMenuEl, currItem.childMenuItems); // Run recursively for childMenuItems
      }
    }
  },

  makeMenuItemEl: function(itemData) {
    // <li class="menu-item"> 
    //    <a class="menu-label" href="{{ itemData.href }}"> 
    //      {{ itemData.label }} 
    //    </a> 
    // </li>
    var liEl = this.DocUtil.makeElWithClass('li', 'menu-item');
    var anchorEl = this.DocUtil.makeElWithClass('a', 'menu-label');

    anchorEl.href = itemData.href;
    anchorEl.appendChild(document.createTextNode(itemData.label));

    liEl.appendChild(anchorEl);
    return liEl;
  },

  setupChildMenuEl: function(parentMenuItemEl) {
    // <li class="menu-item">                       // `parentMenuItemEl`
    //    <a class="menu-label" href="...">...</a>
    //    <span class="child-menu-mark"></span>     // `childMenuMarkEl`
    //    <ul class="child-menu"></ul>              // `childMenuEl`
    // </li>
    var childMenuMarkEl = this.DocUtil.makeElWithClass('span', 'child-menu-mark');
    var childMenuEl = this.DocUtil.makeElWithClass('ul', 'child-menu');

    parentMenuItemEl.appendChild(childMenuMarkEl); // Add a UI marker to the parent <li>
    parentMenuItemEl.appendChild(childMenuEl);     // Add the <ul> el
    return childMenuEl;                            // Return the <ul> el
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
    if (newActiveEl) {
      newActiveEl.classList.add('active');
      return true; // Yes, the new active is in this instance of MenuBuilder
    }
    return false; // The new active is NOT in this instance of MenuBuilder
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
      // Only do the work if needed, no redundant handlers.
      return this;
    }
    this.isHashChangeHandlerInitialized(true); // Set true.

    var prevHashChangeHandler; // Don't prevent other handlers from doing their job.
    if (window.onhashchange) {
      prevHashChangeHandler = window.onhashchange;
    }

    var _this = this;
    window.onhashchange = function() {
      var thisInstanceHasNewActive = _this.setActiveMenuItem(_this.DocUtil.getHashPath());
      if (thisInstanceHasNewActive) {
        _this.restartHashChangeCSSAnimation(); // Re-trigger CSS Animation on notifier.
      }

      if (prevHashChangeHandler !== undefined) {
        prevHashChangeHandler(); // If we have a previous handler, call that too.
      }
    };

    return this;
  },

  restartHashChangeCSSAnimation: function() {
    var hashChangeEl = this.hashChangeEl(); // Get it
    if (!hashChangeEl.parentNode) {
      // This MenuBuilder's hashChangeEl was never appended to the document.
      return this;
    }

    // Do some DOM Element gymnastics so we can re-trigger the CSS animation:
    // Remove the el and re-add it to trigger reflow, which restarts the CSS animation.

    // Remove the el.
    var parentNode = hashChangeEl.parentNode;
    parentNode.removeChild(hashChangeEl);

    // Update contents.
    hashChangeEl.textContent = '';
    hashChangeEl.appendChild(document.createTextNode('Navigated to: ' + this.DocUtil.getHashPath()));

    // Then re-add the el
    parentNode.appendChild(hashChangeEl);

    return this;
  },

  hasIconTag: function(menuContainerEl) {
    return menuContainerEl.children[0] &&
      menuContainerEl.children[0].tagName.toLowerCase() === "i";
  }
};
