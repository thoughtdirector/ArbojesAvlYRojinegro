// matriz de entrada
var array;

// -------------ARBOLES AVL---------------

/**
 * CREACION ARBOL AVL
 */

function generateAVL() {
  root = null;
  insertAVL();
}

/**
 * INSERTAR NUEVOS NODOS ARBOL AVL
 */

function insertAVL() {
  let input = document.getElementById("inputAVL");
  array = input.value.split(",");

  for (let i = 0; i < array.length; i++) {
    let num = parseInt(array[i]);
    if (!isNaN(num)) {
      root = BSTreeInsert(root, num, true);
    }
  }
  showTree();
}

/**
 * REMOVER NODOS ARBOL AVL
 */
function removeAVL() {
  let input = document.getElementById("inputAVL");
  let array = input.value.split(",");
  for (let i = 0; i < array.length; i++) {
    let num = parseInt(array[i]);
    if (!isNaN(num)) {
      root = BSTreeRemove(root, num, true);
    }
  }
  showTree();
}

// -------------ARBOLES ROJO Y NEGRO---------------

/**
 * CREACION ARBOL ROJO Y NEGRO
 */

function generateRBTree() {
  root = null;
  insertRBTree();
}

/**
 * INSERTAR NUEVOS NODOS ARBOL ROJO Y NEGRO
 */

function insertRBTree() {
  let input = document.getElementById("inputRBT");
  array = input.value.split(",");

  for (let i = 0; i < array.length; i++) {
    let num = parseInt(array[i]);
    if (!isNaN(num)) {
      root = RBTreeInsert(root, num);
      root.color = NEGRO;
    }
  }
  showTree(true);
}

/**
 * REMOVER NODOS ARBOL AVL
 */

function removeRBTree() {
  let input = document.getElementById("inputRBT");
  let array = input.value.split(",");
  for (let i = 0; i < array.length; i++) {
    let num = parseInt(array[i]);
    if (!isNaN(num)) {
      if (
        root == null ||
        (root.hijoIzquierdo == null && root.hijoDerecho == null)
      ) {
        root = null;
        break;
      } else {
        RBTreeRemove(root, num);
        root = getRoot(root);
      }
    }
  }
  showTree(true);
}

// -------------GRAFICAS ---------------

/**
 * MOSTRAR ARBOLES
 */

function showTree(color = false) {
  measure(root);
  initCanvas();
  clear();
  render(root, canvas.width / 2, 10 + radius, color);
}

var radius = 20;
var spacing = 20;
var height = radius * 2 + 30;
var padding = 20;

/***
 * CREAR CANVA EN BLANCO
 */

var root = null;
var canvas = null;
var ctx = null;

/***
 * CAMBIAR TAMAÑO CANVA
 */

function initCanvas() {
  canvas = document.getElementById("canvas");
  const cvHeight = (root.altura - 1) * height + radius * 2 + padding * 2;
  const cvWidth = root.ancho + padding * 2;
  canvas.style.height = cvHeight + "px";
  canvas.style.width = cvWidth + "px";
  canvas.height = cvHeight;
  canvas.width = cvWidth;
  ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold " + 20 + "px serif";
}

/***
 * LIMPIAR CANVA
 */

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 *
 * @param nodo
 */

