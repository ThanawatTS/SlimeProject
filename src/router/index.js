import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import Signup from '@/components/Signup.vue'
import Login from '@/components/Login.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

export default router