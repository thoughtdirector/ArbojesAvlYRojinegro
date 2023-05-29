/**
 * 随机删除红黑树节点
 */
function randomRBTreeRemove() {
  let index = Math.ceil(Math.random() * array.length - 1);
  RBTreeRemove(raiz, array[index]);
  array.splice(index);
  raiz = obtenerRaiz(raiz);
  // let isRB = isRBTree(raiz);
  // if (!isRB) {
  //   console.log("remove value:" + array[index] + "====isRB:"+isRB);
  // }
  mostrarArbol(true);
}

function llenadoAleatorioAVLEliminacion() {
  let index = Math.ceil(Math.random() * array.length - 1);
  raiz = BSTreeRemove(raiz, array[index], true);
  array.splice(index);
  // let res = isAVL(raiz);
  // if (!res) {
  //   console.log("remove value:" + array[index] + "====isAVL:"+res);
  // }
  mostrarArbol();
}
