describe("UI Router Menu", function () {
    var stateRegistryProvider, $stateProvider, rootState, expectedState;

    var $injector;

    beforeEach(module('ui.router.menu', function (_stateRegistryProvider_, _$stateProvider_) {
        stateRegistryProvider = _stateRegistryProvider_;
        $stateProvider = _$stateProvider_;
    }));

    beforeEach(inject(function (_$injector_) {
        $injector = _$injector_;
        spyOn($stateProvider, 'state').and.callThrough();
    }));

    describe("API", function () {
        it("should support chaining", function () {
            expect(stateRegistryProvider.state({name: "dummy"})).toBe(stateRegistryProvider);
        })
    });

    describe("Main state", function () {
        var mainState;

        beforeEach(inject(function () {
            mainState = {
                name: "main",
                menu: {mainState: true}
            };
            stateRegistryProvider.state(mainState);
        }));

        it('should call stateProvider state', function () {
            expect($stateProvider.state.calls.count()).toBe(1);
        });

        it("shoud register main in $stateProvider", function () {
            var $state = $injector.get("$state");
            expect($state.get("main")).toBeDefined();
            expect($state.get("main")).toBe(mainState);
        })
    })
});