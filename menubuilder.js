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
}