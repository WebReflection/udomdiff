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

/**
 * @param {Node} parentNode
 * @param {(entry: Node, action: number) => Node} get
 * @param {Node} entry
 * @param {Node} ref
 */
const insert = globalThis.Element?.prototype.moveBefore ?
  (parentNode, get, entry, ref) => {
    const node = get(entry, 1);
    if (node.parentNode === parentNode)
      parentNode.moveBefore(node, ref);
    else
      parentNode.insertBefore(node, ref);
  } :
  (parentNode, get, entry, ref) => {
    parentNode.insertBefore(get(entry, 1), ref);
  };

/**
 * @param {Node} parentNode The container where children live
 * @param {Node[]} a The list of current/live children
 * @param {Node[]} b The list of future children
 * @param {(entry: Node, action: number) => Node} get
 * The callback invoked per each entry related DOM operation.
 * @param {Node} [before] The optional node used as anchor to insert before.
 * @returns {Node[]} The same list of future children.
 */
export default (parentNode, a, b, get, before) => {
  const bLength = b.length;
  let aEnd = a.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map = null;
  // bulk remove: the live list is larger than the future one
  if (!bLength) {
    while (aStart < aEnd)
      parentNode.removeChild(get(a[aStart++], -1));
    return b;
  }
  if (aEnd > bLength) {
    map = new Map;
    let i = 0;
    while (i < bLength)
      map.set(b[i], i++);
    let write = 0;
    let read = 0;
    while (read < aEnd) {
      const node = a[read++];
      if (map.has(node))
        a[write++] = node;
      else
        parentNode.removeChild(get(node, -1));
    }
    aEnd = write;
  }
  while (aStart < aEnd || bStart < bEnd) {
    // append head, tail, or nodes in between: fast path
    if (aEnd === aStart) {
      const node = bEnd < bLength ?
        (bStart ?
          (get(b[bStart - 1], -0).nextSibling) :
          get(b[bEnd], 0)) :
        before;
      while (bStart < bEnd)
        insert(parentNode, get, b[bStart++], node);
    }
    // remove head or tail: fast path
    else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart]))
          parentNode.removeChild(get(a[aStart], -1));
        aStart++;
      }
    }
    // same node: fast path
    else if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
    }
    // same tail: fast path
    else if (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    // single last swap: fast path
    else if ((aEnd - aStart) === 1 && (bEnd - bStart) === 1) {
      if (map && map.has(a[aStart]))
        insert(
          parentNode,
          get,
          b[bStart],
          get(bEnd < bLength ? b[bEnd] : before, 0)
        );
      else
        parentNode.replaceChild(
          get(b[bStart], 1),
          get(a[aStart], -1)
        );
      aStart++;
      bStart++;
    }
    // adjacent swap: fast path
    else if (
      (aEnd - aStart) === 2 && (bEnd - bStart) === 2 &&
      a[aStart] === b[bStart + 1] &&
      a[aStart + 1] === b[bStart]
    ) {
      insert(parentNode, get, b[bStart], get(a[aStart], 0));
      aStart += 2;
      bStart += 2;
    }
    // reverse swap: also fast path
    else if (
      a[aStart] === b[bEnd - 1] &&
      b[bStart] === a[aEnd - 1]
    ) {
      const node = get(a[--aEnd], -0).nextSibling;
      insert(parentNode, get, b[bStart++], get(a[aStart++], -0).nextSibling);
      insert(parentNode, get, b[--bEnd], node);
      a[aEnd] = b[bEnd];
    }
    // map based fallback, "slow" path
    else {
      if (!map) {
        map = new Map;
        let i = bStart;
        while (i < bEnd)
          map.set(b[i], i++);
      }
      if (map.has(a[aStart])) {
        const index = map.get(a[aStart]);
        if (bStart < index && index < bEnd) {
          let i = aStart;
          let sequence = 1;
          while (++i < aEnd && i < bEnd && map.get(a[i]) === (index + sequence))
            sequence++;
          if (sequence > (index - bStart)) {
            const node = get(a[aStart], 0);
            while (bStart < index)
              insert(parentNode, get, b[bStart++], node);
          }
          else {
            parentNode.replaceChild(
              get(b[bStart++], 1),
              get(a[aStart++], -1)
            );
          }
        }
        else
          aStart++;
      }
      else
        parentNode.removeChild(get(a[aStart++], -1));
    }
  }
  return b;
};
