
// 引入vue和router
import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import login from '../views/1.login.vue'
import index from '../views/2.index.vue'
import welcome from '../views/welcome.vue'
import users from '../views/user/users.vue'
import quanX from '../views/authority management/authority.vue'
import jiaoS from '../views/authority management/rightjiao.vue'
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
      component: index,
      // 设置重定向，一登陆就跳到欢迎页面
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: welcome
        },
        {
          name: 'users',
          path: 'users',
          component: users
        },
        {
          name: 'quanX',
          path: 'quanX',
          component: quanX
        },
        {
          name: 'jiaoS',
          path: 'jiaoS',
          component: jiaoS
        }
      ]
    }
  ]
})
