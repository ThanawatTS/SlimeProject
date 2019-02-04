<template>
    <div id="signin">
        <h1>Sign In</h1>
        <form>
        <div class = "sign-in">
            <v-flex xs12 sm6 md3>
            <v-text-field label="Username" type="text" id="userNameInput" v-model="username"></v-text-field>
            </v-flex>
        </div>
        <div class = "sign-in">
            <v-flex xs12 sm6 md3>
            <v-text-field label="Password" type="password" id="passwordInput"  v-model="password"></v-text-field>
            </v-flex>
        </div>
        <v-btn color="info" v-on:click="signInAccount"> Sign In </v-btn>
        </form>
    </div>
</template>

<script>
import firebase from 'firebase';

export default {
    name: 'signin',
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        signInAccount: function() {
            firebase.auth().signInWithEmailAndPassword(this.username, this.password)
            .then( user => {
                alert('Login successful!');
                console.log('Login Successful');
                this.$router.push('/maps');
            },
            err => {
                alert(err.message);
                console.log('Login Fail');
            });
        }
    }
}
</script>