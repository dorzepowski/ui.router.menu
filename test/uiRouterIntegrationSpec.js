describe("UI router integration:", function () {
    var stateRegistryProvider, $stateProvider;

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
            var $state;

            beforeEach(function () {
                mainState = {
                    name: "main",
                    menu: {mainState: true},
                    children: [
                        {name: "child0", children: [{name: "subchild0"}, {name: "subchild1"}]},
                        {name: "child1", children: [{name: "subchild0"}, {name: "subchild1"}]},
                        {name: "child2", children: [{name: "subchild0"}, {name: "subchild1"}]}
                    ]
                };
                stateRegistryProvider.state(mainState);
                $state = $injector.get("$state");
            });

            it("should main state be in $state service", function () {
                expect($state.get("main")).toBe(mainState);
            });

            it("should children states be in $state service", function () {
                expect($state.get("main.child0")).toBe(mainState.children[0]);
                expect($state.get("main.child1")).toBe(mainState.children[1]);
                expect($state.get("main.child2")).toBe(mainState.children[2]);
            });

            it("should children of children states be in $state service", function () {
                expect($state.get("main.child0.subchild0")).toBe(mainState.children[0].children[0]);
                expect($state.get("main.child1.subchild0")).toBe(mainState.children[1].children[0]);
                expect($state.get("main.child2.subchild0")).toBe(mainState.children[2].children[0]);
                expect($state.get("main.child0.subchild1")).toBe(mainState.children[0].children[1]);
                expect($state.get("main.child1.subchild1")).toBe(mainState.children[1].children[1]);
                expect($state.get("main.child2.subchild1")).toBe(mainState.children[2].children[1]);
            })
        });


        describe("in root state ", function () {
            var mainState;
            var rootState;
            var $state;

            beforeEach(function () {
                mainState = {
                    name: "main",
                    menu: {mainState: true}
                };

                rootState = {
                    name: "root",
                    children: [
                        {name: "child0"},
                        {name: "child1"},
                        {name: "child2"}
                    ]
                };
                stateRegistryProvider.state(mainState);
                stateRegistryProvider.state(rootState);
                $state = $injector.get("$state");
            });


            it("should the root state be in $state service as main.root", function () {
                expect($state.get("main.root")).toBe(rootState);
            });

            it("should the children state of root state be in $state service", function () {
                expect($state.get("main.root.child0")).toBe(rootState.children[0]);
                expect($state.get("main.root.child1")).toBe(rootState.children[1]);
                expect($state.get("main.root.child2")).toBe(rootState.children[2]);
            })
        })
    });

    describe("registering states before main state", function () {
        var mainState;
        var rootState;
        var $state;

        beforeEach(function () {
            mainState = {
                name: "main",
                menu: {mainState: true}
            };

            rootState = {
                name: "some",
                children: [
                    {name: "child0"},
                    {name: "child1"},
                    {name: "child2"}
                ]
            };
            $state = $injector.get("$state");
            stateRegistryProvider.state(rootState);
            stateRegistryProvider.state(mainState);
        });

        it("should 'some' state be registered as child of main state", function () {
            expect($state.get("main.some")).toBe(rootState);
        });

        it("should the children state of 'some' state be registered as descendant of main state", function () {
            expect($state.get("main.some.child0")).toBe(rootState.children[0]);
            expect($state.get("main.some.child1")).toBe(rootState.children[1]);
            expect($state.get("main.some.child2")).toBe(rootState.children[2]);
        })
    });
});