/**
 * Remove a node from the DOM
 * @param   {HTMLElement} node - target node to remove
 * @returns {undefined} void function
 */
export const drop = node => {
  const {parentNode} = node;

  if (parentNode) {
    if (node.remove) node.remove();
    else parentNode.removeChild(node);
  }
};