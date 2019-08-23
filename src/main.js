import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/index.less'
import router from './router/index.js'

Vue.use(ElementUI)
Vue.config.productionTip = false

// 添加导航守卫，在vue-router里面有beforeach
router.beforeEach((to, from, next) => {
  // console.log(to)
  // 拿到存储在本地存储的token
  let tokenname = localStorage.getItem('itcast_managet')
  // 判断这个有没有这个值
  if (tokenname || to.path === '/login') {
    // 通过next往下执行
    next()
  } else {
    // 也是通过next来设置重定向，跳转
    next({ name: 'login' })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
