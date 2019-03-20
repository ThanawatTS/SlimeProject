<template>
    <div id="restaurantManagement">
        <h1>Restaurant</h1>
        <form>
            <label> Create Restaurant Name </label><br/>
            <input v-model="restuarantName" placeholder="Input restaurant name">
            <v-btn @click.prevent="createRestaurant(restuarantName)">Create</v-btn>
        </form>

        
    </div>
</template>

<script>
import firebase from 'firebase'
import firebaseApp from './firebaseInit'

export default {
    name: 'restaurantManagement',
    data () {
        return {
            userCur: "",
            restuarantName: "",
            restaurantEach: { name : "", Location: "15.02", queue: {} },
            restuarantInfo: []
            
        }
    },
    methods: {
        checkStatus(){
            firebase.auth().onAuthStateChanged(function(user) {
                if(user){
                    console.log(user.email)
                } else {
                    console.log("Didn't login")
                }
            })

            
        },
        createRestaurant(rest_name){
            var user = firebase.auth().currentUser;
                if(user){
                    this.$data.userCur = user.email;
                    console.log(this.$data.userCur)
                } else {
                    console.log("Didn't login yet")
                }

            
            var restaurantCreate = firebaseApp.collection("RestaurantByUser").doc(this.$data.userCur)
            var restaurantExist = restaurantCreate;
            var checkName = this.$data.restuarantName
            var existName = false;

            restaurantExist.get().then(function(doc) {
                if (doc.exists){
                    for(var checkExistName in doc.data().Restaurant.RestaurantName){
                        console.log("=========")
                        console.log("Count" + checkExistName)
                        console.log("NAME: " + doc.data().Restaurant.RestaurantName[checkExistName].name)
                        console.log("=========")
                        if(checkName == doc.data().Restaurant.RestaurantName[checkExistName].name){
                            console.log("This Name is already have!")
                            existName = true;
                        } else {
                            console.log("Not have Yet!")
                        }
                    }
                }else{
                    console.log("else output")
                }
            })
            setTimeout(() => {
                console.log(existName)
                if(existName){
                    console.log("Not add in database")
                } else {
                    this.$data.restaurantEach.name = this.$data.restuarantName
                    this.$data.restuarantInfo.push(this.$data.restaurantEach)
                }

                var restaurantData = {
                    Restaurant: {
                        RestaurantName: this.$data.restuarantInfo,
                    }
                }
                restaurantCreate.set(restaurantData).then( function() {
                    console.log("DOC Created!")
                })
            }, 1500);    
        },
    },
    beforeMount(){
        this.checkStatus()
    }
}

</script>