function Due(callback) {

  var self = this;

  this.value = undefined;
  this.status = 'pending';
  this.deferral = [];
  this.followers = [];
  this.futures = [];

  this.defer = function(onSettlement) {
    self.deferral.push(onSettlement);
  }

  this.resolve = function() {
    if (self.status !== 'pending') {
      self.futures = self.deferral.map(function(deferred) {
        return deferred.apply(null, self.value);
      })

      .filter(function(future) {
        return future && future.isDue;
      })

      self.followers.forEach(function(follower) {
        self.futures.forEach(function(future) {
          if (future && future.isDue) {
            future.defer(follower);
          }
        })
      });
    }
  }


  callback(function() {
    self.value = arguments;
    self.status = 'settled';
    self.resolve();
  });
}

Due.prototype.isDue = true;

Due.prototype.then = function(onSettlement) {
  this.defer(onSettlement);
  this.resolve();

  var self = this;
  return new Due(function(settle) {

    if (self.status !== 'pending'
    &&  self.futures.every(function(future) {
      return (!future || !future.isDue || future.status !== 'pending')
    })) {
      self.futures.forEach(function(future) {
        if (future && future.isDue)
          settle.apply(null, future.value);
        else {
          settle.apply(null, future);
        }
      })
    } else {
      self.followers.push(settle);
    }
  });
}

module.exports = Due;