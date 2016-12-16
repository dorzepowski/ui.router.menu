describe("Router Menu service: Menu Items", function () {
    var stateRegistryProvider, routerMenu;

    var $injector;

    beforeEach(module('ui.router.menu', function (_stateRegistryProvider_) {
        stateRegistryProvider = _stateRegistryProvider_;
    }));

    beforeEach(inject(function (_$injector_) {
        $injector = _$injector_;
    }));

    describe("for not nested children states", function () {
        beforeEach(function () {
            var states = {
                name: "main",
                abstract: true,
                menu: {
                    mainState: true
                },
                children: [
                    {
                        name: "menu-child"
                    },
                    {
                        name: "non-menu-child",
                        menu: {
                            isItem: false
                        }
                    },
                    {
                        name: "abstract-child",
                        abstract: true
                    },
                    {
                        name: "abstract-menu-child",
                        abstract: true,
                        menu: {
                            isItem: true
                        }
                    }
                ]
            };
            stateRegistryProvider.state(states);
            routerMenu = $injector.get("routerMenu");
        });

        it("should contain item for child state", function () {
            expect(namesOf(routerMenu.items)).toContain("main.menu-child");
        });

        it("should not contain item for abstract state", function () {
            expect(namesOf(routerMenu.items)).not.toContain("main.abstract-child");
        });

        it("should contain item for abstract state when forcing to be menu item", function () {
            expect(namesOf(routerMenu.items)).toContain("main.abstract-menu-child");
        });

        it("should not contain item for state when forcing to not be menu item", function () {
            expect(namesOf(routerMenu.items)).not.toContain("main.non-menu-child");
        });
    });


    describe("children of menu items", function () {
        beforeEach(function () {
            var states = {
                name: "main",
                abstract: true,
                menu: {
                    mainState: true
                },
                children: [
                    {
                        name: "child",
                        children: [
                            {name: "sub-menu"},
                            {name: "abstract-sub", abstract: true},
                            {name: "abstract-sub-menu", abstract: true, menu: {isItem: true}},
                            {name: "sub-non-menu", menu: {isItem: false}}
                        ]
                    }
                ]
            };
            stateRegistryProvider.state(states);
            routerMenu = $injector.get("routerMenu");
        });

        it("should contain item for sub menu", function () {
            expect(namesOf(routerMenu.items[0].children)).toContain("main.child.sub-menu");
        });

        it("should not contain item for abstract subchild", function () {
            expect(namesOf(routerMenu.items[0].children)).not.toContain("main.child.abstract-sub");
        });

        it("should contain item for abstract sub menu when forcing to be menu item", function () {
            expect(namesOf(routerMenu.items[0].children)).toContain("main.child.abstract-sub-menu");
        });

        it("should not contain item for sub menu when forcing to NOT be menu item", function () {
            expect(namesOf(routerMenu.items[0].children)).not.toContain("main.child.sub-non-menu");
        });
    });


    function namesOf(items) {
        return items.map(function (item) {
            return item.name;
        });
    }
});