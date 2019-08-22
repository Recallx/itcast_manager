
// 引入vue和router
import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import login from '../components/1.login.vue'

Vue.use(VueRouter)

export default new VueRouter({
  // 进行路由配置
  routes: [
    {
      name: 'defule',
      path: '/',
      directives: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      components: login
    }
  ]
})
