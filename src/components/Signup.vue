<template>

    <div id="signup">
        <h1>Sign Up</h1>
        <form>
        <div class = "sign-up">
            <input type="text" id="userNameInput" v-model="username">
        </div>
        <div class = "sign-up">
            <input type="password" id="passwordInput"  v-model="password">
        </div>
        <button v-on:click="signUpaccount">Sign Up </button>
        </form>
    </div>
</template>

<script>

import firebase from 'firebase';

export default {
    name: 'signup',
    data () {
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