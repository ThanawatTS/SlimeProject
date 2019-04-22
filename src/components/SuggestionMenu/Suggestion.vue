<template>
    <div>
                    
                    <h1>Menu Sugggestion</h1>
                    <div id="munuPrepare" v-for="(menuPre, i) in menuSuggestion" v-bind:key="i">
                        <v-btn small color="blue" @click="addedRestaurantList(menuPre.Name)" :disabled="delaybtn"> {{menuPre.Name}} </v-btn>
                    </div>

        <v-container fluid>
            <v-flex xs12>
                <div>
                    
                    <h1>Favourite Menu (Most 5)</h1>
                    <div id="fovouriteMenu" v-for="(menuFav, i) in favouriteMenuCur" v-bind:key="i">
                        <v-btn small color="blue" @click="addedRestaurantList(menuFav.favouriteName)" :disabled="delaybtn"> {{menuFav.favouriteName}} </v-btn>
                        <v-btn small color="red" @click="removeFavouriteMenu(menuFav.favouriteName)">Remove</v-btn>
                    </div>
                    
                    <v-layout align-center justify-center column fill-height>
                          
                        <form>
                            <label> Add Restaurant List </label><br/>
                            <input v-model="restaurant_Name" id="restaurantName" placeholder="Restaurant Name"><br/>
                            <span v-if="seen"> {{ message_duplicatename }} <br/></span>
                            <v-btn small color="primary" v-on:click.prevent="addedRestaurantList(restaurant_Name)" :disabled="restaurant_Name == emptyName">Restaurant Name</v-btn>
                            <v-btn small color="primary" v-on:click.prevent="addMenuFavourite(restaurant_Name)" :disabled="restaurant_Name == emptyName || favouriteMenuCur.length == 5">add Favourite Menu</v-btn>
                        </form>
                        
                        <ul>
                            <li
                                v-for="listName in restaurant_List"
                                v-bind:key="listName.id"
                                v-bind:title="listName.Name"
                            >
                            {{ listName.Name }} {{ listName.id }}
                            <v-btn small color="red" v-on:click.prevent="removeRestaurantName(listName.Name)">Remove</v-btn>
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

                <div v-for="(lastpick, i) in lastPicks" v-bind:key="i"> <h3> {{  lastpick.Picked }} </h3> </div>
                <v-btn small color="blue" @click="lastPick(suggestion_restaurant)" :disabled="suggestion_restaurant == emptyName"> Deal </v-btn>
                <v-btn small color="red" @click="reSuggestion()" :disabled="suggestion_restaurant == emptyName" > Cancel </v-btn>

            </v-flex>

        </v-container>

    </div>
</template>


<script>
import firebase from 'firebase'
import firebaseApp from '../firebase/firebaseInit'

