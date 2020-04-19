const get = o => o;
module.exports = (document, container, before) => {
  const mutations = [];
  const {
    appendChild,
    insertBefore,
    removeChild,
    replaceChild
  } = container;
  container.count = () => mutations.length;
  container.appendChild = function (newNode) {
    const {textContent} = newNode;
    if (newNode.parentNode)
      mutations.push(`append: drop(${textContent})`);
    mutations.push(`append: add(${textContent})`);
    return appendChild.call(this, newNode);
  };
  container.insertBefore = function (newNode, oldNode) {
    const {textContent} = newNode;
    if (newNode.parentNode)
      mutations.push(`insert: drop(${textContent})`);
    mutations.push(
      oldNode ?
        `insert: put(${textContent}) before (${oldNode.textContent})` :
        `insert: add(${textContent})`
    );
    return insertBefore.call(this, newNode, oldNode);
  };
  container.removeChild = function (oldNode) {
    mutations.push(`remove: drop(${oldNode.textContent})`);
    return removeChild.call(this, oldNode);
  };
  container.replaceChild = function (newNode, oldNode) {
    const {textContent} = newNode;
    mutations.push(`replace: drop(${oldNode.textContent})`);
    if (newNode.parentNode)
      mutations.push(`replace: drop(${textContent})`);
    mutations.push(`replace: put(${textContent})`);
    return replaceChild.call(this, newNode, oldNode);
  };
  const createNode = text => {
    const node = document.createElement('p');
    node.appendChild(document.createTextNode(text));
    return node;
  };
  return {
    // Benchnmark Utilities
    reset() {
      mutations.splice(0);
    },
    verifyNodes(childNodes, expected) {
      return childNodes.length === expected &&
              childNodes.every((row, i) => row === container.childNodes[i]) &&
              container.childNodes.length === expected + (before() ? 1 : 0) &&
              (!before || container.childNodes[expected] === before());
    },
    // Benchnmark Functions
    random(shuffleSeed, diff, oldNodes) {
      return diff(
        container,
        oldNodes,
        shuffleSeed.map((newIdx) => oldNodes[newIdx]),
        get,
        before()
      );
    },
    reverse(diff, oldNodes) {
      return diff(container, oldNodes, oldNodes.slice().reverse(), get, before());
    },
    append1000(diff, oldNodes) {
      const start = oldNodes.length;
      const childNodes = oldNodes.slice();
      for (let i = 0; i < 1000; i++)
        childNodes.push(createNode(start + i));
      return diff(container, oldNodes, childNodes, get, before());
    },
    clear(diff, oldNodes) {
      return diff(container, oldNodes, [], get, before());
    },
    create1000(diff, oldNodes) {
      const childNodes = [];
      for (let i = 0; i < 1000; i++)
        childNodes.push(createNode(i));
      return diff(container, oldNodes, childNodes, get, before());
    },
    create10000(diff, oldNodes) {
      const childNodes = [];
      for (let i = 0; i < 10000; i++)
        childNodes.push(createNode(i));
      return diff(container, oldNodes, childNodes, get, before());
    },
    prepend1000(diff, oldNodes) {
      const childNodes = [];
      for (let i = 0; i < 1000; i++)
        childNodes.push(createNode(-i));
      return diff(
        container,
        oldNodes,
        childNodes.reverse().concat(oldNodes),
        get,
        before()
      );
    },
    swapRows(diff, oldNodes) {
      const childNodes = oldNodes.slice();
      const $1 = childNodes[1];
      const index = childNodes.length - 2;
      childNodes[1] = childNodes[index];
      childNodes[index] = $1;
      return diff(container, oldNodes, childNodes, get, before());
    },
    updateEach10thRow(diff, oldNodes) {
      const childNodes = oldNodes.slice();
      for (let i = 0; i < childNodes.length; i += 10)
        childNodes[i] = createNode(i + '!');
      return diff(container, oldNodes, childNodes, get, before());
    }
  };
};
