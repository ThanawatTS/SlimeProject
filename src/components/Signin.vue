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
                    </form>
                </v-flex>
            </v-layout>
        </v-container>
        </main>
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
        signinAccount: function() {
            firebase.auth().signInWithEmailAndPassword(this.username, this.password)
            .then( user => {
                alert('Login successful!');
                console.log('Login Successful');
                this.$router.push('/usermanager');
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
