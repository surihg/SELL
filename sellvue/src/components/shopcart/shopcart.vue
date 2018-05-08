<template>
  <div class="big">
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <!--为logo加上:class="{'highlight':totalCount>0}，表示当选择的商品大于0的时候应用highlight这个样式-->
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <!--@click.stop.prevent阻止默认点击事件的冒泡，不然会滑出商品列表-->
      <div class="content-right" @click.stop.prevent="pay">
       <!-- //pay绑定一个计算属性payClass,通过payClass的返回值来为pay加class-->
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>

      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeDrop"
        @enter="dropping" @after-enter="afterDrop">
            <div v-show="ball.show" class="ball">
          <div class="inner inner-hook"></div>
        </div>
        </transition>
      </div>
      </div>
    <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <span class="empty" @click="empty">清空</span>
            <span class="title">购物车</span>

          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
    </transition>
  </div>
    <div class="list-mask" v-show="listShow" @click="hideList"></div>

  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import cartcontrol from'../cartcontrol/cartcontrol.vue'

  export default {
    props: {
      selectFoods:{//这个属性用于接收选择的商品数目
        type:Array,//类型是数组
        default(){//当类型是数组的时候，默认值default是一个函数，
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default:0 //设置默认值
      },
      minPrice: {
        type: Number,
        default:0
      }
    },
    data(){
      return{
        balls:[
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
        ],
        dropBalls:[],
        fold:true//购物车的状态
      };
    },
    computed:{
      totalPrice(){//总价
        let total=0;
        this.selectFoods.forEach((food)=>{//food表示selectFoods中的每一个json对象
          total+=food.price*food.count;
        });
        return total;
      },
      totalCount(){//总数量
        let count=0;
        this.selectFoods.forEach((food)=>{//food表示selectFoods中的每一个json对象
          count+=food.count;
        });
        return count;
      },
      payDesc(){
        if(this.totalPrice === 0){//js中建议用全等 ===，不然用==有时候会发生类型转换
          return `￥${this.minPrice}元起送`;//用了反引号‘`’可以不用加号形成字符拼接
        }else if(this.totalPrice<this.minPrice){
          let diff=this.minPrice-this.totalPrice;
          return `还差￥${diff}元起送`
        }else{
          return '去结算';
        }
      },
      payClass(){
        if(this.totalPrice<this.minPrice){
          return 'not-enough'
        }else {
          return 'enough'
        }
      },
      listShow(){
        if(!this.totalCount){
          this.fold=true;
          return false;
        }
        let show=!this.fold;
        if(show){
          this.$nextTick(()=>{
            if(!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true//有这一行购物车中的按钮才能被点击
              });
            }else{
              this.scroll.refresh();
            }
          });
        }
        return show;
      }

    },
    methods:{
      drop(el){
        for(let i=0;i<this.balls.length;i++){
          let ball=this.balls[i];
          if(!ball.show){
            ball.show=true;
            ball.el=el;//获得小球的位置
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList(){
        if(!this.totalCount){
          return;
        }
        this.fold=!this.fold;
      },
      hideList(){
        this.fold=true
      },
      empty(){
        this.selectFoods.forEach((food)=>{
          food.count=0
        })
      },
      pay(){
        if(this.totalPrice<this.minPrice){
          return
        }
        window.alert(`确定支付${this.totalPrice}元`)
      },
      beforeDrop(el){//el表示执行动画的dom对象
          let count=this.balls.length;
          while(count--){
            let ball=this.balls[count];
            if(ball.show){
              //getBoundingClientRect();获取当前对象相对于左上角的偏移
              let rect=ball.el.getBoundingClientRect();
              let x=rect.left-32;
              let y=-(window.innerHeight-rect.top-22);
              el.style.display='';
              el.style.webkitTransform=`translate3d(0,${y}px,0)`;
              el.style.transform=`translate3d(0,${y}px,0)`;
              let inner=el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform=`translate3d(${x}px,0,0)`;
              inner.style.transform=`translate3d(${x}px,0,0)`;
            }
          }
        },
      dropping(el,done){//done表示动画结束状态,必须加上，不加上会立即完成
          /*先触发浏览器重绘*/
            let rf=el.offsetHeight;
            this.$nextTick(()=>{
              el.style.webkitTransform='translate3d(0,0,0)';
              el.style.transform='translate3d(0,0,0)';
              let inner=el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform='translate3d(0,0,0)';
              inner.style.transform='translate3d(0,0,0)';
              el.addEventListener('transitionend',done);
            });
        },
      afterDrop(el){
          let ball=this.dropBalls.shift();//shift()取出数组的内容
          if(ball){
            ball.show=false;
            el.style.display='none';
          }

        }
      },
    components:{
      cartcontrol
    }


  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

    .shopcart
      position fixed
      left 0px
      bottom 0px
      z-index 50
      width 100%
      height 48px
      .content
        display flex
        background #141d27
        color rgba(255,255,255,0.4)
        .content-left
          flex 1
          font-size 0
          .logo-wrapper
            display inline-block
            vertical-align top
            position relative
            top -10px//这样那个购物车的logo才向外伸
            margin 0 12px
            padding 6px
            width 56px
            height 56px
            box-sizing border-box//***************************************************

            border-radius 50%//把圆角设置成50%,就变成圆了
            background #141d27
            .logo
              width 100%
              height 100%
              border-radius 50%
              text-align center
              background #2b343c

              &.highlight
                background :rgb(0 160 220)
              .icon-shopping_cart
                line-height 44px
                font-size 24px
                color #80858a
                z-index -10
                &.highlight
                  color #fff
            .num
              position absolute
              top 0px
              right 0px
              width 24px
              height 16px
              line-height 16px
              text-align center
              border-radius 16px
              font-size 9px
              font-weight 700
              color #fff
              background rgb(240,20,20)
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)//阴影
          .price
            display inline-block
            vertical-align top
            margin-top 12px
            line-height 24px//这一句那条竖线才不会充满区块
            padding-right 12px
            box-sizing border-box
            border-right 1px solid rgba(255,255,255,0.1)
            font-size 16px
            font-weight 700
            &.highlight
              color:#fff
              font-size 19px
          .desc
            display inline-block
            vertical-align top
            margin 12px 0 0 12px
            line-height 24px
            font-size 10px
            font-weight 100
        .content-right
          flex 0 0 105px
          width 105px
          .pay
            height 48px
            line-height 48px
            text-align center
            font-size 12px
            font-weight 700
            background #2b333b
            &.not-enought
              background #2b333b
            &.enough
              background #00b43c
              color:#fff
      .ball-container
        .ball
          position fixed
          left 32px
          bottom 32px
          .inner
            width: 16px
            height 16px
            border-radius 50%
            background rgba(0,160,220,0.5)
            z-index 1
          &.drop-enter-active, &.drop-leave-active
            transition:all 0.6s cubic-bezier(0.49,-0.29,0.75,0.4)
            .inner
              width: 16px
              height 16px
              border-radius 50%
              background rgba(0,160,220,0.5)
              transition:all 0.6s linear

      .shopcart-list
        position absolute
        bottom 48px
        left 0
        z-index -1
        width 100%
        transition: 1s all;
        &.fold-enter, &.fold-leave-to
          transform: translate3d(0, 100%, 0)
        &.fold-enter-to, &.fold-leave
          transform: translate3d(0, 0, 0)

        .list-header
          height 25px
          padding 12px 12px 0 0
          background #f3f5f7
          border-bottom 1px solid rgba(7,17,27,0.1)
          .title
            float left
            font-size 18px
            color black
          .empty
            float right
            font-size 16px
            color rgb(0,160,220)
        .list-content
          max-height 189px
          overflow hidden
          padding 0 12px
          background #fff
          .food
            position relative
            padding 12px 0
            box-sizing border-box
            border-1px(rgba(7,17,27,0.1))
            .name
              line-height 24px
              font-size 14px
              color rgb(7,17,27)
            .price
              position absolute
              right 90px
              bottom 12px
              line-height 24px
              font-size 14px
              font-weight 700
              color rgb(240,20,20)
            .cartcontrol-wrapper
              position absolute
              right 0px
              bottom 6px



    .list-mask
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index 40
      opacity 1
      background rgba(7,17,27,0.8)
</style>
