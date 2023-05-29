const ROJO = 0;
const NEGRO = 1;

// Se define el nodo, con color rojo por defecto, porque es una hoja
function Nodo(valor) {
  this.altura = 1;
  this.valor = valor;
  this.hijoIzquierdo = null;
  this.hijoDerecho = null;
  this.padre = null;
  this.color = ROJO;
  this.ancho = 0;
  this.desplazamiento = 0;
}

// Si el nodo existe restorna la altura, delo contrario retorna 0
function obtenerAltura(nodo) {
  return nodo ? nodo.altura : 0;
}

/**
 * Se obtiene el factor de equilibrio del nodo
 * @param nodo
 * @returns {number}
 */
function getBalanceFactor(nodo) {
  let lh = obtenerAltura(nodo.hijoIzquierdo);
  let rh = obtenerAltura(nodo.hijoDerecho);
  return lh - rh;
}

/**
 * 获取排序树最小节点
 * @param node
 * @returns {*}
 */
function getBSTreeMin(node) {
  while (node.hijoIzquierdo) {
    node = node.hijoIzquierdo;
  }
  return node;
}

/**
 * ROTACION A LA DERECHA
 * @param nodo
 * @returns {*}
 */
function rightRotate(nodo) {
  let r = nodo.hijoIzquierdo;
  nodo.hijoIzquierdo = r.hijoDerecho;
  if (nodo.hijoIzquierdo != null) {
    nodo.hijoIzquierdo.padre = nodo;
  }
  r.hijoDerecho = nodo;
  r.hijoDerecho.padre = r;
  r.padre = null;
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
  r.altura =
    Math.max(obtenerAltura(r.hijoIzquierdo), obtenerAltura(r.hijoDerecho)) + 1;
  return r;
}

/**
 * ROTACION A LA IZQUIERDA
 * @param nodo
 * @returns {*}
 */
function leftRotate(nodo) {
  let res = nodo.hijoDerecho;
  nodo.hijoDerecho = res.hijoIzquierdo;
  if (nodo.hijoDerecho != null) {
    nodo.hijoDerecho.padre = nodo;
  }
  res.hijoIzquierdo = nodo;
  res.hijoIzquierdo.padre = res;
  res.padre = null;
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
  res.altura =
    Math.max(obtenerAltura(res.hijoIzquierdo), obtenerAltura(res.hijoDerecho)) +
    1;
  return res;
}

/**
 * BALANCE ARBOLES SEGUN
 * @param nodo
 * @returns {*}
 */
function balanceSelf(nodo) {
  if (getBalanceFactor(nodo) > 1 && getBalanceFactor(nodo.hijoIzquierdo) >= 0) {
    nodo = rightRotate(nodo);
  }
  if (getBalanceFactor(nodo) < -1 && getBalanceFactor(nodo.hijoDerecho) <= 0) {
    nodo = leftRotate(nodo);
  }
  if (getBalanceFactor(nodo) > 1 && getBalanceFactor(nodo.hijoIzquierdo) < 0) {
    nodo.hijoIzquierdo = leftRotate(nodo.hijoIzquierdo);
    nodo = rightRotate(nodo);
  }
  if (getBalanceFactor(nodo) < -1 && getBalanceFactor(nodo.hijoDerecho) > 0) {
    nodo.hijoDerecho = rightRotate(nodo.hijoDerecho);
    nodo = leftRotate(nodo);
  }
  return nodo;
}

/**
 * 搜索树插入节点
 * @param nodo
 * @param valor
 * @param selfBalance 自平衡为AVL
 * @returns {Nodo|*}
 */
function BSTreeInsert(nodo, valor, selfBalance) {
  if (nodo == null) {
    return new Nodo(valor);
  }
  if (valor < nodo.valor) {
    nodo.hijoIzquierdo = BSTreeInsert(nodo.hijoIzquierdo, valor, selfBalance);
  } else if (valor >= nodo.valor) {
    nodo.hijoDerecho = BSTreeInsert(nodo.hijoDerecho, valor, selfBalance);
  }
  // 重新计算高度，递归自底向上
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
  // AVL树平衡用
  if (selfBalance) {
    nodo = balanceSelf(nodo);
  }
  return nodo;
}

/**
 * 搜索树删除节点
 * @param nodo
 * @param valor
 * @param selfBalance 自平衡为AVL
 * @returns {Nodo|*}
 */
function BSTreeRemove(nodo, valor, selfBalance) {
  if (nodo == null) {
    return null;
  }
  if (valor < nodo.valor) {
    nodo.hijoIzquierdo = BSTreeRemove(nodo.hijoIzquierdo, valor, selfBalance);
  } else if (valor > nodo.valor) {
    nodo.hijoDerecho = BSTreeRemove(nodo.hijoDerecho, valor, selfBalance);
  } else {
    // 当前节点为待删除节点
    if (nodo.hijoIzquierdo == null && nodo.hijoDerecho == null) {
      return null;
    } else if (nodo.hijoIzquierdo == null || nodo.hijoDerecho == null) {
      return nodo.hijoIzquierdo == null ? nodo.hijoDerecho : nodo.hijoIzquierdo;
    } else {
      // 左右子节点都不为空，找到右子节点的最小子节点
      let min = getBSTreeMin(nodo.hijoDerecho);
      // 删除最小子节点
      nodo.hijoDerecho = BSTreeRemove(nodo.hijoDerecho, min.valor, selfBalance);
      nodo.valor = min.valor;
    }
  }
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
  if (selfBalance) {
    nodo = balanceSelf(nodo);
  }
  return nodo;
}

