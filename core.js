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
      root.color = BLACK;
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
      if (root == null || (root.left == null && root.right == null)) {
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
  const cvHeight = (root.height - 1) * height + radius * 2 + padding * 2;
  const cvWidth = root.width + padding * 2;
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
 * @param node
 */

function measure(node) {
  if (node == null) {
    return;
  }
  if (!node.left && !node.right) {
    node.isLinkedList = true;
    node.width = radius * 2;
    return;
  }
  measure(node.left);
  measure(node.right);

  // ANCHO SUB ARBOL IZQUIERDO Y DERECHO
  let leftWidth = getWidth(node.left);
  let rightWidth = getWidth(node.right);

  let fixNode = null;
  if (!node.left || !node.right) {
    node.width = leftWidth + rightWidth;
    node.width += spacing;
    node.offset = spacing / 2;
  } else {
    // SE DEFINE EL NUEVO ESPACIO A OCUPAR
    let childSpace = Math.max(rightWidth, leftWidth);
    let factor = getHeight(node.left) - getHeight(node.right);
    node.width = childSpace * 2;
    node.offset = childSpace / 2;
    let mixWidth = Math.abs(leftWidth - rightWidth) / 2;
    if (factor > 0) {
      if (leftWidth >= rightWidth) {
        // SE ACERCAN LOS NODOS PARA REDUCIR ESPACIO
        let div = Math.pow(2, getHeight(node.right));
        let leftSpace = leftWidth / div - radius;
        if (leftSpace < 0) {
          leftSpace = 0;
        }
        mixWidth += leftSpace;
        fixNode = node.left;
      }
    } else if (factor < 0) {
      if (rightWidth >= leftWidth) {
        let div = Math.pow(2, getHeight(node.left));
        let rightSpace = rightWidth / div - radius;
        if (rightSpace < 0) {
          rightSpace = 0;
        }
        mixWidth += rightSpace;
        fixNode = node.right;
      }
    }
    console.log("mixWidth: " + mixWidth);
    node.width -= mixWidth;
    node.offset -= mixWidth / 2;
    // SE AÑADE EL ESPACIO ENTRE NODOS
    node.width += spacing;
    node.offset += spacing / 2;
    // SE GENERA DISTANCIA ENTRE LOS NODOS HIJOS
    let distance = childSpace - mixWidth + spacing;
    if (fixNode) {
      let fix = fixWidth(fixNode.offset, distance);
      node.width += fix;
      node.offset += fix / 2;
    }
  }
}

/**
 * 
 * @param offset 
 * @param distance 
 * @returns {number}
 */
function fixWidth(offset, distance) {
  // VERIFICAR SI HAY NODOS O LINEAS SUPERPUESTAS
  if (Math.atan(height / offset) < Math.asin(radius / distance)) {
    let sR = radius * radius;
    let sF = offset * offset;
    let sD = distance * distance;
    let sH = height * height;
    let a = sR - sH;
    let b = 2 * (sR * offset - sH * distance);
    let c = sH * sR + sR * sF - sH * sD;
    let res = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    let res2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    return res >= 0 ? res : res2;
  }
  return 0;
}

function getWidth(node) {
  return node ? node.width : 0;
}

/**
 * SE VERIFICA SI EL SUB-ARBOL ES UNA LISTA ENLAZADA
 * @param node
 * @returns {boolean}
 */
function isLinkedList(node) {
  let factor = Math.abs(getHeight(node.left) - getHeight(node.right));
  if (factor === node.height - 1) {
    return true;
  }
}

/**
 * SE DIBUJA EL ARBOL EN PANTALLA
 * @param node
 * @param x
 * @param y
 * @param color
 */
function render(node, x, y, color = false) {
  if (node == null) {
    return;
  }
  if (node.left != null) {
    let lx = x - node.offset;
    let ly = y + height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(lx, ly);
    ctx.stroke();
    render(node.left, lx, ly, color);
  }
  if (node.right != null) {
    let rx = x + node.offset;
    let ry = y + height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(rx, ry);
    ctx.stroke();
    render(node.right, rx, ry, color);
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  if (color) {
    ctx.fillStyle = node.color === RED ? "red" : "black";
    ctx.fill("nonzero");
    ctx.fillStyle = "white";
  } else {
    ctx.fillStyle = "white";
    ctx.fill("nonzero");
    ctx.fillStyle = "black";
  }
  ctx.stroke();
  ctx.fillText(node.value.toString(), x, y);
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
