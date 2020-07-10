exports.create = function(objectsArr){
  if(objectsArr.length === 0){
    return 1;
  }
  let idxsArr = objectsArr.map(item=>item.id);
  idxsArr.sort((a, b)=> a - b);

  if(idxsArr.length === idxsArr[idxsArr.length - 1]){
    return idxsArr.length + 1;
  }else{
    let resultLength = idxsArr[idxsArr.length - 1] + 1;
    for (let i = 1; i < resultLength; i++){
      if (idxsArr.indexOf(i) === -1){
        return i;
      }
    }
  }
}
