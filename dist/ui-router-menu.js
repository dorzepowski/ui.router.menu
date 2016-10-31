(function () {
    angular.module('ui.router.menu', ["ui.router"]);
})();
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
                throw "Main state already not registered. One there should be; no more, no less.";
            }
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
                event.raised = true;
                listeners.forEach(emit);
            }

            function emit(listener) {
                listener.apply(listener, event.source);
            }

        }
    }]);
angular.module('ui.router.menu')
    .provider("stateRegistry", ["$stateProvider", "routerMenuProvider", function ($stateProvider, routerMenuProvider) {
        var STATE_OPTS = "menu";

        var _this = this;
        _this.$get = angular.noop;
        _this.state = registerState;

        function registerState(state, options) {
            var opts = prepareOptions(options);
            register(state, opts);
            return _this;
        }


        function prepareOptions(options) {
            return angular.merge({}, DEFAULT_OPTIONS, options, {isRoot: true});
        }


        var DEFAULT_OPTIONS = {
            mainState: false

        };


        function register(state, options) {
            var stateOpts = prepareStateOptions();
            var service = configure({});
            return service.process();


            function configure(service) {
                service.process = process;
                service.attachParent = isChild() ? attachParent : omit;
                service.registerMain = isMain() ? registerMain : omit;
                service.prepareStateName = prepareStateName;
                service.addMainAsParent = !isMain() && isRoot() ? addMainAsParent : omit;
                service.applyMainName = !isMain() ? applyMainName : omit;
                service.registerState = registerState;
                service.processChildrens = processChildrens;
                return service;
            }

            function process() {
                service.attachParent();
                service.registerMain();
                service.prepareStateName();
                onMainSet(
                    service.addMainAsParent,
                    service.applyMainName,
                    service.registerState
                );
                service.processChildrens();
            }

            function prepareStateOptions() {
                var parent = options.parent;
                delete options["parent"];
                var stateOptions = angular.merge({}, options, state[STATE_OPTS] || {});
                stateOptions.parent = parent;
                return stateOptions;
            }

            function attachParent() {
                state.parent = stateOpts.parent;
            }

            function isMain() {
                return stateOpts.mainState;
            }

            function isChild() {
                return !isRoot();
            }

            function isRoot() {
                return stateOpts.isRoot;
            }

            function registerMain() {
                routerMenuProvider.setMain(state);
            }

            function prepareStateName() {
                if (state.parent) {
                    state.name = (angular.isObject(state.parent) ? state.parent.name : state.parent) + '.' + state.name;
                }
            }

            function onMainSet(addMainAsParent, applyName, registerState) {
                routerMenuProvider.whenMainSet().then(handleMainSet);

                function handleMainSet(mainName, mainState) {
                    addMainAsParent(mainState);
                    applyName(mainName);
                    registerState(state);
                }
            }

            function addMainAsParent(main) {
                state.parent = main;
            }

            function applyMainName(mainName) {
                if (!hasMainNameApplied(mainName)) {
                    state.name = mainName + "." + state.name;
                }
            }

            function hasMainNameApplied(mainName) {
                return state.name.indexOf(mainName) == 0;
            }

            function registerState() {
                $stateProvider.state(state);
            }

            function processChildrens() {
                var children = state.children;
                if (children && children.length) {
                    children.forEach(function (childState) {
                        register(childState, prepareChildOpts());
                    });
                }
            }

            function prepareChildOpts() {
                delete options["parent"];
                var childOpts = angular.merge({}, options, createChildrenOptsDefault());
                childOpts.parent = state;
                return childOpts;
            }

            function createChildrenOptsDefault() {
                return {
                    isRoot: false,
                    mainState: false
                };
            }


            function omit() {
            }
        }


    }]);