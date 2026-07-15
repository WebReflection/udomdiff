var udomdiff = (function (exports) {
  'use strict';

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
   * @param {Node} parentNode The container where children live
   * @param {Node[]} a The list of current/live children
   * @param {Node[]} b The list of future children
   * @param {(entry: Node, action: number) => Node} get
   * The callback invoked per each entry related DOM operation.
   * @param {Node} [before] The optional node used as anchor to insert before.
   * @returns {Node[]} The same list of future children.
   */
  var index = (function (parentNode, a, b, get, before) {
    var bLength = b.length;
    var aEnd = a.length;
    var bEnd = bLength;
    var aStart = 0;
    var bStart = 0;
    var map = null;
    var moveBefore = parentNode.moveBefore;
    var insert = moveBefore ? function (entry, ref) {
      var node = get(entry, 1);
      if (node.parentNode === parentNode) moveBefore.call(parentNode, node, ref);else parentNode.insertBefore(node, ref);
    } : function (entry, ref) {
      return parentNode.insertBefore(get(entry, 1), ref);
    };
    while (aStart < aEnd || bStart < bEnd) {
      // append head, tail, or nodes in between: fast path
      if (aEnd === aStart) {
        // we could be in a situation where the rest of nodes that
        // need to be added are not at the end, and in such case
        // the node to `insertBefore`, if the index is more than 0
        // must be retrieved, otherwise it's gonna be the first item.
        var node = bEnd < bLength ? bStart ? get(b[bStart - 1], -0).nextSibling : get(b[bEnd], 0) : before;
        while (bStart < bEnd) insert(b[bStart++], node);
      }
      // remove head or tail: fast path
      else if (bEnd === bStart) {
        while (aStart < aEnd) {
          // remove the node only if it's unknown or not live
          if (!map || !map.has(a[aStart])) parentNode.removeChild(get(a[aStart], -1));
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
      else if (aEnd - aStart === 1 && bEnd - bStart === 1) {
        if (map && map.has(a[aStart])) insert(b[bStart], get(bEnd < bLength ? b[bEnd] : before, 0));else parentNode.replaceChild(get(b[bStart], 1), get(a[aStart], -1));
        aStart++;
        bStart++;
      }
      // adjacent swap: fast path
      else if (aEnd - aStart === 2 && bEnd - bStart === 2 && a[aStart] === b[bStart + 1] && a[aStart + 1] === b[bStart]) {
        insert(b[bStart], get(a[aStart], 0));
        aStart += 2;
        bStart += 2;
      }
      // reverse swap: also fast path
      else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        // this is a "shrink" operation that could happen in these cases:
        // [1, 2, 3, 4, 5]
        // [1, 4, 3, 2, 5]
        // or asymmetric too
        // [1, 2, 3, 4, 5]
        // [1, 2, 3, 5, 6, 4]
        var _node = get(a[--aEnd], -0).nextSibling;
        insert(b[bStart++], get(a[aStart++], -0).nextSibling);
        insert(b[--bEnd], _node);
        // mark the future index as identical (yeah, it's dirty, but cheap 👍)
        // The main reason to do this, is that when a[aEnd] will be reached,
        // the loop will likely be on the fast path, as identical to b[bEnd].
        // In the best case scenario, the next loop will skip the tail,
        // but in the worst one, this node will be considered as already
        // processed, bailing out pretty quickly from the map index check
        a[aEnd] = b[bEnd];
      }
      // map based fallback, "slow" path
      else {
        if (!map) {
          map = new Map();
          var i = bStart;
          while (i < bEnd) map.set(b[i], i++);
        }
        if (map.has(a[aStart])) {
          var index = map.get(a[aStart]);
          if (bStart < index && index < bEnd) {
            var _i = aStart;
            var sequence = 1;
            while (++_i < aEnd && _i < bEnd && map.get(a[_i]) === index + sequence) sequence++;
            if (sequence > index - bStart) {
              var _node2 = get(a[aStart], 0);
              while (bStart < index) insert(b[bStart++], _node2);
            } else {
              parentNode.replaceChild(get(b[bStart++], 1), get(a[aStart++], -1));
            }
          } else aStart++;
        } else parentNode.removeChild(get(a[aStart++], -1));
      }
    }
    return b;
  });

  exports["default"] = index;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
