angular.module('ui.router.menu', ["ui.router"])
    .provider("stateRegistry", ["$stateProvider", function ($stateProvider) {
        var _this = this;
        _this.$get = angular.noop;
        _this.state = registerState;

        function registerState(state) {
        }


    }]);
