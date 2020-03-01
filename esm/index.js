/**
 * ISC License
 *
 * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 *copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
export default (parentNode, a, b, get, before) => {
  const bLength = b.length;
  let aEnd = a.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let bMap = null;
  while (aStart < aEnd || bStart < bEnd) {
    // same node
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
    }
    // same tail
    else if (aEnd && bEnd && a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    // append head, tail, or nodes in between
    else if (aEnd === aStart) {
      const node = bEnd < bLength ?
        (bStart ?
          (get(b[bStart - 1], -0).nextSibling) :
          get(b[bEnd - bStart], 0)) :
        before;
      while (bStart < bEnd)
        parentNode.insertBefore(get(b[bStart++], 1), node);
    }
    // remove head or tail
    else if (bEnd === bStart) {
      while (aStart < aEnd)
        parentNode.removeChild(get(a[aStart++], -1));
    }
    // single swap
    else if ((aEnd - aStart) === 1 && (bEnd - bStart) === 1) {
      if (bMap && bMap.has(a[aStart])) {
        parentNode.insertBefore(
          get(b[bStart], 1),
          get(bEnd < bLength ?
            /* istanbul ignore next */ b[bEnd] : before, 0)
        );
      }
      else
        parentNode.replaceChild(get(b[bStart], 1), get(a[aStart], -1));
      aStart++;
      bStart++;
    }
    // reverse swap
    else if (
      a[aStart] === b[bEnd - 1] &&
      b[bStart] === a[aEnd - 1]
    ) {
      const node = get(a[--aEnd], -1).nextSibling;
      parentNode.insertBefore(
        get(b[bStart++], 1),
        get(a[aStart++], -1).nextSibling
      );
      parentNode.insertBefore(get(b[--bEnd], 1), node);
      // mark the future index as identical (yeah, it's dirty, but cheap 👍)
      a[aEnd] = b[bEnd];
    }
    // map based fallback
    else {
      if (!bMap) {
        bMap = new Map;
        let i = bStart;
        while (i < bEnd)
          bMap.set(b[i], i++);
      }
      // if it's a node to handle
      if (bMap.has(a[aStart])) {
        const index = bMap.get(a[aStart]);
        // if it's not already live
        if (bStart < index) {
          let ia = aStart;
          let sequence = 1;
          while (++ia < aEnd) {
            if (!bMap.has(a[ia]) || bMap.get(a[ia]) !== (index + sequence))
              break;
            sequence++;
          }
          // prepend the difference before a sequence, move the target forward
          if (sequence > (index - bStart)) {
            const node = get(a[aStart], 0);
            while (bStart < index)
              parentNode.insertBefore(get(b[bStart++], 1), node);
          }
          // replace fallback, move both source and target forward
          else {
            parentNode.replaceChild(
              get(b[bStart++], 1),
              get(a[aStart++], -1)
            );
          }
        }
        // otherwise move the source forward
        else
          aStart++;
      }
      // otherwise drop node
      else
        parentNode.removeChild(get(a[aStart++], -1));
    }
  }
  return b;
};
