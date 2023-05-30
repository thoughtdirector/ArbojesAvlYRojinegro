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
 * Se resta la altura de la rama izquierda con la derecha
 * @param nodo
 * @returns {number}
 */
function obtenerFactorDeEquilibrio(nodo) {
  let lh = obtenerAltura(nodo.hijoIzquierdo);
  let rh = obtenerAltura(nodo.hijoDerecho);
  return lh - rh;
}

/**
 * Se obtiene el nodo mas a la izquierda (el menor)
 * @param nodo
 * @returns {*}
 */
function obtenerNodoMenor(nodo) {
  while (nodo.hijoIzquierdo) {
    nodo = nodo.hijoIzquierdo;
  }
  return nodo;
}

/**
 * ROTACION A LA DERECHA
 *
 * se define la rotacion hacia la derecha para ser usado
 * despues a la hora de balancear los arboles, toda la rotacion
 * se hace segun la altura de los nodos
 * @param nodo
 * @returns {*}
 */
function rotacionDerecha(nodo) {
  //      P      r
  //     /      / \
  //    r      H1  P
  //   / \        /
  //  H1 H2      H2
  // Se realiza el intercambio de nodos
  let r = nodo.hijoIzquierdo;
  nodo.hijoIzquierdo = r.hijoDerecho;
  if (nodo.hijoIzquierdo != null) {
    nodo.hijoIzquierdo.padre = nodo;
  }
  r.hijoDerecho = nodo;
  r.hijoDerecho.padre = r;
  r.padre = null;
  // Se actualiza la altura de los nodos
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
 *
 *se define la rotacion hacia la izquierda para ser usado
 * despues a la hora de balancear los arboles, toda la rotacion
 * se hace segun la altura de los nodos
 * @param nodo
 * @returns {*}
 */
function rotacionIzquierda(nodo) {
  //     P         r
  //      \       / \
  //       r     P  H2
  //      / \     \
  //     H1 H2     H1
  // Se realiza el intercambio de nodos
  let res = nodo.hijoDerecho;
  nodo.hijoDerecho = res.hijoIzquierdo;
  if (nodo.hijoDerecho != null) {
    nodo.hijoDerecho.padre = nodo;
  }
  res.hijoIzquierdo = nodo;
  res.hijoIzquierdo.padre = res;
  res.padre = null;
  // Se actualiza la altura de los nodos
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
 * Balance en arboles AVL
 * @param nodo
 * @returns {*}
 */
function balancearAVL(nodo) {
  // Caso 1
  //              P
  //            /
  //           H
  //         /
  //       N
  if (
    obtenerFactorDeEquilibrio(nodo) > 1 &&
    obtenerFactorDeEquilibrio(nodo.hijoIzquierdo) >= 0
  ) {
    nodo = rotacionDerecha(nodo);
  }
  // Caso 2
  //     P
  //      \
  //       H
  //        \
  //         N
  if (
    obtenerFactorDeEquilibrio(nodo) < -1 &&
    obtenerFactorDeEquilibrio(nodo.hijoDerecho) <= 0
  ) {
    nodo = rotacionIzquierda(nodo);
  }
  // Caso 3
  //     P
  //    /
  //  H
  //   \
  //    N
  if (
    obtenerFactorDeEquilibrio(nodo) > 1 &&
    obtenerFactorDeEquilibrio(nodo.hijoIzquierdo) < 0
  ) {
    nodo.hijoIzquierdo = rotacionIzquierda(nodo.hijoIzquierdo);
    nodo = rotacionDerecha(nodo);
  }
  // Caso 4
  //     P
  //      \
  //       H
  //     /
  //   N
  if (
    obtenerFactorDeEquilibrio(nodo) < -1 &&
    obtenerFactorDeEquilibrio(nodo.hijoDerecho) > 0
  ) {
    nodo.hijoDerecho = rotacionDerecha(nodo.hijoDerecho);
    nodo = rotacionIzquierda(nodo);
  }
  return nodo;
}

/**
 * Insercion de un nodo
 * @param nodo raiz donde se va a insertar
 * @param valor valor del nodo a insertar
 * @param estaBalanceado
 * @returns {Nodo|*}
 */
function insertarNodo(nodo, valor, estaBalanceado) {
  // Retorna un nuevo nodo si el arbol esta vacio
  if (nodo == null) {
    return new Nodo(valor);
  }
  // Inserta el nodo de manera recursiva, hasta llegar a la hoja
  if (valor < nodo.valor) {
    nodo.hijoIzquierdo = insertarNodo(
      nodo.hijoIzquierdo,
      valor,
      estaBalanceado
    );
  } else if (valor >= nodo.valor) {
    nodo.hijoDerecho = insertarNodo(nodo.hijoDerecho, valor, estaBalanceado);
  }
  // Recalcula altura, recursivamente de abajo hacia arriba
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
  // balancea el arbol si es necesario
  if (estaBalanceado) {
    nodo = balancearAVL(nodo);
  }
  return nodo;
}

/**
 * Eliminacion de un nodo
 * @param nodo raiz de don de se busca eliminar
 * @param valor valor del nodo a eliminar
 * @param estaBalanceado
 * @returns {Nodo|*}
 */
function EliminarNodo(nodo, valor, estaBalanceado) {
  // Retorna null si el arbol esta vacio
  if (nodo == null) {
    return null;
  }
  // Se busca el nodo a eliminar de manera recursiva
  if (valor < nodo.valor) {
    nodo.hijoIzquierdo = EliminarNodo(
      nodo.hijoIzquierdo,
      valor,
      estaBalanceado
    );
  } else if (valor > nodo.valor) {
    nodo.hijoDerecho = EliminarNodo(nodo.hijoDerecho, valor, estaBalanceado);
  } else {
    // El nodo actual es el nodo a eliminar
    if (nodo.hijoIzquierdo == null && nodo.hijoDerecho == null) {
      return null;
    } else if (nodo.hijoIzquierdo == null || nodo.hijoDerecho == null) {
      return nodo.hijoIzquierdo == null ? nodo.hijoDerecho : nodo.hijoIzquierdo;
    } else {
      // Se busca el reemplazo (el mas a la izquierda de la rama derecha)
      let min = obtenerNodoMenor(nodo.hijoDerecho);
      // Se elimina el reemplazo
      nodo.hijoDerecho = EliminarNodo(
        nodo.hijoDerecho,
        min.valor,
        estaBalanceado
      );
      nodo.valor = min.valor;
    }
  }
  // Se recalcula la altura de los nodos
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
  // Se balancea el arbol si es necesario
  if (estaBalanceado) {
    nodo = balancearAVL(nodo);
  }
  return nodo;
}

function esRojo(nodo) {
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
 * @param nodo raiz donde se busca
 * @param valor valor a elimina
 * @returns {Nodo|*}
 * @constructor
 */
function InsertarNodoRojoYNegro(nodo, valor) {
  // Retorna un nuevo nodo si el arbol esta vacio
  if (nodo == null) {
    return new Nodo(valor);
  }
  // Inserta el nodo de manera recursiva, hasta llegar a la hoja
  if (valor < nodo.valor) {
    nodo.hijoIzquierdo = InsertarNodoRojoYNegro(nodo.hijoIzquierdo, valor);
    nodo.hijoIzquierdo.padre = nodo;
  } else if (valor >= nodo.valor) {
    nodo.hijoDerecho = InsertarNodoRojoYNegro(nodo.hijoDerecho, valor);
    nodo.hijoDerecho.padre = nodo;
  }
  // Calcula la altura del nodo
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
  // Se usa el nodo como abuelo y se verifica si se necesita equilibrar
  if (esRojo(nodo.hijoIzquierdo) && esRojo(nodo.hijoDerecho)) {
    // Si el nodo padre del nodo insertado es de color rojo, y el hermano del nodo padre también es de color rojo,
    // es decir, abuelo->padre->nodo insertado = negro->rojo->rojo, se puede cambiar el color de las tres capas a rojo->negro->rojo.
    if (
      esRojo(nodo.hijoIzquierdo.hijoIzquierdo) ||
      esRojo(nodo.hijoIzquierdo.hijoDerecho) ||
      esRojo(nodo.hijoDerecho.hijoDerecho) ||
      esRojo(nodo.hijoDerecho.hijoIzquierdo)
    ) {
      nodo.hijoIzquierdo.color = NEGRO;
      nodo.hijoDerecho.color = NEGRO;
      nodo.color = ROJO;
    }
  } else if (esRojo(nodo.hijoIzquierdo)) {
    // El nodo padre del nodo insertado es de color rojo,
    // y el hermano del nodo padre es de color negro
    if (esRojo(nodo.hijoIzquierdo.hijoIzquierdo)) {
      // Rotar hacia la derecha el nodo abuelo.
      nodo.color = ROJO;
      nodo.hijoIzquierdo.color = NEGRO;
      nodo = rotacionDerecha(nodo);
    } else if (esRojo(nodo.hijoIzquierdo.hijoDerecho)) {
      // Rotar a la derecha y luego a la izquierda
      nodo.hijoIzquierdo = rotacionIzquierda(nodo.hijoIzquierdo);
      nodo.color = ROJO;
      nodo.hijoIzquierdo.color = NEGRO;
      nodo = rotacionDerecha(nodo);
    }
  } else if (esRojo(nodo.hijoDerecho)) {
    if (esRojo(nodo.hijoDerecho.hijoDerecho)) {
      // ++
      nodo.color = ROJO;
      nodo.hijoDerecho.color = NEGRO;
      nodo = rotacionIzquierda(nodo);
    } else if (esRojo(nodo.hijoDerecho.hijoIzquierdo)) {
      // +-
      nodo.hijoDerecho = rotacionDerecha(nodo.hijoDerecho);
      nodo.color = ROJO;
      nodo.hijoDerecho.color = NEGRO;
      nodo = rotacionIzquierda(nodo);
    }
  }
  return nodo;
}

/**
 * ELIMINACION DE NODOS ROJO Y NEGRO
 * @param nodo raiz donde se elimina
 * @param valor valor a eliminar
 * @returns {null|*}
 * @constructor
 */
function EliminarNodoRojinegro(nodo, valor) {
  // Si el arbol esta vacio no se hace nada
  if (nodo == null) {
    return;
  }
  if (valor < nodo.valor) {
    EliminarNodoRojinegro(nodo.hijoIzquierdo, valor);
  } else if (valor > nodo.valor) {
    EliminarNodoRojinegro(nodo.hijoDerecho, valor);
  } else {
    // Rotar hacia la derecha el nodo que se desea eliminar
    if (nodo.hijoIzquierdo == null && nodo.hijoDerecho == null) {
      // CASO #1 eliminar el nodo hoja
      arreglarNodoRojinegro(nodo);
      // Eliminar el nodo despues de haber arreglado el arbol
      if (nodo === nodo.padre.hijoIzquierdo) {
        nodo.padre.hijoIzquierdo = null;
      } else {
        nodo.padre.hijoDerecho = null;
      }
      nodo.padre = null;
    } else if (nodo.hijoIzquierdo == null || nodo.hijoDerecho == null) {
      // CASO #2 Eliminar el nodo que tiene un solo hijo
      //       -
      //     /    \
      //eliminado  -
      //   /      / \
      //  H      -   -
      // Eliminar el nodo y remplazarlo por su hijo
      let hijo =
        nodo.hijoIzquierdo == null ? nodo.hijoDerecho : nodo.hijoIzquierdo;
      nodo.valor = hijo.valor;
      // Cambiar a caso #1
      EliminarNodoRojinegro(hijo, hijo.valor);
    } else {
      // CASO #3 Encontrar el sucesor (El nodo mas a la izquierda de la rama derecha)
      let min = obtenerNodoMenor(nodo.hijoDerecho);
      nodo.valor = min.valor;
      // Se convierte en caso #1 o #2
      EliminarNodoRojinegro(min, min.valor);
    }
  }
  // Se actualiza la altura del nodo
  nodo.altura =
    Math.max(
      obtenerAltura(nodo.hijoIzquierdo),
      obtenerAltura(nodo.hijoDerecho)
    ) + 1;
}

/**
 * Arreglos que se deben hacer despues de eliminar un nodo
 * @param nodo
 */
function arreglarNodoRojinegro(nodo) {
  while (nodo.padre != null && nodo.color === NEGRO) {
    let padre = nodo.padre;
    let abuelo = padre.padre;
    let hermano;
    if (nodo.valor < padre.valor) {
      //Eliminar el nodo que es el hijo izquierdo de su nodo padre
      hermano = padre.hijoDerecho;
      if (!esRojo(hermano)) {
        //El hermano del nodo a eliminar es de color negro
        if (esRojo(hermano.hijoDerecho)) {
          // CASO #1 El hijo derecho del hermano del nodo a eliminar es de color rojo, mientras que el hijo izquierdo puede tener cualquier color. Es decir, se cumple la condición ++
          // Debido a la eliminación de un nodo negro en el subárbol izquierdo, simplemente toma un nodo rojo del subárbol derecho y lo cambia a negro
          //       R/N             N            R/N           R/N
          //       / \           /  \          /  \           / \
          //    elim  N   =>  elim  R/N   =>  N   N   =>    N    N
          //        /  \            / \      / \             \
          //       -   R          -    N   del  -             -
          hermano.color = padre.color;
          //Transfiere el color del nodo padre al hermano. Tanto el nodo padre como el hijo derecho del hermano se vuelven negros, luego se realiza una rotación hacia la izquierda
          padre.color = NEGRO;
          hermano.hijoDerecho.color = NEGRO;
          padre = rotacionIzquierda(padre);
          enlazarPadre(padre, abuelo);
          break;
        } else if (
          !esRojo(hermano.hijoDerecho) &&
          esRojo(hermano.hijoIzquierdo)
        ) {
          // CASO #2 El hijo izquierdo del hermano del nodo a eliminar es de color rojo, mientras que el hijo derecho es de color negro o nulo. Es decir, se cumple la condición +-
          //     R/N         R/N                   R/N
          //     / \          / \     Rotacion     / \
          //  elim  N  =>  elim  R    derecha   elim  N   =>  Se convierte en el caso 1 ++
          //      /             /       =>             \
          //     R            N                         R
          hermano.hijoIzquierdo.color = NEGRO;
          hermano.color = ROJO;
          hermano = rotacionDerecha(hermano);
          enlazarPadre(hermano, padre);
        } else if (
          !esRojo(hermano.hijoIzquierdo) &&
          !esRojo(hermano.hijoDerecho)
        ) {
          // CASO #3 El hermano del nodo no tiene hijos o todos sus hijos son de color negro
          //      R/N          R/N  <- Se vuelve a verificar el arbol desde aqui
          //     /  \    =>    / \
          //  elim   N      elim  R
          //        / \          / \
          //       N  N        N    N
          hermano.color = ROJO;
          nodo = padre;
        }
      } else {
        // CASO #4 Si el hermano del nodo es de color rojo, entonces el nodo padre es de color negro y el hermano tiene dos hijos negros
        //      N               R                   N
        //     / \            /  \   Rotacion      / \
        //  elim  R   =>   elim  N  izquierda     R  N   =>  Se convierte en caso 1/2/3
        //      / \        / \         =>        /\
        //     N  N       N  N               elim  N
        hermano.color = NEGRO;
        padre.color = ROJO;
        padre = rotacionIzquierda(padre);
        enlazarPadre(padre, abuelo);
      }
    } else {
      // Eliminar el nodo que es el hijo derecho de su nodo padre
      hermano = padre.hijoIzquierdo;
      if (!esRojo(hermano)) {
        // El hermano del nodo a eliminar es de color negro
        if (esRojo(hermano.hijoIzquierdo)) {
          // CASO #5 El hijo izquierdo del hermano del nodo a eliminar es de color rojo, mientras que el hijo derecho puede tener cualquier color. Es decir, se cumple la condición --
          hermano.color = padre.color;
          // Transfiere el color del nodo padre al hermano. Tanto el nodo padre como el hijo derecho del hermano se vuelven negros, luego se realiza una rotación hacia la izquierda
          padre.color = NEGRO;
          hermano.hijoIzquierdo.color = NEGRO;
          padre = rotacionDerecha(padre);
          enlazarPadre(padre, abuelo);
          break;
        } else if (
          !esRojo(hermano.hijoIzquierdo) &&
          esRojo(hermano.hijoDerecho)
        ) {
          // CASO #6 El hijo derecho del hermano del nodo a eliminar es de color rojo, mientras que el hijo izquierdo es de color negro o nulo. Es decir, se cumple la condición -+
          hermano.hijoDerecho.color = NEGRO;
          hermano.color = ROJO;
          hermano = rotacionIzquierda(hermano);
          enlazarPadre(hermano, padre);
        } else if (
          !esRojo(hermano.hijoIzquierdo) &&
          !esRojo(hermano.hijoDerecho)
        ) {
          // CASO #7 El hermano del nodo a eliminar no tiene hijos o todos sus hijos son de color negro
          hermano.color = ROJO;
          nodo = padre;
        }
      } else {
        // CASO #8 Si el hermano del nodo es de color rojo, entonces el nodo padre es de color negro y el hermano tiene dos hijos negros
        hermano.color = NEGRO;
        padre.color = ROJO;
        padre = rotacionDerecha(padre);
        enlazarPadre(padre, abuelo);
      }
    }
  }
  //Se cambia el color al final
  nodo.color = NEGRO;
}

/**
 * Se enlazan el nuevo hijo y padre, se verifica si sera hijo derecho o izquierdo
 * @param node nuevo hijo
 * @param padre
 */
function enlazarPadre(nodo, padre) {
  if (padre) {
    if (nodo.valor < padre.valor) {
      padre.hijoIzquierdo = nodo;
    } else {
      padre.hijoDerecho = nodo;
    }
    nodo.padre = padre;
  }
}
