// source: https://github.com/luwes/js-diff-benchmark
const fs = require('fs');
const c = require('ansi-colors');
var Terser = require('terser');
const gzipSize = require('gzip-size');
const Table = require('cli-table');
const microtime = require('microtime');
const document = require('./dommy.js');
const get = o => o;

const libs = [
  'udomdiff'
];

const cols = [
  '',
  '1k',
  'Shufle',
  'Invers',
  'Clear',
  'Append',
  'Prepend',
  'Swap2',
  'Up10th',
  '10k',
  'Swap2',
  'Total',
  'Size',
];

const table = new Table({
  head: cols,
  colAligns: cols.map(() => 'middle'),
  style: {
    head: ['green'],
  },
});

let shuffleSeed;

// in case we'd like to test "pinnability" of the differ
let before = document.createTextNode('<!--pin-->');
let parent = document.createElement('div');
instrument(parent);

libs.forEach((lib) => {

  const libResults = [];
  table.push({ [lib.slice(0, 8)]: libResults });

  const file = `../cjs/index.js`;
  const diff = require(file);

  var code = fs.readFileSync(require.resolve(file), 'utf8');
  var gzip = gzipSize.sync(Terser.minify(code).code);

  // clean up the parent
  parent.textContent = '';
  if (before)
    parent.appendChild(before);

  //* warm up + checking everything works upfront
  let childNodes = create1000(parent, diff, []);
  console.assert(verifyNodes(parent, childNodes, 1000), '%s warmup create', lib);

  if (!shuffleSeed) {
    // create a fixed shuffled seed so each library does the same.
    const shuffle = childNodes.slice().sort(
      () => Math.random() - Math.random()
    );
    shuffleSeed = shuffle.map((node) => childNodes.indexOf(node));
  }

  childNodes = append1000(parent, diff, childNodes);
  console.assert(
    verifyNodes(parent, childNodes, 2000),
    '%s warmup append',
    lib
  );
  childNodes = prepend1000(parent, diff, childNodes);
  console.assert(
    verifyNodes(parent, childNodes, 3000),
    '%s warmup prepend',
    lib
  );
  childNodes = clear(parent, diff, childNodes);
  console.assert(
    verifyNodes(parent, childNodes, 0),
    '%s warmup clear',
    lib
  );
  childNodes = create10000(parent, diff, childNodes);
  console.assert(
    verifyNodes(parent, childNodes, 10000),
    '%s warmup 10k',
    lib
  );
  childNodes = clear(parent, diff, childNodes);
  console.assert(
    verifyNodes(parent, childNodes, 0),
    '%s warmup clear 10k',
    lib
  );
  childNodes = create1000(parent, diff, childNodes);
  childNodes = swapRows(parent, diff, childNodes);
  console.assert(childNodes[1].textContent == 998, '%s warmup swap', lib);
  console.assert(childNodes[998].textContent == 1, '%s warmup swap', lib);
  childNodes = clear(parent, diff, childNodes);
  childNodes = create1000(parent, diff, childNodes);
  childNodes = updateEach10thRow(parent, diff, childNodes);
  console.assert(
    /!$/.test(childNodes[0].textContent),
    '%s warmup update',
    lib
  );
  console.assert(
    !/!$/.test(childNodes[1].textContent),
    '%s warmup update',
    lib
  );
  console.assert(
    /!$/.test(childNodes[10].textContent),
    '%s warmup update',
    lib
  );
  childNodes = clear(parent, diff, childNodes);
  console.assert(
    verifyNodes(parent, childNodes, 0),
    '%s warmup clear',
    lib
  );
  //*/

  // console.time(lib.toUpperCase());

  const totalStart = microtime.now();

  let begin;
  const start = () => (begin = microtime.now());
  const stop = (count, operationMax) => {
    const delta = count - operationMax;
    libResults.push(`${round((microtime.now() - begin) / 1000)}ms
${c.gray(count)}${
      count > operationMax
        ? (delta > 99 ? '\n' : ' ') + c.bgRed.black(`+${delta}`)
        : ''
    }`);
  };

  // actual benchmark
  reset(parent);
  start();
  childNodes = create1000(parent, diff, childNodes);
  stop(parent.operations.length, 1000);
  console.assert(
    verifyNodes(parent, childNodes, 1000),
    '%s 1k',
    lib
  );
  reset(parent);

  start();
  childNodes = random(parent, diff, childNodes);
  stop(parent.operations.length, 1000);
  console.assert(
    verifyNodes(parent, childNodes, 1000),
    '%s random',
    lib
  );
  reset(parent);

  start();
  childNodes = reverse(parent, diff, childNodes);
  stop(parent.operations.length, 1000);
  console.assert(
    verifyNodes(parent, childNodes, 1000),
    '%s reverse',
    lib
  );
  reset(parent);

  start();
  childNodes = clear(parent, diff, childNodes);
  stop(parent.operations.length, 1000);
  console.assert(
    verifyNodes(parent, childNodes, 0),
    '%s clear',
    lib
  );
  reset(parent);

  childNodes = create1000(parent, diff, childNodes);
  reset(parent);
  childNodes = create1000(parent, diff, childNodes);
  console.assert(verifyNodes(parent, childNodes, 1000));
  childNodes = clear(parent, diff, childNodes);
  reset(parent);

  childNodes = create1000(parent, diff, childNodes);
  reset(parent);
  start();
  childNodes = append1000(parent, diff, childNodes);
  stop(parent.operations.length, 2000);
  console.assert(
    verifyNodes(parent, childNodes, 2000),
    '%s append 1k',
    lib
  );
  reset(parent);

  start();
  childNodes = prepend1000(parent, diff, childNodes);
  stop(parent.operations.length, 1000);
  console.assert(
    verifyNodes(parent, childNodes, 3000),
    '%s prepend 1k',
    lib
  );
  reset(parent);
  childNodes = clear(parent, diff, childNodes);

  childNodes = create1000(parent, diff, childNodes);
  reset(parent);
  start();
  childNodes = swapRows(parent, diff, childNodes);
  console.assert(verifyNodes(parent, childNodes, 1000));
  stop(parent.operations.length, 2);
  reset(parent);

  childNodes = create1000(parent, diff, childNodes);
  reset(parent);
  start();
  childNodes = updateEach10thRow(parent, diff, childNodes);
  stop(parent.operations.length, 200);
  reset(parent);

  childNodes = clear(parent, diff, childNodes);
  reset(parent);
  start();
  childNodes = create10000(parent, diff, childNodes);
  stop(parent.operations.length, 10000);
  reset(parent);

  start();
  childNodes = swapRows(parent, diff, childNodes);
  stop(parent.operations.length, 2);
  reset(parent);

  childNodes = clear(parent, diff, childNodes);
  reset(parent);

  //*/

  libResults.push(`${round((microtime.now() - totalStart) / 1000)}ms`);
  libResults.push(`${gzip}B`);

  // const used = process.memoryUsage().heapUsed / 1024 / 1024;
  // console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

  try {
    if (global.gc) {
      global.gc();
    }
  } catch (e) {
    process.exit();
  }
});

