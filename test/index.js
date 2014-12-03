var D = require('../src');

describe('Due', function(){
  it('should settle synchronously', function(done){
    var d = new D(function(settle) {
        settle("result");
    })

    d.then(function(result) {
      if (result === "result")
        done();
    })
  })

  it('should settle asynchronously', function(done){
    var d = new D(function(settle) {
        setImmediate(function() {
          settle(null, "result")
        });
    })

    d.then(function(error, result) {
      if (result === "result")
        done();
    })
  })

  it('should cascade synchronously', function(done){
    var d = new D(function(settle) {
      settle(null, "result");
    })

    d.then(function(error, result) {
      return new D(function(settle) {
        settle(null, "result2");
      });
    }).then(function(error, result) {
      if (result === "result2")
        done();
    })
  })

  it('should cascade asynchronously', function(done){
    var d = new D(function(settle) {
      setImmediate(function() {
          settle(null, "result")
      });
    })

    d.then(function(error, result) {
      return new D(function(settle) {
        setImmediate(function() {
          settle(null, "result2")
        });
      });
    }).then(function(error, result) {
      if (result === "result2")
        done();
    })
  })

  it('should allow multiple then to same synchronous due', function(done){
    var d = new D(function(settle) {
      settle(null, "result")
    })

    var count = 0;

    var then = function(error, result) {
      if (result === 'result' && ++count === 2)
        done()
    }

    d.then(then);
    d.then(then);
  })

  it('should allow multiple then to same asynchronous due', function(done){
    var d = new D(function(settle) {
      setImmediate(function() {
          settle(null, "result")
      });
    })

    var count = 0;

    var then = function(error, result) {
      if (result === 'result' && ++count === 2)
        done()
    }

    d.then(then);
    d.then(then);
  })


  // returned value should either be a vow, or a value
})