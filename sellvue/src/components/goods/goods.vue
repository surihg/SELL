<template>
  <div class="big">
  <div class="goods">
    <div class="menu-wrapper" ref='menuWrapper'>
      <ul>
        <li @click="selectMenu(val)" v-for="(item,val) in goods" class="menu-item"
              :class="{'current':currentIndex===val}">
          <!--currentIndex是一个函数，当滚动到currentIndex返回的数值为当前索引val时候，就
          为这个li添加current这个class,改变他的样式-->
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon"
                  :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref='foodsWrapper'>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old"
                                                                v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @addBall="addball" :food="food"></cartcontrol>
                  <!--:food="food"第一个food是子组件的，后一个是父组件的，表示用父组件的goods这个数据中的food绑定子组件的json数据food-->
                  <!--当cartcontrol这个组件的food数据变化时，由于数据双向绑定，所以这个组件的goods中food发送变化，goods也发生变化-->
                  <!--所以下面的购物车组件可以通过遍历goods中的food中的数量和价格去实现得出总价-->
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
      <!--:select-foods="selectFoods"   select-foods是子组件的属性，在子组件属性变成驼峰形式selectFoods,后面的selectFoods是父组件的属性-->
    <!--父组件的select-foods其实就是这个组件中的selectFoods函数，函数通过返回值将一个数组给了子组件-->
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
    <food @addBall="addball" :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  //BScroll用于滚动
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart'
  import cartcontrol from'../cartcontrol/cartcontrol.vue'
  import food from'../food/food.vue'

  const ERR_OK = 0

  export default {
    props: {
      seller: {
        type:Object
      }
    },
    data() {
      return {
        goods: [],
        //listHeight:存储各个good的高度
        listHeight: [],
        scrollY:0,
        selectedFood:{}//这个selectFood表示在商品列表点击的food

      };
    },
    computed:{
      currentIndex() {
        for (let i = 0; i < this.listHeight.length;i++) {
          //获取每个item的高度区间
          let height1=this.listHeight[i];
          let height2=this.listHeight[i+1];
          if(!height2 ||(this.scrollY >= height1&this.scrollY < height2)){
              return i;
          }
        }
        return 0;
      },
      selectFoods(){
        let foods=[];
        this.goods.forEach((good)=>{
          good.foods.forEach((food)=>{
            if(food.count){
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      //通过classMap来使用icon标签下显示不同的class
      this.classMap = ['decrease', 'discount', 'special', 'guarantee', 'invoice']

      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });

        }
      });
    },
    methods: {
      selectMenu(index){
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el=foodList[index];
        this.foodsScroll.scrollToElement(el,300);
      },
      selectFood(food,event){//传入的food是点击的food,通过这个函数给了selectedFood数组，在给导入的food组件，food组件用他的food接收，所以就可以用了
        if(!event._constructed){
          return;
        }
        this.selectedFood=food;
        //上面的food组件绑定了ref="food"，所以这一句表示，调用food组件中的show方法
        this.$refs.food.show();
      },
      addball(target){
        this._drop(target);
      },
      _drop(target){
        this.$nextTick(()=>{//异步执行
          this.$refs.shopcart.drop(target);})

      },
      _initScroll() {
        //BScroll(dom元素，执行的函数)
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          //click:true在移动端不阻止默认事件，使点击可以进行
          click:true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          //click:true在移动端不阻止默认事件，不同于menuScroll的click:true
          //没这个，商品列表中的加号减号点不了
          click:true,
         // probeType:3:相当于一个探针，将高度反馈出来
          probeType:3
        });
        //
        this.foodsScroll.on('scroll',(pos)=>{
          //scrollY：foodsScroll在滚动时的高度
          this.scrollY=Math.abs(Math.round(pos.y));
        })
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        //alert(foodList.length);
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item=foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);

        }
      }
    },

    components:{
      shopcart,
      cartcontrol,
      food
    },

  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden /*超过的部分隐藏*/
    .menu-wrapper
      flex: 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table /*能够很好的垂直居中*/
        height 54px
        width 56px
        padding 0 12px
        line-height 14px
        &.current
          position relative
          z-index 10
          margin-top 2px
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display inline-block
          width 12px
          height 12px
          vertical-align top
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.special
            bg-image('special_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')

        .text
          display table-cell //******************
          width 56px
          vertical-align middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 12px

    .foods-wrapper
      .title
        flex 1
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7

      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          padding-bottom 0px
        .icon
          flex: 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0px
            height 14px
            line-height 14px
            font-size 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color: rgb(147, 153, 159)
          .desc
            line-height 12px
            margin-bottom 8px
          .extra
            .count
              margin-right 12px

          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240, 20, 20)
            .old
              text-decoration line-through /*这个就是生成那条删除线*/
              font-size 10px
              color: rgb(147, 153, 159)

          .cartcontrol-wrapper
            position absolute
            right 0px
            bottom 12px
</style>
