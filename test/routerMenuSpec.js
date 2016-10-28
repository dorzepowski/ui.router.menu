describe("UI Router Menu:", function () {
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

    describe("when registering only main state", function () {
        var mainState;

        beforeEach(function () {
            mainState = {
                name: "main",
                menu: {mainState: true}
            };
            stateRegistryProvider.state(mainState);
        });

        it('should call stateProvider state', function () {
            expect($stateProvider.state.calls.count()).toBe(1);
        });

        it("main state should be in $state service", function () {
            var $state = $injector.get("$state");
            expect($state.get("main")).toBeDefined();
            expect($state.get("main")).toBe(mainState);
        })
    });

    describe("when registering states nested", function () {

        describe("in main state", function () {
            var mainState;

            beforeEach(function () {
                mainState = {
                    name: "main",
                    menu: {mainState: true},
                    children: [
                        {name: "child0"},
                        {name: "child1"},
                        {name: "child2"}
                    ]
                };
                stateRegistryProvider.state(mainState);
            });

            it("than main state should be in $state service", function () {
                var $state = $injector.get("$state");
                expect($state.get("main")).toBe(mainState);
            });

            it("than children states should be in $state service", function () {
                var $state = $injector.get("$state");
                expect($state.get("main.child0")).toBe(mainState.children[0]);
                expect($state.get("main.child1")).toBe(mainState.children[1]);
                expect($state.get("main.child2")).toBe(mainState.children[2]);
            })
        });


        //describe("in root state ")
    })
});