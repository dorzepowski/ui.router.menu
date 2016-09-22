angular.module('ui.router.menu', ["ui.router"])
    .provider("routerMenuProvider", [function () {
        var emitMainRegistered = null;
        var promiseMainSet = new Promise(function (resolve) {
            emitMainRegistered = resolve;
        });


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
            return promiseMainSet;
        }


        function createMenu() {
            if (!main) {
                throw "Main state already not registered. One there should be; no more, no less.";
            }
            //todo wrapper on menu
            return main;
        }
    }]);