(function () {
    "use strict";

    /**
     * @class DI
     * @constructor
     */
    var DI = window.DI = function DI () {
        /**
         * holds all dependencies. keyed by dep name
         * @property deps
         * @type {Object}
         */
        this.deps = {};
    };

    /**
     * add a new dependency that can be injected
     * @chainable
     * @method dependency
     * @param name {String} they name of the dependency variable
     * @param dep {Mixed} the actual dependency variable that will be passed
     * @return {DI} own instance
     */
    DI.prototype.dependency = function (name, dep) {
        this.deps[ name ] = dep;
        return this;
    };

    /**
     * get a dependency by its name
     * @method get_dependency
     * @param name {String} dependency di name. ie. $Ajax
     * @return {Mixed} the actual dependency variable
     */
    DI.prototype.get_dependency = function (name) {
        name = DI.get_clean_di_argument_name(name);
        return name in this.deps ? this.deps[ name ] : null;
    };

    /**
     * make a function dependency-injectable
     * @method bind
     * @param func {Function} function that you want to DI'ify
     * @return {Function} the new function that is dependency-injectable.
     * returned function looks almost like the passed argument, but not
     * exactly. one of the differences is that the `length` property will
     * always be zero.
     */
    DI.prototype.bind = function (func) {
        var copy, that, args, arglen;

        that = this;
        args = DI.get_function_arguments(func);
        arglen = args.length;

        copy = function () {
            return func.apply(null,
                that.generate_argument_list(args,
                    Array.prototype.splice.call(arguments, 0)));
        };

        copy.valueOf = function () {
            return func.valueOf();
        };

        copy.toString = function () {
            return func.toString();
        };

        return copy;
    };

    /**
     * takes an array of arguments that were passed to a DI'ifyed function and
     * returns another array of arguments that should should be used instead
     * @method generate_argument_list
     * @param arglist {Array} original list of function arguments
     * @param callargs {Array} array of arguments that were pass to function
     * @return {Array} array of parameters that should be passed to function
     */
    DI.prototype.generate_argument_list = function (arglist, callargs) {
        var dicount, callcount, arg, calllen, arglen, diargs;

        calllen = callargs.length;
        arglen = arglist.length;
        diargs = [];
        dicount = 0;
        callcount = 0;

        for (; dicount < arglen; dicount++) {
            arg = arglist[ dicount ];

            if (DI.is_di_argument(arg)) {
                // auto di argument
                arg = this.get_dependency(arg);
            } else if (callcount < calllen) {
                // manually pass argument
                arg = callargs[ callcount++ ];
            } else {
                // expecting this argument but not passed in call
                arg = null;
            }

            diargs.push(arg);
        }

        return diargs;
    };

    /**
     * returns the arguments a function takes
     * @static
     * @method get_function_arguments
     * @param func {Function}
     * @return {Array}
     */
    DI.get_function_arguments = function (func) {
        var rawargs, args = [];

        rawargs = func.toString()
            // clean up white space, easier to find and clean up arg list
            .replace(/\s+/g, '')
            // find first set of parameters, which EVERY function will have
            .match(/\((.+?)\)/);

        if (rawargs && rawargs.length) {
            rawargs = rawargs.pop();
            args = rawargs.split(',');
        }

        return args;
    };

    /**
     * checks if an argument name is a dependency injection argument. ie. it
     * starts with a dollar sign.
     * @static
     * @method is_di_argument
     * @param argname {String}
     * @return {Boolean}  
     */
    DI.is_di_argument = function (argname) {
        return argname[0] === '$';
    };

    /**
     * takes a di argument (ie. $Ajax, $app) and returns the cleaned up
     * version of the dependency name (ie. Ajax, app) since that's how it's
     * registered using the DI.prototype.dependency function
     * @static
     * @method get_clean_di_argument_name
     * @param argname {String}
     * @return {String}
     */
    DI.get_clean_di_argument_name = function (argname) {
        return argname.substr(1);
    };
})();
