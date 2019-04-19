<template>
    <div id="customerManagement">
        <h1>Customer</h1>
        <v-btn color="blue" @click="suggestionMenu()"> Suggestion Menu </v-btn>
        <v-btn color="red" @click="queuing()"> Que </v-btn>
    </div>
</template>

<script>
import firebase from 'firebase'
import firebaseApp from '../firebase/firebaseInit'

var emailDB = firebaseApp.collection("emailSignupFromWebsite")

export default {
    name: 'customerManagement',
    data() {
        return {
            emailUser: ""
        }
    },
    methods: {
        checkStatus(){
            var user = firebase.auth().currentUser;
                if(user){
                    this.$data.emailUesr = user.email;
                    console.log(this.$data.emailUesr)
                } else {
                    console.log("Didn't login yet")
                }
        },
        suggestionMenu() {
            this.$router.push('/suggestion')
        },
        queuing() {
            this.$router.push('/maps')
        }
    },
    beforeMount(){
        setTimeout(() => {
        this.checkStatus()
        }, 1000);
        
    }
}
</script>