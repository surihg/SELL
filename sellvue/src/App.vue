<template>
  <div id="app">
    <!--绑定seller的数据-->
    <v-header :seller="seller"></v-header>

    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods" class="tab-item-i">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" class="tab-item-i">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller" class="tab-item-i">商家</router-link>
      </div>
    </div>
    <!--:seller="seller"这里的router-view要传入seller,不然后面的goods组件用不了seller的数据-->
    <keep-alive><!--keep-alive保证切换路由的时候vue的生命周期不会重新加载-->
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from './components/header/header.vue'
  import {urlParse} from './common/js/util'

  const ERR_OK = 0

  export default {
    data(){
      return{
        seller:{
          //对seller的id赋值
          id:(()=>{//立即执行函数
            let queryParam=urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created(){

      //http://localhost:8080/?id=123#/seller
      this.$http.get('/api/seller?id='+this.seller.id).then((response)=>{
        response=response.body;
        if(response.errno === ERR_OK){
          //this.seller=response.data;
          //把response.data当做属性给seller对象加上，就不会使上面的id别覆盖
          this.seller=Object.assign({},this.seller,response.data);
        }
      });
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      display: flex
      width: 100%
      line-height 40px
      //自己定义的1像素边框border-1px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        & > .tab-item-i
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
