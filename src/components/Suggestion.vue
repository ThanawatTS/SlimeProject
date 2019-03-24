<template>
    <div>
        <v-container fluid>
            <v-flex xs12>
                <div>
                    <v-layout align-center justify-center column fill-height>
                          
                        <form>
                            <label> Add Restaurant List </label><br/>
                            <input v-model="restaurant_Name" id="restaurantName" placeholder="Restaurant Name"><br/>
                            <span v-if="seen"> {{ message_duplicatename }} <br/></span>
                            <v-btn small color="primary" v-on:click.prevent="addedRestaurantList(restaurant_Name)" :disabled="restaurant_Name == emptyName">Restaurant Name</v-btn>
                        </form>
                        
                        <ul>
                            <li
                                v-for="listName in restaurant_List"
                                v-bind:key="listName.id"
                                v-bind:title="listName.Name"
                            >
                            {{ listName.Name }} {{ listName.id}}
                            <v-btn small color="red" v-on:click.prevent="removeRestaurantName(listName)">Remove</v-btn>
                            </li>
                        </ul>
                        
                    </v-layout>
                </div>
            
            </v-flex>
            <br/>
            <v-flex xs12>

                <v-layout align-center justify-center column fill-height>
                <h1> Random Restaurant</h1>

                <v-btn small color="orange" v-on:click="randomRestaurant(restaurant_List.length)" :disabled="suggestion_restaurant != emptyName || restaurant_List.length == 0">Random</v-btn>
                <span> Random : {{ suggestion_restaurant }}</span>
                </v-layout>

                <v-btn v-on:click="loadData">loadedData</v-btn>
                <v-btn v-on:click="userStatus">userStatus</v-btn>
                <v-btn v-on:click="setUpUser">SetUP</v-btn>

            </v-flex>

        </v-container>

    </div>
</template>


<script>
import firebase from 'firebase'
import firebaseApp from './firebaseInit'

export default {
    name: 'suggestion',
    data () {
        return {
            restaurant_Name: '',
            restaurant_List: [],
            dataRestaurant_List: [],
            menuInFB: [],
            emptyName: '',
            suggestion_restaurant: '',
            message_duplicatename: 'Already have one',
            seen: false,
            userEmail: ''
        }
    },
    methods: {
        addedRestaurantList(name){
            var checkduplicateName = false;
            //First time when web is reder it will check in firebase cloud isn't it have a data yet
            //If it already have it will copy it in "menuInFB"
            var user = firebase.auth().currentUser;
            if(user){
                this.$data.userEmail = user.email;
                console.log("Login by email: ",this.$data.userEmail)
            } else {
                console.log("Didn't login")
            }

            var userMenuAdded = firebaseApp.collection("usersChoosingMenu").doc(this.$data.userEmail)
            
            if(this.restaurant_List.length == 0){
                // userMenuAdded.get().then(function(doc) {
                // if (doc.exists){
                //     for (var restaurantList in doc.data().menu){
                //         this.$data.menuInFB = doc.data().menu;
                //     }
                // } else {
                //     console.log("No such document!");
                // }
                // }).catch(function(error){
                // console.log("Error getting document: ", error)
                // });
                

                // if(this.$data.dataRestaurant_List.length == 0){
                //     setTimeout(() => {
                //         this.$data.dataRestaurant_List.push({
                //         Name: this.restaurant_Name
                //         })
                //         this.restaurant_Name = ''   
                //     }, 500);
                // } else {
                //     setTimeout(() => {
                //         this.$data.dataRestaurant_List = this.$data.menuInFB
                //         this.$data.dataRestaurant_List.push({
                //         Name: this.restaurant_Name
                //         })
                //         this.restaurant_Name = ''   
                //     }, 500);
                // }
                setTimeout(() => {
                        this.$data.dataRestaurant_List.push({
                        Name: this.restaurant_Name
                        })
                        this.restaurant_Name = ''
                    }, 1000);

                this.restaurant_List.push({
                    Id: this.restaurant_ID,
                    Name: this.restaurant_Name
                })

            } else {
                //check isn't user input a same name in a random list
                for(var x in this.restaurant_List){
                    if(this.$data.restaurant_Name == this.$data.restaurant_List[x].Name){
                        checkduplicateName = true;
                        this.$data.seen = true;
                        setTimeout(() => {
                            this.$data.seen = false;
                            this.restaurant_Name = ''
                            }, 2000);
                    }
                }
                setTimeout(() => {
                    this.$data.dataRestaurant_List.push({
                    Name: this.restaurant_Name
                    })
                    this.restaurant_Name = ''   
                }, 500);
                if(checkduplicateName == false){
                    this.restaurant_List.push({
                    Id: this.restaurant_ID++,
                    Name: this.restaurant_Name
                    })       
                }  
            }
            setTimeout(() => {
                    userMenuAdded.set({
                    menu: this.$data.dataRestaurant_List
                    })
            }, 1000);
        },
        removeRestaurantName(index){
            this.restaurant_List.splice(index,1)
            // userData.update({
            //     menu: this.$data.restaurant_List
            // })
        },
        randomRestaurant(num){
            this.$data.suggestion_restaurant = this.$data.restaurant_List[Math.floor(Math.random()*num)].Name
            setTimeout(() => {
                this.$data.suggestion_restaurant = ''
            }, 2000);
        },
        //After website has render. First time that get data from firebase will be undefied
        //So this method was created to be prepared for use in future step.
        loadData(){
            var user = firebase.auth().currentUser;
            if(user){
                this.$data.userEmail = user.email;
                console.log("User login by email: " + this.$data.userEmail)
            } else {
                console.log("Didn't login yet")
            }

            var userInputData = firebaseApp.collection("usersChoosingMenu").doc(this.$data.userEmail)
            var userDataFB

            userInputData.get().then(function(doc) {
                if(doc.exists){
                    userDataFB = doc.data().menu
                    console.log("Doc data: ", userDataFB)
                } else {
                    console.log("No Doc")
                }
            })

            setTimeout(() => {
                console.log("Menu in Database: ",userDataFB)
                if(userDataFB != null){
                    //this.$data.restaurant_List = userDataFB
                    this.$data.dataRestaurant_List = userDataFB
                } else {
                    this.$data.restaurant_List = []
                    this.$data.dataRestaurant_List = []
                }
            }, 1500);



            // userData.get().then(function(doc) {
            //     if (doc.exists){
            //         for (var restaurantList in doc.data().menu){
            //             menuInFB = doc.data().menu;              
            //         }
            //     } else {
            //         console.log("No such document!");
            //         //const userData = firebaseApp.collection("users").doc(this.$data.userEmail)
            //     }
            //     }).catch(function(error){
            //     console.log("Error getting document: ", error)
            //     });
                
        },
        userStatus(){
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                     // User is signed in.
                     console.log(user)
                     console.log("user login")
                     console.log(user.displayName + "  " + user.email)
                } else {
                    console.log(user)
                    // No user is signed in.
                    console.log("user not login")
                }
                });
                console.log("BR")
                var user = firebase.auth().currentUser;
                if (user){
                    console.log(user.email)
                } else {

                }
                
                
        },
        setUpUser(){
            var user = firebase.auth().currentUser;
            
            this.$data.userEmail = user.email
            console.log(this.$data.userEmail)
        }
    },
    beforeMount(){
        setTimeout(() => {
            this.loadData();
        }, 1000);
        
        //this.setUpUser();
    }
}
</script>


<style scoped>



</style>
