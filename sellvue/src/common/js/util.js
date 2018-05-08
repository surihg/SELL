/**
 *解析url参数
 * @example ?id=12345&a=b
 */


export function urlParse() {
  let url=window.location.search;//获得网址
  let obj={};
  let reg=/[?&][^?&]+=[^?&]+/g;
  let arr=url.match(reg);//匹配
  //匹配之后的数组有两个值，['?id=12345', ''&a=b]
  if(arr){
      arr.forEach((item)=>{
        let temArr=item.substring(1).split('=');//选取从第二位到最后的数，并用等号分割
        let key=decodeURIComponent(temArr[0]);
        let val=decodeURIComponent(temArr[1]);
        obj[key]=val;//转化成对象
      })
  }
  return obj;//返回对象
};
