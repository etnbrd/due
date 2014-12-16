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
  another_fn('another_input', function callback2() {
    // deferred continuation
  })
})
```

Some tools exists to arrange asynchronous execution in a more readable way, for example [Promise/A+](https://promisesaplus.com/), or [Functional Reactive Programming](https://baconjs.github.io/).
Due is similar to Promise, but with a simpler interface.

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
  return another_fn('another_input')
})
.then(function(err, res) {
  // second continuation
})
```

## How to use a due ?

### Patch an existing library to be due-compatible

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

A simple due-compatible library :

`my_lib.js`
```
var D = require('due');

module.exports = {
  my_fn: function(input) {
    return new D(function(settle) {
        // Here, your asynchronous operations, with settle as callback.
        async_fn(input, settle);
    })
  } 
}

```

`client.js`
```
// The due is returned by your library to be handled by the client.
var my_lib = require('./my_lib');

my_lib.my_fn('input')
.then(function(err, result) {
  if (result === "result")
    console.log('done');
})
```