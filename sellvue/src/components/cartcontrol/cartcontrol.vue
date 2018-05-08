<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease " v-show="food.count>0"
         @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
   <!-- @click.stop.prevent阻止冒泡，只在这个vue中使用-->
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>

  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {

    props:{
      food:{
        type:Object
      }
    },

    methods:{
      addCart(event){
       if(!event._constructed){//这一个if的作用是如果是浏览器状态，就返回掉，不然会有两次事件
         return;
       }
        if(!this.food.count){
          Vue.set(this.food,'count',1)
        }else{
          this.food.count++;
        }
        this.$emit('addBall',event.target);
      },
      decreaseCart(event){
        if(!event._constructed){//这一个if的作用是如果是浏览器状态，就返回掉，不然会有两次事件
          return;
        }
        if(this.food.count){
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block//三个设置成这样可以并排
      padding 6px
      &.move-enter-active, &.move-leave-active{
        transition: 1s all linear;  //linear表示动画是线性的 ，
      }
      &.move-enter-active,&.move-leave{
        opacity 1
        transform translate3d(0,0,0)
      }
      &.move-enter,&.move-leave-active{
        opacity:0;
        transform translate3d(24px,0,0)
      }
      .inner
        display inline
        line-height 24px
        font-size 24px
        color rgb(0,160,220)
        &.move-enter-active, &.move-leave-active{
          transition: 1s all linear;  //linear表示动画是线性的 ，
        }
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top:6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147,153,159)
    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0,160,220)
</style>
