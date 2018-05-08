//存储商家id
export function saveToLocal(id,key,value) {
  let seller=window.localStorage.__seller__;//__seller__一个存储空间
  if(!seller){//localstore没有内容的情况下，seller还没初始化
    seller={};//seller是一个json
    seller[id]={};
  }else{
    seller=JSON.parse(seller);//解析json
    if(!seller[id]){//如果json中没有这个s商家，因为可以是商家a，商家b
      seller[id]={};//有了seller这个对象，所以只要再将里面没有的seller[id]初始化
    }

  }
  seller[id][key]=value;//赋值
  window.localStorage.__seller__=JSON.stringify(seller);
};
//读取id
export function loadFromLocal(id,key,def) {//def是一个默认值
  let seller=window.localStorage.__seller__;
  if(!seller){//没有seller这个对象，seller对象没创建
    return def;
  }
  seller=JSON.parse(seller)[id];
  if(!seller){//没有指定id的seller商家，返回默认值
    return def;
  }
  let ret = seller[key];//通过key值去找是否对应id的是否已收藏//这个商家有没有那个key,没有还是会返回def
  return ret||def;
};
