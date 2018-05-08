// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import routers from 'vue-router'
import VueResource from 'vue-resource'
import detailrouter from './routerdetail.js'
import './common/stylus/index.styl'

Vue.config.productionTip = false
Vue.use(routers);
Vue.use(VueResource)

const router=new routers(
{
  linkActiveClass:'active',//这里是某一个配置路由active时候的简写，linkActiveClass=v-link-active
  routes:detailrouter
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
