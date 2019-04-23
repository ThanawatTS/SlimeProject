<template>
    <div id="signup">
        <main>
        <v-container fill-height>
            <v-layout row wrap align-center>
                <v-flex class="text-xs-center">
                    <h1>Sign Up</h1>
                    <form>
                        <div class = "sign-up">
                            <v-text-field label="Email" type="text" id="userNameInput" v-model="username"></v-text-field>
                        </div>
                        <div class = "sign-up">
                            <v-text-field label="Password" type="password" id="passwordInput"  v-model="password"></v-text-field>
                        </div>
                        <p>Already Have account ? <router-link @click.native="Signin" to="/signin">Signin</router-link></p>
                        <v-btn round color="primary" dark v-on:click="signupAccount">Sign Up</v-btn>
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
var userChoosingEmail = firebaseApp.collection("usersChoosingMenu")

export default {
    name: 'signup',
    data() {
        return {
            username: '',
            password: '',
        }
    },
    methods: {
        signupAccount: function() {
            firebase.auth().createUserWithEmailAndPassword(this.username, this.password)
            .then( user => {
                alert('Account created successful!');
                console.log('register');
                var setEmailToLWC = this.username.toLowerCase();
                emailDB.doc(setEmailToLWC).set({
                role: "newUser",
                newUser: true
            })
            
            userChoosingEmail.doc(setEmailToLWC).set({
                menu: [],
                lastThreePick: [],
                favouriteMenu: []
            })

                this.$router.push('/signin');
            },
            err => {
                alert(err.message);
                console.log("Can't created account");
            });
            
        }
    }
}
</script>

<style scoped>

    #signup {
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>
