<template>

    <div id="signup">
        <h1>signup</h1>
        <form>
        <div class = "sign-up">
            <input type="text" id="userNameInput" v-model="username">
        </div>
        <div class = "sign-up">
            <input type="password" id="passwordInput"  v-model="password">
        </div>
        <button v-on:click="addNewUser">Sign Up </button>
        </form>
    </div>
</template>

<script>

import firebase from './firebaseInit';

export default {
    name: 'signUp',
    data () {
        return {
           
            username: '',
            password: ''
            
        }
    },
    methods: {
        addNewUser: function() {
            firebase.auth().createUserWithEmailAndPassword(this.username, this.password)
            .then( user => {
                alert('Account created successful!');
                this.$router.push('/dashboard');
            },
            err => {
                alert(err.message);
            });
            
            console.log('register');
                
        }
    }
   
}

</script>