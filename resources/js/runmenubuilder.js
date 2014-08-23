var menuBuilder = new MenuBuilder();
menuBuilder.setMenuEl('menu-button');
menuBuilder.initHashChangeHandler('hash-change-notifier');
menuBuilder.buildMenu(menuJSON);