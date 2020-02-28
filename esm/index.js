import {HS, applyDiff, append, remove} from './utils.js';

export default (
  parentNode,
  currentNodes,
  futureNodes,
  get,
  before
) => {
  const currentLength = currentNodes.length;
  let currentEnd = currentLength;
  let currentStart = 0;

  let futureEnd = futureNodes.length;
  let futureStart = 0;

  // common prefix
  while (
    currentStart < currentEnd &&
    futureStart < futureEnd &&
    currentNodes[currentStart] === futureNodes[futureStart]
  ) {
    currentStart++;
    futureStart++;
  }

  // common suffix
  while (
    currentStart < currentEnd &&
    futureStart < futureEnd &&
    currentNodes[currentEnd - 1] === futureNodes[futureEnd - 1]
  ) {
    currentEnd--;
    futureEnd--;
  }

  const currentSame = currentStart === currentEnd;
  const futureSame = futureStart === futureEnd;

  // same list
  if (currentSame && futureSame)
    return futureNodes;

  // only stuff to add
  if (currentSame && futureStart < futureEnd) {
    append(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      before
    );
    return futureNodes;
  }

  // only stuff to remove
  if (futureSame && currentStart < currentEnd) {
    remove(
      get,
      currentNodes,
      currentStart,
      currentEnd
    );
    return futureNodes;
  }

  // last fallback with a simplified Hunt Szymanski algorithm
  applyDiff(
    HS(
      futureNodes,
      futureStart,
      futureEnd,
      futureEnd - futureStart,
      currentNodes,
      currentStart,
      currentEnd,
      currentEnd - currentStart
    ),
    get,
    parentNode,
    futureNodes,
    futureStart,
    currentNodes,
    currentStart,
    currentLength,
    before
  );

  return futureNodes;
};
