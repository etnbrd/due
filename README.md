# Due

[![NPM](https://nodei.co/npm/due.png?compact=true)](https://www.npmjs.com/package/due)

A simpler alternative to Promises in Javascript.
It doesn't follow the Promise/A+ specification.
Instead, it follows the *error-first* convention from Node.js.

## What is a due ?

A due is like a *promise*, but with a simpler interface.
If you are familiar with *callback* and *promise*, you can skip the next paragraph.

Javascript is a functional language, functions are first class citizen.
It is possible to return, and take function as arguments.
This make Javascript a language of choice for asynchronous execution model, like [DOM](http://www.w3.org/DOM/) and [node.js](http://nodejs.org/).
In these execution model, asynchronous sequences of execution are linked by **callbacks**.
A callback is a function whose execution is to be deferred asynchronously.

```
my_fn('input', function callback(err, res) {
  // deferred continuation
})
```

Because callbacks are passed as arguments, it might lead to an intricate imbrication of asynchronous call and callback.
It is called the [callback hell](http://callbackhell.com/), or pyramid of doom.
The source code structure doesn't follow the execution order.

```
my_fn('input', function callback(err, res) {
  another\_fn('another\_input', function callback2() {
    // deferred continuation
  })
})
```

Some tools exists to arrange asynchronous execution in a more readable way : [Promise/A+](https://promisesaplus.com/).
Due is one of these tools.

A due is an object returned by an asynchronous call.
This object exposes a single method `then`, to continue the execution, once the asynchronous call complete.

```
my_fn('input')
.then(function(err, res) {
  // deferred continuation
})
```
A due, like a promise, flatten the intricate imbrication of callbacks.

```
my_fn('input')
.then(function(err, res) {
  return another\_fn('another\_input')
})
.then(function(err, res) {
  // second continuation
})
```

## How to use a due ?

### Monkey patch an existing library to be due-compatible

The [due npm module](https://www.npmjs.com/package/due) expose a function `mock` make asynchronous function using callback, return a due.

```
var Due = require('../src'),
    fs = require('fs');

readdir = Due.mock(fs.readdir)
// ...

readdir(path)
.then(function(err, files) {
  // ... continuation
})
```

### Create your own due-compatible library

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

Cascade of asynchronous dues :

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
