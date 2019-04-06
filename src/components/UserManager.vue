<template>
    <div id="usermanager">
        <h1>Usermanager</h1>
        <v-btn color="info" @click="claimTobeOwner"> Restuarant Owner</v-btn>
        <v-btn color="error" @click="claimTobeCustomer"> Customer </v-btn>
        <v-btn color="error" @click="suggestionMenu"> Suggestion Menu </v-btn>
    </div>
</template>
 
<script>
export default {
    name: 'usermanager',
    data () {
        return {
        }
    },
    methods: {
        claimTobeOwner(){
            this.$router.push('/restaurantManagement')
        },
        claimTobeCustomer(){
            this.$router.push('/customerManagement')
        },
        suggestionMenu(){
            this.$router.push('/suggestion')
        }
        
    }
}
</script>
