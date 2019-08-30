
// 引入vue和router
import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import login from '../views/1.login.vue'
import index from '../views/2.index.vue'
import welcome from '../views/welcome.vue'
import users from '../views/user/users.vue'
import rights from '../views/authority management/authority.vue'
import roles from '../views/authority management/rightjiao.vue'
import Goods from '../views/goods/goods.vue'
import List from '../views/goods/list.vue'
import add from '../views/goods/add.vue'
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
          name: 'rights',
          path: 'rights',
          component: rights
        },
        {
          name: 'roles',
          path: 'roles',
          component: roles
        },
        {
          name: 'goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'list' },
          // 嵌套路由
          children: [
            {
              name: 'list',
              path: 'list',
              component: List
            },
            {
              name: 'add',
              path: 'add',
              component: add
            }
          ]
        }
      ]
    }
  ]
})