table.sort((a, b) => {
  a = Object.values(a)[0];
  b = Object.values(b)[0];
  return parseInt(a[a.length - 2]) - parseInt(b[b.length - 2]);
});

console.log(table.toString());


// Benchnmark Utilities

function instrument(parent) {
  const {
    appendChild,
    insertBefore,
    removeChild,
    replaceChild
  } = parent;
  parent.operations = [];
  parent.appendChild = function (newNode) {
    this.operations.push(`appendChild(${newNode.textContent})`);
    return appendChild.call(this, newNode);
  };
  parent.insertBefore = function (newNode, oldNode) {
    this.operations.push(
      oldNode ?
        `insertBefore(${newNode.textContent}, ${oldNode.textContent})` :
        `insertBefore(${newNode.textContent})`
    );
    return insertBefore.call(this, newNode, oldNode);
  };
  parent.removeChild = function (oldNode) {
    this.operations.push(`removeChild(${oldNode.textContent})`);
    return removeChild.call(this, oldNode);
  };
  parent.replaceChild = function (newNode, oldNode) {
    this.operations.push(
      `delete#replaceChild(${newNode.textContent}, ${oldNode.textContent})`
    );
    this.operations.push(
      `insert#replaceChild(${newNode.textContent}, ${oldNode.textContent})`
    );
    return replaceChild.call(this, newNode, oldNode);
  };
}

function reset(parent) {
  parent.operations.splice(0);
}

function round(num) {
  return Math.round((num + Number.EPSILON) * 10) / 10;
}

function verifyNodes(parent, childNodes, expected) {
  return childNodes.length === expected &&
          childNodes.every((row, i) => row === parent.childNodes[i]) &&
          parent.childNodes.length === expected + (before ? 1 : 0) &&
          (!before || parent.childNodes[expected] === before);
}


// Benchnmark Functions

function random(parent, diff, oldNodes) {
  return diff(
    parent,
    oldNodes,
    shuffleSeed.map((newIdx) => oldNodes[newIdx]),
    get,
    before
  );
}

function reverse(parent, diff, oldNodes) {
  return diff(parent, oldNodes, oldNodes.slice().reverse(), get, before);
}

function append1000(parent, diff, oldNodes) {
  const start = oldNodes.length;
  const childNodes = oldNodes.slice();
  for (let i = 0; i < 1000; i++)
    childNodes.push(document.createTextNode(parent, start + i));
  return diff(parent, oldNodes, childNodes, get, before);
}

function clear(parent, diff, oldNodes) {
  return diff(parent, oldNodes, [], get, before);
}

function create1000(parent, diff, oldNodes) {
  const childNodes = [];
  for (let i = 0; i < 1000; i++)
    childNodes.push(document.createTextNode(i));
  return diff(parent, oldNodes, childNodes, get, before);
}

function create10000(parent, diff, oldNodes) {
  const childNodes = [];
  for (let i = 0; i < 10000; i++)
    childNodes.push(document.createTextNode(i));
  return diff(parent, oldNodes, childNodes, get, before);
}

function prepend1000(parent, diff, oldNodes) {
  const childNodes = [];
  for (let i = 0; i < 1000; i++)
    childNodes.push(document.createTextNode(parent, -i));
  return diff(
    parent,
    oldNodes,
    childNodes.reverse().concat(oldNodes),
    get,
    before
  );
}

function swapRows(parent, diff, oldNodes) {
  const childNodes = oldNodes.slice();
  const $1 = childNodes[1];
  const index = childNodes.length - 2;
  childNodes[1] = childNodes[index];
  childNodes[index] = $1;
  return diff(parent, oldNodes, childNodes, get, before);
}

function updateEach10thRow(parent, diff, oldNodes) {
  const childNodes = oldNodes.slice();
  for (let i = 0; i < childNodes.length; i += 10)
    childNodes[i] = document.createTextNode(i + '!');
  return diff(parent, oldNodes, childNodes, get, before);
}
