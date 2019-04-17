<template>
    <div id="signin">
        <main>
        <v-container fill-height>
            <v-layout row wrap align-center>
                <v-flex class="text-xs-center">
                    <h1>Sign In</h1>
                    <form>
                        <div class = "sign-in">
                            <v-text-field label="Email" type="text" id="userNameInput" v-model="username"></v-text-field>
                        </div>
                        <div class = "sign-in">
                            <v-text-field label="Password" type="password" id="passwordInput"  v-model="password"></v-text-field>
                        </div>
                        <v-btn round color="primary" dark v-on:click="signinAccount">Sign In</v-btn>
                        <v-btn round color="primary" dark v-on:click="signoutAccount">Sign Out</v-btn>
                    </form>
                </v-flex>
            </v-layout>
        </v-container>
        </main>
    </div>
</template>

<script>
import firebase from 'firebase';
import firebaseApp from '../firebase/firebaseInit'

var emailDB = firebaseApp.collection("emailSignupFromWebsite")
export default {
    name: 'signin',
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        signoutAccount(){
            var user = firebase.auth().currentUser;
            if(user){
                firebase.auth().signOut().then(() => {
                    console.log("Signout")
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                console.log("NO LONGER USER")
            }
        },
        signinAccount() {
            var setEmailToLWC = this.username.toLowerCase();
            firebase.auth().signInWithEmailAndPassword(setEmailToLWC, this.password)
            .then( user => {
                alert('Login successful!');
                emailDB.get().then((querySnapshot) =>{
                    querySnapshot.forEach((doc) =>{
                        if(doc.id == setEmailToLWC) {
                            switch(doc.data().role) {
                                case "restaurantOwner":
                                    this.$router.push('/restaurantManagement')
                                    break;
                                case "customer":
                                    this.$router.push('/customerManagement')
                                    console.log("Push to customer")
                                    break;
                                case "newUser":
                                    this.$router.push('/userManager')
                                    console.log("Push to usermanager")
                                    break;
                            }
                        }
                    })
                })
            },
            err => {
                alert(err.message);
                console.log('Login Fail');
            });
        }
    }
}
</script>

<style scoped>

    #signin {
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>
