<template>
    <div id="restaurantManagement">
        <h1>Restaurant</h1>
        <form>
            <label> Create Restaurant Name </label><br/>
            <input v-model="restName" placeholder="Input restaurant name">
            <v-btn @click.prevent="createRestaurant(restName)">Create</v-btn>
            <v-btn @click.prevent="pushQueue">Queue</v-btn>
            
        </form>

        
    </div>
</template>

<script>
import firebase from 'firebase'
import firebaseApp from '../firebase/firebaseInit'
import { exists } from 'fs';

export default {
    name: 'restaurantManagement',
    data () {
        return {
            userCur: "",
            restName: "",
            restaurantEach: { restaurantName: "", emailOwner: "", emailEmployee: ""},
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
        genPassword(){
            var emp_password = Math.random().toString(36).slice(-6)
            return emp_password
        },
        createRestaurant(rest_name){
            var user = firebase.auth().currentUser;
                if(user){
                    this.$data.userCur = user.email;
                    console.log(this.$data.userCur)
                } else {
                    console.log("Didn't login yet")
                }

            var restaurantCreate = firebaseApp.collection("RestaurantByUser").doc(this.$data.userCur).collection("RestaurantsListsName")
            var restaurantExist = restaurantCreate
            var checkRestaurantName = rest_name
            var emp_restaurant
            var existName = false
        
            restaurantExist.get().then(function(querySnapshot){
                querySnapshot.forEach(function(doc){
                    console.log(doc.id, " => ", doc.data())
                    if(checkRestaurantName == doc.id){
                        console.log("This Name is already have!")
                        existName = true;
                    } else if (!existName) {
                        console.log("This Name not have Yet!")
                    }
                });

            })
            
            setTimeout(() => {
                if(existName){
                    console.log("Not add in database")
                } else {
                    restaurantCreate.doc(rest_name).set({
                        restaurantName: rest_name, 
                        emailOwner: this.$data.userCur,
                        emailEmployee: "EMP_"+this.$data.userCur
                    })
                    emp_restaurant = "EMP_"+this.$data.userCur
                    var emp_password = this.genPassword()
                }
                setTimeout(() => {
                    firebase.auth().createUserWithEmailAndPassword(emp_restaurant, emp_password).then( user => {
                        alert('Account created successful!');
                        console.log('register for employee: ', rest_name);
                        console.log("Employee password", emp_password)
                    },  err => {
                            alert(err.message);
                            console.log("Can't created account");
                        });
                }, 100);

            }, 1100);
            // restaurantExist.get().then(function(doc) {
            //     console.log(doc.data())
            //     if (doc.exists){
            //         for(var checkExistName in doc.data().Restaurant.RestaurantName){
            //             console.log("=========start")
            //             console.log("Count" + checkExistName)
            //             console.log("NAME: " + doc.data().Restaurant.RestaurantName[checkExistName].name)
            //             console.log("=========end")
            //             if(checkName == doc.data().Restaurant.RestaurantName[checkExistName].name){
            //                 console.log("This Name is already have!")
            //                 existName = true;
            //             } else {
            //                 console.log("Not have Yet!")
            //             }
            //         }
            //     }else{
            //         console.log("doc doesn't exist yet")
            //     }
            // })
            // setTimeout(() => {
            //     console.log(existName)
            //     if(existName){
            //         console.log("Not add in database")
            //     } else {

            //         this.$data.restaurantEach.name = this.$data.restuarantName
            //         var tar = this.iterationCopy(this.$data.restaurantEach)
            //         console.log("CheckedrestaurantInfo")
            //         console.log(tar)
            //         console.log(Object.values(tar))
            //         console.log(this.$data.restuarantInfo)
            //         this.$data.restuarantInfo.push(tar)
            //         //this.$data.restuarantInfo.push(this.$data.restaurantEach)
            //         console.log(Object.values(tar))
            //         //console.log(object.values(this.$data.restuarantInfo))
            //         var restaurantData = {
            //             Restaurant: {
            //                 RestaurantName: this.$data.restuarantInfo,
            //             }
            //         }
            //         restaurantCreate.set(restaurantData).then( function() {
            //             console.log("DOC Created!")
            //             this.$data.restaurantEach.name = ""
            //         })
                    

            //         // for (var x in this.$data.restaurantEach){
            //         //     console.log("===Each")
            //         //     console.log(this.$data.restaurantEach.name)
            //         //     console.log("===")
            //         //     console.log("==========Each2")
            //         //     console.log(Object.values(this.$data.restaurantEach))
            //         // }
            //         // for (var x in this.$data.restuarantInfo){
            //         //     console.log("===Info")
            //         //     console.log(this.$data.restuarantInfo[x].name)
            //         //     console.log("===")
            //         // }
                    
            //     } 
                
            // }, 1500);    
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

            
            var restaurantData = firebaseApp.collection("RestaurantByUser").doc(this.$data.userCur).collection("RestaurantsListsName")
            var temparr
            restaurantData.get().then((doc) => {

            })
            // restaurantData.get().then(function(doc) {
            //     console.log("1")
            //     if(doc.exists){
            //         console.log("2")
            //         // for(var x in doc.data().Restaurant.RestaurantName){
            //         //     restuarantInfo = doc.data().Restaurant.RestaurantName
            //         // }
            //         console.log("2"+ doc.data().Restaurant.RestaurantName)
            //         temparr = doc.data().Restaurant.RestaurantName
            //         console.log("loadData" + temparr)
            //     } else {
            //         console.log("N Doc")
            //     }
            // })
            setTimeout(() => {
                console.log("DATA", temparr)  
                this.$data.restuarantInfo = temparr
                if(temparr == null){
                    this.$data.restuarantInfo = []
                }
                console.log(this.$data.restuarantInfo)
            }, 1500);
            
        
        }
    },
    beforeMount(){
        //this.checkStatus()
        setTimeout(() => {
            //this.loadData()
        }, 1500);
       
    }
}

</script>