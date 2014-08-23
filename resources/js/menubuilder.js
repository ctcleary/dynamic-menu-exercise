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
        }
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
}


// Establish menuBuilder object.
var MenuBuilder = function() {
  return {
    // Store a reference.
    menuContainer : undefined,
    loopDepth : -1,

    setMenuEl : function(id) {
      if (this.menuContainer === undefined) {
        this.menuContainer = document.getElementById(id);
      }
    },
    
    buildMenu : function(menuJSON) {
      console.log(menuJSON);

      var topMenu = this.makeEl('ul', 'topMenu', 'topMenu');
      this.menuContainer.appendChild(topMenu);

      this.menuLoopRecursive(topMenu, menuJSON.menuItems);
    },

    makeEl : function(type, className, id) {
      var el = document.createElement(type);
      if (typeof className !== 'undefined') { el.classList.add(className); }
      if (typeof id !== 'undefined') { el.id = id; }
      return el;
    },

    menuLoopRecursive : function(parentMenu, menuItems) {
      this.loopDepth++; // Track loop depth in case we need it later.
      console.log('Curr loopDepth : ', this.loopDepth);

      for (var i = 0; i < menuItems.length; i++) {
        var item = menuItems[i];

        var liEl = this.makeEl('li', 'menuItem');
        var anchorEl = this.makeEl('a', 'menuLabel');
        anchorEl.href = item.href;

        var anchorText = document.createTextNode(item.label);
        anchorEl.appendChild(anchorText);

        liEl.appendChild(anchorEl);
        parentMenu.appendChild(liEl);

        if (item.childMenuItems) {
          var childMenuMark = this.makeEl('span', 'childMenuMark');
          liEl.appendChild(childMenuMark);

          var childMenu = this.makeEl('ul', 'childMenu');
          liEl.appendChild(childMenu);

          this.menuLoopRecursive(childMenu, item.childMenuItems);
        }
      }

      this.loopDepth--;
    },

    initHashChangeHandler : function(elementId) {
      var prevHashChangeHandler;
      if (window.onhashchange) {
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
      }
    }
  }
};


