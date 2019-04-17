<template>
 <div class="employee">
  <div class="container">
      <h1>{{email}}</h1>
      <h1>{{ownerEmail}}</h1>
      <h1>{{restaurantName}}</h1>
      <v-btn round color="primary" dark v-on:click="gotoQueue(restaurantName)">Queue Manage</v-btn>
  </div>
 </div>
</template>


<script>
import firebase from 'firebase';
import firebaseApp from '../firebase/firebaseInit'

export default {
    name: 'employee',
    data() {
        return {
            title: 'employee',
            email: "",
            ownerEmail: "",
            restaurantName: ""
        }
    },
    methods: {
        gotoQueue (restaurant) {
            this.$router.push({name: 'Restaurant_que', params:{Pid: restaurant}})
        },
        loadData(){
            var user = firebase.auth().currentUser;
            if(user){
                console.log(user.email)
                this.$data.email = user.email;
                
            } else {
                console.log("NO LONGER USER")
            }

            var getData = firebaseApp.collection("EmployeeEmail").doc(this.$data.email)
            getData.get().then((doc) => {
                if(doc.exists){
                    this.$data.ownerEmail = doc.data().owner
                }else{
                    console.log("DOC doesn't exists")
                }
            })

            setTimeout(() => {
            getData = firebaseApp.collection("RestaurantByUser").doc(this.$data.ownerEmail).collection("RestaurantsListsName")
            getData.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var lwcEmail = doc.data().emailEmployee.toLowerCase();
                    if(lwcEmail == this.$data.email){
                        this.$data.restaurantName = doc.data().restaurantName
                    }
                });
            }) 
            }, 1100);
           
        }
    },
    beforeMount(){
        this.loadData()
    }

 }
</script>