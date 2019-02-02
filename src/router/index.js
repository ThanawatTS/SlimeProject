import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signup from '@/components/Signup'
import Signin from '@/components/Signin'
import fire from '@/components/fire'
import Addrestloca from '@/components/Addrestloca'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin
    },
    {
      path: '/fire',
      name: 'fire',
      component: fire
    },
    {
      path: '/addrest',
      name: 'Addrestloca',
      component: Addrestloca
    }
  ]
})

export default router