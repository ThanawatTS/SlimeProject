<template>
    <div id="signup">
        <h1>Sign Up</h1>
        <form>
        <div class = "sign-up">
            <v-flex xs12 sm6 md3>
            <v-text-field label="Email" type="text" id="userNameInput" v-model="username"></v-text-field>
            </v-flex>
        </div>
        <div class = "sign-up">
            <v-flex xs12 sm6 md3>
            <v-text-field label="Password" type="password" id="passwordInput"  v-model="password"></v-text-field>
            </v-flex>
        </div>
        <v-btn color="info" v-on:click="signUpaccount">Sign Up </v-btn>
        </form>
    </div>
</template>

<script>
import firebase from 'firebase';

export default {
    name: 'signup',
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        signUpaccount: function() {
            firebase.auth().createUserWithEmailAndPassword(this.username, this.password)
            .then( user => {
                alert('Account created successful!');
                console.log('register');
                this.$router.push('/');
            },
            err => {
                alert(err.message);
                console.log('Already exist');
            });
        }
    }
}
</script>