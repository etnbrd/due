var V = require('../src');

describe('Vow', function(){
  it('should settle synchronously', function(done){
    var v = new V(function(settle) {
        settle("result");
    })

    v.then(function(result) {
      if (result === "result")
        done();
    })
  })

  it('should settle asynchronously', function(done){
    var v = new V(function(settle) {
        setImmediate(function() {
          settle(null, "result")
        });
    })

    v.then(function(error, result) {
      if (result === "result")
        done();
    })
  })

  it('should cascade synchronously', function(done){
    var v = new V(function(settle) {
      settle(null, "result");
    })

    v.then(function(error, result) {
      return new V(function(settle) {
        settle(null, "result2");
      });
    }).then(function(error, result) {
      if (result === "result2")
        done();
    })
  })

  it('should cascade asynchronously', function(done){
    var v = new V(function(settle) {
      setImmediate(function() {
          settle(null, "result")
      });
    })

    v.then(function(error, result) {
      return new V(function(settle) {
        setImmediate(function() {
          settle(null, "result2")
        });
      });
    }).then(function(error, result) {
      if (result === "result2")
        done();
    })
  })

  it('should allow multiple then to same synchronous vow', function(done){
    var v = new V(function(settle) {
      settle(null, "result")
    })

    var count = 0;

    var then = function(error, result) {
      if (result === 'result' && ++count === 2)
        done()
    }

    v.then(then);
    v.then(then);
  })

  it('should allow multiple then to same asynchronous vow', function(done){
    var v = new V(function(settle) {
      setImmediate(function() {
          settle(null, "result")
      });
    })

    var count = 0;

    var then = function(error, result) {
      if (result === 'result' && ++count === 2)
        done()
    }

    v.then(then);
    v.then(then);
  })


  // returned value should either be a vow, or a value
})