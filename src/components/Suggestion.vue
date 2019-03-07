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
                            >{{ listName.Name }} {{ listName.id}}</li>

                        </ul>
                        
                    </v-layout>
                </div>
            
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
            emptyName: ''
        }
    },
    methods: {
        addedRestaurantList(){
            this.restaurant_List.push({
                id: this.restaurant_ID++,
                Name: this.restaurant_Name
            })
            this.restaurant_Name = ''
        }
    }
}
</script>


<style scoped>



</style>
