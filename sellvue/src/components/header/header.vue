<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <!--sellers.supports[0]取数据supports的第一条数据-->
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <!--icon-keyboard_arrow_right引入小图标-->
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <!--下面star绑定的size和score用于传入数据给star组件-->
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item,key) in seller.supports">
              <span class="icon" :class="classMap[seller.supports[key].type]"></span>
              <span class="text">{{seller.supports[key].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <i class="icon-close"></i>
      </div>
    </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  //import star from '/src/components/star/star';
  import star from '../star/star'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail() {
        this.detailShow = true
      },
      hideDetail(){
        this.detailShow = false
      }
    },
    created() {
      //通过classMap来使用icon标签下显示不同的class
      this.classMap = ['decrease', 'discount', 'special', 'guarantee', 'invoice']

    },
    components: {
      star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .header
    position relative
    overflow hidden
    color: #ffffff
    background rgba(7, 17, 27, 0.5)
    .content-wrapper
      position relative
      padding: 24px 12px 18px 24px
      font-size: 0
      .avatar
        display: inline-block
        vertical-align: top
        img //img是一个标签
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            // 设置display :inline-block之后的span中的宽高才起作用
            display: inline-block
            // vertical-align:顶部对齐
            vertical-align: top
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold

        .description
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
        .support
          .icon
            display: inline-block
            width: 12px
            height: 12px
            margin-right: 4px
            background-size: 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.special
              bg-image('special_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
          .text
            line-height: 12px
            vertical-align: top
            font-size: 10px
      .support-count
        position: absolute
        right: 22px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background: rgba(0, 0, 0, 0.2)
        text-align: center
        .count
          vertical-align: top
          font-size 10px
        .icon-keyboard_arrow_right
          margin-left 2px
          line-height 24px
          font-size 10px

    .bulletin-wrapper
      position relative
      height 28px
      line-height 28px
      padding: 0 22px 0 12px
      //white-space截行，
      white-space nowrap
      //overflow hidden将超出行的文字隐藏
      overflow hidden
      //text-overflow:ellipsis	显示省略符号来代表被修剪的文本。
      text-overflow ellipsis
      background rgba(7, 17, 27, 0.2)
      .bulletin-title
        display inline-block
        vertical-align top
        margin-top 8px
        width 22px
        height 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat no-repeat
      .bulletin-text
        vertical-align top
        margin 0 4px
        font-size 10px
      .icon-keyboard_arrow_right
        position absolute
        font-size 14px
        right 12px
        top 8px

    .background
      position absolute
      top 0px
      left 0px
      width 100%
      height 100%
      z-index -1
      //filter :blur(10px) 模糊效果
      filter: blur(10px)

    .detail
      position fixed
      z-index 100
      top 0
      left 0
      width 100%
      height 100%
      overflow auto
      background rgba(7, 17, 27, 0.8)
      &.fade-enter-active, &.fade-leave-active{
        transition: 1s all;  //表示动画执行时间一秒，对所有，
      }
      &.fade-enter-active,&.fade-leave{
        opacity 1
        background rgba(7, 17, 27, 0.8)
      }

      &.fade-enter,&.fade-leave-active{
        opacity:0;
        background rgba(7, 17, 27, 0)
      }
      /*transition :all 0.5s
      &.fade-transtion
        opacity 1
        background rgba(7, 17, 27, 0.8)
      &.fade-enter,&.fade-leave
        opacity 0
        background rgba(7, 17, 27, 0)*/

      .detail-wrapper
        width 100%
        min-height 100%
        .detail-main
          margin-top 64px
          //detail-main的padding用于下面的关闭按钮，下面向外伸展
          padding-bottom 64px
          .name
            line-height 16px
            text-align center
            font-size 16px
            font-weight 700
          .star-wrapper
            margin-top 18px
            padding 2px 0px
            text-align center
          .title
            display flex
            width 80%
            margin 28px auto 24px auto
            .line
              flex 1
              position relative
              top -6px//这里可以研究一下
              border-bottom 1px solid rgba(255,255,255,0.2)
            .text
              padding 0 12px
              font-weight 700
              font-size 14px

          .supports
            width 80%
            margin :0 auto
            .support-item
              padding 0 12px
              margin-bottom 12px
              font-size 0px
              &:last-child
                margin-bottom 0px
              .icon
                display inline-block
                width 16px
                height 16px
                vertical-align top
                margin-right 6px
                background-size 16px
                background-repeat no-repeat
                &.decrease
                 bg-image('decrease_2')
                &.special
                  bg-image('special_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')

              .text
                line-height 16px
                font-size 12px
          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              line-height 24px
              font-size 12px

      .detail-close
        position relative
        width 32px
        height 32px
        //margin -64px auto 0 auto:因为上面的detail-main下面向外伸展了padding 64px，留给了他detail-close
        //所以这个的margin的顶部margin要-64px
        margin -64px auto 0 auto
        clear both
        font-size 32px


</style>
