angular.module('ui.router.menu', ["ui.router"])
    .provider("routerMenuProvider", [function () {
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
                throw "Main state already not registered. One there should be; no more, no less.";
            }
            //todo wrapper on menu
            return main;
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

                listeners.forEach(emit);
            }

            function emit(listener) {
                listener.call(listener, event.source);
            }

        }
    }]);