function measure(nodo) {
  if (nodo == null) {
    return;
  }
  if (!nodo.hijoIzquierdo && !nodo.hijoDerecho) {
    nodo.isLinkedList = true;
    nodo.ancho = radius * 2;
    return;
  }
  measure(nodo.hijoIzquierdo);
  measure(nodo.hijoDerecho);

  // ANCHO SUB ARBOL IZQUIERDO Y DERECHO
  let leftWidth = getWidth(nodo.hijoIzquierdo);
  let rightWidth = getWidth(nodo.hijoDerecho);

  let fixNode = null;
  if (!nodo.hijoIzquierdo || !nodo.hijoDerecho) {
    nodo.ancho = leftWidth + rightWidth;
    nodo.ancho += spacing;
    nodo.desplazamiento = spacing / 2;
  } else {
    // SE DEFINE EL NUEVO ESPACIO A OCUPAR
    let childSpace = Math.max(rightWidth, leftWidth);
    let factor =
      obtenerAltura(nodo.hijoIzquierdo) - obtenerAltura(nodo.hijoDerecho);
    nodo.ancho = childSpace * 2;
    nodo.desplazamiento = childSpace / 2;
    let mixWidth = Math.abs(leftWidth - rightWidth) / 2;
    if (factor > 0) {
      if (leftWidth >= rightWidth) {
        // SE ACERCAN LOS NODOS PARA REDUCIR ESPACIO
        let div = Math.pow(2, obtenerAltura(nodo.hijoDerecho));
        let leftSpace = leftWidth / div - radius;
        if (leftSpace < 0) {
          leftSpace = 0;
        }
        mixWidth += leftSpace;
        fixNode = nodo.hijoIzquierdo;
      }
    } else if (factor < 0) {
      if (rightWidth >= leftWidth) {
        let div = Math.pow(2, obtenerAltura(nodo.hijoIzquierdo));
        let rightSpace = rightWidth / div - radius;
        if (rightSpace < 0) {
          rightSpace = 0;
        }
        mixWidth += rightSpace;
        fixNode = nodo.hijoDerecho;
      }
    }
    nodo.ancho -= mixWidth;
    nodo.desplazamiento -= mixWidth / 2;
    // SE AÑADE EL ESPACIO ENTRE NODOS
    nodo.ancho += spacing;
    nodo.desplazamiento += spacing / 2;
    // SE GENERA DISTANCIA ENTRE LOS NODOS HIJOS
    let distance = childSpace - mixWidth + spacing;
    if (fixNode) {
      let fix = fixWidth(fixNode.desplazamiento, distance);
      nodo.ancho += fix;
      nodo.desplazamiento += fix / 2;
    }
  }
}

/**
 *
 * @param desplazamiento
 * @param distance
 * @returns {number}
 */
function fixWidth(desplazamiento, distance) {
  // VERIFICAR SI HAY NODOS O LINEAS SUPERPUESTAS
  if (Math.atan(height / desplazamiento) < Math.asin(radius / distance)) {
    let sR = radius * radius;
    let sF = desplazamiento * desplazamiento;
    let sD = distance * distance;
    let sH = height * height;
    let a = sR - sH;
    let b = 2 * (sR * desplazamiento - sH * distance);
    let c = sH * sR + sR * sF - sH * sD;
    let res = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    let res2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    return res >= 0 ? res : res2;
  }
  return 0;
}

function getWidth(nodo) {
  return nodo ? nodo.ancho : 0;
}

/**
 * SE VERIFICA SI EL SUB-ARBOL ES UNA LISTA ENLAZADA
 * @param nodo
 * @returns {boolean}
 */
function isLinkedList(nodo) {
  let factor = Math.abs(
    obtenerAltura(nodo.hijoIzquierdo) - obtenerAltura(nodo.hijoDerecho)
  );
  if (factor === nodo.altura - 1) {
    return true;
  }
}

/**
 * SE DIBUJA EL ARBOL EN PANTALLA
 * @param nodo
 * @param x
 * @param y
 * @param color
 */
function render(nodo, x, y, color = false) {
  if (nodo == null) {
    return;
  }
  if (nodo.hijoIzquierdo != null) {
    let lx = x - nodo.desplazamiento;
    let ly = y + height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(lx, ly);
    ctx.stroke();
    render(nodo.hijoIzquierdo, lx, ly, color);
  }
  if (nodo.hijoDerecho != null) {
    let rx = x + nodo.desplazamiento;
    let ry = y + height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(rx, ry);
    ctx.stroke();
    render(nodo.hijoDerecho, rx, ry, color);
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  if (color) {
    ctx.fillStyle = nodo.color === ROJO ? "red" : "black";
    ctx.fill("nonzero");
    ctx.fillStyle = "white";
  } else {
    ctx.fillStyle = "white";
    ctx.fill("nonzero");
    ctx.fillStyle = "black";
  }
  ctx.stroke();
  ctx.fillText(nodo.valor.toString(), x, y);
}

/**
 * GENERAR NODOS ALEATORIOS
 */
function randomSet() {
  let count = 50;
  let array = new Array(count);
  let set = new Set();
  while (set.size < count) {
    let num = Math.round(Math.random() * 500 + 1);
    set.add(num);
  }
  let idx = 0;
  set.forEach((value) => {
    array[idx] = value;
    idx++;
  });
  return array;
}

/**
 * INSERTAR ALEATORIO AVL
 */
function randomAVLTree() {
  let input = document.getElementById("inputAVL");
  input.value = randomSet().toString();
  generateAVL();
}

/**
 * INSERTAR ALEATORIO ROJO Y NEGRO
 */
function randomRBTree() {
  let input = document.getElementById("inputRBT");
  input.value = randomSet().toString();
  generateRBTree();
}
