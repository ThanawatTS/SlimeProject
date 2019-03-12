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

                <v-btn v-on:click="checkdata">checked</v-btn>

            </v-flex>

        </v-container>

    </div>
</template>


<script>
import firebaseApp from './firebaseInit';
import { error } from 'util';
const UserTest = firebaseApp.collection("users").doc("1")
var test
export default {
    name: 'suggestion',
    data () {
        return {
            restaurant_Name: '',
            restaurant_List: [],
            dataRestaurant_List: [],
            emptyName: '',
            suggestion_restaurant: '',
            message_duplicatename: 'Already have one',
            seen: false
            
        }
    },
    methods: {
        addedRestaurantList(name){
            var checkduplicateName = false;

            if(this.restaurant_List.length == 0){

                UserTest.get().then(function(doc) {
                if (doc.exists){
                    for (var restaurantList in doc.data().menu){
                        test = doc.data().menu;
                    }

                } else {
                    console.log("No such document!");
                }
                }).catch(function(error){
                console.log("Error getting document: ", error)
                });
                
                if(test == null){
                    setTimeout(() => {
                        this.$data.dataRestaurant_List.push({
                        Name: this.restaurant_Name
                        })
                        this.restaurant_Name = ''   
                    }, 500);
                } else {
                    setTimeout(() => {
                        this.$data.dataRestaurant_List = test
                        this.$data.dataRestaurant_List.push({
                        Name: this.restaurant_Name
                        })
                        this.restaurant_Name = ''   
                    }, 500);
                }
                this.restaurant_List.push({
                    Id: this.restaurant_ID,
                    Name: this.restaurant_Name
                })

            } else {
                for(var x in this.restaurant_List){
                    if(name == this.$data.restaurant_List[x].Name){
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
                    UserTest.set({
                    menu: this.$data.dataRestaurant_List
                    })
            }, 1000);
            
        },
        removeRestaurantName(index){
            this.restaurant_List.splice(index,1)
            // UserTest.update({
            //     menu: this.$data.restaurant_List
            // })
        },
        randomRestaurant(num){
            this.$data.suggestion_restaurant = this.$data.restaurant_List[Math.floor(Math.random()*num)].Name
            setTimeout(() => {
                this.$data.suggestion_restaurant = ''
            }, 2000);
        },
        checkdata(){
            UserTest.get().then(function(doc) {
                if (doc.exists){
                    for (var restaurantList in doc.data().menu){
                        test = doc.data().menu;              
                    }

                } else {
                    console.log("No such document!");
                }
                }).catch(function(error){
                console.log("Error getting document: ", error)
                });

                console.log(test)
        }
    },
    beforeMount(){
        this.checkdata();
    }
}
</script>


<style scoped>



</style>