export default {
    name: 'suggestion',
    data () {
        return {
            restaurant_Name: '',
            restaurant_List: [],
            restaurant_ID: 1,
            dataRestaurant_List: [],
            menuInFB: [],
            emptyName: '',
            suggestion_restaurant: '',
            message_duplicatename: 'Already have one',
            seen: false,
            userEmail: '',
            setupMenu: firebaseApp.collection("PreparedMenu"),
            menuSuggestion: [],
            delaybtn: false,
            favouriteMenuCur: [],
            lastPicks: []
        }
    },
    created(){this.setUpMenu()},
    methods: {
        lastPick(choice) {
            var userMenuAdded = firebaseApp.collection("usersChoosingMenu").doc(this.$data.userEmail)

            if(this.$data.lastPicks.length == 3){
                this.$data.lastPicks.shift()
            }

            this.$data.lastPicks.push({
                Picked: choice
            })

            userMenuAdded.update({
                lastThreePick: this.$data.lastPicks
            })

            this.$data.suggestion_restaurant = ''
        },
        reSuggestion() {
            this.$data.suggestion_restaurant = ''
        },
        disableBtn(){
            this.$data.delaybtn = true
            setTimeout(() => {
                this.$data.delaybtn = false
            }, 300);
        },
        setUpMenu() {
            this.$data.setupMenu.get().then((querySnapShot) => {
                querySnapShot.forEach((doc) => {
                    if(doc.id == "ตามสั่ง"){
                        this.$data.menuSuggestion = doc.data().menu
                    }
                })
            })
        },
        addMenuFavourite(favourite_Menu){
            var user = firebase.auth().currentUser
            if(user) {
                this.$data.userEmail = user.email
            } else {
                console.log("Didn't login yet")
            }
            var userMenuAdded = firebaseApp.collection("usersChoosingMenu").doc(this.$data.userEmail)
            
            if(this.$data.favouriteMenuCur.length < 5){
                if(this.$data.favouriteMenuCur.length == 0){
                    this.$data.favouriteMenuCur.push({
                        favouriteName: favourite_Menu
                    })
                    setTimeout(() => {
                    userMenuAdded.update({
                        favouriteMenu: this.$data.favouriteMenuCur
                    })    
                    }, 300);
                } else {
                    for (var x in this.$data.favouriteMenuCur){
                    if(this.$data.favouriteMenuCur[x].Name != favourite_Menu){
                        if(this.$data.favouriteMenuCur.length-1 == x){
                            this.$data.favouriteMenuCur.push({
                                favouriteName: favourite_Menu
                            })
                            setTimeout(() => {
                            userMenuAdded.update({
                                favouriteMenu: this.$data.favouriteMenuCur
                            })    
                            }, 300);
                        }
                    } else {
                        console.log("Same name")
                    }
                    }
                }
            }
            this.$data.restaurant_Name = ''
        },
        addedRestaurantList(name){
            this.disableBtn()
            var checkduplicateName = false;
            this.$data.restaurant_Name = name
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
                console.log("First Time")
                setTimeout(() => {
                        this.$data.dataRestaurant_List.push({
                            Name: this.$data.restaurant_Name,
                        })
                        this.$data.restaurant_Name = ''
                    }, 500);

                this.$data.restaurant_List.push({
                    Name: this.$data.restaurant_Name,
                    Id: this.$data.restaurant_ID++
                })
                console.log(this.$data.restaurant_ID)

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
                
                if(checkduplicateName == false){
                    this.$data.restaurant_List.push({
                    Name: this.$data.restaurant_Name,
                    Id: this.$data.restaurant_ID++,
                    })


                    setTimeout(() => {
                    this.$data.dataRestaurant_List.push({
                    Name: this.$data.restaurant_Name,
                    })
                    this.restaurant_Name = ''   
                    }, 200);

                    

                }
            }

            setTimeout(() => {
                userMenuAdded.update({
                    menu: this.$data.dataRestaurant_List
                })
            }, 500);
            
        },
        removeRestaurantName(index){
            for (var x in this.$data.restaurant_List){
                if(this.$data.restaurant_List[x].Name == index){
                    this.$data.restaurant_List.splice(x, 1)
                }
            }
        },
        removeFavouriteMenu(index) {
            for (var x in this.$data.favouriteMenuCur){
                if(this.$data.favouriteMenuCur[x].favouriteName == index){
                    this.$data.favouriteMenuCur.splice(x, 1)
                }
            }

            var userMenuAdded = firebaseApp.collection("usersChoosingMenu").doc(this.$data.userEmail)
            userMenuAdded.update({
                favouriteMenu: this.$data.favouriteMenuCur
            })

        },
        randomRestaurant(num){
            this.$data.suggestion_restaurant = this.$data.restaurant_List[Math.floor(Math.random()*num)].Name
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
            var userDataFBMenu
            var userDataFBFav
            var userDataFBLastPick
            userInputData.get().then(function(doc) {
                if(doc.exists){
                    userDataFBMenu = doc.data().menu
                    userDataFBFav = doc.data().favouriteMenu
                    userDataFBLastPick = doc.data().lastThreePick
                } else {
                    console.log("No Doc")
                }
            })

            setTimeout(() => {
                if(userDataFBMenu != null ){
                    //this.$data.restaurant_List = userDataFB
                    this.$data.dataRestaurant_List = userDataFBMenu
                    this.$data.favouriteMenuCur = userDataFBFav
                    this.$data.lastPicks = userDataFBLastPick
                } else {
                    this.$data.restaurant_List = []
                    this.$data.dataRestaurant_List = []
                    this.$data.favouriteMenuCur = []
                }
            }, 1500);
                
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
                    //console.log("user not login")
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
            this.loadData()
            this.setUpMenu()
        }, 1000);
    }
}
</script>


<style scoped>



</style>
