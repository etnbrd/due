# Due

A simpler alternative to Promises in Javascript.
It doesn't follow the Promise/A+ specification.
Instead, it follows the *error-first* convention from Node.js.

## Examples

A simple due :

```
var D = require('../src');

var d = new D(function(settle) {
    settle("result");
})

d.then(function(result) {
  if (result === "result")
    console.log('done');
})
```

Cascade of asynchrone dues :

```
var D = require('../src');

var d = new D(function(settle) {
  setImmediate(function() {
      settle(null, "result")
  });
})

var count = 0;

var then = function(error, result) {
  if (result === 'result' && ++count === 2)
    console.log('done');
}

d.then(then);
d.then(then);
```

Transform a callback function into a due function :

```
var D = require('../src'),
    fs = require('fs');

readdir = D.mock(fs.readdir)
// ...
```