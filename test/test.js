function test() {
  var before = document.body.appendChild(
    document.createElement('hr')
  );
  var nodes = {
    'a': document.createTextNode('a'),
    'b': document.createTextNode('b'),
    'c': document.createTextNode('c'),
    'd': document.createTextNode('d'),
    'e': document.createTextNode('e'),
    'f': document.createTextNode('f'),
    'g': document.createTextNode('g'),
    'h': document.createTextNode('h'),
    'i': document.createTextNode('i'),
    'j': document.createTextNode('j'),
    'k': document.createTextNode('k')
  };
  var futureState = udomdiff(
    document.body,
    [],
    [nodes.b, nodes.c, nodes.d],
    get,
    before
  );
  diff('bcd');
  diff('bcd');
  diff('abcd');
  diff('dcba');
  diff('abcd');
  diff('abcdef');
  diff('abcghidef');
  diff('abcghide');
  diff('cghide');
  diff('cgde');
  diff('');
  diff('abcdef');
  diff('abgidef');
  diff('abcdef');
  diff('jgabcdefhi');
  diff('abcdef');
  diff('agcdhi');
  diff('igadhc');
  diff('chdagi');
  diff('dfg');
  diff('abcdfg');
  diff('abcdefg');
  diff('gfedcba');
  diff('fdbaeg');
  diff('abcdef');
  diff('abcdefhij');
  diff('abcdehfij');
  diff('abidehfcj');
  diff('abcdefhij');
  diff('abcdefghijk');
  diff('ghi');
  diff('abcd');
  diff('bcad');
  diff('abcde');
  diff('dabcf');
  diff('ade');
  diff('df');
  diff('bdck');
  diff('ckbd');
  diff('');
  diff('abcd');
  diff('abdec');
  console.assert(
    /^hr$/i.test(document.body.lastElementChild.tagName),
    '<hr> preserved'
  );
  log('%cthousand nodes', 'font-weight:bold;');
  futureState = udomdiff(
    document.body,
    futureState,
    Array(1000).join('.').split('.').map(function (v, i) {
      return document.createTextNode('' + i);
    }),
    get,
    before
  );
  console.time('reverse');
  futureState = udomdiff(
    document.body,
    futureState,
    futureState.slice().reverse(),
    get,
    before
  );
  console.timeEnd('reverse');
  console.time('random');
  futureState = udomdiff(
    document.body,
    futureState,
    futureState.slice().sort(function () {
      return Math.random() < .5 ? 1 : -1;
    }),
    get,
    before
  );
  console.timeEnd('random');
  function diff(text) {
    log('%c' + (text ? text : '""'), 'font-weight:bold;');
    futureState = udomdiff(
      document.body,
      futureState,
      text.split('').map(content, nodes),
      get,
      before
    );
    compare(text);
  }
}

var log = document.importNode.length === 1 ?
  console.log :
  function (info) {
    console.log(info.slice(2));
  };

function content(c) {
  return this[c];
}

function compare(text) {
  const body = document.body.textContent.replace(/\n/g, '');
  console.assert(body === text, 'expected: ' + text + ' but it is ' + body);
}

function get(node) {
  return node;
}

if (typeof window === 'object')
  window.test = test;
else
  global.test = test;
