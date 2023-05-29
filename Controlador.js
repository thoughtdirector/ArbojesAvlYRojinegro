// matriz de entrada
var array;

// -------------ARBOLES AVL---------------

/**
 * CREACION ARBOL AVL
 * 
 * Se define la raiz con altura nula
 */

function generarAVL() {
  raiz = null;
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
      raiz = BSTreeInsert(raiz, num, true);
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
      raiz = BSTreeRemove(raiz, num, true);
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
  raiz = null;
  insercionRojoYNegro();
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

function insercionRojoYNegro() {
  let input = document.getElementById("inputRBT");
  array = input.value.split(",");

  for (let i = 0; i < array.length; i++) {
    let num = parseInt(array[i]);
    if (!isNaN(num)) {
      raiz = InsertarNodoRojoYNegro(raiz, num);
      raiz.color = NEGRO;
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
        raiz == null ||
        (raiz.hijoIzquierdo == null && raiz.hijoDerecho == null)
      ) {
        raiz = null;
        break;
      } else {
        RBTreeRemove(raiz, num);
        raiz = obtenerRaiz(raiz);
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
  medidas(raiz);
  inicialiizarCanva();
  limpiar();
  render(raiz, canvas.width / 2, 10 + radio, color);
}

//Se definen las variables del canva, controlan el camaño
var radio = 20;
var espaciado = 20;
var altura = radio * 2 + 30;
var padding = 20;
var raiz = null;
var canvas = null;
var ctx = null;

/***
 * funcion para inicializar el canva
 */
function inicialiizarCanva() {
  canvas = document.getElementById("canvas");
  const cvAltura = (raiz.altura - 1) * altura + radio * 2 + padding * 2;
  const cvAncho = raiz.ancho + padding * 2;
  canvas.style.height = cvAltura + "px";
  canvas.style.width = cvAncho + "px";
  canvas.height = cvAltura;
  canvas.width = cvAncho;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 *
 * @param nodo
 * se define una funcion que maneje las medidas, a la hora de dibujar el arbol
 * se valida si el nodo es nulo, y en caso de no serlo, se retornan las medidas
 * se obtiene el ancho de los sub nodos, y se define el nuevo espacio que van a ocupar
 */
function medidas(nodo) {
  if (nodo == null) {
    return;
  }
  if (!nodo.hijoIzquierdo && !nodo.hijoDerecho) {
    nodo.esListaEnlazada = true;
    nodo.ancho = radio * 2;
    return;
  }
  medidas(nodo.hijoIzquierdo);
  medidas(nodo.hijoDerecho);

  // ANCHO SUB ARBOL IZQUIERDO Y DERECHO
  let anchoIzquierdo = obtenerAncho(nodo.hijoIzquierdo);
  let anchoDerecho = obtenerAncho(nodo.hijoDerecho);

  let fixNodo = null;
  if (!nodo.hijoIzquierdo || !nodo.hijoDerecho) {
    nodo.ancho = anchoIzquierdo + anchoDerecho;
    nodo.ancho += espaciado;
    nodo.desplazamiento = espaciado / 2;
  } else {
    // SE DEFINE EL NUEVO ESPACIO A OCUPAR
    let espacioHijos = Math.max(anchoDerecho, anchoIzquierdo);
    let factor =
      obtenerAltura(nodo.hijoIzquierdo) - obtenerAltura(nodo.hijoDerecho);
    nodo.ancho = espacioHijos * 2;
    nodo.desplazamiento = espacioHijos / 2;
    let anchoGeneral = Math.abs(anchoIzquierdo - anchoDerecho) / 2;
    if (factor > 0) {
      if (anchoIzquierdo >= anchoDerecho) {
        // SE ACERCAN LOS NODOS PARA REDUCIR ESPACIO
        let div = Math.pow(2, obtenerAltura(nodo.hijoDerecho));
        let espacioIzquierdo = anchoIzquierdo / div - radio;
        if (espacioIzquierdo < 0) {
          espacioIzquierdo = 0;
        }
        anchoGeneral += espacioIzquierdo;
        fixNodo = nodo.hijoIzquierdo;
      }
    } else if (factor < 0) {
      if (anchoDerecho >= anchoIzquierdo) {
        let div = Math.pow(2, obtenerAltura(nodo.hijoIzquierdo));
        let espacioDerecho = anchoDerecho / div - radio;
        if (espacioDerecho < 0) {
          espacioDerecho = 0;
        }
        anchoGeneral += espacioDerecho;
        fixNodo = nodo.hijoDerecho;
      }
    }
    nodo.ancho -= anchoGeneral;
    nodo.desplazamiento -= anchoGeneral / 2;
    // SE AÑADE EL ESPACIO ENTRE NODOS
    nodo.ancho += espaciado;
    nodo.desplazamiento += espaciado / 2;
    // SE GENERA DISTANCIA ENTRE LOS NODOS HIJOS
    let distanciahijos = espacioHijos - anchoGeneral + espaciado;
    if (fixNodo) {
      let fix = arreglarAncho(fixNodo.desplazamiento, distanciahijos);
      nodo.ancho += fix;
      nodo.desplazamiento += fix / 2;
    }
  }
}

/**
 *
 * @param desplazamiento
 * @param distanciahijos
 * @returns {number} 
 * 
 * se define la funcion para arreglar el ancho a la hora de 
 * balancear el arbol 
 */
function arreglarAncho(desplazamiento, distanciahijos) {
  // VERIFICAR SI HAY NODOS O LINEAS SUPERPUESTAS
  if (Math.atan(altura / desplazamiento) < Math.asin(radio / distanciahijos)) {
    let sR = radio * radio;
    let sF = desplazamiento * desplazamiento;
    let sD = distanciahijos * distanciahijos;
    let sH = altura * altura;
    let a = sR - sH;
    let b = 2 * (sR * desplazamiento - sH * distanciahijos);
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
 * 
 * se verifica matematicamente si el sub-arbol es una lista enlasada
 * @param nodo
 * @returns {boolean}
 */
function esListaEnlazada(nodo) {
  let factor = Math.abs(
    obtenerAltura(nodo.hijoIzquierdo) - obtenerAltura(nodo.hijoDerecho)
  );
  if (factor === nodo.altura - 1) {
    return true;
  }
}

/**
 * SE DIBUJA EL ARBOL EN PANTALLA
 * 
 * se dibuja en pantalla en nodo pasandole los parametros de altura
 * ancho y color(en caso de ser un arbol rojo y negro)
 * tambien se verifica el desplazamiento del mismo nodo
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
    let ly = y + altura;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(lx, ly);
    ctx.stroke();
    render(nodo.hijoIzquierdo, lx, ly, color);
  }
  if (nodo.hijoDerecho != null) {
    let rx = x + nodo.desplazamiento;
    let ry = y + altura;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(rx, ry);
    ctx.stroke();
    render(nodo.hijoDerecho, rx, ry, color);
  }
  ctx.beginPath();
  ctx.arc(x, y, radio, 0, 2 * Math.PI);
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
function llenadoAleatorioAVL() {
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
