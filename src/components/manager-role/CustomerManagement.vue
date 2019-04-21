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

var emailDB

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

            if(this.$data.emailUesr.slice(0,6) == 'lineid'){
                emailDB = firebaseApp.collection("emailSignupFromLine")
            } else {
                emailDB = firebaseApp.collection("emailSignupFromWebsite")
            }

            let checkNewUser = emailDB.doc(this.$data.emailUesr)
            checkNewUser.get().then((doc) => {
                if(doc.data().newUser == true) {
                    emailDB = firebaseApp.collection("User").doc(this.$data.emailUesr)
                    emailDB.set({
                        Queue: 0,
                        Restaurant: ""
                    })
                    setTimeout(() => {
                        checkNewUser.update({
                            newUser: false
                        })
                    }, 1000);
                } else {
                    console.log("User is not newbie")
                }
            })

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