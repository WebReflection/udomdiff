const udomdiff = require('../cjs');

const {Dommy, Nody, get} = require('./utils.js');

let parent = new Dommy();

parent.childNodes.push(new Nody('before'));

for (let i = 0; i < 10; i++)
  udomdiff(
    parent,
    parent.childNodes,
    [new Nody('after')],
    get,
    parent.lastElementChild
  );

console.time('single');
udomdiff(
  parent,
  parent.childNodes,
  [new Nody('after')],
  get,
  parent.lastElementChild
);
console.timeEnd('single');
