// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import router from './router'
import VueFirestore from 'vue-firestore'
import * as VueGoogleMaps from 'vue2-google-maps'
import Vuex from 'vuex'


Vue.config.productionTip = false
Vue.use(VueFirestore);
Vue.use(Vuetify)
Vue.use(Vuex)

export const EventBus = new Vue();

Vue.use(VueGoogleMaps, {
      load: {
        key: 'AIzaSyAnORRsK7P0NEAs8WtETJ2YHVPaobDjdPI',
        libraries: 'places', 
      },
});



/* eslint-disable no-new */
new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
})

