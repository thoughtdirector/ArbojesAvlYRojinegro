const RED = 0;
const BLACK = 1;

function Node(value) {
  this.height = 1;
  this.value = value;
  this.left = null;
  this.right = null;
  this.parent = null;
  // SE DEFINE EL COLOR DEL NODO (ARBOLES ROJO Y NEGRO)
  this.color = RED;
  this.width = 0;
  this.offset = 0;
}

function getHeight(node) {
  return node ? node.height : 0;
}

/**
 * SE OPTIENE EL FACTOR DE EQUILIBRIO
 * @param node
 * @returns {number}
 */
function getBalanceFactor(node) {
  let lh = getHeight(node.left);
  let rh = getHeight(node.right);
  return lh - rh;
}



/**
 * ROTACION A LA DERECHA
 * @param node
 * @returns {*}
 */
function rightRotate(node) {
  let r = node.left;
  node.left = r.right;
  if (node.left != null) {
    node.left.parent = node;
  }
  r.right = node;
  r.right.parent = r;
  r.parent = null;
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  r.height = Math.max(getHeight(r.left), getHeight(r.right)) + 1;
  return r;
}

/**
 * ROTACION A LA IZQUIERDA
 * @param node
 * @returns {*}
 */
function leftRotate(node) {
  let res = node.right;
  node.right = res.left;
  if (node.right != null) {
    node.right.parent = node;
  }
  res.left = node;
  res.left.parent = res;
  res.parent = null;
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  res.height = Math.max(getHeight(res.left), getHeight(res.right)) + 1;
  return res;
}

/**
 * BALANCE ARBOLES SEGUN
 * @param node
 * @returns {*}
 */
function balanceSelf(node) {
  if (getBalanceFactor(node) > 1 && getBalanceFactor(node.left) >= 0) {
    node = rightRotate(node);
  }
  if (getBalanceFactor(node) < -1 && getBalanceFactor(node.right) <= 0) {
    node = leftRotate(node);
  }
  if (getBalanceFactor(node) > 1 && getBalanceFactor(node.left) < 0) {
    node.left = leftRotate(node.left);
    node = rightRotate(node);
  }
  if (getBalanceFactor(node) < -1 && getBalanceFactor(node.right) > 0) {
    node.right = rightRotate(node.right);
    node = leftRotate(node);
  }
  return node;
}

/**
 * INSERTAR NODO ARBOL ROJO Y NEGRO
 * @param node
 * @param value
 * @returns {Node|*}
 * @constructor
 */
function RBTreeInsert(node, value) {
  if (node == null) {
    return new Node(value);
  }
  if (value < node.value) {
    node.left = RBTreeInsert(node.left, value);
    node.left.parent = node;
  } else if (value >= node.value) {
    node.right = RBTreeInsert(node.right, value);
    node.right.parent = node;
  }
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  if (isRed(node.left) && isRed(node.right)) {
    if (
      isRed(node.left.left) ||
      isRed(node.left.right) ||
      isRed(node.right.right) ||
      isRed(node.right.left)
    ) {
      node.left.color = BLACK;
      node.right.color = BLACK;
      node.color = RED;
    }
  } else if (isRed(node.left)) {
    if (isRed(node.left.left)) {
      // LL
      node.color = RED;
      node.left.color = BLACK;
      node = rightRotate(node);
    } else if (isRed(node.left.right)) {
      // LR
      node.left = leftRotate(node.left);
      node.color = RED;
      node.left.color = BLACK;
      node = rightRotate(node);
    }
  } else if (isRed(node.right)) {
    if (isRed(node.right.right)) {
      // RR
      node.color = RED;
      node.right.color = BLACK;
      node = leftRotate(node);
    } else if (isRed(node.right.left)) {
      // RL
      node.right = rightRotate(node.right);
      node.color = RED;
      node.right.color = BLACK;
      node = leftRotate(node);
    }
  }
  return node;
}

/**
 * ELIMINACION DE NODOS ROJO Y NEGRO
 * @param node
 * @param value
 * @returns {null|*}
 * @constructor
 */
function RBTreeRemove(node, value) {
  if (node == null) {
    return;
  }
  if (value < node.value) {
    RBTreeRemove(node.left, value);
  } else if (value > node.value) {
    RBTreeRemove(node.right, value);
  } else {
    if (node.left == null && node.right == null) {
      // CASO #1 
      fixRBNode(node);
      if (node === node.parent.left) {
        node.parent.left = null;
      } else {
        node.parent.right = null;
      }
      node.parent = null;
    } else if (node.left == null || node.right == null) {
      // CASO #2
      let child = node.left == null ? node.right : node.left;
      node.value = child.value;
      //CASO #1
      RBTreeRemove(child, child.value);
    } else {
      // CASO #3 
      let min = getBSTreeMin(node.right);
      node.value = min.value;
      // 转为CASO #1或CASO #2
      RBTreeRemove(min, min.value);
    }
  }
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
}

