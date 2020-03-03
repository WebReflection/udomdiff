const udomdiff = require('../cjs');

const {Dommy, Nody, get} = require('./utils.js');

let parent = new Dommy();

const append1000 = parent => {
  const start = parent.childNodes.length - 1;
  const childNodes = parent.childNodes.slice();
  for (let i = 0; i < 1000; i++)
    childNodes.push(new Nody(parent, start + i));
  return udomdiff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
};

const clear = parent => {
  return udomdiff(
    parent,
    parent.childNodes,
    [],
    get,
    parent.lastElementChild
  );
};

const create1000 = parent => {
  const start = parent.childNodes.length;
  const childNodes = [];
  for (let i = 0; i < 1000; i++)
    childNodes.push(new Nody(parent, start + i));
  return udomdiff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
};

const create10000 = parent => {
  const childNodes = [];
  for (let i = 0; i < 10000; i++)
    childNodes.push(new Nody(parent, i));
  return udomdiff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
};

const swapRows = parent => {
  const childNodes = parent.childNodes.slice();
  const $1 = childNodes[1];
  childNodes[1] = childNodes[998];
  childNodes[998] = $1;
  return udomdiff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
};

const updateEach10thRow = parent => {
  const childNodes = parent.childNodes.slice();
  for (let i = 0; i < childNodes.length; i += 10)
    childNodes[i].value += '!';
  return udomdiff(
    parent,
    parent.childNodes,
    childNodes,
    get,
    parent.lastElementChild
  );
};

//* warm up + checking everything works upfront
create1000(parent);
console.assert(parent.childNodes.length === 1000);
append1000(parent);
console.assert(parent.childNodes.length === 2000);
clear(parent);
console.assert(parent.childNodes.length === 0);
create10000(parent);
console.assert(parent.childNodes.length === 10000);
clear(parent);
console.assert(parent.childNodes.length === 0);
create1000(parent);
swapRows(parent);
console.assert(parent.childNodes[1].value == 998);
console.assert(parent.childNodes[998].value == 1);
clear(parent);
create1000(parent);
updateEach10thRow(parent);
console.assert(/!$/.test(parent.childNodes[0].value));
console.assert(!/!$/.test(parent.childNodes[1].value));
console.assert(/!$/.test(parent.childNodes[10].value));
clear(parent);
console.assert(parent.childNodes.length === 0);
//*/

console.time('js-frameworks-benchmark');

// actual benchmark
parent.reset();
console.time('create 1000');
var rows = create1000(parent);
console.timeEnd('create 1000');
console.assert(parent.childNodes.every((row, i) => row === rows[i]));
console.log('operations', parent.count(), '\n');
parent.reset();

console.time('clear');
var rows = clear(parent);
console.timeEnd('clear');
console.assert(parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 0);
console.log('operations', parent.count(), '\n');
parent.reset();

create1000(parent);
parent.reset();
console.time('replace 1000');
var rows = create1000(parent);
console.timeEnd('replace 1000');
console.assert(parent.childNodes.every((row, i) => row === rows[i]));
console.log('operations', parent.count(), '\n');
clear(parent);
parent.reset();

create1000(parent);
parent.reset();
console.time('append 1000');
var rows = append1000(parent);
console.timeEnd('append 1000');
console.assert(parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 2000);
console.log('operations', parent.count(), '\n');
parent.reset();

console.time('append more');
var rows = append1000(parent);
console.timeEnd('append more');
console.assert(parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 3000);
console.log('operations', parent.count(), '\n');
parent.reset();
clear(parent);

create1000(parent);
parent.reset();
console.time('swap rows');
swapRows(parent);
console.timeEnd('swap rows');
console.log('operations', parent.count(), '\n');
parent.reset();

create1000(parent);
parent.reset();
console.time('update every 10th row');
updateEach10thRow(parent);
console.timeEnd('update every 10th row');
console.log('operations', parent.count(), '\n');
parent.reset();

clear(parent);
parent.reset();
console.time('create 10000 rows');
create10000(parent);
console.timeEnd('create 10000 rows');
console.log('operations', parent.count(), '\n');
parent.reset();

console.time('swap over 10000 rows');
swapRows(parent);
console.timeEnd('swap over 10000 rows');
console.log('operations', parent.count(), '\n');
parent.reset();

console.time('clear 10000');
clear(parent);
console.timeEnd('clear 10000');
console.log('operations', parent.count(), '\n');
parent.reset();

//*/

console.timeEnd('js-frameworks-benchmark');
