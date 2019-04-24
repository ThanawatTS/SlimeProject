<template>
 <v-app style="
    background: #3A1C71;
    background: -webkit-linear-gradient(to right, #FFAF7B, #D76D77, #3A1C71);
    background: linear-gradient(to right, rgba(212,228,239,1) 0%, rgba(134,174,204,1) 100%);
  ">
        <div id="customerManagement">
        <div id= "List">
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
  <transition name="fade">
        <b-card-group deck>
            <b-card bg-variant="info" text-variant="white" header="Current Restaurant" class="text-center">
            <b-card-text>  <br><br><br><h1>{{RestaurantName}}</h1><br><br><br> </b-card-text>
            </b-card>

        <b-card bg-variant="secondary" text-variant="white" header="Current Que" class="text-center">
            <b-card-text><br><br><br><h1>{{Restaurantcurrentque}}</h1><br><br><br></b-card-text>
        </b-card>

        <b-card bg-variant="success" text-variant="white" header="Your Que" class="text-center">
            <b-card-text><br><br><br><h1>{{Que}}</h1><br><br><br></b-card-text>
        </b-card>
        </b-card-group>
  </transition>


        </div>
    </div>
</v-app>
</template>

<script>
import firebase from 'firebase'
import firebaseApp from '../firebase/firebaseInit'
var emailDB
export default {
    name: 'customerManagement',
    data() {
        return {
            emailUser: "",
            Que : 0,
            Restaurantcurrentque :0,
            RestaurantName : "",
        }
    },

    methods: {
        getcurrentque(){
            firebaseApp.collection("RestaurantData").doc(this.$data.RestaurantName).get().then(doc => {
            this.Restaurantcurrentque = doc.data().Queue[0];  
            })
        },
        checkStatus(){
            var user = firebase.auth().currentUser;
                if(user){
                    this.$data.emailUser = user.email;
                    console.log(this.$data.emailUser)
                } else {
                    console.log("Didn't login yet")
                }

            if(this.$data.emailUser.slice(0,6) == 'lineid'){
                emailDB = firebaseApp.collection("emailSignupFromLine")
            } else {
                emailDB = firebaseApp.collection("emailSignupFromWebsite")
            }

            let checkNewUser = emailDB.doc(this.$data.emailUser)
            checkNewUser.get().then((doc) => {
                if(doc.data().newUser == true) {
                    emailDB = firebaseApp.collection("User").doc(this.$data.emailUser)
                    emailDB.set({
                        Queue: 0,
                        Restaurant: ""
                    })
                    setTimeout(() => {
                        checkNewUser.update({
                            newUser: false
                        })
                    }, 1000);
                } else {
                    console.log("User is not newbie")
                }
            })

        },
        Getdata(){    
             var user = firebase.auth().currentUser;
                if(user){
                    this.$data.emailUser = user.email;
                    console.log(this.$data.emailUser)
                } else {
                    console.log("Didn't login yet")
                }

            if(this.$data.emailUser.slice(0,6) == 'lineid'){
                emailDB = firebaseApp.collection("emailSignupFromLine")
            } else {
                emailDB = firebaseApp.collection("emailSignupFromWebsite")
            }
            setTimeout(() => {
                console.log(this.$data.emailUser)
                 firebaseApp.collection("User").doc(this.$data.emailUser).get().then( doc =>  {
                    this.Que = doc.data().Queue;
                    this.$data.RestaurantName = doc.data().Restaurant;
                })
            }, 1000);
        
        
    }
    },
    beforeMount(){
        setTimeout(() => {
            this.checkStatus()
            this.Getdata()
        }, 1000);
        
    }
}
</script>

<style>
button span {
    font-size: 0.7em;
}
button hr {
    margin: 5px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>