// Create an example JSON object that might be returned from an endpoint.
var menuJSON = {
  menuItems: [{
    label: 'Game',
    href: '#game',
    childMenuItems: [{
      label: 'Game Child 1',
      href: '#game-child-1'
    }, {
      label: 'Game Child 2',
      href: '#game-child-2'
    }]
  }, {
    label: 'Community',
    href: '#community'
  }, {
    label: 'Media',
    href: '#media',
    childMenuItems: [{
      label: 'Media Child 1',
      href: '#media-child-1'
    }, {
      label: 'Media Child 2',
      href: '#media-child-2'
    }, {
      label: 'Media Child 3',
      href: '#media-child-3'
    }, {
      label: 'Media Child 4',
      href: '#media-child-4'
    }, {
      label: 'Media Child 5',
      href: '#media-child-5'
    }, {
      label: 'Media Child 6',
      href: '#media-child-6'
    }, ]
  }, {
    label: 'Forums',
    href: '#forums',
    childMenuItems: [{
      label: 'Gameplay',
      href: '#gameplay',
      childMenuItems: [{
        label: 'Gameplay Child 1',
        href: '#gameplay-child-1'
      }, {
        label: 'Gameplay Child 2',
        href: '#gameplay-child-2'
      }]
    }, {
      label: 'Classes',
      href: '#classes',
      childMenuItems: [{
        label: 'Barbarian',
        href: '#barbarian'
      }, {
        label: 'Demon Hunter',
        href: '#demon-hunter'
      }, {
        label: 'Monk',
        href: '#monk'
      }, {
        label: 'Witch Doctor',
        href: '#witch-doctor'
      }, {
        label: 'Wizard',
        href: '#wizard'
      }]
    }, {
      label: 'Beta',
      href: '#beta',
      childMenuItems: [{
        label: 'Beta Child 1',
        href: '#beta-child-1'
      }, {
        label: 'Beta Child 2',
        href: '#beta-child-2'
      }]
    }, {
      label: 'Support',
      href: '#support',
      childMenuItems: [{
        label: 'Support Child 1',
        href: '#support-child-1'
      }, {
        label: 'Support Child 2',
        href: '#support-child-2'
      }]
    }]
  }, {
    label: 'Services',
    href: '#services'
  }]
};

// Create and build the actual menu.
var menuBuilder = new MenuBuilder({
  menuJSON: menuJSON,
  menuContainerId: 'menu-button', // Existing element id
  hashChangeId: 'hash-change-notifier' // Existing element id
});
// Since we've added an existing element as the container,
// all we need to do is run .build() and the cascading menu will
// append itself to the '#menu-button' element.
menuBuilder.build();


// Example alternate usage.
var menuJSON2 = {
  menuItems: [{
    label: 'An Example Of',
    href: '#an-example-of'
  }, {
    label: 'Alternate',
    href: '#alternate'
  }, {
    label: 'Usage',
    href: '#usage',
    childMenuItems: [{
      label: 'Usage Child 1',
      href: '#usage-child-1'
    }, {
      label: 'Usage Child 2',
      href: '#usage-child-2'
    }]
  }, ]
};

// No existing menuContainer.
var menuBuilder2 = new MenuBuilder({
  menuJSON: menuJSON2,
  hashChangeId: 'hash-change-notifier' // Existing element id
});
menuBuilder2.build();
var menuBuilder2Container = menuBuilder2.menuContainerEl();
document.getElementById('menu-container-bar').appendChild(menuBuilder2Container);