function isRed(nodo) {
  if (nodo == null) return false;
  return nodo.color === ROJO;
}

function obtenerRaiz(nodo) {
  if (nodo.padre) {
    return nodo.padre;
  }
  return nodo;
}

/**
 * INSERTAR NODO ARBOL ROJO Y NEGRO
 * @param nodo
 * @param valor
 * @returns {Nodo|*}
 * @constructor
 */
function RBTreeInsert(nodo, valor) {
  if (nodo == null) {
    return new Nodo(valor);
  }
  if (valor < nodo.valor) {
    nodo.hijoIzquierdo = RBTreeInsert(nodo.hijoIzquierdo, valor);
    nodo.hijoIzquierdo.padre = nodo;
  } else if (valor >= nodo.valor) {
    nodo.hijoDerecho = RBTreeInsert(nodo.hijoDerecho, valor);
    nodo.hijoDerecho.padre = nodo;
  }
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
  if (isRed(nodo.hijoIzquierdo) && isRed(nodo.hijoDerecho)) {
    if (
      isRed(nodo.hijoIzquierdo.hijoIzquierdo) ||
      isRed(nodo.hijoIzquierdo.hijoDerecho) ||
      isRed(nodo.hijoDerecho.hijoDerecho) ||
      isRed(nodo.hijoDerecho.hijoIzquierdo)
    ) {
      nodo.hijoIzquierdo.color = NEGRO;
      nodo.hijoDerecho.color = NEGRO;
      nodo.color = ROJO;
    }
  } else if (isRed(nodo.hijoIzquierdo)) {
    if (isRed(nodo.hijoIzquierdo.hijoIzquierdo)) {
      // LL
      nodo.color = ROJO;
      nodo.hijoIzquierdo.color = NEGRO;
      nodo = rightRotate(nodo);
    } else if (isRed(nodo.hijoIzquierdo.hijoDerecho)) {
      // LR
      nodo.hijoIzquierdo = leftRotate(nodo.hijoIzquierdo);
      nodo.color = ROJO;
      nodo.hijoIzquierdo.color = NEGRO;
      nodo = rightRotate(nodo);
    }
  } else if (isRed(nodo.hijoDerecho)) {
    if (isRed(nodo.hijoDerecho.hijoDerecho)) {
      // RR
      nodo.color = ROJO;
      nodo.hijoDerecho.color = NEGRO;
      nodo = leftRotate(nodo);
    } else if (isRed(nodo.hijoDerecho.hijoIzquierdo)) {
      // RL
      nodo.hijoDerecho = rightRotate(nodo.hijoDerecho);
      nodo.color = ROJO;
      nodo.hijoDerecho.color = NEGRO;
      nodo = leftRotate(nodo);
    }
  }
  return nodo;
}

/**
 * ELIMINACION DE NODOS ROJO Y NEGRO
 * @param nodo
 * @param valor
 * @returns {null|*}
 * @constructor
 */
function RBTreeRemove(nodo, valor) {
  if (nodo == null) {
    return;
  }
  if (valor < nodo.valor) {
    RBTreeRemove(nodo.hijoIzquierdo, valor);
  } else if (valor > nodo.valor) {
    RBTreeRemove(nodo.hijoDerecho, valor);
  } else {
    if (nodo.hijoIzquierdo == null && nodo.hijoDerecho == null) {
      // CASO #1
      fixRBNode(nodo);
      if (nodo === nodo.padre.hijoIzquierdo) {
        nodo.padre.hijoIzquierdo = null;
      } else {
        nodo.padre.hijoDerecho = null;
      }
      nodo.padre = null;
    } else if (nodo.hijoIzquierdo == null || nodo.hijoDerecho == null) {
      // CASO #2
      let child =
        nodo.hijoIzquierdo == null ? nodo.hijoDerecho : nodo.hijoIzquierdo;
      nodo.valor = child.valor;
      //CASO #1
      RBTreeRemove(child, child.valor);
    } else {
      // CASO #3
      let min = getBSTreeMin(nodo.hijoDerecho);
      nodo.valor = min.valor;
      // 转为CASO #1或CASO #2
      RBTreeRemove(min, min.valor);
    }
  }
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
}

/**
 * ARREGLOS SEGUN ELIMINACION ROJO Y NEGRO
 * @param nodo
 * @returns {*}
 */
