//@ts-check

import custom from 'custom-function/factory';

let checkType = false, range;

/**
 * @param {PersistentFragment} fragment
 * @returns {Comment}
 */
const drop = ({ firstChild, lastChild }) => {
  const r = range || (range = document.createRange());
  r.setStartAfter(firstChild);
  r.setEndAfter(lastChild);
  r.deleteContents();
  return firstChild;
};

/**
 * A `get(node, operation)` that works also with PersistentFragments via *udomdiff* signature.
 * Bear in mind fragments meant to be part of the list MUST be PersistentFragments kind.
 * @param {Node | PersistentFragment} node
 * @param {number} operation this is -1 | -0 | 0 | 1
 * @returns {Node | Comment}
 */
export const get = (node, operation) => (
  checkType && node.nodeType === 11 ?
    ((1 / operation) < 0 ?
      (operation ? drop(/** @type {PersistentFragment} */ (node)) : /** @type {Comment} */ (node.lastChild)) :
      (operation ? /** @type {PersistentFragment} */ (node).valueOf() : /** @type {Comment} */ (node.firstChild))) :
    node
);

export class PersistentFragment extends custom(DocumentFragment) {
  /** @type {Comment} */
  #firstChild;
  /** @type {Comment} */
  #lastChild;
  /** @type {Node[]} */
  #nodes;

  /**
   * @param {DocumentFragment} fragment
   */
  constructor(fragment) {
    const ownerDocument = fragment.ownerDocument;
    // @ts-ignore
    super(fragment);
    this.#firstChild = ownerDocument.createComment('<>');
    this.#lastChild = ownerDocument.createComment('</>');
    this.#nodes = [this.#firstChild, ...fragment.childNodes, this.#lastChild];
    fragment.prepend(this.#firstChild);
    fragment.appendChild(this.#lastChild);
  }

  get firstChild() {
    return this.#firstChild;
  }

  get lastChild() {
    return this.#lastChild;
  }

  get parentNode() {
    return this.#firstChild.parentNode;
  }

  valueOf() {
    const { parentNode } = this;
    if (parentNode !== this) {
      // TODO: verify fragments in lists don't call this twice
      if (parentNode) {
        let { firstChild, lastChild } = this;
        this.#nodes = [firstChild];
        while (firstChild !== lastChild)
          // @ts-ignore
          this.#nodes.push((firstChild = firstChild.nextSibling));
      }
      this.replaceChildren(...this.#nodes);
    }
    return this;
  }

  /**
   * @param {Node} node
   */
  replaceWith(node) {
    drop(this).replaceWith(node);
  }

  remove() {
    drop(this).remove();
  }
}
