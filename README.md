// create a new di "namespace"
var di = new DI();

// tell di about the dependencies it can work with
di.dependency('one', { one: true });
di.dependency('two', { two: true });
di.dependency('three', { three: true });
di.dependency('AGE', 123);

// write function like normal
var myfunc = function ($one, manual1, manual2, $two, $INVALID, $three, $AGE) {
    console.log(JSON.stringify(
        Array.prototype.splice.call(arguments, 0)));
};

// then bind it to the di "namespace"
myfunc = di.bind(myfunc);

// and call it without the di arguments:
myfunc();     // [{"one":true},null,null,{"two":true},null,{"three":true},123]
myfunc(1);    // [{"one":true},1,null,{"two":true},null,{"three":true},123]
myfunc(1, 2); // [{"one":true},1,2,{"two":true},null,{"three":true},123]

