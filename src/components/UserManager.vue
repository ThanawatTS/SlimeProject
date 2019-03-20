<template>
    <div id="usermanager">
        <h1>Usermanager</h1>
        <v-btn color="info" @click="claimTobeOwner"> Restuarant Owner</v-btn>
        <v-btn color="error" @click="claimTobeCustomer"> Customer </v-btn>
    </div>
</template>
 
<script>
import firebase from 'firebase';


export default {
    name: 'usermanager',
    data () {
        return {
        }
    },
    methods: {
        claimTobeOwner(){

        },
        claimTobeCustomer(){

        }
    },
    beforeMount() {
        this.checkUserrole()
    }
}
</script>
