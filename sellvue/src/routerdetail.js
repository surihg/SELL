import goods from './components/goods/goods.vue'
import seller from './components/seller/seller.vue'
import ratings from './components/ratings/ratings.vue'

export default [
  {
    path:'/goods',
    component:goods
  },
  {
    path:'/seller',
    component:seller
  },
  {
    path:'/ratings',
    component:ratings
  },
  {
    path:'*',
    component:goods
  },
  {
    path:'/',
    component:goods
  }
];