/**
 * ARREGLOS SEGUN ELIMINACION ROJO Y NEGRO
 * @param node
 * @returns {*}
 */
function fixRBNode2(node) {
  let parent = node.parent;
  if (parent == null) {
    return node;
  }
  let grand = node.parent.parent;
  let brother;
  if (node.color === BLACK) {
    if (node.value < parent.value) {
      brother = parent.right;
      if (isRed(brother)) {
        brother.color = BLACK;
        brother.left.color = RED;
        parent = leftRotate(parent);
        linkParent(parent, grand);
        return parent;
      } else {
        if (brother.left == null && brother.right == null) {
          brother.color = RED;
          return fixRBNode2(parent);
        } else if (brother.right == null) {
          brother.left.color = BLACK;
          brother.color = RED;
          brother = rightRotate(brother);
          parent.right = brother;
          brother.parent = parent;
          brother.color = parent.color;
          parent.color = BLACK;
          brother.right.color = BLACK;
          parent = leftRotate(parent);
          linkParent(parent, grand);
          return parent;
        } else {
          brother.color = parent.color;
          parent.color = BLACK;
          brother.right.color = BLACK;
          parent = leftRotate(parent);
          linkParent(parent, grand);
          return parent;
        }
      }
    } else {
      brother = parent.left;
      if (isRed(brother)) {
        brother.color = BLACK;
        brother.right.color = RED;
        parent = rightRotate(parent);
        linkParent(parent, grand);
        return parent;
      } else {
        if (brother.left == null && brother.right == null) {
          brother.color = RED;
          return fixRBNode2(parent);
        } else if (brother.left == null) {
          brother.right.color = BLACK;
          brother.color = RED;
          brother = leftRotate(brother);
          parent.left = brother;
          brother.parent = parent;
          brother.color = parent.color;
          parent.color = BLACK;
          brother.left.color = BLACK;
          parent = rightRotate(parent);
          linkParent(parent, grand);
          return parent;
        } else {
          brother.color = parent.color;
          parent.color = BLACK;
          brother.left.color = BLACK;
          parent = rightRotate(parent);
          linkParent(parent, grand);
          return parent;
        }
      }
    }
  }
  return node;
}

/**
 * SE SELECCIONA EL CASO SEGUN LA ELIMINACION
 * @param node
 */
function fixRBNode(node) {
  while (node.parent != null && node.color === BLACK) {
    let parent = node.parent;
    let grand = parent.parent;
    let brother;
    if (node.value < parent.value) {
      brother = parent.right;
      if (!isRed(brother)) {
        if (isRed(brother.right)) {
          // CASO #1
          brother.color = parent.color;
          parent.color = BLACK;
          brother.right.color = BLACK;
          parent = leftRotate(parent);
          linkParent(parent, grand);
          break;
        } else if (!isRed(brother.right) && isRed(brother.left)) {
          // CASO #2 
          brother.left.color = BLACK;
          brother.color = RED;
          brother = rightRotate(brother);
          linkParent(brother, parent);
        } else if (!isRed(brother.left) && !isRed(brother.right)) {
          // CASO #3
          brother.color = RED;
          node = parent;
        }
      } else {
        // CASO #4 
        brother.color = BLACK;
        parent.color = RED;
        parent = leftRotate(parent);
        linkParent(parent, grand);
      }
    } else {
      brother = parent.left;
      if (!isRed(brother)) {
        if (isRed(brother.left)) {
          // CASO #5
          brother.color = parent.color;
          parent.color = BLACK;
          brother.left.color = BLACK;
          parent = rightRotate(parent);
          linkParent(parent, grand);
          break;
        } else if (!isRed(brother.left) && isRed(brother.right)) {
          // CASO #6 
          brother.right.color = BLACK;
          brother.color = RED;
          brother = leftRotate(brother);
          linkParent(brother, parent);
        } else if (!isRed(brother.left) && !isRed(brother.right)) {
          // CASO #7 
          brother.color = RED;
          node = parent;
        }
      } else {
        // CASO #8
        brother.color = BLACK;
        parent.color = RED;
        parent = rightRotate(parent);
        linkParent(parent, grand);
      }
    }
  }
  //SE CAMBIA EL COLOR AL FINAL
  node.color = BLACK;
}

function linkParent(node, parent) {
  if (parent) {
    if (node.value < parent.value) {
      parent.left = node;
    } else {
      parent.right = node;
    }
    node.parent = parent;
  }
}
