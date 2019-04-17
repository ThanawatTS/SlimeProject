import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signup from '@/components/manager-role/Signup'
import Signin from '@/components/manager-role/Signin'
import fire from '@/components/fire'
import Addrestloca from '@/components/Addrestloca'
import Maps from '@/components/queueandnearby/Restaurant_nearby_search'
import Suggestion from '@/components/Suggestion'
import Usermanager from '@/components/manager-role/UserManager'
import CustomerManagement from '@/components/manager-role/CustomerManagement'
import RestaurantManagement from '@/components/manager-role/RestaurantManagement'
import User_Que from '@/components/queueandnearby/User_que'
import Restaurant_Que from '@/components/queueandnearby/Restaurant_que'
import User_history from '@/components/User_history'

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
    },
    {
      path: '/Restaurant_que',
      name: 'Restaurant_Que',
      component: Restaurant_Que
    },
    {
      path: '/User_history',
      name: 'User_history',
      component: User_history
    }
  ]
})

export default router