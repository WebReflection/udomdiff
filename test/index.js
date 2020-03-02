global.document = {
  createElement: function (tagName) {
    return {tagName: tagName, value: '\n'};
  },
  createTextNode: function (value) {
    return Object.defineProperty(
      {value: value},
      'nextSibling',
      {get: function () {
        var cn = document.body.childNodes;
        return cn[cn.indexOf(this) + 1];
      }}
    );
  },
  importNode: function () {},
  body: {
    get lastElementChild() {
      return this.childNodes[this.childNodes.length - 1];
    },
    get textContent() {
      return this.childNodes.map(node => node.value).join('');
    },
    appendChild: function (node) {
      this.removeChild(node);
      this.childNodes.push(node);
      node.parentNode = this;
    },
    childNodes: [],
    insertBefore: function (before, after) {
      if (before !== after) {
        this.removeChild(before);
        var cn = this.childNodes;
        cn.splice(cn.indexOf(after), 0, before);
        before.parentNode = this;
      }
    },
    removeChild: function (child) {
      delete child.parentNode;
      var cn = this.childNodes;
      var i = cn.indexOf(child);
      if (-1 < i)
        cn.splice(i, 1);
    },
    replaceChild: function (newChild, oldChild) {
      this.removeChild(newChild);
      var cn = this.childNodes;
      cn.splice(cn.indexOf(oldChild), 1, newChild);
      newChild.parentNode = this;
      delete oldChild.parentNode;
    }
  }
};

global.udomdiff = require('../cjs');
require('./test.js');
global.test();
