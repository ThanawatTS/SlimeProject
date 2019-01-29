import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signup from '@/components/Signup'
// import Login from '@/components/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: Signup
    },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: Login
    // }
  ]
})

export default router