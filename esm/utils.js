const DELETION = -1;
const INSERTION = 1;
const SKIP = 0;

export const HS = (
  futureNodes,
  futureStart,
  futureEnd,
  futureChanges,
  currentNodes,
  currentStart,
  currentEnd,
  currentChanges
) => {

  let k = 0;
  let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
  const link = Array(minLen++);
  const ktr = [];
  ktr.push(-1);

  for (let i = 1; i < minLen; i++)
    ktr.push(currentEnd);

  const nodes = currentNodes.slice(currentStart, currentEnd);

  for (let i = futureStart; i < futureEnd; i++) {
    const index = nodes.indexOf(futureNodes[i]);
    if (-1 < index) {
      const idxInOld = index + currentStart;
      k = findK(ktr, minLen, idxInOld);
      /* istanbul ignore else */
      if (-1 < k) {
        ktr[k] = idxInOld;
        link[k] = {
          newi: i,
          oldi: idxInOld,
          prev: link[k - 1]
        };
      }
    }
  }

  k = --minLen;
  --currentEnd;
  while (ktr[k] > currentEnd) --k;

  minLen = currentChanges + futureChanges - k;
  const diff = Array(minLen);
  let ptr = link[k];
  --futureEnd;
  while (ptr) {
    const {newi, oldi} = ptr;
    while (futureEnd > newi) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }
    while (currentEnd > oldi) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }
    diff[--minLen] = SKIP;
    --futureEnd;
    --currentEnd;
    ptr = ptr.prev;
  }
  while (futureEnd >= futureStart) {
    diff[--minLen] = INSERTION;
    --futureEnd;
  }
  while (currentEnd >= currentStart) {
    diff[--minLen] = DELETION;
    --currentEnd;
  }
  return diff;
};

export const applyDiff = (
  diff,
  get,
  parentNode,
  futureNodes,
  futureStart,
  currentNodes,
  currentStart,
  currentLength,
  before
) => {
  const live = [];
  const length = diff.length;
  let currentIndex = currentStart;
  let i = 0;
  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        futureStart++;
        currentIndex++;
        break;
      case INSERTION:
        // TODO: bulk appends for sequential nodes
        live.push(futureNodes[futureStart]);
        append(
          get,
          parentNode,
          futureNodes,
          futureStart++,
          futureStart,
          currentIndex < currentLength ?
            get(currentNodes[currentIndex], 0) :
            before
        );
        break;
      case DELETION:
        currentIndex++;
        break;
    }
  }
  i = 0;
  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        currentStart++;
        break;
      case DELETION:
        // TODO: bulk removes for sequential nodes
        if (-1 < live.indexOf(currentNodes[currentStart]))
          currentStart++;
        else
          remove(
            get,
            currentNodes,
            currentStart++,
            currentStart
          );
        break;
    }
  }
};

export const append = (get, parent, children, start, end, before) => {
  const isSelect = 'selectedIndex' in parent;
  let noSelection = isSelect;
  while (start < end) {
    const child = get(children[start], 1);
    parent.insertBefore(child, before);
    if (isSelect && noSelection && child.selected) {
      noSelection = !noSelection;
      const {selectedIndex} = parent;
      parent.selectedIndex = selectedIndex < 0 ?
        start :
        children.indexOf.call(parent.querySelectorAll('option'), child);
    }
    start++;
  }
};

const drop = node => (node.remove || dropChild).call(node);

export const next = (get, list, i, length, before) => i < length ?
              get(list[i], 0) :
              (0 < i ?
                get(list[i - 1], -0).nextSibling :
                before);

export const remove = (get, children, start, end) => {
  while (start < end)
    drop(get(children[start++], -1));
};

const findK = (ktr, length, j) => {
  let lo = 1;
  let hi = length;
  while (lo < hi) {
    const mid = ((lo + hi) / 2) >>> 0;
    if (j < ktr[mid])
      hi = mid;
    else
      lo = mid + 1;
  }
  return lo;
};

function dropChild() {
  const {parentNode} = this;
  /* istanbul ignore next */
  if (parentNode)
    parentNode.removeChild(this);
}
