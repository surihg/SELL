<template>
  <div class="seller" ref="sellers"><!--//bscoll的用法，外部有一个固定高度div，内层是一个能被内容撑高的div-->
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}元</span>
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}分钟</span>
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告和活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item,key) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[key].type]"></span>
            <span class="text">{{seller.supports[key].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics" @click="_refreshPic">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from'../star/star.vue'
  import split from'../split/split.vue'
  import {saveToLocal,loadFromLocal} from '../../common/js/store'
  import BScroll from 'better-scroll'

  export default {
    props:{
      seller:{
        type:Object
      }
    },
    data(){
      return{
        favorite:(()=>{
          //引入的js
          //读取数据
          //favorite由loadFromLocal储存的东西决定
          return loadFromLocal(this.seller.id,'favorite',false)
        })()
      };
    },
    computed:{
      favoriteText(){
        return this.favorite? '已收藏':'收藏';
      }
    },
    created() {
      //通过classMap来使用icon标签下显示不同的class
      this.classMap = ['decrease', 'discount', 'special', 'guarantee', 'invoice']
      this._initScroll();


    },
    watch:{//监听数据的变化
      'seller'() {//通过监听数据的变化再次_initScroll，因为刚开始的seller数据为空，没办法使得BScroll的内层高度大于外层
        this._initScroll();
        this._initPics();
      }
    },
   ready(){
     this._initScroll()//因为seller数据加载后就固定了，当切换回来的时候，dom被初始化了，seller不变，bscroll没被初始化，所以需要在这里在初始化
     this._initPics();
   },
    methods:{
      _initScroll(){
        this.$nextTick(()=>{
          if(!this.scroll){
            this.scroll=new BScroll(this.$refs.sellers,{//这里的food是<div v-show="showFlag" class="food" ref="food">中ref后面的food
              click:true
            });
          }else{
            this.scroll.refresh();
          }
        });
      },
      _refreshPic(){
        this._initPics();
      },
      _initPics(){//改变图片横向的总宽度
        if(this.seller.pics){

          //使内层的宽度大于外层的宽度，才能用scroll
          let picWidth=120
          let margin=6;
          let width=(picWidth+margin)*this.seller.pics.length-margin
          this.$refs.picList.style.width=width+'px';
          this.$nextTick(()=>{
            if(!this.picScroll){
              this.picScroll=new BScroll(this.$refs.picWrapper,{
              scrollX:true,//滚动的方向是x轴方向
              eventPassthrough:'vertical'//滚动的时候禁止原来界面的上下滑动
            });
            }else{
              this.picScroll.refresh()
            }
         });

        }
      },
      toggleFavorite(event){
        if(!event._constructed){
          return;
        }
        this.favorite=!this.favorite
        //引入的js文件
        //点击收藏之后，将这个商家的id存入到saveToLocal中
        saveToLocal(this.seller.id,'favorite',this.favorite)
      }
    },
    components:{
      star,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .seller
    position absolute
    top 174px
    bottom 0px
    left 0px
    width 100%
    overflow hidden
    .overview
      position relative
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .desc
        padding-bottom 18px
        font-size 0px
        border-1px(rgba(7,17,27,0.1))
        .star
          display inline-block
          margin-right 8px
          vertical-align top
        .text
          display inline-block
          margin-right 12px
          line-height 18px
          vertical-align top
          font-size 10px
          color rgb(77,85,93)



      .remark
        display flex
        padding-top 18px
        .block
          flex: 1
          text-align center
          border-right 1px solidfgba(7,17,27,0.1)
          &:last-child
            border none
          h2
            margin-bottom 4px
            line-height: 10px
            font-size 10px
            color rgb(147,153,159)
          .content
            line-height 24px
            font-size 10px
            color rgb(7,17,27)
            .stress
              font-size 24px

      .favorite
        position absolute
        width 50px
        right 11px
        top 18px
        text-align center
        .icon-favorite
          display block
          margin-bottom 4px
          color #d4d6d9
          line-height 18px
          font-size 18px
          &.active
            color rgb(240,20,20)
        .text
          line-height 8px
          font-size 8px
          color rgb(77,85,93)

    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom 8px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .content-wrapper
        padding 0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height 24px
          font-size 12px
          color rgb(240,20,20)
      .supports
        .support-item
          padding 16px 12px
          border-1px(rgba(7,17,27,0.1))
          font-size 0px
          &:last-child
            border-none()
          .icon
            display inline-block
            width 16px
            height 16px
            vertical-align top
            margin-right 6px
            background-size 16px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_4')
            &.special
              bg-image('special_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
    .pics
      padding 18px
      .title
        margin-bottom 12px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .pic-wrapper
        width 100%
        overflow hidden
        white-space nowrap//横向超过宽度的时候不折行
        .pic-list
          font-size 0
          .pic-item
            display inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin 0



    .info
      padding 18px 18px 0 18px
      color rgb(7,17,27)
      .title
        padding-bottom 12px
        line-height 14px
        border-1px(rgba(7,17,27,0.1))
        font-size 14px
      .info-item
        padding 16px 12px
        line-height 16px
        border-1px(rgba(7,17,27,0.1))
        font-size 12px
        &:last-child
          border-none()






</style>
