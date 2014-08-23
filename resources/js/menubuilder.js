// Build a dynamic menu based on an arbitrary JSON object.

// Create an example JSON object that might be returned from an endpoint.
var menuJSON = {
  menuItems : [
    {
      label : 'Game',
      href  : '#game',
      childMenuItems : [
        {
          label : 'Game Child 1',
          href  : '#game-child-1'
        },
        {
          label : 'Game Child 2',
          href  : '#game-child-2'
        }
      ]
    },
    {
      label : 'Community',
      href  : '#community'
    },
    {
      label : 'Media',
      href  : '#media',
      childMenuItems : [
        {
          label : 'Media Child 1',
          href  : '#media-child-1'
        },
        {
          label : 'Media Child 2',
          href  : '#media-child-2'
        },
        {
          label : 'Media Child 3',
          href  : '#media-child-3'
        },
        {
          label : 'Media Child 4',
          href  : '#media-child-4'
        },
        {
          label : 'Media Child 5',
          href  : '#media-child-5'
        },
        {
          label : 'Media Child 6',
          href  : '#media-child-6'
        },
      ]
    },
    {
      label : 'Forums',
      href  : '#forums',
      childMenuItems : [
        {
          label : 'Gameplay',
          href  : '#gameplay',
          childMenuItems : [
            {
              label : 'Gameplay Child 1',
              href  : '#gameplay-child-1'
            },
            {
              label : 'Gameplay Child 2',
              href  : '#gameplay-child-2'
            }
          ]
        },
        {
          label : 'Classes',
          href  : '#classes',
          childMenuItems : [
            {
              label : 'Barbarian',
              href  : '#barbarian'
            },
            {
              label : 'Demon Hunter',
              href  : '#demon-hunter'
            },
            {
              label : 'Monk',
              href  : '#monk'
            },
            {
              label : 'Witch Doctor',
              href  : '#witch-doctor'
            },
            {
              label : 'Wizard',
              href  : '#wizard'
            }
          ]
        },
        {
          label : 'Beta',
          href  : '#beta',
          childMenuItems : [
            {
              label : 'Beta Child 1',
              href  : '#beta-child-1'
            },
            {
              label : 'Beta Child 2',
              href  : '#beta-child-2'
            }
          ]
        },
        {
          label : 'Support',
          href  : '#support',
          childMenuItems : [
            {
              label : 'Support Child 1',
              href  : '#support-child-1'
            },
            {
              label : 'Support Child 2',
              href  : '#support-child-2'
            }
          ]
        }
      ]
    },
    {
      label : 'Services',
      href  : '#services'
    }
  ]
};


// Establish MenuBuilder object.
var MenuBuilder = function() {
  return {
    // Store a reference.
    menuContainer : undefined,

    // Start at -1 so the first loop is a depth of 0.
    loopDepth : -1,

    // Must set a container element -- a menu button, most likely --
    // before building the menu.
    setMenuEl : function(id) {
      if (this.menuContainer === undefined && typeof id === 'string') {
        this.menuContainer = document.getElementById(id);
      }
    },
    
    buildMenu : function(menuJSON) {
      if (!this.menuContainer) {
        console.warn('Must use setMenuEl( elementId ); before building the menu!');
        return;
      }

      var topMenu = this._makeEl('ul', 'topMenu', 'topMenu');
      this.menuContainer.appendChild(topMenu);

      this._menuLoopRecursive(topMenu, menuJSON.menuItems);
    },

    initHashChangeHandler : function(elementId) {
      var prevHashChangeHandler;
      if (window.onhashchange) {
        // Make sure we don't prevent any other onhashchange handlers
        // from doing their job by storing and calling previous handlers.
        prevHashChangeHandler = window.onhashchange;
      }
      window.onhashchange = function() {
        if (prevHashChangeHandler !== undefined) {
          prevHashChangeHandler();
        }
        var newHash = window.location.valueOf().hash;

        var hashChangeEl = document.getElementById('hash-change-notifier');
        hashChangeEl.textContent = '';
        hashChangeEl.appendChild(document.createTextNode('Navigated to: ' + newHash));
      };
    },

    // Private Functions
    // -- Use `_` prefix to indicate "Private" functions.

    // parentMenu : A `ul` or `ol` dom element.
    // menuItems  : An array of JSON objects keys: 'label', 'href', 'childMenuItems' (optional). 
    _menuLoopRecursive : function(parentMenu, menuItems) {
      this.loopDepth++; // Track loop depth in case we need it later.

      for (var i = 0; i < menuItems.length; i++) {
        var item = menuItems[i];

        var liEl = this._makeEl('li', 'menuItem');
        var anchorEl = this._makeEl('a', 'menuLabel');
        anchorEl.href = item.href;

        var anchorText = document.createTextNode(item.label);
        anchorEl.appendChild(anchorText);

        liEl.appendChild(anchorEl);
        parentMenu.appendChild(liEl);

        if (item.childMenuItems) {
          // If this menu has childMenuItems, add a <ul> element
          // then recursively run _menuLoopRecursive to populate the childMenu.

          var childMenuMark = this._makeEl('span', 'childMenuMark');
          liEl.appendChild(childMenuMark);

          var childMenu = this._makeEl('ul', 'childMenu');
          liEl.appendChild(childMenu);
          
          this._menuLoopRecursive(childMenu, item.childMenuItems);
        }
      }

      this.loopDepth--;
    },

    _makeEl : function(type, className, id) {
      if (typeof type === 'undefined') {
        console.warn('Must provide an element type to MenuBuilder._makeEl()');
        return;
      }

      var el = document.createElement(type);
      if (typeof className !== 'undefined') { el.classList.add(className); }
      if (typeof id !== 'undefined') { el.id = id; }
      return el;
    }
  };
};


