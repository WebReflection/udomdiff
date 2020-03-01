# µdomdiff

[![Build Status](https://travis-ci.com/WebReflection/udomdiff.svg?branch=master)](https://travis-ci.com/WebReflection/udomdiff) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/udomdiff/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/udomdiff?branch=master)

An essential diffing algorithm for [µhtml](https://github.com/WebReflection/uhtml#readme).

### Signature

```js
futureNodes = udomdiff(
  parentNode,     // where changes happen
  currentNodes,   // Array of current items/nodes
  futureNodes,    // Array of future items/nodes (returned)
  get,            // a callback to retrieve the node
  before          // the anchored node to insertBefore
);
```

### How to import it:

  * via **CDN**, as global variable: `https://unpkg.com/udomdiff`
  * via **ESM**, as external module: `https://unpkg.com/udomdiff/esm/index.js`
  * via **CJS**: `const EventTarget = require('udomdiff').default;` <sup><sub>( or `require('udomdiff/cjs').default` )</sub></sup>
  * via bundlers/transpilers: `import udomdiff from 'udomdiff';` <sup><sub>( or `from 'udomdiff/esm'` )</sub></sup>
