<template>
    <div>
        
        <v-container fluid>
            <v-flex xs12>
                <div>
                    <v-layout align-center justify-center column fill-height>
                          
                        <form>
                            <label> Add Restaurant List </label><br/>
                            <input v-model="restaurant_Name" id="restaurantName" placeholder="Restaurant Name"><br/>
                            <v-btn small color="primary" v-on:click.prevent="addedRestaurantList" :disabled="restaurant_Name == emptyName">Restaurant Name</v-btn>
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

                <v-btn small color="orange" v-on:click="randomRestaurant(restaurant_List.length)">Random</v-btn>
                <span> Random : {{ suggestion_restaurant }}</span>
                </v-layout>

                
            </v-flex>

        </v-container>

    </div>
</template>


<script>
export default {
    name: 'suggestion',
    data () {
        return {
            restaurant_Name: '',
            restaurant_List: [],
            restaurant_ID: 1,
            emptyName: '',
            suggestion_restaurant: ''
        }
    },
    methods: {
        addedRestaurantList(){
            this.restaurant_List.push({
                id: this.restaurant_ID++,
                Name: this.restaurant_Name
            })
            this.restaurant_Name = ''
        },
        removeRestaurantName(index){
            this.restaurant_List.splice(index,1)
        },
        randomRestaurant(num){
            this.$data.suggestion_restaurant = this.$data.restaurant_List[Math.floor(Math.random()*num)].Name
            console.log(Math.floor(Math.random()*num))
        }
    }
}
</script>


<style scoped>



</style>
