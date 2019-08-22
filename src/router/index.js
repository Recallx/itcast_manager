
// 引入vue和router
import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import login from '../views/1.login.vue'
import index from '../views/index.vue'

Vue.use(VueRouter)

export default new VueRouter({
  // 进行路由配置
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'index',
      path: '/index',
      component: index
    }
  ]
})
