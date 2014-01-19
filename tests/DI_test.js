describe("DI", function () {
    var di;

    beforeEach(function () {
        di = new DI();
    });

    it("should be an instance of DI", function () {
        expect(di instanceof DI).toBe(true);
    });

    describe("dependency setters and getters", function () {
        it("should be able to set dependencies", function () {
            di.dependency('one', 1);
        });

        it("should be able to get dependencies", function () {
            di.dependency('one', 1);
            expect(di.get_dependency('$one')).toBe(1);
        });

        it("expects a dollar sign in the variable name when getting deps", function () {
            di.dependency('one', 1);
            expect(di.get_dependency('one')).toBe(null);
        });

        it("unknown dependency return null", function () {
            expect(di.get_dependency('$two')).toBe(null);
        });

        it("returns di object when setting deps so chaining is possible", function () {
            di
                .dependency('one', 1)
                .dependency('two', 2)
                .dependency('three', 3)
                .dependency('four', 4);

            expect(di.get_dependency('$one')).toBe(1);
            expect(di.get_dependency('$two')).toBe(2);
            expect(di.get_dependency('$three')).toBe(3);
            expect(di.get_dependency('$four')).toBe(4);
        });
    });

    describe("di variable parsers", function () {
        it("di'able variable names have a $ prefix", function () {
            expect(DI.is_di_argument('$four')).toBe(true);
        });

        it("non di'able variable names do not have a $ prefix", function () {
            expect(DI.is_di_argument('four')).toBe(false);
        });

        it("parses di'able variable names", function () {
            expect(DI.get_clean_di_argument_name('$four')).toBe('four');
        });

        it("and break non di'able variable names", function () {
            expect(DI.get_clean_di_argument_name('four')).toBe('our');
        });
    });

    describe("function argument parser", function () {
        it("returns empty array when no args are taken", function () {
            expect(DI.get_function_arguments(function () {})).toEqual([]);
        });

        it("returns array of arguments", function () {
            expect(DI.get_function_arguments(function (one, two) {})).toEqual([
                'one', 'two'
            ]);
        });
    });

    // describe("argument list generator", function () {
    //     it("", function () {
    //     });

    // });

    // it("", function () {
    // });

    // it("", function () {
    // });

    // it("", function () {
    // });

    // it("", function () {
    // });

    // it("", function () {
    // });
});
