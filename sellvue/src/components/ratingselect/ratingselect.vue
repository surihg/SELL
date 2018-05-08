<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <!--select传入的2，是一种类型，表示获取某种类型的评论-->
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">
        {{desc.positive}}
        <span class="count">{{positives.length}}</span></span>
      <!--通过返回函数的长度来得出同种评价的个数-->
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">
        {{desc.negative}}
        <span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2


  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {//用户选择要看的评论的类型
        type: Number,
        default: ALL
      },
      onlyContent: {//是否只看有内容的评论
        type: Boolean,
        default: false
      },
      desc: {//对于评论类型的分类描述
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed:{
      positives(){
        return this.ratings.filter((rating)=>{//过滤得到positive的评论
          return rating.rateType===POSITIVE
        });
      },
      negatives(){
        return this.ratings.filter((rating)=>{//过滤得到positive的评论
          return rating.rateType===NEGATIVE
        });
      }
    },
    methods: {
      select(type,event){
        if(!event._constructed){
          return;
        }
        //this.selectType=type;//这句话将selectType改编为某种评论类型
        this.$emit('select',type);
      },
      toggleContent(event){
        if(!event._constructed){
          return;
        }
        //this.onlyContent=!this.onlyContent;//这一句话改动了父组件的属性
        // vue2.0不能在子组件中修改父组件的
        //这里是一种方法，用$emit发送事件，在父组件接收，在父组件修改
        this.$emit('toggle');//toggle是事件名
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding 18px 0px
      margin 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 0px
      .block
        display inline-block
        padding 8px 12px
        line-height 16px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rgb(77, 85, 93)
        &.active
          color #fff
        .count
          margin-left 2px
          font-size 8px
        &.positive
          background rgba(0, 160, 220, 0.2)
          &.active //&.active，表示被选中时的样式
            background rgb(0, 160, 220)
        &.negative
          background rgba(77, 85, 92, 0.2)
          &.active
            background rgb(77, 85, 92)

    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      color rgb(147, 153, 159)
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        display inline-block
        vertical-align top //这句话要产生作用需要上一句话display inline-block
        margin-right 4px
        font-size 24px
      .text
        display inline-block
        vertical-align top
        font-size 12px
</style>
