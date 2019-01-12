import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import UserSelected from '@/components/UserSelected'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'UserSelected',
      component: UserSelected
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
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    }
  ]
})

export default router