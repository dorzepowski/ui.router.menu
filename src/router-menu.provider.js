angular.module('ui.router.menu')
    .provider("routerMenu", [function () {
        var mainSetEvent = new MainSetEvent();
        var emitMainRegistered = mainSetEvent.fire;


        var $this = this;
        $this.setMain = setMain;
        $this.whenMainSet = whenMainSet;
        $this.$get = createMenu;

        var main;
        var menu = {};


        function setMain(state) {
            validateMainRegistration();
            main = state;
            emitMainRegistered(state.name, state);


            function validateMainRegistration() {
                if (main) {
                    throw "Main state already registered (" + main.name + "). One there should be; no more, no less.";
                }
            }
        }

        function whenMainSet() {
            return mainSetEvent;
        }


        function createMenu() {
            if (!main) {
                throw "Main state not registered. One there should be; no more, no less.";
            }
            return new MenuService(main);
        }

        function MainSetEvent() {
            var event = this;
            event.then = then;
            event.fire = fire;
            event.raised = false;
            event.source = null;

            var listeners = [];


            function then(listener) {
                if (event.raised) {
                    emit(listener);
                }
                listeners.push(listener);
                return event;
            }

            function fire() {
                event.source = Array.prototype.slice.call(arguments);
                event.raised = true;
                listeners.forEach(emit);
            }

            function emit(listener) {
                listener.apply(listener, event.source);
            }

        }

        function MenuService(mainState) {
            var menuCache = {initialized: false};
            var $this = this;
            Object.defineProperty($this, "items", {
                get: function () {
                    if (!menuCache.initialized) {
                        menuCache.items = createMenuItems(mainState);
                    }
                    return menuCache.items;
                }
            });

            function createMenuItems(state) {
                var items = state.children ? state.children : [];
                return items.map(setupIsItem).map(createItem).filter(nonEmpty);
            }

            function setupIsItem(state) {
                if (!state.menu) {
                    state.menu = {};
                }
                if (state.menu.isItem === undefined) {
                    state.menu.isItem = !state.abstract;
                }
                return state;
            }

            function createItem(state) {
                function isSuitableForMenuItem() {
                    return state.menu.isItem;
                }

                return isSuitableForMenuItem() ? new MenuItem(state) : undefined;
            }

            function nonEmpty(obj) {
                return obj != null;
            }
        }

        function MenuItem(state) {
            var $this = this;
            Object.defineProperty($this, "name", {get: getName});


            function getName() {
                return state.name;
            }
        }

    }]);