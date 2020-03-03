const udomdiff = require('../cjs');

const {Dommy, Nody, get} = require('./utils.js');

let nodes = [];
const diff = list => {
  parent.reset();
  let future = list.map(node);
  console.log(`\x1b[1m[${nodes.map(value).join(', ')}]\x1b[0m`);
  console.log(`\x1b[1m[${future.map(value).join(', ')}]\x1b[0m`);
  nodes = udomdiff(parent, nodes, future, get);
  console.log(parent.operations.join('\n'));
  console.assert(
    nodes.map(value).join(', ') === future.map(value).join(', '),
    `[${nodes.map(value).join(', ')}]`
  );
};

const cache = Object.create(null);
const node = value => cache[value] || (
  cache[value] = new Nody(parent, value)
);
const value = node => node.value;

let parent = new Dommy();

diff([1, 2, 3, 4]);
diff([1, 2, 4, 5, 3]);
