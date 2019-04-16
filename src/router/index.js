import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signup from '@/components/manager-role/Signup'
import Signin from '@/components/manager-role/Signin'
import fire from '@/components/fire'
import Addrestloca from '@/components/Addrestloca'
import Maps from '@/components/queueandnearby/Restaurant_nearby_search'
import Suggestion from '@/components/Suggestion'
import UserManager from '@/components/manager-role/UserManager'
import CustomerManagement from '@/components/manager-role/CustomerManagement'
import RestaurantManagement from '@/components/manager-role/RestaurantManagement'
import User_Que from '@/components/queueandnearby/User_que'
import Restaurant_Que from '@/components/queueandnearby/Restaurant_que'
import firebase from 'firebase';
import firebaseApp from '@/components/firebase/firebaseInit'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
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
      component: Maps,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/suggestion',
      name: 'Suggestion',
      component: Suggestion,
      meta: {
        requiresAuth: true,
        role: "customer"
      }
    },
    {
      path: '/userManager',
      name: 'UserManager',
      component: UserManager,
      meta: {
        requiresAuth: true,
        role: "newUser"
      }
    },
    {
      path: '/customerManagement',
      name: 'CustomerManagement',
      component: CustomerManagement,
      meta: {
        requiresAuth: true,
        role: "customer",
      }
    },
    {
      path: '/restaurantManagement',
      name: 'RestaurantManagement',
      component: RestaurantManagement,
      meta: {
        requiresAuth: true,
        role: "restaurantOwner",

      }
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
    }
  ]
})

var emailDB = firebaseApp.collection("emailSignupFromWebsite")

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log(requiresAuth)
  if(requiresAuth && !currentUser) next('/signin');
  // else if (!requiresAuth && currentUser) next('usermanager');
  else if(currentUser){
    var dbSetRole = emailDB.doc(currentUser.email)
    dbSetRole.get().then((doc) => {
      console.log(doc.data().role)
      if(doc.data().newUser) next();
      else if (doc.data().role == to.meta.role) next();
      else if (doc.data().role != to.meta.role) {
        if(!requiresAuth) next();
        else next(false);
      }
    })
    
  }
  else next();

})


export default router