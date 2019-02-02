<template>

    <div id="signin">
        <h1>Sign In</h1>
        <form>
        <div class = "sign-in">
            <input type="text" id="userNameInput" v-model="username">
        </div>
        <div class = "sign-in">
            <input type="password" id="passwordInput"  v-model="password">
        </div>
        <button v-on:click="signInAccount"> Sign In </button>
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