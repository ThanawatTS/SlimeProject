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

                
            </v-flex>

        </v-container>

    </div>
</template>


<script>
import firebaseApp from './firebaseInit';
var UserTest = firebaseApp.collection("users").doc("2");
export default {
    name: 'suggestion',
    data () {
        return {
            restaurant_Name: '',
            restaurant_List: [],
            restaurant_ID: 1,
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
                this.restaurant_List.push({
                id: this.restaurant_ID++,
                Name: this.restaurant_Name
                })
                this.restaurant_Name = ''
            } else {
                for(var x in this.restaurant_List){
                    if(name == this.$data.restaurant_List[x].Name){
                        this.restaurant_Name = ''
                        checkduplicateName = true;
                        this.$data.seen = true;
                        setTimeout(() => {
                            this.$data.seen = false;
                            }, 2000);
                    }
                }

                if(checkduplicateName == false){
                this.restaurant_List.push({
                    id: this.restaurant_ID++,
                    Name: this.restaurant_Name
                    })
                this.restaurant_Name = ''
                
                }
            }

            

            UserTest.set({
                name: "One",
                menu: this.$data.restaurant_List
            })
        },
        removeRestaurantName(index){
            this.restaurant_List.splice(index,1)
            UserTest.update({
                menu: this.$data.restaurant_List
            })
        },
        randomRestaurant(num){
            this.$data.suggestion_restaurant = this.$data.restaurant_List[Math.floor(Math.random()*num)].Name
            setTimeout(() => {
                this.$data.suggestion_restaurant = ''
            }, 2000);
        }
        
    }
}
</script>


<style scoped>



</style>
