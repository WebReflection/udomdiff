class Dommy {
  constructor() {
    this.reset();
    this.lastElementChild = new Nody(this, '<!--$-->');
    this._childNodes = [this.lastElementChild];
  }
  get childNodes() {
    return this._childNodes.slice(0, -1);
  }
  get textContent() {
    return this.childNodes.map(node => node.value).join('');
  }
  insertBefore(newNode, liveNode) {
    if (!liveNode) liveNode = this.lastElementChild;
    this.operations.push(`insertBefore(${newNode.value}, ${liveNode.value})`);
    this._removeChild(newNode);
    const index = this._childNodes.indexOf(liveNode);
    if (index < 0)
      throw new Error('invalid insertBefore');
    this._childNodes.splice(index, 0, newNode);
  }
  replaceChild(newNode, oldNode) {
    this.operations.push(`replaceChild(${newNode.value}, ${oldNode.value})`);
    this._removeChild(newNode);
    const index = this.childNodes.indexOf(oldNode);
    if (index < 0)
      throw new Error('invalid replaceChild');
    this._childNodes.splice(index, 1, newNode);
  }
  removeChild(node) {
    this.operations.push(`removeChild(${node.value})`);
    const index = this.childNodes.indexOf(node);
    if (index < 0)
      throw new Error('invalid removeChild');
    this._childNodes.splice(index, 1);
  }
  count() {
    return this.operations.length;
  }
  reset() {
    this.operations = [];
  }
  _removeChild(node) {
    // use childNodes instead of _childNodes
    // to preserve lastElementChild
    const index = this.childNodes.indexOf(node);
    if (-1 < index)
      this._childNodes.splice(index, 1);
  }
}

class Nody {
  constructor(dommy, value) {
    this.dommy = dommy;
    this.value = value;
  }
  get nextSibling() {
    const {childNodes, lastElementChild} = this.dommy;
    const index = childNodes.indexOf(this) + 1;
    return index < childNodes.length ? childNodes[index] : lastElementChild;
  }
}

module.exports = {Dommy, Nody, get: o => o};
