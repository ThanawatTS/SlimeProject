import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signup from '@/components/manager-role/Signup'
import Signin from '@/components/manager-role/Signin'
import Addrestloca from '@/components/Addrestloca'
import Maps from '@/components/queueandnearby/Restaurant_nearby_search'
import Suggestion from '@/components/SuggestionMenu/Suggestion'
import UserManager from '@/components/manager-role/UserManager'
import CustomerManagement from '@/components/manager-role/CustomerManagement'
import RestaurantManagement from '@/components/manager-role/RestaurantManagement'
import Restaurant_Que from '@/components/queueandnearby/Restaurant_que'
import Employee from '@/components/manager-role/Employee'
import AllMenu from '@/components/SuggestionMenu/AllMenu'
import Home from '@/components/home'
//import layout
import Usersidebar from '@/components/layout/user_sidebar'
import beforelogin from '@/components/layout/beforelogin'
import restaurantsidebar from '@/components/layout/restaurant_sidebar'
//import firebase
import firebase from 'firebase';
import firebaseApp from '@/components/firebase/firebaseInit'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/t',
      component: Usersidebar,
      children: [{
        path: '/maps',
        name: 'Maps',
        component: Maps,
        meta: {
          requiresAuth: true,
          role: "customer"
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
        path: '/customerManagement',
        name: 'CustomerManagement',
        component: CustomerManagement,
        meta: {
          requiresAuth: true,
          role: "customer",
        }
      },
      ]
    },
    {
      path: '/',
      component: beforelogin,
      children: [
        {
          path: '/signup',
          name: 'Signup',
          component: Signup
        },
        {
          path: '/',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/signin',
          name: 'signin',
          component: Signin
        },
        {
          path: '/home',
          name: 'home',
          component: Home
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
      ]
    },
    {
      path: '/r',
      component: restaurantsidebar,
      children: [{
        
          path: '/restaurantManagement',
          name: 'RestaurantManagement',
          component: RestaurantManagement,
          meta: {
            requiresAuth: true,
            role: "restaurantOwner",
          }
        },
        {
          path: '/Restaurant_que/:Pid',
          name: 'Restaurant_que',
          component: Restaurant_Que,
          meta: {
            requiresAuth: true,
            role: "restaurantOwner",
            roleEmp: "employee"
          }
        },
      ]
    },
    {
      path: '/addrest',
      name: 'Addrestloca',
      component: Addrestloca
    },
    {
      path: '/employee',
      name: 'Employee',
      component: Employee,
      meta: {
        requiresAuth: true,
        roleEmp: "employee"
      }
    },
    {
      path: '/allmenu',
      name: 'AllMenu',
      component: AllMenu
    }


  ]
})

var emailDB

router.beforeEach((to, from, next) => {
  const curUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log(requiresAuth)
  if(curUser != null){
    var examineEmail = curUser.email.slice(0,3)
    var lineEmail = curUser.email.slice(0,6)
    if(examineEmail == "emp") emailDB = firebaseApp.collection("EmployeeEmail")
    else if (lineEmail == "lineid") emailDB = firebaseApp.collection("emailSignupFromLine")
    else emailDB = firebaseApp.collection("emailSignupFromWebsite")
  }

  // if(requiresAuth && !curUser) next('/signin');
  // else if (!requiresAuth && currentUser) next('usermanager');
  if(curUser){
    var dbSetRole = emailDB.doc(curUser.email)
    console.log(curUser.email)
    console.log(dbSetRole)
    console.log("curUser index") 
    dbSetRole.get().then((doc) => {
      console.log("role: ",doc.data().role)
      console.log("TO meta: ", to.meta.role)
      console.log("To metaEMp", to.meta.roleEmp)
      if(doc.data().newUser){console.log("1"); next();}
      else if (doc.data().role == to.meta.role){console.log("2"); next();}
      else if (doc.data().role == to.meta.roleEmp){console.log("4"); next();}
      else if (doc.data().role != to.meta.role) {
        console.log("3");
        if(!requiresAuth){
          console.log("not reqire", !requiresAuth)
          next();
        } else {
          console.log("require", requiresAuth)
          next(false);
        }
      }
    }).catch((error) => {
      firebase.auth().signOut().then(() => {
        console.log("Signout")
      }).catch((err) => {
        console.log(err)
      })
    })
  }
  else next();

})


export default router