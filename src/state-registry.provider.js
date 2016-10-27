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
            /**
             * Make root state to be main application state -> all states registered will be attached to it
             * There could be only one mainState, otherwise error would be rised
             * Equivalent to state property menu.mainState = true
             */
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
                service.addMainAsParent = !isMain() ? addMainAsParent : omit;
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
                return angular.merge({}, options, state[STATE_OPTS] || {});
            }

            function attachParent() {
                state.parent = options.parent;
            }

            function isMain() {
                return stateOpts.mainState;
            }

            function isChild() {
                return !stateOpts.isRoot;
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
                if (!state.name.startsWith(mainName)) {
                    state.name = mainName + "." + state.name;
                }
            }

            function registerState() {
                $stateProvider.state(state);
            }

            function processChildrens() {

                var children = state.children;
                if (children && children.length) {
                    var childOpts = prepareChildOpts();
                    children.forEach(function (childState) {
                        register(childState, childOpts);
                    });
                }
            }

            function prepareChildOpts() {
                angular.merge({}, options, createChildrenOptsDefault())
            }

            function createChildrenOptsDefault() {
                return {
                    parent: state,
                    isRoot: false,
                    mainState: false
                };
            }


            function omit() {
            }
        }


    }]);