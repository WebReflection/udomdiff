/**
 * ISC License
 *
 * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

const remove = node => {
  const {parentNode} = node;
  node.parentNode = null;
  if (parentNode) {
    const {childNodes} = parentNode;
    const i = childNodes.indexOf(node);
    if (-1 < i)
      childNodes.splice(i, 1);
  }
};

class Siblings {
  get nextSibling() {
    const {parentNode} = this;
    if (parentNode) {
      const {childNodes} = parentNode;
      const i = childNodes.indexOf(this) + 1;
      if (0 < i && i < childNodes.length)
        return childNodes[i];
    }
    return null;
  }
  get previousSibling() {
    const {parentNode} = this;
    if (parentNode) {
      const {childNodes} = parentNode;
      const i = childNodes.indexOf(this) - 1;
      if (-1 < i)
        return childNodes[i];
    }
    return null;
  }
}

class Nody extends Siblings {
  constructor(textContent) {
    super();
    this.parentNode = null;
    this.textContent = textContent;
  }
}

class Dommy extends Siblings {
  constructor(tagName) {
    super();
    this.parentNode = null;
    this.childNodes = [];
    this.tagName = tagName;
  }
  get firstChild() {
    return this.childNodes[0];
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1];
  }
  get textContent() {
    return this.childNodes.map(node => node.textContent).join('');
  }
  set textContent(value) {
    this.childNodes.splice(0).forEach(remove);
    if (value)
      this.appendChild(document.createTextNode(value));
  }
  appendChild(newNode) {
    if (!newNode)
      throw new Error('invalid appendChild');
    remove(newNode);
    this.childNodes.push(newNode);
    newNode.parentNode = this;
    return newNode;
  }
  insertBefore(newNode, oldNode) {
    if (newNode !== oldNode) {
      remove(newNode);
      const {childNodes} = this;
      if (oldNode) {
        const i = childNodes.indexOf(oldNode);
        if (i < 0)
          throw new Error('invalid insertBefore');
        childNodes.splice(i, 0, newNode);
      }
      else
        childNodes.push(newNode);
      newNode.parentNode = this;
    }
    return newNode;
  }
  removeChild(oldNode) {
    const {childNodes} = this;
    const i = childNodes.indexOf(oldNode);
    if (i < 0)
      throw new Error('invalid removeChild');
    childNodes.splice(i, 1);
    oldNode.parentNode = null;
    return oldNode;
  }
  replaceChild(newNode, oldNode) {
    remove(newNode);
    const {childNodes} = this;
    const i = childNodes.indexOf(oldNode);
    if (i < 0)
      throw new Error('invalid replaceChild');
    childNodes[i] = newNode;
    oldNode.parentNode = null;
    newNode.parentNode = this;
    return newNode;
  }
}

module.exports = {
  createElement: tagName => new Dommy(tagName),
  createTextNode: textContent => new Nody(textContent)
};
