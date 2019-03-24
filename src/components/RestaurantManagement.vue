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
            restaurantEach: { name : "", location: "15.02", queue: {} ,status: false},
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
                        console.log("=========start")
                        console.log("Count" + checkExistName)
                        console.log("NAME: " + doc.data().Restaurant.RestaurantName[checkExistName].name)
                        console.log("=========end")
                        if(checkName == doc.data().Restaurant.RestaurantName[checkExistName].name){
                            console.log("This Name is already have!")
                            existName = true;
                        } else {
                            console.log("Not have Yet!")
                        }
                    }
                }else{
                    console.log("doc doesn't exist yet")
                }
            })
            setTimeout(() => {
                console.log(existName)
                if(existName){
                    console.log("Not add in database")
                } else {

                    this.$data.restaurantEach.name = this.$data.restuarantName
                    var tar = this.iterationCopy(this.$data.restaurantEach)
                    console.log("CheckedrestaurantInfo")
                    console.log(tar)
                    console.log(Object.values(tar))
                    console.log(this.$data.restuarantInfo)
                    this.$data.restuarantInfo.push(tar)
                    //this.$data.restuarantInfo.push(this.$data.restaurantEach)
                    console.log(Object.values(tar))
                    //console.log(object.values(this.$data.restuarantInfo))
                    var restaurantData = {
                        Restaurant: {
                            RestaurantName: this.$data.restuarantInfo,
                        }
                    }
                    restaurantCreate.set(restaurantData).then( function() {
                        console.log("DOC Created!")
                        this.$data.restaurantEach.name = ""
                    })
                    

                    // for (var x in this.$data.restaurantEach){
                    //     console.log("===Each")
                    //     console.log(this.$data.restaurantEach.name)
                    //     console.log("===")
                    //     console.log("==========Each2")
                    //     console.log(Object.values(this.$data.restaurantEach))
                    // }
                    // for (var x in this.$data.restuarantInfo){
                    //     console.log("===Info")
                    //     console.log(this.$data.restuarantInfo[x].name)
                    //     console.log("===")
                    // }


                    

                    
                } 
                
            }, 1500);    
        },
        iterationCopy(src){
            var target = {}
            for(var prop in src){
                if (src.hasOwnProperty(prop)) {
                    target[prop] = src[prop];
                }
            }
            return target;
        },
        loadData(){
            var user = firebase.auth().currentUser;
                if(user){
                    this.$data.userCur = user.email;
                    console.log(this.$data.userCur)
                } else {
                    console.log("Didn't login yet")
                }

            
            var restaurantData = firebaseApp.collection("RestaurantByUser").doc(this.$data.userCur)
            var temparr
            restaurantData.get().then(function(doc) {
                console.log("1")
                if(doc.exists){
                    console.log("2")
                    // for(var x in doc.data().Restaurant.RestaurantName){
                    //     restuarantInfo = doc.data().Restaurant.RestaurantName
                    // }
                    console.log("2"+ doc.data().Restaurant.RestaurantName)
                    temparr = doc.data().Restaurant.RestaurantName
                    console.log("loadData" + temparr)
                } else {
                    console.log("N Doc")
                }
            })
            setTimeout(() => {
                console.log("DATA" + temparr)  
                this.$data.restuarantInfo = temparr
                if(temparr == null){
                    this.$data.restuarantInfo = []
                }
                console.log(this.$data.restuarantInfo)
            }, 1500);
            
        
        }
    },
    beforeMount(){
        this.checkStatus()
        setTimeout(() => {
            this.loadData()
        }, 1500);
       
    }
}

</script>