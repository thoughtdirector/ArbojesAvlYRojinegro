// matriz de entrada
var array;

// -------------ARBOLES AVL---------------

/**
 * CREACION ARBOL AVL
 * 
 * Se define la raiz con altura nula
 */

function generarAVL() {
  root = null;
  insertarAVL();
}

/**
 * INSERTAR NUEVOS NODOS ARBOL AVL
 * 
 * Se separan todos los nodos, por medio de la coma
 * luego son convertidos a int 
 * se valida que el dato ingresado sea un numero
 * si pasa la validacion, se insertan al arbol 
 */

function insertarAVL() {
  let input = document.getElementById("inputAVL");
  array = input.value.split(",");

  for (let i = 0; i < array.length; i++) {
    let num = parseInt(array[i]);
    if (!isNaN(num)) {
      root = BSTreeInsert(root, num, true);
    }
  }
  mostrarArbol();
}

/**
 * REMOVER NODOS ARBOL AVL
 * 
 * Se separan todos los nodos, por medio de la coma
 * luego son convertidos a int 
 * se valida que el dato ingresado sea un numero
 * si pasa la validacion, se remueven del arbol 
 */
function eliminarAVL() {
  let input = document.getElementById("inputAVL");
  let array = input.value.split(",");
  for (let i = 0; i < array.length; i++) {
    let num = parseInt(array[i]);
    if (!isNaN(num)) {
      root = BSTreeRemove(root, num, true);
    }
  }
  mostrarArbol();
}

// -------------ARBOLES ROJO Y NEGRO---------------

/**
 * CREACION ARBOL ROJO Y NEGRO
 * 
  * Se define la raiz con altura nula
 */

function generarRojoYNegro() {
  root = null;
  insertarRojoYNegro();
}

/**
 * INSERTAR NUEVOS NODOS ARBOL ROJO Y NEGRO
 * 
 * Se separan todos los nodos, por medio de la coma
 * luego son convertidos a int 
 * se valida que el dato ingresado sea un numero
 * si pasa la validacion, se insertan al arbol
 * se define el color de la raiz como negro
 */

function insertarRojoYNegro() {
  let input = document.getElementById("inputRBT");
  array = input.value.split(",");

  for (let i = 0; i < array.length; i++) {
    let num = parseInt(array[i]);
    if (!isNaN(num)) {
      root = RBTreeInsert(root, num);
      root.color = NEGRO;
    }
  }
  mostrarArbol(true);
}

/**
 * REMOVER NODOS ARBOL AVL
 * 
 * Se separan todos los nodos, por medio de la coma
 * luego son convertidos a int 
 * se valida que el dato ingresado sea un numero 
 * si pasa la validacion se hacen las siguientes
 * se valida si la raiz es nula o ambos de sus hijos lo som
 * se define la raiz como nula y se rompe el programa en caso de que si
 * en caso de que no se remueven del arbol 
 * y se guareda el valor de la raiz
 */

function eliminarRojoYNegro() {
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
        root = obtenerRaiz(root);
      }
    }
  }
  mostrarArbol(true);
}

// -------------GRAFICAS ---------------

/**
 * MOSTRAR ARBOLES
 * 
 * se define la raiz del arbol
 * se inicializa el lienzo
 * se limpia y se renderizan los nodos
 */
function mostrarArbol(color = false) {  
  medidas(root);
  inicialiizarCanva();
  limpiar();
  render(root, canvas.ancho / 2, 10 + radius, color);
}

//Se definen las variables del canva, controlan el camaño
var radius = 20;
var spacing = 20;
var height = radius * 2 + 30;
var padding = 20;
var root = null;
var canvas = null;
var ctx = null;

/***
 * funcion para inicializar el canva
 */
function inicialiizarCanva() {
  canvas = document.getElementById("canvas");
  const cvHeight = (root.altura - 1) * height + radius * 2 + padding * 2;
  const cvWidth = root.ancho + padding * 2;
  canvas.style.height = cvHeight + "px";
  canvas.style.ancho = cvWidth + "px";
  canvas.height = cvHeight;
  canvas.ancho = cvWidth;
  ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold " + 20 + "px serif";
}

/***
 * se define la funcion para vaciar la informacion que tenga el canva
 * se una una funcion externa para ello, definiendo el tamaño del canva
 */
function limpiar() {
  ctx.clearRect(0, 0, canvas.ancho, canvas.height);
}

/**
 *
 * @param nodo
 * se define una funcion que maneje las medidas, a la hora de dibujar el arbol
 */
function medidas(nodo) {
  if (nodo == null) {
    return;
  }
  if (!nodo.hijoIzquierdo && !nodo.hijoDerecho) {
    nodo.isLinkedList = true;
    nodo.ancho = radius * 2;
    return;
  }
  medidas(nodo.hijoIzquierdo);
  medidas(nodo.hijoDerecho);

  // ANCHO SUB ARBOL IZQUIERDO Y DERECHO
  let leftWidth = obtenerAncho(nodo.hijoIzquierdo);
  let rightWidth = obtenerAncho(nodo.hijoDerecho);

  let fixNodo = null;
  if (!nodo.hijoIzquierdo || !nodo.hijoDerecho) {
    nodo.ancho = leftWidth + rightWidth;
    nodo.ancho += spacing;
    nodo.offset = spacing / 2;
  } else {
    // SE DEFINE EL NUEVO ESPACIO A OCUPAR
    let childSpace = Math.max(rightWidth, leftWidth);
    let factor =
      obtenerAltura(nodo.hijoIzquierdo) - obtenerAltura(nodo.hijoDerecho);
    nodo.ancho = childSpace * 2;
    nodo.offset = childSpace / 2;
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
        fixNodo = nodo.hijoIzquierdo;
      }
    } else if (factor < 0) {
      if (rightWidth >= leftWidth) {
        let div = Math.pow(2, obtenerAltura(nodo.hijoIzquierdo));
        let rightSpace = rightWidth / div - radius;
        if (rightSpace < 0) {
          rightSpace = 0;
        }
        mixWidth += rightSpace;
        fixNodo = nodo.hijoDerecho;
      }
    }
    nodo.ancho -= mixWidth;
    nodo.offset -= mixWidth / 2;
    // SE AÑADE EL ESPACIO ENTRE NODOS
    nodo.ancho += spacing;
    nodo.offset += spacing / 2;
    // SE GENERA DISTANCIA ENTRE LOS NODOS HIJOS
    let distance = childSpace - mixWidth + spacing;
    if (fixNodo) {
      let fix = fixWidth(fixNodo.offset, distance);
      nodo.ancho += fix;
      nodo.offset += fix / 2;
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

function obtenerAncho(nodo) {
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
    let lx = x - nodo.offset;
    let ly = y + height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(lx, ly);
    ctx.stroke();
    render(nodo.hijoIzquierdo, lx, ly, color);
  }
  if (nodo.hijoDerecho != null) {
    let rx = x + nodo.offset;
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
  generarAVL();
}

/**
 * INSERTAR ALEATORIO ROJO Y NEGRO
 */
function randomRBTree() {
  let input = document.getElementById("inputRBT");
  input.value = randomSet().toString();
  generarRojoYNegro();
}
