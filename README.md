# <em>µ</em>domdiff

[![Build Status](https://travis-ci.com/WebReflection/udomdiff.svg?branch=master)](https://travis-ci.com/WebReflection/udomdiff) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/udomdiff/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/udomdiff?branch=master)

![a different tree](./udomdiff-head.jpg)

<sup>**Social Media Photo by [Christopher Rusev](https://unsplash.com/@ralics) on [Unsplash](https://unsplash.com/)**</sup>

An essential diffing algorithm for [µhtml](https://github.com/WebReflection/uhtml#readme).


### Signature

```js
futureNodes = udomdiff(
  parentNode,           // where changes happen
  [...currentNodes],    // Array of current items/nodes
  [...futureNodes],     // Array of future items/nodes (returned)
  get(node, toDoWhat),  // a callback to retrieve the node
  before                // the anchored node to insertBefore
);
```

### What is `get` and how does it work?

You can find all info from [domdiff](https://github.com/WebReflection/domdiff#a-node-generic-info--node-callback-for-complex-data), as it's exactly the same concept:

  * `get(node, 1)` to retrieve the node that's being appended
  * `get(node, 0)` to get the node to use for an `insertBefore` operation
  * `get(node, -0)` to get the node to use for an `insertAfter` operation
  * `get(node, -1)` to retrieve the node that's being removed

If you don't care about any of those second arguments values, `const get = o => o;` is a valid get too.


### How to import it:

  * via **CDN**, as global variable: `https://unpkg.com/udomdiff`
  * via **ESM**, as external module: `https://unpkg.com/udomdiff/esm/index.js`
  * via **CJS**: `const EventTarget = require('udomdiff').default;` <sup><sub>( or `require('udomdiff/cjs').default` )</sub></sup>
  * via bundlers/transpilers: `import udomdiff from 'udomdiff';` <sup><sub>( or `from 'udomdiff/esm'` )</sub></sup>
