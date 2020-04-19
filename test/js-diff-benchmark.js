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
  'udomdiff w/out before',
  'udomdiff with before'
];

const cols = [
  '',
  '1k',
  'Repl',
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
let before;// = document.createTextNode('<!--pin-->');

const parent = document.createElement('div');

const {
  clear, reset, verifyNodes,
  random, reverse,
  create1000, create10000,
  append1000, prepend1000,
  swapRows, updateEach10thRow
} = require('./utils.js')(document, parent, () => before);

libs.forEach((lib, i) => {
  if (i)
    before = document.createTextNode('<!--pin-->');

  const libResults = [];
  table.push({ [lib]: libResults });

  const file = `../cjs/index.js`;
  const diff = require(file);

  var code = fs.readFileSync(require.resolve(file), 'utf8');
  var gzip = gzipSize.sync(Terser.minify(code).code);

  // clean up the parent
  // clean up the parent
  parent.textContent = '';
  if (before)
    parent.appendChild(before);

  //* warm up + checking everything works upfront
  let childNodes = create1000(diff, []);
  console.assert(
    verifyNodes(childNodes, 1000),
    '%s warmup create',
    lib
  );

  childNodes = create1000(diff, childNodes);
  console.assert(
    verifyNodes(childNodes, 1000),
    '%s warmup replace',
    lib
  );

  if (!shuffleSeed) {
    // create a fixed shuffled seed so each library does the same.
    const shuffle = childNodes.slice().sort(
      () => Math.random() - Math.random()
    );
    shuffleSeed = shuffle.map((node) => childNodes.indexOf(node));
  }

  childNodes = append1000(diff, childNodes);
  console.assert(
    verifyNodes(childNodes, 2000),
    '%s warmup append',
    lib
  );
  childNodes = prepend1000(diff, childNodes);
  console.assert(
    verifyNodes(childNodes, 3000),
    '%s warmup prepend',
    lib
  );
  childNodes = clear(diff, childNodes);
  console.assert(
    verifyNodes(childNodes, 0),
    '%s warmup clear',
    lib
  );
  childNodes = create10000(diff, childNodes);
  console.assert(
    verifyNodes(childNodes, 10000),
    '%s warmup 10k',
    lib
  );
  childNodes = clear(diff, childNodes);
  console.assert(
    verifyNodes(childNodes, 0),
    '%s warmup clear 10k',
    lib
  );
  childNodes = create1000(diff, childNodes);
  childNodes = swapRows(diff, childNodes);
  console.assert(childNodes[1].textContent == 998, '%s warmup swap', lib);
  console.assert(childNodes[998].textContent == 1, '%s warmup swap', lib);
  childNodes = clear(diff, childNodes);
  childNodes = create1000(diff, childNodes);
  childNodes = updateEach10thRow(diff, childNodes);
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
  childNodes = clear(diff, childNodes);
  console.assert(
    verifyNodes(childNodes, 0),
    '%s warmup clear',
    lib
  );
  //*/

  // console.time(lib.toUpperCase());

  const totalStart = microtime.now();

  let begin;
  const start = () => {
    reset();
    begin = microtime.now();
  };
  const stop = (count, operationMax) => {
    const end = microtime.now() - begin;
    const delta = count - operationMax;
    libResults.push(`${(end / 1000).toPrecision(2)}ms
    ${c.gray(count)}${
      count > operationMax
        ? (delta > 99 ? '\n' : ' ') + c.bgRed.black(`+${delta}`)
        : ''
    }`.replace(/^\s+/m, ''));
  };

  // actual benchmark

  start();
  childNodes = create1000(diff, childNodes);
  stop(parent.count(), 1000);
  console.assert(
    verifyNodes(childNodes, 1000),
    '%s 1k',
    lib
  );

  start();
  childNodes = create1000(diff, childNodes);
  stop(parent.count(), 2000);
  console.assert(
    verifyNodes(childNodes, 1000),
    '%s replace',
    lib
  );

  start();
  childNodes = random(shuffleSeed, diff, childNodes);
  stop(parent.count(), 2000);
  console.assert(
    verifyNodes(childNodes, 1000),
    '%s random',
    lib
  );

  start();
  childNodes = reverse(diff, childNodes);
  stop(parent.count(), 2000);
  console.assert(
    verifyNodes(childNodes, 1000),
    '%s reverse',
    lib
  );

  start();
  childNodes = clear(diff, childNodes);
  stop(parent.count(), 1000);
  console.assert(
    verifyNodes(childNodes, 0),
    '%s clear',
    lib
  );

  childNodes = create1000(diff, childNodes);

  start();
  childNodes = append1000(diff, childNodes);
  stop(parent.count(), 2000);
  console.assert(
    verifyNodes(childNodes, 2000),
    '%s append 1k',
    lib
  );

  start();
  childNodes = prepend1000(diff, childNodes);
  stop(parent.count(), 1000);
  console.assert(
    verifyNodes(childNodes, 3000),
    '%s prepend 1k',
    lib
  );

  childNodes = clear(diff, childNodes);
  childNodes = create1000(diff, childNodes);

  start();
  childNodes = swapRows(diff, childNodes);
  stop(parent.count(), 4);
  console.assert(
    parent.childNodes[1].textContent == 998 &&
    parent.childNodes[998].textContent == 1 &&
    verifyNodes(childNodes, 1000),
    '%s swap2 1k',
    lib
  );

  start();
  childNodes = updateEach10thRow(diff, childNodes);
  stop(parent.count(), 200);
  console.assert(
    verifyNodes(childNodes, 1000),
    '%s update 10th',
    lib
  );

  childNodes = clear(diff, childNodes);

  start();
  childNodes = create10000(diff, childNodes);
  stop(parent.count(), 10000);
  console.assert(
    verifyNodes(childNodes, 10000),
    '%s 10k',
    lib
  );

  start();
  childNodes = swapRows(diff, childNodes);
  stop(parent.count(), 4);
  console.assert(
    parent.childNodes[1].textContent == 9998 &&
    parent.childNodes[9998].textContent == 1 &&
    verifyNodes(childNodes, 10000),
    '%s swap2 10k',
    lib
  );

  childNodes = clear(diff, childNodes);
  reset();

  //*/

  libResults.push(`${((microtime.now() - totalStart) / 1000).toPrecision(3)}ms`);
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
