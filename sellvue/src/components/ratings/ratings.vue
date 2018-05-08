<template>
  <div class="ratings" ref="ratings">
    <!--//ratings-comtent和ratings当ratings-content大于ratings的高度时候，可以制作滚动效果-->
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周围商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>

          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent"
                   :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType,rating.text)"  v-for="rating in ratings" class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>

              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime|formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star'
  import split from'../split/split.vue'
  import ratingselect from'../ratingselect/ratingselect.vue'
  import {formatDate} from '../../common/js/date'

  import BScroll from 'better-scroll'

  const ALL = 2
  const ERR_OK = 0

  export default {
    props:{
      seller:{
        type:Object
      }
    },
      data(){
        return{
          ratings:[],
          selectType:ALL,//评论的跟踪量，跟ratingselectz中一样
          onlyContent:true,//评论的跟踪量，跟ratingselectz中一样
        };
      },
      created(){
        this.$http.get('/api/ratings').then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            this.ratings = response.data;
            this.$nextTick(()=>{
              this.scroll=new BScroll(this.$refs.ratings,{
                click:true
            })

            });
          }
        });
      },
    filters:{//过滤器级别
      formatDate(time){
        let date= new Date(time);
        //上面的formatDate是在这个vue中定义的函数
        //下面这个formatDate是引入的函数
        return formatDate(date,'yyyy-MM-dd hh:mm')
      }
    },
    methods:{
      selectRating(type){
        this.selectType=type;
        this.$nextTick(()=>{
          this.scroll.refresh()
        });
      },
      toggleContent(){
        this.onlyContent=!this.onlyContent;
        this.$nextTick(()=>{
          this.scroll.refresh()
        });
      },
      needShow(type ,text){
        if(this.onlyContent&&!text){
          return false;
        }
        if(this.selectType===ALL){
          return true;
        }else{
          return type ===this.selectType//这里返回的是一个布尔值，如果selectType，也就是当前
          //选择的类型和某个item的type一样的话，就返回true，显示
        }
      }
    },
    components:{
      star,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratings
    position absolute
    top 174px
    bottom 0px
    left 0px
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px
        padding:6px 0
        width 137px
        border-right 1px solid rgba(7,17,27,0.1)
        text-align center
        @media only screen and (max-width: 320px)//针对小屏幕的手机
          flex:0 0 120px
          width 120px

        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255,153,0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7,17,27)
        .rank
          padding-bottom 12px
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0//横向排列
          .title
            display inline-block//横向排列
            line-height 18px
            vertical-align top//横向排列
            font-size 12px
            color rgb(7,17,27)
          .star//引入的组件会变成一个div
            display inline-block//横向排列
            margin 0 12px
            vertical-align top//横向排列
          .score
            display inline-block//横向排列
            line-height 18px
            vertical-align top//横向排列
            font-size 12px
            color rgb(255,153,0)
        .delivery-wrapper
          font-size 0
          .title//因为文字和文字之间的高度是一样的，所以不用display inline-block和vertical-align top
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
          .delivery
            margin-left 12px
            font-size 12px
            color rgb(147,153,159)




    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex
        padding 18px 0px
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7,17,27)
          .star-wrapper
            margin-bottom 6px
            font-size 0px
            .star
              display inline-block
              margin-right 6px
              vertical-align top
            .delivery
              display inline-block
              vertical-align top
              line-height 12px
              font-size 10px
              color rgb(147,153,159)


          .text
            line-height 18px
            color rgb(7,17,27)
            font-size 12px
            margin-bottom 18px
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up,.item
              display inline-block
              margin 0 8px 4px 0px
              font-size 9px
            .icon-thumb_up
              color rgb(0,160,220)
            .item
              padding 0 6px
              border 1px solid rgba(7,17,27,0.1)
              border-radius 1px
              color rgb(147,153,159)
              background #fff
          .time
            position absolute
            top 0px
            right 0px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
</style>
