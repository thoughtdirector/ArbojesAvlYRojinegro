/**
 * 随机删除红黑树节点
 */
function randomRBTreeRemove() {
  let index = Math.ceil(Math.random() * array.length - 1);
  RBTreeRemove(root, array[index]);
  array.splice(index);
  root = definirRaiz(root);
  // let isRB = isRBTree(root);
  // if (!isRB) {
  //   console.log("remove value:" + array[index] + "====isRB:"+isRB);
  // }
  mostrarArbol(true);
}

function randomAVLTreeRemove() {
  let index = Math.ceil(Math.random() * array.length - 1);
  root = BSTreeRemove(root, array[index], true);
  array.splice(index);
  // let res = isAVL(root);
  // if (!res) {
  //   console.log("remove value:" + array[index] + "====isAVL:"+res);
  // }
  mostrarArbol();
}
