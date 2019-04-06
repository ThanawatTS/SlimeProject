import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signup from '@/components/Signup'
import Signin from '@/components/Signin'
import fire from '@/components/fire'
import Addrestloca from '@/components/Addrestloca'
import Maps from '@/components/Maps'
import Suggestion from '@/components/Suggestion'
import Usermanager from '@/components/UserManager'
import CustomerManagement from '@/components/CustomerManagement'
import RestaurantManagement from '@/components/RestaurantManagement'
import User_Que from '@/components/User_que'

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
    },
    {
      path: '/maps',
      name: 'Maps',
      component: Maps
    },
    {
      path: '/suggestion',
      name: 'Suggestion',
      component: Suggestion,
    },
    {
      path: '/usermanager',
      name: 'Usermanager',
      component: Usermanager
    },
    {
      path: '/customerManagement',
      name: 'CustomerManagement',
      component: CustomerManagement
    },
    {
      path: '/restaurantManagement',
      name: 'RestaurantManagement',
      component: RestaurantManagement
    },
    {
      path: '/User_que',
      name: 'User_Que',
      component: User_Que
    }
  ]
})

export default router