function fixRBNode2(nodo) {
  let padre = nodo.padre;
  if (padre == null) {
    return nodo;
  }
  let grand = nodo.padre.padre;
  let brother;
  if (nodo.color === NEGRO) {
    if (nodo.valor < padre.valor) {
      brother = padre.hijoDerecho;
      if (isRed(brother)) {
        brother.color = NEGRO;
        brother.hijoIzquierdo.color = ROJO;
        padre = leftRotate(padre);
        linkParent(padre, grand);
        return padre;
      } else {
        if (brother.hijoIzquierdo == null && brother.hijoDerecho == null) {
          brother.color = ROJO;
          return fixRBNode2(padre);
        } else if (brother.hijoDerecho == null) {
          brother.hijoIzquierdo.color = NEGRO;
          brother.color = ROJO;
          brother = rightRotate(brother);
          padre.hijoDerecho = brother;
          brother.padre = padre;
          brother.color = padre.color;
          padre.color = NEGRO;
          brother.hijoDerecho.color = NEGRO;
          padre = leftRotate(padre);
          linkParent(padre, grand);
          return padre;
        } else {
          brother.color = padre.color;
          padre.color = NEGRO;
          brother.hijoDerecho.color = NEGRO;
          padre = leftRotate(padre);
          linkParent(padre, grand);
          return padre;
        }
      }
    } else {
      brother = padre.hijoIzquierdo;
      if (isRed(brother)) {
        brother.color = NEGRO;
        brother.hijoDerecho.color = ROJO;
        padre = rightRotate(padre);
        linkParent(padre, grand);
        return padre;
      } else {
        if (brother.hijoIzquierdo == null && brother.hijoDerecho == null) {
          brother.color = ROJO;
          return fixRBNode2(padre);
        } else if (brother.hijoIzquierdo == null) {
          brother.hijoDerecho.color = NEGRO;
          brother.color = ROJO;
          brother = leftRotate(brother);
          padre.hijoIzquierdo = brother;
          brother.padre = padre;
          brother.color = padre.color;
          padre.color = NEGRO;
          brother.hijoIzquierdo.color = NEGRO;
          padre = rightRotate(padre);
          linkParent(padre, grand);
          return padre;
        } else {
          brother.color = padre.color;
          padre.color = NEGRO;
          brother.hijoIzquierdo.color = NEGRO;
          padre = rightRotate(padre);
          linkParent(padre, grand);
          return padre;
        }
      }
    }
  }
  return nodo;
}

/**
 * SE SELECCIONA EL CASO SEGUN LA ELIMINACION
 * @param nodo
 */
function fixRBNode(nodo) {
  while (nodo.padre != null && nodo.color === NEGRO) {
    let padre = nodo.padre;
    let grand = padre.padre;
    let brother;
    if (nodo.valor < padre.valor) {
      brother = padre.hijoDerecho;
      if (!isRed(brother)) {
        if (isRed(brother.hijoDerecho)) {
          // CASO #1
          brother.color = padre.color;
          padre.color = NEGRO;
          brother.hijoDerecho.color = NEGRO;
          padre = leftRotate(padre);
          linkParent(padre, grand);
          break;
        } else if (
          !isRed(brother.hijoDerecho) &&
          isRed(brother.hijoIzquierdo)
        ) {
          // CASO #2
          brother.hijoIzquierdo.color = NEGRO;
          brother.color = ROJO;
          brother = rightRotate(brother);
          linkParent(brother, padre);
        } else if (
          !isRed(brother.hijoIzquierdo) &&
          !isRed(brother.hijoDerecho)
        ) {
          // CASO #3
          brother.color = ROJO;
          nodo = padre;
        }
      } else {
        // CASO #4
        brother.color = NEGRO;
        padre.color = ROJO;
        padre = leftRotate(padre);
        linkParent(padre, grand);
      }
    } else {
      brother = padre.hijoIzquierdo;
      if (!isRed(brother)) {
        if (isRed(brother.hijoIzquierdo)) {
          // CASO #5
          brother.color = padre.color;
          padre.color = NEGRO;
          brother.hijoIzquierdo.color = NEGRO;
          padre = rightRotate(padre);
          linkParent(padre, grand);
          break;
        } else if (
          !isRed(brother.hijoIzquierdo) &&
          isRed(brother.hijoDerecho)
        ) {
          // CASO #6
          brother.hijoDerecho.color = NEGRO;
          brother.color = ROJO;
          brother = leftRotate(brother);
          linkParent(brother, padre);
        } else if (
          !isRed(brother.hijoIzquierdo) &&
          !isRed(brother.hijoDerecho)
        ) {
          // CASO #7
          brother.color = ROJO;
          nodo = padre;
        }
      } else {
        // CASO #8
        brother.color = NEGRO;
        padre.color = ROJO;
        padre = rightRotate(padre);
        linkParent(padre, grand);
      }
    }
  }
  //SE CAMBIA EL COLOR AL FINAL
  nodo.color = NEGRO;
}

function linkParent(nodo, padre) {
  if (padre) {
    if (nodo.valor < padre.valor) {
      padre.hijoIzquierdo = nodo;
    } else {
      padre.hijoDerecho = nodo;
    }
    nodo.padre = padre;
  }
}
